// src/lib/youtube/verification.ts
import { google } from 'googleapis'

const youtube = google.youtube({
    version: 'v3',
    auth: process.env.YOUTUBE_API_KEY
})

export type YouTubeVerificationResult = {
    isValid: boolean // Valid=有効
    errMsg: string
    details?: {
        title: string
        duration: string
        isPublic: boolean
        hasAgeRestriction: boolean
        hasRegionRestriction: boolean
        isEmbeddable: boolean
    }
}

//////////
//■[ YouTube動画検閲 ]
export const verifyYouTubeVideo = async (
    youtubeId: string
): Promise<YouTubeVerificationResult> => {
    try {
        //////////
        //■[ バリデーション ]
        if (!youtubeId || typeof youtubeId !== 'string') {
            return {
                isValid: false,
                errMsg: 'Invalid YouTube ID'
            }
        }

        // YouTube ID形式チェック（11文字の英数字とハイフン、アンダースコア）
        const youtubeIdRegex = /^[a-zA-Z0-9_-]{11}$/
        if (!youtubeIdRegex.test(youtubeId)) {
            return {
                isValid: false,
                errMsg: 'Invalid YouTube ID format'
            }
        }

        //////////
        //■[ YouTube Data API呼び出し ]
        const response = await youtube.videos.list({
            part: ['snippet', 'contentDetails', 'status'],
            id: [youtubeId]
        })

        //////////
        //■[ 動画存在チェック ]
        if (!response.data.items || response.data.items.length === 0) {
            return {
                isValid: false,
                errMsg: 'Video not found or has been deleted'
            }
        }

        const video = response.data.items[0]
        const snippet = video.snippet! //snippet=欠片,断片
        const contentDetails = video.contentDetails!
        const status = video.status!

        //////////
        //■[ 検閲チェック ]
        const checks = {
            // 公開状態チェック（publicのみ許可）
            isPublic: status.privacyStatus === 'public',
            
            // 年齢制限チェック
            hasAgeRestriction: !!(contentDetails.contentRating?.ytRating),
            
            // 地域制限チェック（日本で視聴可能か）
            hasRegionRestriction: !!(
                contentDetails.regionRestriction?.blocked?.includes('JP') ||
                (contentDetails.regionRestriction?.allowed && 
                 !contentDetails.regionRestriction.allowed.includes('JP'))
            ),
            
            // 埋め込み可能チェック
            isEmbeddable: status.embeddable !== false,
            
            // アップロード完了チェック
            isProcessed: status.uploadStatus === 'processed'//processed=処理済み
        }

        //////////
        //■[ 総合判定 ]
        const isValid = checks.isPublic && 
                       !checks.hasAgeRestriction && 
                       !checks.hasRegionRestriction && 
                       checks.isEmbeddable && 
                       checks.isProcessed

        //////////
        //■[ エラーメッセージ生成 ]
        let errMsg = ''
        if (!isValid) {
            const errors = []
            if (!checks.isPublic) errors.push('Video is private')
            if (checks.hasAgeRestriction) errors.push('Age-restricted content')
            if (checks.hasRegionRestriction) errors.push('Region-restricted in Japan')
            if (!checks.isEmbeddable) errors.push('Embedding disabled')
            if (!checks.isProcessed) errors.push('Video processing incomplete')
            errMsg = errors.join(', ')
        }

        //////////
        //■[ 返却 ]
        return {
            isValid, //success＆isVaildがtrueの場合にのみ、承認
            errMsg: isValid ? '' : errMsg,
            details: {
                title: snippet.title || 'Unknown Title',
                duration: contentDetails.duration || 'Unknown',
                isPublic: checks.isPublic,
                hasAgeRestriction: checks.hasAgeRestriction,
                hasRegionRestriction: checks.hasRegionRestriction,
                isEmbeddable: checks.isEmbeddable
            }
        }

    } catch (err) {
        console.error('YouTube verification error:', err)
        // API quota制限エラー
        if (err instanceof Error && err.message.includes('quotaExceeded')) {
            return {
                isValid: false,
                errMsg: 'catch error: YouTube API quota exceeded. Please try again later.'
            }
        }
        // その他のエラー
        const errMessage = err instanceof Error ? err.message : 'Internal Server Error'
        return {
            isValid: false,
            errMsg: `catch error: ${errMessage}`
        }
    }
}

//////////
//■[ 複数動画の一括検閲 ]
// export const verifyMultipleYouTubeVideos = async (
//     youtubeIds: string[]
// ): Promise<YouTubeVerificationResult[]> => {
//     try {
//         // YouTube API は最大50件まで一括取得可能
//         const batchSize = 50
//         const results: YouTubeVerificationResult[] = []

//         for (let i = 0; i < youtubeIds.length; i += batchSize) {
//             const batch = youtubeIds.slice(i, i + batchSize)
//             const batchResults = await Promise.all(
//                 batch.map(id => verifyYouTubeVideo(id))
//             )
//             results.push(...batchResults)
            
//             // API制限対策：バッチ間で少し待機
//             if (i + batchSize < youtubeIds.length) {
//                 await new Promise(resolve => setTimeout(resolve, 100))
//             }
//         }

//         return results

//     } catch (err) {
//         console.error('Batch YouTube verification error:', err)
//         return youtubeIds.map(() => ({
//             success: false,
//             isValid: false,
//             errMsg: 'Batch verification failed'
//         }))
//     }
// }