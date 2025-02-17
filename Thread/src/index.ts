import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";

async function init() {
  const app = express();

  // ✅ Ensure JSON middleware is applied before Apollo middleware
  app.use(express.json());

  // ✅ Define GraphQL schema properly
  const typeDefs = `
    type Query {
      hello: String
      say(name: String!): String
    }
  `;

  // ✅ Correct resolver structure
  const resolvers = {
    Query: {
      hello: () => `Hello sir`,
      say: (_: any, { name }: { name: string }) => `Hey ${name}, how are you?`,
    },
  };

  const server = new ApolloServer({ typeDefs, resolvers });

  await server.start();

  // ✅ Health check route
  app.get("/", (req, res) => {
    res.json({ message: "Server is up and running" });
  });

  // ✅ Use Apollo middleware after JSON middleware
  app.use("/graphql", expressMiddleware(server));

  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
}

// ✅ Execute init function
init().catch((error) => {
  console.error("Error starting the server:", error);
});
