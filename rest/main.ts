/*
 * This file is a part of HartexBoat.
 *
 * HartexBoat, a Discord Bot
 * Copyright (C) <year>  <name of author>
 *
 * HartexBoat is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * HartexBoat is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with HartexBoat.  If not, see <https://www.gnu.org/licenses/>.
 */

import { RequestMethod } from "../base/lib.ts";

import { BASE_URL } from "../base/discord.ts";

import { restManager } from "../base/rest.ts";

import * as logger from "../base/logger.ts";

import {
    authorizationVariables,
    initializeEnvironments,
    restVariables,
    startupVariables
} from "../env/lib.ts";

await logger.initializeLoggerEnvironment();
initializeEnvironments();

const restServer = Deno.listen({ port: restVariables.restPort! });
logger.debug(`HTTP REST server for Discord API requests is started`);

for await (const connection of restServer) {
    handleRestConnection(connection);
}

async function handleRestConnection(connection: Deno.Conn) {
    const upgradedHttpConnection = Deno.serveHttp(connection);

    for await (const requestEvent of upgradedHttpConnection) {
        if (
            !authorizationVariables.restAuthorizationKey ||
            authorizationVariables.restAuthorizationKey !== requestEvent.request.headers.get("AUTHORIZATION")
        ) {
            return requestEvent
                .respondWith(
                    new Response(
                        JSON.stringify({
                            code: 401,
                            errorIdentifier: "ERROR_HTTP401_UNAUTHORIZED",
                            message: "invalid authorization key provided in the `AUTHORIZATION` header; please double check and ensure that it is the correct authorization key"
                        }),
                        {
                            status: 401,
                            statusText: "Unauthorized"
                        },
                    )
                );
        }

        const requestJson = (await requestEvent.request.json());

        try {
            const requestResult = (await restManager.runMethod(
                restManager,
                requestEvent.request.method as RequestMethod,
                `${BASE_URL}${requestEvent.request.url.substring(`http://localhost:${restVariables.restPort}`.length)}`,
                requestJson,
            ));

            if (requestResult) {
                requestEvent.respondWith(
                    new Response(undefined, {
                        status: 200,
                    }),
                );
            }
        }
        catch (error) {
            logger.error(`an error occurred in REST server: ${error}`);

            // TODO: improve error reporting here
            requestEvent.respondWith(
                new Response(JSON.stringify(error), {
                    status: error.code,
                }),
            );
        }
    }
}
