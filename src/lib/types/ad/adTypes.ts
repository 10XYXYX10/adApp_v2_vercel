//「src/lib/types/ad/adTypes.ts」
import { Prisma } from "@prisma/client";

export type AdType = 'priority' | 'overlay' | 'preroll' | 'youtube-short' | 'youtube-long'
export type AdStatsTypes = 'draft' | 'pending' |'approved' |'rejected' |'active' |'paused';
//export type ColorScheme = 'pink' | 'blue' | 'purple' | 'red' | 'orange'
//xport type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced'


//////////
//■[ adDetail ]
export type AdvertisementDetail = {
  id: number
  adType: AdType  // string → AdType に変更
  status: string
  verified: boolean
  budget: number  // Decimal → number に変更  
  remainingBudget: number  // Decimal → number に変更
  targetId: string | null
  destinationUrl: string | null
  mediaFileId: number | null
  verifiedAt: Date | null
  createdAt: Date
  updatedAt: Date
  user: {
    id: number
    name: string
    amount: number  // Decimal → number に変更 
  }
}

//////////
//■[ adList ]
export type AdListSortType = 'desc'|'asc';
export type AdListAdType = 'priority'|'overlay'|'preroll'|'youtube-short'|'youtube-long'|'';
export type AdListStatusType = 'draft'|'pending'|'approved'|'rejected'|'active'|'paused'|'';

export type AdListOptionObType = {
    where?:Prisma.AdvertisementWhereInput
    orderBy?: { createdAt: 'desc'|'asc' }
    skip?: number
    take?: number
}
