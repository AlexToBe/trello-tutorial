'use server'
import { auth } from '@clerk/nextjs/server'
import { InputType, Returntype } from './type'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { UpdateListOrder } from './schema'
import { createSafeAction } from '@/lib/create-safe-action'

const handler = async(data:InputType):Promise<Returntype> => {
    const { userId ,orgId } = auth()
    if (!userId || !orgId) {
        return {
            errors: 'Unauthorized'
        }
    }
    const { items,boardId } = data
  
    

   
 
    let lists 
    try {
        const transaction = items.map((list) =>
        db.list.update({
            where: {
                id: list.id,
                board:{orgId}
            },
            data: {
                order: list.order
            }
        })
        )
        lists = await db.$transaction(transaction)
    } catch (error) {
        return {
            errors: 'Failed to reorder'
        }
    }

    revalidatePath(`/board/${boardId}`)
    return {data:lists}
}

export const updateListOrder = createSafeAction(UpdateListOrder,handler)