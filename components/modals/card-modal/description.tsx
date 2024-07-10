'use client'

import { Skeleton } from "@/components/ui/skeleton"
import { CardwithList } from "@/types"
import { useQueryClient } from "@tanstack/react-query"
import { AlignLeft } from "lucide-react"
import { useParams } from "next/navigation"
import { useState,useRef,ElementRef } from "react"
import { useEventListener, useOnClickOutside } from "usehooks-ts"
import { useAction } from "@/hooks/use-action"
import { toast } from "sonner"
import { FormTextarea } from "@/components/form/form-textarea"
import { FormSubmit } from "@/components/form/form-submit"
import { Button } from "@/components/ui/button"
import { updateCard } from "@/actions/update-card"

interface DescriptionProps{
    data:CardwithList
}

export const Description = ({data}:DescriptionProps) => {
    const [isEditing,setIsEditing] = useState(false)
    const [cardDeacription,setCardDeacription] = useState(data.description)
    const formRef = useRef<ElementRef<'form'>>(null)
    const textareaRef = useRef<ElementRef<'textarea'>>(null)
    const queryClient = useQueryClient()
    const params = useParams()
    const { execute, fieldErrors } = useAction(updateCard, {
      onSuccess: (dataPara) => {
            toast.success(`card updated `)
            queryClient.invalidateQueries({
                queryKey:['card',dataPara.id]
            })
              queryClient.invalidateQueries({
                    queryKey:['card-logs',data.id]
                })
            formRef.current?.reset()
            disableEditing()
            setCardDeacription(dataPara.description)
            data.description = dataPara.description
        },
        OnError: (error) => {
            toast.error(error)

        }
    })

       const enableEditing = () => {
        setIsEditing(true)
        setTimeout(() => {
            textareaRef.current?.focus()
        });
       }
    
     const disableEditing = () => {
        setIsEditing(false)
    }

    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          formRef.current?.requestSubmit();  

            disableEditing()
        }
    }
    useOnClickOutside(formRef, disableEditing)

    useEventListener('keydown', onKeyDown)

    const onSubmit = (formData:FormData) => {
    const description = formData.get('description') as string
    const boardId =  params.boardId as string
      
        execute({description,boardId,id:data.id})

   }
    return (
        <div className=" flex items-start gap-x-3 w-full">
            <AlignLeft className = 'h-5 w-5 mt-0.5 text-neutral-700'/>
            <div className=" w-full">
                <p className=" font-semibold text-neutral-700 mb-2">
                    Description
                </p>
                {isEditing ? (
                    <form action={onSubmit}
                    ref = {formRef}
                    className=" space-y-2"
                    >
                        <FormTextarea
                            id='description'
                            className=" w-full mt-2"
                            placeholder=" Add more detailed description"
                            defaultValue={cardDeacription || undefined}
                            errors={fieldErrors}
                            ref = {textareaRef}
                        />
                        <div className=" flex items-center gap-x-2">
                            <FormSubmit>
                                Save
                            </FormSubmit>
                            <Button
                                type='button'
                                onClick={disableEditing}
                                size='sm'
                                variant='ghost'
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                ) : (
                        
                    <div
                         onClick={enableEditing}   
                        role="button"
                        className=" min-h-[78px] bg-neutral-200 text-sm font-medium py-3 px-3.5 rounded-md"
                    >
                {cardDeacription ||'Add a more detailed description...'}

                </div>
                )}
            </div>
        </div>
    )
}

Description.Skeleton = function DescriptionSkeleton() {
    return (
        <div className="flex items-start gap-x-3 w-full">
            <Skeleton className=' h-6 w-6 bg-neutral-200'></Skeleton>
            <div className=" w-full">
            <Skeleton className=' h-6 w-24 mb-2 bg-neutral-200'></Skeleton>
            <Skeleton className=' h-6 w-24 mb-2 bg-neutral-200'></Skeleton>

            </div>
        </div>
    )
}