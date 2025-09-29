// src/components/user/list/UsersDataLoader.tsx
import UserList from "./UserList";
import { UserListSortType, UserListStatusType, UserListBusinessType } from "@/lib/types/user/userTypes";
import { getUsers } from "@/dal/user/userFunctions";

const UsersDataLoader = async({
    search,
    sort,
    status,
    businessType,
    page,
    path,
}:{
    search: string
    sort: UserListSortType
    status: UserListStatusType
    businessType: UserListBusinessType
    page: number
    path: string
}) => {
    //////////
    //■ [ データ取得 ]
    const parameter = {search, sort, status, businessType, page};
    const {result, message, data} = await getUsers(parameter);
    if(!result || !data) throw new Error(message);

    return (
        <UserList
            users={data}
            search={search}
            sort={sort}
            status={status}
            businessType={businessType}
            page={page}
            path={path}
        />
    )
}
export default UsersDataLoader;