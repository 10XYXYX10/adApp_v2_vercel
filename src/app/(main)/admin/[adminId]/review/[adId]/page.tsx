// src/app/(main)/admin/[adminId]/review/[adId]/page.tsx
import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import AdDetailDataLoader from '@/components/ad/detail/AdDetailDataLoader'
import AdDetailSkeleton from '@/components/ad/detail/AdDetailSkeleton'

type Props = {
    params: Promise<{
        adminId: string
        adId: string
    }>
}

export default async function AdminReviewDetailPage({ params }: Props) {
    const { adminId, adId } = await params
    const adminIdNum = Number(adminId)
    const adIdNum = Number(adId)
    if (!adminIdNum || isNaN(adminIdNum) || adminIdNum <= 0) redirect('/auth/admin');

  //////////
  //■[ パラメータバリデーション ]
  if (!adminIdNum || adminIdNum <= 0) redirect('/auth/admin')
  if (!adIdNum || adIdNum <= 0) redirect(`/admin/${adminId}/review`)

  return (
    <Suspense fallback={<AdDetailSkeleton />}>
      <AdDetailDataLoader 
        userId={adminIdNum}
        adId={adIdNum}
        isAdmin={true}
      />
    </Suspense>
  )
}