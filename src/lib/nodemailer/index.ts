// src/lib/nodemailer/index.ts

//https://myaccount.google.com/apppasswords
//https://nodemailer.com/

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.GMAIL_USER as string, 
        pass: process.env.GMAIL_PASS as string, 
    },
});

export const sendMail = async ({
    toEmail,
    subject,
    text,
    html,
}:{
    toEmail:string
    subject:string
    text:string
    html:string
}): Promise<{result:boolean,message:string}> =>{
    try{
        //送信
        await transporter.sendMail({
            from: process.env.gmailUser,
            to: toEmail,
            subject,
            text,
            html,
        });
        //成功!!
        return {result:true,message:'success'}
    }catch(err){
        const errMessage = err instanceof Error ?  err.message : `Internal Server Error.`;
        console.log(`Failed to send verification email. Please check your email address and try again. `+errMessage)
        return {
            result:false,
            message:`Failed to send verification email. Please check your email address and try again.`
        }
    }
}

interface EmailTemplate {
    subject: string;
    text: string;
    html: string;
}
export const getVerificationEmailTemplate = ({
    randomNumber6,
    locale = 'ja',
 }:{
    randomNumber6: string;
    locale?: 'ja' | 'en';
 }): EmailTemplate => {
    const templates: Record<'ja' | 'en', EmailTemplate> = {
        ja: {
            subject: 'ECH AD - 認証コード',
            text: `ECH AD 認証コード: ${randomNumber6}\n\n有効期限: 3分\n\n心当たりのない場合は、このメールを無視してください。`,
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>認証コード</title>
</head>
<body style="margin:0;padding:0;background:linear-gradient(135deg,#1a1a2e 0%,#8b1538 100%);font-family:'Segoe UI',Arial,sans-serif;">
    <div style="max-width:500px;margin:40px auto;padding:20px;">
        <div style="background:white;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,0.3);overflow:hidden;">
            <!-- Header -->
            <div style="background:linear-gradient(135deg,#8b1538,#a91d42);padding:30px;text-align:center;">
                <h1 style="color:white;font-size:24px;margin:0;font-weight:600;">ECH AD</h1>
            </div>
            
            <!-- Content -->
            <div style="padding:30px;">
                <p style="color:#333;font-size:16px;margin-bottom:25px;">アカウント認証を完了するため、以下のコードを入力してください。</p>
                
                <div style="background:#f8f9fa;border:2px solid #8b1538;border-radius:8px;padding:20px;text-align:center;margin:20px 0;">
                    <div style="color:#8b1538;font-size:12px;font-weight:600;margin-bottom:10px;">認証コード</div>
                    <div style="font-size:28px;font-weight:800;color:#8b1538;letter-spacing:4px;">${randomNumber6}</div>
                </div>
                
                <div style="background:#fff3cd;border:1px solid #f39c12;border-radius:6px;padding:12px;margin:20px 0;font-size:14px;color:#856404;">
                    ⚠️ 有効期限: 3分間
                </div>
                
                <p style="color:#666;font-size:14px;border-left:3px solid #8b1538;padding-left:12px;">
                    心当たりのない場合は、このメールを無視してください。
                </p>
            </div>
            
            <!-- Footer -->
            <div style="background:#2c3e50;padding:20px;text-align:center;color:#bdc3c7;font-size:12px;">
                © 2025 ECH AD
            </div>
        </div>
    </div>
</body>
</html>`
        },
        
        en: {
            subject: 'ECH AD - Verification Code',
            text: `ECH AD Verification Code: ${randomNumber6}\n\nExpires in: 3 minutes\n\nIf you didn't request this, please ignore this email.`,
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verification Code</title>
</head>
<body style="margin:0;padding:0;background:linear-gradient(135deg,#1a1a2e 0%,#8b1538 100%);font-family:'Segoe UI',Arial,sans-serif;">
    <div style="max-width:500px;margin:40px auto;padding:20px;">
        <div style="background:white;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,0.3);overflow:hidden;">
            <!-- Header -->
            <div style="background:linear-gradient(135deg,#8b1538,#a91d42);padding:30px;text-align:center;">
                <h1 style="color:white;font-size:24px;margin:0;font-weight:600;">ECH AD</h1>
            </div>
            
            <!-- Content -->
            <div style="padding:30px;">
                <p style="color:#333;font-size:16px;margin-bottom:25px;">Please enter the following code to complete your account verification.</p>
                
                <div style="background:#f8f9fa;border:2px solid #8b1538;border-radius:8px;padding:20px;text-align:center;margin:20px 0;">
                    <div style="color:#8b1538;font-size:12px;font-weight:600;margin-bottom:10px;">VERIFICATION CODE</div>
                    <div style="font-size:28px;font-weight:800;color:#8b1538;letter-spacing:4px;">${randomNumber6}</div>
                </div>
                
                <div style="background:#fff3cd;border:1px solid #f39c12;border-radius:6px;padding:12px;margin:20px 0;font-size:14px;color:#856404;">
                    ⚠️ Expires in: 3 minutes
                </div>
                
                <p style="color:#666;font-size:14px;border-left:3px solid #8b1538;padding-left:12px;">
                    If you didn't request this, please ignore this email.
                </p>
            </div>
            
            <!-- Footer -->
            <div style="background:#2c3e50;padding:20px;text-align:center;color:#bdc3c7;font-size:12px;">
                © 2025 ECH AD
            </div>
        </div>
    </div>
</body>
</html>`
        }
    };
    
    return templates[locale];
};