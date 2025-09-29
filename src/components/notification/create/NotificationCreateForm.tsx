'use client'
// src/components/notification/create/NotificationCreateForm.tsx
import { createNotificationForAllAdvertisers } from "@/actions/notification/notificationActions";
import { useState, useRef, ChangeEvent } from "react";
import { useRouter } from "next/navigation";

//////////
//■ [ 型定義 ]
type NotificationForm = {
    title: [string, string]       // [値, エラー文字]
    type: [string, string]        // [値, エラー文字]  
    description: [string, string] // [値, エラー文字]
    sendEmail: [boolean, string]  // [値, エラー文字]
}

const NotificationCreateForm = ({
    adminId,
}:{
    adminId: number
}) => {
    //////////
    //■ [ State管理 ]
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [formData, setFormData] = useState<NotificationForm>({
        title: ['', ''],
        type: ['', ''],
        description: ['', ''],
        sendEmail: [false, '']
    });
    const router = useRouter();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    //////////
    //■ [ 送信処理 ]
    const handleSubmit = async() => {
        const confirmed = confirm('この内容でadvertiserユーザー全員に通知を送信しますか？');
        if(!confirmed) return;
        setIsSubmitting(true);
        if(errorMsg) setErrorMsg('');

        //////////
        //■ [ フォームデータのバリデーション ]
        const {title, type, description} = formData;
        let alertFlag = false;
        //・title
        if(title[0].length > 100) {
            title[1] = "タイトルは100字以内で入力してください";
            alertFlag = true;
        }
        if(title[0].trim().length === 0) {
            title[1] = "タイトルを入力してください";
            alertFlag = true;
        }
        //・description
        if(description[0].length > 1000) {
            description[1] = "内容は1000字以内で入力してください";
            alertFlag = true;
        }
        if(description[0].trim().length === 0) {
            description[1] = "内容を入力してください";
            alertFlag = true;
        }
        //・type
        if(!['payment','advertisement','system','other'].includes(type[0])) {
            type[1] = 'カテゴリーを選択してください';
            alertFlag = true;
        }
        //・バリデーション結果を反映
        if(alertFlag) {
            setFormData(prev => ({...prev, title, type, description}));
            alert('入力内容に問題があります');
            setErrorMsg('入力内容に問題があります');
            setIsSubmitting(false);
            return;
        }

        //////////
        //■ [ 通信 ]
        try {
            const result = await createNotificationForAllAdvertisers({
                title: title[0].trim(),
                type: type[0],
                description: description[0].trim(),
                sendEmail: formData.sendEmail[0]
            });

            if(result.success) {
                alert(`通知を作成しました。送信件数: ${result.createdCount}件`);
                router.push(`/admin/${adminId}/notification`);
                router.refresh();
            } else if(result.statusCode===401 || result.statusCode===403){
                alert('認証が無効です。再ログインしてください。');
                router.push('/auth/admin')
            }else {
                setErrorMsg(result.errMsg);
                setIsSubmitting(false);
            }
        } catch(err) {
            const message = err instanceof Error ? err.message : '作成に失敗しました。もう一度お試しください。';
            alert(message);
            setErrorMsg(message);
            setIsSubmitting(false);
        }
    };

    //////////
    //■ [ 入力変更処理 ]
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const inputName = e.target.name;
        const inputVal = e.target.value;
        
        if(inputName === 'sendEmail') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({...prev, sendEmail: [checked, '']}));
        } else {
            setFormData(prev => ({...prev, [inputName]: [inputVal, '']}));
        }
        
        // テキストエリアの自動リサイズ
        if(inputName === 'description' && textareaRef.current) {
            const textarea = textareaRef.current;
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    return (
        <div className="relative bg-gradient-to-br from-purple-50/80 via-blue-50/60 to-indigo-50/40 rounded-3xl p-8 border border-white/50 shadow-2xl">
            {/* 背景装飾 */}
            <div className="absolute inset-0 bg-grid-purple-100/20 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] rounded-3xl"></div>
            
            {/* ヘッダー */}
            <div className="relative z-10 mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">一斉通知作成</h1>
                        <p className="text-gray-600 mt-1">全advertiserユーザーに通知を送信します</p>
                    </div>
                </div>
            </div>

            {/* フォーム */}
            <form onSubmit={(e) => e.preventDefault()} className="relative z-10 space-y-8">
                {/* タイトル */}
                <div className="space-y-3">
                    <label className="block text-lg font-bold text-gray-900">
                        通知タイトル <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title[0]}
                        onChange={handleChange}
                        placeholder="通知のタイトルを入力してください"
                        className={`w-full p-4 bg-white/90 backdrop-blur-sm border-2 ${
                            formData.title[1] ? 'border-red-500' : 'border-white/60 hover:border-purple-300/80'
                        } focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 rounded-2xl text-gray-800 placeholder-gray-400 transition-all duration-300 focus:outline-none shadow-lg hover:shadow-xl`}
                        disabled={isSubmitting}
                    />
                    {formData.title[1] && (
                        <span className="text-red-500 text-sm flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {formData.title[1]}
                        </span>
                    )}
                    <div className="text-xs text-gray-500 text-right">
                        {formData.title[0].length}/100文字
                    </div>
                </div>

                {/* 通知カテゴリー */}
                <div className="space-y-3">
                    <label className="block text-lg font-bold text-gray-900">
                        通知カテゴリー <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="type"
                        value={formData.type[0]}
                        onChange={handleChange}
                        className={`w-full appearance-none p-4 bg-white/90 backdrop-blur-sm border-2 ${
                            formData.type[1] ? 'border-red-500' : 'border-white/60 hover:border-purple-300/80'
                        } focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 rounded-2xl text-gray-800 transition-all duration-300 focus:outline-none shadow-lg hover:shadow-xl cursor-pointer`}
                        disabled={isSubmitting}
                    >
                        <option value="">カテゴリーを選択してください</option>
                        <option value="payment">決済・ポイント関連</option>
                        <option value="advertisement">広告配信関連</option>
                        <option value="system">システム</option>
                        <option value="other">その他</option>
                    </select>
                    {formData.type[1] && (
                        <span className="text-red-500 text-sm flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {formData.type[1]}
                        </span>
                    )}
                </div>

                {/* 通知内容 */}
                <div className="space-y-3">
                    <label className="block text-lg font-bold text-gray-900">
                        通知内容 <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <textarea
                            ref={textareaRef}
                            name="description"
                            value={formData.description[0]}
                            placeholder="詳しい内容をご記入ください..."
                            className={`w-full min-h-[150px] max-h-[400px] p-4 bg-white/90 backdrop-blur-sm border-2 ${
                                formData.description[1] ? 'border-red-500' : 'border-white/60 hover:border-purple-300/80'
                            } focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 rounded-2xl text-gray-800 placeholder-gray-400 resize-none transition-all duration-300 focus:outline-none shadow-lg hover:shadow-xl`}
                            onChange={handleChange}
                            disabled={isSubmitting}
                        />
                        <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1">
                            {formData.description[0].length}/1000文字
                        </div>
                    </div>
                    {formData.description[1] && (
                        <span className="text-red-500 text-sm flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {formData.description[1]}
                        </span>
                    )}
                </div>

                {/* メール送信オプション */}
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            name="sendEmail"
                            id="sendEmail"
                            checked={formData.sendEmail[0]}
                            onChange={handleChange}
                            className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                            disabled={isSubmitting}
                        />
                        <label htmlFor="sendEmail" className="text-gray-900 font-medium cursor-pointer">
                            メール通知も送信する（将来実装予定）
                        </label>
                    </div>
                    <p className="text-sm text-gray-600 mt-2 ml-8">
                        システム通知と合わせてメールでも通知を送信します
                    </p>
                </div>

                {/* 全体エラーメッセージ */}
                {errorMsg && (
                    <div className="p-4 bg-red-50/90 backdrop-blur-sm border border-red-200 rounded-2xl">
                        <p className="text-sm text-red-600 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {errorMsg}
                        </p>
                    </div>
                )}

                {/* 送信ボタン */}
                <div className="flex flex-col sm:flex-row gap-4 sm:justify-end">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-8 py-4 bg-white/90 hover:bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
                        disabled={isSubmitting}
                    >
                        キャンセル
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="group relative overflow-hidden bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-12 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-purple-500/30 disabled:shadow-none transition-all duration-300 hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed transform"
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
                                    <span>一斉通知を送信</span>
                                </>
                            )}
                        </div>
                    </button>
                </div>
            </form>

            {/* 装飾要素 */}
            <div className="absolute top-6 right-6 w-16 h-16 bg-gradient-to-br from-purple-400/20 to-blue-500/20 rounded-full blur-2xl"></div>
            <div className="absolute bottom-6 left-6 w-12 h-12 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-xl"></div>
        </div>
    )
}
export default NotificationCreateForm;