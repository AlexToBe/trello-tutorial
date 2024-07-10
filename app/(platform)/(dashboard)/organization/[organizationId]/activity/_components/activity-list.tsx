import {auth} from '@clerk/nextjs/server'

import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { ActivityItem } from '@/components/activity-item'



export const ActivityList = async () => {
    const { orgId } = auth()
    if (!orgId) {
        redirect('/select-org')
    }

    const auditLogs = await db.auditLog.findMany({
        where: {
            orgid:orgId
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return (
        <ol className=' space-y-4 mt-4'>
            <p className=' hidden last:block text-xs text-center text-muted-foreground'>
                No Activity found inside this organization
            </p>
            {
                auditLogs.map((log) => (
                    <ActivityItem key={log.id} data={log} />
                ))
            }
            
            
        </ol>
    )

}