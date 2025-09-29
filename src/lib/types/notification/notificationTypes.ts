// src/lib/types/notificationTypes.ts
export type NotificationType = 'payment' | 'advertisement' | 'system' | 'other';
export type NotificationSortOrder = 'desc' | 'asc';
export type NotificationReadStatus = 'true' | 'false' | 'all';

export interface NotificationWithUser {
   id: number;
   title: string;
   description: string;
   isRead: boolean;
   type: NotificationType|string|null;
   createdAt: Date;
   userId: number;
}

export interface NotificationItemProps {
   notification: NotificationWithUser;
   userType: 'admin' | 'advertiser';
   userId: number;
}


// タイプ別のアイコン・色設定用
export const NOTIFICATION_TYPE_CONFIG = {
   payment: {
       label: '決済',
       icon: 'CreditCard',
       color: 'text-green-600',
       bgColor: 'bg-green-50'
   },
   advertisement: {
       label: '広告',
       icon: 'Megaphone',
       color: 'text-blue-600',
       bgColor: 'bg-blue-50'
   },
   system: {
       label: 'システム',
       icon: 'Settings',
       color: 'text-gray-600',
       bgColor: 'bg-gray-50'
   },
   other: {
       label: 'その他',
       icon: 'Bell',
       color: 'text-purple-600',
       bgColor: 'bg-purple-50'
   }
} as const;