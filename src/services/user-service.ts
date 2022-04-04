import bcrypt from "bcrypt";

import UserDto from "../dtos/user-dto";
import UserSchema from "../models/user-model";
import tokenService from "./token-service";

class UserService {
  async registration(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) {
    const candidate = await UserSchema.findOne({ email });

    if (candidate) {
      throw new Error(`Пользователь с E-mail ${email} уже создан`);
    }

    const hasPassword = await bcrypt.hash(password, 8);
    const user = await UserSchema.create({
      email,
      password: hasPassword,
      firstName,
      lastName,
    });

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }

  async login(email: string, password: string) {
    const user = await UserSchema.findOne({ email });

    if (!user) {
      throw new Error("Пользователь не найден");
    }
    const isPassValid = bcrypt.compare(password, user.password);

    if (!isPassValid) {
      throw new Error("Неверный пароль");
    }

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }

  async logout(refreshToken: string) {
    const token = tokenService.removeToken(refreshToken);

    return token;
  }
}

export default new UserService();
