
'use client'

import { Input } from "@/components/ui/input"
import { useFormStatus } from "react-dom"
//replaced 
export const FormInput = ({ errors }: { errors?: {title?:string[]}}) => {
    const { pending} = useFormStatus()
    
    
    return (
        <div>
            <Input
            id='title'
            name='title'
            required
            placeholder = 'Enter a title'
            disabled={pending}
            />
             {errors?.title ? (
                    <div>
                        {errors.title.map((error: string) => (
                            <p key={error} className=" text-rose-500">{error}</p>
                        ))}
                    </div>
            ):null}
        </div>
    )
}