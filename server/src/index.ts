import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { readFileSync } from 'fs';
import { resolvers } from './resolvers';
import { Neo4jGraphQL } from "@neo4j/graphql";
import neo4j from "neo4j-driver";

const typeDefs = readFileSync("./schema.graphql", {encoding: "utf-8"});

//for now the queries are to be kept here

const driver = neo4j.driver(
    "bolt://localhost:7687",
    neo4j.auth.basic("neo4j", "letmein")
);

const neoSchema = new Neo4jGraphQL({ typeDefs, resolvers, driver });

neoSchema.getSchema().then(async (schema) => {
    const server = new ApolloServer({
        schema: schema,
    });
    const { url } = await startStandaloneServer( server, {
        listen: {port: 4000},
    });
    
    console.log(`🚀  Server ready at: ${url}`);
})

