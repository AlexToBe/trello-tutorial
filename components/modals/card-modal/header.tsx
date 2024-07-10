'use client'

import { FormInput } from "@/components/form/form-input"
import { Skeleton } from "@/components/ui/skeleton"
import { CardwithList } from "@/types"
import { useQueryClient } from "@tanstack/react-query"
import { Layout } from "lucide-react"
import { useParams } from "next/navigation"
import { useRef,ElementRef, useState } from "react"
import { useAction } from "@/hooks/use-action"
import { toast } from "sonner"
import { updateCard } from "@/actions/update-card"
interface HeaderProps{
    data:CardwithList 
}

export const Header = ({data}:HeaderProps) => {
    const [title,setTitle] = useState(data?.title)
    const queryClient = useQueryClient()
    const params = useParams()
    const inputRef = useRef<ElementRef<'input'>>(null)

        const { execute } = useAction(updateCard, {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey:['card',data.id]
                })
                  queryClient.invalidateQueries({
                    queryKey:['card-logs',data.id]
                })
            toast.error('card updated')
             setTitle(data.title)
       },
        OnError: (error) => {
            toast.error(error)

        }
    })
    
    const onBlur = () => {
        inputRef.current?.form?.requestSubmit()
    }
    const onSubmit = (formData: FormData) => {
        const boardId = params.boardId as string
        const title = formData.get('title') as string
        if (title ===data?.title ||!title) {
            return
        }
        execute({
            title,
            boardId,
            id:data!.id
         })
    }
    return (
        <div
            className=" flex items-start gap-x-3 mb-6 w-full"
        >
            <Layout className = 'h-5 w-5 mt-1 text-neutral-700'/>
            <div className=" w-full">
                <form action={onSubmit}>
                    <FormInput
                        ref={inputRef}
                        onBlur={onBlur}
                        id = 'title'
                        defaultValue={title}
                        className=" font-semibold text-xl px-1 text-neutral-700 bg-transparent border-transparent relative -left-1.5 w-[95%]
                         focus-visible:bg-white focus-visible:border-input mb-0.5 truncate"
                    />
                </form>
                <p className=" text-sm text-muted-foreground" >
                    in list <span className="underline" >{ title}</span>
                </p>
            </div>
        </div>
    )
}

Header.Skeleton = function headerSkeleton() {
    return (
        <div
            className=" flex items-start gap-x-3 mb-6 w-full"
        >
            <Skeleton className=" h-6 w-6 mt-1 bg-neutral-200"/>
            <div>
            <Skeleton className=" h-4 w-24  bg-neutral-200"/>

            </div>
        </div>
    )
}