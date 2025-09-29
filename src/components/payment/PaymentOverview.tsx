'use client'
// src/components/admin/payment/PaymentOverview.tsx
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
	ChevronLeft, 
	ChevronRight, 
	TrendingUp, 
	CreditCard, 
	DollarSign,
	Receipt,
	BarChart3,
	RefreshCw,
	AlertTriangle,
	Sparkles
} from 'lucide-react'
import PaymentChartV2 from './PaymentChartV2'
import { PaymentPeriodInfo, PaymentStatsData, PaymentStatsSummary } from '@/lib/types/payment/paymentTypes'
import { getPaymentStatsData, checkPaymentStatsDataAvailability } from '@/actions/payment/paymentActions'


const now = new Date()
const initialCurrentDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`

//////////
//■[ 期間表示 ]
const formatPeriod = (dateStr: string) => {
	const [year, month] = dateStr.split('-')
	return `${year}年${Number(month)}月`
}

export default function PaymentOverview() {
    console.log('--PaymentOverview--')
	//////////
	//■[ ステート管理 ]
	const [currentDate, setCurrentDate] = useState(initialCurrentDate)
	const [data, setData] = useState<{
		stats: PaymentStatsData[]
		summary: PaymentStatsSummary
		period: PaymentPeriodInfo
	} | null>(null)
	const [navigation, setNavigation] = useState({ hasPrevious: false, hasNext: false })
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	//////////
	//■[ 統計データ取得 ]
	const fetchData = async (targetDate: string) => {
		setIsLoading(true)
		setError(null)

		try {
			const [statsResult, navResult] = await Promise.all([
				getPaymentStatsData({ startDate: targetDate }),
				checkPaymentStatsDataAvailability({ currentDate: targetDate })
			])
			
			if (!statsResult.success || !statsResult.data) {
				setError(statsResult.errMsg || 'データの取得に失敗しました')
				return
			}

			setData(statsResult.data)
			setNavigation({
				hasPrevious: navResult.success ? navResult.data?.hasPrevious || false : false,
				hasNext: navResult.success ? navResult.data?.hasNext || false : false
			})
		} catch (err) {
			setError(err instanceof Error ? err.message : 'エラーが発生しました')
		} finally {
			setIsLoading(false)
		}
	}

	//////////
	//■[ 前後移動 ]
	const handleNavigation = (direction: 'prev' | 'next') => {
		const [year, month] = currentDate.split('-').map(Number)
		const newMonth = direction === 'next' 
			? (month === 12 ? 1 : month + 1)
			: (month === 1 ? 12 : month - 1)
		const newYear = direction === 'next' 
			? (month === 12 ? year + 1 : year)
			: (month === 1 ? year - 1 : year)
		
		const newDate = `${newYear}-${String(newMonth).padStart(2, '0')}-01`
		setCurrentDate(newDate)
	}

	//////////
	//■[ 初期データ取得 ]
	useEffect(() => {
		const fetchInitialData = async () => {
				setIsLoading(true)
				setError(null)

				try {
				const [statsResult, navResult] = await Promise.all([
						getPaymentStatsData({}),
						checkPaymentStatsDataAvailability({ currentDate: initialCurrentDate })
				])
				
				if (!statsResult.success || !statsResult.data) {
						setError(statsResult.errMsg || 'データの取得に失敗しました')
						return
				}

				setData(statsResult.data)
				setNavigation({
						hasPrevious: navResult.success ? navResult.data?.hasPrevious || false : false,
						hasNext: navResult.success ? navResult.data?.hasNext || false : false
				})
				} catch (err) {
				setError(err instanceof Error ? err.message : 'エラーが発生しました')
				} finally {
				setIsLoading(false)
				}
		}
		fetchInitialData()
	}, [])


	//////////
	//■[ 期間変更時データ取得 ]
	useEffect(() => {
        if(!data)return;
        console.log(`currentDate!==initialCurrentDate:${String(currentDate!==initialCurrentDate)}`)
        console.log(`data.period.startDate!==currentDate:${String(data.period.startDate!==currentDate)}`)
		if (currentDate!==initialCurrentDate || data.period.startDate!==currentDate) {
			fetchData(currentDate)
		}
	}, [currentDate])

	//////////
	//■[ 初期ナビゲーション設定 ]
	useEffect(() => {
		if (!data) return

		checkPaymentStatsDataAvailability({ currentDate })
			.then(result => {
				if (result.success && result.data) {
					setNavigation({
						hasPrevious: result.data.hasPrevious,
						hasNext: result.data.hasNext
					})
				}
			})
			.catch(() => {})
	}, [data])

	//////////
	//■[ サマリーカード ]
	const summaryCards = data ? [
		{
			title: '総決済件数',
			value: data.summary.totalPaymentCount.toLocaleString(),
			icon: Receipt,
			gradient: 'from-blue-500 via-cyan-500 to-blue-600',
			shadow: 'shadow-blue-500/30'
		},
		{
			title: '総決済金額',
			value: `¥${data.summary.totalAmount.toLocaleString()}`,
			icon: CreditCard,
			gradient: 'from-emerald-500 via-green-500 to-teal-600',
			shadow: 'shadow-emerald-500/30'
		},
		{
			title: '平均決済金額',
			value: `¥${data.summary.avgAmountPerPayment.toLocaleString()}`,
			icon: TrendingUp,
			gradient: 'from-purple-500 via-violet-500 to-indigo-600',
			shadow: 'shadow-purple-500/30'
		},
		{
			title: '総手数料',
			value: `¥${data.summary.totalFees.toLocaleString()}`,
			icon: DollarSign,
			gradient: 'from-orange-500 via-amber-500 to-yellow-600',
			shadow: 'shadow-orange-500/30'
		}
	] : []

	return (
		<>
			<motion.div
				className="bg-white/80 backdrop-blur-2xl rounded-3xl border border-white/50 shadow-2xl overflow-hidden"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
			>
				<div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-4 sm:p-6">
					{/* ヘッダー */}
					<div className="flex items-center justify-between mb-6">
						<div className="flex items-center gap-3">
							<motion.div 
								className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30"
								whileHover={{ rotate: 10, scale: 1.1 }}
								transition={{ duration: 0.2 }}
							>
								<BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
							</motion.div>
							<div>
								<h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
									月別決済統計
								</h2>
								<p className="text-gray-600 text-sm">全ユーザーの月間決済データ統合表示</p>
							</div>
						</div>

						<motion.button
							onClick={() => fetchData(currentDate)}
							disabled={isLoading}
							className="w-10 h-10 sm:w-11 sm:h-11 bg-white/80 hover:bg-white disabled:bg-gray-100 rounded-xl border border-white/60 flex items-center justify-center transition-all duration-300 disabled:cursor-not-allowed shadow-lg"
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							<RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-600 ${isLoading ? 'animate-spin' : ''}`} />
						</motion.button>
					</div>

					{/* ナビゲーション */}
					<div className="flex items-center justify-center gap-4 mb-6">
						<motion.button
							onClick={() => handleNavigation('prev')}
							disabled={!navigation.hasPrevious || isLoading}
							className="w-10 h-10 sm:w-11 sm:h-11 bg-white/80 hover:bg-white disabled:bg-gray-100 disabled:text-gray-400 rounded-xl border border-white/60 flex items-center justify-center transition-all duration-300 disabled:cursor-not-allowed shadow-lg"
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							<ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
						</motion.button>

						<motion.div 
							className="bg-gradient-to-r from-white via-blue-50 to-purple-50 px-4 py-2 sm:px-6 sm:py-3 rounded-xl border border-indigo-200/60 shadow-lg min-w-[140px] sm:min-w-[160px] text-center"
							key={currentDate}
							initial={{ scale: 0.95, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							transition={{ duration: 0.3 }}
						>
							<div className="text-base sm:text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
								{isLoading ? (
									<div className="flex items-center justify-center gap-2">
										<RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 animate-spin text-indigo-600" />
										<span className="text-sm sm:text-base">読込中...</span>
									</div>
								) : (
									formatPeriod(currentDate)
								)}
							</div>
						</motion.div>

						<motion.button
							onClick={() => handleNavigation('next')}
							disabled={!navigation.hasNext || isLoading}
							className="w-10 h-10 sm:w-11 sm:h-11 bg-white/80 hover:bg-white disabled:bg-gray-100 disabled:text-gray-400 rounded-xl border border-white/60 flex items-center justify-center transition-all duration-300 disabled:cursor-not-allowed shadow-lg"
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							<ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
						</motion.button>
					</div>

					{/* エラー表示 */}
					<AnimatePresence>
						{error && (
							<motion.div
								className="mb-6 bg-red-50/80 backdrop-blur-xl border border-red-200 rounded-2xl p-4"
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: 'auto' }}
								exit={{ opacity: 0, height: 0 }}
							>
								<div className="flex items-start gap-3">
									<AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
									<div className="flex-1">
										<p className="text-red-700 font-medium text-sm">エラーが発生しました</p>
										<p className="text-red-600 text-sm mt-1">{error}</p>
									</div>
									<button
										onClick={() => setError(null)}
										className="text-red-400 hover:text-red-600 transition-colors"
									>
										✕
									</button>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>

				{/* サマリーカード */}
				{!isLoading && !error && (
					<div className="p-4 sm:p-6 pt-0">
						<motion.div
							className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
						>
							{summaryCards.map((card, index) => (
								<motion.div
									key={card.title}
									className={`relative overflow-hidden bg-gradient-to-br ${card.gradient} rounded-2xl p-3 sm:p-4 lg:p-6 shadow-xl ${card.shadow} group`}
									initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
									animate={{ opacity: 1, scale: 1, rotateY: 0 }}
									transition={{ duration: 0.5, delay: index * 0.1 }}
									whileHover={{ scale: 1.02, y: -4, rotateY: 5 }}
								>
									{/* 背景エフェクト */}
									<div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
									<div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full -translate-y-8 sm:-translate-y-10 translate-x-8 sm:translate-x-10" />
									
									{/* コンテンツ */}
									<div className="relative z-10">
										<div className="flex items-center justify-between mb-2 sm:mb-3">
											<card.icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white drop-shadow-lg" />
											<motion.div 
												className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/80 rounded-full"
												animate={{ scale: [1, 1.2, 1] }}
												transition={{ duration: 2, repeat: Infinity }}
											/>
										</div>
										
										<div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-white mb-1 drop-shadow-lg leading-tight">
											{card.value}
										</div>
										
										<div className="text-xs sm:text-sm text-white/90 font-medium">
											{card.title}
										</div>
									</div>

									{/* グリッターエフェクト */}
									<motion.div 
										className="absolute top-2 right-2"
										animate={{ rotate: 360 }}
										transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
									>
										<Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-white/60" />
									</motion.div>
								</motion.div>
							))}
						</motion.div>
					</div>
				)}

				{/* データなし状態 */}
				{!isLoading && !error && (!data || data.stats.length === 0) && (
					<motion.div
						className="text-center py-8 sm:py-12 px-6"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.6 }}
					>
						<div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 bg-gradient-to-r from-gray-100 via-blue-100 to-purple-100 rounded-full flex items-center justify-center shadow-lg">
							<BarChart3 className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
						</div>
						<h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">統計データなし</h3>
						<p className="text-gray-600 mb-4 text-sm sm:text-base">この月には統計データがありません。</p>
						<div className="text-sm text-gray-500">
							決済データが蓄積されると、ここに詳細な統計が表示されます。
						</div>
					</motion.div>
				)}

				{/* ローディング状態 */}
				{isLoading && (
					<motion.div
						className="flex items-center justify-center gap-3 py-8 sm:py-12"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						<RefreshCw className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 animate-spin" />
						<span className="text-gray-600 font-medium text-sm sm:text-base">統計データを読み込み中...</span>
					</motion.div>
				)}
			</motion.div>

			{/* グラフエリア */}
			{!isLoading && !error && data && data.stats.length > 0 && (
				<motion.div
					className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/40 shadow-xl overflow-hidden mt-6"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.4 }}
				>
					<div className="p-4 sm:p-6">
						<div className="flex items-center gap-3 mb-6">
							<motion.div 
								className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg"
								whileHover={{ rotate: 10, scale: 1.1 }}
								transition={{ duration: 0.2 }}
							>
								<TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
							</motion.div>
							<div>
								<h3 className="text-lg sm:text-xl font-bold text-gray-900">月別推移グラフ</h3>
								<p className="text-gray-600 text-sm">日別決済パフォーマンス変化の詳細分析</p>
							</div>
						</div>

						<PaymentChartV2 
							data={data.stats}
							periodInfo={{
								startDate: data.period.startDate,
								endDate: data.period.endDate
							}}
						/>
					</div>
				</motion.div>
			)}
		</>
	)
}