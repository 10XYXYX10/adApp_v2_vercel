//「src/fetches/adFunctions.ts」
import prisma from "@/lib/prisma"
import { AdListAdType, AdListOptionObType, AdListSortType, AdListStatusType, AdType, AdvertisementDetail } from "@/lib/types/ad/adTypes";
import { Advertisement, Prisma } from "@prisma/client"

const fetchCount = process.env.NEXT_PUBLIC_FETCH_COUNT ? Number(process.env.NEXT_PUBLIC_FETCH_COUNT) : 10;

//////////
//■[ 広告データ取得 ]
export async function getAdvertisementData(
    advertiserId: number, 
    adId: number
):Promise<{
    success: boolean
    data: AdvertisementDetail|null
    errMsg: string
}> {
  try {
    const advertisement = await prisma.advertisement.findFirst({
      where: {
        id: adId,
        userId: advertiserId, // 本人の広告のみ取得
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
        // リレーション（mediaFileは各コンポーネントで取得）
        user: {
          select: {
            id: true,
            name: true,
            amount:true,
          }
        }
      }
    })

    return {
        success: true,
        data: advertisement ? {
            ...advertisement,
            adType: advertisement.adType as AdType,  // 型アサーション
            budget: Number(advertisement.budget),   // Decimal → number変換
            remainingBudget: Number(advertisement.remainingBudget),
            user:{
              ...advertisement.user,
              amount: Number(advertisement.user.amount),
            }
        } : null,
        errMsg: '',
    }
  } catch (error) {
    console.error('Advertisement fetch error:', error)
    return {
        success: false,
        data: null,
        errMsg: error instanceof Error ? error.message : 'Advertisement fetch error.',
    }
  }
}


export const getAdList = async({
    search,
    sort,
    adType,
    status,
    page,
    advertiserId,//adminの際は「0」を指定
}:{
    search:string
    sort:AdListSortType
    adType:AdListAdType
    status:AdListStatusType
    page:number
    advertiserId?:number
}):Promise<{
    result:boolean
    message:string
    data?:Advertisement[]
}> =>{
    try{
        //////////
        //■[ Prismaを用いたデート取得のためのパラメータを調整 ]
        let optionOb:AdListOptionObType = {}
        
        //・whereOb
        let whereOb:Prisma.AdvertisementWhereInput = {};
        if(advertiserId){
            whereOb = { 
                ...whereOb,
                userId:advertiserId,
            }
        }
        if(adType){
            whereOb = { 
                ...whereOb,
                adType,
                status,
            }
        }
        if(status){
            whereOb = { 
                ...whereOb,
                status,
            }
        }
        //・search
        if(search){
            //半角スペースで区切って配列化
            let searchList:string[] = search.split(' ');//dangerousCharToSpace(search).trim();
            searchList = searchList.filter((val) => val!=''); 
            //whereOb
            whereOb = {
                ...whereOb,
                AND:searchList.map((search) => ({
                    OR: [
                        { adType:{ contains: search } },
                        { status:{ contains: search } },
                        { targetId:{ contains: search } },
                        { destinationUrl:{ contains: search } },
                    ]
                })) 
            }
        }
        //・sort
        optionOb = {
            ...optionOb,
            orderBy: { createdAt:sort }
        }
        //・optionObにorderBy,skip,takeを追加
        optionOb = {
            ...optionOb,
            where:whereOb,
            skip: Number(fetchCount*(page-1)),
            take: fetchCount+1,
        }

        //////////
        //■[ データ取得 ]
        const paperList = await prisma.advertisement.findMany(optionOb);

        return {
            result:true,
            message:'success',
            data:paperList
        }
    }catch(err){
        const message = err instanceof Error ?  `${err.message}.` : `Internal Server Error.`;
        return {
            result:false,
            message,
        }
    }
};

//////////
//■[ 管理者用広告データ取得 ]
export async function getAdvertisementDataForAdmin(
    adId: number
):Promise<{
    success: boolean
    data: AdvertisementDetail|null
    errMsg: string
}> {
    try {
        const advertisement = await prisma.advertisement.findFirst({
            where: {
                id: adId
                // userId制限を解除（管理者は全広告にアクセス可能）
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
                // リレーション（mediaFileは各コンポーネントで取得）
                user: {
                    select: {
                        id: true,
                        name: true,
                        amount: true,
                    }
                }
            }
        })

        return {
            success: true,
            data: advertisement ? {
                ...advertisement,
                adType: advertisement.adType as AdType,  // 型アサーション
                budget: Number(advertisement.budget),   // Decimal → number変換
                remainingBudget: Number(advertisement.remainingBudget),
                user: {
                    ...advertisement.user,
                    amount: Number(advertisement.user.amount),
                }
            } : null,
            errMsg: '',
        }
    } catch (error) {
        console.error('Admin advertisement fetch error:', error)
        return {
            success: false,
            data: null,
            errMsg: error instanceof Error ? error.message : 'Advertisement fetch error.',
        }
    }
}


//////////
//■[ 広告データ取得 ]
export async function getPriorityAdCount():Promise<{
    success: boolean
    errMsg: string
    priorityAdCount?: number
}> {
  try {
    //PriorityAdの広告数を取得
    const priorityAdCount = await prisma.advertisement.count({
      where:{status:'active'}
    })

    return {
        success: true,
        errMsg: '',
        priorityAdCount,
    }
  } catch (error) {
    console.error('Advertisement fetch error:', error)
    return {
        success: false,
        errMsg: error instanceof Error ? error.message : 'Advertisement fetch error.',
    }
  }
}

