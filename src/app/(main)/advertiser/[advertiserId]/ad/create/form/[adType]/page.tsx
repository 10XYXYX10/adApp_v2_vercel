// src/app/(main)/advertiser/[advertiserId]/ads/create/form/[adType]/page.tsx
import { redirect } from 'next/navigation'
import { AdType } from '@/lib/types/ad/adTypes'
import PriorityAdCreateForm from '@/components/ad/create/form/PriorityAdCreateForm'
import OverlayAdCreateForm from '@/components/ad/create/form/OverlayAdCreateForm'
import PrerollAdCreateForm from '@/components/ad/create/form/PrerollAdCreateForm'
import YouTubeAdCreateForm from '@/components/ad/create/form/YouTubeAdCreateForm'

// 有効な広告タイプの定義
const validAdTypes: AdType[] = ['priority', 'overlay', 'preroll', 'youtube-short', 'youtube-long']

export default async function AdCreateFormPage({
  params
}: {
  params: Promise<{
    advertiserId: string
    adType: string
  }>
}) {
  const resolvedParams = await params
  const advertiserId = Number(resolvedParams.advertiserId)
  const adType = resolvedParams.adType

  // advertiserIdの検証
  if (!advertiserId || isNaN(advertiserId) || advertiserId <= 0) {
    redirect('/auth/advertiser')
  }

  // adTypeの検証
  if (!validAdTypes.includes(adType as AdType)) {
    throw new Error(`Invalid ad type: ${adType}. Valid types are: ${validAdTypes.join(', ')}`)
  }

return (
  <div className="container mx-auto px-4 py-8 max-w-6xl">
    {/* フォーム表示 */}
    {adType === 'priority' && (
      <PriorityAdCreateForm
        advertiserId={advertiserId}
      />
    )}
    
    {adType === 'overlay' && (
      <OverlayAdCreateForm
        advertiserId={advertiserId}
      />
    )}
    
    {adType === 'preroll' && (
      <PrerollAdCreateForm
        advertiserId={advertiserId}
      />
    )}
    
    {(adType === 'youtube-short' || adType === 'youtube-long') && (
      <YouTubeAdCreateForm
        advertiserId={advertiserId}
        youtubeType={adType}
      />
    )}
  </div>
)
}