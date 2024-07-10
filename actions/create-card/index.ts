'use server'
import { auth } from '@clerk/nextjs/server'
import { InputType, Returntype } from './type'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { CreateCard } from './schema'
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
    const { title,boardId,listId } = data
  
    

   
 
    let card 
    try {
        const list = await db.list.findUnique({
            where: {
                id: listId,
                board: {
                    orgId
                }
            }   
        })
        if (!list) {
            return {
                errors: 'list not found'
            }
        }

        const lastcard = await db.card.findFirst({
            where: {
                listId
            },
            orderBy: {
                order: 'desc'
            },
            select: {
                order: true
            }
        })

        const neworder = lastcard? lastcard.order+1 :1

        card = await db.card.create({
            data: {
                title,
                listId,
                order: neworder,
                description:''
            }   
        })

        await createAuditLog({
            action: ACTION.CREATE,
            entityId: card.id,
            entityTitle: card.title,
            entityType:ENTITY_TYPE.CARD,           
        })
    } catch (error) {
        return {
            errors: 'Failed to create card'
        }
    }

    revalidatePath(`/board/${boardId}`)
    return {data:card}
}

export const createCard = createSafeAction(CreateCard,handler)