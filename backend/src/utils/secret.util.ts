import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class SecretUtil {
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = parseInt(process.env.SALT_ROUNDS || '10', 10);
    return bcrypt.hash(password, saltRounds);
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static generateToken(payload: object, secret: string, expiresIn: string = '7d'): string {
    return jwt.sign(payload, secret, { expiresIn: expiresIn as any });
  }

  static verifyToken(token: string, secret: string): any {
    return jwt.verify(token, secret);
  }
}
