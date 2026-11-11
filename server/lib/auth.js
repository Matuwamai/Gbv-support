import jwt from "jsonwebtoken";
import prisma from "./prisma.js";

export const STAFF_ROLES = ["ADMIN", "MODERATOR"];

// Verifies the "Authorization: Bearer <token>" header and loads the user,
// so tokens for deleted accounts stop working and role changes apply at once.
export const requireAuth = async (req, res, next) => {
  const [scheme, token] = (req.headers.authorization || "").split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
  if (!Number.isInteger(payload?.userId)) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, name: true, role: true },
    });
    if (!user) {
      return res.status(401).json({ message: "Account no longer exists" });
    }
    req.user = user;
    return next();
  } catch (error) {
    return next(error);
  }
};

export const isStaff = (user) => STAFF_ROLES.includes(user?.role);

// The owner of a resource, or an admin/moderator, may change it.
export const canModify = (user, ownerId) => Boolean(user) && (user.id === ownerId || isStaff(user));

export const requireStaff = (req, res, next) =>
  isStaff(req.user)
    ? next()
    : res.status(403).json({ message: "You do not have permission to perform this action" });
