'use server'
import { sendMail } from "@/lib/nodemailer";
import { rateLimit } from "@/lib/seculity/upstash";
import { validationForEmail, validationForWord } from "@/lib/seculity/validation";

const toEmail = process.env.GMAIL_USER as string;

export const sendContactMail = async({
    fromAddress,
    subject,
    text
}:{
    fromAddress:string
    subject:string
    text:string
}):Promise<{
    success: boolean
    errMsg: string
    statusCode: number
}> =>{
    try{
        //////////
        //■[ rateLimit ]
        const {success,message} = await rateLimit()
        if(!success) return {success:false, errMsg:message, statusCode:403};

        //////////
        //■[ バリデーション ]
        let result = validationForEmail(fromAddress);
        if(!result.result)return {success:false, errMsg:result.message, statusCode:400};
        //・subject
        result = validationForWord(subject,100)
        if(!result.result)return {success:false, errMsg:result.message, statusCode:400};
        //・text
        result = validationForWord(text,500)
        if(!result.result)return {success:false, errMsg:result.message, statusCode:400};

        //////////
        //◆【メールを送信】
        const sendMailResult = await sendMail({
            toEmail,
            subject,
            text,
            html:`
                <p>件名：${subject}</p>
                <p>${fromAddress}</p>
                <p>${text}</p>
            `
        });
        if(!sendMailResult.result)throw new Error(sendMailResult.message);
        
        return {success:true, errMsg:result.message, statusCode:200};

    }catch(err){
        const errMsg = err instanceof Error ?  `${err.message}.` : `Internal Server Error.`;
        return {success:false, errMsg, statusCode:500};
    }
}
