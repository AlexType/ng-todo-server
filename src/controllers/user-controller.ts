import userService from '../services/user-service';

class UserController {
  async registration(req: any, res: any, next: any) {
    try {
      const { email, password, firstName, lastName } = req.body;
      const userData = await userService.registration(email, password, firstName, lastName);

      res.cookie('refreshToken', userData.refreshToken, {
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
    } catch (error) {}
  }

  async logout(req: any, res: any, next: any) {
    try {
    } catch (error) {}
  }

  async refresh(req: any, res: any, next: any) {
    try {
    } catch (error) {}
  }

  async getUsers(req: any, res: any, next: any) {
    try {
      res.json(['123', '456']);
    } catch (error) {}
  }
}

export default new UserController();
