'use client'
import { ChangeEvent, useState, useRef, useEffect, Dispatch, SetStateAction, memo } from 'react';
import { useRouter } from 'next/navigation';

//////////
//■[ 型,データ,関数定義 ]
type VideoDataType = {
  width:number
  height:number
  duration:number
  src:string
  size: number
}
// 許可された動画サイズのリスト
const allowedSizes = [
  {width: 1920, height: 1080},
  {width: 1280, height: 720},
  {width: 640, height: 360},
  {width: 480, height: 270}
];

const videoSize = async (file: File): Promise<
  VideoDataType | Error
> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const objectUrl = URL.createObjectURL(file);
    console.log(`createObjectURL:${objectUrl}`); //revokeの動作確認のために記述しています。動作確認以降は、削除して下さい。
        
    video.onloadedmetadata = () => {
      const width = video.videoWidth;
      const height = video.videoHeight;
      const duration = Math.round(video.duration);
                    
      // 現在の動画サイズが許可されているかチェック
      const isAllowedSize = allowedSizes.some(size => 
        size.width === width && size.height === height
      );
      
      // エラーハンドリング
      let message = '';
      if (!isAllowedSize) {
        message = '*許可されている動画サイズは 1920×1280, 1280×720, 640×360, 480×270 のみです。';
      } else if (duration < 15 || duration > 30) {
        message = "15秒以上 & 30秒以下 の動画をアップロードして下さい";
      }
      if (message) {
        URL.revokeObjectURL(objectUrl); // エラーが発生した場合オブジェクトURLを解放
        console.log(`revokeObjectURL:${objectUrl}`);
        reject(new Error(message));
      }
      
      // 処理成功
      resolve({
        width,
        height,
        duration,
        src: video.src,
        size: file.size
      });
    };
        
    video.onerror = (err) => {
      const message = err instanceof Error ? err.message : 'Something went wrong.';
      URL.revokeObjectURL(objectUrl); // エラーが発生した場合オブジェクトURLを解放
      console.log(`revokeObjectURL:${objectUrl}`); //revokeの動作確認のために記述しています。動作確認以降は、削除して下さい。
      reject(new Error(message));
    };
        
    video.preload = 'metadata';
    video.src = objectUrl;
  });
};


const MovieUploadZone = memo( ({
    selectedFile,
    setSelectedFile,
}:{
    selectedFile: File|null,
    setSelectedFile: Dispatch<SetStateAction<File | null>>
}) => {
    const router = useRouter();
    const inputMovieFile = useRef<HTMLInputElement>(null);
    const [videoData, setVideoData] = useState<VideoDataType|null>(null);
    const [error, setError] = useState('動画を選択して下さい');

    //videoDataの変更を監視し、適切にクリーンアップ
    useEffect(() => {
        return () => {
            //videoDataの変更を監視し、適切にクリーンアップ
            if(videoData && videoData.src) {
                console.log(`useEffect > revokeObjectURL:${videoData.src}`)//revokeの動作確認のために記述しています。動作確認以降は、削除して下さい。
                URL.revokeObjectURL(videoData.src);
            }
        };
    }, [videoData]);


    const handleFileChange = async (e:ChangeEvent<HTMLInputElement>) => {
        if(!e.target.files)return;
        const file = e.target.files[0];
        if (!file) return;

        const fileNAmeSplit = file.name.split('.');
        const fileType = fileNAmeSplit[fileNAmeSplit.length-1]
        if(fileType!=='mp4'){
            alert('*.mp4 のみアップロード可能です');
            setError('*.mp4 のみアップロード可能です');
            if(inputMovieFile.current)inputMovieFile.current.value="";
            return;
        }

        const maxSize = 4.5 * 1024 * 1024; // 4.5MB
        if (file.size > maxSize) {
            alert('*アップロード可能サイズは4.5MBまでです');
            setError('*アップロード可能サイズは4.5MBまでです');
            if(inputMovieFile.current)inputMovieFile.current.value="";
            return;
        }

        try{
            const result = await videoSize(file);
            if(result instanceof Error)throw new Error(result.message);
            setSelectedFile(file);
            setVideoData(result);
            setError('')
        }catch(err){
            const message = err instanceof Error ? err.message : '動画の解析に失敗しました。もう一度、あるいは、別の動画でお試し下さい。';
            if(inputMovieFile.current)inputMovieFile.current.value="";
            setError(message);
            alert(message);
        }
    };


    const handleDelete = async() => {
        if(inputMovieFile?.current)inputMovieFile.current.value="";
        setSelectedFile(null);
        setVideoData(null);
        setError('動画を選択して下さい。');
    }


    return(<>
        {/* <label className='block text-gray-700 text-md font-bold mt-6'>MP4動画<em className="text-red-500">*</em></label> */}
        <div className="mb-5 bg-gray-100 shadow-md rounded px-8 pt-1 pb-8 w-full max-w-md">
        {videoData && videoData.src && (
            <div className="p-3">
                <p>video</p>
                <video
                    src={videoData.src}
                    width={480}
                    height={270}
                    className="mx-auto rounded-lg shadow-sm"
                    controls
                />
            </div>
        )}

        {!selectedFile?(<>
            <div
                className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 text-center transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 cursor-pointer"
                onDragOver={(e) => {
                    e.preventDefault()
                    e.currentTarget.classList.add('border-purple-400', 'bg-purple-50')
                }}
                onDragLeave={(e) => {
                    e.preventDefault()
                    e.currentTarget.classList.remove('border-purple-400', 'bg-purple-50')
                }}
                onDrop={(e) => {
                    e.preventDefault()
                    e.currentTarget.classList.remove('border-purple-400', 'bg-purple-50')
                    if (e.dataTransfer.files?.[0]) {
                        const file = e.dataTransfer.files[0]
                        const event = { target: { files: [file] } } as unknown as ChangeEvent<HTMLInputElement>
                        handleFileChange(event)
                    }
                }}
                onClick={() => inputMovieFile.current?.click()}
            >
                <div className="mb-4">
                    <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <p className="text-sm font-medium text-gray-700 mb-1">動画をドラッグ&ドロップ</p>
                    <p className="text-xs text-gray-500 mb-3">または クリックして選択</p>
                    <ul className='text-xs text-gray-600 space-y-1 text-left max-w-xs mx-auto'>
                        <li className="flex items-start gap-2">
                            <span className="w-1 h-1 bg-purple-400 rounded-full mt-1.5 flex-shrink-0"></span>
                            <span>形式: MP4のみ</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-1 h-1 bg-purple-400 rounded-full mt-1.5 flex-shrink-0"></span>
                            <span>時間: 15秒〜30秒</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-1 h-1 bg-purple-400 rounded-full mt-1.5 flex-shrink-0"></span>
                            <span>解像度: 1920×1080, 1280×720他</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-1 h-1 bg-purple-400 rounded-full mt-1.5 flex-shrink-0"></span>
                            <span>容量: 最大4.5MB</span>
                        </li>
                    </ul>
                    <input
                        ref={inputMovieFile}
                        type="file"
                        accept=".mp4"
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
});
MovieUploadZone.displayName = 'MovieUploadZone';
export default MovieUploadZone;
