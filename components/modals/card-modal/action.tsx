'use client'

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { CardwithList } from "@/types"
import { Copy, Trash } from "lucide-react"
import { useAction } from "@/hooks/use-action"
import { deleteCard } from "@/actions/delete-card"
import { copyCard } from "@/actions/copy-card"
import { toast } from "sonner"
import { useParams } from "next/navigation"
import { useCardModal } from "@/hooks/use-card-modal"
interface ActionsProps{
    data:CardwithList
}
export const Actions = ({ data }: ActionsProps) => {
    const cardModal = useCardModal()
    const params= useParams()
    const { execute:excuteCopyCard ,isLoading:isloadCopy} = useAction(copyCard, {
          onSuccess: (data) => {
            toast.success('card copyed')
              cardModal.onClose()
              
        },
        OnError: (error) => {
            toast.error(error)

        }
    })
      const { execute:excuteDeleteCard,isLoading:isloadDelete } = useAction(deleteCard, {
          onSuccess: (data) => {
            toast.success('card deletedd')
              cardModal.onClose()
        },
        OnError: (error) => {
            toast.error(error)

        }
    })
    
    const onCopy=() => {
        const boardId = params.boardId as string
        excuteCopyCard({id:data.id,boardId})
    }

    const onDelete=() => {
        const boardId = params.boardId as string
        excuteDeleteCard({id:data.id,boardId})
    }
    
    return (
        <div className=" space-y-2 mt-2">
            <p className=" text-xs font-semibold">
                Actions
            </p>
            <Button
                onClick={onCopy}
                disabled={isloadCopy}
                variant='gray'
                className=" w-full justify-start"
                size = 'inline'
            >
                <Copy className=' h-4 w-4 mr-2' />
                Copy
            </Button>
            <Button
                onClick={onDelete}
                disabled={isloadDelete}
                
                variant='gray'
                className=" w-full justify-start"
                size = 'inline'
            >
                <Trash className=' h-4 w-4 mr-2' />
                Delete
            </Button>
        </div>
    )
}

Actions.Skeleton = function ActionsSkeleton() {
    
    
     return (
        <div className=" space-y-2 mt-2">
          <Skeleton className=" w-20 h-4 bg-neutral-200"/>
          <Skeleton className=" w-full h-8 bg-neutral-200"/>
          <Skeleton className=" w-full h-8 bg-neutral-200"/>
        </div>
    )
}