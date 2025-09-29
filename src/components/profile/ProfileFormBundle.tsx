'use client'
// src/components/profile/ProfileFormBundle.tsx
import { useState } from "react";

import { ProfileDetail, ProfileCompletionStatus } from "@/lib/types/profile/profileTypes";

import BasicProfileForm from "./forms/BasicProfileForm";//L98
import BusinessInfoForm from "./forms/BusinessInfoForm";//L125
import AddressFormV2 from "./forms/AddressFormV2";//L154
import PhoneForm from "./forms/PhoneForm";//L191

//////////
//■[ コンポーネント外定義（パフォーマンス最適化） ]
const FORM_SECTIONS = [
    {key: 'basic', label: '基本情報', required: true},
    {key: 'business', label: '事業者情報', required: false},
    {key: 'address', label: '住所情報', required: false},
    {key: 'phone', label: '電話番号', required: false}
] as const;

const ProfileFormBundle = ({
    userType,
    userId,
    initialData,
}:{
    userType: 'advertiser' | 'admin'
    userId: number
    initialData: ProfileDetail
}) => {
    //////////
    //■[ 進捗状態管理 ]
    const [completionStatus, setCompletionStatus] = useState<ProfileCompletionStatus>({
        basic: true, // 基本情報は必須のため常にtrue
        business: !!(initialData.businessType && initialData.companyName && initialData.representativeName),
        address: !!(initialData.address?.country && initialData.address?.city),
        phone: !!initialData.phone
    });

    const completedCount = Object.values(completionStatus).filter(Boolean).length;
    const progressPercentage = (completedCount / 4) * 100;

    return (
        <div className="space-y-8">
            {/* 進捗インジケーター */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">設定進捗</h2>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                                className="bg-gradient-to-r from-emerald-500 to-teal-600 h-3 rounded-full transition-all duration-500"
                                style={{width: `${progressPercentage}%`}}
                            ></div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-emerald-600">{completedCount}/4</div>
                        <div className="text-sm text-gray-500">完了</div>
                    </div>
                </div>
                
                {/* ステータスバッジ */}
                <div className="flex flex-wrap gap-3 mt-4">
                    {FORM_SECTIONS.map(({key, label, required}) => (
                        <div key={key} className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                            completionStatus[key as keyof ProfileCompletionStatus]
                                ? 'bg-emerald-100 text-emerald-700'
                                : required 
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-gray-100 text-gray-500'
                        }`}>
                            <div className={`w-2 h-2 rounded-full ${
                                completionStatus[key as keyof ProfileCompletionStatus] ? 'bg-emerald-500' : 'bg-gray-400'
                            }`}></div>
                            {label}
                            {required && <span className="text-red-500 ml-1">*</span>}
                        </div>
                    ))}
                </div>
            </div>

            {/* フォームグリッド */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 基本情報フォーム */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-white">基本情報</h3>
                            <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">必須</span>
                        </div>
                    </div>
                    <div className="p-6">
                        <BasicProfileForm
                            userType={userType}
                            userId={userId}
                            data={{
                                name: initialData.name,
                                email: initialData.email,
                                birthDate: initialData.birthDate
                            }}
                            setCompletionStatus={setCompletionStatus}
                        />
                    </div>
                </div>

                {/* 事業者情報フォーム */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-white">事業者情報</h3>
                            <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">任意</span>
                        </div>
                    </div>
                    <div className="p-6">
                        <BusinessInfoForm
                            userType={userType}
                            userId={userId}
                            data={{
                                businessType: initialData.businessType,
                                companyName: initialData.companyName,
                                representativeName: initialData.representativeName,
                                businessNumber: initialData.businessNumber
                            }}
                            setCompletionStatus={setCompletionStatus}
                        />
                    </div>
                </div>

                {/* 住所情報フォーム */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-white">住所情報</h3>
                            <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">任意</span>
                        </div>
                    </div>
                    <div className="p-6">
                        <AddressFormV2
                            userType={userType}
                            userId={userId}
                            data={initialData.address ? {
                                country: initialData.address.country,
                                postalCode: initialData.address.postalCode,
                                state: initialData.address.state,
                                city: initialData.address.city,
                                addressLine1: initialData.address.addressLine1,
                                addressLine2: initialData.address.addressLine2
                            } : {
                                country: null,
                                postalCode: null,
                                state: null,
                                city: null,
                                addressLine1: null,
                                addressLine2: null
                            }}
                            setCompletionStatus={setCompletionStatus}
                        />
                    </div>
                </div>

                {/* 電話番号フォーム */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-orange-500 to-red-600 p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-white">電話番号</h3>
                            <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">任意</span>
                        </div>
                    </div>
                    <div className="p-6">
                        <PhoneForm
                            userType={userType}
                            userId={userId}
                            phoneLastNumber={initialData.phone ? initialData.phone.phoneLastNumber : ''}
                            setCompletionStatus={setCompletionStatus}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileFormBundle;