
import { Separator } from '@/components/ui/separator'
import { Info } from './_components/info'
import { BoardList } from './_components/board-list'
import { Suspense } from 'react'
import { CheckSubscription } from '@/lib/subscription'


const OrganizationIdpage = async() => {
  const isPro = await CheckSubscription()
 

  return (
    <div className='w-full mb-20'>
      <Info isPro = {isPro} />
       <Separator className=' my-4' ></Separator>
      <div className=' px2 md:px-4'>
        <Suspense fallback={<BoardList.Skeleton/>}>
        <BoardList />
        </Suspense>
        
       </div>
    </div>
  )
}

export default OrganizationIdpage
