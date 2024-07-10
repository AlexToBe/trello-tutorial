'use client'
import { useFormStatus } from "react-dom"
import { cn } from "@/lib/utils"
import { Button } from "../ui/button"

interface FormButtonProps {
    className?: string
    children: React.ReactNode,
    dislabled?: boolean,
    variant?:'default'|'outline'|'destructive'|'secondary'|'ghost'|'link'|'primary',
    
}
export const FormSubmit = ({
    className,
    children,
    dislabled,
    variant = 'primary'
}: FormButtonProps) => {
    const {pending} = useFormStatus()

    return (
        <Button
            type='submit'
            className={cn(
                className
            )}
            disabled={ pending|| dislabled}
            variant={variant}
        >
            {children}
        </Button>
    )
}