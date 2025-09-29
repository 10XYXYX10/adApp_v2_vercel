'use client'
// src/components/point/advertiser/PointsDisplay
import useStore from "@/store";
import { IconWallet } from "@tabler/icons-react";

const PointsDisplay = () => {
    const {user} = useStore();

    return (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-medium opacity-90">現在のポイント残高</h3>
                    <div className="flex items-center space-x-2 mt-2">
                        <IconWallet className="w-6 h-6" />
                        <span className="text-3xl font-bold">{user.amount.toLocaleString()}</span>
                        <span className="text-lg">P</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default PointsDisplay;