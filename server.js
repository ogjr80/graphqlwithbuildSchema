const express = require('express');
const bodyParser = require('body-parser');
const graphQLHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const _ = require('lodash');


const events = [];

const app = express();
app.use(bodyParser.json());

app.use('/graphql', graphQLHTTP({
  schema: buildSchema(`
    type Event {
      _id: ID!
      title: String!
      description: String!
      price: Float!
      date : String!
    }


    input EventInput{
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    type rootQuery {
       events: [Event!]!
    }

    type rootMutation {
       createEvent(eventInput: EventInput): Event
    }

    schema {
      query: rootQuery
      mutation:rootMutation
    }
`),
  rootValue: {
    events: () => {
      return events;
    },
    createEvent: (args) => {
      const event = {
        _id : Math.random().toString(),
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: new Date().toISOString()
      }

      events.push(event);
      return event;
    }
  },
  graphiql: true
}))

app.listen(3000, function(){
  console.log('server running on port 3000');
});
