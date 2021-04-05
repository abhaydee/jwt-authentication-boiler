import { verify } from "jsonwebtoken";
import { MiddlewareFn } from "type-graphql";
import { MyContext } from "./Mycontext";
import "dotenv/config";
export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  const authorization = context.req.headers["authorization"];
  if (!authorization) {
    throw new Error("not authenticated");
  }
  try {
    const token = authorization.split(" ")[1];
    verify(token, process.env.ACCESS_TOKEN_SECRET!);
  } catch (error) {
    console.log("the error", error);
  }
  return next();
};
