'use server'
import { auth } from '@clerk/nextjs/server'
import { InputType, Returntype } from './type'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { CopyCard } from './schema'
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
        const CardToCopy = await db.card.findUnique({
            where: {
                id,
                list: {
                    board: {
                         orgId
                     }
                }
            }
           
        })
        if (!CardToCopy) {
            return {
                errors: 'card not found'
            }
        } 
        const lastCard = await db.card.findFirst({
            where: {
                listId:CardToCopy.listId
            },
            orderBy: {
                order: 'desc'
            },
            select: {
                order: true
            }
        })

        const neworder = lastCard? lastCard.order+1 :1
        Card = await db.card.create({
            data: {
                title: `${CardToCopy.title}-copy`,
                description:CardToCopy.description,
                order:neworder,
                listId:CardToCopy.listId,
               
            },
          
        })
          await createAuditLog({
            action: ACTION.CREATE,
            entityId: Card.id,
            entityTitle: Card.title,
            entityType:ENTITY_TYPE.CARD,           
        })
    } catch (error) {
        return {
            errors: 'Failed to copy list'
        }
    }

    revalidatePath(`/board/${boardId}`)
    return {data:Card}
}

export const copyCard= createSafeAction(CopyCard,handler)