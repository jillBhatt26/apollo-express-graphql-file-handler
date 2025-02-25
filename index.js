require('dotenv/config');
const fs = require('fs');
const path = require('path');
const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLString
} = require('graphql');
const { GraphQLUpload, graphqlUploadExpress } = require('graphql-upload');
const { finished } = require('stream/promises');
const { v4: uuidV4 } = require('uuid');

const app = express();
const pathToUploadsDir = path.resolve(__dirname, 'uploads');
const PORT = parseInt(process.env.PORT ?? 5000);

const FileType = new GraphQLObjectType({
    name: 'FileType',
    fields: {
        filename: {
            type: new GraphQLNonNull(GraphQLString)
        },
        mimetype: {
            type: new GraphQLNonNull(GraphQLString)
        },
        encoding: {
            type: new GraphQLNonNull(GraphQLString)
        }
    }
});

const query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        hello: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: () => `Hello World!!`
        }
    }
});

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        uploadFile: {
            type: FileType,
            args: {
                file: { type: GraphQLUpload }
            },
            resolve: async (parent, { file }) => {
                const { createReadStream, filename, mimetype, encoding } =
                    await file;

                const ext = path.extname(filename);

                const uploadFileDest = path.resolve(
                    pathToUploadsDir,
                    `${uuidV4()}${ext}`
                );

                const out = fs.createWriteStream(uploadFileDest);

                createReadStream().pipe(out);
                await finished(out);

                return { filename, mimetype, encoding };
            }
        }
    }
});

const schema = new GraphQLSchema({
    query,
    mutation,
    types: [FileType],
    scalars: {
        Upload: GraphQLUpload
    }
});

app.listen(PORT, async () => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    const apolloServer = new ApolloServer({
        schema,
        introspection: true,
        csrfPrevention: true,
        cache: 'bounded'
    });

    await apolloServer.start();

    app.use(graphqlUploadExpress());

    app.use('/graphql', expressMiddleware(apolloServer));

    console.log(`Server live on port: ${PORT}...🚀🚀🚀`);
});
