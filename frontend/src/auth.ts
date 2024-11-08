import { DefaultSession, SvelteKitAuth, SvelteKitAuthConfig } from '@auth/sveltekit';
import Google from '@auth/sveltekit/providers/google';
import { AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET } from '$env/static/private';
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "../src/db/prisma";

const authOptions: SvelteKitAuthConfig = {
    adapter: PrismaAdapter(prisma),
    providers: [
        Google({
            clientId: AUTH_GOOGLE_ID,
            clientSecret: AUTH_GOOGLE_SECRET,
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            const existingUser = await prisma.user.findUnique({
                where: { email: user.email },
            });

            if (existingUser && existingUser.id !== user.id) {
                // Link the accounts
                await prisma.account.update({
                    where: { userId: existingUser.id },
                    data: { userId: user.id },
                });
            }

            return true;
        },
    },
    trustHost: true, // Move this line outside of the callbacks object
};

export const { handle, signIn, signOut } = SvelteKitAuth(authOptions);