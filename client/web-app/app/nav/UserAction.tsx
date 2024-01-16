'use client'
import {Button} from "flowbite-react";
import Link from "next/link";

export default function UserAction()
{
	  return(
			<Button outline>
				  <Link href={'/session'}>
						Session
				  </Link>
			</Button>
	  )
}