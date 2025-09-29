'use client'
// src/components/support/list/SupportFilterForm.tsx
import SpinnerModal from "@/components/SpinnerModal";
import { SupportListSortType, SupportListStatusType, SupportListCategoryType } from "@/lib/types/support/supportTypes";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";

const SupportFilterForm = ({
    sort,
    status,
    category,
    urlPath,
}:{
    sort: SupportListSortType
    status: SupportListStatusType
    category: SupportListCategoryType
    urlPath: string
}) => {
    const router = useRouter();
    const formRef = useRef<HTMLFormElement>(null);
    const [loading,setLoading] = useState(false);
    
    useEffect(() => {
        if(loading)setLoading(false);
        ///////////
        //◆【queryParameters】
        const currentForm = formRef.current;
        if(currentForm){
            //sort 
            const currentSort = (sort!='desc'&& sort!='asc') ? 'desc' : sort;
            const currentSelect:HTMLSelectElement|null = currentForm.querySelector("select[name='sort']");
            if(currentSelect)currentSelect.value = currentSort; 
            
            //status
            const currentStatus = status || '';
            const statusSelect:HTMLSelectElement|null = currentForm.querySelector("select[name='status']");
            if(statusSelect)statusSelect.value = currentStatus;
            
            //category
            const currentCategory = category || '';
            const categorySelect:HTMLSelectElement|null = currentForm.querySelector("select[name='category']");
            if(categorySelect)categorySelect.value = currentCategory;
        }

    },[sort, status, category]);

    const handleSubmit = (e:FormEvent<HTMLFormElement>| ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        const currentForm = formRef.current;
        if(!currentForm)return;
        if(!loading)setLoading(true)

        //////////
        //◆【遷移先URL】
        let pushUrl = urlPath;
        
        //sort
        const currentSelect:HTMLSelectElement|null = currentForm.querySelector("select[name='sort']");
        if(currentSelect){
            let currentSort = currentSelect.value;
            if(currentSort!='desc' && currentSort!='asc')currentSort = 'desc';
            pushUrl += `?sort=${currentSort}`;
        }  
        
        //status
        const statusSelect:HTMLSelectElement|null = currentForm.querySelector("select[name='status']");
        if(statusSelect){
            let currentStatus = statusSelect.value;
            if(
                currentStatus!='open' && 
                currentStatus!='in_progress' && 
                currentStatus!='closed' && 
                currentStatus!=''
            )currentStatus = '';
            if(currentStatus)pushUrl += `&status=${currentStatus}`;
        }
        
        //category
        const categorySelect:HTMLSelectElement|null = currentForm.querySelector("select[name='category']");
        if(categorySelect){
            let currentCategory = categorySelect.value;
            if(
                currentCategory!='payment' && 
                currentCategory!='advertisement' && 
                currentCategory!='technical' && 
                currentCategory!='other' && 
                currentCategory!=''
            )currentCategory = '';
            if(currentCategory)pushUrl += `&category=${currentCategory}`;
        }
        
        //遷移
        router.push(pushUrl+'#SupportListFormTarget');
    }

    return (<>
        {loading && <SpinnerModal/>}
        <div className="relative">
            {/* 背景グラデーション */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/80 via-teal-50/60 to-cyan-50/40 rounded-2xl"></div>
            <div className="absolute inset-0 bg-grid-emerald-100/30 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] rounded-2xl"></div>
            
            <div className="relative z-10 p-6">
                <form
                    id='supportFilterForm'
                    ref={formRef}
                    onSubmit={(e)=>handleSubmit(e)}
                    className="w-full"
                >
                    <div className="flex flex-col lg:flex-row gap-4 items-stretch" id='SupportListFormTarget'>
                        {/* セレクトボックス群 */}
                        <div className="flex flex-col sm:flex-row gap-4 flex-1">
                            {/* 並び替え */}
                            <div className="group relative flex-1 min-w-0">
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                                <select
                                    name='sort'
                                    defaultValue={sort}
                                    className="relative w-full appearance-none bg-white/90 backdrop-blur-xl border-2 border-white/60 hover:border-emerald-300/80 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 rounded-xl px-6 py-4 text-gray-800 font-medium shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer focus:outline-none"
                                    onChange={handleSubmit}
                                >
                                    <option value="algorithm" className="text-gray-500 bg-white">✨ 並び替え</option>
                                    {[['📅 新着順','desc'],['⏰ 古い順','asc']].map((val)=>(
                                        <option key={val[1]} value={val[1]} className="bg-white text-gray-800 py-2">{val[0]}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                    <svg className="w-5 h-5 text-emerald-500 group-hover:text-emerald-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                            
                            {/* ステータス */}
                            <div className="group relative flex-1 min-w-0">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                                <select
                                    name='status'
                                    className="relative w-full appearance-none bg-white/90 backdrop-blur-xl border-2 border-white/60 hover:border-blue-300/80 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-xl px-6 py-4 text-gray-800 font-medium shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer focus:outline-none"
                                    onChange={handleSubmit}
                                    defaultValue={status}
                                >
                                    <option value="" className="text-gray-500 bg-white">🔄 ステータス（全て）</option>
                                    <option value="open" className="bg-white text-gray-800">🔴 未対応</option>
                                    <option value="in_progress" className="bg-white text-gray-800">🟡 対応中</option>
                                    <option value="closed" className="bg-white text-gray-800">🟢 解決済み</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                    <svg className="w-5 h-5 text-blue-500 group-hover:text-blue-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                            
                            {/* カテゴリー */}
                            <div className="group relative flex-1 min-w-0">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                                <select
                                    name='category'
                                    className="relative w-full appearance-none bg-white/90 backdrop-blur-xl border-2 border-white/60 hover:border-purple-300/80 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 rounded-xl px-6 py-4 text-gray-800 font-medium shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer focus:outline-none"
                                    onChange={handleSubmit}
                                    defaultValue={category}
                                >
                                    <option value="" className="text-gray-500 bg-white">📋 カテゴリー（全て）</option>
                                    <option value="payment" className="bg-white text-gray-800">💳 決済・ポイント関連</option>
                                    <option value="advertisement" className="bg-white text-gray-800">📢 広告配信関連</option>
                                    <option value="technical" className="bg-white text-gray-800">⚙️ 技術的な問題</option>
                                    <option value="other" className="bg-white text-gray-800">❓ その他</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                    <svg className="w-5 h-5 text-purple-500 group-hover:text-purple-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        
                        {/* リセットボタン */}
                        <div className="flex-shrink-0">
                            <button
                                type="button"
                                onClick={() => router.push(urlPath+'#SupportListFormTarget')}
                                className="group relative overflow-hidden bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 px-6 py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300/50"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative flex items-center gap-2">
                                    <svg className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    <span className="hidden sm:inline">リセット</span>
                                </div>
                            </button>
                        </div>
                    </div>
                    
                    {/* 装飾要素 */}
                    <div className="absolute top-2 left-2 w-8 h-8 bg-gradient-to-br from-emerald-400/30 to-teal-500/30 rounded-full blur-md"></div>
                    <div className="absolute bottom-2 right-2 w-6 h-6 bg-gradient-to-br from-purple-400/30 to-pink-500/30 rounded-full blur-md"></div>
                </form>
            </div>
        </div>
    </>);
};
export default SupportFilterForm;