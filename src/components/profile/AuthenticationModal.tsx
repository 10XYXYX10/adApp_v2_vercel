'use client'
// src/components/common/profile/AuthenticationModal.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SpinnerModal from "@/components/SpinnerModal";
import { validationForAuthenticationPassword } from "@/lib/seculity/validation";
import { receive2FACode } from "@/actions/profile/profileActions";


const AuthenticationModal = ({
    userType,
    type,
    value,
    onSuccess,
    onCancel,
}:{
    userType: 'advertiser' | 'admin'
    type: 'email' | 'phone'
    value: string
    onSuccess: () => void
    onCancel: () => void
}) => {
    const router = useRouter();
    //////////
    //■[ State管理 ]
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [authCode, setAuthCode] = useState('');
    const [timeLeft, setTimeLeft] = useState(180); // 3分 = 180秒
    
    //////////
    //■[ カウントダウンタイマー ]
    useEffect(() => {
        if(timeLeft <= 0) return;
        
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if(prev <= 1) {
                    setErrorMsg('認証時間が終了しました。もう一度お試しください。');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    //////////
    //■[ 認証処理 ]
    const handleSubmit = async() => {
        if(isSubmitting) return;
        
        setIsSubmitting(true);
        if(errorMsg) setErrorMsg('');

        //////////
        //■[ バリデーション ]
        const validation = validationForAuthenticationPassword(authCode);
        if(!validation.result) {
            setErrorMsg(validation.message);
            setIsSubmitting(false);
            return;
        }

        //////////
        //■[ 認証確認 ]
        try {
            const result = await receive2FACode({
                userType,
                type,
                value,
                authenticationPassword: authCode
            });

            if(result.success) {
                onSuccess();
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
            const message = err instanceof Error ? err.message : '認証に失敗しました。もう一度お試しください。';
            setErrorMsg(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    //////////
    //■[ 入力変更処理 ]
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputVal = e.target.value.replace(/\D/g, '').slice(0, 6); // 数字のみ6桁まで
        setAuthCode(inputVal);
        if(errorMsg) setErrorMsg('');
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const displayValue = type === 'email' ? value : `****-****-${value.slice(-4)}`;

    return (<>
        {isSubmitting && <SpinnerModal/>}
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
            <div className="bg-white rounded-3xl shadow-2xl border border-white/50 w-full max-w-md mx-auto relative overflow-hidden my-auto">
                {/* 背景装飾 */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/80 via-teal-50/60 to-cyan-50/40"></div>
                
                {/* ヘッダー */}
                <div className="relative z-10 p-6 border-b border-emerald-100/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center">
                                {type === 'email' ? (
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                )}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">2段階認証</h2>
                                <p className="text-sm text-gray-600">認証コードを入力してください</p>
                            </div>
                        </div>
                        <button
                            onClick={onCancel}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* コンテンツ */}
                <div className="relative z-10 p-6 space-y-6">
                    {/* 送信先表示 */}
                    <div className="text-center">
                        <p className="text-gray-600 mb-2">認証コードを送信しました</p>
                        <p className="font-bold text-gray-900 bg-gray-50 rounded-lg p-3">
                            {displayValue}
                        </p>
                    </div>

                    {/* タイマー */}
                    <div className="text-center">
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                            timeLeft > 60 ? 'bg-green-100 text-green-700' : 
                            timeLeft > 30 ? 'bg-yellow-100 text-yellow-700' : 
                            'bg-red-100 text-red-700'
                        }`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-bold">{formatTime(timeLeft)}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">認証コードの有効期限</p>
                    </div>

                    {/* 認証コード入力 */}
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-900">
                            認証コード（6桁）
                        </label>
                        <input
                            type="text"
                            value={authCode}
                            onChange={handleChange}
                            placeholder="123456"
                            maxLength={6}
                            className={`w-full p-4 text-center text-2xl font-bold tracking-widest bg-white border-2 ${
                                errorMsg ? 'border-red-500' : 'border-gray-200 hover:border-emerald-300 focus:border-emerald-500'
                            } focus:ring-4 focus:ring-emerald-500/20 rounded-xl transition-all duration-300 focus:outline-none`}
                            disabled={isSubmitting || timeLeft <= 0}
                        />
                        <div className="text-xs text-gray-500 text-right">
                            {authCode.length}/6文字
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

                    {/* ボタン */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 px-4 py-3 bg-white hover:bg-gray-50 border-2 border-gray-300 hover:border-gray-400 text-gray-700 rounded-xl font-bold transition-all duration-300"
                        >
                            キャンセル
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting || authCode.length !== 6 || timeLeft <= 0}
                            className="flex-1 group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-4 py-3 rounded-xl font-bold shadow-lg hover:shadow-emerald-500/30 disabled:shadow-none transition-all duration-300 hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed transform"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 group-disabled:opacity-0 transition-opacity duration-300"></div>
                            <div className="relative flex items-center justify-center gap-2">
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>認証中...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>認証</span>
                                    </>
                                )}
                            </div>
                        </button>
                    </div>
                </div>

                {/* 装飾要素 */}
                <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-emerald-400/20 to-teal-500/20 rounded-full blur-lg"></div>
                <div className="absolute bottom-4 left-4 w-8 h-8 bg-gradient-to-br from-teal-400/20 to-cyan-500/20 rounded-full blur-lg"></div>
            </div>
        </div>
    </>)
}

export default AuthenticationModal;