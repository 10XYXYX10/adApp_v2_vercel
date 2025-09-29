// src/components/ad/detail/AdDetailDataLoader.tsx
import { getAdvertisementData, getAdvertisementDataForAdmin } from '@/dal/ad/adFunctions'

import AdDetailPageClient from './advertiser/AdDetailPageClient'
import AdminReviewPageClient from './admin/AdminAdReviewPageClient'


export default async function AdDetailDataLoader({
    userId, 
    adId, 
    isAdmin, 
}:{
    userId: number
    adId: number
    isAdmin: boolean
}) {
    //////////
    //■[ 広告データ取得 ]
    const { success, data: advertisement, errMsg } = isAdmin 
        ? await getAdvertisementDataForAdmin(adId)
        : await getAdvertisementData(userId, adId)
    if (!success||!advertisement) throw new Error(errMsg ? errMsg : 'The adId is not valid.') // サーバーエラーの場合はthrowしてerror.tsxに委ねる

    //////////
    //■[ 成功時：メインクライアントコンポーネントに渡す ]
    if (isAdmin) {
        return (
            <AdminReviewPageClient
                adminId={userId}
                advertisement={advertisement}
            />
        )
    } else {
        return (
            <AdDetailPageClient
                advertiserId={userId}
                advertisement={advertisement}
            />
        )
    }
}