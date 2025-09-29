'use client'
// src/components/common/profile/forms/AddressFormV2.tsx
import { memo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import SpinnerModal from "@/components/SpinnerModal";

import { AddressFormType, AddressData, ProfileCompletionStatus } from "@/lib/types/profile/profileTypes";
import { validationForBuildingName } from "@/lib/seculity/validationAddress";

import { getAddressByPostalCode } from "@/actions/address/addressActions";
import { updateAddress } from "@/actions/profile/profileActions";

const AddressFormV2 = memo( ({
    userType,
    userId,
    data,
    setCompletionStatus,
}:{
    userType: 'advertiser' | 'admin'
    userId: number
    data: AddressData
    setCompletionStatus: React.Dispatch<React.SetStateAction<ProfileCompletionStatus>>
}) => {
    const router = useRouter();
    //////////
    //■[ State管理 ]
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isPostalCodeLoading, setIsPostalCodeLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [isAddressLoaded, setIsAddressLoaded] = useState(!!data.postalCode); // 既存データがある場合はtrue
    const [formData, setFormData] = useState<AddressFormType>({
        country: ['日本', ''],
        postalCode: [data.postalCode || '', ''],
        state: [data.state || '', ''],
        city: [data.city || '', ''],
        addressLine1: [data.addressLine1 || '', ''],
        addressLine2: [data.addressLine2 || '', '']
    });
    
    //////////
    //■[ 郵便番号自動補完処理 ]
    const handlePostalCodeLookup = useCallback(async (postalCode: string) => {
        //・7桁の半角数字チェック
        const cleanCode = postalCode.replace(/[-\s]/g, '');
        if (cleanCode.length !== 7 || !/^\d{7}$/.test(cleanCode)) return;
        
        setIsPostalCodeLoading(true);
        try {
            const result = await getAddressByPostalCode(cleanCode);
            
            if (result.success && result.addressData) {
                //・住所情報を自動補完
                setFormData(prev => ({
                    ...prev,
                    state: [result.addressData!.prefecture, ''],
                    city: [result.addressData!.city, ''],
                    addressLine1: [result.addressData!.town, '']
                    // addressLine2は自動補完しない（ユーザー入力）
                }));
                setIsAddressLoaded(true);
                if (errorMsg) setErrorMsg('');
            } else {
                alert(result.errMsg);
                setFormData({...formData,postalCode:[postalCode,result.errMsg]})
                setErrorMsg(result.errMsg);
                setIsAddressLoaded(false);
            }
        } catch (err) {
            const errVal = `住所検索中にエラーが発生しました。${err instanceof Error && err.message}`;
            alert(errVal);
            setFormData({...formData,postalCode:[postalCode,errVal]})
            setErrorMsg(errVal);
            setIsAddressLoaded(false);
        } finally {
            setIsPostalCodeLoading(false);
        }
    }, []);
    
    //////////
    //■[ 送信処理 ]
    const handleSubmit = async() => {
        if (isSubmitting) return;
        
        const confirmed = confirm('この内容で保存しますか？');
        if (!confirmed) return;
        
        setIsSubmitting(true);
        if (errorMsg) setErrorMsg('');

        //////////
        //■[ バリデーション ]
        const {country, postalCode, state, city, addressLine1, addressLine2} = formData;
        let alertFlag = false;
        
        //・country（固定値なのでバリデーション不要）
        
        //・postalCode（必須）
        if (!postalCode[0] || !postalCode[0].trim()) {
            postalCode[1] = '郵便番号を入力してください';
            alertFlag = true;
        } else {
            const cleanCode = postalCode[0].replace(/[-\s]/g, '');
            if (cleanCode.length !== 7 || !/^\d{7}$/.test(cleanCode)) {
                postalCode[1] = '郵便番号は7桁の半角数字で入力してください';
                alertFlag = true;
            }
        }
        
        //・city（必須・自動補完済み想定）
        if (!city[0] || !city[0].trim()) {
            city[1] = '市区町村を入力してください';
            alertFlag = true;
        }
        
        //・addressLine2（任意・ユーザー入力）
        if (addressLine2[0] && addressLine2[0].trim()) {
            const result = validationForBuildingName(addressLine2[0], 200);
            if (!result.result) {
                addressLine2[1] = result.message;
                alertFlag = true;
            }
        }

        if (alertFlag) {
            setFormData({country, postalCode, state, city, addressLine1, addressLine2});
            alert('入力内容に問題があります')
            setErrorMsg('入力内容に問題があります');
            setIsSubmitting(false);
            return;
        }

        //////////
        //■[ 通信処理 ]
        try {
            const result = await updateAddress({
                userId,
                userType,
                country: country[0].trim(),
                postalCode: postalCode[0].trim(),
                state: state[0].trim(),
                city: city[0].trim(),
                addressLine1: addressLine1[0].trim(),
                addressLine2: addressLine2[0].trim()
            });

            if (result.success) {
                alert('住所情報を保存しました');
                setCompletionStatus(prev => ({...prev, address: true}));
            } else {
                // 401エラー（認証エラー）の場合の特別処理
                if (result.statusCode === 401) {
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
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputName = e.target.name as keyof AddressFormType;
        const inputVal = e.target.value;
        
        //・郵便番号の場合は自動補完実行
        if (inputName === 'postalCode') {
            const inputValLength = inputVal.length;
            //7字以上拒否
            if(inputValLength>7){
                alert('郵便番号: 7字以上は入力できません')
            }else if(inputValLength===7){
                setFormData({...formData, [inputName]: [inputVal, '']});
                handlePostalCodeLookup(inputVal);
            }else{
                setFormData({...formData, [inputName]: [inputVal, `不足「${7-inputValLength}」`]});
            }
        } else {
            setFormData({...formData, [inputName]: [inputVal, '']});
        }
        
        if (errorMsg) setErrorMsg('');
    };

    return (<>
        {isSubmitting && <SpinnerModal/>}
        <div className="space-y-6">
            {/* 説明 */}
            <div className="space-y-3">
                <p className="text-sm text-gray-600">
                    住所情報は任意です。請求書送付や法的手続きが必要な場合にご登録ください。
                </p>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <p className="text-sm text-blue-800 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        現在は日本国内の住所のみ対応しております。海外展開時には対応予定です。
                    </p>
                </div>
            </div>

            {/* フォーム */}
            <div className="space-y-6">
                {/* 国・地域（固定） */}
                <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-900">
                        国・地域
                    </label>
                    <input
                        type="text"
                        name="country"
                        value={formData.country[0]}
                        readOnly
                        className="w-full p-3 bg-gray-100 border-2 border-gray-200 rounded-xl text-gray-600 cursor-not-allowed"
                    />
                    <div className="text-xs text-gray-500">
                        ※ 現在は日本のみ対応
                    </div>
                </div>

                {/* 郵便番号 */}
                <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-900">
                        郵便番号 <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            name="postalCode"
                            value={formData.postalCode[0]}
                            onChange={handleChange}
                            maxLength={7}
                            placeholder="例: 1234567 または 123-4567"
                            className={`
                                w-full p-3 bg-white border-2 
                                ${
                                    formData.postalCode[1] 
                                        ? 'border-red-500' 
                                        : 'border-gray-200 hover:border-purple-300 focus:border-purple-500'
                                } 
                                ${(isSubmitting||isPostalCodeLoading) && 'cursor-not-allowed'}
                                focus:ring-4 focus:ring-purple-500/20 rounded-xl text-gray-800 placeholder-gray-400 transition-all duration-300 focus:outline-none
                            `}
                            disabled={isSubmitting || isPostalCodeLoading}
                        />
                        {isPostalCodeLoading && (
                            <div className="absolute right-3 top-1/2 transform -y-1/2">
                                <div className="w-5 h-5 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
                            </div>
                        )}
                    </div>
                    {formData.postalCode[1] && (
                        <span className="text-red-500 text-xs flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {formData.postalCode[1]}
                        </span>
                    )}
                    <div className="text-xs text-gray-400">
                        郵便番号を入力すると住所が自動補完されます
                    </div>
                </div>

                {/* 以下の住所フィールドは郵便番号入力後に表示 */}
                <div className={`space-y-6 transition-all duration-500 ${
                    isAddressLoaded ? 'opacity-100' : 'opacity-40 pointer-events-none'
                }`}>
                    {/* 都道府県・州 */}
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-900">
                            都道府県・州 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="state"
                            value={formData.state[0]}
                            readOnly
                            className="w-full p-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-700 cursor-not-allowed"
                            disabled={!isAddressLoaded}
                        />
                        <div className="text-xs text-gray-500">
                            ※ 郵便番号から自動設定
                        </div>
                    </div>

                    {/* 市区町村 */}
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-900">
                            市区町村 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city[0]}
                            readOnly
                            className="w-full p-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-700 cursor-not-allowed"
                            disabled={!isAddressLoaded}
                        />
                        {formData.city[1] && (
                            <span className="text-red-500 text-xs flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {formData.city[1]}
                            </span>
                        )}
                        <div className="text-xs text-gray-500">
                            ※ 郵便番号から自動設定
                        </div>
                    </div>

                    {/* 住所1行目 */}
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-900">
                            住所1行目（町名）
                        </label>
                        <input
                            type="text"
                            name="addressLine1"
                            value={formData.addressLine1[0]}
                            readOnly
                            className="w-full p-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-700 cursor-not-allowed"
                            disabled={!isAddressLoaded}
                        />
                        <div className="text-xs text-gray-500">
                            ※ 郵便番号から自動設定
                        </div>
                    </div>

                    {/* 住所2行目（修正可能） */}
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-900">
                            住所2行目（建物名・部屋番号など）
                        </label>
                        <input
                            type="text"
                            name="addressLine2"
                            value={formData.addressLine2[0]}
                            onChange={handleChange}
                            placeholder="例: パークビル5F、○○マンション101号室"
                            className={`w-full p-3 bg-white border-2 ${
                                formData.addressLine2[1] ? 'border-red-500' : 'border-gray-200 hover:border-purple-300 focus:border-purple-500'
                            } focus:ring-4 focus:ring-purple-500/20 rounded-xl text-gray-800 placeholder-gray-400 transition-all duration-300 focus:outline-none`}
                            disabled={isSubmitting || !isAddressLoaded}
                        />
                        {formData.addressLine2[1] && (
                            <span className="text-red-500 text-xs flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {formData.addressLine2[1]}
                            </span>
                        )}
                        <div className="text-xs text-gray-400 text-right">
                            {formData.addressLine2[0].length}/200文字
                        </div>
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
                    disabled={isSubmitting || !isAddressLoaded}
                    className="w-full group relative overflow-hidden bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-4 rounded-xl font-bold shadow-lg hover:shadow-purple-500/30 disabled:shadow-none transition-all duration-300 hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed transform"
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
                                <span>住所情報を保存</span>
                            </>
                        )}
                    </div>
                </button>
            </div>
        </div>
    </>)
} )
AddressFormV2.displayName = 'AddressFormV2';
export default AddressFormV2;