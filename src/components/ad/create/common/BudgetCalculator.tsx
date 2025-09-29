"use client"
import { AdType } from "@/lib/types/ad/adTypes"
import { Dispatch, SetStateAction } from "react"

//////////
//■[ コンポーネント外：データ定義 ]
const PRESET_BUDGETS = [500, 1000, 2000, 5000, 10000, 20000]
type Pricing = {
  display?: number
  click?: number
  play?: number
  unit: string
  metrics: string[]
}
const PRICING_CONFIG: Record<AdType, Pricing> = {
  priority: {
    display: 0.1,
    click: 1,
    unit: 'ポイント',
    metrics: ['表示', 'クリック'],
  },
  overlay: {
    display: 0.1,
    click: 1,
    unit: 'ポイント',
    metrics: ['表示', 'クリック'],
  },
  preroll: {
    play: 2,
    unit: 'ポイント',
    metrics: ['再生'],
  },
  'youtube-short': {
    play: 1.5,
    unit: 'ポイント',
    metrics: ['再生'],
  },
  'youtube-long': {
    play: 3,
    unit: 'ポイント',
    metrics: ['再生'],
  },
}as const



//////////
//■[ Main！コンポーネント！ ]
export default function BudgetCalculator({
    adType,
    budgetData,
    setBudgetData,
}:{
    adType: AdType
    budgetData: {value:number,error:string} // [入力値, バリデーションエラー文字列]
    setBudgetData:Dispatch<SetStateAction<{
        value: number;
        error: string;
    }>>
}) {
  // 入力変更処理
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = Number(e.target.value)
    let error = '';
    if (isNaN(inputVal) || inputVal < 100 || inputVal > 100000) error = "100円以上,10万以下の金額を入力してください";
    setBudgetData({value:inputVal, error})
  }

  // プリセット選択
  const handleSelect = (value: number) => {
    setBudgetData({value, error:""})
  }

    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* ヘッダー */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
                <h3 className="text-xl font-bold mb-2">予算設定</h3>
                <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{budgetData.value.toLocaleString()}</span>
                <span className="text-lg opacity-90">ポイント</span>
                </div>
                <p className="text-sm opacity-80 mt-2">
                {PRICING_CONFIG[adType].metrics.join('・')}料金: 
                {PRICING_CONFIG[adType].display && ` 表示${PRICING_CONFIG[adType].display}P`}
                {PRICING_CONFIG[adType].click && ` クリック${PRICING_CONFIG[adType].click}P`}
                {PRICING_CONFIG[adType].play && ` 再生${PRICING_CONFIG[adType].play}P`}
                </p>
            </div>

            {/* 本体 */}
            <div className="p-6 space-y-4">
                {/* 金額入力 */}
                <div>
                    <input
                        type="number"
                        //min={100}
                        //max={100000}
                        value={budgetData.value}
                        onChange={handleChange}
                        className={`
                          w-full px-4 py-3 text-lg font-semibold border-2 rounded-xl transition-colors
                          ${
                            budgetData.error 
                              ? 'border-red-500 focus:border-red-600' 
                              : 'border-gray-300 focus:border-blue-500'
                          }
                          focus:outline-none
                        `}
                        placeholder="金額を入力"
                    />
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500">最小: ¥100 - 最大: ¥100,000</span>
                        {budgetData.error && (
                            <span className="text-xs text-red-500">{budgetData.error}</span>
                        )}
                    </div>
                </div>

                {/* プリセット金額 */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {PRESET_BUDGETS.map((amount) => (
                        <button
                        key={amount}
                        type="button"
                        onClick={() => handleSelect(amount)}
                        className={`px-3 py-2 rounded-lg font-medium text-sm transition-all
                            ${budgetData.value === amount 
                            ? 'bg-blue-500 text-white shadow-md' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                        {amount.toLocaleString()}p
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
