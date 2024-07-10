'use client'

import { FormSubmit } from "@/components/form/form-submit"
import { FormTextarea } from "@/components/form/form-textarea"
import { Button } from "@/components/ui/button"
import { PlusIcon, X } from "lucide-react"
import { forwardRef,ElementRef,KeyboardEventHandler } from "react"
import { useAction } from "@/hooks/use-action"
import { toast } from "sonner"
import { createCard } from "@/actions/create-card"
import { useParams } from "next/navigation"
import { useOnClickOutside ,useEventListener} from "usehooks-ts"
import { useRef } from "react"
interface CardformProps{
    listId: string
    enableEditing:()=>void
    disableEditing: () => void
    isEditing:boolean,
}

export const CardForm = forwardRef<HTMLTextAreaElement,CardformProps> (({
    listId,
    enableEditing,
    disableEditing,
    isEditing
},ref
) => {
    const params = useParams()
    const formRef = useRef<ElementRef<'form'>>(null)

 const { execute, fieldErrors } = useAction(createCard, {
      onSuccess: (data) => {
            toast.success(`card ${data.title} created`)
            formRef.current?.reset()
            disableEditing()
        },
        OnError: (error) => {
            toast.error(error)

        }
    })

     const onTextareakeyDown:KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
        if (e.key === 'Enter'&& !e.shiftKey) {
            e.preventDefault()
          formRef.current?.requestSubmit();  
        }
    }

       const onSubmit = (formData:FormData) => {
        const title = formData.get('title') as string
        const listId =  formData.get('listId') as string
        const boardId =  params.boardId as string
      
        execute({title,boardId,listId})

   }

    useOnClickOutside(formRef, disableEditing)

 const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          formRef.current?.requestSubmit();  

            disableEditing()
        }
    }

    useEventListener('keydown', onKeyDown)

    if (isEditing) {
        return (
            <form
                ref={formRef}
                action={onSubmit}
                className=" m-1 py-0.5 px-1 space-y-4">
                <FormTextarea
                    ref={ref}
                    id='title'
                    errors={fieldErrors}
                    placeholder="Enter a title for this card..."
                    onKeyDown={onTextareakeyDown}
                />
                <input
                    hidden
                    id='listId'
                    name='listId'
                    value = {listId}
                />
                <div className=" flex items-center gap-x-1 ">
                    <FormSubmit>
                        Add card
                    </FormSubmit>
                    <Button onClick={disableEditing} size ='sm' variant='ghost' >
                        <X className ='h-5 w-5'/>
                    </Button>
                </div>
            </form>
        )
    }
    
    return (
        <div className=" pt-2 px-2">
            <Button
                onClick={enableEditing}
                className=" h-auto px-2 py-1.5 w-full justify-start
                 text-muted-foreground text-sm"
                size='sm'
                variant='ghost'
            >
                <PlusIcon className=" h-4 w-4 mr-2"/>
                Add Card
            </Button>
        </div>
    )
})

CardForm.displayName ='CardForm'