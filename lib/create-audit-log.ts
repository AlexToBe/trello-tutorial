import { auth, currentUser } from '@clerk/nextjs/server'
import { ACTION, ENTITY_TYPE } from '@prisma/client'
import { db } from '@/lib/db'  

interface Props{
    entityId:string
    entityType:ENTITY_TYPE
    entityTitle: string
    action:ACTION
}

export default async function createAuditLog({entityId,entityType,entityTitle,action}:Props){

    try {
        const {orgId} = auth()
    
        const user = await currentUser()
    
        if (!user||!orgId) {
            throw new Error('user not found')
        }
        let nameStr = user?.firstName +' '+user?.lastName
        if (!user?.firstName ) {
         nameStr =  user?.username||'' 
            
        }
        const log = await db.auditLog.create({
            data:{
                entityId,
                entityType,
                entityTitle,    
                action,
                userId: user.id,
                userImage: user?.imageUrl,
                userName:nameStr,
                orgid:orgId,
            }
        })
    
        return log
    } catch (error) {
        console.log('[AUDIT_LOG_ERRRO]',error)
    }
}