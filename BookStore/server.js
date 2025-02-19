const express = require('express');
const connectToDb = require('./db/db');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const bookRoutes = require('./routes/book-routes');
const homeRoutes = require('./routes/home-routes');
const authRoutes = require('./routes/auth-routes');
const adminRoutes = require('./routes/admin-routes');
// const {typeDefs,getCoursebyId} = require('./controller/schema'); // Import typeDefs
const axios = require('axios'); // ✅ Import axios

require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
connectToDb();

// Define resolvers


// Start Apollo Server
async function startApolloServer() {
  // const server = new ApolloServer({ typeDefs, resolvers });
  const server = new ApolloServer(
    {
       typeDefs: `
              type User {
                  id: ID!
                  name: String!
                  username: String!
                  email: String!
                  phone: String!
                  website: String!
              }
              type Todo {
                  id: ID!
                  title : String!
                  completed: Boolean
                  user: User
              },
      
              type Query {
                  getTodos: [Todo]
                  getAllUsers: [User]
                  getUser(id: ID!): User
                  getUserTodos(userIds: [ID!]!): [Todo] 
              }
      
          `,
          resolvers: {
            Todo: {
               user: async(todo) =>  (await axios.get(`https://jsonplaceholder.typicode.com/users/${todo.userId}`)).data
            },
            Query: {
              getTodos: async () =>{
                return (await axios.get("https://jsonplaceholder.typicode.com/todos")).data;
              },
              getAllUsers: async () => {
                return (await axios.get("https://jsonplaceholder.typicode.com/users")).data;
              },
              getUser: async (_, { id }) => {
                return (await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)).data;
              },
              getUserTodos: async (_, { userIds }) => {
                const userTodos = [];
      for (let userId of userIds) {
        const todos = await axios.get(`https://jsonplaceholder.typicode.com/todos?userId=${userId}`);
        userTodos.push(...todos.data); // Merge the todos for each user
      }
      return userTodos;
              },
            },
          },
    }
  )
  await server.start();
  
  // ✅ Move GraphQL middleware after initializing the server
  app.use('/graphql', expressMiddleware(server));

  // ✅ Ensure routes are added before starting the server
  app.use('/api/books', bookRoutes);
  app.use('/api', homeRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/admin', adminRoutes);

  app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
  });
}

startApolloServer();
