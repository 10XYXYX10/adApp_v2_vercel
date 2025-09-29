//「src/lib/types/adListTypes.ts」
import { Prisma } from "@prisma/client";

export type AdListSortType = 'desc'|'asc';

export type AdListAdType = 'priority'|'overlay'|'preroll'|'youtube-short'|'youtube-long'|'';

export type AdListStatusType = 'draft'|'pending'|'approved'|'rejected'|'active'|'paused'|'';

export type AdListOptionObType = {
    where?:Prisma.AdvertisementWhereInput
    orderBy?: { createdAt: 'desc'|'asc' }
    skip?: number
    take?: number
}
