import { sign } from "jsonwebtoken";
import { User } from "./entity/User";
export const createAccessToken = (user: User) => {
  console.log("token secret", process.env.ACCESS_TOKEN_SECRET);
  const result = sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "15m",
  });
  console.log("---result---", result);
  return sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "7d",
  });
};

export const createRefreshToken = (user: User) => {
  return sign({ userId: user.id }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "7d",
  });
};
