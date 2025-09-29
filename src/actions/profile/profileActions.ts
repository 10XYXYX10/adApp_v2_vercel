'use server'
// src/actions/profile/profileActions.ts
import { validationForWord, validationForEmail, validationForPhoneNumber, validationForAuthenticationPassword } from "@/lib/seculity/validation";
import { generateRandomNumber6, saveAccessTokenInCookies, security } from "@/lib/seculity/seculity";
import prisma from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { getVerificationEmailTemplate, sendMail } from "@/lib/nodemailer";
import { sendSmsAuth } from "@/lib/vonage/function";
import { rateLimit } from "@/lib/seculity/upstash";
import * as bcrypt from 'bcrypt';
import { validationForAddress, validationForBuildingName, validationForPostalCode } from "@/lib/seculity/validationAddress";

//////////
//■[ 基本情報更新 ]
export const updateBasicProfile = async({
    userId,
    userType,
    name,
    email,
    birthDate,
}:{
    userId: number
    userType: 'advertiser' | 'admin'
    name: string
    email: string
    birthDate: string
}): Promise<{
    success: boolean
    errMsg: string
    statusCode: number
    needsAuth?: boolean
}> => {
    try {
        //////////
        //■[ セキュリティー ]
        const {result, data, message: securityMessage} = await security({readOnly:false});
        if(!result || !data) return {success:false, errMsg:securityMessage, statusCode:401};
        if(data.userType!==userType || data.id!==userId) return {success:false, errMsg:'No permission.', statusCode:401};

        //////////
        //■[ バリデーション ]
        //・name
        let validationResult = validationForWord(name, 50);
        if(!validationResult.result) return {success:false, errMsg:`name: ${validationResult.message}`, statusCode:400};
        //・email
        validationResult = validationForEmail(email);
        if(!validationResult.result) return {success:false, errMsg:`email: ${validationResult.message}`, statusCode:400};
        //・birthDate
        const birthDateObj = new Date(birthDate);
        if(isNaN(birthDateObj.getTime())) return {success:false, errMsg:'有効な日付を入力してください', statusCode:400};
        
        const today = new Date();
        const age = today.getFullYear() - birthDateObj.getFullYear();
        const monthDiff = today.getMonth() - birthDateObj.getMonth();
        const dayDiff = today.getDate() - birthDateObj.getDate();
        let actualAge = age;
        if(monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) actualAge--;
        
        if(actualAge < 18) return {success:false, errMsg:'18歳以上である必要があります', statusCode:400};
        if(birthDateObj > today) return {success:false, errMsg:'未来の日付は入力できません', statusCode:400};

        //////////
        //■[ 現在のユーザー情報取得 ]
        const currentUser = await prisma.user.findUnique({
            where: { id: data.id },
            select: { 
                name: true,
                birthDate: true,
                email: true,
             }
        });
        if(!currentUser) return {success:false, errMsg:'ユーザーが見つかりません', statusCode:404};

        //////////
        //■[ データベース更新：emailの更新有無に関わらず、name & birthDate は更新 ]
        const nameChanged = currentUser.name!==name.trim();
        const birthDateChanged = currentUser.birthDate.toLocaleDateString()!==birthDateObj.toLocaleDateString();
        const emailChanged = currentUser.email !== email.trim();
        //・transaction
        await prisma.$transaction(async (prismaT) => {
            //・変更チェック～name＆birthDate更新
            if(nameChanged||birthDateChanged){
                await prismaT.user.update({
                    where: { id: data.id },
                    data: {
                        name: name.trim(),
                        birthDate: birthDateObj,
                        updatedAt: new Date()
                    }
                });
            }
            //・変更チェック～email更新
            if(emailChanged) {
                //・6桁の認証パスワードを生成
                const randomNumber6 = generateRandomNumber6();
                //・認証パスワードを一時保存
                await prismaT.user.update({
                    where: { id: userId },
                    data: {
                        authenticationPassword: randomNumber6,
                        updatedAt: new Date()
                    }
                });
                //・認証コード送信
                const {subject,text,html} = getVerificationEmailTemplate({randomNumber6,locale:'ja'})
                const {result, message} = await sendMail({
                    toEmail: email.trim(),
                    subject,
                    text,
                    html,
                });
                if(!result) throw new Error(message);
            }
            //・認証を更新 ← 外部通信を介さない.最も失敗確率が低い.ロールバック適用外.最後に実行。
            if(nameChanged){
                const savedResult = await saveAccessTokenInCookies({id:data.id, name:name.trim(), userType, amount:data.amount});
                if(!savedResult.result)throw new Error(savedResult.message);
            }
        },
        {
            maxWait: 10000, // default: 2000
            timeout: 25000, // default: 5000
        }).catch((err)=>{
            throw err;
        });

        //////////
        //■[ 成功レスポンス ]
        return {
            success: true, 
            errMsg: '', 
            statusCode: 200,
            needsAuth: emailChanged
        };

    } catch(err) {
        let errMessage = err instanceof Error ? err.message : 'Internal Server Error.';
        
        // Unique制約違反エラーの処理（攻撃者への手がかり回避のためぼかす）
        if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
            errMessage = 'その情報は既に使用されています。別の内容で入力してください。';
        }
        
        return {success: false, errMsg: errMessage, statusCode: 500};
    }
};

