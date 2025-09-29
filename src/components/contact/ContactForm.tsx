'use client'
import { ChangeEvent, MouseEvent,useState } from 'react'
import AlertError from '../AlertError';
import SpinnerModal from '../SpinnerModal';
import { validationForEmail, validationForWord } from '@/lib/seculity/validation';
import { sendContactMail } from '@/actions/contact/contactActions';

export const labelClassVal = "block text-gray-700 text-md font-bold";
export  const inputClassVal = "bg-gray-100 shadow appearance-none break-all border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline";
export  const inputClassValForPrice = "bg-gray-100 shadow appearance-none break-all border rounded w-80 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline";

type CreateUserForm = {
    fromAddress:[string,string]
    subject:[string,string]
    text:[string,string]
}

export default function ContactForm(){
    const [error, setError] = useState('');
    const [loadingFlag,setLoadingFlag] = useState(false);
    const [formData,setFormData] = useState<CreateUserForm>({
        fromAddress:['',''],
        subject:['',''],
        text:['',''],
    });
    const [sendMailMsg,setSendMailMsg] = useState('');

    const handleSubmit = async (e:MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if(error)setError('');

        const {fromAddress,subject,text} = formData;
        if(!fromAddress[0] || !subject[0] || !text[0])return alert('入力欄を埋めて下さい');
        //////////
        //□バリデーション
        let alertFlag = false;
        //email
        let result = validationForEmail(fromAddress[0]);
        if( !result.result ){
            fromAddress[1]=result.message;
            alertFlag = true;
        }
        //subject
        result = validationForWord(subject[0],100);
        if( !result.result ){
            subject[1]=result.message;
            alertFlag = true;
        }
        //text
        result = validationForWord(text[0],500);
        if( !result.result ){
            text[1]=result.message;
            alertFlag = true;
        }
        //最終バリデーション
        setFormData({fromAddress,subject,text});
        if(alertFlag)return alert('入力内容に問題があります');

        try{
            setLoadingFlag(true);
            const {success,errMsg} = await sendContactMail({
                fromAddress:fromAddress[0],
                subject:subject[0],
                text:text[0]
            });
            if(!success){            
                setError(errMsg);
            }else{
                alert('Success.');
                setSendMailMsg('Success.')
            }
        }catch(err){
            const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
            setError(message)
        }
        setLoadingFlag(false);
    }

    const handleChange = (e:ChangeEvent<HTMLInputElement>|ChangeEvent<HTMLTextAreaElement>) => {
        const inputVal = e.target.value;
        const inputName = e.target.name;
        setFormData({...formData,[inputName]:[inputVal,'']})
      }

    return (
        <div className="flex items-center justify-center">
            <div className="w-full max-w-lg">
                {loadingFlag && <SpinnerModal />}
                {error && <AlertError errMessage={error} />}
                {sendMailMsg ? (
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
                        <div className="text-4xl mb-4">✅</div>
                        <h3 className="text-xl font-bold text-white mb-2">送信完了</h3>
                        <p className="text-gray-300">{sendMailMsg}</p>
                    </div>
                ) : (
                    <form 
                        onSubmit={(e) => e.preventDefault()}
                        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl"
                    >
                        <div className="mb-6">
                            <label className="block text-white text-sm font-semibold mb-2">
                                メールアドレス<span className="text-pink-400 ml-1">*</span>
                            </label>
                            <input
                                name="fromAddress"
                                type="email"
                                required
                                placeholder="your@email.com"
                                className={`w-full px-4 py-3 bg-white/10 border ${
                                    formData.fromAddress[1] ? 'border-red-400' : 'border-white/20'
                                } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300`}
                                onChange={handleChange}
                            />
                            {formData.fromAddress[1] && (
                                <p className="text-red-400 text-xs mt-1">{formData.fromAddress[1]}</p>
                            )}
                        </div>

                        <div className="mb-6">
                            <label className="block text-white text-sm font-semibold mb-2">
                                タイトル<span className="text-pink-400 ml-1">*</span>
                            </label>
                            <input
                                name="subject"
                                type="text"
                                required
                                placeholder="お問い合わせの件名"
                                className={`w-full px-4 py-3 bg-white/10 border ${
                                    formData.subject[1] ? 'border-red-400' : 'border-white/20'
                                } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300`}
                                onChange={handleChange}
                            />
                            {formData.subject[1] && (
                                <p className="text-red-400 text-xs mt-1">{formData.subject[1]}</p>
                            )}
                        </div>

                        <div className="mb-8">
                            <label className="block text-white text-sm font-semibold mb-2">
                                本文<span className="text-pink-400 ml-1">*</span>
                            </label>
                            <textarea
                                name="text"
                                required
                                placeholder="お問い合わせ内容をご記入ください"
                                rows={5}
                                className={`w-full px-4 py-3 bg-white/10 border ${
                                    formData.text[1] ? 'border-red-400' : 'border-white/20'
                                } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 resize-none`}
                                onChange={handleChange}
                            />
                            {formData.text[1] && (
                                <p className="text-red-400 text-xs mt-1">{formData.text[1]}</p>
                            )}
                        </div>

                        <button
                            className={`w-full py-4 px-6 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-2xl hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105 ${
                                loadingFlag ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            disabled={loadingFlag}
                            onClick={handleSubmit}
                        >
                            {loadingFlag ? 'メール送信中...' : 'メール送信'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}
