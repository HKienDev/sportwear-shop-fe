import type { AuthResponseData } from '@/types/auth';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { User } from 'next-auth';

// Mở rộng kiểu User để thêm các thuộc tính cần thiết
interface CustomUser extends User {
  role?: string;
  accessToken?: string;
  refreshToken?: string;
}

// Mở rộng kiểu JWT để thêm các thuộc tính cần thiết
interface CustomJWT {
  role?: string;
  accessToken?: string;
  refreshToken?: string;
  [key: string]: unknown;
}

export const setAuthData = (data: AuthResponseData) => {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const res = await fetch(`/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          });

          const data = await res.json();

          if (data.success && data.data) {
            return {
              id: data.data._id,
              email: data.data.email,
              name: data.data.username,
              role: data.data.role,
              accessToken: data.data.accessToken,
              refreshToken: data.data.refreshToken,
            } as CustomUser;
          }

          return null;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const customUser = user as CustomUser;
        token.role = customUser.role;
        token.accessToken = customUser.accessToken;
        token.refreshToken = customUser.refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        const customToken = token as CustomJWT;
        session.user.role = customToken.role as string;
        session.user.accessToken = customToken.accessToken as string;
        session.user.refreshToken = customToken.refreshToken as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken');
  }
  return null;
}; 