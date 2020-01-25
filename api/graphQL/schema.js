const graphql = require('graphql');
const {GraphQLObjectType, GraphQLString, GraphQLSchema, buildSchema} = graphql;
const joinMonster = require('join-monster');

const { Client } = require('pg');

const client = new Client({
  host: "localhost",
  user: "toggl",
  password: "{YOUR_POSTGRES_PASSWORD}",
  database: "{YOUR_POSTGRES_DATABASE}"
})
client.connect();

const _ = require('lodash');

//dummy data
const users = [
    {name: 'John Doe', type: 'SUV', id: '0'},
    {name: 'Dhen Padilla', type: 'Hatchback', id: '1'},
    {name: 'Jane Smith', type: 'Sedan', id: '2'}
];

const User = new GraphQLObjectType({
    name: 'User', // Name of the object type
    fields: () => ({
        // Use a function as fields could have multiple/various types
        id: {type: GraphQLString},
        first_name: {type: GraphQLString},
        last_name: {type: GraphQLString},
        email: {type: GraphQLString},
        password: {type: GraphQLString}
    })
});

User._typeConfig = {
    sqlTable: 'user',
    uniqueKey: 'id',
}

// Entry point for our graph queries
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        // Name of the query used
        // when requested from graphiql
        // i.e: 'user' is one query you can ask
        users: {
            type: new graphql.GraphQLList(User), 
            resolve: (parent, args, context, resolveInfo) => {
                // This is where we can place the code that
                // gets data from the DB or APIs in real scenario
                // Use join-monster for translating GraphQL -> SQL
                return joinMonster.default(resolveInfo, {}, sql => {
                    return client.query(sql)
                })
            }
        },
        user: {
            type: User,
            args: { id: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) } },
            where: (userTable, args, context) => `${userTable}.id = ${args.id}`,
            resolve: (parent, args, context, resolveInfo) => {
                return joinMonster.default(resolveInfo, {}, sql => {
                  return client.query(sql)
                })
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