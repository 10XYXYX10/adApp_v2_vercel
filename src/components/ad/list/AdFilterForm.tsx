'use client'
// src/components/ad/list/AdFilterForm.tsx
import { dangerousCharToSpace } from "@/lib/seculity/validation";
import { AdListAdType, AdListSortType, AdListStatusType } from "@/lib/types/ad/adTypes";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";

const AdFilterForm = ({
    search,
    sort,
    adType,
    status,
    urlPath,
}:{
    search:string
    sort:AdListSortType
    adType?:AdListAdType
    status?:AdListStatusType
    urlPath:string
}) => {
    const router = useRouter();
    const formRef = useRef<HTMLFormElement>(null);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        ///////////
        //◆「queryParameters」
        const currentForm = formRef.current;
        if(currentForm){
            //search
            let currentSearch = search ?? "";
            if(currentSearch){
                currentSearch = dangerousCharToSpace(currentSearch);
                currentSearch = currentSearch.replace(/\%20/g, ' ').replace(/ +/g, ' ');
                currentSearch = currentSearch.trim();
            }
            const currentInputSearch:HTMLInputElement|null = currentForm.querySelector("input[name='search']");
            if(currentInputSearch)currentInputSearch.value = currentSearch;  
            //sort 
            const currentSort = (sort!='desc'&& sort!='asc') ? 'desc' : sort;
            const currentSelect:HTMLSelectElement|null = currentForm.querySelector("select[name='sort']");
            if(currentSelect)currentSelect.value = currentSort; 
            //adType
            if(adType!=undefined){
                const currentAdType = (
                    adType!='priority' && 
                    adType!='overlay' && 
                    adType!='preroll' && 
                    adType!='youtube-short' && 
                    adType!='youtube-long'
                ) ? '' : adType;
                const adTypeSelect:HTMLSelectElement|null = currentForm.querySelector("select[name='adType']");
                if(adTypeSelect)adTypeSelect.value = currentAdType;
            }
            //status
            if(status!=undefined){
                const currentStatus = (
                    status!='draft' && 
                    status!='pending' && 
                    status!='approved' && 
                    status!='rejected' && 
                    status!='active' && 
                    status!='paused'
                ) ? '' : status;
                const statusSelect:HTMLSelectElement|null = currentForm.querySelector("select[name='status']");
                if(statusSelect)statusSelect.value = currentStatus;
            }
        }

    },[search,sort,adType,status]);//この依存配列のセットがないと、「検索＆並び替え実行～トップページのリンクをクリック」した際などに、検索文字等が初期状態に戻らない。


    const handleSubmit = (e:FormEvent<HTMLFormElement>| ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        const currentForm = formRef.current;
        if(!currentForm)return;
        if(!loading) setLoading(true);
        //////////
        //◆「遷移先URL」
        let pushUrl = urlPath;
        //sort
        const currentSelect:HTMLSelectElement|null = currentForm.querySelector("select[name='sort']");
        if(currentSelect){
            let currentSort = currentSelect.value;
            if(currentSort!='desc' && currentSort!='asc')currentSort = 'desc';
            pushUrl += `?sort=${currentSort}`;
        }  
        //search
        const currentInputSearch:HTMLInputElement|null = currentForm.querySelector("input[name='search']");
        if(currentInputSearch){
            let currentSearch = currentInputSearch.value;
            currentSearch = dangerousCharToSpace(currentSearch);
            currentSearch = currentSearch.replace(/\%20/g, ' ').replace(/ +/g, ' ');
            currentSearch = currentSearch.trim();
            if(currentSearch)pushUrl += `&search=${currentSearch}`;
        }
        //adType
        if(adType!=undefined){
            const adTypeSelect:HTMLSelectElement|null = currentForm.querySelector("select[name='adType']");
            if(adTypeSelect){
                let currentAdType = adTypeSelect.value;//'priority'|'overlay'|'preroll'|'youtube-short'|'youtube-long'|'';
                if(
                    currentAdType!='priority' && 
                    currentAdType!='overlay' && 
                    currentAdType!='preroll' && 
                    currentAdType!='youtube-short' && 
                    currentAdType!='youtube-long' && 
                    currentAdType!=''
                )currentAdType = '';
                if(currentAdType)pushUrl += `&adType=${currentAdType}`;
            }  
        }
        //status
        if(status!=undefined){
            const statusSelect:HTMLSelectElement|null = currentForm.querySelector("select[name='status']");
            if(statusSelect){
                let currentStatus = statusSelect.value;//'draft'|'pending'|'approved'|'rejected'|'active'|'paused'|'';
                if(
                    currentStatus!='draft' && 
                    currentStatus!='pending' && 
                    currentStatus!='approved' && 
                    currentStatus!='rejected' && 
                    currentStatus!='active' && 
                    currentStatus!='paused' && 
                    currentStatus!=''
                )currentStatus = '';
                if(currentStatus)pushUrl += `&status=${currentStatus}`;
            }  
        }
        //遷移
        router.push(pushUrl+'#adFilterForm');
    }

    return (<>
        <div className="p-3 bg-slate-50 rounded-md" id='adFilterForm'>
            <form
                ref={formRef}
                onSubmit={(e)=>handleSubmit(e)}
                className="w-full"
            >
                <div className="flex flex-col md:flex-row space-x-2">
                    {/* 検索部分 */}
                    <div className="flex-1">
                        <div className="flex">
                            <input
                                name='search'
                                defaultValue={search}
                                type="text"
                                className="flex-1 border rounded-l-md p-2 w-[280px]"
                            />
                            <input 
                                type="submit" 
                                value="🔍" 
                                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-r-md"
                            />
                        </div>
                    </div>
    
                    {/* セレクトボックス群 */}
                    <div id='selectparts' className="mt-1 sm:mt-0 flex flex-wrap space-x-2">
                        <select
                            name='sort'
                            defaultValue={sort}
                            className="border rounded-md p-1"
                            onChange={handleSubmit}
                        >
                            <option value="algorithm" className="text-gray-500">-並び替え-</option>
                            {[['新着順','desc'],['古い順','asc']].map((val)=>(
                                <option key={val[1]} value={val[1]}>{val[0]}</option>
                            ))}
                        </select>  
                        {adType!=undefined&&(
                            <select
                                name='adType'
                                className="border rounded-md pl-1"
                                onChange={handleSubmit}
                                defaultValue={adType}
                            >
                                <option value="" className="text-gray-500">adType(all)</option>
                                <option value="priority">priority</option>
                                <option value="overlay">overlay</option>
                                <option value="preroll">preroll</option>
                                <option value="youtube-short">youtube-short</option>
                                <option value="youtube-long">youtube-long</option>
                            </select>
                        )}
                        {status!=undefined&&(
                            <select
                                name='status'
                                className="border rounded-md pl-1"
                                onChange={handleSubmit}
                                defaultValue={status}
                            >
                                <option value="" className="text-gray-500">status(all)</option>
                                <option value="draft">draft</option>
                                <option value="pending">pending</option>
                                <option value="approved">approved</option>
                                <option value="rejected">rejected</option>
                                <option value="active">active</option>
                                <option value="paused">paused</option>
                            </select>
                        )}
                    </div>
                </div>
            </form>
        </div>
    </>);
};
export default AdFilterForm;