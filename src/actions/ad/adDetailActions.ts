'use server'
// src/actions/advertiser/ads/adDetailActions.ts
import { saveAccessTokenInCookies, security } from '@/lib/seculity/seculity'
import { AdType, AdvertisementDetail } from '@/lib/types/ad/adTypes'
import prisma from '@/lib/prisma'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { deleteFile } from '@/lib/s3'
import { Prisma } from '@prisma/client'

const movieAppUrl = process.env.NEXT_PUBLIC_MOVIEAPP_URL as string //https://www.echiechitube.net;


//////////
//■[ 一意キー生成 ]
const generateUniqueKey = (prefix: string): string => {
  const currentDateTime = new Date().getTime()
  const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `${prefix}-${currentDateTime}-${randomSuffix}`
}


//////////
//■[ 1. 広告ステータス更新 ]
export async function updateAdStatus(
  adId: number,
  status: 'active' | 'paused'
): Promise<{
    success: boolean
    errMsg: string
    statusCode: number
    data?: AdvertisementDetail
}> {
  try {
    //////////
    //■[ セキュリティー ]
    const {result, data:user, message: securityMessage} = await security({readOnly:false});
    if(!result || !user) return {success:false, errMsg:securityMessage, statusCode:401};

    //////////
    //■[ バリデーション ]
    if (!adId || adId <= 0) {
      return { success: false, errMsg: 'Invalid advertisement ID.', statusCode: 400 }
    }

    const validStatuses = ['active', 'paused']
    if (!validStatuses.includes(status)) {
      return { success: false, errMsg: 'Invalid status.', statusCode: 400 }
    }

    //////////
    //■[ 広告所有者確認 ]
    const currentAd = await prisma.advertisement.findUnique({
      where:{
        id:adId,
      }
    })
    if(!currentAd) return{ success:false, errMsg:'Not found.' , statusCode: 404 }
    if(user.userType==='advertiser'){
      if(user.id!==currentAd.userId) return{ success:false, errMsg:'Not permission.' , statusCode: 401 }
    }

    //////////
    //■[ ステータス遷移バリデーション ]
    // 却下された広告は変更不可
    if (currentAd.status === 'rejected') {
      return { success: false, errMsg: 'Rejected advertisements cannot be modified.', statusCode: 400 }
    }

    // 下書き・審査中の広告はactiveにできない
    if (status === 'active' && ['draft', 'pending'].includes(currentAd.status)) {
      return { success: false, errMsg: 'Advertisement must be approved before activation.', statusCode: 400 }
    }

    //////////
    //■[ ステータス更新 ]
    const updatedAd = await prisma.advertisement.update({
      where: { id: adId },
      data: {
        status,
        updatedAt: new Date()
      },
      select: {
        id: true,
        adType: true,
        status: true,
        verified: true,
        budget: true,
        remainingBudget: true,
        targetId: true,
        destinationUrl: true,
        mediaFileId: true,
        verifiedAt: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            amount: true,
          }
        }
      }
    })

    //////////
    //■[ adminから更新した際のみ、通知作成 ]
    if(user.userType==='admin'){
      const statusMessages = {
        active: 'を再開しました',
        paused: 'を一時停止しました'
      }

      await prisma.notification.create({
        data: {
          title: `広告ステータスが変更されました`,
          description: `広告ID #${adId} ${statusMessages[status]}。`,
          type: 'advertisement',
          userId: currentAd.userId,
        }
      })
    }

    //////////
    //■[ レスポンス形成 ]
    const responseData: AdvertisementDetail = {
      ...updatedAd,
      adType: updatedAd.adType as AdType,
      budget: Number(updatedAd.budget),
      remainingBudget: Number(updatedAd.remainingBudget),
      user:{
        ...updatedAd.user,
        amount: Number(updatedAd.user.amount)
      }
    }

    return {
      success: true,
      data: responseData,
      errMsg: '',
      statusCode: 200
    }

  } catch (err) {
    let errMsg = err instanceof Error ? err.message : 'Internal Server Error.'
    let statusCode = 500

    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === 'P2025') {
        errMsg = 'Advertisement not found.'
        statusCode = 404
      }
    }

    return {
      success: false,
      errMsg,
      statusCode
    }
  }
}

