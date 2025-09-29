// src/fetches/userFunctions.ts
import prisma from "@/lib/prisma"
import { UserDetailType, UserListBusinessType, UserListItemType, UserListOptionType, UserListStatusType } from "@/lib/types/user/userTypes";
import { Prisma } from "@prisma/client"

const fetchCount = process.env.NEXT_PUBLIC_FETCH_COUNT ? Number(process.env.NEXT_PUBLIC_FETCH_COUNT) : 10;

//////////
//■ [ ユーザー一覧取得 ]
export const getUsers = async({
    search,
    sort,
    status,
    businessType,
    page,
}:{
    search: string
    sort: 'desc' | 'asc'
    status: UserListStatusType
    businessType: UserListBusinessType
    page: number
}):Promise<{
    result: boolean
    message: string
    data?: UserListItemType[]
}> => {
    try{
        //////////
        //■ [ Prismaを用いたデータ取得のためのパラメータを調整 ]
        let optionOb: UserListOptionType = {}
        
        //・whereOb
        let whereOb: Prisma.UserWhereInput = {
            userType: 'advertiser', // advertiserのみ取得（adminは除外）
        };
        
        //・status（アカウント状態）
        if(status) {
            const isActive = status === 'active';
            whereOb = { 
                ...whereOb,
                isActive,
            }
        }
        
        //・businessType
        if(businessType) {
            whereOb = { 
                ...whereOb,
                businessType,
            }
        }

        //・search
        if(search) {
            //半角スペースで区切って配列化
            let searchList: string[] = search.split(' ');//「dangerousCharToSpace(search).trim()」実行済み
            searchList = searchList.filter((val) => val !== ''); 
            
            //whereOb - AND検索でOR条件
            whereOb = {
                ...whereOb,
                AND: searchList.map((search) => ({
                    OR: [
                        { name: { contains: search, mode: 'insensitive' } },
                        { email: { contains: search, mode: 'insensitive' } },
                        { companyName: { contains: search, mode: 'insensitive' } },
                        { businessType: { contains: search, mode: 'insensitive' } },
                    ]
                })) 
            }
        }

        //・sort
        optionOb = {
            ...optionOb,
            orderBy: { createdAt: sort }
        }
        
        //・optionObにorderBy,skip,takeを追加
        optionOb = {
            ...optionOb,
            where: whereOb,
            skip: Number(fetchCount * (page - 1)),
            take: fetchCount + 1,
        }

        //////////
        //■ [ データ取得 ]
        const userList = await prisma.user.findMany({
            ...optionOb,
            select: {
                id: true,
                name: true,
                email: true,
                userType: true,
                businessType: true,
                companyName: true,
                isActive: true,
                amount: true,
                lastLoginAt: true,
                createdAt: true,
            }
        });

        return {
            result: true,
            message: 'success',
            data: userList
        }
    }catch(err){
        const message = err instanceof Error ?  `${err.message}.` : `Internal Server Error.`;
        return {
            result: false,
            message,
        }
    }
};


//////////
//■ [ ユーザー詳細取得 ]
export const getUserDetail = async({
    userId,
}:{
    userId: number
}):Promise<{
    result: boolean
    message: string
    data?: UserDetailType | null
}> => {
    try{
        //////////
        //■ [ データ取得 ]
        const user = await prisma.user.findFirst({
            where: {
                id: userId,
                userType: 'advertiser', // advertiserのみ取得（adminは除外）
            },
            select: {
                id: true,
                name: true,
                email: true,
                userType: true,
                birthDate: true,
                businessType: true,
                companyName: true,
                representativeName: true,
                businessNumber: true,
                isActive: true,
                amount: true,
                lastLoginAt: true,
                createdAt: true,
                updatedAt: true,
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
                    }
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

        return {
            result: true,
            message: 'success',
            data: {
                ...user,
                amount:Number(user.amount)
            }
        }
    }catch(err){
        const message = err instanceof Error ?  `${err.message}.` : `Internal Server Error.`;
        return {
            result: false,
            message,
        }
    }
};