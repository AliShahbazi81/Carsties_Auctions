'use client'
import {Dropdown} from "flowbite-react";
import {User} from "next-auth";
import {HiCog, HiUser} from "react-icons/hi2";
import Link from "next/link";
import {AiFillCar, AiFillTrophy, AiOutlineLogout} from "react-icons/ai";
import {signOut} from "next-auth/react";
import {usePathname, useRouter} from "next/navigation";
import {useParamsStore} from "@/hooks/useParamsStore";

type Props = {
	  user: User
}

export default function UserAction({user}: Props) {
	  const router = useRouter();
	  const pathname = usePathname();
	  const setParams = useParamsStore(state  => state.setParams)
	  function setWinner()
	  {
			setParams({winner: user.username, seller: undefined})
			// Check where the user is located
			if(pathname !== '/') router.push("/");
	  } 
	  function setSeller()
	  {
			setParams({seller: user.username, winner: undefined})
			// Check where the user is located
			if(pathname !== '/') router.push("/");
	  }
	  
	  return (
			<Dropdown inline label={`Welcome ${user.name}`}>
				  <Dropdown.Item 
						icon={HiUser} 
						onClick={setSeller}>
							  My Auctions
				  </Dropdown.Item>
				  <Dropdown.Item 
						icon={AiFillTrophy} 
						onClick={setWinner}>
							  Auctions won
				  </Dropdown.Item>
				  <Dropdown.Item 
						icon={AiFillCar}>
						<Link href={'/auctions/create'}>
							  Sell my car
						</Link>
				  </Dropdown.Item>
				  <Dropdown.Item icon={HiCog}>
						<Link href={'/session'}>
							  Session (dev Only)
						</Link>
				  </Dropdown.Item>
				  <Dropdown.Divider/>
				  <Dropdown.Item icon={AiOutlineLogout} onClick={() => signOut({callbackUrl: '/'})}>
						Sign Out
				  </Dropdown.Item>
			</Dropdown>
	  )
}