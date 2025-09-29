'use client'
// src/components/common/profile/forms/PhoneForm.tsx
import { useState } from "react";
import { useRouter } from "next/navigation";
import { validationForPhoneNumber } from "@/lib/seculity/validation";
import { PhoneFormType, ProfileCompletionStatus } from "@/lib/types/profile/profileTypes";

import AuthenticationModal from "../AuthenticationModal";
import SpinnerModal from "@/components/SpinnerModal";

import { updatePhoneNumber } from "@/actions/profile/profileActions";



const PhoneForm = ({
    userType,
    userId,
    phoneLastNumber,
    setCompletionStatus,
}:{
    userType: 'advertiser' | 'admin'
    userId: number
    phoneLastNumber: string
    setCompletionStatus: React.Dispatch<React.SetStateAction<ProfileCompletionStatus>>
}) => {
    const router = useRouter();

    //////////
    //■[ State管理 ]
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [formData, setFormData] = useState<PhoneFormType>({
        phoneNumber: ['', '']
    });
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [lastNumber,setLastNumber] = useState(phoneLastNumber);
    //const [pendingPhoneNumber, setPendingPhoneNumber] = useState('');
    
    //////////
    //■[ 送信処理（SMS認証開始） ]
    const handleSubmit = async() => {
        if(isSubmitting) return;
        const confirmed = confirm(
            lastNumber ? '電話番号は既に登録済みで。更新しますか？' : 'この電話番号にSMS認証コードを送信しますか？'
        );
        if(!confirmed) return;
        
        setIsSubmitting(true);
        if(errorMsg) setErrorMsg('');

        //////////
        //■[ バリデーション ]
        const {phoneNumber} = formData;
        const result = validationForPhoneNumber(phoneNumber[0]);
        if(!result.result) {
            phoneNumber[1] = result.message;
            setFormData({phoneNumber});
            setErrorMsg('入力内容に問題があります');
            setIsSubmitting(false);
            return;
        }

        //////////
        //■[ SMS認証開始 ]
        try {
            const result = await updatePhoneNumber({
                userId,
                userType,
                phoneNumber: phoneNumber[0].trim()
            });

            if(result.success) {
                setShowAuthModal(true);
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
            const message = err instanceof Error ? err.message : 'SMS送信に失敗しました。もう一度お試しください。';
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
        setCompletionStatus(prev => ({...prev, phone: true}));
        setLastNumber(formData.phoneNumber[0].trim().slice(-4))
        alert('電話番号を更新しました');
    };

    //////////
    //■[ 認証キャンセル時のコールバック ]
    const handleAuthCancel = () => {
        setShowAuthModal(false);
        setLastNumber('');
    };

    //////////
    //■[ 入力変更処理 ]
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputName = e.target.name as keyof PhoneFormType;
        const inputVal = e.target.value;
        setFormData({...formData, [inputName]: [inputVal, '']});
        if(errorMsg) setErrorMsg('');
    };

    const isRegistered = formData.phoneNumber[0] === '登録済み';

    return (<>
        {isSubmitting && <SpinnerModal/>}
        <div className={`
            space-y-6
            ${showAuthModal && "min-h-[500px]"}
        `}>
            {/* 説明 */}
            <p className="text-sm text-gray-600">
                電話番号は任意です。SMS認証による本人確認が行われます。
            </p>

            {/* フォーム */}
            <div className="space-y-6">
                {/* 電話番号 */}
                <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-900">
                        {lastNumber ? `xxx-xxxx-${lastNumber}` : '携帯電話番号'}
                    </label>
                    <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber[0]}
                        onChange={handleChange}
                        placeholder={lastNumber ? `xxx-xxxx-${lastNumber}` : "09012345678"}
                        disabled={isSubmitting || isRegistered}
                        className={`w-full p-3 bg-white border-2 ${
                            formData.phoneNumber[1] ? 'border-red-500' : 
                            isRegistered ? 'border-green-300 bg-green-50' :
                            'border-gray-200 hover:border-orange-300 focus:border-orange-500'
                        } focus:ring-4 focus:ring-orange-500/20 rounded-xl text-gray-800 placeholder-gray-400 transition-all duration-300 focus:outline-none ${
                            isRegistered ? 'cursor-not-allowed' : ''
                        }`}
                    />
                    {formData.phoneNumber[1] && (
                        <span className="text-red-500 text-xs flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {formData.phoneNumber[1]}
                        </span>
                    )}
                    <div className="text-xs text-gray-500">
                        日本国内の携帯電話番号（070/080/090）を入力してください
                    </div>
                    {isRegistered && (
                        <div className="flex items-center gap-2 text-xs text-green-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            SMS認証済み
                        </div>
                    )}
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

                {/* SMS送信ボタン */}
                {!isRegistered && (
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full group relative overflow-hidden bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-4 rounded-xl font-bold shadow-lg hover:shadow-orange-500/30 disabled:shadow-none transition-all duration-300 hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed transform"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 group-disabled:opacity-0 transition-opacity duration-300"></div>
                        <div className="relative flex items-center justify-center gap-3">
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>SMS送信中...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <span>SMS認証を開始</span>
                                </>
                            )}
                        </div>
                    </button>
                )}
            </div>
        </div>

        {/* 認証モーダル */}
        {showAuthModal && (
            <AuthenticationModal
                userType={userType}
                type="phone"
                value={formData.phoneNumber[0]}
                onSuccess={handleAuthSuccess}
                onCancel={handleAuthCancel}
            />
        )}
    </>)
}
export default PhoneForm;