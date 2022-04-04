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
}

export default new UserService();
