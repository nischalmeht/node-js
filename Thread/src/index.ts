import express from "express";
import type { Request, Response } from "express"; // 👈 Type-only import
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
async function init(){
  const app = express();

const server = new ApolloServer({
  typeDefs:`
  type Query {
  hello String
  }
  `,
  resolvers:{
    Query:{
      hello:()=>{}
    }
  },
});
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Server is up and running" });
});
await server.start()

app.use('/graphql',expressMiddleware(server))
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
}
init()
