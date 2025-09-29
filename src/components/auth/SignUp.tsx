// src/components/auth/SignUp.tsx
import { ChangeEvent, useActionState, useState } from "react";
import AlertError from '../AlertError';
import { signUp } from '@/actions/auth/authActions';
import MailAuth from './MailAuth';
import { validationForPassword, validationForEmail, validationForWord, validationForBirthDate } from "@/lib/seculity/validation";
import { UserType } from "@/lib/types/auth/authTypes";

export default function SignUp({
    userType
 }:{
    userType: UserType
 }) {
    const signUpWithUserType = signUp.bind(null, userType);
    const [state, formAction,isPending] = useActionState(
        signUpWithUserType,
        {
            success:false,
            errMsg:'',
        }
    );

    // 修正: birthDateフィールドを追加
    const [signForm,setSignForm] = useState({
        name:['',''],//[値,エラー文字]
        email:['',''],//[値,エラー文字]
        birthDate:['',''],//[値,エラー文字] - 新規追加
        password:['','']//[値,エラー文字]
    });

    const handleChange = (e:ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
        const inputName = e.target.name;
        const inputVal = e.target.value;
        setSignForm({...signForm,[inputName]:[inputVal,'']})
    }

    const handleAction = (formData:FormData) => {
        ///////////
        //◆【formDataのバリデーション】
        const {name,email,birthDate,password} = signForm; // 修正: birthDateを追加
        //name
        let result = validationForWord(name[0]);
        if( !result.result )name[1]=result.message;
        //email
        result = validationForEmail(email[0]);
        if( !result.result )email[1]=result.message;
        //birthDate - 新規追加
        result = validationForBirthDate(birthDate[0]);
        if( !result.result )birthDate[1]=result.message;
        //password
        result = validationForPassword(password[0]);
        if( !result.result )password[1]=result.message;
        //name,email,birthDate,passwordのvalidation結果を反映
        if(name[1] || email[1] || birthDate[1] || password[1]){
            setSignForm({name,email,birthDate,password});
            return alert('入力内容に問題があります');
        }
        ///////////
        //■[ signUpを実行 ]
        formAction(formData)
    }

    return (<>
        {/* 修正: レスポンシブ対応のコンテナ */}
        <div className="flex items-center justify-center mt-5 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center w-full max-w-md">
                {!state.success
                    ?(<> 
                        {state.errMsg && <AlertError errMessage={state.errMsg} reloadBtFlag={false}/>}
                        <form
                            action={handleAction}
                            className="bg-white shadow-md rounded px-6 sm:px-8 pt-6 pb-8 mb-4 w-full"
                        >
                            {/* 修正: 氏名フィールド */}
                            <div className="mb-4">
                                <label className='block text-gray-700 text-sm sm:text-md font-bold mb-2'>氏名<em className="text-red-500">*</em></label>
                                <span className='text-xs text-gray-500 block mb-2'>{`「< > % ;」`}は使用できません</span>
                                <input
                                    name='name'
                                    type='text'
                                    defaultValue={signForm.name[0]}
                                    onChange={handleChange}
                                    required={true}
                                    placeholder="山田太郎"
                                    className={`
                                        ${signForm.name[1] ? 'border-red-500' : 'border-gray-300'} 
                                        bg-gray-50 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 focus:bg-white transition-colors
                                    `}
                                />
                                {signForm.name[1] && <span className='text-red-500 text-xs italic mt-1 block'>{signForm.name[1]}</span>}
                            </div>

                            {/* メールアドレスフィールド */}
                            <div className="mb-4">
                                <label className='block text-gray-700 text-sm sm:text-md font-bold mb-2'>メールアドレス<em className="text-red-500">*</em></label>
                                <span className='text-xs text-gray-500 block mb-2'>認証メールが送信されます</span>
                                <input
                                    name='email'
                                    type='email'
                                    defaultValue={signForm.email[0]}
                                    onChange={handleChange}
                                    required={true}
                                    placeholder="example@email.com"
                                    className={`
                                        ${signForm.email[1] ? 'border-red-500' : 'border-gray-300'} 
                                        bg-gray-50 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 focus:bg-white transition-colors
                                    `}
                                />
                                {signForm.email[1] && <span className='text-red-500 text-xs italic mt-1 block'>{signForm.email[1]}</span>}
                            </div>

                            {/* 修正: 生年月日フィールド */}
                            <div className="mb-4">
                                <label className='block text-gray-700 text-sm sm:text-md font-bold mb-2'>生年月日<em className="text-red-500">*</em></label>
                                <span className='text-xs text-gray-500 block mb-2'>18歳以上である必要があります</span>
                                <input
                                    name='birthDate'
                                    type='date'
                                    defaultValue={signForm.birthDate[0]}
                                    onChange={handleChange}
                                    required={true}
                                    max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                                    className={`
                                        ${signForm.birthDate[1] ? 'border-red-500' : 'border-gray-300'} 
                                        bg-gray-50 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 focus:bg-white transition-colors
                                    `}
                                />
                                {signForm.birthDate[1] && <span className='text-red-500 text-xs italic mt-1 block'>{signForm.birthDate[1]}</span>}
                            </div>

                            {/* パスワードフィールド */}
                            <div className="mb-6">
                                <label className='block text-gray-700 text-sm sm:text-md font-bold mb-2'>パスワード<em className="text-red-500">*</em></label>
                                <span className='text-xs text-gray-500 block mb-2'>5文字以上の半角の英数字を入力して下さい</span>
                                <input
                                    name='password'
                                    type='password'
                                    defaultValue={signForm.password[0]}
                                    onChange={handleChange}
                                    required={true}
                                    placeholder="パスワード"
                                    className={`
                                        ${signForm.password[1] ? 'border-red-500' : 'border-gray-300'} 
                                        bg-gray-50 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 focus:bg-white transition-colors
                                    `}
                                />
                                {signForm.password[1] && <span className='text-red-500 text-xs italic mt-1 block'>{signForm.password[1]}</span>}
                            </div>

                            {/* 送信ボタン */}
                            <div className='flex items-center justify-center'> 
                                <button
                                    className={`
                                        w-full sm:w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline transition-colors
                                        ${isPending ? 'cursor-not-allowed opacity-50' : ''}
                                    `}
                                    disabled={isPending}
                                    type="submit"
                                >
                                    {isPending ? '・・Loading・・' : 'アカウント作成'}
                                </button>
                            </div>
                        </form>
                    </> ):(
                        <MailAuth email={signForm.email[0]} typeValue={'SignUp'} userType={userType}/>
                    )
                }
            </div>
        </div>

    </>)
}