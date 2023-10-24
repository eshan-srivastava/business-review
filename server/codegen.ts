import type { CodegenConfig } from "@graphql-codegen/cli"

const config: CodegenConfig = {
    schema: "./src/test_schema.graphql",
    generates: {
        "./src/types.ts": {
            plugins: ["typescript", "typescript-resolvers"],
            // config: {

            // }
        },
    },
};

export default config;