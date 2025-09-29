'use client'
// src/components/common/profile/forms/BusinessInfoForm.tsx
import { memo, useState } from "react";
import { useRouter } from "next/navigation";
import { validationForWord } from "@/lib/seculity/validation";
import { BusinessInfoFormType, BusinessInfoData, ProfileCompletionStatus } from "@/lib/types/profile/profileTypes";
import SpinnerModal from "@/components/SpinnerModal";
import { updateBusinessInfo } from "@/actions/profile/profileActions";

const BusinessInfoForm = memo( ({
    userType,
    userId,
    data,
    setCompletionStatus,
}:{
    userType: 'advertiser' | 'admin'
    userId: number
    data: BusinessInfoData
    setCompletionStatus: React.Dispatch<React.SetStateAction<ProfileCompletionStatus>>
}) => {
    const router = useRouter();
    //////////
    //■[ State管理 ]
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [formData, setFormData] = useState<BusinessInfoFormType>({
        businessType: [data.businessType || '', ''],
        companyName: [data.companyName || '', ''],
        representativeName: [data.representativeName || '', ''],
        businessNumber: [data.businessNumber || '', '']
    });

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
        const {businessType, companyName, representativeName, businessNumber} = formData;
        let alertFlag = false;

        //・businessType
        if(!businessType[0] || (businessType[0] !== 'individual' && businessType[0] !== 'corporate')) {
            businessType[1] = '事業形態を選択してください';
            alertFlag = true;
        }

        //・companyName（屋号/会社名）
        let result = validationForWord(companyName[0], 100);
        if(!result.result) {
            companyName[1] = result.message;
            alertFlag = true;
        }

        //・representativeName
        result = validationForWord(representativeName[0], 50);
        if(!result.result) {
            representativeName[1] = result.message;
            alertFlag = true;
        }

        //・businessNumber（任意）
        if(businessNumber[0] && businessNumber[0].trim()) {
            result = validationForWord(businessNumber[0], 50);
            if(!result.result) {
                businessNumber[1] = result.message;
                alertFlag = true;
            }
        }

        if(alertFlag) {
            setFormData({businessType, companyName, representativeName, businessNumber});
            setErrorMsg('入力内容に問題があります');
            setIsSubmitting(false);
            return;
        }

        //////////
        //■[ 通信処理 ]
        try {
            const result = await updateBusinessInfo({
                userId,
                userType,
                businessType: businessType[0] as 'individual' | 'corporate',
                companyName: companyName[0].trim(),
                representativeName: representativeName[0].trim(),
                businessNumber: businessNumber[0].trim()
            });

            if(result.success) {
                alert('事業者情報を保存しました');
                setCompletionStatus(prev => ({...prev, business: true}));
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
    //■[ 入力変更処理 ]
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const inputName = e.target.name as keyof BusinessInfoFormType;
        const inputVal = e.target.value;
        setFormData({...formData, [inputName]: [inputVal, '']});
        if(errorMsg) setErrorMsg('');
    };

    const isIndividual = formData.businessType[0] === 'individual';
    const isCorporate = formData.businessType[0] === 'corporate';

    return (<>
        {isSubmitting && <SpinnerModal/>}
        <div className="space-y-6">
            {/* 説明 */}
            <p className="text-sm text-gray-600">
                事業者情報は任意です。法人契約や税務処理が必要な場合にご登録ください。
            </p>

            {/* フォーム */}
            <div className="space-y-6">
                {/* 事業形態 */}
                <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-900">
                        事業形態 <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="businessType"
                        value={formData.businessType[0]}
                        onChange={handleChange}
                        className={`w-full appearance-none p-3 bg-white border-2 ${
                            formData.businessType[1] ? 'border-red-500' : 'border-gray-200 hover:border-blue-300 focus:border-blue-500'
                        } focus:ring-4 focus:ring-blue-500/20 rounded-xl text-gray-800 transition-all duration-300 focus:outline-none cursor-pointer`}
                        disabled={isSubmitting}
                    >
                        <option value="">事業形態を選択してください</option>
                        <option value="individual">👤 個人事業主</option>
                        <option value="corporate">🏢 法人</option>
                    </select>
                    {formData.businessType[1] && (
                        <span className="text-red-500 text-xs flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {formData.businessType[1]}
                        </span>
                    )}
                </div>

                {/* 屋号/会社名 */}
                {(isIndividual || isCorporate) && (
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-900">
                            {isIndividual ? '屋号' : '会社名'} <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="companyName"
                            value={formData.companyName[0]}
                            onChange={handleChange}
                            placeholder={isIndividual ? '屋号を入力してください（任意）' : '会社名を入力してください'}
                            className={`w-full p-3 bg-white border-2 ${
                                formData.companyName[1] ? 'border-red-500' : 'border-gray-200 hover:border-blue-300 focus:border-blue-500'
                            } focus:ring-4 focus:ring-blue-500/20 rounded-xl text-gray-800 placeholder-gray-400 transition-all duration-300 focus:outline-none`}
                            disabled={isSubmitting}
                        />
                        {formData.companyName[1] && (
                            <span className="text-red-500 text-xs flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {formData.companyName[1]}
                            </span>
                        )}
                        <div className="text-xs text-gray-400 text-right">
                            {formData.companyName[0].length}/100文字
                        </div>
                    </div>
                )}

                {/* 代表者氏名 */}
                {(isIndividual || isCorporate) && (
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-900">
                            {isIndividual ? '氏名' : '代表者氏名'} <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="representativeName"
                            value={formData.representativeName[0]}
                            onChange={handleChange}
                            placeholder={isIndividual ? 'お名前を入力してください' : '代表者氏名を入力してください'}
                            className={`w-full p-3 bg-white border-2 ${
                                formData.representativeName[1] ? 'border-red-500' : 'border-gray-200 hover:border-blue-300 focus:border-blue-500'
                            } focus:ring-4 focus:ring-blue-500/20 rounded-xl text-gray-800 placeholder-gray-400 transition-all duration-300 focus:outline-none`}
                            disabled={isSubmitting}
                        />
                        {formData.representativeName[1] && (
                            <span className="text-red-500 text-xs flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {formData.representativeName[1]}
                            </span>
                        )}
                        <div className="text-xs text-gray-400 text-right">
                            {formData.representativeName[0].length}/50文字
                        </div>
                    </div>
                )}

                {/* 事業者番号 */}
                {(isIndividual || isCorporate) && (
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-900">
                            {isIndividual ? '個人事業主番号' : '法人番号'}
                        </label>
                        <input
                            type="text"
                            name="businessNumber"
                            value={formData.businessNumber[0]}
                            onChange={handleChange}
                            placeholder={isIndividual ? '個人事業主番号（任意）' : '13桁の法人番号（任意）'}
                            className={`w-full p-3 bg-white border-2 ${
                                formData.businessNumber[1] ? 'border-red-500' : 'border-gray-200 hover:border-blue-300 focus:border-blue-500'
                            } focus:ring-4 focus:ring-blue-500/20 rounded-xl text-gray-800 placeholder-gray-400 transition-all duration-300 focus:outline-none`}
                            disabled={isSubmitting}
                        />
                        {formData.businessNumber[1] && (
                            <span className="text-red-500 text-xs flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {formData.businessNumber[1]}
                            </span>
                        )}
                        <div className="text-xs text-gray-500">
                            {isIndividual ? '開業届に記載の番号' : '国税庁から付与される13桁の番号'}
                        </div>
                        <div className="text-xs text-gray-400 text-right">
                            {formData.businessNumber[0].length}/50文字
                        </div>
                    </div>
                )}

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
                {(isIndividual || isCorporate) && (
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full group relative overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-4 rounded-xl font-bold shadow-lg hover:shadow-blue-500/30 disabled:shadow-none transition-all duration-300 hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed transform"
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
                                    <span>事業者情報を保存</span>
                                </>
                            )}
                        </div>
                    </button>
                )}
            </div>
        </div>
    </>)
} )
BusinessInfoForm.displayName = 'BusinessInfoForm';
export default BusinessInfoForm;