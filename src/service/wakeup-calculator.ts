import { parseExpression } from "cron-parser"
import { differenceInSeconds } from "date-fns"
 
export const getSleepTimeInSeconds = (cron: string, currentDate?: Date): number => {
    const scheduler = parseExpression(cron, { currentDate })
    const nextExecution = scheduler.next()
    return differenceInSeconds(nextExecution.toDate(), currentDate || new Date())
}