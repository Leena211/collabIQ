import { NextApiRequest, NextApiResponse } from "next";

// Example middleware function
export function authMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void
) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  // Example check: validate token (replace with your own logic)
  if (token !== process.env.SECRET_API_KEY) {
    return res.status(403).json({ error: "Forbidden: Invalid token" });
  }

  // If everything is fine, continue
  next();
}
