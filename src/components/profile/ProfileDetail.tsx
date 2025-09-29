// src/components/profile/ProfileDetail.tsx
import { getProfileDetail } from "@/dal/profile/profileFunctions";
import ProfileFormBundle from "./ProfileFormBundle";

const ProfileDetail = async({
    userType,
    userId,
}:{
    userType: 'advertiser' | 'admin'
    userId: number
}) => {
    //////////
    //■[ データ取得 ]
    const {result, message, data} = await getProfileDetail({userId});
    if(!result || !data) throw new Error(message);

    return (
        <div className="relative">
            {/* ヘッダーセクション */}
            <div className="bg-gradient-to-r from-emerald-50/80 to-teal-50/60 p-6 sm:p-8 border-b border-emerald-100/50">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                        プロフィール設定
                    </h1>
                    <p className="text-gray-600 text-sm sm:text-base">
                        必要に応じて情報を段階的に登録してください
                    </p>
                </div>
            </div>

            {/* フォームバンドル */}
            <div className="p-6 sm:p-8 lg:p-12">
                <div className="max-w-7xl mx-auto">
                    <ProfileFormBundle
                        userType={userType}
                        userId={userId}
                        initialData={data}
                    />
                </div>
            </div>

            {/* 装飾要素 */}
            <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-emerald-400/20 to-teal-500/20 rounded-full blur-lg"></div>
            <div className="absolute bottom-4 left-4 w-8 h-8 bg-gradient-to-br from-teal-400/20 to-cyan-500/20 rounded-full blur-lg"></div>
        </div>
    )
}

export default ProfileDetail;