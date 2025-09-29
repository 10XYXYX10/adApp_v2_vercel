// src/app/(main)/advertiser/[advertiserId]/point/purchase/success/page.tsx
import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import PaymentSuccessSkelton from '@/components/point/advertiser/purchase/success/PaymentSuccessSkelton'
import PaymentSuccessData from '@/components/point/advertiser/purchase/success/PaymentSuccessData'

export default async function PaymentSuccessPage({
    params,
    searchParams
}: {
  params: Promise<{
    advertiserId: string
  }>
  searchParams: Promise<{
    paymentId?: string
  }>
}) {
    const resolvedParams = await params
    const resolvedSearchParams = await searchParams
    const advertiserId = Number(resolvedParams.advertiserId)
    const paymentId = Number(resolvedSearchParams.paymentId)
    if (
        !advertiserId || isNaN(advertiserId) || advertiserId < 0 ||
        !paymentId || isNaN(paymentId) || paymentId <= 0 
    ) redirect('/auth/advertiser');


    return (
    <Suspense fallback={<PaymentSuccessSkelton />}>
        <PaymentSuccessData
            advertiserId={advertiserId}
            paymentId={paymentId}
        />
    </Suspense>
    )
}
