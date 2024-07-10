'use server'
import { auth } from '@clerk/nextjs/server'
import { InputType, Returntype } from './type'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { UpdateCard } from './schema'
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
    const { boardId,id,...values } = data
  
    

   
 
    let card 
    try {
        card = await db.card.update({
            where: {
                id,
                list: {
                    board: {
                        orgId
                    }
                }
            },
            data: {
                ...values
            }
        })
            await createAuditLog({
            action: ACTION.UPDATE,
            entityId: card.id,
            entityTitle: card.title,
            entityType:ENTITY_TYPE.CARD,           
        })
    } catch (error) {
        return {
            errors: 'Failed to update card'
        }
    }

    revalidatePath(`/board/${boardId}`)
    return {data:card}
}

export const updateCard = createSafeAction(UpdateCard,handler)