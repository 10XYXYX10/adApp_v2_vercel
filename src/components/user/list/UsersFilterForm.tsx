'use client'
// src/components/user/list/UsersFilterForm.tsx
import SpinnerModal from "@/components/SpinnerModal";
import { UserListSortType, UserListStatusType, UserListBusinessType } from "@/lib/types/user/userTypes";
import { dangerousCharToSpace } from "@/lib/seculity/validation";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";

const UsersFilterForm = ({
    search,
    sort,
    status,
    businessType,
    urlPath,
}:{
    search: string
    sort: UserListSortType
    status: UserListStatusType
    businessType: UserListBusinessType
    urlPath: string
}) => {
    const router = useRouter();
    const formRef = useRef<HTMLFormElement>(null);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        if(loading) setLoading(false);
        
        //////////
        //■ [ queryParameters ]
        const currentForm = formRef.current;
        if(currentForm){
            //search
            let currentSearch = search ?? "";
            if(currentSearch){
                currentSearch = dangerousCharToSpace(currentSearch);
                currentSearch = currentSearch.replace(/\%20/g, ' ').replace(/ +/g, ' ');
                currentSearch = currentSearch.trim();
            }
            const currentInputSearch: HTMLInputElement | null = currentForm.querySelector("input[name='search']");
            if(currentInputSearch) currentInputSearch.value = currentSearch;
            
            //sort 
            const currentSort = (sort != 'desc' && sort != 'asc') ? 'desc' : sort;
            const currentSelect: HTMLSelectElement | null = currentForm.querySelector("select[name='sort']");
            if(currentSelect) currentSelect.value = currentSort;
            
            //status
            const currentStatus = status || '';
            const statusSelect: HTMLSelectElement | null = currentForm.querySelector("select[name='status']");
            if(statusSelect) statusSelect.value = currentStatus;
            
            //businessType
            const currentBusinessType = businessType || '';
            const businessTypeSelect: HTMLSelectElement | null = currentForm.querySelector("select[name='businessType']");
            if(businessTypeSelect) businessTypeSelect.value = currentBusinessType;
        }

    }, [search, sort, status, businessType]);

    const handleSubmit = (e: FormEvent<HTMLFormElement> | ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        const currentForm = formRef.current;
        if(!currentForm) return;
        if(!loading) setLoading(true)

        //////////
        //■ [ 遷移先URL ]
        let pushUrl = urlPath;
        
        //sort
        const currentSelect: HTMLSelectElement | null = currentForm.querySelector("select[name='sort']");
        if(currentSelect){
            let currentSort = currentSelect.value;
            if(currentSort != 'desc' && currentSort != 'asc') currentSort = 'desc';
            pushUrl += `?sort=${currentSort}`;
        }  
        
        //search
        const currentInputSearch: HTMLInputElement | null = currentForm.querySelector("input[name='search']");
        if(currentInputSearch){
            let currentSearch = currentInputSearch.value;
            currentSearch = dangerousCharToSpace(currentSearch);
            currentSearch = currentSearch.replace(/\%20/g, ' ').replace(/ +/g, ' ');
            currentSearch = currentSearch.trim();
            if(currentSearch) pushUrl += `&search=${currentSearch}`;
        }
        
        //status
        const statusSelect: HTMLSelectElement | null = currentForm.querySelector("select[name='status']");
        if(statusSelect){
            let currentStatus = statusSelect.value;
            if(currentStatus != 'active' && currentStatus != 'inactive' && currentStatus != '') currentStatus = '';
            if(currentStatus) pushUrl += `&status=${currentStatus}`;
        }
        
        //businessType
        const businessTypeSelect: HTMLSelectElement | null = currentForm.querySelector("select[name='businessType']");
        if(businessTypeSelect){
            let currentBusinessType = businessTypeSelect.value;
            if(currentBusinessType != 'individual' && currentBusinessType != 'corporate' && currentBusinessType != '') currentBusinessType = '';
            if(currentBusinessType) pushUrl += `&businessType=${currentBusinessType}`;
        }
        
        //遷移
        router.push(pushUrl + '#UsersFilterFormTarget');
    }

    return (<>
        {loading && <SpinnerModal/>}
        <div className="relative">
            {/* 背景グラデーション */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-indigo-50/60 to-cyan-50/40 rounded-2xl"></div>
            <div className="absolute inset-0 bg-grid-blue-100/30 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] rounded-2xl"></div>
            
            <div className="relative z-10 p-6">
                <form
                    id='usersFilterForm'
                    ref={formRef}
                    onSubmit={(e)=>handleSubmit(e)}
                    className="w-full"
                >
                    <div className="flex flex-col lg:flex-row gap-4 items-stretch" id='UsersFilterFormTarget'>
                        {/* 検索バー */}
                        <div className="flex-1 min-w-0">
                            <div className="group relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                                <div className="relative flex">
                                    <input
                                        name='search'
                                        defaultValue={search}
                                        type="text"
                                        placeholder="ユーザー名・メール・会社名で検索..."
                                        className="relative flex-1 bg-white/90 backdrop-blur-xl border-2 border-white/60 hover:border-blue-300/80 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-l-xl px-4 py-3 text-gray-800 placeholder-gray-400 transition-all duration-300 focus:outline-none shadow-lg hover:shadow-xl"
                                    />
                                    <button 
                                        type="submit" 
                                        className="relative bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-r-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        {/* セレクトボックス群 */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* 並び替え */}
                            <div className="group relative min-w-0">
                                <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-teal-400/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                                <select
                                    name='sort'
                                    defaultValue={sort}
                                    className="relative w-full appearance-none bg-white/90 backdrop-blur-xl border-2 border-white/60 hover:border-green-300/80 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 rounded-xl px-4 py-3 text-gray-800 font-medium shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer focus:outline-none min-w-[140px]"
                                    onChange={handleSubmit}
                                >
                                    <option value="algorithm" className="text-gray-500 bg-white">✨ 並び替え</option>
                                    <option value="desc" className="bg-white text-gray-800">📅 新着順</option>
                                    <option value="asc" className="bg-white text-gray-800">⏰ 古い順</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <svg className="w-4 h-4 text-green-500 group-hover:text-green-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                            
                            {/* アカウント状態 */}
                            <div className="group relative min-w-0">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                                <select
                                    name='status'
                                    className="relative w-full appearance-none bg-white/90 backdrop-blur-xl border-2 border-white/60 hover:border-purple-300/80 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 rounded-xl px-4 py-3 text-gray-800 font-medium shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer focus:outline-none min-w-[140px]"
                                    onChange={handleSubmit}
                                    defaultValue={status}
                                >
                                    <option value="" className="text-gray-500 bg-white">📊 状態（全て）</option>
                                    <option value="active" className="bg-white text-gray-800">🟢 アクティブ</option>
                                    <option value="inactive" className="bg-white text-gray-800">🔴 無効</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <svg className="w-4 h-4 text-purple-500 group-hover:text-purple-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                            
                            {/* 事業者種別 */}
                            <div className="group relative min-w-0">
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                                <select
                                    name='businessType'
                                    className="relative w-full appearance-none bg-white/90 backdrop-blur-xl border-2 border-white/60 hover:border-orange-300/80 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 rounded-xl px-4 py-3 text-gray-800 font-medium shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer focus:outline-none min-w-[140px]"
                                    onChange={handleSubmit}
                                    defaultValue={businessType}
                                >
                                    <option value="" className="text-gray-500 bg-white">🏢 種別（全て）</option>
                                    <option value="individual" className="bg-white text-gray-800">👤 個人事業主</option>
                                    <option value="corporate" className="bg-white text-gray-800">🏢 法人</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <svg className="w-4 h-4 text-orange-500 group-hover:text-orange-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        
                        {/* リセットボタン */}
                        <div className="flex-shrink-0">
                            <button
                                type="button"
                                onClick={() => router.push(urlPath + '#UsersFilterFormTarget')}
                                className="group relative overflow-hidden bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 px-4 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300/50"
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
                    <div className="absolute top-2 left-2 w-8 h-8 bg-gradient-to-br from-blue-400/30 to-indigo-500/30 rounded-full blur-md"></div>
                    <div className="absolute bottom-2 right-2 w-6 h-6 bg-gradient-to-br from-purple-400/30 to-pink-500/30 rounded-full blur-md"></div>
                </form>
            </div>
        </div>
    </>);
};
export default UsersFilterForm;