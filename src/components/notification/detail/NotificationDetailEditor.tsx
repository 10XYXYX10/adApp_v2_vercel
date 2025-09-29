'use client'
// src/components/notification/detail/NotificationDetailEditor.tsx
import { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { NotificationWithUser } from "@/lib/types/notification/notificationTypes";
import { updateNotification, deleteNotification } from "@/actions/notification/notificationActions";

type NotificationForm = {
    title: [string, string]       // [値, エラー文字]
    description: [string, string] // [値, エラー文字]
}

const NotificationDetailEditor = ({
    notification,
    adminId,
}:{
    notification: NotificationWithUser
    adminId: number
}) => {
    //////////
    //■ [ State管理 ]
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [formData, setFormData] = useState<NotificationForm>({
        title: [notification.title, ''],
        description: [notification.description, '']
    });
    
    const router = useRouter();

    //////////
    //■ [ 更新処理 ]
    const handleUpdate = async() => {
        const confirmed = confirm('この内容で更新しますか？');
        if(!confirmed) return;
        
        setIsUpdating(true);
        if(errorMsg) setErrorMsg('');

        //////////
        //■ [ フォームデータのバリデーション ]
        const {title, description} = formData;
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
        //・バリデーション結果を反映
        if(alertFlag) {
            setFormData({title, description});
            alert('入力内容に問題があります');
            setErrorMsg('入力内容に問題があります');
            setIsUpdating(false);
            return;
        }

        //////////
        //■ [ 通信 ]
        try {
            const result = await updateNotification({
                notificationId: notification.id,
                title: title[0].trim(),
                description: description[0].trim()
            });

            if(result.success) {
                alert('通知を更新しました');
                router.refresh();
            } else if(result.statusCode===401 || result.statusCode===403){
                alert('認証が無効です。再ログインしてください。');
                router.push('/auth/advertiser')
            } else {
                setErrorMsg(result.errMsg);
            }
        } catch(err) {
            const message = err instanceof Error ? err.message : '更新に失敗しました。もう一度お試しください。';
            alert(message);
            setErrorMsg(message);
        }
        
        setIsUpdating(false);
    };

    //////////
    //■ [ 削除処理 ]
    const handleDelete = async() => {
        const confirmed = confirm('本当にこの通知を削除しますか？この操作は取り消せません。');
        if(!confirmed) return;
        
        setIsDeleting(true);
        if(errorMsg) setErrorMsg('');

        try {
            const result = await deleteNotification({
                notificationId: notification.id
            });
            if(result.success) {
                alert('通知を削除しました');
                router.push(`/admin/${adminId}/notification`);
                router.refresh();
            } else {
                setErrorMsg(result.errMsg);
                setIsDeleting(false);
            }
        } catch(err) {
            const message = err instanceof Error ? err.message : '削除に失敗しました。もう一度お試しください。';
            alert(message);
            setErrorMsg(message);
            setIsDeleting(false);
        }
    };

    //////////
    //■ [ 入力変更処理 ]
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const inputName = e.target.name as keyof NotificationForm;
        const inputVal = e.target.value;
        setFormData(prev => ({...prev, [inputName]: [inputVal, '']}));
    };

    return (
        <div className="border-t border-gray-100 bg-gradient-to-br from-purple-50/80 via-blue-50/60 to-indigo-50/40">
            <div className="p-6 sm:p-8">
                {/* ヘッダー */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">管理者編集機能</h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-purple-200 to-transparent"></div>
                </div>

                {/* 編集フォーム */}
                <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                    {/* タイトル編集 */}
                    <div className="space-y-3">
                        <label className="block text-sm font-bold text-gray-900">
                            タイトル <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title[0]}
                            onChange={handleChange}
                            className={`w-full p-4 bg-white/90 backdrop-blur-sm border-2 ${
                                formData.title[1] ? 'border-red-500' : 'border-white/60 hover:border-purple-300/80'
                            } focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 rounded-xl text-gray-800 transition-all duration-300 focus:outline-none shadow-lg hover:shadow-xl`}
                            disabled={isUpdating || isDeleting}
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

                    {/* 内容編集 */}
                    <div className="space-y-3">
                        <label className="block text-sm font-bold text-gray-900">
                            通知内容 <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="description"
                            value={formData.description[0]}
                            onChange={handleChange}
                            rows={6}
                            className={`w-full p-4 bg-white/90 backdrop-blur-sm border-2 ${
                                formData.description[1] ? 'border-red-500' : 'border-white/60 hover:border-purple-300/80'
                            } focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 rounded-xl text-gray-800 resize-none transition-all duration-300 focus:outline-none shadow-lg hover:shadow-xl`}
                            disabled={isUpdating || isDeleting}
                        />
                        {formData.description[1] && (
                            <span className="text-red-500 text-sm flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {formData.description[1]}
                            </span>
                        )}
                        <div className="text-xs text-gray-500 text-right">
                            {formData.description[0].length}/1000文字
                        </div>
                    </div>

                    {/* 全体エラーメッセージ */}
                    {errorMsg && (
                        <div className="p-4 bg-red-50/90 backdrop-blur-sm border border-red-200 rounded-xl">
                            <p className="text-sm text-red-600 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {errorMsg}
                            </p>
                        </div>
                    )}

                    {/* ボタン群 */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* 更新ボタン */}
                        <button
                            type="button"
                            onClick={handleUpdate}
                            disabled={isUpdating || isDeleting}
                            className="group flex-1 relative overflow-hidden bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-4 rounded-xl font-bold shadow-2xl hover:shadow-purple-500/30 disabled:shadow-none transition-all duration-300 hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed transform"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 group-disabled:opacity-0 transition-opacity duration-300"></div>
                            <div className="relative flex items-center justify-center gap-3">
                                {isUpdating ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>更新中...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        <span>通知を更新</span>
                                    </>
                                )}
                            </div>
                        </button>

                        {/* 削除ボタン */}
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isUpdating || isDeleting}
                            className="group relative overflow-hidden bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-4 rounded-xl font-bold shadow-2xl hover:shadow-red-500/30 disabled:shadow-none transition-all duration-300 hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed transform"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 group-disabled:opacity-0 transition-opacity duration-300"></div>
                            <div className="relative flex items-center justify-center gap-3">
                                {isDeleting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>削除中...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        <span>通知を削除</span>
                                    </>
                                )}
                            </div>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default NotificationDetailEditor;