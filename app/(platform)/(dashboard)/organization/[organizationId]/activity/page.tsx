import { Separator } from "@radix-ui/react-separator"
import { Info } from "../_components/info"
import { Suspense } from "react"
import { ActivityList } from "./_components/activity-list"
import { CheckSubscription } from "@/lib/subscription"

 const ActivityPage = async()=>{
  const isPro = await CheckSubscription()

    return(
        <div className=" w-full">
            <Info isPro={isPro} />
            <Separator />
            <Suspense fallback={<div>loading...</div>}>
                <ActivityList/>
            </Suspense>
        </div>
    )
 }
    
 export default ActivityPage