// src/components/ad/stats/UserStatsDataLoader.tsx
import { getAdStatsData } from '@/dal/ad/adStatsFunctions';
import UserStatsOverview from './UserStatsOverview';

type Props = {
  advertiserId: number //「0」の際は、admin判定
}

export default async function UserStatsDataLoader({ advertiserId }: Props) {
    //////////
    //■[ 今月の統計データ取得 ]
    const {success,data,errMsg} = await getAdStatsData({userId:advertiserId})
    if(!success || !data)throw new Error(errMsg);

    //////////
    //■[ UserStatsOverview表示 ]
    return <UserStatsOverview userId={advertiserId} data={data}/>
}