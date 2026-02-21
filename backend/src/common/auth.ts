import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export type AuthUser = {
  id: number;
  email: string;
  role: string;
};

declare module "express-serve-static-core" {
  interface Request {
    user?: AuthUser;
  }
}

const jwtSecret = process.env.JWT_SECRET || "dev-secret";

export function signToken(payload: AuthUser) {
  return jwt.sign(payload, jwtSecret, { expiresIn: "8h" });
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing token" });
  }
  const token = header.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, jwtSecret) as AuthUser;
    req.user = decoded;
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

export function requireRole(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    return next();
  };
}
