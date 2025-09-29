// src/lib/seculity/seculity.ts
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { AuthUser } from '@/lib/types/auth/authTypes';
import * as jose from 'jose';//middlewareで動かす場合、jsonwebtokenではエラーとなる

const jwtKeyFromEnv = process.env.JWT_HASH_KEY as string;
const jwtKeyUint8Array = new TextEncoder().encode(jwtKeyFromEnv);
const adminNames = process.env.ADMIN_NAMES as string;
const adminNameList = adminNames.split(',');

//認証パスワード：6桁のランダムな数値
export const generateRandomNumber6 = (): string => {
    // Math.random() は予測されやすい擬似乱数なのでNG
    // → 認証コードには「暗号学的に安全な乱数」が必要

    const array = new Uint32Array(1); 
    // 32bit 符号なし整数を1つ分入れる配列を作成（器を用意）

    crypto.getRandomValues(array);
    // OSレベルの安全な乱数で配列を埋める
    // → Math.random()より安全で推測困難

    return String(array[0] % 1000000).padStart(6, "0");
    // 乱数を 0〜999999 に収める（% 1000000）
    // String() に変換し、桁数が不足したら 0 で埋めて6桁固定にする
    // 例: 123 → "000123"
};


export const jwtAccessTokenEncode = async({
    objectData
}:{
    objectData:AuthUser;
}):Promise<{
    result:boolean;
    messag:string;
    data:string;
}> => {
    try{
        const token = await new jose.SignJWT(objectData)
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('2h')
            .sign(jwtKeyUint8Array);

        return {
            result:true,
            messag:'success',
            data:token
        };
    }catch(err){
        const errMessage = err instanceof Error ?  err.message : `Internal Server Error.`;
        return {
            result:false,
            messag:errMessage,
            data:'',
        };
    }
}

export const jwtAccessTokenDecode = async ({
    jwtEncoded
}:{
    jwtEncoded:string;
}):Promise<{
    result:boolean;
    messag:string;
    data:string|jose.JWTPayload;
}> => {
    try{
        if (!jwtEncoded || typeof jwtEncoded !== 'string')throw new Error(`Internal Server Error.`);

        // JWT形式の基本チェック（3つの部分がドットで区切られているか）
        const jwtParts = jwtEncoded.split('.');
        if (jwtParts.length !== 3) throw new Error(`Internal Server Error.`);

        const { payload } = await jose.jwtVerify(jwtEncoded, jwtKeyUint8Array);

        //payloadの基本構造検証
        if (!payload || typeof payload !== 'object')throw new Error('Invalid JWT payload structure.');

        // 必須クレームの存在確認
        if (!payload.id || !payload.name || !payload.userType)throw new Error('Missing required JWT claims.');

        return {
            result:true,
            messag:'success',
            data:payload
        };
    }catch(err){
        const errMessage = err instanceof Error ?  `decoded err.${err.message}` : `Internal Server Error.`;
        return {
            result:false,
            messag:errMessage,
            data:'',
        };
    }   
}

