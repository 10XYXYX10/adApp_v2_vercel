import NextImage from "next/image";
import { ChangeEvent, Dispatch, SetStateAction, memo, useEffect, useRef, useState } from "react"
const mediaPath = process.env.NEXT_PUBLIC_MEDIA_PATH || '';//NEXT_PUBLIC_MEDIA_PATHが有効でない場合は、空の文字列が代入される

//////////
//■[ 型,データ,関数定義 ]
type imageDataType = {
    width:number,
    height:number,
    src:string,
    type:'jpg'|'png'|'gif'
}

const FILE_CONSTRAINTS = {
    maxSize: 100 * 1024, // 100KB
    maxSizeGif: 4.5 * 1024 * 1024, // 4.5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif'],
    requiredDimensions: { width: 400, height: 225 },
    accept: 'image/jpeg,image/png,image/gif'
}

const imageSize = async (file:File): Promise<
    imageDataType | Error
> => {
    return new Promise((resolve, reject) => {
        const type = file.type === 'image/jpeg' ? 'jpg' : file.type === 'image/png' ? 'png' : 'gif';
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);
        console.log(`createObjectURL:${objectUrl}`)//revokeの動作確認のために記述しています。動作確認以降は、削除して下さい。
        img.onload = () => {
            const width = img.naturalWidth;
            const height = img.naturalHeight;
            let message = '';
            //widhtとheightの値に応じて、エラーハンドリング
            if(width!==FILE_CONSTRAINTS.requiredDimensions.width || height!==FILE_CONSTRAINTS.requiredDimensions.height){
                message = `画像は、width=${FILE_CONSTRAINTS.requiredDimensions.width}, height=${FILE_CONSTRAINTS.requiredDimensions.height} である必要があります。`;
                URL.revokeObjectURL(objectUrl); // エラーが発生した場合オブジェクトURLを解放
                console.log(`revokeObjectURL:${objectUrl}`)
                reject(new Error(message));
            }
            //処理成功
            resolve({
                width,
                height,
                src:img.src,
                type: file.type === 'image/jpeg' ? 'jpg' : file.type === 'image/png' ? 'png' : 'gif'
            });
        };
        img.onerror = (err) => {
            const message = err instanceof Error ? err.message : 'Somethin went wrong.';
            URL.revokeObjectURL(objectUrl); // エラーが発生した場合オブジェクトURLを解放
            console.log(`revokeObjectURL:${objectUrl}`)//revokeの動作確認のために記述しています。動作確認以降は、削除して下さい。
            reject(new Error(message))
        };
        img.src = objectUrl;
    });
}

