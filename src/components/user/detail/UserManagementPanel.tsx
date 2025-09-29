'use client'
// src/components/user/detail/UserManagementPanel.tsx
import { useState, useRef } from "react";
import { UserDetailType } from "@/lib/types/user/userTypes";
import { NotificationType } from "@/lib/types/notification/notificationTypes";
import { manageUserAndNotify } from "@/actions/user/userActions";

// 定型文定義 - コンポーネント外で定義してパフォーマンス最適化
const TEMPLATE_MESSAGES = {
    activate: {
        title: 'アカウントを有効化しました',
        description: 'お客様のアカウントが正常に有効化されました。サービスをご利用いただけます。ご不明な点がございましたらお気軽にお問い合わせください。'
    },
    deactivate: {
        title: 'アカウントを無効化しました', 
        description: 'お客様のアカウントが無効化されました。サービスの利用が制限されています。詳細については管理者までお問い合わせください。'
    }
};

const UserManagementPanel = ({
    user,
}:{
    user: UserDetailType
}) => {
    const [isActiveData,setIsActiveData] = useState({old:user.isActive, new:user.isActive});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const formRef = useRef<HTMLFormElement>(null);
    
    // アカウント状態切り替えハンドラー
    const handleStatusToggle = (newStatus: boolean) => {
        console.log(`--handleStatusToggle--`)
        if (!formRef.current) return;
        console.log(`newStatus:${newStatus}`)
        const template = newStatus ? TEMPLATE_MESSAGES.activate : TEMPLATE_MESSAGES.deactivate;
        const titleInput = formRef.current.querySelector('input[name="title"]') as HTMLInputElement;
        const descriptionTextarea = formRef.current.querySelector('textarea[name="description"]') as HTMLTextAreaElement;
        const changed = isActiveData.old !== newStatus;
        console.log(`changed:${changed}`)

        if (titleInput) titleInput.value = changed ? template.title : "";
        if (descriptionTextarea) descriptionTextarea.value = changed ? template.description : "";

        setIsActiveData({...isActiveData, new:newStatus})
    };

    // フォーム送信処理
    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isSubmitting) return;

        const formData = new FormData(e.currentTarget);
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const notificationType = formData.get('notificationType') as NotificationType;
        const sendEmail = formData.get('sendEmail') === 'on';

        if (!title.trim() || !description.trim()) {
            setMessage('タイトルと通知内容は必須です');
            return;
        }

        setIsSubmitting(true);
        setMessage('');

        try {
            const result = await manageUserAndNotify({
                targetUserId: user.id,
                isActiveToggle: isActiveData.old!==isActiveData.new ? isActiveData.new : undefined,
                notificationTitle: title.trim(),
                notificationDescription: description.trim(),
                notificationType: notificationType || 'system',
                sendEmail
            });
            if (result.success) {
                setMessage('処理が完了しました');
                // フォームリセット
                setIsActiveData({...isActiveData, old:isActiveData.new})
                formRef.current?.reset()
                alert('Success.')
            } else {
                alert(result.errMsg)
                setMessage(result.errMsg);
            }
        } catch (err) {
            console.error(err)
            setMessage('処理中にエラーが発生しました');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">管理操作パネル</h3>
                <div className="flex-1 h-px bg-gradient-to-r from-orange-200 to-transparent"></div>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                {/* アカウント制御セクション */}
                <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/60 rounded-2xl p-6 border border-blue-200/50">
                    <h4 className="text-lg font-bold text-blue-900 mb-4">アカウント制御</h4>
                    
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-sm font-medium text-blue-700">現在の状態:</span>
                                <span className={`ml-2 px-3 py-1 rounded-full text-sm font-bold ${
                                    isActiveData.old ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                    {isActiveData.old ? 'アクティブ' : '無効'}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="toggleAccount"
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                    // ## 注意: defaultChecked + form.reset() を併用すると、DOMとstateがズレる
                                    //   - 問題の事象の詳細:
                                    //     1. 一回目に、toggleAccountのchangeboxを切り替えた後、handleSubmit > manageUserAndNotify実行。処理が成功！！ 
                                    //     2. toggleAccountのchangeboxを切り替えると、onChangeが検知されない。
                                    //     3. もう一度toggleAccountのchangeboxを切り替えると、onChangeが検知される。
                                    //   -  完全制御 (checked) にすることで解決
                                    checked={isActiveData.old !== isActiveData.new}
                                    onChange={() => {
                                        handleStatusToggle(!isActiveData.new);
                                    }}
                                />
                                <span className="text-sm font-medium text-blue-900">
                                    アカウントを{isActiveData.old ? '無効化' : '有効化'}する
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* 通知送信セクション */}
                <div className="bg-gradient-to-r from-purple-50/80 to-pink-50/60 rounded-2xl p-6 border border-purple-200/50">
                    <h4 className="text-lg font-bold text-purple-900 mb-4">通知送信</h4>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-purple-700 mb-2">
                                通知タイトル <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                maxLength={100}
                                className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 focus:outline-none"
                                placeholder="通知のタイトルを入力..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-purple-700 mb-2">
                                通知内容 <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="description"
                                maxLength={500}
                                rows={4}
                                className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 focus:outline-none resize-none"
                                placeholder="通知の詳細内容を入力..."
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-purple-700 mb-2">
                                    通知カテゴリー
                                </label>
                                <select
                                    name="notificationType"
                                    className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 focus:outline-none"
                                >
                                    <option value="system">システム</option>
                                    <option value="payment">決済・ポイント</option>
                                    <option value="advertisement">広告配信</option>
                                    <option value="other">その他</option>
                                </select>
                            </div>

                            <div className="flex items-end">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="sendEmail"
                                        className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                                    />
                                    <span className="text-sm font-medium text-purple-900">
                                        メール通知も送信
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* メッセージ表示 */}
                {message && (
                    <div className={`p-4 rounded-xl ${
                        message.includes('完了') ? 'bg-green-50 text-green-800 border border-green-200' : 
                        'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                        {message}
                    </div>
                )}

                {/* 実行ボタン */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl disabled:shadow-none"
                    >
                        {isSubmitting ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                処理中...
                            </div>
                        ) : (
                            '実行する'
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}
export default UserManagementPanel;