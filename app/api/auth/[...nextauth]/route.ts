import NextAuth from "next-auth"
import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from "next-auth/providers/google";

const handler:NextAuthOptions = NextAuth({
    providers:[
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
          })

          
    ],
    callbacks:{
        async session({ session, token }) {
            session.user.id = token.id as string;
            return session;
          },
          async jwt({ token, account, user }) {
            if (account) {
              token.id = user.id;
            }
            return token;
          },
          async redirect({ url, baseUrl }) {
            // Redirect after sign-in
            if (url === '/api/auth/callback/signin') {
              return `${baseUrl}/home`; // Redirect to home page
            }
            // Redirect after sign-out
            if (url === '/api/auth/signout') {
              return 'http://localhost:3000'; // Redirect to localhost
            }
            return baseUrl; // Fallback to the application's base URL
          }
    }
})

export { handler as GET, handler as POST }