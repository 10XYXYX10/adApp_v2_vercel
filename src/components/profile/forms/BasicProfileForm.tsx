'use client'
// src/components/common/profile/forms/BasicProfileForm.tsx
import { useState } from "react";
import { useRouter } from "next/navigation";
import { validationForWord, validationForEmail } from "@/lib/seculity/validation";

import { BasicProfileFormType, BasicProfileData, ProfileCompletionStatus } from "@/lib/types/profile/profileTypes";
import AuthenticationModal from "../AuthenticationModal";
import { updateBasicProfile } from "@/actions/profile/profileActions";



const BasicProfileForm = ({
    userType,
    userId,
    data,
    setCompletionStatus,
}:{
    userType: 'advertiser' | 'admin'
    userId: number
    data: BasicProfileData
    setCompletionStatus: React.Dispatch<React.SetStateAction<ProfileCompletionStatus>>
}) => {
    const router = useRouter();
    //////////
    //■[ State管理 ]
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [formData, setFormData] = useState<BasicProfileFormType>({
        name: [data.name, ''],
        email: [data.email, ''],
        birthDate: [data.birthDate.toISOString().split('T')[0], '']
    });
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [prevEmail,setPrevEmail] = useState(data.email);
    

    //////////
    //■[ 送信処理 ]
    const handleSubmit = async() => {
        if(isSubmitting) return;
        
        const confirmed = confirm('この内容で保存しますか？');
        if(!confirmed) return;
        
        setIsSubmitting(true);
        if(errorMsg) setErrorMsg('');

        //////////
        //■[ バリデーション ]
        const {name, email, birthDate} = formData;
        let alertFlag = false;
        const birthDateObj = new Date(birthDate[0]);
        //・現在の値と比較
        // if(
        //     data.name===name[0] &&
        //     data.email===email[0] &&
        //     data.birthDate.toLocaleDateString()===birthDateObj.toLocaleDateString()
        // ){
        //     setIsSubmitting(false);
        //     return alert('変更の必要なし。現在の値と同じです。')
        // }
        //・name
        let result = validationForWord(name[0], 50);
        if(!result.result) {
            name[1] = result.message;
            alertFlag = true;
        }
        //・email
        result = validationForEmail(email[0]);
        if(!result.result) {
            email[1] = result.message;
            alertFlag = true;
        }
        //・birthDate
        const today = new Date();
        if(isNaN(birthDateObj.getTime())) {
            birthDate[1] = '有効な日付を入力してください';
            alertFlag = true;
        } else {
            const age = today.getFullYear() - birthDateObj.getFullYear();
            const monthDiff = today.getMonth() - birthDateObj.getMonth();
            const dayDiff = today.getDate() - birthDateObj.getDate();
            let actualAge = age;
            if(monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) actualAge--;
            
            if(actualAge < 18) {
                birthDate[1] = '18歳以上である必要があります';
                alertFlag = true;
            }
            if(birthDateObj > today) {
                birthDate[1] = '未来の日付は入力できません';
                alertFlag = true;
            }
        }
        //・反映
        if(alertFlag) {
            setFormData({name, email, birthDate});
            setErrorMsg('入力内容に問題があります');
            setIsSubmitting(false);
            return;
        }

        //////////
        //■[ 通信処理 ]
        try {
            const result = await updateBasicProfile({
                userId,
                userType,
                name: name[0].trim(),
                email: email[0].trim(),
                birthDate: birthDate[0]
            });

            if(result.success) {
                if(result.needsAuth) {
                    // メール認証が必要な場合
                    //setPendingEmail(email[0].trim());
                    setShowAuthModal(true);
                    alert('基本情報（氏名・生年月日）を保存しました。\nメールアドレス変更には認証が必要です。');
                } else {
                    // 通常の保存完了
                    alert('基本情報を保存しました');
                }
                setCompletionStatus(prev => ({...prev, basic: true}));
            } else {
                // 401エラー（認証エラー）の場合の特別処理
                if(result.statusCode === 401) {
                    alert('認証が失効しました。再度ログインしてください。');
                    router.push(`/auth/${userType}`);
                    return;
                }
                setErrorMsg(result.errMsg);
            }
        } catch(err) {
            const message = err instanceof Error ? err.message : '保存に失敗しました。もう一度お試しください。';
            alert(message);
            setErrorMsg(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    //////////
    //■[ 認証成功時のコールバック ]
    const handleAuthSuccess = () => {
        setShowAuthModal(false);
        setPrevEmail(formData.email[0]);
        alert('メールアドレスを更新しました');
    };

    //////////
    //■[ 認証キャンセル時のコールバック ]
    const handleAuthCancel = () => {
        setShowAuthModal(false);
        //setPendingEmail('');
        setFormData(prev => ({
            ...prev,
            email: [prevEmail, '']
        }));
        alert('メールアドレスの変更をキャンセルしました');
    };

    //////////
    //■[ 入力変更処理 ]
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputName = e.target.name as keyof BasicProfileFormType;
        const inputVal = e.target.value;
        setFormData({...formData, [inputName]: [inputVal, '']});
        if(errorMsg) setErrorMsg('');
    };

    return (
        <div className="space-y-6">
            {/* 説明 */}
            <p className="text-sm text-gray-600">
                基本的なアカウント情報です。この情報は必須項目となります。
            </p>

            {/* フォーム */}
            <div className="space-y-6">
                {/* 氏名 */}
                <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-900">
                        氏名 <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name[0]}
                        onChange={handleChange}
                        placeholder="お名前を入力してください"
                        className={`w-full p-3 bg-white border-2 ${
                            formData.name[1] ? 'border-red-500' : 'border-gray-200 hover:border-emerald-300 focus:border-emerald-500'
                        } focus:ring-4 focus:ring-emerald-500/20 rounded-xl text-gray-800 placeholder-gray-400 transition-all duration-300 focus:outline-none`}
                        disabled={isSubmitting}
                    />
                    {formData.name[1] && (
                        <span className="text-red-500 text-xs flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {formData.name[1]}
                        </span>
                    )}
                    <div className="text-xs text-gray-400 text-right">
                        {formData.name[0].length}/50文字
                    </div>
                </div>

                {/* メールアドレス */}
                <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-900">
                        メールアドレス <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email[0]}
                        onChange={handleChange}
                        placeholder="example@email.com"
                        className={`w-full p-3 bg-white border-2 ${
                            formData.email[1] ? 'border-red-500' : 'border-gray-200 hover:border-emerald-300 focus:border-emerald-500'
                        } focus:ring-4 focus:ring-emerald-500/20 rounded-xl text-gray-800 placeholder-gray-400 transition-all duration-300 focus:outline-none`}
                        disabled={isSubmitting}
                    />
                    {formData.email[1] && (
                        <span className="text-red-500 text-xs flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {formData.email[1]}
                        </span>
                    )}
                </div>

                {/* 生年月日 */}
                <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-900">
                        生年月日 <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        name="birthDate"
                        value={formData.birthDate[0]}
                        onChange={handleChange}
                        max={new Date().toISOString().split('T')[0]}
                        className={`w-full p-3 bg-white border-2 ${
                            formData.birthDate[1] ? 'border-red-500' : 'border-gray-200 hover:border-emerald-300 focus:border-emerald-500'
                        } focus:ring-4 focus:ring-emerald-500/20 rounded-xl text-gray-800 transition-all duration-300 focus:outline-none`}
                        disabled={isSubmitting}
                    />
                    {formData.birthDate[1] && (
                        <span className="text-red-500 text-xs flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {formData.birthDate[1]}
                        </span>
                    )}
                    <div className="text-xs text-gray-500">
                        18歳以上である必要があります
                    </div>
                </div>

                {/* 全体エラーメッセージ */}
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

                {/* 保存ボタン */}
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-4 rounded-xl font-bold shadow-lg hover:shadow-emerald-500/30 disabled:shadow-none transition-all duration-300 hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed transform"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 group-disabled:opacity-0 transition-opacity duration-300"></div>
                    <div className="relative flex items-center justify-center gap-3">
                        {isSubmitting ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>保存中...</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <span>基本情報を保存</span>
                            </>
                        )}
                    </div>
                </button>
            </div>

            {/* 認証モーダル */}
            {showAuthModal && (
                <AuthenticationModal
                    userType={userType}
                    type="email"
                    value={formData.email[0]}
                    onSuccess={handleAuthSuccess}
                    onCancel={handleAuthCancel}
                />
            )}
        </div>
    )
}

export default BasicProfileForm;