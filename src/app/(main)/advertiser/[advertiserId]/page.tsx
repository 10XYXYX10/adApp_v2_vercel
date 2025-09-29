import Link from 'next/link';
import { 
    BarChart3, 
    Plus, 
    Wallet,
    ShoppingCart,
    User, 
    MessageCircle, 
    Bell
} from 'lucide-react';
import PointsDisplay from '@/components/point/advertiser/PointsDisplay';
import { redirect } from 'next/navigation';

const AdvertiserHome = async (
    props:{
        params: Promise<{ advertiserId: string }>
    }
) => {
    const resolvedParams = await props.params;
    const advertiserId = Number(resolvedParams.advertiserId)
    if (!advertiserId || isNaN(advertiserId) || advertiserId <= 0) redirect('/auth/advertiser');

    const menuItems = [
        {
            href: `/advertiser/${advertiserId}/ad`,
            icon: <BarChart3 className="w-6 h-6" />,
            title: "広告一覧",
            description: "作成済み広告の確認・管理",
            color: "from-green-500 to-emerald-600"
        },
        {
            href: `/advertiser/${advertiserId}/ad/create`,
            icon: <Plus className="w-6 h-6" />,
            title: "広告新規作成",
            description: "新しい広告キャンペーンを作成",
            color: "from-blue-500 to-cyan-600"
        },
        {
            href: `/advertiser/${advertiserId}/point`,
            icon: <Wallet className="w-6 h-6" />,
            title: "ポイント・決済履歴",
            description: "ポイントの消費・返還・決済履歴を確認",
            color: "from-purple-500 to-pink-600"
        },
        {
            href: `/advertiser/${advertiserId}/point/purchase`,
            icon: <ShoppingCart className="w-6 h-6" />,
            title: "ポイント購入",
            description: "新しいポイントを購入",
            color: "from-orange-500 to-red-600"
        },
        {
            href: `/advertiser/${advertiserId}/profile`,
            icon: <User className="w-6 h-6" />,
            title: "プロフィール",
            description: "氏名・メールアドレス等の登録情報管理",
            color: "from-indigo-500 to-blue-600"
        },
        {
            href: `/advertiser/${advertiserId}/support`,
            icon: <MessageCircle className="w-6 h-6" />,
            title: "お問い合わせ",
            description: "問い合わせ一覧確認・新規お問い合わせ",
            color: "from-teal-500 to-green-600"
        },
        {
            href: `/advertiser/${advertiserId}/notification`,
            icon: <Bell className="w-6 h-6" />,
            title: "通知",
            description: "重要な通知情報の確認",
            color: "from-yellow-500 to-orange-600"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">ダッシュボード</h1>
                    <p className="text-gray-600">広告キャンペーンの管理とアカウント設定</p>
                </div>

                <div className="mb-8">
                    <PointsDisplay />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {menuItems.map((item, index) => (
                        <Link 
                            key={index}
                            href={item.href}
                            className="group block transform transition-all duration-200 hover:scale-105"
                        >
                            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg border border-gray-100">
                                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${item.color} text-white mb-4`}>
                                    {item.icon}
                                </div>
                                
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    {item.description}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default AdvertiserHome;