import { FormPopover } from "@/components/form/form_popover"
import { Hint } from "@/components/hint"
import { HelpCircle, User2 } from "lucide-react"
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { MAX_FREE_BOARDS } from "@/constants/boards"
import { getAvailableCount } from "@/lib/org-limit"
import { CheckSubscription } from "@/lib/subscription"


export const BoardList = async() => {
    const{orgId} = auth()
    if (!orgId) {
        return redirect('/select-org')
    }
    const boards = await db.board.findMany({
        where: {
             orgId
        },
        orderBy: {
            createdAt: 'asc'
        }
    })

    const availableCount = await getAvailableCount()
    const isPro = await CheckSubscription()
    return (
        <div className=" space-x-4">
            <div className=" flex items-center font-semibold text-lg text-neutral-700">
            <User2 className=" h-5 w-5 mr-2" />
            Your boards
            </div>
            <div className=" grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {boards.map((board) => (
                    <Link
                        key={board.id}
                        className=" aspect-video relative h-full w-full bg-cover rounded-sm  
                           p-2 bg-sky-700 overflow-hidden"
                        href={`/board/${board.id}`}
                        style={{backgroundImage:`url(${board.imageThumbUrl})`}}
                    >
                        <div className=" absolute inset-0  bg-black/30 hover:bg-black/40 transition"/>
                        <p className=" relative font-semibold text-white">
                            {board.title}
                        </p>
                    </Link>
                ))}
                
                <FormPopover sideOffset={10} side ='right'>
                    
                <div
                    role ='button'
                    className=" aspect-video relative h-full w-full bg-muted rounded-sm flex flex-col gap-y-1 items-center justify-center hover:opacity-75 transition"
                >
                    <p className=" text-sm">
                        Create new board
                    </p>
                        <span className=" text-xs"> {isPro?'Unlimited': `${MAX_FREE_BOARDS-availableCount} remaining`}</span>
                    <Hint sideOffset={40}
                        description={`Free Workspaces can have up to 5 open boards. Forunlimited boards upgrade this workspace`}
                        >
                        <HelpCircle className=" absolute bottom-2 right-2 h-[14px] w-[14px]"/>
                    </Hint>
                </div>
                </FormPopover>

            </div>
        </div>
    )
}

BoardList.Skeleton = function SkeletonBoardList() {
    return (
            <div className=" grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">

            <Skeleton className="aspect-video relative h-full w-full p-2"/>
            <Skeleton className="aspect-video relative h-full w-full p-2"/>
            <Skeleton className="aspect-video relative h-full w-full p-2"/>
        </div>
    )
}