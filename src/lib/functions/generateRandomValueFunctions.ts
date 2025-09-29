//「src/lib/functions/fileNames.ts」

// ## 5文字のランダムなアルファベット
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const generateRandomString = (): string => {
  let result = '';
  for (let i = 0; i < 3; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// ## 現在の日時を元にした"YYYYMMDDHHMMSS"形式の文字列
const generateDateTimeString = (): string => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}${month}${day}${hours}${minutes}${seconds}`;  
}


// ## ファイル名の先頭＝「年月日時分秒+ランダムなアルファベット5文字」＝「20250425abcde」
export const generateFileNamePrefix = (): string => {
  const dateTimeString = generateDateTimeString();
  const randomString = generateRandomString();

  return `${dateTimeString}${randomString}`;
}


// ## WordPressのメディアアップロードパス（年/月）を生成
export const generateWordPressMediaPath = (): string => {
  const now = new Date();
  
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  
  return `${year}/${month}/`;
}

//////////
//■[ 一意キー生成 ]
export const generateUniqueKey = (prefix: string): string => {
  const currentDateTime = new Date().getTime()
  const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `${prefix}-${currentDateTime}-${randomSuffix}`
}

