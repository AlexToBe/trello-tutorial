'use server'
import { auth } from '@clerk/nextjs/server'
import { InputType, Returntype } from './type'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { CreateList } from './schema'
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
    const { title,boardId } = data
  
    

   
 
    let list 
    try {
        const board = await db.board.findUnique({
            where: {
                id: boardId
            }   
        })
        if (!board) {
            return {
                errors: 'Board not found'
            }
        }

        const lastList = await db.list.findFirst({
            where: {
                boardId: board.id
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
                title,
                boardId,
                order:neworder
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
            errors: 'Failed to create list'
        }
    }

    revalidatePath(`/board/${boardId}`)
    return {data:list}
}

export const createList = createSafeAction(CreateList,handler)