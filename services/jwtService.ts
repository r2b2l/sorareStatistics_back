import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

class JwtService {
    generateToken(mail: string): string {
        return jwt.sign({ mail }, process.env.API_JWT_SECRET, { expiresIn: process.env.API_JWT_EXPIRES_IN });
    }
}

export default JwtService;