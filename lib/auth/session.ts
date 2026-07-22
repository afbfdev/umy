import { SignJWT, jwtVerify } from "jose";

/**
 * Gestion des sessions admin par JWT signé (HS256).
 * ⚠️ Ce module ne doit importer QUE `jose` afin de rester compatible
 * avec le runtime Edge (utilisé par le middleware).
 */

export const SESSION_COOKIE = "umy_admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 jours (secondes)

const ALG = "HS256";

function getSecret(): Uint8Array {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET est manquant (voir .env).");
  }
  return new TextEncoder().encode(secret);
}

export type SessionPayload = {
  sub: string;
  email: string;
  name: string;
  role: string;
};

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({
    email: payload.email,
    name: payload.name,
    role: payload.role,
  })
    .setProtectedHeader({ alg: ALG })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecret());
}

export async function verifySessionToken(
  token: string,
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (!payload.sub) return null;
    return {
      sub: payload.sub,
      email: typeof payload.email === "string" ? payload.email : "",
      name: typeof payload.name === "string" ? payload.name : "",
      role: typeof payload.role === "string" ? payload.role : "admin",
    };
  } catch {
    return null;
  }
}
