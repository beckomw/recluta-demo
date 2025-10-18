const express = require('express'); 
const { graphqlHTTP } = require('express-graphql'); 
const { buildSchema } = require('graphql'); 

// This is where the Schema would go 
const schema = buildSchema(`
  type Query {
    hello:String 
  }
`)



// The root provides a resolver function for each API endpoint 
const root = {
  hello: () => {
    return 'Hello world!'; 
  }, 


}; 



const app = express(); 
app.use('/graphql', graphqlHTTP({
    schema: schema, 
    rootValue: root, 
    graphiql: true, 
})); 


app.listen(4000, () => console.log('Now browse to localhost:4000/graphql')); 







