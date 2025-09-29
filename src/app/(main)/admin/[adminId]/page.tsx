import Link from 'next/link';
import { 
    CheckCircle, 
    Users, 
    CreditCard,
    MessageCircle, 
    Bell,
    Shield
} from 'lucide-react';
import { redirect } from 'next/navigation';

const AdminHome = async(
    props:{
        params: Promise<{ adminId: string }>
    }
 ) => {
    const resolvedParams = await props.params;
    const adminId = Number(resolvedParams.adminId)
    if (!adminId || isNaN(adminId) || adminId <= 0) redirect('/auth/admin');

    const menuItems = [
        {
            href: `/admin/${adminId}/review`,
            icon: <CheckCircle className="w-6 h-6" />,
            title: "広告審査",
            description: "投稿された広告を審査し、品質とガイドライン遵守を確認",
            color: "from-green-500 to-emerald-600"
        },
        {
            href: `/admin/${adminId}/user`,
            icon: <Users className="w-6 h-6" />,
            title: "ユーザー管理",
            description: "全ユーザーの一覧表示・検索・アカウント管理を統合的に行えます",
            color: "from-blue-500 to-cyan-600"
        },
        {
            href: `/admin/${adminId}/payment`,
            icon: <CreditCard className="w-6 h-6" />,
            title: "決済管理",
            description: "全ユーザーの決済状況を統合管理し、売上分析とリアルタイム監視を実現",
            color: "from-purple-500 to-pink-600"
        },
        {
            href: `/admin/${adminId}/support`,
            icon: <MessageCircle className="w-6 h-6" />,
            title: "サポート管理",
            description: "全ユーザーからのお問い合わせを確認・対応できます。迅速な対応でユーザー満足度を向上させましょう",
            color: "from-teal-500 to-green-600"
        },
        {
            href: `/admin/${adminId}/notification`,
            icon: <Bell className="w-6 h-6" />,
            title: "通知管理",
            description: "システム内全通知の一覧表示・検索・編集・削除・新規作成を統合的に行えます",
            color: "from-yellow-500 to-orange-600"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">管理者ダッシュボード</h1>
                    </div>
                    <p className="text-gray-600">システム全体の監視・管理と運営業務</p>
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
                                <p className="text-gray-600 text-sm leading-relaxed">
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

export default AdminHome;