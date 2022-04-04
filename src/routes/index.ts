import { Router } from "express";
import { body, check } from "express-validator";

import userController from "../controllers/user-controller";

const router: Router = Router();

router.post(
  "/registration",
  body("email").isEmail(),
  body("password").isLength({
    min: 3,
    max: 12,
  }),
  userController.registration
);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/refresh", userController.refresh);
router.get("/users", userController.getUsers);

export default router;
