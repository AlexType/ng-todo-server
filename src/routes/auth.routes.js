import bcrypt from 'bcrypt';
import config from 'config';
import { Router } from 'express';
import { check, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

import User from '../models/User.js';

const router = new Router();

router.post(
  '/registration',
  [
    check('email', 'Неверный формат E-mail').isEmail(),
    check('password', 'Пароль должен содержать от 3-х до 12-ти символов').isLength({
      min: 3,
      max: 12,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.json({ success: false, message: 'Ошибка валидации', errors: errors.errors });
      }

      const { email, password, name } = req.body;

      const candidate = await User.findOne({ email });

      if (candidate) {
        return res.status(400).json({
          success: false,
          message: `Пользователь с E-mail ${email} уже создан`,
        });
      }

      const hasPassword = await bcrypt.hash(password, 8);
      const user = new User({ email, password: hasPassword, name });

      await user.save();

      return res.json({ success: true, message: 'Регистрация прошла успешно' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }
);

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Пользователь не найден' });
    }
    const isPassValid = bcrypt.compareSync(password, user.password);

    if (!isPassValid) {
      return res.status(400).json({ success: false, message: 'Неверный пароль' });
    }

    const token = jwt.sign({ id: user.id }, config.get('secretKey'), { expiresIn: '1hr' });

    return res.json({
      success: true,
      token,
      message: 'Вход выполнен',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
  }
});

export default router;
