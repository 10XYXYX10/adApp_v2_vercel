'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { AdvertisementDetail } from '@/lib/types/ad/adTypes'
import { getMediaFileData } from '@/actions/ad/adDetailActions'
import { AlertCircle, Loader2, FileImage } from 'lucide-react'

type Props = {
  advertisement: AdvertisementDetail
  isPreview?: boolean
  refreshTrigger?: number
}

type MediaFileData = {
  id: number
  filePath: string
  filePathV2: string | null
  mimeType: string
  fileSize: number
  destination: string
}

export default function OverlayAdContent({ advertisement, isPreview = false, refreshTrigger }: Props) {
  const [mediaFileData, setMediaFileData] = useState<MediaFileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(10)
  const [showCloseButton, setShowCloseButton] = useState(false)
  const [adVisible, setAdVisible] = useState(true)

  const prefixMediaPath = process.env.NEXT_PUBLIC_MEDIA_PATH as string

  // Countdown logic
  useEffect(() => {
    if (!adVisible) return
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000)
      return () => clearTimeout(timer)
    }
    setShowCloseButton(true)
  }, [countdown, adVisible])

  // Fetch media data
  const fetchMediaFileData = async () => {
    if (!advertisement.mediaFileId) {
      setError('メディアファイルが設定されていません')
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const result = await getMediaFileData(advertisement.mediaFileId)
      if (result.success && result.data) setMediaFileData(result.data)
      else setError(result.errMsg || 'メディアファイルの取得に失敗しました')
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期しないエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchMediaFileData() }, [advertisement.mediaFileId, refreshTrigger])

  const handleClose = () => setAdVisible(false)
  const resetAd = () => {
    setCountdown(10)
    setShowCloseButton(false)
    setAdVisible(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4 opacity-100">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-gray-600 text-sm">メディアファイルを取得中...</p>
        </div>
      </div>
    )
  }

  if (error || !mediaFileData) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">メディアファイルを取得できませんでした</h3>
        <p className="text-gray-600 text-center mb-4">{error}</p>
        {advertisement.mediaFileId && (
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <p className="text-sm text-gray-700">メディアファイルID: <span className="font-mono font-medium">{advertisement.mediaFileId}</span></p>
          </div>
        )}
        <button onClick={fetchMediaFileData} className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl">
          <FileImage className="w-4 h-4" /> 再試行
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {isPreview && (
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-200/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-sm">📺</span>
            </div>
            <h4 className="font-bold text-gray-900">オーバーレイ広告プレビュー</h4>
          </div>
          <p className="text-sm text-gray-600">動画プレイヤー上に広告が表示され、10秒間確実に視聴されます。</p>
        </div>
      )}

      <div className="w-full max-w-md mx-auto bg-gray-200 flex flex-col items-center justify-center p-4 rounded-2xl">
        <div className="relative w-full aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-lg">
          {/* controls omitted for brevity */}

          {adVisible && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm">
              <div className="relative w-[74%] h-[74%] bg-white rounded-lg border-4 border-blue-400 shadow-2xl overflow-hidden">
                <a href={advertisement.destinationUrl as string} target='_blank' rel="noopener noreferrer" className="block w-full h-full">
                  <Image src={`${prefixMediaPath}/${mediaFileData.filePath}`} alt="オーバーレイ広告" fill className="object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/images/no-image.png' }} />
                </a>
                {countdown > 0 && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {countdown}
                  </div>
                )}
                {showCloseButton && (
                  <button onClick={handleClose} className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    ×
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {(!adVisible || !countdown) && (
          <button onClick={resetAd} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            広告を再表示
          </button>
        )}
      </div>
    </div>
  )
}
