import config from "config";
import jwt from "jsonwebtoken";

import TokenSchema from "../models/token-model";

class TokenService {
  generateTokens(payload: any) {
    const accessToken = jwt.sign(payload, config.get("JWT_ACCESS_SECRET"), {
      expiresIn: "30m",
    });
    const refreshToken = jwt.sign(payload, config.get("JWT_REFRESH_SECRET"), {
      expiresIn: "30d",
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  validateAccessToken(token: string) {
    try {
      const userData = jwt.verify(token, config.get("JWT_ACCESS_SECRET"));
      return userData;
    } catch (error: any) {
      return null;
    }
  }

  validateRefreshToken(refreshToken: string) {
    try {
      const userData = jwt.verify(
        refreshToken,
        config.get("JWT_REFRESH_SECRET")
      );
      return userData;
    } catch (error: any) {
      return null;
    }
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

  async removeToken(refreshToken: string) {
    const tokenData = await TokenSchema.deleteOne({ refreshToken });

    return tokenData;
  }

  async findToken(refreshToken: string) {
    const tokenData = await TokenSchema.findOne({ refreshToken });

    return tokenData;
  }
}

export default new TokenService();
