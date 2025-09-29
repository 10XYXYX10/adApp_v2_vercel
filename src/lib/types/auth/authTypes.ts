// src/lib/types/auth/authTypes.ts

export type UserType = 'admin'|'advertiser';

//////////
//■[ 認証 ]
export type AuthUser = {
    id:number
    name:string
    userType: UserType|''
    amount: number
}

//////////
//■[ ServerActions ]
export interface SignFormState {
    success:boolean
    errMsg:string
}
