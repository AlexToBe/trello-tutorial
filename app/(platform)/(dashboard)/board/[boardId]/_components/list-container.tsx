'use client'

import { ListWithCards } from '@/types'
import { ListForm } from './list-form'
import { useEffect, useState } from 'react'
import { ListItem } from './list-item'
import {DragDropContext,Droppable} from '@hello-pangea/dnd'
import { useAction } from "@/hooks/use-action"
import { toast } from "sonner"
import { updateListOrder } from '@/actions/update-list-order'
import { updateCardOrder } from '@/actions/update-card-order'

interface ListContainerProps {
    data: ListWithCards[]
    boardId: string,
}

function reorder<T>(list:T[],startIndex:number,endIndex:number) {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    return result
}

export const ListContainer = ({data,boardId}:ListContainerProps) => {
    const [orderedData, setOrderedData] = useState(data)
     
     const { execute:executeUpdateListOrder } = useAction(updateListOrder, {
         onSuccess: () => {
            toast.error('List reordered')
             
       },
        OnError: (error) => {
            toast.error(error)

        }
    })

       const { execute:executeUpdateCardOrder } = useAction(updateCardOrder, {
         onSuccess: () => {
            toast.error('Card reordered')
             
       },
        OnError: (error) => {
            toast.error(error)

        }
    })
    
    
    
    useEffect(() => {
        setOrderedData(data)
    }, [data])
    
const onDragEnd = (result:any) => {
    const { destination, source, type } = result


    
    if (!destination) {
        return
    }
    if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
    ) {
        return
    }
    if (type === 'list') {
        const items = reorder(
            orderedData,
            source.index,
            destination.index
        ).map ((item,index)=>({...item,order:index}))
        setOrderedData(items)
        executeUpdateListOrder({items,boardId})
    }
    
    if (type ==='card') {
        let newOrderedData =[...orderedData]
        const sourceList = newOrderedData.find(list=>list.id === source.droppableId)
        const destinationList = newOrderedData.find(list=>list.id === destination.droppableId)
        if (!sourceList ||!destinationList) {
            return
        }
        if (!sourceList.cards) {
            sourceList.cards = []
          }
        
        if (!destinationList.cards) {
            destinationList.cards = []
        }

        if (source.droppableId === destination.droppableId) {
            const recordedCards = reorder(
                sourceList.cards,
                source.index,
                destination.index
            )

            recordedCards.forEach((card, index) => {
                card.order = index
            })

            sourceList.cards = recordedCards
            setOrderedData(newOrderedData)
            executeUpdateCardOrder({boardId:boardId,items:recordedCards})
        }
        else {
            const [movedCard] = sourceList.cards.splice(source.index, 1)
            movedCard.listId = destination.droppableId
           
            destinationList.cards.splice(destination.index, 0, movedCard)
            sourceList.cards.forEach((card, index) => {
                card.order = index
            })

             destinationList.cards.forEach((card, index) => {
                card.order = index
            })
            
            setOrderedData(newOrderedData)
            executeUpdateCardOrder({boardId:boardId,items:destinationList.cards})

        }
                
    }
    
} 

    return (
        <DragDropContext onDragEnd={onDragEnd} >
            <Droppable droppableId='lists' type='list' direction='horizontal' >
                {(provided) => (
                    <ol
                        {...provided.droppableProps}
                        ref = {provided.innerRef}
                        className=' flex gap-x-3 h-full'>
                        {orderedData.map((list,index) => (
                            <ListItem
                            key={list.id}
                            index={index}
                            data={list} />
                        ))}
                        {provided.placeholder}
                        <ListForm/>
                        <div className=' flex-shrink-0 w-1'/>
                    </ol>
                )}
            </Droppable>
        </DragDropContext>
    )
}
