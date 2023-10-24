import { readFileSync } from 'fs';
import { ApolloServer } from '@apollo/server';
import neo4j from "neo4j-driver";
import { startStandaloneServer } from '@apollo/server/standalone';
import { Neo4jGraphQL, Neo4jGraphQLConstructor } from "@neo4j/graphql";
// import { resolvers } from './resolvers';
// import { resolvers } from './typesold';
import { error } from 'console';

const typeDefs = readFileSync(`${__dirname}/test_schema.graphql`, {encoding: "utf-8"});

//for now the queries are to be kept here

const driver = neo4j.driver(
    "bolt://localhost:7687",
    neo4j.auth.basic("neo4j", "biz12345")
);

const neoSchema = new Neo4jGraphQL({ 
    typeDefs,
    driver,
    debug: true,
    features: {
        authorization: {
            key: "secret1123",
        }
    }
});

type User = {
    userId: String,
    name: String,
    reviews: String[],
}

neoSchema.getSchema().then(async (schema) => {
    try{
        const server = new ApolloServer({
            schema: schema,
        });
        try{
            const { url } = await startStandaloneServer( server, {
                listen: {port: 4000},
                context: async ({ req }) => ({
                    token: req.headers.authorization,
                })
            });   
            console.log(`🚀  Server ready at: ${url}`);
        }
        catch(err){
            console.log("error in starting apollo standalone server promise");
            console.log(err);
            throw err;
        }
    }
    catch(err){
        console.log("error in neoschema getschema promise");
        console.log(err);
        throw err;
    }
}).catch(error)

//for now the current token that can be used is stored in ENV
