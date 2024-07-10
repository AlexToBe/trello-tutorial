import { auth } from "@clerk/nextjs/server"
import { Orgcontrol } from "./_components/org-control"
import {startCase} from 'lodash'

export async function generateMetadata () {
  const { orgSlug } = auth()
  return {
    title: startCase(orgSlug||'organization'),
  }
}

const  OrganiIdLayout=({
  children,
}: {
  children: React.ReactNode
}) =>{
  return (
    < >
          <Orgcontrol />
        {children}
              
    </>
  )
}
export default OrganiIdLayout