//////////
//■[ 2. 広告削除 ]
export const deleteAd = async(
    adId:number
): Promise<{
    success: boolean
    errMsg: string
    statusCode: number
    updatedAmount?: number
}> => {
  try{
    //////////
    //■[ セキュリティー ]
    const {result, data:user, message: securityMessage} = await security({readOnly:false});
    if(!result || !user) return {success:false, errMsg:securityMessage, statusCode:401};

    //////////
    // ■[ 存在確認 ]
    const whereOb: Prisma.AdvertisementWhereInput = {id: adId};
    if (user.userType==='advertiser') whereOb.userId = user.id;//advertiser呼び出し時は本人のみ
    const targetAd = await prisma.advertisement.findFirst({
        where:{
            ...whereOb
        },
        select:{
            id: true
        }
    });
    if(!targetAd){
        return {
            success:false,
            errMsg:'Bad request.',
            statusCode:400
        }
    }

    ///////////
    // ■[ 削除 ]
    const updatedAmount:number = await prisma.$transaction(async (prismaT) => {
      //////////
      // 1. Advertiserの削除
      const deleteAd = await prismaT.advertisement.delete({
        where:{
          id:adId
        },
        select:{
          remainingBudget:true,
          mediaFileId:true,
          mediaFile:{
            select:{
              filePath:true,
              filePathV2:true
            }
          }
        }
      });
      //////////
      // 2. user.amount に Advertisement.remainingBudget を 加算
      const {amount:updatedAmount} = await prismaT.user.update({
        where: { id: user.id },
        data: {
          amount: {
            increment: Number(deleteAd.remainingBudget)
          },
          updatedAt: new Date()
        },
        select:{
            amount:true
        }
      });
      //////////
      // 3. Pointにデータ追加
      const uniqueKey = generateUniqueKey('ad-delete');
      await prismaT.point.create({
        data: {
          type: 'refund',
          amount: Number(deleteAd.remainingBudget),
          description: `Advertisement #${adId} deletion refund`,
          uniqueKey,
          userId:user.id,
        }
      });
      //////////
      // 4.関連mediaFileのデータをDB&ストレージから削除
      if(deleteAd.mediaFileId){
        // ・DBのmediaFileを削除
        await prismaT.mediaFile.delete({
          where:{
            id: deleteAd.mediaFileId
          }
        });
        // ・ストレージデータを削除
        if(deleteAd.mediaFile){
          const {result,message} = await deleteFile(deleteAd.mediaFile.filePath);
          if(!result)throw new Error(message);
        }
      }
      //////////
      // 5.accessToken更新 
      //    ・mediaFileのデータ削除後に実行する理由: 
      //        - accessToken更新の後に、mediaFileの削除が失敗すると、user.amountの更新はロールバックされるが、accessTokenは更新されたままとなり、齟齬が発生してします
      //        - cookieの更新は外部と通信するわけでは無いので、最も失敗確率が低い
      const {result,message} = await saveAccessTokenInCookies({
        ...user,
        userType: user.userType==='admin' ? 'admin' : 'advertiser',
        amount:Number(updatedAmount)
      });
      if(!result)throw new Error(message);

      return Number(updatedAmount);
    }, {
      maxWait: 10000,
      timeout: 25000,
    }).catch((err) => {
      throw err
    })

    //////////
    // ■[ Success. ]
    return {
        success: true,
        errMsg: '',
        statusCode:202,
        updatedAmount,
    }
  }catch(err){
      //////////
      // ■[ failed. ]
      return {
          success: false,
          errMsg: err instanceof Error ? err.message : 'Something went wrong.',
          statusCode:500
      }
  }
}

