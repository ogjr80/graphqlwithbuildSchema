const express = require('express');
const bodyParser = require('body-parser');
const graphQLHTTP = require('express-graphql');
const { buildSchema } = require('graphql');


const app = express();
app.use(bodyParser.json());
app.use('/graphql', graphQLHTTP({
  schema: buildSchema(`

    type rootQuery {
       events: [String!]!
    }

    type rootMutation {
       createEvent(name: String): String
    }

    schema {
      query: rootQuery
      mutation:rootMutation
    }
`),
  rootValue: {
    events: () => {
      return ['Cooking', 'All Night Coding','Sailing'];
    },
    createEvent: (args) => {
      const eventName = args.name;
      return eventName; s
    }
  },
  graphiql: true
}))

app.listen(3000, function(){
  console.log('server running on port 3000');
});
