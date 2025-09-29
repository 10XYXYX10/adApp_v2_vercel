// src/lob/functions/apiFunctions.ts
import { NextRequest } from "next/server"

//## MOVIEAPP_API_KEYの扱いについて:
//  - クライアントサイドに露出しないようにする必要がある 
const expectedApiKey = process.env.MOVIEAPP_API_KEY as string

//////////
//■[ API Key認証 ]
export const validateApiKey = (request: NextRequest): boolean => {
    const apiKey = request.headers.get('x-api-key')
    
    if (!expectedApiKey) {
        console.error('MOVIEAPP_API_KEY is not set in environment variables')
        return false
    }
    return apiKey === expectedApiKey
}