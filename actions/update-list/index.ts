'use server'
import { auth } from '@clerk/nextjs/server'
import { InputType, Returntype } from './type'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { UpdateList } from './schema'
import { createSafeAction } from '@/lib/create-safe-action'
import createAuditLog from '@/lib/create-audit-log'
import { ACTION, ENTITY_TYPE } from '@prisma/client'

const handler = async(data:InputType):Promise<Returntype> => {
    const { userId ,orgId } = auth()
    if (!userId || !orgId) {
        return {
            errors: 'Unauthorized'
        }
    }
    const { title,id,boardId } = data
  
    

   
 
    let list 
    try {
        list = await db.list.update({
            where: {
                id,
                boardId,
                board: {
                    orgId
                }
            },
            data: {
                title
            }
        })
            await createAuditLog({
            action: ACTION.UPDATE,
            entityId: list.id,
            entityTitle: list.title,
            entityType:ENTITY_TYPE.LIST,           
        })
    } catch (error) {
        return {
            errors: 'Failed to update board'
        }
    }

    revalidatePath(`/board/${boardId}`)
    return {data:list}
}

export const updateList = createSafeAction(UpdateList,handler)