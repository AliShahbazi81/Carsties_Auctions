export {default} from "next-auth/middleware"

export const config = {
	  // In order to protect some of the routes from being accessed when not login, we have to specify the matcher with config like the way that we have done here
	  matcher: [
			'/session'
	  ],
	  pages: {
			// To redirect user to sign in page when they are not. If we do not use this, a nasty page for sign in will be shown
			signIn: '/api/auth/signin'
	  }
}