//////////
//■[ 2. 広告予算更新 ]
export async function updateAdBudget(
  adId: number,
  operation: 'add' | 'subtract',
  amount: number
): Promise<{
  success: boolean
  statusCode: number
  errMsg: string
  data?: AdvertisementDetail
}> {
  try {
    //////////
    //■[ セキュリティー ]
    const {result:seculityResult, data:authUser, message: securityMessage} = await security({readOnly:false});
    if(!seculityResult || !authUser) return {success:false, errMsg:securityMessage, statusCode:401};

    //////////
    //■[ バリデーション ]
    if (!adId || adId <= 0) {
      return { success: false, errMsg: 'Invalid advertisement ID.', statusCode: 400 }
    }

    if (!['add', 'subtract'].includes(operation)) {
      return { success: false, errMsg: 'Invalid operation.', statusCode: 400 }
    }

    if (!amount || amount <= 0 || amount > 100000) {
      return { success: false, errMsg: 'Amount must be between 1 and 100,000 points.', statusCode: 400 }
    }

    //////////
    //■[ 広告所有者確認 ]
    const currentAd = await prisma.advertisement.findUnique({
      where:{
        id:adId,
      }
    })
    if(!currentAd) return{ success:false, errMsg:'Not found.' , statusCode: 404 }
    if(authUser.userType==='advertiser'){
      if(authUser.id!==currentAd.userId) return{ success:false, errMsg:'Not permission.' , statusCode: 401 }
    }

    //////////
    //■[ 削除済み・却下済み広告の変更防止 ]
    if (['deleted', 'rejected'].includes(currentAd.status)) {
      return { success: false, errMsg: 'Cannot modify budget for deleted or rejected advertisements.', statusCode: 400 }
    }

    //////////
    //■[ ユーザーのポイント残高確認（追加の場合） ]
    if (operation === 'add') {
      const user = await prisma.user.findUnique({
        where: { id: authUser.id },
        select: { amount: true }
      })
      if (!user) return { success: false, errMsg: 'User not found.', statusCode: 404 }
      const userBalance = Number(user.amount)
      if (userBalance < amount) return { success: false, errMsg: 'Insufficient point balance.', statusCode: 400 }
    }

    //////////
    //■[ トランザクション処理 ]
    const uniqueKey = generateUniqueKey(operation === 'add' ? 'budget-add' : 'budget-subtract')
    
    const result = await prisma.$transaction(async (prismaT) => {
      //////////
      //・最新の広告情報を取得
      const latestAd = await prismaT.advertisement.findUnique({
        where: { id: adId },
        select: {
          budget: true,
          remainingBudget: true
        }
      })
      if (!latestAd) throw new Error('Advertisement not found during transaction.')

      //////////
      //・予算計算と調整
      const currentBudget = Number(latestAd.budget)
      const currentRemaining = Number(latestAd.remainingBudget)
      
      let newBudget: number
      let newRemainingBudget: number
      let actualAmount: number

      if (operation === 'add') {
        newBudget = currentBudget + amount
        newRemainingBudget = currentRemaining + amount
        actualAmount = amount
      } else {
        // 減算時：残予算がマイナスにならないよう調整
        actualAmount = Math.min(amount, currentRemaining)
        newBudget = currentBudget - actualAmount
        newRemainingBudget = Math.max(0, currentRemaining - actualAmount)
      }

      //////////
      //・Advertisement更新
      const updatedAd = await prismaT.advertisement.update({
        where: { id: adId },
        data: {
          budget: newBudget,
          remainingBudget: newRemainingBudget,
          updatedAt: new Date()
        },
        select: {
          id: true,
          adType: true,
          status: true,
          verified: true,
          budget: true,
          remainingBudget: true,
          targetId: true,
          destinationUrl: true,
          mediaFileId: true,
          verifiedAt: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              name: true,
              amount: true,
            }
          }
        }
      })

      //////////
      //・Point履歴作成
      await prismaT.point.create({
        data: {
          type: operation === 'add' ? 'consume' : 'refund',
          amount: operation === 'add' ? -actualAmount : actualAmount,
          description: `Budget ${operation} for advertisement #${adId}`,
          uniqueKey,
          userId: authUser.id,
        }
      })

      //////////
      //・User.amount更新（追加の場合は減算、減算の場合は加算）
      const {amount:updatedAmount} = await prismaT.user.update({
        where: { id: authUser.id },
        data: {
          amount: {
            increment: operation === 'add' ? -actualAmount : actualAmount
          },
          updatedAt: new Date()
        },
        select:{
          amount:true
        }
      })
      updatedAd.user.amount = updatedAmount;

      //////////
      // ・accessToken更新
      const {result,message} = await saveAccessTokenInCookies({
        ...authUser,
        userType: authUser.userType==='admin' ? 'admin' : 'advertiser',
        amount:Number(updatedAmount)
      });
      if(!result)throw new Error(message);

      return updatedAd
    }, {
      maxWait: 10000,
      timeout: 25000,
    }).catch((err) => {
      throw err
    })

    //////////
    //■[ レスポンス形成 ]
    const responseData: AdvertisementDetail = {
      ...result,
      adType: result.adType as AdType,
      budget: Number(result.budget),
      remainingBudget: Number(result.remainingBudget),
      user:{
        ...result.user,
        amount: Number(result.user.amount)
      }
    }

    return {
      success: true,
      data: responseData,
      errMsg: '',
      statusCode: 200
    }

  } catch (err) {
    let errMsg = err instanceof Error ? err.message : 'Internal Server Error.'
    let statusCode = 500

    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === 'P2025') {
        errMsg = 'Advertisement not found.'
        statusCode = 404
      } else if (err.code === 'P2002') {
        errMsg = 'Duplicate operation detected.'
        statusCode = 409
      }
    }

    return {
      success: false,
      errMsg,
      statusCode
    }
  }
}

