import { deleteBoard } from "@/actions/delete-board"
import { FormButton } from "./[organizationId]/form-delete"

interface BoardProps{
    title: string |null,
    id: string
    
}

 export const Board = ({
title,id
}: BoardProps) => {
    const deleteBoardwithId = deleteBoard.bind(null,{id})
    
    return (
        <form action={deleteBoardwithId} className=" flex items-center gap-x-2">
            <p>

            Board Title:{title }
            </p>
            <FormButton />
        </form>
    )
}