import Image from "next/image"
import Link from "next/link"

// @ts-ignore
const Logo = () => {
  return (
    <Link href = '/'>
        <div className=" hover:opacity-75 transition items-center gap-x-2 hidden md:flex" >
            
          <Image
            src = '/vercel.svg'
            alt='lo'
            height={30}
            width={30}
            /> 
           <p className=" text-lg text-neutral-700 pb-1 ">
                Taskify
            </p>
        </div>

    </Link>
  )
}

export default Logo
