// src/lib/types/profileTypes.ts

//////////
//■[ プロフィール詳細取得用型 ]
export type ProfileDetail = {
    id: number
    name: string
    email: string
    birthDate: Date
    // 事業者情報
    businessType: string | null // individual/corporate/null
    companyName: string | null
    representativeName: string | null
    businessNumber: string | null
    // 住所情報（Addressテーブル）
    address: ProfileAddress | null
    // 電話番号情報（Phoneテーブル）
    phone: ProfilePhone | null
}

//////////
//■[ 住所情報型 ]
export type ProfileAddress = {
    id: number
    country: string | null
    postalCode: string | null
    state: string | null
    city: string | null
    addressLine1: string | null
    addressLine2: string | null
}

//////////
//■[ 電話番号情報型 ]
export type ProfilePhone = {
    id: number
    phoneLastNumber: string // セキュリティ上、ハッシュ化済み
}

//////////
//■[ 各フォーム用データ型（SupportCreateForm参考：[値, エラー文字]形式） ]
//・基本情報フォーム
export type BasicProfileFormType = {
    name: [string, string]      // [値, エラー文字]
    email: [string, string]     // [値, エラー文字]
    birthDate: [string, string] // [値, エラー文字]
}

//・事業者情報フォーム
export type BusinessInfoFormType = {
    businessType: [string, string]      // [値, エラー文字] individual/corporate/''
    companyName: [string, string]       // [値, エラー文字]
    representativeName: [string, string] // [値, エラー文字]
    businessNumber: [string, string]    // [値, エラー文字]
}

//・住所情報フォーム
export type AddressFormType = {
    country: [string, string]      // [値, エラー文字]
    postalCode: [string, string]   // [値, エラー文字]
    state: [string, string]        // [値, エラー文字]
    city: [string, string]         // [値, エラー文字]
    addressLine1: [string, string] // [値, エラー文字]
    addressLine2: [string, string] // [値, エラー文字]
}

//・電話番号フォーム
export type PhoneFormType = {
    phoneNumber: [string, string] // [値, エラー文字]
}

//////////
//■[ 表示用データ型（初期値設定用） ]
//・基本情報表示
export type BasicProfileData = {
    name: string
    email: string
    birthDate: Date
}

//・事業者情報表示
export type BusinessInfoData = {
    businessType: string | null
    companyName: string | null
    representativeName: string | null
    businessNumber: string | null
}

//・住所情報表示
export type AddressData = {
    country: string | null
    postalCode: string | null
    state: string | null
    city: string | null
    addressLine1: string | null
    addressLine2: string | null
}

//////////
//■[ フォーム送信用型 ]
//・基本情報更新
export type BasicProfileFormData = {
    name: string
    email: string
    birthDate: string // フォームからはstring形式
}

//・事業者情報更新
export type BusinessInfoFormData = {
    businessType: 'individual' | 'corporate'
    companyName: string
    representativeName: string
    businessNumber: string
}

//・住所情報更新
export type AddressFormData = {
    country: string
    postalCode: string
    state: string
    city: string
    addressLine1: string
    addressLine2: string
}

//・電話番号更新
export type PhoneFormData = {
    phoneNumber: string
}

//////////
//■[ 進捗管理用型 ]
export type ProfileCompletionStatus = {
    basic: boolean // 基本情報入力済み
    business: boolean // 事業者情報入力済み
    address: boolean // 住所情報入力済み
    phone: boolean // 電話番号入力済み
}