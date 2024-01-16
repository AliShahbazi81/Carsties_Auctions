'use client'
import {AiOutlineCar} from "react-icons/ai";
import {useParamsStore} from "@/hooks/useParamsStore";
import {usePathname, useRouter} from "next/navigation";

export default function Logo() {
	  const router = useRouter()
	  // It checks where user was 
	  const pathname = usePathname()
	  const reset = useParamsStore(state => state.reset)
	  
	  function doReset()
	  {
			if (pathname !== '/') router.push('/');
			reset();
	  }

	  return (
			<div
				  
				  onClick={doReset}
				  className={"flex items-center gap-2 text-3xl font-semibold text-red-500 cursor-pointer"}
			>
				  <AiOutlineCar size={34}/>
				  <div>Carsties Auctions</div>
			</div>
	  )
}