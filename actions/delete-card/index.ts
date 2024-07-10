'use server'
import { auth } from '@clerk/nextjs/server'
import { InputType, Returntype } from './type'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { DeleteCard } from './schema'
import { createSafeAction } from '@/lib/create-safe-action'
import { redirect } from 'next/navigation'
import createAuditLog from '@/lib/create-audit-log'
import { ACTION, ENTITY_TYPE } from '@prisma/client'

const handler = async(data:InputType):Promise<Returntype> => {
    const { userId ,orgId } = auth()
    if (!userId || !orgId) {
        return {
            errors: 'Unauthorized'
        }
    }
    const { id,boardId } = data
  
    

   
 
    let Card 
    try {
        
        Card = await db.card.delete({
            where: {
                id,
                list: {
                    board: {
                        orgId
                    }
                }
            }
          
        })

        await createAuditLog({
            action: ACTION.DELETE,
            entityId: Card.id,
            entityTitle: Card.title,
            entityType:ENTITY_TYPE.CARD,           
        })
    } catch (error) {
        return {
            errors: 'Failed to delete card'
        }
    }

    revalidatePath(`/board/${boardId}`)
    return {data:Card}
}

export const deleteCard= createSafeAction(DeleteCard,handler)