'use server'
import { auth } from '@clerk/nextjs/server'
import { InputType, Returntype } from './type'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { UpdateBoard } from './schema'
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
    const { title,id } = data
  
    

   
 
    let board 
    try {
        board = await db.board.update({
            where: {
                id,
                orgId
            },
            data: {
                title
            }
        })
          await createAuditLog({
            action: ACTION.UPDATE,
            entityId: board.id,
            entityTitle: board.title,
            entityType:ENTITY_TYPE.BOARD,           
        })
    } catch (error) {
        return {
            errors: 'Failed to update board'
        }
    }

    revalidatePath(`/board/${id}`)
    return {data:board}
}

export const updateBoard = createSafeAction(UpdateBoard,handler)