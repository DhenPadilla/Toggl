const graphql = require('graphql');
const {GraphQLObjectType, GraphQLString, GraphQLSchema, buildSchema} = graphql;

const _ = require('lodash');

//dummy data
const users = [
    {name: 'John Doe', type: 'SUV', id: '0'},
    {name: 'Dhen Padilla', type: 'Hatchback', id: '1'},
    {name: 'Jane Smith', type: 'Sedan', id: '2'}
];

const UserType = new GraphQLObjectType({
    name: 'User', // Name of the object type
    fields: () => ({
        // Use a function as fields could have multiple/various types
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        type: {type: GraphQLString},
    })
});

// Entry point for our graph queries
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        // Name of the query used
        // when requested from graphiql
        // i.e: 'user' is one query you can ask
        user: {
            type: UserType, 
            args: {id: {type: GraphQLString}},
            resolve(parent, args) {
                // This is where we can place the code that
                // gets data from the DB or APIs in real scenario
                return users[args.id];
            }
        },
        hello: {
           type: GraphQLString,
           resolve: () => "Hello world!"
        }
    }
})

/*query for user
    user(id:"2") {
        name,
        type
    }
 */


module.exports = new GraphQLSchema({
    query: RootQuery
});