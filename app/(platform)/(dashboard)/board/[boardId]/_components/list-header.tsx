
'use client'

import { FormInput } from "@/components/form/form-input"
import { List } from "@prisma/client"
import { useState,useRef,ElementRef } from "react"
import { useEventListener } from "usehooks-ts"
import { useAction } from "@/hooks/use-action"
import { updateList } from "@/actions/update-list"
import { toast } from "sonner"
import { useParams, useRouter } from "next/navigation"
import { ListOPtions } from "./list-options"


interface ListHeaderProps{
    data: List,
    OnAddCard:()=>void
}

export const ListHeader = ({data,OnAddCard }:ListHeaderProps) => {
     const [title, setTitle] = useState(data.title)
    const[isEditing,setIsEditing] = useState(false)
    const formRef = useRef<ElementRef<'form'>>(null)
    const inputRef = useRef<ElementRef<'input'>>(null)
    const router = useRouter()

    
 const { execute, fieldErrors } = useAction(updateList, {
      onSuccess: (data) => {
            toast.success(`list ${data.title} renamed`)
            setTitle(data.title)
            router.refresh()
            disableEditing()
        },
        OnError: (error) => {
            toast.error(error)

        }
    })


      const enableEditing = () => {
        setIsEditing(true)
        setTimeout(() => {
            inputRef.current?.focus()
          inputRef.current?.select();  
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

    useEventListener('keydown', onKeyDown)
    
   const onSubmit = (formData:FormData) => {
        const title = formData.get('title') as string
        const boardId =  formData.get('boardId') as string
        const id =  formData.get('id') as string
        if (title ===data.title) {
            return disableEditing()
        }
        execute({title,id,boardId})

   }
    
    const onBlur = () => {
        
        formRef.current?.requestSubmit()
    }   

    return (
        <div className=" pt-2 px-2 text-sm font-semibold flex justify-between items-start gap-x-2">
            {isEditing ?(
                <form action={onSubmit} ref ={formRef}  className=" flex-1 px-[2px]">
                    <input
                        hidden
                        value={data.id}
                        name='id'
                        id='id'
                    />
                      <input
                        hidden
                        value={data.boardId}
                        name='boardId'
                        id='boardId'
                    />
                       <FormInput
                        ref={inputRef}
                        onBlur={onBlur}
                        errors={fieldErrors}
                        id='title'
                        className=" text-sm px-[7px] py-1 h-7 font-medium border-transparent hover:border-input 
                         focus:bg-white focus:border-input transition"
                        placeholder="Enter list title.."
                        defaultValue={title}
                    />
                    <button type="submit" className="hidden"></button>
                </form>
            ) : (
                    <div
                        onClick={enableEditing}
                        className=" w-full text-sm px-2.5 py-1 h-7 font-medium border-transparent">
                {title}
           </div>      
            )}
            <ListOPtions
                data={data}
                onAddCard = {OnAddCard}
            />
        </div>
    )
}