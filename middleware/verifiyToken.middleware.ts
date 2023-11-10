import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Vérify JWT Token passed in 'Authorization' header
 * @param request
 * @param response
 * @param next
 * @returns
 */
function verifyTokenMiddleware(request: Request, response: Response, next: NextFunction) {
    const token = request.header('Authorization');
    // If /login, don't verify token
    if (request.path === '/login') {
        return next();
    }

    if (!token) {
        return response.status(401).json({ message: 'Token missing. Unauthorized access.' });
    }

    jwt.verify(token, process.env.API_JWT_SECRET, (error) => {
        if (error) {
            return response.status(403).json({ message: 'Invalid token. Unauthorized access.' });
        }

        // All good
        next();
    })
}

export default verifyTokenMiddleware;