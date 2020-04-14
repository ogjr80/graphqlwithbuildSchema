const express = require('express');
const bodyParser = require('body-parser');
const graphQLHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const _ = require('lodash');
const mongoose = require('mongoose');
const Event =  require('./models/event');




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
      return Event.find().then(events => {
        return events.map(event => {
          return {...event._doc};
        })
      }).catch(err => {
        throw err;
      })
    },
    createEvent: (args) => {
      const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date(args.eventInput.date)
      });
     return event.save().then(result => {
        console.log(result);
        return {...result._doc}
      }).catch(err => {
        console.log(err);
        throw err;
      });
      return event;
    }
  },
  graphiql: true
  })

);


// mongoose.connect('mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@mgdbclust-lp87j.mongodb.net/eventdb?retryWrites=true&w=majority').then(()=> {
//   app.listen(3000);
// }).catch(err => {
//   console.log(err);
// });


mongoose.connect('mongodb://localhost:27017/eventdb', { useNewUrlParser: true },function(){
  console.log('database connection successfull');
}).then(()=> {
  app.listen(3000, function(){
    console.log('server now running on port 3000');
  })
}).catch(() => console.log(err));
//
// app.listen(3000, function(){
//   console.log('server running on port 3000');
// })
