'use client'

import { Button } from "@/components/ui/button"
import { useAction } from "@/hooks/use-action"
import { toast } from "sonner"
import { stripeRedirect } from "@/actions/stripe-redirect"
import { useProModal } from "@/hooks/use-pro-modal"


export const SubscriptionButton = ({isPro}:{isPro:boolean}) => {
    const proModal = useProModal()

    
    const { execute, isLoading } = useAction(stripeRedirect,{
          onSuccess: (data) => {
            window.location.href = data
    
        },
        OnError: (error) => {
            toast.error(error)

        }
    })
    
    const onClick = () => {
        if (isPro) {
        
            execute({})
        } else
        {
            proModal.onOpen()
            }
    }
    return (
        <Button
            variant='primary'
            disabled={isLoading}
            onClick={onClick}
        >

        {isPro?'Manage subscription':'Upgrade to Pro'}
        </Button>
    )
}