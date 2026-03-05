import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { prisma } from "@/lib/prisma";
import type { UserRecord } from "firebase-admin/auth";

export async function POST(req: NextRequest) {
  const authorization = req.headers.get("Authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const idToken = authorization.split("Bearer ")[1];

  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken, true);
    const userRecord: UserRecord = await adminAuth.getUser(decodedToken.uid);

    const email = userRecord.email ?? decodedToken.email;

    if (!email) {
      return NextResponse.json({ error: "Email not available" }, { status: 400 });
    }

    const name = userRecord.displayName ?? decodedToken.name ?? null;
    const image = userRecord.photoURL ?? decodedToken.picture ?? null;
    const emailVerified = userRecord.emailVerified ?? decodedToken.email_verified ?? false;

    // Upsert user to PostgreSQL Database
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        name,
        image,
      },
      create: {
        email,
        name,
        image,
        emailVerified,
      },
    });

    const expiresIn = 1000 * 60 * 60 * 24 * 5;
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    // Set session cookie
    const response = NextResponse.json({ status: "success", userId: user.id });
    response.cookies.set("session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: Math.floor(expiresIn / 1000),
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Firebase auth error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
  }
}
