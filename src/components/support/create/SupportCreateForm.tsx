'use client'
// src/components/support/create/SupportCreateForm.tsx
import { createSupport } from "@/actions/support/supportActions";
import { useState, useRef, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import SpinnerModal from "@/components/SpinnerModal";

//////////
//■[ 型定義 ]
type SupportForm = {
    title: [string, string]     // [値, エラー文字]
    category: [string, string]  // [値, エラー文字]  
    content: [string, string]   // [値, エラー文字]
}

const SupportCreateForm = ({
    userType,
    userId,
}:{
    userType: 'advertiser' | 'admin'
    userId: number
}) => {
    //////////
    //■[ State管理 ]
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [formData, setFormData] = useState<SupportForm>({
        title: ['', ''],
        category: ['', ''],
        content: ['', '']
    });
    
    const router = useRouter();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    //////////
    //■[ 送信処理 ]
    const handleSubmit = async() => {
        const confirmed = confirm('この内容で間違いありませんか？？')
        if(!confirmed)return;
        setIsSubmitting(true);
        if(errorMsg) setErrorMsg('');

        ///////////
        //◆【formDataのバリデーション】
        const {title, category, content} = formData;
        let alertFlag = false;
        //・title
        if(title[0].length>100){
            title[1]="titleの入力は100字以内でお願いします.";
            alertFlag = true;
        }
        //・content
        //dangerousCharToEntity
        if(content[0].length>500){
            content[1]="問い合わせ内容 は、500字以内でお願いします.";
            alertFlag = true;
        }
        //・category
        if(!['payment','advertisement','technical','other'].includes(category[0])) {
            category[1] = 'カテゴリーを選択してください';
            alertFlag = true;
        }
        //・validation結果を反映
        if(alertFlag) {
            setFormData({title, category, content});
            alert('入力内容に問題があります')
            setErrorMsg('入力内容に問題があります');
            setIsSubmitting(false);
            return;
        }

        //////////
        //◆【通信】
        try {
            const result = await createSupport({
                userType,
                title: title[0].trim(),
                category: category[0],
                content: content[0].trim()
            });

            if(result.success) {
                alert('Success.');
                router.push(`/${userType}/${userId}/support`);
                router.refresh();
            } else {
                setErrorMsg(result.errMsg);
                setIsSubmitting(false);
            }
        } catch(err) {
            const message = err instanceof Error ? err.message : '作成に失敗しました。もう一度お試しください。';
            alert(message)
            setErrorMsg(message);
            setIsSubmitting(false);
        }
    };

    //////////
    //■[ 入力変更処理 ]
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const inputName = e.target.name as keyof SupportForm;
        const inputVal = e.target.value;
        setFormData({...formData, [inputName]: [inputVal, '']});
        
        // テキストエリアの自動リサイズ
        if(inputName === 'content' && textareaRef.current) {
            const textarea = textareaRef.current;
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    return (
        <div className="relative bg-gradient-to-br from-emerald-50/80 via-teal-50/60 to-cyan-50/40 rounded-3xl p-8 border border-white/50 shadow-2xl">
            {isSubmitting&&<SpinnerModal/>}
            {/* 背景装飾 */}
            <div className="absolute inset-0 bg-grid-emerald-100/20 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] rounded-3xl"></div>
            
            {/* ヘッダー */}
            <div className="relative z-10 mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">新しい問い合わせ</h1>
                        <p className="text-gray-600 mt-1">困ったことがあればお気軽にご相談ください</p>
                    </div>
                </div>
            </div>

            {/* フォーム */}
            <form onSubmit={(e) => e.preventDefault()} className="relative z-10 space-y-8">
                {/* タイトル */}
                <div className="space-y-3">
                    <label className="block text-lg font-bold text-gray-900">
                        タイトル <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title[0]}
                        onChange={handleChange}
                        placeholder="問い合わせの件名を入力してください"
                        className={`w-full p-4 bg-white/90 backdrop-blur-sm border-2 ${
                            formData.title[1] ? 'border-red-500' : 'border-white/60 hover:border-emerald-300/80'
                        } focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 rounded-2xl text-gray-800 placeholder-gray-400 transition-all duration-300 focus:outline-none shadow-lg hover:shadow-xl`}
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

                {/* カテゴリー */}
                <div className="space-y-3">
                    <label className="block text-lg font-bold text-gray-900">
                        カテゴリー <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="category"
                        value={formData.category[0]}
                        onChange={handleChange}
                        className={`w-full appearance-none p-4 bg-white/90 backdrop-blur-sm border-2 ${
                            formData.category[1] ? 'border-red-500' : 'border-white/60 hover:border-emerald-300/80'
                        } focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 rounded-2xl text-gray-800 transition-all duration-300 focus:outline-none shadow-lg hover:shadow-xl cursor-pointer`}
                        disabled={isSubmitting}
                    >
                        <option value="">カテゴリーを選択してください</option>
                        <option value="payment">💳 決済・ポイント関連</option>
                        <option value="advertisement">📢 広告配信関連</option>
                        <option value="technical">⚙️ 技術的な問題</option>
                        <option value="other">❓ その他</option>
                    </select>
                    {formData.category[1] && (
                        <span className="text-red-500 text-sm flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {formData.category[1]}
                        </span>
                    )}
                </div>

                {/* 内容 */}
                <div className="space-y-3">
                    <label className="block text-lg font-bold text-gray-900">
                        問い合わせ内容 <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <textarea
                            ref={textareaRef}
                            name="content"
                            value={formData.content[0]}
                            placeholder="詳しい内容をご記入ください..."
                            className={`w-full min-h-[150px] max-h-[400px] p-4 bg-white/90 backdrop-blur-sm border-2 ${
                                formData.content[1] ? 'border-red-500' : 'border-white/60 hover:border-emerald-300/80'
                            } focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 rounded-2xl text-gray-800 placeholder-gray-400 resize-none transition-all duration-300 focus:outline-none shadow-lg hover:shadow-xl`}
                            onChange={handleChange}
                            disabled={isSubmitting}
                        />
                        <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1">
                            {formData.content[0].length}/500文字
                        </div>
                    </div>
                    {formData.content[1] && (
                        <span className="text-red-500 text-sm flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {formData.content[1]}
                        </span>
                    )}
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
                        className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-12 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-emerald-500/30 disabled:shadow-none transition-all duration-300 hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed transform"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 group-disabled:opacity-0 transition-opacity duration-300"></div>
                        <div className="relative flex items-center justify-center gap-3">
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>作成中...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                    <span>問い合わせを作成</span>
                                </>
                            )}
                        </div>
                    </button>
                </div>
            </form>

            {/* 装飾要素 */}
            <div className="absolute top-6 right-6 w-16 h-16 bg-gradient-to-br from-emerald-400/20 to-teal-500/20 rounded-full blur-2xl"></div>
            <div className="absolute bottom-6 left-6 w-12 h-12 bg-gradient-to-br from-teal-400/20 to-cyan-500/20 rounded-full blur-xl"></div>
        </div>
    )
}

export default SupportCreateForm;