//////////
//■[ 事業者情報更新 ]
export const updateBusinessInfo = async({
    userId,
    userType,
    businessType,
    companyName,
    representativeName,
    businessNumber,
}:{
    userId: number
    userType: 'advertiser' | 'admin'
    businessType: 'individual' | 'corporate'
    companyName: string
    representativeName: string
    businessNumber: string
}): Promise<{
    success: boolean
    errMsg: string
    statusCode: number
}> => {
    try {
        //////////
        //■[ セキュリティー ]
        const {result, data, message: securityMessage} = await security({readOnly:false});
        if(!result || !data) return {success:false, errMsg:securityMessage, statusCode:401};
        if(data.userType!==userType || data.id!==userId) return {success:false, errMsg:'No permission.', statusCode:401};

        //////////
        //■[ バリデーション ]
        //・businessType
        if(businessType !== 'individual' && businessType !== 'corporate') {
            return {success:false, errMsg:'事業形態を選択してください', statusCode:400};
        }
        //・companyName（屋号/会社名）
        let validationResult = validationForWord(companyName, 100);
        if(!validationResult.result) return {success:false, errMsg:`companyName: ${validationResult.message}`, statusCode:400};
        //・representativeName
        validationResult = validationForWord(representativeName, 50);
        if(!validationResult.result) return {success:false, errMsg:`representativeName: ${validationResult.message}`, statusCode:400};
        //・businessNumber（任意）
        if(businessNumber && businessNumber.trim()) {
            validationResult = validationForWord(businessNumber, 50);
            if(!validationResult.result) return {success:false, errMsg:`businessNumber: ${validationResult.message}`, statusCode:400};
        }

        //////////
        //■[ データベース更新 ]
        await prisma.user.update({
            where: { id: data.id },
            data: {
                businessType,
                companyName: companyName.trim(),
                representativeName: representativeName.trim(),
                businessNumber: businessNumber.trim() || null,
                updatedAt: new Date()
            }
        });

        //////////
        //■[ 成功レスポンス ]
        return {success: true, errMsg: '', statusCode: 200};

    } catch(err) {
        const errMessage = err instanceof Error ? err.message : 'Internal Server Error.';
        return {success: false, errMsg: errMessage, statusCode: 500};
    }
};

