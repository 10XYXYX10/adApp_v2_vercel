// src/components/ads/create/selectType/AdCreateSelectTypeData.tsx
import { getPriorityAdCount } from '@/dal/ad/adFunctions';
import AdCreateSelectTypeClient from './AdCreateSelectTypeClient';

export default async function AdCreateSelectTypeData({
  advertiserId
}: {
  advertiserId: number
}){
  const {success,errMsg,priorityAdCount} = await getPriorityAdCount();
  if(!success || priorityAdCount===undefined )throw new Error(errMsg?errMsg:"Something went wrong.");


  // メインクライアントコンポーネントに渡す
  return (
    <AdCreateSelectTypeClient 
      advertiserId={advertiserId}
      priorityAdCount={priorityAdCount}
    />
  )
}