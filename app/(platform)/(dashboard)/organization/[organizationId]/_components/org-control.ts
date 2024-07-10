'use client'
import { use, useEffect } from "react"
import { useParams } from "next/navigation"
import { useOrganizationList } from "@clerk/nextjs"



export const Orgcontrol = () => {
    const params = useParams()
    const { setActive } = useOrganizationList()
    useEffect(() => {
        if (!setActive) return
        
            setActive({organization: params.organizationId as string})
    }, [params?.organizationId, setActive])
  
  return null
}

