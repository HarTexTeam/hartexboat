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
    createGatewayManager,
    createRestManager,
    endpoints,
    GatewayIntents
} from "../base/discord.ts";

import {
    authorizationVariables,
    initializeEnvironments,
    restVariables,
    startupVariables
} from "../env/lib.ts";

import { initializeLoggerEnvironment } from "../base/logger.ts";

await initializeLoggerEnvironment();
initializeEnvironments();

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

const restManager = createRestManager({
    token: startupVariables.botToken!,
    secretKey: authorizationVariables.restAuthorizationKey,
    customUrl: `http://localhost:${restVariables.restPort}`,
});

const result = await restManager.runMethod(restManager, "get", endpoints.GATEWAY_BOT).then((
    res,
) => ({
    url: res.url,
    shards: res.shards,
    sessionStartLimit: {
        total: res.session_start_limit.total,
        remaining: res.session_start_limit.remaining,
        resetAfter: res.session_start_limit.reset_after,
        maxConcurrency: res.session_start_limit.max_concurrency,
    },
}));

const gateway = createGatewayManager({
    secretKey: authorizationVariables.eventHandlerAuthorizationKey,
    token: startupVariables.botToken!,
    intents: gatewayIntents,
    shardsRecommended: result.shards,
    sessionStartLimitTotal: result.sessionStartLimit.total,
    sessionStartLimitRemaining: result.sessionStartLimit.remaining,
    sessionStartLimitResetAfter: result.sessionStartLimit.resetAfter,
    maxConcurrency: result.sessionStartLimit.maxConcurrency,
    maxShards: result.shards,
    lastShardId: result.shards,

    handleDiscordPayload: async function (_, data, shardId) {
        if (!data.t) return;

        await fetch(`http://localhost:${restVariables.eventHandlerPort}`, {
            headers: {
                Authorization: gateway.secretKey,
            },
            method: "POST",
            body: JSON.stringify({
                shardId,
                data,
            }),
        })
            .then((res) => res.text())
            .catch(() => null);
    },
});

gateway.spawnShards(gateway);
