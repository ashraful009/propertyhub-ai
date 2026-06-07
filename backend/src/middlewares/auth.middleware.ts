import {Request, Response, NextFunction} from "express";
import jwt from 'jsonwebtoken';


// interface for extended request
export interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}


// check user loged in or not

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void =>{
 const token = req.headers.authorization?.split(' ')[1];


 if(!token) {
    res.status(401).json({error: 'Access Denied, No token found'});
    return;
 }

 try {

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as {id: string, role: string}
    req.user = decoded;
    next();
 }catch(err){
    res.status(403).json({error: 'Invalid token or Expired token'})  
 }
};


export const authorizeRoles = (...allowedRoles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if(!req.user || !allowedRoles.includes(req.user.role)){
            res.status(403).json({error: 'Permission Denied. you do not have the required role'});
            return;
        };
        next();
    }
}
