'use client'

import { useRouter } from "next/router"
import { useState,useEffect } from "react"
import { isAuthenticated } from "@/utils/auth"
export const AuthGuard = ({children} : {children:React.ReactNode}) => {
    const router = useRouter()
    const [isVerified,setisVerified] = useState(false)

    useEffect(()=>{
        if(!isAuthenticated()){
            router.push('/login')
        }else{
            setisVerified(true)
        }
    },[router])

    if(!isVerified)
        return null


    return<>{children}</>
}