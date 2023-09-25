import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { readFileSync } from 'fs';

const typeDefs = readFileSync("./schema.graphql", {encoding: "utf-8"});

//for now the queries are to be kept here
const server = new ApolloServer({
    typeDefs,
    resolvers,
});

const { url } = await startStandaloneServer( server, {
    listen: {port: 4000},
});

console.log(`🚀  Server ready at: ${url}`);