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
	  ],
	  callbacks: {
			// When we want to get additional data from the JWT after login.
			async jwt({token, profile, account, user}) {
				  //! Remember: We just can access to profile, account and user only once we login. After that, its impossible to access them
				  if (profile)
				  {
						token.username = profile.username
				  }
				  return token;
			},
			// Username is inside the profile section of the jwt. We can see the token, profile, account, and user inside a console log
			async session({session, token}) {
				  if (token) {
						session.user.username = token.username
				  }
				  return session;
			}
	  }
}

const handler = NextAuth(authOptions)
export {handler as GET, handler as POST}