import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { User } from "./entity/User";
import { hash, compare } from "bcryptjs";
import { MyContext } from "./Mycontext";
import { createAccessToken, createRefreshToken } from "./auth";

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
}
@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return "hi!";
  }
  @Query(() => [User])
  users() {
    return User.find();
  }
  @Query(() => String)
  bye() {
    return "bye";
  }
  @Mutation(() => LoginResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { res }: MyContext
  ): Promise<LoginResponse> {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error("User not found");
    }
    const valid = await compare(password, user.password);
    if (!valid) {
      throw new Error("Bad password");
    }
    res.cookie("jid", createRefreshToken(user), {
      httpOnly: true,
    });
    return {
      accessToken: createAccessToken(user),
    };
  }
  @Mutation(() => Boolean)
  async register(
    @Arg("email") email: string,
    @Arg("password") password: string
  ) {
    const hashedPassword = await hash(password, 12);
    try {
      await User.insert({
        email,
        password: hashedPassword,
      });
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
