'use client'
// src/components/notification/list/NotificationFilterForm.tsx
import SpinnerModal from "@/components/SpinnerModal";
import { NotificationReadStatus, NotificationType, NotificationSortOrder } from "@/lib/types/notification/notificationTypes";
import { dangerousCharToSpace } from "@/lib/seculity/validation";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";

const urlPath = './notification/';

const NotificationFilterForm = ({
    isRead,
    type,
    sort,
    search,
}:{
    isRead: NotificationReadStatus
    type: NotificationType
    sort: NotificationSortOrder
    search: string
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
            const currentSort = (sort !== 'desc' && sort !== 'asc') ? 'desc' : sort;
            const sortSelect: HTMLSelectElement | null = currentForm.querySelector("select[name='sort']");
            if(sortSelect) sortSelect.value = currentSort;
            
            //isRead
            const currentIsRead = isRead || 'all';
            const isReadSelect: HTMLSelectElement|null = currentForm.querySelector("select[name='isRead']");
            if(isReadSelect) isReadSelect.value = currentIsRead;
            
            //type
            const currentType = type || 'other';
            const typeSelect: HTMLSelectElement|null = currentForm.querySelector("select[name='type']");
            if(typeSelect) typeSelect.value = currentType;
        }

    }, [search, sort, isRead, type]);//この依存配列のセットがないと、「並び替え実行～リセット」した際などに、パラメーターが初期状態に戻らない。

    const handleSubmit = (e: FormEvent<HTMLFormElement> | ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        const currentForm = formRef.current;
        if(!currentForm) return;
        if(!loading) setLoading(true);

        //////////
        //■ [ 遷移先URL ]
        let pushUrl = urlPath;
        
        //sort
        const sortSelect: HTMLSelectElement|null = currentForm.querySelector("select[name='sort']");
        if(sortSelect){
            let currentSort = sortSelect.value;
            if(currentSort !== 'desc' && currentSort !== 'asc') currentSort = 'desc';
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
        
        //isRead
        const isReadSelect: HTMLSelectElement|null = currentForm.querySelector("select[name='isRead']");
        if(isReadSelect){
            let currentIsRead = isReadSelect.value;
            if(currentIsRead !== 'true' && currentIsRead !== 'false' && currentIsRead !== 'all') currentIsRead = 'all';
            if(currentIsRead !== 'all') pushUrl += `&isRead=${currentIsRead}`;
        }
        
        //type
        const typeSelect: HTMLSelectElement|null = currentForm.querySelector("select[name='type']");
        if(typeSelect){
            let currentType = typeSelect.value;
            if(
                currentType !== 'payment' && 
                currentType !== 'advertisement' && 
                currentType !== 'system' && 
                currentType !== 'other'
            ) currentType = 'other';
            if(currentType !== 'other') pushUrl += `&type=${currentType}`;
        }
        
        //遷移
        setLoading(false);
        router.push(pushUrl + '#NotificationListFormTarget');
    }

    return (<>
        {loading && <SpinnerModal/>}
        <div className="relative" id='notificationFilterForm'>
            {/* 背景グラデーション */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/80 via-blue-50/60 to-indigo-50/40 rounded-2xl"></div>
            <div className="absolute inset-0 bg-grid-purple-100/30 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] rounded-2xl"></div>
            
            <div className="relative z-10 p-6">
                <form
                    ref={formRef}
                    onSubmit={(e) => handleSubmit(e)}
                    className="w-full"
                >
                    <div className="flex flex-col lg:flex-row gap-4 items-stretch" id='NotificationListFormTarget'>
                        {/* 検索バー */}
                        <div className="flex-1 min-w-0">
                            <div className="group relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                                <div className="relative flex">
                                    <input
                                        name='search'
                                        defaultValue={search}
                                        type="text"
                                        placeholder="通知のタイトル・内容で検索..."
                                        className="relative flex-1 bg-white/90 backdrop-blur-xl border-2 border-white/60 hover:border-purple-300/80 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 rounded-l-xl px-4 py-3 text-gray-800 placeholder-gray-400 transition-all duration-300 focus:outline-none shadow-lg hover:shadow-xl"
                                    />
                                    <button 
                                        type="submit" 
                                        className="relative bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white px-6 py-3 rounded-r-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
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
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                                <select
                                    name='sort'
                                    defaultValue={sort}
                                    className="relative w-full appearance-none bg-white/90 backdrop-blur-xl border-2 border-white/60 hover:border-purple-300/80 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 rounded-xl px-6 py-4 text-gray-800 font-medium shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer focus:outline-none"
                                    onChange={handleSubmit}
                                >
                                    {[['📅 新着順','desc'],['⏰ 古い順','asc']].map((val) => (
                                        <option key={val[1]} value={val[1]} className="bg-white text-gray-800 py-2">{val[0]}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                    <svg className="w-5 h-5 text-purple-500 group-hover:text-purple-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                            
                            {/* 読み取り状況 */}
                            <div className="group relative min-w-0">
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                                <select
                                    name='isRead'
                                    className="relative w-full appearance-none bg-white/90 backdrop-blur-xl border-2 border-white/60 hover:border-indigo-300/80 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 rounded-xl px-6 py-4 text-gray-800 font-medium shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer focus:outline-none"
                                    onChange={handleSubmit}
                                    defaultValue={isRead}
                                >
                                    <option value="all" className="bg-white text-gray-800">📋 読み取り状況（全て）</option>
                                    <option value="false" className="bg-white text-gray-800">🔴 未読</option>
                                    <option value="true" className="bg-white text-gray-800">🟢 既読</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                    <svg className="w-5 h-5 text-indigo-500 group-hover:text-indigo-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                            
                            {/* タイプ */}
                            <div className="group relative min-w-0">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                                <select
                                    name='type'
                                    className="relative w-full appearance-none bg-white/90 backdrop-blur-xl border-2 border-white/60 hover:border-blue-300/80 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-xl px-6 py-4 text-gray-800 font-medium shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer focus:outline-none"
                                    onChange={handleSubmit}
                                    defaultValue={type}
                                >
                                    <option value="other" className="bg-white text-gray-800">🏷️ タイプ（全て）</option>
                                    <option value="payment" className="bg-white text-gray-800">💳 決済関連</option>
                                    <option value="advertisement" className="bg-white text-gray-800">📢 広告関連</option>
                                    <option value="system" className="bg-white text-gray-800">⚙️ システム</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                    <svg className="w-5 h-5 text-blue-500 group-hover:text-blue-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        
                        {/* リセットボタン */}
                        <div className="flex-shrink-0">
                            <button
                                type="button"
                                onClick={() => router.push(urlPath + '#NotificationListFormTarget')}
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
                    <div className="absolute top-2 left-2 w-8 h-8 bg-gradient-to-br from-purple-400/30 to-blue-500/30 rounded-full blur-md"></div>
                    <div className="absolute bottom-2 right-2 w-6 h-6 bg-gradient-to-br from-indigo-400/30 to-purple-500/30 rounded-full blur-md"></div>
                </form>
            </div>
        </div>
    </>);
};
export default NotificationFilterForm;