const ImageUploadZone = memo( ({
    selectedFile,
    setSelectedFile,
}:{
    selectedFile: File|null,
    setSelectedFile: Dispatch<SetStateAction<File | null>>
}) => {
    const [error, setError] = useState('画像を選択して下さい。');
    const inputFileRef = useRef<HTMLInputElement>(null);
    const [imageData,setImageData] = useState<imageDataType|null>(null);

    //imageDataの変更を監視し、適切にクリーンアップ
    useEffect(() => {
        //stateのimageDataが更新された際、クリーンアップ関数が実行される。この時のクリーンアップ関数内で読み込んでいるimageDataは、更新前の値。
        return () => {
            //createObjectURLで生成されたURLパスの先頭は、アプリケーションを表示しているルートURLで始まります
            if(
                imageData && 
                imageData.src && 
                !imageData.src.startsWith(mediaPath) // 記事更新時、imageData.srcの値は、createObjectURLで生成されたものではなく、mediaPathで始まる値となる。
            ) {
                console.log(`useEffect > revokeObjectURL:${imageData.src}`)//revokeの動作確認のために記述しています。動作確認以降は、削除して下さい。
                URL.revokeObjectURL(imageData.src);
            }
        };
    }, [imageData]);

    const handleFileChange = async (e:ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (!file) return;

        const type = file.type === 'image/jpeg' ? 'jpg' : file.type === 'image/png' ? 'png' : 'gif';
        if(type==='gif') {
            if(file.size > FILE_CONSTRAINTS.maxSizeGif){
                alert(`GIFのアップロード可能サイズは 4.5MB までです`);
                setError(`GIFのアップロード可能サイズは 4.5MB までです`);
                if(inputFileRef.current)inputFileRef.current.value="";
                // setSelectedFile(null); //画像選択済み状態 → 画像を再選択は出来ないので不要！,,,return内のdomを確認しろ
                // setImageData(null);//画像選択済み状態 → 画像を再選択は出来ないので不要！,,,return内のdomを確認しろ
                return;
            }
        }else{
            if(file.size > FILE_CONSTRAINTS.maxSize){
                alert(`JPG,PNGのアップロード可能サイズは 100KB までです`);
                setError(`JPG,PNGのアップロード可能サイズは 100KB までです`);
                if(inputFileRef.current)inputFileRef.current.value="";
                return;
            }
        }
    
        try{
            const result = await imageSize(file);
            if(result instanceof Error)throw new Error(result.message);
            setSelectedFile(file);
            setImageData(result);
            setError('')
        }catch(err){
            const message = err instanceof Error ? err.message : '画像の解析に失敗しました。もう一度、あるいは、別の画像でお試し下さい。';
            if(inputFileRef.current)inputFileRef.current.value="";
            setError(message);
            alert(message);
        }
    };

    const handleDelete = async() => {
        if(inputFileRef.current)inputFileRef.current.value="";
        setSelectedFile(null);
        setImageData(null);
        setError('画像を選択して下さい。');
    }

    return(<>
        {/* <label className='block text-gray-700 text-md font-bold mt-6'>thumbnail(jpg画像)<em className="text-red-500">*</em></label> */}
        <div className="mb-5 bg-gray-100 shadow-md rounded px-8 pt-1 pb-8 w-full max-w-md">
            
            {imageData && imageData.src && (
                <div className="p-3">
                    <NextImage
                        src={imageData.src}
                        width={Math.floor(imageData.width*0.7)}
                        height={Math.floor(imageData.height*0.7)}
                        alt={'thumbnail'}
                        className="mx-auto rounded-lg shadow-sm"
                    />
                </div>
            )}

            {!selectedFile?(<>
                <div
                    className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 text-center transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 cursor-pointer"
                    onDragOver={(e) => {
                        e.preventDefault()
                        e.currentTarget.classList.add('border-blue-400', 'bg-blue-50')
                    }}
                    onDragLeave={(e) => {
                        e.preventDefault()
                        e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50')
                    }}
                    onDrop={(e) => {
                        e.preventDefault()
                        e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50')
                        if (e.dataTransfer.files?.[0]) {
                            const file = e.dataTransfer.files[0]
                            const event = { target: { files: [file] } } as unknown as ChangeEvent<HTMLInputElement>
                            handleFileChange(event)
                        }
                    }}
                    onClick={() => inputFileRef.current?.click()}
                >
                    <div className="mb-4">
                        <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <p className="text-sm font-medium text-gray-700 mb-1">画像をドラッグ&ドロップ</p>
                        <p className="text-xs text-gray-500 mb-3">または クリックして選択</p>
                        <ul className='text-xs text-gray-600 space-y-1 text-left max-w-xs mx-auto'>
                            <li className="flex items-start gap-2">
                                <span className="w-1 h-1 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></span>
                                <span>形式: JPG、PNG、GIF</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1 h-1 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></span>
                                <span>サイズ: {FILE_CONSTRAINTS.requiredDimensions.width}×{FILE_CONSTRAINTS.requiredDimensions.height}px</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1 h-1 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></span>
                                <span>容量: JPG/PNG 100KB以下、GIF 4.5MB以下</span>
                            </li>
                        </ul>
                        <input
                            placeholder='thumbnail image'
                            ref={inputFileRef}
                            type="file"
                            accept=".jpg, .png, .gif"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        {error && <p><span className='text-red-500 font-bold text-xs italic'>{error}</span></p>}
                    </div>
                </div>
            </>):(<>
                {error && <p className="mb-2"><span className='text-red-500 font-bold text-xs italic'>{error}</span></p>}
                <div id='myFormExcutionBt' className="textAlignCenter">
                    <button
                        className={`
                            bg-gray-500 hover:bg-gray-600 text-sm text-white font-bold px-2 py-1 rounded focus:outline-none focus:shadow-outline 
                        `}
                        onClick={handleDelete}
                    >
                        delete
                    </button>
                </div>
            </>)}
        </div>
    </>);

} );
ImageUploadZone.displayName = 'ImageUploadZone';
export default ImageUploadZone;