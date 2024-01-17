import {DefaultSession} from 'next-auth'

declare module 'next-auth' {
	  // When we want to get the username from the session, there is no option for getting the username
	  // Hence, we have to declare the module - like what we did down below - in order to get that
	  interface Session {
			user: {
				  username: string
			} & DefaultSession['user']
	  }
	  
	  interface Profile {
			username: string
	  }
}

declare module 'next-auth/jwt' {
	  interface JWT {
			username: string
			access_token?: string
	  }
}

