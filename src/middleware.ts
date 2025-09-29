// src/middleware.ts

import { NextRequest, NextResponse } from 'next/server';
import { security } from './lib/seculity/seculity';
import { AuthUser } from './lib/types/auth/authTypes';

export const middleware = async(request: NextRequest) => {
  const responseNext = NextResponse.next();

  const pathName = request.nextUrl.pathname;
  const userType = pathName.split('/')[1];//admin or advertiser
  const userId = Number(pathName.split('/')[2]);//「/advertiser/<認証済みadvertiserId>」or「/admin/<認証済みadminId>」

  const jwtEncodedStr = request.cookies.get('accessToken')?.value;
  let result = false;
  let data:AuthUser|null = null;
  if(jwtEncodedStr){
    const seculityResult = await security({jwtEncodedStr,readOnly:true});
    result = seculityResult.result;
    data = seculityResult.data;
  }
  if(!result || userId!=data?.id || userType!=data.userType){
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = `/auth/${userType}`;
    const response = NextResponse.redirect(redirectUrl)
    if(request.cookies.has('accessToken')){//accessTokenがfalsy値であっても確実に削除されるように、「jwtEncodedStr」ではなく「request.cookies.has('accessToken')」で判定
      response.cookies.delete('accessToken')//middlewareを経由してredirectする場合、responseからcookieを削除しないと、削除に失敗する。
    }
    return response;
  }

  return responseNext;
};

export const config = {
  matcher: ['/advertiser/:path*','/admin/:path*'],
};