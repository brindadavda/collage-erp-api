import { JwtRequest } from './auth';
import { Response, NextFunction } from 'express';

export function checkRole(allowedRoles: ('ADMIN' | 'STAFF' | 'STUDENT')[]) {
 return (req: JwtRequest, res: Response, next: NextFunction) => {
  const role = req.role;

  if (role && !allowedRoles.includes(role)) {
   return res.status(403).json({ message: `Forbidden, you are a ${role} and this service is only available for ${allowedRoles}` });
  }

  next();
 };
}