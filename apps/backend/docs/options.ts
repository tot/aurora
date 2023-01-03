import {
    ChainTransactionExample,
    ImportTransactionExample,
    UserExample,
    WalletExample
} from "./schemas/apiSchema";
import jsonSchema from "./schemas/json-schema.json";

export const swaggerOptions = {
    openapi: {
        openapi: "3.0.3",
        info: {
            title: "Aurora API Docs",
            description: "API Documentation for Aurora",
            version: "0.1.0"
        },
        servers: [
            {
                url: "http://127.0.0.1:8000"
            }
        ],
        tags: [{ name: "users", description: "User specific endpoints" }],
        components: {
            schemas: {
                User: {
                    ...jsonSchema.definitions.User,
                    example: UserExample
                },
                Wallet: {
                    ...jsonSchema.definitions.Wallet,
                    example: WalletExample
                },
                ImportTransaction: {
                    ...jsonSchema.definitions.ImportTransaction,
                    example: ImportTransactionExample
                },
                ChainTransaction: {
                    ...jsonSchema.definitions.ChainTransaction,
                    example: ChainTransactionExample
                }
            }
        }
    },
    hideUntagged: true
};

export const swaggerUIOptions = {
    routePrefix: "/docs",
    uiConfig: {
        docExpansion: "list",
        deepLinking: false
    },
    staticCSP: true,
    transformSpecificationClone: true,
    exposeRoute: true
};
