import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ENTITY_TYPE } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: {params:{cardId:string}}
) {
    try {
          const { userId, orgId } = auth()
        
        if (!userId || !orgId) {
            return new NextResponse('Unauthorized', {status:401})
        }
 
        const auditLogs = await db.auditLog.findMany({
        where: {
            orgid: orgId,
            entityId: params.cardId,
            entityType:ENTITY_TYPE.CARD
                    
        },
        orderBy: {
            createdAt: 'desc',
            
        },
        take:3
                
    })
        return NextResponse.json(auditLogs,{status:200})
    } catch (error) {
        return new NextResponse('internal error',{status:500})
    }

}