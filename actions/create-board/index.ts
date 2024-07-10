'use server'
import { auth } from '@clerk/nextjs/server'
import { InputType, Returntype } from './type'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { CreateBoard } from './schema'
import { createSafeAction } from '@/lib/create-safe-action'
import createAuditLog from '@/lib/create-audit-log'
import { ACTION, ENTITY_TYPE } from '@prisma/client'
import { hasAvailableCount, incrementAvailableCount } from '@/lib/org-limit'
import { CheckSubscription } from '@/lib/subscription'

const handler = async(data:InputType):Promise<Returntype> => {
    const { userId ,orgId } = auth()
    if (!userId || !orgId) {
        return {
            errors: 'Unauthorized'
        }
    }

    const canCreate = await hasAvailableCount()
    const isPro = await CheckSubscription()

    if (!canCreate &&!isPro) {
        return {
            errors:'you have reached your limit of free boards.Please upgrade to create more.'
        }
    }
    const { title,image } = data
    const [
        imageID,
        imageThumbUrl,
        imageFullUrl,
        imageLinkHTML,
        imageuserName,
    ] = image.split('|')

   
    if (!imageID || !imageFullUrl || !imageLinkHTML || !imageuserName || !imageThumbUrl) {
        return {
            errors: 'missing fields. failed to create board'
        }
        
    }
    let board 
    try {
        board = await db.board.create({
            data: {
                title,
                orgId,
                imageID,
                imageThumbUrl,
                imageFullUrl,
                imageuserName,
                imageLinkHTML,
                
            }
        })
        if (!isPro) {
            
            await incrementAvailableCount()
        }
        await createAuditLog({
            action: ACTION.CREATE,
            entityId: board.id,
            entityTitle: board.title,
            entityType:ENTITY_TYPE.BOARD,           
        })
    } catch (error) {
        return {
            errors: 'Failed to create board'
        }
    }

    revalidatePath(`/board/${board.id}`)
    return {data:board}
}

export const createBoard = createSafeAction(CreateBoard,handler)