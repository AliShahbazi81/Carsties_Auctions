'use client'
import {Button} from "flowbite-react";
import {signIn} from "next-auth/react"

export default function LoginButton()
{
	  return(
			<Button 
				  outline
				  // Using NextAuth functionality
				  // The id-server name has to be the same with the one that we provided inside the DuendeServerIdentity credentials
				  onClick={() => signIn(
						'id-server', 
						// callbackUrl => Whenever we log in, the link below is where we will be redirected to
						{callbackUrl: '/'})}
			>
				  Login
			</Button>
	  )
}