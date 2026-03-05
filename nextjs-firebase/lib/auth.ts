import { cookies, headers } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";
import { auth } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import type { DecodedIdToken } from "firebase-admin/auth";

interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
}

export async function getSession(): Promise<SessionUser | null> {
  // Try Better Auth session first
  try {
    const headerStore = await headers();
    const session = await auth.api.getSession({
      headers: new Headers(headerStore),
    });

    if (session?.user) {
      return {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name ?? null,
        image: session.user.image ?? null,
      };
    }
  } catch {
    // Fall through to Firebase session
  }

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) return null;

  try {
    // Verify Firebase session cookie
    const decodedToken: DecodedIdToken = await adminAuth.verifySessionCookie(sessionCookie, true);

    // Search for user in database
    const user = await prisma.user.findUnique({
      where: { email: decodedToken.email! },
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
    };
  } catch {
    return null;
  }
}
