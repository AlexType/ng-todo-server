import bcrypt from 'bcrypt';
import { Router } from 'express';
import { check, validationResult } from 'express-validator';

import User from '../models/User.js';

const router = new Router();

router.post(
  '/registration',
  [
    check('email', 'Uncorrected email').isEmail(),
    check('password', 'Password must be longer that 3 and shorted then 12').isLength({
      min: 3,
      max: 12,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.json({ message: 'Uncorrected request', errors });
      }

      const { email, password, name } = req.body;

      const candidate = await User.findOne({ email });

      if (candidate) {
        return res
          .status(400)
          .json({ message: `User with this ${email} has already been created` });
      }

      const hasPassword = await bcrypt.hash(password, 15);
      const user = new User({ email, password: hasPassword, name });

      await user.save();

      return res.json({ message: 'User was created' });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error.message);
    }
  }
);

export default router;