//////////
//■[ 住所情報更新 ]
export const updateAddress = async({
    userId,
    userType,
    country,
    postalCode,
    state,
    city,
    addressLine1,
    addressLine2,
}:{
    userId: number
    userType: 'advertiser' | 'admin'
    country: string
    postalCode: string
    state: string
    city: string
    addressLine1: string
    addressLine2: string
}): Promise<{
    success: boolean
    errMsg: string
    statusCode: number
}> => {
    try {
        //////////
        //■[ セキュリティー ]
        const {result, data, message: securityMessage} = await security({readOnly:false});
        if(!result || !data) return {success:false, errMsg:securityMessage, statusCode:401};
        if(data.userType!==userType || data.id!==userId) return {success:false, errMsg:'No permission.', statusCode:401};

        //////////
        //■[ バリデーション ]
        //・country（日本固定なので基本チェックのみ）
        if (!country || country.trim() !== '日本') {
            return {success: false, errMsg: '国・地域は「日本」である必要があります', statusCode: 400};
        }
        //・postalCode（必須）
        let validationResult = validationForPostalCode(postalCode);
        if (!validationResult.result) return {success: false, errMsg: `郵便番号: ${validationResult.message}`, statusCode: 400};
        //・state（必須・自動補完済み想定）
        if (!state || !state.trim()) {
            return {success: false, errMsg: '都道府県が設定されていません', statusCode: 400};
        }
        validationResult = validationForAddress(state, 100);
        if (!validationResult.result) return {success: false, errMsg: `都道府県: ${validationResult.message}`, statusCode: 400};
        //・city（必須・自動補完済み想定）
        if (!city || !city.trim()) {
            return {success: false, errMsg: '市区町村が設定されていません', statusCode: 400};
        }
        validationResult = validationForAddress(city, 100);
        if (!validationResult.result) return {success: false, errMsg: `市区町村: ${validationResult.message}`, statusCode: 400};
        //・addressLine1（必須・自動補完済み想定）
        if (!addressLine1 || !addressLine1.trim()) {
            return {success: false, errMsg: '住所1行目が設定されていません', statusCode: 400};
        }
        validationResult = validationForAddress(addressLine1, 200);
        if (!validationResult.result) return {success: false, errMsg: `住所1行目: ${validationResult.message}`, statusCode: 400};
        //・addressLine2（任意・ユーザー入力）
        if (addressLine2 && addressLine2.trim()) {
            validationResult = validationForBuildingName(addressLine2, 200);
            if (!validationResult.result) return {success: false, errMsg: `建物名・部屋番号: ${validationResult.message}`, statusCode: 400};
        }

        //////////
        //■[ データベース更新 ]
        await prisma.$transaction(async (prismaT) => {
            //・既存住所を削除
            await prismaT.address.deleteMany({
                where: { userId: data.id }
            });
            
            //・新しい住所を作成
            await prismaT.address.create({
                data: {
                    userId: data.id,
                    country: country.trim(),
                    postalCode: postalCode.trim() || null,
                    state: state.trim() || null,
                    city: city.trim(),
                    addressLine1: addressLine1.trim() || null,
                    addressLine2: addressLine2.trim() || null
                }
            });
        }, {
            maxWait: 10000,
            timeout: 25000,
        }).catch((err) => {
            throw err;
        });

        //////////
        //■[ 成功レスポンス ]
        return {success: true, errMsg: '', statusCode: 200};

    } catch(err) {
        const errMessage = err instanceof Error ? err.message : 'Internal Server Error.';
        return {success: false, errMsg: errMessage, statusCode: 500};
    }
};


//////////
//■[ 2段階認証コード確認 ]
export const receive2FACode = async({
    userType,
    type,
    value,
    authenticationPassword,
}:{
    userType: 'advertiser' | 'admin'
    type: 'email' | 'phone'
    value: string
    authenticationPassword: string
}): Promise<{
    success: boolean
    errMsg: string
    statusCode: number
}> => {
    try {
        //////////
        //■[ セキュリティー ]
        const {result, data, message: securityMessage} = await security({readOnly:false});
        if(!result || !data) return {success:false, errMsg:securityMessage, statusCode:401};
        if(data.userType!==userType) return {success:false, errMsg:'No permission.', statusCode:401};

        //////////
        //■[ rateLimit ] ← vonageを利用するわけではないのでの利用料金の心配はないが、ブルートフォースで突破されても厄介なので一応レートリミット
        const rateLimitResult = await rateLimit()
        if(!rateLimitResult.success) return {success:false, errMsg:rateLimitResult.message, statusCode:429};//429 Too Many Requests

        //////////
        //■[ バリデーション ]
        const authValidation = validationForAuthenticationPassword(authenticationPassword);
        if(!authValidation.result) return {success:false, errMsg:`認証パスワード: ${authValidation.message}`, statusCode:400};

        //////////
        //■[ 認証パスワード・有効期限チェック ]
        const currentUser = await prisma.user.findUnique({
            where: { id: data.id },
            select: {
                authenticationPassword: true,
                updatedAt: true,
                Phone: { select: { id: true, hashedPhoneNumber: true } }
            }
        });
        if(!currentUser) return {success:false, errMsg:'ユーザーが見つかりません', statusCode:404};

        // 認証パスワード照合
        if(currentUser.authenticationPassword !== authenticationPassword) {
            return {success:false, errMsg:'認証パスワードが正しくありません', statusCode:400};
        }

        // 有効期限チェック（3分）
        const elapsedMinutes = (new Date().getTime() - currentUser.updatedAt.getTime()) / (1000 * 60);
        if(elapsedMinutes >= 3) return {success:false, errMsg:'認証パスワードの有効期限が切れています', statusCode:408};

        //////////
        //■[ 実際のデータ更新 ]
        await prisma.$transaction(async (prismaT) => {
            if(type === 'email') {
                // メールアドレス更新
                await prismaT.user.update({
                    where: { id: data.id },
                    data: { email: value.trim(), updatedAt: new Date() }
                });
            } else {
                // 電話番号ハッシュ化・更新
                const headNumber7 = value.slice(0, 7);
                const endNumber4 = value.slice(-4);
                const hashedPhoneNumber = await bcrypt.hash(headNumber7, 10) + endNumber4;

                if(currentUser.Phone?.id) {
                    await prismaT.phone.update({
                        where: { id: currentUser.Phone.id },
                        data: { hashedPhoneNumber }
                    });
                } else {
                    await prismaT.phone.create({
                        data: { hashedPhoneNumber, userId: data.id }
                    });
                }
            }
        }, {
            maxWait: 10000,
            timeout: 25000,
        }).catch((err) => {
            throw err;
        });

        //////////
        //■[ 成功レスポンス ]
        return {success: true, errMsg: '', statusCode: 200};

    } catch(err) {
        const errMessage = err instanceof Error ? err.message : 'Internal Server Error.';
        return {success: false, errMsg: errMessage, statusCode: 500};
    }
};

