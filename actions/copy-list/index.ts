'use server'
import { auth } from '@clerk/nextjs/server'
import { InputType, Returntype } from './type'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { CopyList } from './schema'
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
  
    

   
 
    let list 
    try {
        const listToCopy = await db.list.findUnique({
            where: {
                id,
                boardId,
                board: {
                     orgId
                }
            },
            include: {
                cards:true
            }
           
        })
        if (!listToCopy) {
            return {
                errors: 'List not found'
            }
        } 
        const lastList = await db.list.findFirst({
            where: {
                boardId
            },
            orderBy: {
                order: 'desc'
            },
            select: {
                order: true
            }
        })

        const neworder = lastList? lastList.order+1 :1
        list = await db.list.create({
            data: {
                title: `${listToCopy.title}-copy`,
                boardId:listToCopy.boardId,
                order:neworder,
                cards: {
                    create: listToCopy.cards.map((card) => ({
                        title: card.title,
                        description: card.description,
                        order: card.order
                    }))
                }
            },
            include: {
                cards: true
            }
        })
          await createAuditLog({
            action: ACTION.CREATE,
            entityId: list.id,
            entityTitle: list.title,
            entityType:ENTITY_TYPE.LIST,           
        })
    } catch (error) {
        return {
            errors: 'Failed to copy list'
        }
    }

    revalidatePath(`/board/${boardId}`)
    return {data:list}
}

export const copyList = createSafeAction(CopyList,handler)