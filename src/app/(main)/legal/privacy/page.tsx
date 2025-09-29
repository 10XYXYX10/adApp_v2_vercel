export const metadata = {
 title: "プライバシーポリシー | ECH AD - 個人情報保護への取り組み",
 description: "ECH ADの個人情報保護方針をご確認ください。ウォレット秘密鍵は一切要求せず、SSL暗号化とセキュリティファーストの設計でお客様の大切な情報を保護。透明性の高いデータ管理と、いつでもアクセス・削除可能な権利を保障し、安心してご利用いただけるサービスを提供いたします。"
}

const PrivacyPolicy = () => {
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
                        プライバシーポリシー
                    </h1>
                    <p className="text-xl text-gray-300">
                        ECH AD 個人情報保護方針
                    </p>
                    <p className="text-sm text-gray-400 mt-4">
                        最終更新日: 2025年8月29日
                    </p>
                </div>

                {/* Privacy Content */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12 space-y-12">
                    
                    {/* Security Notice */}
                    <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm border border-green-400/30 rounded-2xl p-8 text-center">
                        <div className="text-4xl mb-4">🔒</div>
                        <h2 className="text-2xl font-bold text-white mb-4">セキュリティファースト</h2>
                        <p className="text-lg text-green-300 mb-2">
                            当サービスは、ウォレットの秘密鍵情報を一切要求いたしません
                        </p>
                        <p className="text-gray-300">
                            決済情報も当社では保存せず、信頼できる決済代行サービスを通じて安全に処理されます
                        </p>
                    </div>

                    {/* 1. 収集する個人情報 */}
                    <section>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 border-l-4 border-pink-500 pl-4">
                            1. 収集する個人情報
                        </h2>
                        <div className="space-y-6 text-gray-300 leading-relaxed">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-blue-500/10 border border-blue-400/20 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-blue-300 mb-3">収集する情報</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li>• メールアドレス</li>
                                        <li>• アカウント名（氏名）</li>
                                        <li>• 生年月日（年齢確認用）</li>
                                        <li>• 住所情報（請求書送付用）</li>
                                        <li>• 事業者情報（任意）</li>
                                    </ul>
                                </div>
                                <div className="bg-red-500/10 border border-red-400/20 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-red-300 mb-3">収集しない情報</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li>• クレジットカード情報</li>
                                        <li>• 銀行口座情報</li>
                                        <li>• <strong>ウォレットの秘密鍵</strong></li>
                                        <li>• その他の金融機関情報</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="bg-green-500/10 border border-green-400/20 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-green-300 mb-3">収集方法</h3>
                                <p className="text-sm">
                                    個人情報は、アカウント登録時およびプロフィール設定時にユーザーご自身により入力された情報のみを収集いたします。
                                    第三者から個人情報を取得することはありません。
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 2. 利用目的 */}
                    <section>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 border-l-4 border-blue-500 pl-4">
                            2. 個人情報の利用目的
                        </h2>
                        <div className="space-y-4 text-gray-300 leading-relaxed">
                            <p>収集した個人情報は、以下の目的でのみ使用いたします：</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-blue-500/10 border border-blue-400/20 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-blue-300 mb-3">サービス提供</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li>• アカウント管理・認証</li>
                                        <li>• 広告配信サービスの提供</li>
                                        <li>• 決済処理（外部サービス連携）</li>
                                        <li>• 広告配信統計の作成</li>
                                    </ul>
                                </div>
                                <div className="bg-purple-500/10 border border-purple-400/20 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-purple-300 mb-3">サポート・連絡</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li>• カスタマーサポート対応</li>
                                        <li>• システム障害・メンテナンス通知</li>
                                        <li>• 重要なお知らせの配信</li>
                                        <li>• 問い合わせ対応</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 3. 第三者への提供 */}
                    <section>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 border-l-4 border-green-500 pl-4">
                            3. 第三者への情報提供
                        </h2>
                        <div className="space-y-6 text-gray-300 leading-relaxed">
                            <div className="bg-yellow-500/10 border border-yellow-400/20 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-yellow-300 mb-3">決済代行サービス</h3>
                                <p className="text-sm mb-3">
                                    決済処理のため、信頼できる外部決済代行サービスに必要最小限の情報を提供します：
                                </p>
                                <ul className="space-y-1 text-sm">
                                    <li>• メールアドレス（決済確認用）</li>
                                    <li>• 決済金額・通貨情報</li>
                                    <li>• 取引識別ID（transactionID）のみ当社で保存</li>
                                </ul>
                                <p className="text-xs text-gray-400 mt-3">
                                    ※ 決済情報（カード情報等）は当社では一切保存されません
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 4. Cookie・トラッキング */}
                    <section>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 border-l-4 border-purple-500 pl-4">
                            4. Cookie・トラッキング技術
                        </h2>
                        <div className="space-y-6 text-gray-300 leading-relaxed">
                            <p>
                                当サービスでは、サービス向上のため以下の技術を使用しています：
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-purple-500/10 border border-purple-400/20 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-purple-300 mb-3">広告効果測定</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li>• 広告表示回数・クリック数の計測</li>
                                        <li>• AdStats統計データの収集</li>
                                        <li>• ROI分析のためのデータ収集</li>
                                    </ul>
                                </div>
                                <div className="bg-cyan-500/10 border border-cyan-400/20 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-cyan-300 mb-3">ユーザー体験向上</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li>• ログイン状態の維持</li>
                                        <li>• ユーザー設定の保存</li>
                                        <li>• サイト利用状況の分析</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="bg-orange-500/10 border border-orange-400/20 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-orange-300 mb-3">Cookie設定について</h3>
                                <p className="text-sm">
                                    ブラウザの設定により、Cookieの受け入れを拒否することが可能です。
                                    ただし、一部機能が正常に動作しない場合があります。
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 5. データ保護・セキュリティ */}
                    <section>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 border-l-4 border-orange-500 pl-4">
                            5. データ保護・セキュリティ対策
                        </h2>
                        <div className="space-y-6 text-gray-300 leading-relaxed">
                            <p>お客様の個人情報を保護するため、以下のセキュリティ対策を実施しています：</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-green-500/10 border border-green-400/20 rounded-xl p-6 text-center">
                                    <div className="text-3xl mb-3">🔒</div>
                                    <h3 className="text-green-300 font-semibold mb-2">SSL暗号化</h3>
                                    <p className="text-sm">全ての通信をSSL暗号化で保護</p>
                                </div>
                                <div className="bg-blue-500/10 border border-blue-400/20 rounded-xl p-6 text-center">
                                    <div className="text-3xl mb-3">🛡️</div>
                                    <h3 className="text-blue-300 font-semibold mb-2">XSS対策</h3>
                                    <p className="text-sm">無害化処理によるセキュリティ強化</p>
                                </div>
                                <div className="bg-purple-500/10 border border-purple-400/20 rounded-xl p-6 text-center">
                                    <div className="text-3xl mb-3">⚡</div>
                                    <h3 className="text-purple-300 font-semibold mb-2">レート制限</h3>
                                    <p className="text-sm">不正アクセス防止のための制限実装</p>
                                </div>
                            </div>
                            <div className="bg-cyan-500/10 border border-cyan-400/20 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-cyan-300 mb-3">データ暗号化</h3>
                                <p className="text-sm">
                                    重要な個人情報は暗号化して保存し、権限のある担当者のみがアクセス可能な体制を構築しています。
                                    定期的なセキュリティ監査も実施しています。
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 6. データ保存・削除 */}
                    <section>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 border-l-4 border-red-500 pl-4">
                            6. データの保存期間・削除
                        </h2>
                        <div className="space-y-6 text-gray-300 leading-relaxed">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-blue-500/10 border border-blue-400/20 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-blue-300 mb-3">保存期間</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li>• アカウント有効期間中：全データ保存</li>
                                        <li>• 広告統計データ：分析目的のため保存</li>
                                        <li>• サポート履歴：問題解決のため保存</li>
                                    </ul>
                                </div>
                                <div className="bg-red-500/10 border border-red-400/20 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-red-300 mb-3">完全削除</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li>• アカウント削除時：即座に完全削除</li>
                                        <li>• 復元不可能な形での削除実行</li>
                                        <li>• バックアップからも削除</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="bg-green-500/10 border border-green-400/20 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-green-300 mb-3">削除手続き</h3>
                                <p className="text-sm">
                                    アカウントの削除をご希望の場合は、アカウント設定画面から削除申請を行うか、
                                    サポートまでお問い合わせください。削除処理完了後、復元はできませんのでご注意ください。
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 7. ユーザーの権利 */}
                    <section>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 border-l-4 border-yellow-500 pl-4">
                            7. お客様の権利
                        </h2>
                        <div className="space-y-6 text-gray-300 leading-relaxed">
                            <p>お客様には、個人情報に関して以下の権利があります：</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-yellow-500/10 border border-yellow-400/20 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-yellow-300 mb-3">データアクセス権</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li>• 保存されている個人情報の開示請求</li>
                                        <li>• データの利用状況の確認</li>
                                    </ul>
                                </div>
                                <div className="bg-cyan-500/10 border border-cyan-400/20 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-cyan-300 mb-3">データ管理権</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li>• 個人情報の訂正・更新・削除<span className='block text-xs text-gray-500'>*ログイン後、管理画面操作から、いつでも行えます</span></li>
                                        <li>• Cookie設定の変更</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="bg-purple-500/10 border border-purple-400/20 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-purple-300 mb-3">権利行使方法</h3>
                                <p className="text-sm">
                                    これらの権利を行使される場合は、アカウント設定画面から手続きを行うか、
                                    サポート窓口までお問い合わせください。本人確認後、速やかに対応いたします。
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 8. 国際的な対応 */}
                    {/* <section>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 border-l-4 border-cyan-500 pl-4">
                            8. 国際的なプライバシー法への対応
                        </h2>
                        <div className="space-y-6 text-gray-300 leading-relaxed">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-blue-500/10 border border-blue-400/20 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-blue-300 mb-3">GDPR対応（EU居住者）</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li>• データ処理の合法的根拠の明示</li>
                                        <li>• データポータビリティの権利</li>
                                        <li>• 忘れられる権利への対応</li>
                                        <li>• データ保護責任者の設置</li>
                                    </ul>
                                </div>
                                <div className="bg-green-500/10 border border-green-400/20 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-green-300 mb-3">各国法令遵守</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li>• 個人情報保護法（日本）</li>
                                        <li>• CCPA（カリフォルニア州）</li>
                                        <li>• その他各国のプライバシー法</li>
                                        <li>• 国際データ移転の安全性確保</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section> */}

                    {/* 9. 法的事項 */}
                    <section>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 border-l-4 border-indigo-500 pl-4">
                            8. 法的事項・お問い合わせ
                        </h2>
                        <div className="space-y-6 text-gray-300 leading-relaxed">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-indigo-500/10 border border-indigo-400/20 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-indigo-300 mb-3">準拠法</h3>
                                    <p className="text-sm">
                                        本プライバシーポリシーは日本法に基づいて解釈・適用されます。
                                    </p>
                                </div>
                                <div className="bg-green-500/10 border border-green-400/20 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-green-300 mb-3">ポリシー変更通知</h3>
                                    <ul className="space-y-1 text-sm">
                                        <li>• 登録メールアドレスへの通知</li>
                                        <li>• 公式アカウントでの情報発信</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="bg-purple-500/10 border border-purple-400/20 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-purple-300 mb-3">お問い合わせ窓口</h3>
                                <p className="text-sm">
                                    本プライバシーポリシーに関するご質問やご不明な点がございましたら、
                                    アプリ内のサポート機能またはお問い合わせフォームからご連絡ください。
                                </p>
                            </div>
                        </div>
                    </section>

                </div>

                {/* Footer Note */}
                <div className="text-center mt-12 p-6 bg-gradient-to-r from-green-500/10 to-blue-500/10 backdrop-blur-sm border border-green-400/20 rounded-xl">
                    <p className="text-green-300 font-semibold mb-2">
                        プライバシー保護への取り組み
                    </p>
                    <p className="text-gray-400">
                        お客様の個人情報保護を最優先に、透明性の高いサービス運営を心がけています。
                        ご不明な点やご心配な点がございましたら、お気軽にお問い合わせください。
                    </p>
                </div>
            </div>
        </div>
    )
}

export default PrivacyPolicy