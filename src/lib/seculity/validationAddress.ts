//////////
//■[ 住所専用バリデーション関数 ]
export const validationForAddress = (str: string, limit: number = 200): {result: boolean, message: string} => {
    // 長さチェック
    if (str.length === 0 || str.length > limit) {
        return {result: false, message: `1～${limit}字以内で入力してください`};
    }
    
    // 住所で使用可能な文字のパターン
    // ・ひらがな、カタカナ、漢字
    // ・半角・全角数字
    // ・住所で一般的な記号: - − ー （ ） () 丁目 番地 号 の
    // ・半角・全角スペース
    const addressPattern = /^[ぁ-んァ-ヶー一-龯０-９0-9\-−ー（）()\s　丁目番地号の]*$/;
    
    if (!addressPattern.test(str)) {
        return {
            result: false, 
            message: '住所に使用できない文字が含まれています'
        };
    }
    
    // XSS対策: 危険なHTMLタグをチェック
    const dangerousPattern = /<[^>]*>/;
    if (dangerousPattern.test(str)) {
        return {
            result: false,
            message: 'HTMLタグは使用できません'
        };
    }
    
    return {result: true, message: 'success'};
};

//////////
//■[ 郵便番号専用バリデーション関数 ]
export const validationForPostalCode = (str: string): {result: boolean, message: string} => {
    if (!str || str.length === 0) {
        return {result: false, message: '郵便番号を入力してください'};
    }
    
    // ハイフン・スペース除去
    const cleanCode = str.replace(/[-\s　]/g, '');
    
    // 7桁の数字チェック
    if (cleanCode.length !== 7) {
        return {result: false, message: '郵便番号は7桁で入力してください'};
    }
    
    if (!/^\d{7}$/.test(cleanCode)) {
        return {result: false, message: '郵便番号は半角数字で入力してください'};
    }
    
    return {result: true, message: 'success'};
};

//////////
//■[ 建物名・部屋番号専用バリデーション（より緩い） ]
export const validationForBuildingName = (str: string, limit: number = 200): {result: boolean, message: string} => {
    // 長さチェック
    if (str.length > limit) {
        return {result: false, message: `${limit}字以内で入力してください`};
    }
    
    // 建物名で使用可能な文字（英数字も含む）
    // ・ひらがな、カタカナ、漢字
    // ・半角・全角英数字
    // ・建物名で一般的な記号
    const buildingPattern = /^[ぁ-んァ-ヶー一-龯０-９0-9A-Za-zＡ-Ｚａ-ｚ\-−ー（）()［］【】「」\s　丁目番地号のマンションビル棟階号室F]*$/;
    
    if (!buildingPattern.test(str)) {
        return {
            result: false,
            message: '建物名に使用できない文字が含まれています'
        };
    }
    
    // XSS対策
    const dangerousPattern = /<[^>]*>/;
    if (dangerousPattern.test(str)) {
        return {
            result: false,
            message: 'HTMLタグは使用できません'
        };
    }
    
    return {result: true, message: 'success'};
};