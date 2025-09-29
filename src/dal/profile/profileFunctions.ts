// src/fetches/profileFunctions.ts
import prisma from "@/lib/prisma"
import { ProfileDetail } from "@/lib/types/profile/profileTypes"

//////////
//■[ プロフィール詳細取得 ]
export const getProfileDetail = async({
    userId,
}:{
    userId: number
}):Promise<{
    result: boolean
    message: string
    data?: ProfileDetail | null
}> => {
    try{
        //////////
        //■[ データ取得 ]
        const user = await prisma.user.findFirst({
            where: {
                id: userId,
                isActive: true, // アクティブなユーザーのみ
            },
            select: {
                id: true,
                name: true,
                email: true,
                birthDate: true,
                // 事業者情報
                businessType: true,
                companyName: true,
                representativeName: true,
                businessNumber: true,
                // リレーション
                Address: {
                    select: {
                        id: true,
                        country: true,
                        postalCode: true,
                        state: true,
                        city: true,
                        addressLine1: true,
                        addressLine2: true,
                    },
                    take: 1, // 最初の住所のみ取得
                },
                Phone: {
                    select: {
                        id: true,
                        hashedPhoneNumber: true,
                    }
                }
            }
        });

        if (!user) {
            return {
                result: false,
                message: 'User not found.',
                data: null
            }
        }

        //////////
        //■[ データ変換 ]
        const profileDetail: ProfileDetail = {
            id: user.id,
            name: user.name,
            email: user.email,
            birthDate: user.birthDate,
            // 事業者情報
            businessType: user.businessType,
            companyName: user.companyName,
            representativeName: user.representativeName,
            businessNumber: user.businessNumber,
            // 住所情報（配列の最初の要素またはnull）
            address: user.Address && user.Address.length > 0 ? {
                id: user.Address[0].id,
                country: user.Address[0].country,
                postalCode: user.Address[0].postalCode,
                state: user.Address[0].state,
                city: user.Address[0].city,
                addressLine1: user.Address[0].addressLine1,
                addressLine2: user.Address[0].addressLine2,
            } : null,
            // 電話番号情報
            phone: user.Phone ? {
                id: user.Phone.id,
                phoneLastNumber: user.Phone.hashedPhoneNumber.slice(-4)
                
            } : null,
        };

        return {
            result: true,
            message: 'success',
            data: profileDetail
        }
    }catch(err){
        const message = err instanceof Error ?  `${err.message}.` : `Internal Server Error.`;
        return {
            result: false,
            message,
        }
    }
}