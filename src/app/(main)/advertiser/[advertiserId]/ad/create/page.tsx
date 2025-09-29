// src/app/(main)/advertiser/[advertiserId]/ads/create/page.tsx
import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import AdCreateSelectTypeSkelton from '@/components/ad/create/selectType/AdCreateSelectTypeSkelton'
import AdCreateSelectTypeData from '@/components/ad/create/selectType/AdCreateSelectTypeData'

export default async function AdCreatePage({
  params 
}: {
  params: Promise<{
    advertiserId: string
  }>
}) {
  const resolvedParams = await params
  const advertiserId = Number(resolvedParams.advertiserId)

  // advertiserId validation
  if (!advertiserId || isNaN(advertiserId) || advertiserId <= 0)redirect('/auth/advertiser');

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* データローダーをSuspenseでラップ */}
      <Suspense fallback={<AdCreateSelectTypeSkelton />}>
        <AdCreateSelectTypeData advertiserId={advertiserId} />
      </Suspense>
    </div>
  )
}