import config from 'config';
import jwt from 'jsonwebtoken';

import TokenSchema from '../models/token-model';

class TokenService {
  generateTokens(payload: any) {
    const accessToken = jwt.sign(payload, config.get('JWT_ACCESS_SECRET'), { expiresIn: '30m' });
    const refreshToken = jwt.sign(payload, config.get('JWT_REFRESH_SECRET'), { expiresIn: '30d' });

    return {
      accessToken,
      refreshToken,
    };
  }

  async saveToken(userId: string, refreshToken: string) {
    const tokenData = await TokenSchema.findOne({ user: userId });

    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }

    const token = await TokenSchema.create({ user: userId, refreshToken });
    return token;
  }
}

export default new TokenService();