//////////
//■[ 3. 広告詳細取得（リフレッシュ用） ]
export async function getAdDetail(adId: number): Promise<{
    success: boolean
    statusCode: number
    errMsg: string
    data?: AdvertisementDetail
}> {
  try {
    //////////
    //■[ セキュリティー ]
    const {result:seculityResult, data:authUser, message: securityMessage} = await security({readOnly:false});
    if(!seculityResult || !authUser) return {success:false, errMsg:securityMessage, statusCode:401};

    //////////
    //■[ バリデーション ]
    if (!adId || adId <= 0) {
      return { success: false, errMsg: 'Invalid advertisement ID.', statusCode: 400 }
    }

    //////////
    //■[ 広告取得 ]
    const advertisement = await prisma.advertisement.findFirst({
      where: {
        id: adId,
        userId: authUser.id
      },
      select: {
        id: true,
        adType: true,
        status: true,
        verified: true,
        budget: true,
        remainingBudget: true,
        targetId: true,
        destinationUrl: true,
        mediaFileId: true,
        verifiedAt: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            amount: true,
          }
        }
      }
    })
    if (!advertisement) return { success: false, errMsg: 'Advertisement not found.', statusCode: 404 }


    //////////
    //■[ レスポンス形成 ]
    const responseData: AdvertisementDetail = {
      ...advertisement,
      adType: advertisement.adType as AdType,
      budget: Number(advertisement.budget),
      remainingBudget: Number(advertisement.remainingBudget),
      user:{
        ...advertisement.user,
        amount: Number(advertisement.user.amount)
      }
    }

    return {
      success: true,
      data: responseData,
      errMsg: '',
      statusCode: 200
    }

  } catch (err) {
    return {
      success: false,
      errMsg: err instanceof Error ? err.message : 'Internal Server Error.',
      statusCode: 500
    }
  }
}


