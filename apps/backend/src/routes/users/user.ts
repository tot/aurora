import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { logAndSendReply } from "@lib/logger";
import HttpStatus from "@lib/types/httpStatus";
import { UserIndexSchema } from "@lib/types/jsonObjects";
import {
    UserRequestParams,
    UserRequestQuery,
    UsersPutRequestBody
} from "@lib/types/routeParams";

const userRoute = (
    server: FastifyInstance,
    { get: getSchema, put: putSchema }: UserIndexSchema,
    done: () => void
) => {
    const { prisma, log } = server;

    server.get(
        "/",
        getSchema,
        async (request: FastifyRequest, reply: FastifyReply) => {
            const { id, email } = request.query as UserRequestQuery;
            if (!id && !email)
                logAndSendReply(
                    log.error,
                    reply,
                    HttpStatus.BAD_REQUEST,
                    "Missing id or email parameter"
                );

            try {
                const user = await prisma.user.findUnique({
                    where: id ? { id } : { email }
                });

                reply.send(user);
            } catch (e) {
                if (e instanceof PrismaClientKnownRequestError) {
                    log.fatal(e);
                    reply
                        .code(HttpStatus.INTERNAL_SERVER_ERROR)
                        .send("Server error");
                }
                logAndSendReply(
                    log.error,
                    reply,
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Couldn't get user"
                );
            }
        }
    );

    // TODO: PUT /users/:userId or :email
    server.put(
        "/",
        putSchema,
        async (request: FastifyRequest, reply: FastifyReply) => {
            const { userId } = request.params as UserRequestParams;
            const body = request.body as UsersPutRequestBody;

            if (
                !body ||
                !(
                    body.apiKey &&
                    body.email &&
                    body.exchangeAPIKeys &&
                    body.firstName &&
                    body.lastName &&
                    body.processorAPIKeys
                )
            ) {
                logAndSendReply(
                    log.error,
                    reply,
                    HttpStatus.BAD_REQUEST,
                    "Missing field(s) to update."
                );
            }

            try {
                await prisma.user.update({
                    where: { id: userId },
                    data: {
                        ...body
                    }
                });

                reply.code(HttpStatus.NO_CONTENT).send();
            } catch (e) {
                if (e instanceof PrismaClientKnownRequestError) {
                    log.fatal(e);
                    reply
                        .code(HttpStatus.INTERNAL_SERVER_ERROR)
                        .send("Server error");
                }

                logAndSendReply(
                    log.error,
                    reply,
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Couldn't create user."
                );
            }
        }
    );

    done();
};

export default userRoute;
