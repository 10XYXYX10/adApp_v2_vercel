'use server'
// src/actions/address/addressActions.ts

//////////
//■[ 郵便番号から住所情報を取得 ]
export const getAddressByPostalCode = async (postalCode: string): Promise<{
    success: boolean
    errMsg: string
    addressData?: {
        prefecture: string
        city: string
        town: string
        prefectureKana: string
        cityKana: string
        townKana: string
    }
}> => {
    try {
        //////////
        //■[ バリデーション ]
        if (!postalCode) return { success: false, errMsg: '郵便番号を入力してください' };
        
        //・ハイフン除去・空白除去
        const cleanCode = postalCode.replace(/[-\s]/g, '');
        
        //・7桁チェック
        if (cleanCode.length !== 7) return { success: false, errMsg: '郵便番号は7桁で入力してください' };
        
        //・数字のみチェック
        if (!/^\d{7}$/.test(cleanCode)) return { success: false, errMsg: '郵便番号は半角数字で入力してください' };

        //////////
        //■[ zipcloud API呼び出し ]
        const response = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${cleanCode}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            // タイムアウト設定（5秒）
            signal: AbortSignal.timeout(5000)
        });
        if (!response.ok) {
            return { success: false, errMsg: '通信エラー。しばらく時間をおいて、再度お試しください。' };
        }

        const data = await response.json();

        //////////
        //■[ レスポンス確認 ]
        if (data.status !== 200) {
            return { success: false, errMsg: data.message || '郵便番号の検索に失敗しました' };
        }

        if (!data.results || data.results.length === 0) {
            return { success: false, errMsg: '該当する住所が見つかりません' };
        }

        //////////
        //■[ 住所データ整形 ]
        const result = data.results[0];
        const addressData = {
            prefecture: result.address1 || '',      // 都道府県
            city: result.address2 || '',            // 市区町村
            town: result.address3 || '',            // 町名
            prefectureKana: result.kana1 || '',     // 都道府県カナ
            cityKana: result.kana2 || '',           // 市区町村カナ
            townKana: result.kana3 || ''            // 町名カナ
        };

        //////////
        //■[ 成功レスポンス ]
        return {
            success: true,
            errMsg: '',
            addressData
        };

    } catch (err) {
        //・タイムアウトエラーの場合
        if (err instanceof Error && err.name === 'AbortError') {
            return { success: false, errMsg: 'API接続がタイムアウトしました' };
        }
        
        //・その他のエラー
        const message = err instanceof Error ? err.message : 'Internal Server Error.';
        return { success: false, errMsg: `住所検索エラー: ${message}` };
    }
};