import { ACTION, AuditLog } from '@prisma/client'

export const generateLogMessage = (log: AuditLog) => {
    const { action, entityTitle, entityType } = log
    switch (action) {
        case ACTION.CREATE:
            
            return `created ${entityType.toLocaleLowerCase()}  "${entityTitle}"`
    
        case ACTION.DELETE:
            
            return `delete ${entityType.toLocaleLowerCase()}  "${entityTitle}"`
        case ACTION.UPDATE:
            return `update ${entityType.toLocaleLowerCase()}  "${entityTitle}"`
    }
}