//////////
//■[ movieAppメタ情報取得 ]
export async function getMovieAppMetadata(
    articleId: string
): Promise<{
    success: boolean
    data: {
        title: string
        imageUrl: string
        articleUrl: string
    } | null
    errMsg: string
}> {
    try {
        //////////
        //■[ URL構築 ]
        const targetUrl = `${movieAppUrl}/single/${articleId}`;

        //////////
        //■[ HTMLフェッチ ]
        // ## AbortController:
        //   - fetch() リクエストを途中で「キャンセル（中断）」できる仕組み。
        //   - controller.signal を fetch() に渡すことで、外部から中断できるようになります。
        //   - 今回の場合、setTimeoutで10秒後に自動中断
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10秒タイムアウト

        const response = await fetch(targetUrl, {
            method: 'GET',
            headers: {
                'User-Agent': 'AdService/1.0 (+https://adservice.example.com/bot)',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'ja,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate',
                'Cache-Control': 'no-cache',
            },
            signal: controller.signal,
        })
        clearTimeout(timeoutId)

        //////////
        //■[ レスポンスチェック ]
        if (!response.ok) {
            if (response.status === 404) {
                return {
                    success: false,
                    data: null,
                    errMsg: 'Article not found.'
                }
            }
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        //////////
        //■[ HTMLパース ]
        const html = await response.text()

        //////////
        //■[ メタタグ抽出 ]
        //・title抽出
        const titleMatch = html.match(/<meta\s+property="og:title"\s+content="([^"]*)"[^>]*>/i) ||
                          html.match(/<title[^>]*>([^<]*)<\/title>/i)
        const title = titleMatch ? titleMatch[1].trim() : `記事 #${articleId}`

        //・画像URL抽出
        const imageMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]*)"[^>]*>/i) ||
                          html.match(/<meta\s+name="twitter:image"\s+content="([^"]*)"[^>]*>/i)
        let imageUrl = imageMatch ? imageMatch[1].trim() : ''

        //////////
        //■[ 画像URL正規化 ]
        if (imageUrl) {
            //・相対URLの場合は絶対URLに変換
            if (imageUrl.startsWith('/')) {
                const baseUrl = new URL(movieAppUrl)
                imageUrl = `${baseUrl.protocol}//${baseUrl.host}${imageUrl}`
            } else if (imageUrl.startsWith('./')) {
                imageUrl = `${movieAppUrl.replace(/\/$/, '')}/${imageUrl.substring(2)}`
            } else if (!imageUrl.startsWith('http')) {
                imageUrl = `${movieAppUrl.replace(/\/$/, '')}/${imageUrl}`
            }
        } else {
            //・フォールバック画像（デフォルト画像）
            imageUrl = `${movieAppUrl.replace(/\/$/, '')}/images/default-thumbnail.jpg`
        }

        //////////
        //■[ 結果返却 ]
        return {
            success: true,
            data: {
                title: title || `記事 #${articleId}`,
                imageUrl,
                articleUrl: targetUrl
            },
            errMsg: ''
        }

    } catch (err) {
        //////////
        //■[ エラーハンドリング ]
        let errMsg = 'Failed to fetch article metadata.'
        
        if (err instanceof Error) {
            if (err.name === 'AbortError') {
                errMsg = 'Request timeout: Article metadata fetch took too long.'
            } else if (err.message.includes('fetch')) {
                errMsg = 'Network error: Unable to connect to movieApp.'
            } else {
                errMsg = err.message
            }
        }

        console.error('MovieApp metadata fetch error:', err)

        return {
            success: false,
            data: null,
            errMsg
        }
    }
}

//////////
//■[ MediaFile情報取得 ]
export async function getMediaFileData(
    mediaFileId: number
): Promise<{
    success: boolean
    data: {
        id: number
        filePath: string
        filePathV2: string | null
        mimeType: string
        fileSize: number
        destination: string
    } | null
    errMsg: string
}> {
    try {
        //////////
        //■[ MediaFile取得 ]
        const mediaFile = await prisma.mediaFile.findUnique({
            where: {
                id: mediaFileId
            },
            select: {
                id: true,
                filePath: true,
                filePathV2: true,
                mimeType: true,
                fileSize: true,
                destination: true
            }
        })

        //////////
        //■[ 存在チェック ]
        if (!mediaFile) {
            return {
                success: false,
                data: null,
                errMsg: 'Media file not found.'
            }
        }

        //////////
        //■[ 結果返却 ]
        return {
            success: true,
            data: {
                id: mediaFile.id,
                filePath: mediaFile.filePath,
                filePathV2: mediaFile.filePathV2,
                mimeType: mediaFile.mimeType,
                fileSize: mediaFile.fileSize,
                destination: mediaFile.destination
            },
            errMsg: ''
        }

    } catch (err) {
        //////////
        //■[ エラーハンドリング ]
        console.error('MediaFile fetch error:', err)
        
        return {
            success: false,
            data: null,
            errMsg: err instanceof Error ? err.message : 'MediaFile fetch error.'
        }
    }
}