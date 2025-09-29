export const metadata = {
 title: "利用規約 | ECH AD - 広告配信プラットフォームサービス規約",
 description: "ECH AD広告配信プラットフォームの利用規約をご確認ください。18歳以上対象、成人向け広告も含む幅広いジャンルに対応。1ポイント1円の明確な料金体系と厳格な審査基準で安心・安全な広告配信を実現。クレジットカード・仮想通貨決済対応、システム障害時の返還保証など、透明性の高いサービスを提供いたします。"
}

const TermsOfService = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-4 py-16">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-6">
                        利用規約
                    </h1>
                    <p className="text-xl text-gray-300">
                        ECH AD サービス利用規約
                    </p>
                    <p className="text-sm text-gray-400 mt-4">
                        最終更新日: 2025年8月29日
                    </p>
                </div>

                {/* Terms Content */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12 space-y-12">
                    
                    {/* 1. サービス概要 */}
                    <section>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 border-l-4 border-pink-500 pl-4">
                            1. サービス概要
                        </h2>
                        <div className="space-y-4 text-gray-300 leading-relaxed">
                            <p>
                                ECH ADは、広告配信プラットフォームサービスです。あらゆる広告ジャンルに対応し、
                                大手プラットフォームでは配信が困難な成人向け広告も含め、幅広い広告の配信を可能にします。
                            </p>
                            <p>
                                本サービスは、動画配信サービス等のメディアに対して、効果的な広告配信を実現します。
                            </p>
                        </div>
                    </section>

                    {/* 2. 利用条件 */}
                    <section>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 border-l-4 border-blue-500 pl-4">
                            2. 利用条件
                        </h2>
                        <div className="space-y-4 text-gray-300 leading-relaxed">
                            <div className="bg-red-500/10 border border-red-400/20 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-red-300 mb-3">年齢制限</h3>
                                <p>
                                    本サービスは18歳以上の方のみご利用いただけます。未成年者の利用は一切禁止されています。
                                </p>
                            </div>
                            <p>
                                アカウント登録時に入力いただく情報は、正確かつ最新の情報である必要があります。
                                虚偽の情報を登録した場合、アカウントの停止や削除の対象となります。
                            </p>
                        </div>
                    </section>

                    {/* 3. 広告審査基準 */}
                    <section>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 border-l-4 border-green-500 pl-4">
                            3. 広告審査基準
                        </h2>
                        <div className="space-y-6 text-gray-300 leading-relaxed">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-green-500/10 border border-green-400/20 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-green-300 mb-3">配信可能な広告</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li>• 一般的な商品・サービスの広告</li>
                                        <li>• 成人向けコンテンツの広告</li>
                                        <li>• 合法的な事業の宣伝</li>
                                        <li>• YouTube動画の再生数増加目的</li>
                                    </ul>
                                </div>
                                <div className="bg-red-500/10 border border-red-400/20 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-red-300 mb-3">禁止コンテンツ</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li>• 詐欺広告</li>
                                        <li>• 闇バイト等の違法行為</li>
                                        <li>• 児童ポルノ</li>
                                        <li>• 無修正ポルノ</li>
                                        <li>• 暴力的・差別的コンテンツ</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="bg-blue-500/10 border border-blue-400/20 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-blue-300 mb-3">審査プロセス</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="text-white font-medium mb-2">審査あり</h4>
                                        <p className="text-sm">オーバーレイ広告・プレロール広告</p>
                                        <p className="text-xs text-gray-400">審査期間：即日～4営業日以内</p>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium mb-2">審査なし（即配信）</h4>
                                        <p className="text-sm">YouTube広告・動画記事優先表示</p>
                                        <p className="text-xs text-gray-400">配信開始：即座</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 4. 料金・決済 */}
                    <section>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 border-l-4 border-purple-500 pl-4">
                            4. 料金・決済
                        </h2>
                        <div className="space-y-6 text-gray-300 leading-relaxed">
                            <div className="bg-purple-500/10 border border-purple-400/20 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-purple-300 mb-3">ポイント制</h3>
                                <p className="text-2xl font-bold text-white mb-2">1ポイント = 1円</p>
                                <p className="text-sm">
                                    すべての広告配信はポイント制で管理されます。事前にポイントを購入し、
                                    広告配信に応じてポイントが消費されます。
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-blue-500/10 border border-blue-400/20 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-blue-300 mb-3">決済方法</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li>• クレジットカード</li>
                                        <li>• 仮想通貨（ETH・BTC・LTC）</li>
                                        <li>• 最低購入金額：100円</li>
                                    </ul>
                                </div>
                                <div className="bg-green-500/10 border border-green-400/20 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-green-300 mb-3">ポイント返還</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li>• 広告審査不通過時：全額返還</li>
                                        <li>• ユーザー任意削除時：残額全額返還</li>
                                        <li>• システム障害時：影響分返還</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 5. システム障害時の対応 */}
                    <section>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 border-l-4 border-orange-500 pl-4">
                            5. システム障害時の対応
                        </h2>
                        <div className="space-y-4 text-gray-300 leading-relaxed">
                            <p>
                                システム障害やメンテナンス情報は、以下の方法で通知いたします：
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-orange-500/10 border border-orange-400/20 rounded-xl p-4">
                                    <h3 className="text-orange-300 font-semibold mb-2">メール通知</h3>
                                    <p className="text-sm">アカウント登録時のメールアドレスに情報を送信</p>
                                </div>
                                <div className="bg-orange-500/10 border border-orange-400/20 rounded-xl p-4">
                                    <h3 className="text-orange-300 font-semibold mb-2">公式アカウント</h3>
                                    <p className="text-sm">公式アカウントで随時情報発信</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 6. 禁止行為 */}
                    <section>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 border-l-4 border-red-500 pl-4">
                            6. 禁止行為
                        </h2>
                        <div className="space-y-4 text-gray-300 leading-relaxed">
                            <p>以下の行為は禁止されています：</p>
                            <div className="bg-red-500/10 border border-red-400/20 rounded-xl p-6">
                                <ul className="space-y-3">
                                    <li className="flex items-start space-x-3">
                                        <span className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                                        <span>不正アクセス・システムの悪用</span>
                                    </li>
                                    <li className="flex items-start space-x-3">
                                        <span className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                                        <span>虚偽情報の登録</span>
                                    </li>
                                    <li className="flex items-start space-x-3">
                                        <span className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                                        <span>第三者の権利侵害（著作権・商標権等）</span>
                                    </li>
                                    <li className="flex items-start space-x-3">
                                        <span className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                                        <span>その他、法令に違反する行為</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* 7. アカウント停止・削除 */}
                    <section>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 border-l-4 border-yellow-500 pl-4">
                            7. アカウント停止・削除
                        </h2>
                        <div className="space-y-4 text-gray-300 leading-relaxed">
                            <p>以下の場合、予告なくアカウントの停止または削除を行います：</p>
                            <div className="bg-yellow-500/10 border border-yellow-400/20 rounded-xl p-6">
                                <ul className="space-y-2">
                                    <li>• 詐欺広告の投稿</li>
                                    <li>• 闇バイト等違法行為の広告</li>
                                    <li>• 児童ポルノの投稿</li>
                                    <li>• 無修正ポルノの投稿</li>
                                    <li>• その他、本規約に違反する行為</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* 8. 法的事項 */}
                    <section>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 border-l-4 border-cyan-500 pl-4">
                            8. 法的事項
                        </h2>
                        <div className="space-y-6 text-gray-300 leading-relaxed">
                            <div className="bg-cyan-500/10 border border-cyan-400/20 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-cyan-300 mb-3">準拠法</h3>
                                <p>本規約は日本法に基づいて解釈・適用されます。</p>
                            </div>
                            <div className="bg-cyan-500/10 border border-cyan-400/20 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-cyan-300 mb-3">規約変更の通知</h3>
                                <p>規約の変更は、以下の方法で通知いたします：</p>
                                <ul className="mt-3 space-y-1">
                                    <li>• アカウント登録メールアドレスへの通知</li>
                                    <li>• 公式アカウントでの情報発信</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                </div>

                {/* Footer Note */}
                <div className="text-center mt-12 p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
                    <p className="text-gray-400">
                        本規約についてご不明な点がございましたら、お気軽にお問い合わせください。
                    </p>
                </div>
            </div>
        </div>
    )
}

export default TermsOfService