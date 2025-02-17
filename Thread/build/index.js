"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        // ✅ Ensure JSON middleware is applied before Apollo middleware
        app.use(express_1.default.json());
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
                say: (_, { name }) => `Hey ${name}, how are you?`,
            },
        };
        const server = new server_1.ApolloServer({ typeDefs, resolvers });
        yield server.start();
        // ✅ Health check route
        app.get("/", (req, res) => {
            res.json({ message: "Server is up and running" });
        });
        // ✅ Use Apollo middleware after JSON middleware
        app.use("/graphql", (0, express4_1.expressMiddleware)(server));
        const PORT = 3000;
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on http://localhost:${PORT}`);
        });
    });
}
// ✅ Execute init function
init().catch((error) => {
    console.error("Error starting the server:", error);
});
