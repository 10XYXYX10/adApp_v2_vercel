// src/components/header/HeaderSC.tsx
import { loginCheck } from '@/actions/auth/authActions';
import HeaderCC from './HeaderCC';
import { getUnreadNotificationCount } from '@/dal/notification/notificationFunctions';
import { AuthUser } from '@/lib/types/auth/authTypes';

const HeaderSC = async () => {
    const {authUser} = await loginCheck()
    const user:AuthUser = authUser ? authUser : {id:0, name:'', userType:'advertiser', amount:0};

    let unreadNotificationCount = 0;
    if(user.id){
        const {count} = await getUnreadNotificationCount({userId:user.id});//別にこの処理がエラーでも致命的なものではない。throw Errorはしない。countのみの取得で。
        if(count)unreadNotificationCount = count;
    }

    return <HeaderCC user={user} unreadNotificationCount={unreadNotificationCount}/>;
};
export default HeaderSC;