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

import {
    Bot,
    createBot,
    createRestManager,
    GatewayIntents,
    GatewayPayload,
    SnakeCasedPropertiesDeep
} from "../base/discord.ts";

import * as logger from "../base/logger.ts";

import {
    authorizationVariables,
    initializeEnvironments,
    restVariables,
    startupVariables
} from "../env/lib.ts";

import {
    initializeLoggerEnvironment
} from "../base/logger.ts";

const gatewayIntents: (keyof typeof GatewayIntents)[] = [
    "DirectMessageReactions",
    "DirectMessageTyping",
    "DirectMessages",
    "GuildBans",
    "GuildEmojis",
    "GuildIntegrations",
    "GuildInvites",
    "GuildMembers",
    "GuildMessageReactions",
    "GuildMessageTyping",
    "GuildMessages",
    "GuildPresences",
    "GuildVoiceStates",
    "GuildWebhooks",
    "Guilds",
];

await initializeLoggerEnvironment();

logger.debug("bot version: 0.0.0");

initializeEnvironments();

const restManager = createRestManager({
    token: startupVariables.botToken!,
    secretKey: authorizationVariables.restAuthorizationKey,
    customUrl: `http://localhost:${restVariables.restPort}`,
});

export let bot: Bot;
bot = createBot({
    applicationId: startupVariables.applicationId,
    botId: startupVariables.applicationId!,
    events: {},
    intents: gatewayIntents,
    token: startupVariables.botToken!,
});
bot.rest = restManager;

const restServer = Deno.listen({ port: restVariables.eventHandlerPort! });
logger.debug(`HTTP REST server for event handler requests is started`);

for await (const connection of restServer) {
    handleRestConnection(connection);
}

async function handleRestConnection(connection: Deno.Conn) {
    const upgradedHttpConnection = Deno.serveHttp(connection);

    for await (const requestEvent of upgradedHttpConnection) {
        if (
            !authorizationVariables.eventHandlerAuthorizationKey ||
            authorizationVariables.eventHandlerAuthorizationKey !== requestEvent.request.headers.get("AUTHORIZATION")
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

        if (requestEvent.request.method !== "POST") {
            return requestEvent
                .respondWith(
                    new Response(
                        JSON.stringify({
                            code: 405,
                            errorIdentifier: "ERROR_HTTP401_METHOD_NOT_ALLOWED",
                            message: "only the `POST` method is allowed for this server"
                        }),
                        {
                            status: 405,
                            statusText: "Method Not Allowed"
                        },
                    )
                );
        }

        const json = (await requestEvent.request.json()) as {
            data: SnakeCasedPropertiesDeep<GatewayPayload>;
            shardId: number;
        };

        bot.events.raw(bot, json.data, json.shardId);

        requestEvent.respondWith(
            new Response(
                JSON.stringify({
                    code: 200,
                    message: "ok"
                }),
                {
                    status: 200,
                    statusText: "OK"
                },
            ),
        );
    }
}
