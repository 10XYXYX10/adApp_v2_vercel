'use client'
// src/components/support/detail/MessageReplyForm.tsx
import { SupportMessage } from "@/lib/types/support/supportTypes";
import { createSupportMessage } from "@/actions/support/supportActions";
import { useState, useRef } from "react";

const MessageReplyForm = ({
    supportId,
    userType,
    messageList,
    setMessageList,
}:{
    supportId: number
    userType: 'advertiser' | 'admin'
    messageList: SupportMessage[]
    setMessageList: React.Dispatch<React.SetStateAction<SupportMessage[]>>
}) => {
    //////////
    //■[ State管理 ]
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [content, setContent] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    //////////
    //■[ 送信処理 ]
    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(isSubmitting) return;

        const trimmedContent = content.trim();
        if(!trimmedContent) {
            setErrorMsg('メッセージを入力してください');
            return;
        }

        if(content.length>500){
            alert("問い合わせ内容 は、500字以内でお願いします.")
            setErrorMsg("問い合わせ内容 は、500字以内でお願いします.");
            return;
        }

        setIsSubmitting(true);
        setErrorMsg('');

        try {
            const result = await createSupportMessage({
                userType,
                supportId,
                content: trimmedContent
            });

            if(result.success) {
                //・リアルタイム更新: 新しいメッセージをリストに追加
                const newMessage: SupportMessage = {
                    id: Date.now(), // 仮ID（実際のIDはDB側で採番）
                    content: trimmedContent,
                    senderType: userType === 'advertiser' ? 'user' : 'admin',
                    senderId: 0, // 送信者IDは表示に使わないので0で代用
                    createdAt: new Date()
                };
                setMessageList([...messageList, newMessage]);
                
                //・フォームリセット
                setContent('');
                if(textareaRef.current) {
                    textareaRef.current.style.height = 'auto';
                    textareaRef.current.value='';
                }
            } else {
                setErrorMsg(result.errMsg);
            }
        } catch(err) {
            setErrorMsg('送信に失敗しました。もう一度お試しください。');
        } finally {
            setIsSubmitting(false);
        }
    };

    //////////
    //■[ テキストエリア変更処理 ]
    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setContent(value);
        
        // 自動リサイズ
        const textarea = e.target;
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
        
        if(errorMsg) setErrorMsg(''); // エラー状態をクリア
    };

    return (
        <div className="space-y-4">
            {/* ヘッダー */}
            <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">返信を送信</h3>
            </div>

            {/* フォーム */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* テキストエリア */}
                <div className="relative">
                    <textarea
                        ref={textareaRef}
                        value={content}
                        placeholder="メッセージを入力してください..."
                        className="w-full min-h-[120px] max-h-[300px] p-4 bg-white/90 backdrop-blur-sm border-2 border-white/60 hover:border-emerald-300/80 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 rounded-2xl text-gray-800 placeholder-gray-400 resize-none transition-all duration-300 focus:outline-none shadow-lg hover:shadow-xl"
                        onChange={handleTextareaChange}
                        disabled={isSubmitting}
                    />
                    
                    {/* 文字数カウンター */}
                    <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white/80 backdrop-blur-sm rounded-full px-2 py-1">
                        {content.length}/500
                    </div>
                </div>

                {/* エラーメッセージ */}
                {errorMsg && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                        <p className="text-sm text-red-600 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {errorMsg}
                        </p>
                    </div>
                )}

                {/* 送信ボタン */}
                <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-emerald-500/30 disabled:shadow-none transition-all duration-300 hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed transform"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 group-disabled:opacity-0 transition-opacity duration-300"></div>
                        <div className="relative flex items-center justify-center gap-3">
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>送信中...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                    <span>送信する</span>
                                </>
                            )}
                        </div>
                    </button>
                </div>
            </form>
        </div>
    )
}

export default MessageReplyForm;