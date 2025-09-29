'use client'
// src/components/point/advertiser/PurchaseEntryForm.tsx
import { useState } from 'react'
import PointsDisplay from '../../PointsDisplay'
import { PaymentType } from '@/lib/types/payment/paymentTypes'
import { PurchaseEntryFormType } from '@/lib/types/payment/crypt/cryptTypes'
import CryptoPurchaseForm from './CryptoPurchaseForm'


const PRESET_AMOUNTS = [500, 1000, 3000, 5000, 10000, 20000, 50000]
const MIN_AMOUNT = 100
const MAX_AMOUNT = 100000

export default function PurchaseEntryForm({
    advertiserId, 
    paymentType 
}:{
    advertiserId: number
    paymentType: PaymentType
}) {

    //////////
    //■[ フォーム状態 ]
    const [formData, setFormData] = useState<PurchaseEntryFormType>({
        amount: [500, ''],
        agreedToTerms: [false, ''],
    })
    const [errorMsg, setErrorMsg] = useState('')
    const [processingData,setProcessingData] = useState<'entry'|'purchase'>('entry')

    //////////
    //■[ 入力変更処理 ]
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputName = e.target.name as keyof PurchaseEntryFormType
        let inputVal: number | boolean
        
        if (inputName === 'amount') {
            inputVal = Number(e.target.value)
            let errorMessage = ''
            if (isNaN(inputVal) || inputVal <= 0) {
                errorMessage = '有効な金額を入力してください'
            } else if (inputVal < MIN_AMOUNT) {
                errorMessage = `最小購入額は¥${MIN_AMOUNT.toLocaleString()}です`
            } else if (inputVal > MAX_AMOUNT) {
                errorMessage = `最大購入額は¥${MAX_AMOUNT.toLocaleString()}です`
            }
            setFormData({...formData, [inputName]: [inputVal, errorMessage]})
        } else {
            inputVal = e.target.checked
            setFormData({...formData, [inputName]: [inputVal, '']})
        }
        if (errorMsg) setErrorMsg('')
    }

    //////////
    //■[ 決済処理 ]
    const handlePurchase = async () => {
        if (processingData!=='entry') return

        //////////
        //■[ バリデーション ]
        const { amount, agreedToTerms } = formData
        let alertFlag = false
        //・利用規約同意チェック
        if (!agreedToTerms[0]) {
            agreedToTerms[1] = '利用規約に同意してください';
            alertFlag = true
        }
        //・金額バリデーション
        if (isNaN(amount[0]) || amount[0] <= 0) {
            amount[1] = '有効な金額を入力してください'
        } else if (amount[0] < MIN_AMOUNT) {
            amount[1] = `最小購入額は¥${MIN_AMOUNT.toLocaleString()}です`
        } else if (amount[0] > MAX_AMOUNT) {
            amount[1] = `最大購入額は¥${MAX_AMOUNT.toLocaleString()}です`
        }
        //・エラーがある場合は処理を停止
        if (agreedToTerms[1] || amount[1]) {
            setErrorMsg('入力内容に問題があります');
            setFormData({agreedToTerms,amount})
            return
        }

        setProcessingData('purchase')

    }

    //////////
    //■[ 手数料計算 ]
    const getFee = () => {
        if (paymentType === 'credit') return Math.ceil(formData.amount[0] * 0.035) // 3.5%手数料
        return Math.ceil(formData.amount[0] * 0.015) // 1.5%手数料
    }

    //////////
    //■[ 合計金額 ]
    const getTotalAmount = () => {
        return formData.amount[0] + getFee()
    }

    if(processingData==='entry'){
        return (
            <div className="space-y-8">
                {/* 現在のポイント残高 */}
                <PointsDisplay />

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* 左側: 購入金額設定 */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                            <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                            購入金額
                        </h2>

                        {/* 金額入力と選択 */}
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-gray-700 mb-4">金額選択（1ポイント = 1円）</h3>
                            
                            {/* 金額入力欄 */}
                            <div className="mb-4">
                                <input
                                    type="number"
                                    name="amount"
                                    placeholder="金額を入力"
                                    value={formData.amount[0]}
                                    onChange={handleChange}
                                    min={MIN_AMOUNT}
                                    max={MAX_AMOUNT}
                                    className={`w-full p-3 border-2 rounded-lg text-lg font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${
                                        formData.amount[1] ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                                    }`}
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                    最小: ¥{MIN_AMOUNT.toLocaleString()} - 最大: ¥{MAX_AMOUNT.toLocaleString()}
                                </p>
                                {formData.amount[1] && (
                                    <span className="text-red-500 text-xs flex items-center gap-1 mt-1">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {formData.amount[1]}
                                    </span>
                                )}
                            </div>

                            {/* プリセット金額ボタン */}
                            <div className="grid grid-cols-3 gap-3">
                                {PRESET_AMOUNTS.map((preset) => (
                                    <button
                                        key={preset}
                                        type="button"
                                        className={`
                                            p-3 rounded-lg border-2 font-semibold transition-all
                                            ${formData.amount[0] === preset 
                                                ? 'border-blue-500 bg-blue-50 text-blue-700' 
                                                : 'border-gray-200 hover:border-gray-300 text-gray-700'
                                            }
                                        `}
                                        onClick={() => setFormData({...formData,amount:[preset,'']})}
                                    >
                                        ¥{preset.toLocaleString()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 利用規約同意 */}
                        <div className="border-t border-gray-200 pt-6">
                            <div className="flex items-start space-x-3">
                                <input
                                    type="checkbox"
                                    name="agreedToTerms"
                                    id="terms"
                                    checked={formData.agreedToTerms[0]}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                                />
                                <div className="space-y-2">
                                    <label htmlFor="terms" className="text-sm font-medium text-gray-700">
                                        以下に同意します
                                    </label>
                                    <div className="text-sm text-gray-600 space-y-1">
                                        <div>
                                            <a href="/legal/terms" target="_blank" className="text-blue-600 hover:underline">
                                                利用規約
                                            </a>
                                            {' '}および{' '}
                                            <a href="/legal/privacy" target="_blank" className="text-blue-600 hover:underline">
                                                プライバシーポリシー
                                            </a>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            ポイントを購入することで、返金ポリシーと利用規約に同意したものとみなされます。
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {formData.agreedToTerms[1] && (
                                <span className="text-red-500 text-xs flex items-center gap-1 mt-2">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {formData.agreedToTerms[1]}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* 右側: 購入内容確認 */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                            <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            購入内容確認
                        </h2>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200">
                                <span className="text-gray-700 font-medium">取得ポイント:</span>
                                <span className="text-xl font-bold text-green-700">
                                    {formData.amount[0].toLocaleString()}ポイント
                                </span>
                            </div>

                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                <span className="text-gray-700 font-medium">購入金額:</span>
                                <span className="text-lg font-semibold text-gray-800">
                                    ¥{formData.amount[0].toLocaleString()}
                                </span>
                            </div>

                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                <span className="text-gray-700 font-medium">
                                    決済手数料 ({paymentType === 'credit' ? '3.5' : '1.5'}%):
                                </span>
                                <span className="text-lg font-semibold text-gray-800">
                                    ¥{getFee().toLocaleString()}
                                </span>
                            </div>

                            <div className="border-t border-gray-200 pt-4">
                                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <span className="text-lg font-bold text-gray-900">合計金額:</span>
                                    <span className="text-2xl font-bold text-blue-700">
                                        ¥{getTotalAmount().toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 全体エラーメッセージ */}
                        {errorMsg && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-xl mb-6">
                                <p className="text-sm text-red-600 flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {errorMsg}
                                </p>
                            </div>
                        )}

                        {/* 決済ボタン */}
                        <button
                            type="button"
                            onClick={handlePurchase}
                            disabled={!formData.agreedToTerms[0] || formData.amount[1] !== '' || formData.amount[0] === 0}
                            className={`
                                w-full py-4 px-6 rounded-lg font-bold text-lg transition-all
                                ${
                                    !formData.agreedToTerms[0] || formData.amount[1] !== '' || formData.amount[0] === 0
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : paymentType === 'credit'
                                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                                        : 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl'
                                }
                            `}
                        >
                            {`${paymentType === 'credit' ? 'クレジットカード' : '仮想通貨'}決済へ進む →`}
                        </button>

                        {/* 注意事項 */}
                        <div className="mt-6 text-xs text-gray-500 space-y-1 border-t border-gray-200 pt-4">
                            <p>• 決済確認後、ポイントが即座に付与されます</p>
                            <p>• ポイントの返金は行っておりません</p>
                            <p>• 全ての取引は暗号化されて保護されています</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    } else {
        if(paymentType==='crypt'){
            return (
                <CryptoPurchaseForm 
                    advertiserId={advertiserId} 
                    amount={formData.amount[0]} 
                    setProcessingData={setProcessingData}
                    fee={getFee()}
                    totalAmount={getTotalAmount()}
                />  
            )
        }else{
            return '<CreditPurchaseForm.tsx>//未作成'
        }
    }
}