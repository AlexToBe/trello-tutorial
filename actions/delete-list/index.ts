'use server'
import { auth } from '@clerk/nextjs/server'
import { InputType, Returntype } from './type'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { DeleteList } from './schema'
import { createSafeAction } from '@/lib/create-safe-action'
import { redirect } from 'next/navigation'
import { ACTION, ENTITY_TYPE } from '@prisma/client'
import createAuditLog from '@/lib/create-audit-log'

const handler = async(data:InputType):Promise<Returntype> => {
    const { userId ,orgId } = auth()
    if (!userId || !orgId) {
        return {
            errors: 'Unauthorized'
        }
    }
    const { id,boardId } = data
  
    

   
 
    let list 
    try {
        list = await db.list.delete({
            where: {
                id,
                boardId,
                board: {
                     orgId
                }
            }
           
        })

        await createAuditLog({
            action: ACTION.DELETE,
            entityId: list.id,
            entityTitle: list.title,
            entityType:ENTITY_TYPE.LIST,           
        })
    } catch (error) {
        return {
            errors: 'Failed to delete list'
        }
    }

    revalidatePath(`/board/${boardId}`)
    return {data:list}
}

export const deleteList = createSafeAction(DeleteList,handler)