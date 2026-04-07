import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import connectDB from './mongodb';
import mongoose from 'mongoose';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }

        await connectDB();
        const Staff = mongoose.model('Staff');

        const staff = await Staff.findOne({
          email: credentials.email.toLowerCase(),
          active: 1,
        }).select('+password');

        if (!staff) {
          throw new Error('Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, staff.password);

        if (!isPasswordValid) {
          throw new Error('Invalid email or password');
        }

        // Update last login
        await Staff.findByIdAndUpdate(staff._id, {
          last_login: new Date(),
          last_ip: '127.0.0.1',
        });

        return {
          id: staff._id.toString(),
          email: staff.email,
          name: `${staff.firstname} ${staff.lastname}`,
          isAdmin: staff.isadmin === 1 || staff.admin === 1,
          role: staff.role,
          image: staff.profile_image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isAdmin = (user as { isAdmin?: boolean }).isAdmin;
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        (session.user as { isAdmin?: boolean }).isAdmin = token.isAdmin as boolean;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
};
