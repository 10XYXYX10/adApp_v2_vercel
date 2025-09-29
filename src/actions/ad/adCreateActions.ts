'use server'
// src/actions/ad/adCreateActions.ts
import prisma from "@/lib/prisma"
import { saveAccessTokenInCookies, security } from "@/lib/seculity/seculity"
import { generateFileNamePrefix, generateUniqueKey } from "@/lib/functions/generateRandomValueFunctions"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { saveFile } from "@/lib/s3"
import { verifyYouTubeVideo } from "@/lib/youtube/verification"
import { validateSimpleYouTubeId } from "@/lib/seculity/validation"
import { rateLimit } from "@/lib/seculity/upstash"

const movieAppUrl = process.env.NEXT_PUBLIC_MOVIE_APP_URL as string;
const isLocal = process.env.NEXT_PUBLIC_APP_URL==='http://localhost:3000' ? true : false;
const maxSizeJpgPng = 100 * 1024; // 100KB
const maxSizeGif = 4.5 * 1024 * 1024; // 4.5MB
const maxSizeMp4 = 4.5 * 1024 * 1024; // 4.5MB

export const createPriorityAd = async ({
    targetId,
    budget,
}:{
    targetId: number
    budget: number
}): Promise<{
    success: boolean
    errMsg: string
    statusCode: number
    advertisementId?: number
    updatedAmountNumber?: number
}> => {
    try {
        //////////
        //■[ セキュリティー ]
        const { result, data:authUser, message } = await security({readOnly:false})
        if (!result || !authUser) {
            return {
                success: false,
                statusCode: 401,
                errMsg: message,
            }
        }

        //////////
        //■[ formData取得 ]
        //・正規のリクエスト外に備えてバリデーション.正規のリクエストならこの網に掛かるはずがない！故にerrMsgはシンプルに.
        if(targetId<=0 || budget<100 || budget>100000){
            return { success: false, errMsg: 'Bad request error.', statusCode: 400 }
        }
        
        //////////
        //■[ PriorityAdの最大配信数は10件まで ]
        const count = await prisma.advertisement.count({
            where:{
                status:'active'
            },
        });
        if(count>=10)return { success: false, errMsg: '現在、広告枠が埋まっています。', statusCode: 400 }

        //////////
        //■[ ポイント残高確認 ]
        const targetAdvertiser = await prisma.user.findUnique({
            where: {
                id: authUser.id,
                userType: 'advertiser',
                isActive: true,
            },
            select: {
                id: true,
                name: true,
                amount: true,
            }
        });
        if (!targetAdvertiser) return{ success: false, errMsg: 'Advertiser not found or inactive.', statusCode: 401 };
        const currentAmount = Number(targetAdvertiser.amount);
        if(currentAmount<budget)return{ success: false, errMsg: 'Insufficient point balance.', statusCode: 400 }

        //////////
        //■[ 記事存在確認 ]
        try{
            const response = await fetch(`${movieAppUrl}/single/${targetId}`, {
                //method: 'HEAD',
                method: 'GET',
                signal: AbortSignal.timeout(5000)
            })
            if(!response.ok){
                return { 
                    success: false, 
                    errMsg: 'TargetId error. 記事の確認に失敗しました。時間を空けて、もう一度お試し下さい🙇‍♀️', 
                    statusCode: 404
                }
            }
            const text = await response.text()
            // 404ページの特定の文字列をチェック
            //「if (text.includes('404. Not') || text.includes('404 Not Found') || text.includes('404 Not found')) 」647の際、この判定に引っかかってしまった
            if (
                text.includes('<meta property="og:image" content="https://www.echiechitube.net/img/logo.png">') || 
                text.includes('<title>エチエチチューブ')
            ){
            
                return { 
                    success: false, 
                    errMsg: `TargetId error. 入力して頂いたID記事は、存在が確認できません。`, 
                    statusCode: 404
                }
            }
        }catch(err){
            const addErrMsg = isLocal && err instanceof Error ? `${err.message}. ` : '';
            return { 
                success: false, 
                errMsg: `TargetId error. ${addErrMsg}記事の確認に失敗しました。時間を空けて、もう一度お試し下さい🙇‍♀️`, 
                statusCode: 404
            }
        }


        //////////
        //■[ transaction ]
        let newAdvertisementId = 0;
        const uniqueKey = generateUniqueKey('consume');//`${prefix}-${currentDateTime}-${randomSuffix}`
        const updatedAmountNumber = await prisma.$transaction(async (prismaT) => {
            //////////
            //・Advertisement作成
            const newAdvertisement = await prismaT.advertisement.create({
                data: {
                    adType: 'priority',
                    status: 'active',           // 審査不要のため即座にactive
                    verified: true,             // 審査不要のため即座にverified
                    budget: budget,
                    remainingBudget: budget,
                    targetId: targetId.toString(),         // 記事ID
                    destinationUrl: null,       // 優先表示広告は遷移先URL不要
                    userId: authUser.id,
                    verifiedAt: new Date(),
                },
                select: {
                    id: true
                }
            })
            newAdvertisementId = newAdvertisement.id;
            //////////
            //・Point消費記録作成
            await prismaT.point.create({
                data: {
                    type: 'consume',
                    amount: -budget,  // 消費なのでマイナス
                    description: `Priority ad creation - Article ID: ${targetId}`,
                    uniqueKey: uniqueKey,
                    userId: authUser.id,
                }
            })
            //////////
            //・User.amount更新
            const {amount:updatedAmount} = await prismaT.user.update({
                where: { id: authUser.id },
                data: {
                    amount: {
                        decrement: budget  // ポイント残高から予算分を減算
                    },
                    updatedAt: new Date()
                },
                select:{
                    amount:true
                }
            })
            //////////
            //・広告主向け通知作成
            await prismaT.notification.create({
                data: {
                    title:'動画記事優先表示広告が作成されました',
                    description:`記事ID「${targetId}」の優先表示広告が正常に作成され、配信を開始しました。設定予算: ${budget.toLocaleString()}ポイント`,
                    type: 'advertisement',
                    userId:authUser.id,
                }
            })
            //////////
            // ・accessToken更新 
            //    ・mediaFileのデータ削除後に実行する理由: 
            //        - accessToken更新の後に、mediaFileの削除が失敗すると、user.amountの更新はロールバックされるが、accessTokenは更新されたままとなり、齟齬が発生してしまう
            //        - cookieの更新は外部と通信するわけでは無いので、最も失敗確率が低い
            const {result,message} = await saveAccessTokenInCookies({
                ...authUser,
                userType: authUser.userType==='admin' ? 'admin' : 'advertiser',
                amount:Number(updatedAmount)
            });
            if(!result)throw new Error(message);

            return Number(updatedAmount);
        }, {
            maxWait: 10000,  // default: 2000
            timeout: 25000,  // default: 5000
        }).catch((err) => {
            throw err
        })

        //////////
        //■[ return(処理成功) ]
        return {
            success: true,
            errMsg: '',
            statusCode: 200,
            advertisementId: newAdvertisementId,
            updatedAmountNumber,
        }

    } catch (err) {
        let errMsg = err instanceof Error ? err.message : 'Internal Server Error.'
        let statusCode = 500
        if (err instanceof PrismaClientKnownRequestError) {
            if (err.code === 'P2002') {
                errMsg = 'Duplicate constraint violation.'
                statusCode = 409
            } else if (err.code === 'P2025') {
                errMsg = 'Record not found.'
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



export const createOverlayAd = async (
    formData: FormData
): Promise<{
    success: boolean
    errMsg: string
    statusCode: number
    advertisementId?: number
    updatedAmountNumber?: number
}> => {
    try {
        //////////
        //■[ セキュリティー ]
        const { result, data:authUser, message } = await security({readOnly:false})
        if (!result || !authUser) {
            return {
                success: false,
                statusCode: 401,
                errMsg: message,
            }
        }

        //////////
        //■[ formData取得 ]
        const imageFile = formData.get('image') as File
        const destinationUrl = formData.get('destinationUrl') as string
        const budgetStr = formData.get('budget') as string
        // Required validation
        if (!imageFile || !destinationUrl || !budgetStr) {
            return { success: false, errMsg: 'Bad request error.', statusCode: 400 }
        }

        //////////
        // ■[ validation ]
        // ・画像ファイルのバリデーション
        const extension = imageFile.type === 'image/jpeg' ? 'jpg' : imageFile.type === 'image/png' ? 'png' : 'gif';
        if(extension==='gif') {
            if(imageFile.size > maxSizeGif){
                return { success: false, errMsg: 'File size is out of range.', statusCode: 400 }//この網にかかる＝正規リクエスト外なので、messageは雑でOK.
            }
        }else{
            if(imageFile.size > maxSizeJpgPng){
                return { success: false, errMsg: 'File size is out of range.', statusCode: 400 }//この網にかかる＝正規リクエスト外なので、messageは雑でOK.
            }
        }
        if (!['image/jpeg', 'image/png', 'image/gif'].includes(imageFile.type)) {
            return { success: false, errMsg: 'Only JPG, PNG, GIF files are allowed.', statusCode: 400 }
        }
        // ・URL形式チェッ
        try {
            new URL(destinationUrl)
        } catch {
            return { success: false, errMsg: 'Invalid destination URL format.', statusCode: 400 }
        }
        // ・budget（予算）のバリデーション
        const budget = Number(budgetStr)
        if (isNaN(budget) || budget < 100 || budget > 100000) {
            return { success: false, errMsg: 'Budget must be between 100 and 100,000 points.', statusCode: 400 }
        }

        //////////
        //■[ ポイント残高確認 ]
        const targetAdvertiser = await prisma.user.findUnique({
            where: {
                id: authUser.id,
                userType: 'advertiser',
                isActive: true,
            },
            select: {
                id: true,
                name: true,
                amount: true,
            }
        });
        if (!targetAdvertiser) return{ success: false, errMsg: 'Advertiser not found or inactive.', statusCode: 401 };
        const currentAmount = Number(targetAdvertiser.amount);
        if(currentAmount<budget)return{ success: false, errMsg: 'Insufficient point balance.', statusCode: 400 }

        //////////
        // ■[ ファイル名生成 ] 
        const prefix = generateFileNamePrefix()
        const fileName = `${prefix}.${extension}`;
        const directory = `advertiser${authUser.id}/image/`;
        const uploadFilePath = directory+fileName;

        //////////
        //■[ transaction ]
        let newAdvertisementId = 0;
        const uniqueKey = generateUniqueKey('consume');//`${prefix}-${currentDateTime}-${randomSuffix}`
        const updatedAmountNumber = await prisma.$transaction(async (prismaT) => {
            // ・MediaFile作成
            const mediaFile = await prismaT.mediaFile.create({
                data: {
                    filePath: uploadFilePath,
                    mimeType: imageFile.type,
                    fileSize: imageFile.size,
                    userId: authUser.id,
                    destination: 'r2',
                },
                select: {
                    id: true,
                    filePath: true,
                }
            })
            //・Advertisement作成
            const newAdvertisement = await prismaT.advertisement.create({
                data: {
                    adType: 'overlay',
                    status: 'pending',          // 審査必要
                    verified: false,            // 審査待ち
                    budget: budget,
                    remainingBudget: budget,
                    destinationUrl: destinationUrl,
                    userId: authUser.id,
                    mediaFileId: mediaFile.id,
                },
                select: {
                    id: true
                }
            })
            newAdvertisementId = newAdvertisement.id;
            //・Point消費記録作成
            await prismaT.point.create({
                data: {
                    type: 'consume',
                    amount: -budget,
                    description: `Overlay ad creation - URL: ${destinationUrl}`,
                    uniqueKey: uniqueKey,
                    userId: authUser.id,
                }
            })
            //・User.amount更新
            const {amount:updatedAmount} = await prismaT.user.update({
                where: { id: authUser.id },
                data: {
                    amount: {
                        decrement: budget
                    },
                    updatedAt: new Date()
                },
                select:{
                    amount:true
                }
            })
            //・通知作成
            await prismaT.notification.create({
                data: {
                    title:'オーバーレイ広告が作成されました',
                    description:`オーバーレイ広告が正常に作成されました。審査完了後に配信を開始します。設定予算: ${budget.toLocaleString()}ポイント`,
                    type: 'advertisement',
                    userId:authUser.id,
                }
            })
            // ・mediaUpload
            const fileBuffer = Buffer.from(await imageFile.arrayBuffer());
            const saveFileResult = await saveFile({Key: uploadFilePath, Body:fileBuffer});
            if (!saveFileResult.result) throw new Error(`Upload failed: ${saveFileResult.message}`);
            
            //////////
            // ・accessToken更新 
            //    ・mediaFileのデータ削除後に実行する理由: 
            //        - accessToken更新の後に、mediaFileの削除が失敗すると、user.amountの更新はロールバックされるが、accessTokenは更新されたままとなり、齟齬が発生してしまう
            //        - cookieの更新は外部と通信するわけでは無いので、最も失敗確率が低い
            const {result,message} = await saveAccessTokenInCookies({
                ...authUser,
                userType: authUser.userType==='admin' ? 'admin' : 'advertiser',
                amount:Number(updatedAmount)
            });
            if(!result)throw new Error(message);

            return Number(updatedAmount)
        }, {
            maxWait: 10000,
            timeout: 25000,
        }).catch((err) => {
            throw err
        })

        //////////
        //■[ return(処理成功) ]
        return {
            success: true,
            errMsg: '',
            statusCode: 200,
            advertisementId: newAdvertisementId,
            updatedAmountNumber,
        }

    } catch (err) {
        let errMsg = err instanceof Error ? err.message : 'Internal Server Error.'
        let statusCode = 500
        if (err instanceof PrismaClientKnownRequestError) {
            if (err.code === 'P2002') {
                errMsg = 'Duplicate constraint violation.'
                statusCode = 409
            } else if (err.code === 'P2025') {
                errMsg = 'Record not found.'
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



export const createPrerollAd = async (
    formData: FormData
): Promise<{
    success: boolean
    errMsg: string
    statusCode: number
    advertisementId?: number
    updatedAmountNumber?: number
}> => {
    try {
        //////////
        //■[ セキュリティー ]
        const { result, data:authUser, message } = await security({readOnly:false})
        if (!result || !authUser) {
            return {
                success: false,
                statusCode: 401,
                errMsg: message,
            }
        }

        //////////
        //■[ formData取得 ]
        const videoFile = formData.get('video') as File
        const destinationUrl = formData.get('destinationUrl') as string
        const budgetStr = formData.get('budget') as string
        // Required validation
        if (!videoFile || !destinationUrl || !budgetStr) {
            return { success: false, errMsg: 'Bad request error.', statusCode: 400 }
        }

        //////////
        // ■[ validation ]
        // ・動画ファイルのバリデーション
        if (videoFile.size > maxSizeMp4) {
            return { success: false, errMsg: 'Bad request error.', statusCode: 400 }//対象は正規リクエスト外. errMsgは雑に.
        }
        if (videoFile.type !== 'video/mp4') {
            return { success: false, errMsg: 'Bad request error.', statusCode: 400 }//対象は正規リクエスト外. errMsgは雑に.
        }
        // ・URL形式チェック
        try {
            new URL(destinationUrl)
        } catch {
            return { success: false, errMsg: 'Invalid destination URL format.', statusCode: 400 }
        }
        // ・budget（予算）のバリデーション
        const budget = Number(budgetStr)
        if (isNaN(budget) || budget < 100 || budget > 100000) {
            return { success: false, errMsg: 'Budget must be between 100 and 100,000 points.', statusCode: 400 }
        }

        //////////
        // ■[ ポイント残高確認 ]
        const targetAdvertiser = await prisma.user.findUnique({
            where: {
                id: authUser.id,
                userType: 'advertiser',
                isActive: true,
            },
            select: {
                id: true,
                name: true,
                amount: true,
            }
        });
        if (!targetAdvertiser) return{ success: false, errMsg: 'Advertiser not found or inactive.', statusCode: 401 };
        const currentAmount = Number(targetAdvertiser.amount);
        if(currentAmount<budget)return{ success: false, errMsg: 'Insufficient point balance.', statusCode: 400 }

        //////////
        // ■[ ファイル名生成 ] 
        const prefix = generateFileNamePrefix();
        const fileName = `${prefix}.mp4`;
        const directory = `advertiser${authUser.id}/video/`;
        const uploadFilePath = directory+fileName;

        //////////
        // ■[ transaction ]
        let newAdvertisementId = 0;
        const uniqueKey = generateUniqueKey('consume');//`${prefix}-${currentDateTime}-${randomSuffix}`
        const updatedAmountNumber = await prisma.$transaction(async (prismaT) => {
            //////////
            // ・MediaFile作成
            const mediaFile = await prismaT.mediaFile.create({
                data: {
                    filePath: uploadFilePath,
                    mimeType: videoFile.type,
                    fileSize: videoFile.size,
                    userId: authUser.id,
                    destination: 'r2',
                },
                select: {
                    id: true,
                    filePath: true,
                }
            })
            //////////
            //・Advertisement作成
            const newAdvertisement = await prismaT.advertisement.create({
                data: {
                    adType: 'preroll',
                    status: 'pending',
                    verified: false,
                    budget: budget,
                    remainingBudget: budget,
                    destinationUrl: destinationUrl,
                    userId: authUser.id,
                    mediaFileId: mediaFile!.id,
                },
                select: {
                    id: true
                }
            })
            newAdvertisementId = newAdvertisement.id;
            //////////
            //・Point消費記録作成
            await prismaT.point.create({
                data: {
                    type: 'consume',
                    amount: -budget,
                    description: `Preroll ad creation - URL: ${destinationUrl}`,
                    uniqueKey: uniqueKey,
                    userId: authUser.id,
                }
            })
            //////////
            //・User.amount更新
            const {amount:updatedAmount} = await prismaT.user.update({
                where: { id: authUser.id },
                data: {
                    amount: {
                        decrement: budget
                    },
                    updatedAt: new Date()
                },
                select:{
                    amount:true
                }
            })
            //////////
            //・通知作成
            await prismaT.notification.create({
                data: {
                    title:'プレロール広告が作成されました',
                    description:`プレロール広告が正常に作成されました。審査完了後に配信を開始します。設定予算: ${budget.toLocaleString()}ポイント`,
                    type: 'advertisement',
                    userId:authUser.id,
                }
            })
            //////////
            // ・mediaUpload
            const fileBuffer = Buffer.from(await videoFile.arrayBuffer());
            const saveFileResult = await saveFile({Key: uploadFilePath, Body:fileBuffer});
            if (!saveFileResult.result) throw new Error(`Upload failed: ${saveFileResult.message}`);

            //////////
            // ・accessToken更新 
            //    ・mediaUpload追加後に実行する理由: 
            //        - accessToken更新の後に、mediaUploadが失敗すると、user.amountの更新はロールバックされるが、accessTokenは更新されたままとなり、齟齬が発生してしまう
            //        - cookieの更新は外部と通信するわけでは無いので、最も失敗確率が低い
            const {result,message} = await saveAccessTokenInCookies({
                ...authUser,
                userType: authUser.userType==='admin' ? 'admin' : 'advertiser',
                amount:Number(updatedAmount)
            });
            if(!result)throw new Error(message);

            return Number(updatedAmount)
        }, {
            maxWait: 10000,
            timeout: 25000,
        }).catch((err) => {
            throw err
        })


        //////////
        //■[ return(処理成功) ]
        return {
            success: true,
            errMsg: '',
            statusCode: 200,
            advertisementId: newAdvertisementId,
            updatedAmountNumber,
        }

    } catch (err) {
        let errMsg = err instanceof Error ? err.message : 'Internal Server Error.'
        let statusCode = 500
        if (err instanceof PrismaClientKnownRequestError) {
            if (err.code === 'P2002') {
                errMsg = 'Duplicate constraint violation.'
                statusCode = 409
            } else if (err.code === 'P2025') {
                errMsg = 'Record not found.'
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



export const createYouTubeAd = async ({
    youtubeId,
    youtubeType,
    budget,
}:{
    youtubeId: string
    youtubeType: 'youtube-short' | 'youtube-long'
    budget: number
}): Promise<{
    success: boolean
    errMsg: string
    statusCode: number
    advertisementId?: number
    updatedAmountNumber?: number
}> => {
    try {
        //////////
        //■[ セキュリティー ]
        const { result, data:authUser, message } = await security({readOnly:false})
        if (!result || !authUser) {
            return {
                success: false,
                statusCode: 401,
                errMsg: message,
            }
        }

        //////////
        //■[ rateLimit ] ← YouTube Data APIには利用制限がある.何度も更新されれて上限数に達してしまうリスクを回避
        const rateLimitResult = await rateLimit()
        if(!rateLimitResult.success)  return {success:false, errMsg:rateLimitResult.message, statusCode:429};//429 Too Many Requests

        //////////
        //■[ validation ]
        // ・Required validation
        if (!youtubeId || !budget) return { success: false, errMsg: 'Bad request error.', statusCode: 400 };
        // ・budget（予算）のバリデーション
        if (isNaN(budget) || budget < 100 || budget > 100000) {
            return { success: false, errMsg: 'Budget must be between 100 and 100,000 points.', statusCode: 400 }
        }
        // ・ポイント残高確認
        const targetAdvertiser = await prisma.user.findUnique({
            where: {
                id: authUser.id,
                userType: 'advertiser',
                isActive: true,
            },
            select: {
                id: true,
                name: true,
                amount: true,
            }
        });
        if (!targetAdvertiser) return{ success: false, errMsg: 'Advertiser not found or inactive.', statusCode: 401 };
        const currentAmount = Number(targetAdvertiser.amount);
        if(currentAmount<budget)return{ success: false, errMsg: 'Insufficient point balance.', statusCode: 400 }
        // ・YouTube IDのバリデーション
        let strictValidationFlag = true;
        const verificationResult = await verifyYouTubeVideo(youtubeId);
        if (!verificationResult.isValid) {
            if(verificationResult.errMsg.startsWith('catch error')){
                // catch error の場合は一時的エラーとして軽度の審査を実行。
                // より厳格な審査は「src/app/api/ads/youtube/route.ts > PUT」で12時間後に再実行。
                const videoValidation = await validateSimpleYouTubeId(youtubeId)
                if (!videoValidation.exists) {
                    return { success: false, errMsg: 'YouTube video not found or not accessible.', statusCode: 404 }
                }
                strictValidationFlag = false;
            }else{
                return { 
                    success: false, 
                    errMsg: verificationResult.errMsg, 
                    statusCode: 400
                }
            }
        }

        //////////
        //■[ transaction ]
        let newAdvertisementId = 0;
        const uniqueKey = generateUniqueKey('consume');//`${prefix}-${currentDateTime}-${randomSuffix}`
        const verifiedAt = strictValidationFlag ? new Date() : null;
        const updatedAmountNumber = await prisma.$transaction(async (prismaT) => {
            //////////
            //・Advertisement作成
            const newAdvertisement = await prismaT.advertisement.create({
                data: {
                    adType: youtubeType,
                    status: 'active',           // 審査不要のため即座にactive
                    verified: true,             // 審査不要のため即座にverified
                    verifiedAt,                 // 配信時条件で「verifiedAt: { not: null }」.verifyYouTubeVideoの認証未完了の場合は除外される
                    ytVideoCheckedAt:verifiedAt,//「ytVideoCheckedAt:'asc'」とした場合nullが最初にhit
                    budget: budget,
                    remainingBudget: budget,
                    targetId: youtubeId,
                    userId: authUser.id,
                },
                select: {
                    id: true
                }
            })
            newAdvertisementId = newAdvertisement.id;

            //////////
            //・Point消費記録作成
            await prismaT.point.create({
                data: {
                    type: 'consume',
                    amount: -budget,
                    description: `YouTube Short ad creation - Video ID: ${youtubeId}`,
                    uniqueKey: uniqueKey,
                    userId: authUser.id,
                }
            })

            //////////
            //・User.amount更新
            const {amount:updatedAmount} = await prismaT.user.update({
                where: { id: authUser.id },
                data: {
                    amount: {
                        decrement: budget  // ポイント残高から予算分を減算
                    },
                    updatedAt: new Date()
                },
                select:{
                    amount:true
                }
            })

            //////////
            //・通知作成
            await prismaT.notification.create({
                data: {
                    title:'YouTube Short広告が作成されました',
                    description:`YouTube Short広告が正常に作成されました。審査完了後に配信を開始します。動画ID: ${youtubeId}、設定予算: ${budget.toLocaleString()}ポイント`,
                    type: 'advertisement',
                    userId: authUser.id,
                }
            })

            //////////
            // ・accessToken更新 
            //    ・mediaFileのデータ削除後に実行する理由: 
            //        - accessToken更新の後に、mediaFileの削除が失敗すると、user.amountの更新はロールバックされるが、accessTokenは更新されたままとなり、齟齬が発生してしまう
            //        - cookieの更新は外部と通信するわけでは無いので、最も失敗確率が低い
            const {result,message} = await saveAccessTokenInCookies({
                ...authUser,
                userType: authUser.userType==='admin' ? 'admin' : 'advertiser',
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
        //■[ return(処理成功) ]
        return {
            success: true,
            errMsg: '',
            statusCode: 200,
            advertisementId: newAdvertisementId,
            updatedAmountNumber,
        }

    } catch (err) {
        let errMsg = err instanceof Error ? err.message : 'Internal Server Error.'
        let statusCode = 500

        if (err instanceof PrismaClientKnownRequestError) {
            if (err.code === 'P2002') {
                errMsg = 'Duplicate constraint violation.'
                statusCode = 409
            } else if (err.code === 'P2025') {
                errMsg = 'Record not found.'
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
