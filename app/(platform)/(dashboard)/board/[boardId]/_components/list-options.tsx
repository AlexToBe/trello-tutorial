'use client'

import { List } from "@prisma/client"
import {
    Popover,
    PopoverClose,
    PopoverContent,
    PopoverTrigger
} from '@/components/ui/popover'
import { Button } from "@/components/ui/button"
import { MoreHorizontal, X } from "lucide-react"
import { FormSubmit } from "@/components/form/form-submit"
import { Separator } from "@/components/ui/separator"
import { useAction } from "@/hooks/use-action"
import { deleteList } from "@/actions/delete-list"
import { toast } from "sonner"
import { ElementRef, useRef } from "react"
import { copyList } from "@/actions/copy-list"


interface ListOPtionsProps{
    data: List,
    onAddCard?:()=>void
}
export const ListOPtions = (
   { data,
    onAddCard}:ListOPtionsProps
) => {
    const {
        execute:executeCopy,
        // fieldErrors:copyFieldErrors
    } = useAction(copyList, {
        onSuccess: (data) => {
            toast.success(`list ${data.title} copied`)
        },
        OnError: (error) => {
            toast.error(error)
        }
    })

    const closeRef = useRef<ElementRef<'button'>>(null)

    const { execute:executeDelete } = useAction(deleteList, {
        onSuccess: (data) => {
                toast.success(`list ${data.title} deleted`)
               closeRef.current?.click()
            },
            OnError: (error) => {
                toast.error(error)

            }
        })


   const onDelete = (formData:FormData) => {
        const boardId =  formData.get('boardId') as string
        const id =  formData.get('id') as string
      
        executeDelete({id,boardId})

   }
    
    const onCopy = (formData:FormData) => {
        const boardId =  formData.get('boardId') as string
        const id =  formData.get('id') as string
      
        executeCopy({id,boardId})

   }


    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button className=' h-auto w-auto p-2' variant='ghost'  >
                    <MoreHorizontal className=' h-4 w-4'/>
                </Button>
            </PopoverTrigger>
            <PopoverContent
            align= 'center'
            className='px-0 pt-3 pb-3'
            side ='bottom'
            >
                <div className=' text-sm font-medium text-center text-neutral-600 pb-4'>
                    List Action
            </div>
                <PopoverClose ref = {closeRef} asChild>
                    <Button className=' h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600' variant='ghost'>

                    <X className='h-4 w-4'/>
                    </Button>

                   
                </PopoverClose>
                 <Button
                    className=' rounded-nont w-full h-auto p-2 px-5 justify-center 
                        font-normal text-sm'
                        variant='ghost'
                        onClick={onAddCard}
                    >

                        Add card...
                    </Button>
                <form action={onCopy}>
                    <input hidden name='id' id = 'id' value={data.id} />
                    <input hidden name='boardId' id = 'boardId' value={data.boardId} />
                    <FormSubmit
                           className=' rounded-nont w-full h-auto p-2 px-5 justify-center 
                        font-normal text-sm'
                        variant='ghost'
                    >
                        Copy list...
                    </FormSubmit>
                </form>
                <Separator />
                  <form action={onDelete}>
                    <input hidden name='id' id = 'id' value={data.id} />
                    <input hidden name='boardId' id = 'boardId' value={data.boardId} />
                    <FormSubmit
                           className=' rounded-nont w-full h-auto p-2 px-5 justify-center 
                        font-normal text-sm'
                        variant='ghost'
                    >
                        Delete list...
                    </FormSubmit>
                </form>
            </PopoverContent>

        </Popover>
    )
 }
