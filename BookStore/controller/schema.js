
const typeDefs = `#graphql
  type Query {
    hello: String
    wow: String
  }
`;

const typeDefs2 = `#graphql
  type User {
    _id: String!
    author: String!,
    year:String
  }
  type User {
    _id: String!
    author: String!
    year: String
  }
  type Query {
    hello2: String
    wow2: String,
    user:[User],
    course:User
    course(id: ID!): User
    # getUser(id: ID!): User
  }
`;
const getCoursebyId=(parent,arg)=>{
    console.log(arg.id)

}

module.exports = [typeDefs,typeDefs2,getCoursebyId];
// module.exports=typeDefs2