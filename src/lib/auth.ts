import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Nickname",
      credentials: {
        nickname: { label: "닉네임", type: "text" },
      },
      async authorize(credentials) {
        const nickname = credentials?.nickname as string;
        if (!nickname) return null;

        let user = await prisma.user.findFirst({ where: { nickname } });
        if (!user) {
          user = await prisma.user.create({ data: { nickname } });
        }

        return { id: user.id, name: user.nickname };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    jwt({ token, user }) {
      if (user) token.userId = user.id;
      return token;
    },
    session({ session, token }) {
      if (session.user) session.user.id = token.userId as string;
      return session;
    },
  },
});
