// src/components/support/detail/MessageItem.tsx
import { entityToDangerousChar } from "@/lib/seculity/validation";
import { SupportMessage } from "@/lib/types/support/supportTypes";

//////////
//■[ Helper関数をコンポーネント外で定義 ]
//・パフォーマンス向上: 毎回レンダリング時の関数再作成を回避
//・純粋関数: 副作用なしの関数は外部定義が適切

// 送信者タイプ判定
const isUserMessage = (senderType: string, userType: 'advertiser' | 'admin') => {
    return (userType === 'advertiser' && senderType === 'user') || 
           (userType === 'admin' && senderType === 'admin');
};

// 送信者表示名取得
const getSenderName = (senderType: string) => {
    return senderType === 'user' ? 'あなた' : 'サポート';
};

const MessageItem = ({
    message,
    userType,
}:{
    message: SupportMessage
    userType: 'advertiser' | 'admin'
}) => {
    const isOwn = isUserMessage(message.senderType, userType);

    return (
        <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[85%] sm:max-w-[75%] lg:max-w-[65%] ${
                isOwn ? 'flex-row-reverse' : 'flex-row'
            }`}>
                {/* アバター */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                    isOwn 
                        ? 'bg-gradient-to-br from-emerald-500 to-teal-600' 
                        : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                }`}>
                    {isOwn ? (
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2v4m0 12v4M2 12h4m12 0h4" />
                        </svg>
                    )}
                </div>

                {/* メッセージ本体 */}
                <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                    {/* 送信者名・日時 */}
                    <div className={`flex items-center gap-2 mb-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                        <span className={`text-sm font-medium ${
                            isOwn ? 'text-emerald-700' : 'text-blue-700'
                        }`}>
                            {getSenderName(message.senderType)}
                        </span>
                        <span className="text-xs text-gray-500">
                            {new Date(message.createdAt).toLocaleDateString('ja-JP', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </span>
                    </div>

                    {/* メッセージ内容 */}
                    <div className={`relative p-4 rounded-2xl shadow-lg backdrop-blur-sm border ${
                        isOwn 
                            ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-emerald-300/30' 
                            : 'bg-white/90 text-gray-800 border-white/50'
                    } ${isOwn ? 'rounded-br-sm' : 'rounded-bl-sm'}`}>
                        {/* メッセージテキスト */}
                        <p className={`text-sm sm:text-base leading-relaxed whitespace-pre-wrap ${
                            isOwn ? 'text-white' : 'text-gray-800'
                        }`}>
                            {entityToDangerousChar(message.content,'full')}
                        </p>

                        {/* 吹き出しの尻尾 */}
                        <div className={`absolute top-4 w-0 h-0 ${
                            isOwn 
                                ? 'right-0 translate-x-full border-l-8 border-l-emerald-500 border-t-4 border-t-transparent border-b-4 border-b-transparent'
                                : 'left-0 -translate-x-full border-r-8 border-r-white/90 border-t-4 border-t-transparent border-b-4 border-b-transparent'
                        }`}></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MessageItem;