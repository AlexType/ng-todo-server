import { validationResult } from "express-validator";

import userService from "../services/user-service";

class UserController {
  async registration(req: any, res: any, next: any) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.json({
          success: false,
          message: "Ошибка валидации",
          errors: errors.array(),
        });
      }

      const { email, password, firstName, lastName } = req.body;

      const userData = await userService.registration(
        email,
        password,
        firstName,
        lastName
      );

      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      return res.json(userData);
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async login(req: any, res: any, next: any) {
    try {
      const { email, password } = req.body;
      const userData = await userService.login(email, password);

      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      return res.json(userData);
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async logout(req: any, res: any, next: any) {
    try {
      const { refreshToken } = req.cookies;
      const token = userService.logout(refreshToken);

      res.clearCookie("refreshToken");

      return res.json(token);
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async refresh(req: any, res: any, next: any) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await userService.refresh(refreshToken);

      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      return res.json(userData);
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getUsers(req: any, res: any, next: any) {
    try {
      const users = await userService.getAllUsers();
      return res.json(users);
    } catch (error) {}
  }
}

export default new UserController();
