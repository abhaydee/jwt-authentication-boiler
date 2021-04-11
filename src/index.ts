import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./UserResolver";
import { createConnection } from "typeorm";
import {verify} from "jsonwebtoken"
import CookieParser from "cookie-parser"
import "dotenv/config";
import { User } from "./entity/User";
import { createAccessToken } from "./auth";
(async () => {
  const app = express();
  app.use(CookieParser())
  app.get("/", (_req, res) => {
    res.send("Hello");
  });
  app.post("/refresh_token",async (req,res)=>{
    const token=req.cookies;
    if(!token){
      return res.send({ok:false,accessToken:""})
    }
    let payload:any=null
    try{
      payload=verify(token,process.env.REFRESH_TOKEN_SECRET!)
    }
    catch(err){
      console.log("hitting", token,err);
      return res.send({ok:false,accessToken:""})
    }

    //token is valid
    const user=await User.findOne({id:payload.userId})
    if(!user){
      return res.send({ok:false,accessToken:""})
    }
    return res.send({ok:true,accessToken:createAccessToken(user)})

  })
  await createConnection();
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
    }),
    context: ({ req, res }) => ({ req, res }),
  });
  apolloServer.applyMiddleware({ app });
  app.listen(4000, () => {
    console.log("express server started");
  });
})();

// import {createConnection} from "typeorm";
// import {User} from "./entity/User";

// createConnection().then(async connection => {

//     console.log("Inserting a new user into the database...");
//     const user = new User();
//     user.firstName = "Timber";
//     user.lastName = "Saw";
//     user.age = 25;
//     await connection.manager.save(user);
//     console.log("Saved a new user with id: " + user.id);

//     console.log("Loading users from the database...");
//     const users = await connection.manager.find(User);
//     console.log("Loaded users: ", users);

//     console.log("Here you can setup and run express/koa/any other framework.");

// }).catch(error => console.log(error));
