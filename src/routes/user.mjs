import { Router } from "express";

const router = new Router();

router.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("email", email);
  console.log("password", password);
  return res.status(200).json({
    user: {
      id: "123",
      email: "user@hrm.com",
      role: "HR",
    },
    accessToken: "eyJhbGci...",
    accessTokenExpiresIn: 900,
    refreshToken: "r1_9sdj3...",
  });
});

router.post("/api/refresh", async (req, res) => {
  const { refreshToken } = req.body;
  return res.status(200).json({
    accessToken: "new_access_token",
    accessTokenExpiresIn: 900,
  });
});

export default router;
