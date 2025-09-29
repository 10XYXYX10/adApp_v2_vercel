'use client'
// src/components/support/detail/MessageThread.tsx
import { SupportMessage } from "@/lib/types/support/supportTypes";
import { useState } from "react";
import MessageItem from "./MessageItem";
import MessageReplyForm from "./MessageReplyForm";

const MessageThread = ({
    userType,
    initialMessages,
    supportId,
}:{
    userType: 'advertiser' | 'admin'
    initialMessages: SupportMessage[]
    supportId: number
}) => {
    //////////
    //■[ State管理 ]
    const [messageList, setMessageList] = useState<SupportMessage[]>(initialMessages);

    return (
        <div className="relative space-y-8">
            {/* スレッドヘッダー */}
            <div className="flex items-center gap-3 pb-4 border-b border-emerald-100/50">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-1" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m6-4H9m6 8H9" />
                    </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">やり取り履歴</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-emerald-200 to-transparent"></div>
                <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                    {messageList.length}件のメッセージ
                </div>
            </div>

            {/* メッセージリスト */}
            <div className="space-y-6 min-h-[400px] max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-200 scrollbar-track-gray-100">
                {messageList.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-emerald-100 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <p className="text-gray-500 text-lg font-medium">まだメッセージがありません</p>
                        <p className="text-gray-400 text-sm mt-2">下のフォームから最初のメッセージを送信してください</p>
                    </div>
                ) : (
                    messageList.map((message) => (
                        <MessageItem
                            key={message.id}
                            message={message}
                            userType={userType}
                        />
                    ))
                )}
            </div>

            {/* 返信フォーム */}
            <div className="bg-gradient-to-r from-emerald-50/80 to-teal-50/60 rounded-2xl p-6 border border-emerald-100/50">
                <MessageReplyForm
                    supportId={supportId}
                    userType={userType}
                    messageList={messageList}
                    setMessageList={setMessageList}
                />
            </div>

            {/* 装飾要素 */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-emerald-400/30 to-teal-500/30 rounded-full blur-sm"></div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-br from-teal-400/30 to-cyan-500/30 rounded-full blur-sm"></div>
        </div>
    )
}

export default MessageThread;