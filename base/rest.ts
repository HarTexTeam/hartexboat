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
    GatewayIntents,
    GatewayOpcodes,
} from "./discord.ts";

import * as logger from "./logger.ts";

import {
    authorizationVariables,
    initializeEnvironments,
    restVariables,
    startupVariables,
} from "../env/lib.ts";

initializeEnvironments();

export const restManager = createRestManager({
    token: startupVariables.botToken!,
    secretKey: authorizationVariables.restAuthorizationKey,
    customUrl: `http://localhost:${restVariables.restPort}`,
});

export const gatewayIntents: (keyof typeof GatewayIntents)[] = [
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

export const gatewayManager = createGatewayManager({
    handleDiscordPayload: async function (_, data, shardId) {
        if (!data.t) return;

        await fetch(`http://localhost:${restVariables.eventHandlerPort}`, {
            headers: {
                Authorization: gatewayManager.secretKey,
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
    identify: async function (gatewayManager, shardId, maxShards) {
        logger.debug(`shard ${shardId} is identifying with the Discord gateway`);

        const oldShard = gatewayManager.shards.get(shardId);
        if (oldShard) {
            gatewayManager.closeWS(oldShard.ws, 3065, "re-identifying of old shard");
            clearInterval(oldShard.heartbeat.intervalId);
        }

        const socket = gatewayManager.createShard(gatewayManager, shardId);
        gatewayManager.shards.set(
            shardId,
            {
                id: shardId,
                ws: socket,
                resumeInterval: 0,
                sessionId: "",
                previousSequenceNumber: 0,
                resuming: false,
                ready: false,
                unavailableGuildIds: new Set(),
                heartbeat: {
                    lastSentAt: 0,
                    lastReceivedAt: 0,
                    acknowledged: false,
                    keepAlive: false,
                    interval: 0,
                    intervalId: 0,
                },
                queue: [],
                processingQueue: false,
                queueStartedAt: Date.now(),
                queueCounter: 0,
            },
        );

        socket.onopen = () => {
            gatewayManager.sendShardMessage(
                gatewayManager,
                shardId,
                {
                    op: GatewayOpcodes.Identify,
                    d: {
                        token: gatewayManager.token,
                        compress: gatewayManager.compress,
                        properties: {
                            $os: gatewayManager.$os,
                            $browser: gatewayManager.$browser,
                            $device: gatewayManager.$device,
                        },
                        intents: gatewayManager.intents,
                        shard: [shardId, maxShards],
                        presence: {
                            since: null,
                            activities: [
                                {
                                    name: `development | shard ${shardId}`,
                                    type: 3,
                                },
                            ],
                            status: "online",
                            afk: false,
                        },
                    },
                },
                true,
            );
        };
    },
    intents: gatewayIntents,
    lastShardId: result.shards,
    maxConcurrency: result.sessionStartLimit.maxConcurrency,
    maxShards: result.shards,
    secretKey: authorizationVariables.eventHandlerAuthorizationKey,
    sessionStartLimitTotal: result.sessionStartLimit.total,
    sessionStartLimitRemaining: result.sessionStartLimit.remaining,
    sessionStartLimitResetAfter: result.sessionStartLimit.resetAfter,
    shardsRecommended: result.shards,
    token: startupVariables.botToken!,
});