//////////
//■[ 電話番号更新（SMS認証開始） ]
export const updatePhoneNumber = async({
    userId,
    userType,
    phoneNumber,
}:{
    userId: number
    userType: 'advertiser' | 'admin'
    phoneNumber: string
}): Promise<{
    success: boolean
    errMsg: string
    statusCode: number
}> => {
    try {
        //////////
        //■[ セキュリティー ]
        const {result, data, message: securityMessage} = await security({readOnly:false});
        if(!result || !data) return {success:false, errMsg:securityMessage, statusCode:401};
        if(data.userType!==userType || data.id!==userId) return {success:false, errMsg:'No permission.', statusCode:401};

        //////////
        //■[ rateLimit ] ← 何度も更新されたら、vonageの利用料金が嵩むのでrateLimitで保護
        //・seculityの後に実行.こうすることで不正なリクエストを弾ける.upstashには利用上限がある.
        const rateLimitResult = await rateLimit()
        if(!rateLimitResult.success)  return {success:false, errMsg:rateLimitResult.message, statusCode:429};//429 Too Many Requests

        //////////
        //■[ バリデーション ]
        const validationResult = validationForPhoneNumber(phoneNumber);
        if(!validationResult.result) return {success:false, errMsg:`phone: ${validationResult.message}`, statusCode:400};

        //////////
        //■[ 現在の電話番号と比較（重複チェック） ]
        const currentUser = await prisma.user.findUnique({
            where: { id: data.id },
            select: {
                Phone: {
                    select: {
                        hashedPhoneNumber: true
                    }
                }
            }
        });
        if(currentUser?.Phone?.hashedPhoneNumber) {
            //更新処理：既存の番号と比較し、同じなら、処理の必要無しと判断
            const headNumber7 = phoneNumber.slice(0, 7);
            const lastNumber4 = phoneNumber.slice(-4);
            const hashedHeadNumber7 = currentUser.Phone.hashedPhoneNumber.slice(0, -4);//戦闘7桁のみhash化
            const hashedLastNumber4 = currentUser.Phone.hashedPhoneNumber.slice(-4);//末尾4桁はhash化してない
            if(lastNumber4 === hashedLastNumber4) {
                const isMatch = await bcrypt.compare(headNumber7, hashedHeadNumber7);
                if(isMatch) return {success:false, errMsg:'現在と同じ電話番号です', statusCode:400};
            }
        }

        //////////
        //■[ SMS認証コード送信 ]
        //・6桁の認証パスワードを生成
        const randomNumber6 = generateRandomNumber6();
        //・データベース更新・認証コード送信 ]
        await prisma.$transaction(async (prismaT) => {
            //・認証パスワードを一時保存
            await prismaT.user.update({
                where: { id: userId },
                data: {
                    authenticationPassword: randomNumber6,
                    updatedAt: new Date()
                }
            });
            const {result, message} = await sendSmsAuth({
                phoneNumber,
                text: String(randomNumber6),
            });
            if(!result) throw new Error(message);
        }, {
            maxWait: 10000,
            timeout: 25000,
        }).catch((err) => {
            throw err;
        });

        //////////
        //■[ 成功レスポンス ]
        return {success: true, errMsg: '', statusCode: 200};

    } catch(err) {
        const errMessage = err instanceof Error ? err.message : 'Internal Server Error.';
        return {success: false, errMsg: errMessage, statusCode: 500};
    }
};