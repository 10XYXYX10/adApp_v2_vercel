//「src/lib/seculity/validation.ts」

//////////
//■[ 危険文字を半角スペースに変換し無害化 ]
//・例：「a<b>c&d"e'f`g　hijk」→「a b c d e f g hijk」
export const dangerousCharToSpace = (str:string) => {
    if (!str) return "";
    return str.replace(
        /[<>&|"'`;　=%?!\\]/g,
        () => ' '
    );  
}

//////////
//■[ 危険文字をエンティティ化 ]
const escapeToEntity: { [key: string]: string } = {
    '<': '&lt;',
    '>': '&gt;',
    '/': '&#x2f;',
    '&': '&amp;',
    '|': '&#x7c;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;',
    ';': '；',//'&#059;',
    '=': '&#x3d;',
    '%': '&#x25;',
    '?': '&#x3f;',
    '!': '&#x21;',
    '#': '&#x23;',
    '@': '&#x40;',
    '*': '&#x2a;',
    '\\': '&#092;',
    '+': '&#x2b;',
    '-': '&#x2d;',
};
export const dangerousCharToEntity = (str: string) => {
    if (!str) return "";
    return str.replace(
        /[<>/&|"'`;=%?!#@*\\\+\-]/g, 
        (match) => escapeToEntity[match]
    );  
}

//////////
//■[ エンティティ化を元に ]
const unescape_halfWidth: { [key: string]: string } = {
    '&lt;': '<',
    '&gt;': '>',
    '&#x2f;': '/',
    '&amp;': '&',
    '&#x7c;': '|',
    '&quot;': '"',
    '&#x27;': "'",
    '&#x60;': '`',
    '&#059;': ';',
    '；': ';',
    '&#x3d;': '=',
    '&#x25;': '%',
    '&#x3f;': '?',
    '&#x21;': '!',
    '&#x23;': '#',
    '&#x40;': '@',
    '&#x2a;': '*',
    '&#092;': '\\',
    '&#x2b;': '+',
    '&#x2d;': '-',
};
const unescape_fullWidth: { [key: string]: string } = {
    '&lt;': '＜',
    '&gt;': '＞',
    '&#x2f;': '／',
    '&amp;': '＆',
    '&#x7c;': '｜',
    '&quot;': '”',
    '&#x27;': "’",
    '&#x60;': '‘',
    '&#059;': '；',
    '&#x3d;': '＝',
    '&#x25;': '％',
    '&#x3f;': '？',
    '&#x21;': '！',
    '&#x23;': '＃',
    '&#x40;': '＠',
    '&#x2a;': '＊',
    '&#092;': '＼',
    '&#x2b;': '＋',
    '&#x2d;': 'ー',
};
export const entityToDangerousChar = (str: string, fullOrHalf:'full'|'half'='half') => {
    if (!str) return "";
    const unescape = fullOrHalf==='half' ? unescape_halfWidth : unescape_fullWidth;
    return str.replace(
        /(&lt;|&gt;|&#x2f;|&amp;|&#x7c;|&quot;|&#x27;|&#x60;|&#059;|&#x3d;|&#x25;|&#x3f;|&#x21;|&#x23;|&#x40;|&#x2a;|&#092;|&#x2b;|&#x2d;)/g,
        ( match ) => unescape[match]
    );
}

//■[ 汎用的なXSS対策 ]
export const validationForWord = (str:string,limit:number=20): {result:boolean, message:string} => {
    // 長さ1～20の範囲
    if (str.length===0 || str.length>limit) return {result:false, message:`1～${limit}字以内の文字列を入力して下さい`}
	//htmlエンティティ
	const pattern = /[<>/&|"'`;=%?!#@*\\\+\-]/;
	if(pattern.test(str))return{result:false, message:'半角の「<>/&|"\'`;=%?!#@*\\+-」は使用不可'};
    // 成功!!
    return {result:true,message:'success'}
}

//■[ メールアドレスのバリデーション ]
export const validationForEmail = (str:string): {result:boolean, message:string} => {
    //長さ1～50の範囲
    if(str.length===0 || str.length>50)return {result:false, message:'1～50字以内のメールアドレを入力して下さい'};
    //email形式
    const emailRegex = /^[a-zA-Z0-9]+[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const result = emailRegex.test(str)
    if(!result)return {result:false, message:'有効なメールアドレスの形式でありません'};
    // 成功!!
    return {result:true,message:'success'}
}

//■[ パスワードのバリデーション ]
export const validationForPassword = (str:string): {result:boolean, message:string} => {
    //長さ5～50の範囲
    if(str.length<5 || str.length>50)return {result:false, message:'5～50字以内の半角の英数字を入力して下さい'};
    //email形式
    const passwordRegex = /^[A-Za-z0-9]+$/;
    const result = passwordRegex.test(str);
    if(!result)return {result:false, message:'半角の英数字で入力して下さい'};
    // 成功!!
    return {result:true,message:'success'}
}

//■[ authenticationPassword(6桁の数字) ]
export const validationForAuthenticationPassword = (str:string): {result:boolean, message:string} => {
    //6桁
    if(str.length!==6)return {result:false, message:'6桁の半角数字を入力して下さい'};
    //半角数字
    const passwordRegex = /^[0-9]+$/;
    const result = passwordRegex.test(str);
    if(!result)return {result:false, message:'半角数字で入力して下さい'};
    // 成功!!
    return {result:true,message:'success'}
}

//■「070,080,090 + 8桁の」日本の携帯電話番号
//・「google-libphonenumber」は精度が低いので不採用。「08011111111」なども許可してしまう。
//・vonageの大量リクエストによるEdosの対策は、このvalidation関数 + ピンポイントでの厳しめのratelimitで対応する
export const validationForPhoneNumber = (str:string): {result:boolean, message:string} => {
    //11桁
    if(str.length!==11)return {result:false, message:'11桁の半角数字を入力して下さい'};
    
    //半角数字
    const japanesePhoneNumberRegex = /^0[7-9]0\d{8}$/;
    const result = japanesePhoneNumberRegex.test(str);
    if(!result)return {result:false, message:'070,080,090のいずれかで始まる11桁の半角数字を入力して下さい'};

    // 冒頭3字以降を、4桁の2つのブロックに分け、それぞれ同じ数字の連続の場合はfalse
    const block1 = str.slice(3, 7);
    const block2 = str.slice(7, 11);
    const repeatedNumberRegex = /(\d)\1{3}/;
    if (repeatedNumberRegex.test(block1) && repeatedNumberRegex.test(block2)) {
        return { result: false, message: '同じ数字が4回連続している部分があります' };
    }

    // 連番のチェック
    const checkBlock = str.slice(3, 11);
    if(
        checkBlock=== '01234567'||
        checkBlock=== '12345678'||
        checkBlock=== '23456789'||
        checkBlock=== '76543210'||
        checkBlock=== '87654321'||
        checkBlock=== '98765432'
    )return { result: false, message: '8桁の連番が含まれています' };

    // 成功!!
    return {result:true,message:'success'}
}

// 修正: 生年月日のバリデーション関数を追加
export const validationForBirthDate = (str: string): {result: boolean, message: string} => {
    if (!str) return {result: false, message: '生年月日を入力して下さい'};
    
    const birthDate = new Date(str);
    const today = new Date();
    
    // 有効な日付かチェック
    if (isNaN(birthDate.getTime())) {
        return {result: false, message: '有効な日付を入力して下さい'};
    }
    
    // 18歳以上かチェック
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    
    let actualAge = age;
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        actualAge--;
    }
    
    if (actualAge < 18) {
        return {result: false, message: '18歳以上である必要があります'};
    }
    
    // 未来の日付でないかチェック
    if (birthDate > today) {
        return {result: false, message: '未来の日付は入力できません'};
    }
    
    return {result: true, message: 'success'};
};


//////////
//■[ youtubeに動画が存在するか！軽度な確認 ]
export const validateSimpleYouTubeId = async (videoId: string): Promise<{
  exists: boolean
  error?: string
}> => {
    // 基本的なフォーマットチェック
    const videoIdTrimmed = videoId.trim();
    if (!videoIdTrimmed) return { exists: false, error: 'YouTube動画IDが空です' };
    
    // YouTube動画IDの基本的な形式チェック（11文字の英数字とハイフン、アンダースコア）
    const youtubeIdRegex = /^[a-zA-Z0-9_-]{11}$/;
    if (!youtubeIdRegex.test(videoIdTrimmed)) {
        return { exists: false, error: 'YouTube動画IDの形式が正しくありません' };
    }

    try {
        // YouTube oEmbed APIを使用して動画の存在確認
        const response = await fetch(
            `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoIdTrimmed}&format=json`,
            {
                method: 'GET',
                signal: AbortSignal.timeout(5000)
            }
        );

        console.log(`YouTube validation response status: ${response.status} for videoId: ${videoIdTrimmed}`);

        if (response.status === 200) {
            // レスポンスボディを確認（追加の検証）
            const data = await response.json();
            
            // oEmbedレスポンスに必要なフィールドが含まれているかチェック
            if (data && data.title && data.html) {
                return { exists: true };
            } else {
                return { exists: false, error: 'YouTube動画の情報を取得できませんでした' };
            }
        } else if (response.status === 404) {
            return { exists: false, error: 'YouTube動画が見つかりません' };
        } else if (response.status === 401 || response.status === 403) {
            return { exists: false, error: 'YouTube動画にアクセスできません（非公開またはプライベート動画）' };
        } else {
            return { exists: false, error: `YouTube動画の確認でエラーが発生しました（ステータス: ${response.status}）` };
        }

    } catch (error) {
        console.error('YouTube validation error:', error);
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                return { exists: false, error: 'YouTube動画の確認がタイムアウトしました' };
            } else if (error.message.includes('fetch')) {
                return { exists: false, error: 'ネットワークエラーが発生しました' };
            }
        }
        return { exists: false, error: 'YouTube動画の確認に失敗しました' };
    }
}
