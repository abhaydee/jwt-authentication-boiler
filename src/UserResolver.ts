import { Arg, Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return "hi!";
  }
  @Mutation()
  register(@Arg("email") email: String, @Arg("password") password: String) {
    return;
  }
}
