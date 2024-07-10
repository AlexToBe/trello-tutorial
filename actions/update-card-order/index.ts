'use server'
import { auth } from '@clerk/nextjs/server'
import { InputType, Returntype } from './type'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { UpdateCardOrder } from './schema'
import { createSafeAction } from '@/lib/create-safe-action'

const handler = async(data:InputType):Promise<Returntype> => {
    const { userId ,orgId } = auth()
    if (!userId || !orgId) {
        return {
            errors: 'Unauthorized'
        }
    }
    const { items,boardId} = data
  
    

   
 
    let updatedCards 
    try {
        const transaction = items.map((card) =>
        db.card.update({
            where: {
                id: card.id,
                list: {
                    board:{
                        orgId
                    }
                }
            },
            data: {
                order: card.order,
                listId:card.listId
            }
        })
        )
        updatedCards = await db.$transaction(transaction)
        
    } catch (error) {
        return {
            errors: 'Failed to reorder'
        }
    }

    revalidatePath(`/board/${boardId}`)
    return {data:updatedCards}
}

export const updateCardOrder = createSafeAction(UpdateCardOrder,handler)