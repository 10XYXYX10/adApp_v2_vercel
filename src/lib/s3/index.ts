// src/lib/s3/index.ts
import { S3Client,DeleteObjectCommand, PutObjectCommand, HeadObjectCommand, ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3';
const bucketName = process.env.BUCKET_NAME as string;

const s3Client = new S3Client({
    region: 'auto',
    endpoint: process.env.ENDPOINT as string,
    credentials: {
        accessKeyId: process.env.IAM_ACCESS_KEY as string,
        secretAccessKey: process.env.IAM_SECRET_KEY as string,
    },
});

//保存
export const saveFile = async({
    Key, 
    Body,
 }:{
    Key:string
    Body:Buffer
 }): Promise<{
    result:boolean,
    message:string
 }> => {
    try{
        await s3Client.send(
            new PutObjectCommand({
                Bucket: bucketName,
                Key,
                Body,
            }),
        );
        return {result:true, message:'success'}
    }catch(err){
        const message = err instanceof Error ?  `saveFile error. ${err.message}` : `Something went wrong.`;
        return {result:false, message};
    }
}

//削除
export const deleteFile = async(Key:string): Promise<{result:boolean,message:string}> => {
    try{
        console.log(`deleteFile-1`)
        console.log(Key)
        //存在しないkeyを指定したとして、エラーにはならない
        await s3Client.send(
            new DeleteObjectCommand({
                Bucket: bucketName,
                Key,
            })
        );
        console.log(`deleteFile-2`)
        return {result:true, message:'success'}
    }catch(err){
        const message = err instanceof Error ?  err.message : `Something went wrong.`;
        return {result:false, message}
    }
}

// ディレクトリごと削除
export const deleteDir = async({
    prefix,
    thumbnailNotDelete
 }:{
    prefix: string
    thumbnailNotDelete?: boolean
 }): Promise<{result:boolean,message:string}>  =>{
    try {
        const listParams = {
            Bucket: bucketName,
            Prefix: prefix, // ディレクトリ内のオブジェクトをリストするために指定
        };

        // ディレクトリ内のオブジェクトをリストする
        const listCommand = new ListObjectsV2Command(listParams);
        const data = await s3Client.send(listCommand);
        const objects = data.Contents;
        if(!objects || objects.length===0)return {result:true, message:'Deleted.'};

        // notDeleteKeyのファイルのみ削除されないように設定：動画更新処理の際、thumbnailのみ削除されないようにする
        let objectsToDelete = objects;
        if(thumbnailNotDelete){
            objectsToDelete = objects.filter(obj => {
                if(obj.Key?.endsWith('thumbnail.jpg') || obj.Key?.endsWith('thumbnail.png')) {
                    return false; // 削除対象から除外
                }
                return true; // 削除対象に含める
            });
        }
        
        // オブジェクトの削除リクエストを作成
        const deleteParams = {
            Bucket: bucketName,
            Delete: {
                Objects: objectsToDelete.map((obj) => ({ Key: obj.Key })),
                Quiet: false,
            },
        };

        // オブジェクトを削除
        const deleteCommand = new DeleteObjectsCommand(deleteParams);
        await s3Client.send(deleteCommand);

        return {result:true, message:'success'}
    }catch(err){
        const message = err instanceof Error ?  err.message : `Something went wrong.`;
        console.log('s:'+message)
        return {result:false, message}
    }
}

//ファイル情報取得
export const getFileInfo = async(
    Key: string
 ): Promise<{
    result: boolean
    message: string 
    data?: {
        contentType:  string | undefined
        contentLength: number | undefined
        lastModified: Date | undefined
        metadata: Record<string, string> | undefined
        eTag: string | undefined
    }
 }> => {
    try {
        // HeadObjectCommandを使用してメタデータのみを取得
        const headResponse = await s3Client.send(
            new HeadObjectCommand({
                Bucket: bucketName,
                Key,
            })
        );
        return {
            result: true,
            message: 'success',
            data: {
                contentType: headResponse.ContentType,
                contentLength: headResponse.ContentLength,
                lastModified: headResponse.LastModified,
                metadata: headResponse.Metadata,
                eTag: headResponse.ETag,
            }
        };
    } catch (err) {
        const message = err instanceof Error ? `getFileInfo error. ${err.message}` : `Something went wrong.`;
        return {result: false, message};
    }
}