export const security = async ({
    jwtEncodedStr = undefined,
    readOnly
 }:{
    jwtEncodedStr?: string
    readOnly: boolean // Server Componentから呼ばれる場合はtrue。cookie変更はユーザーアクション起因でないとエラーになるため
 }):Promise<{
    result:boolean;
    data:AuthUser|null;
    message:string,
 }> => {
    try{
        //await new Promise((resolve) => setTimeout(resolve, 6000))
        
        //////////
        //■[ 引数のフラグを調整 ]
        //・middlewareから呼び出す際は、jwtEncodedStrを指定 & readOnly:trueで実行。
        //  jwtEncodedStrが有効の際は、readOnlyがtrueでないとエラーとする
        if(jwtEncodedStr && readOnly===false){
            throw new Error('Authentication flag mismatch.');
        }

        //////////
        //■[ jwt認証 ]
        let jwtEncoded: string;
        try {
            jwtEncoded = jwtEncodedStr ? jwtEncodedStr : (await cookies()).get('accessToken')?.value || '';
        } catch (cookieError) {
            console.error(cookieError)
            throw new Error('Authentication error.');
        }
        if(!jwtEncoded)throw new Error('Authentication error.');
        

        const jwtDecodeResult = await jwtAccessTokenDecode({jwtEncoded});
        if(!jwtDecodeResult.result){
            // 修正: cookieの削除処理を安全に実行
            if(!readOnly && jwtEncoded && !jwtEncodedStr) {
                try {
                    (await cookies()).delete('accessToken');
                } catch (deleteCookieError) {
                    // Cookie削除エラーはログに記録するが処理は継続
                    console.warn('Failed to delete access token cookie:', deleteCookieError);
                }
            }
            throw new Error('Authentication error.' + jwtDecodeResult.messag);
        }

        const jwtDecoded = jwtDecodeResult.data;
        if(typeof jwtDecoded !== 'object' || jwtDecoded === null){
            // 修正: cookieの削除処理を安全に実行
            if(!readOnly && jwtEncoded && !jwtEncodedStr) {
                try {
                    (await cookies()).delete('accessToken');
                } catch (deleteCookieError) {
                    console.warn('Failed to delete access token cookie:', deleteCookieError);
                }
            }
            throw new Error('Authentication error.');
        }
        
        const id = typeof jwtDecoded.id === 'number' ? jwtDecoded.id : null;
        const name = typeof jwtDecoded.name === 'string' ? jwtDecoded.name : null;
        const userType = typeof jwtDecoded.userType === 'string' ? jwtDecoded.userType : null;
        const amount = typeof jwtDecoded.amount === 'number' ? jwtDecoded.amount : null;
        if(!id || !name || !userType || (userType!=='admin' && userType!=='advertiser') || amount===null){
            if(!readOnly && jwtEncoded && !jwtEncodedStr) {
                try {
                    (await cookies()).delete('accessToken');
                } catch (deleteCookieError) {
                    console.warn('Failed to delete access token cookie:', deleteCookieError);
                }
            }
            throw new Error('Authentication error.');
        }

        //////////
        //■[ admin検証 ]
        if(userType==='admin'){
            if(!adminNameList.includes(name))throw new Error('Authentication error.');
        }

        //////////
        //■[ userの存在確認 ]
        //・middlewareでの認証:JWTのみチェック
        //・create,update,delete：JWT＋DBでデータチャック
        if(!readOnly && !jwtEncodedStr){
            const checkUser = await prisma.user.findUnique({
                where:{
                    id,
                    name, //ログインUserが変更可能な値.この値を認証確認に含めてしまうと、値変動時にエラーとなってしまう ← name更新時にaccessTokenも更新.この方が厳格
                    userType,
                    //amount, //ログインUserが変更可能な値.この値を認証確認に含めてしまうと、値変動時にエラーとなってしまう
                    isActive:true,
                },
            });
            if(!checkUser){
                if(!readOnly && jwtEncoded && !jwtEncodedStr) {
                    try {
                        (await cookies()).delete('accessToken');
                    } catch (deleteCookieError) {
                        console.warn('Failed to delete access token cookie:', deleteCookieError);
                    }
                }
                throw new Error('Authentication error.');
            }            
        }

        //////////
        //■[ return ]
        return {
            result:true,
            data:{
                id,
                name,
                userType,
                amount,
            },
            message:'success',
        }

    }catch(err){
        const errMessage = err instanceof Error ?  err.message : `Internal Server Error.`;
        return {
            result:false,
            data:null,
            message:errMessage,
        };
    }
}

export const saveAccessTokenInCookies = async({
    id,
    name,
    userType,
    amount,
 }:{
    id: number;
    name: string;
    userType: 'admin'|'advertiser';
    amount: number;
 }):Promise<{
    result:boolean;
    message:string;
 }> => {
    try{
        //////////
        //■[ jwtトークン生成 ]
        const {result,messag,data} = await jwtAccessTokenEncode({objectData:{id,name,userType,amount}});
        if(!result)throw new Error(messag);
        const token = data;

        //////////
        //■[ jwtトークンをcookieに保存 ]
        (await cookies()).set({
            name: 'accessToken',
            value: token,
            httpOnly: true, //クライアントサイドのJavaScriptでの操作を不可に
            sameSite: 'strict', //今回は、front,back共にNext.jsで作成しているので、cookieが同一サイト内のリクエストにのみ送信されるように設定
            secure: true, //セキュリティを強化のため、HTTPS接続でのみクッキーを送信
            maxAge: 2 * 60 * 60, // 修正: 2時間（秒単位）でJWTの有効期限と一致
        });
        
        //////////
        //■[ return ]
        return {result:true,message:'success'}
    }catch(err){
        const errMessage = err instanceof Error ?  err.message : `Internal Server Error.`;
        return {result:false,message:errMessage}
    }
}
