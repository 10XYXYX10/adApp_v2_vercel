// src/lib/types/ad/adAdminTypes.ts

// //////////
// //■[ 審査関連型定義 ]

// 審査アクション種別（簡素化）
export type ReviewAction = 'approve' | 'reject'

// 却下理由カテゴリ
export type RejectReason = 
  | 'inappropriate_content'    // 不適切なコンテンツ
  | 'misleading_information'   // 誤解を招く情報
  | 'copyright_violation'      // 著作権侵害
  | 'technical_issues'         // 技術的問題
  | 'policy_violation'         // ポリシー違反
  | 'poor_quality'            // 品質不良
  | 'invalid_target'          // 無効なターゲット
  | 'broken_links'            // リンク切れ
  | 'other'                   // その他

// 却下理由別補足文定義
export const REJECT_REASON_MESSAGES: Record<RejectReason, string> = {
  inappropriate_content: '投稿された内容が当サービスのガイドラインに適さないため、掲載を見送らせていただきました。',
  misleading_information: '広告内容に誤解を招く表現が含まれているため、修正が必要です。',
  copyright_violation: '著作権に関する問題が確認されたため、掲載できません。',
  technical_issues: '技術的な問題により正常に表示されないため、再作成をお願いします。',
  policy_violation: '当サービスの広告ポリシーに違反する内容が含まれています。',
  poor_quality: '広告の品質基準を満たしていないため、改善が必要です。',
  invalid_target: '指定されたターゲットが無効または存在しないため、確認をお願いします。',
  broken_links: 'リンク先にアクセスできないため、URLの確認をお願いします。',
  other: '審査の結果、掲載を見送らせていただくことになりました。'
}

// // 審査コメント型（簡素化）
// export type ReviewComment = {
//   reason: RejectReason // 却下時は必須
//   additionalMessage?: string // 追加の一言メッセージ（任意）
// }

// // 審査履歴型
// export type ReviewHistory = {
//   id: number
//   action: ReviewAction
//   reason?: RejectReason
//   comment?: string
//   pointRefund?: boolean
//   reviewedAt: Date
//   reviewedBy: string // 審査者名
// }

// // 管理者用広告データ型（AdvertisementDetailを拡張）
// export type AdminReviewData = AdvertisementDetail & {
//   reviewHistory?: ReviewHistory[]
//   submittedAt: Date
//   reviewDeadline?: Date
//   priority: 'low' | 'medium' | 'high' | 'urgent'
//   flags: string[] // ['adult_content', 'external_link', 'large_budget'] など
// }


// //////////
// //■[ 審査統計関連 ]

// // 審査統計データ型
// export type AdminReviewStats = {
//   totalPending: number
//   totalApproved: number
//   totalRejected: number
//   avgReviewTime: number // 平均審査時間（時間）
//   todayReviewed: number
//   urgentCount: number
// }

// // 審査効率統計型
// export type ReviewEfficiencyStats = {
//   reviewerName: string
//   reviewedCount: number
//   avgReviewTime: number
//   approvalRate: number // 承認率
//   rejectionRate: number // 却下率
// }

// //////////
// //■[ フィルター・検索関連 ]

// // 管理者用広告フィルター型
// export type AdminAdFilter = {
//   status?: string[]
//   priority?: string[]
//   adType?: string[]
//   submittedAfter?: string
//   submittedBefore?: string
//   reviewedBy?: string
//   hasFlags?: boolean
// }

// //////////
// //■[ 通知関連 ]

// // 審査完了通知データ型
// export type ReviewNotificationData = {
//   userId: number
//   adId: number
//   adTitle: string
//   action: ReviewAction
//   reason?: RejectReason
//   comment?: string
//   pointsRefunded?: number
//   reviewedBy: string
//   reviewedAt: Date
// }

// //////////
// //■[ Server Actions関連 ]

// // 審査アクション用State型
// export type ReviewActionState = {
//   success: boolean
//   errMsg: string
//   isProcessing?: boolean
// }

// // 一括審査処理用型
// export type BulkReviewRequest = {
//   adIds: number[]
//   action: ReviewAction
//   comment?: ReviewComment
// }

// export type BulkReviewResponse = {
//   success: boolean
//   data?: {
//     processed: number
//     failed: number
//     failedItems: { adId: number, error: string }[]
//   }
//   errMsg: string
//   statusCode: number
// }