'use client'
// src/components/notifications/detail/NotificationDetailClient.tsx
import useStore from "@/store";
import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const NotificationDetailClient = ({
    wasUnread,
}:{
    wasUnread: boolean
}) => {
    const { decrementNotificationCount } = useStore();
    const params = useParams();
    const advertiserId = params.advertiserId;

    useEffect(() => {
        if (wasUnread) {
            console.log('decrementNotificationCount()')
            decrementNotificationCount();
        }
    }, []);

    return (
        <div className="flex justify-center p-6">
            <Link 
                href={`/advertiser/${advertiserId}/notification`}
                className="group inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-bold shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105 transform"
            >
                <svg className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>通知一覧に戻る</span>
            </Link>
        </div>
    );
}
export default NotificationDetailClient;