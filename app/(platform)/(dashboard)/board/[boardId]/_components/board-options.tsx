'use client'
import { Button } from '@/components/ui/button'
import {
    Popover,
    PopoverClose,
    PopoverContent,
    PopoverTrigger
} from '@/components/ui/popover'
import { MoreHorizontal, X } from 'lucide-react'

import { useAction } from "@/hooks/use-action"
import { toast } from "sonner"
import { deleteBoard } from "@/actions/delete-board"


export const BoardOptions = ({ id }: { id: string }) => {
    
     const { execute, isLoading } = useAction(deleteBoard, {
      
        OnError: (error) => {
            toast.error(error)

        }
    })
   
      const onDelete = () => {
        execute({id})

    }
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button className=' h-auto w-auto p-2' variant='transparent' >
                    <MoreHorizontal className=' h-4 w-4'/>
                </Button>
            </PopoverTrigger>
            <PopoverContent
            align= 'start'
            className='px-0 pt-3 pb-3'
            side ='bottom'
            >
                <div className=' text-sm font-medium text-center text-neutral-600 pb-4'>
                    Board Action
            </div>
                <PopoverClose asChild>
                    <Button className=' h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600' variant='ghost'>

                    <X className='h-4 w-4'/>
                    </Button>

                   
                </PopoverClose>
                 <Button
                        className=' rounded-nont w-full h-auto p-2 px-5 justify-center font-normal text-sm
                        '
                        variant='ghost'
                        onClick={onDelete}
                        disabled={isLoading}
                    >

                        Delete this board
                    </Button>
            </PopoverContent>

        </Popover>
    )
}