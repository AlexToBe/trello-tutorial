'use server'
import { auth } from '@clerk/nextjs/server'
import { InputType, Returntype } from './type'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { DeleteBoard } from './schema'
import { createSafeAction } from '@/lib/create-safe-action'
import { redirect } from 'next/navigation'
import { ACTION, ENTITY_TYPE } from '@prisma/client'
import createAuditLog from '@/lib/create-audit-log'
import { decreaseAvailableCount } from '@/lib/org-limit'
import { CheckSubscription } from '@/lib/subscription'

const handler = async(data:InputType):Promise<Returntype> => {
    const { userId ,orgId } = auth()
    if (!userId || !orgId) {
        return {
            errors: 'Unauthorized'
        }
    }
    const { id } = data
  
    

   const isPro = await CheckSubscription()
 
    let board 
    try {
        board = await db.board.delete({
            where: {
                id,
                orgId
            }
           
        })
        if (!isPro) {
            
            await decreaseAvailableCount()
        }
           await createAuditLog({
            action: ACTION.DELETE,
            entityId: board.id,
            entityTitle: board.title,
            entityType:ENTITY_TYPE.BOARD,           
           })
        
    } catch (error) {
        return {
            errors: 'Failed to delete board'
        }
    }

    revalidatePath(`/organization/${orgId}`)
    redirect(`/organization/${orgId}`)
}

export const deleteBoard = createSafeAction(DeleteBoard,handler)