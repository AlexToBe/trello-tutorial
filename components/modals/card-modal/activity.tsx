'use client'

import { ActivityItem } from "@/components/activity-item"
import { AuditLog } from "@prisma/client"
import { ActivityIcon } from "lucide-react"

export const Activity = ({items}:{items:AuditLog[]}) => {
    return (
        <div className="flex items-start gap-x-3 w-full">
            <ActivityIcon className=" h-5 w-5 mt-0.5 text-neutral-700"/>
            <div className=" w-full">
                <p className=" font-semibold text-neutral-700 mb-2">
                    Activity
                </p>
                <ol className=" mt-2 space-y-4">
                    {items.map((item) => (
                        <ActivityItem key={item.id} data = {item} />
                    ))}
                </ol>
            </div>
        </div>
    )
}