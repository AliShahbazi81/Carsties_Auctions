import NextAuth, {NextAuthOptions} from "next-auth";
import DuendeIdentityServer6 from "next-auth/providers/duende-identity-server6";

export const authOptions: NextAuthOptions = {
	  session: {
			strategy:'jwt'
	  },
	  providers: [
			DuendeIdentityServer6({
				  id: 'id-server',
				  clientId: 'nextApp',
				  clientSecret: 'secret',
				  // It tells the client-app where our identity provider is
				  issuer: 'http://localhost:5000',
				  authorization: {params: {scope: 'openid profile auctionApp'}},
				  // If set to true, the user information will be extracted from the id_token claims, instead of making a request to the userinfo endpoint
				  idToken: true
			})
	  ]
}

const handler = NextAuth(authOptions)
export {handler as GET, handler as POST}