/*
 * This file is a part of HartexBoat.
 *
 * HartexBoat, a Discord Bot
 * Copyright (C) 2021 HarTex Community
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

import { getItemWithKey } from "../../base/deta.ts";

import * as logger from "../../base/logger.ts";

import { GatewayOpcodes, leaveGuild } from "../../base/discord.ts";

import { fromGuild } from "../../cache/entities/guild.ts";

import { bot } from "../main.ts";

export function setGuildLoadedEventHandler() {
    bot.events.guildLoaded = async (denoBot, guild) => {
        logger.debug(`new guild loaded with id ${guild.id}; checking whether the guild is whitelisted`);

        const response = await getItemWithKey("Whitelists", `${guild.id}`);

        if (response.status === 404) {
            logger.debug("guild is not whitelisted, leaving guild");
            await leaveGuild(denoBot, guild.id);

            return;
        }

        logger.debug(`guild ${guild.id} is whitelisted`);

        const guildEntity = fromGuild(guild);
        await bot.detaCache.guildRepository.upsert(guildEntity);

        logger.debug(`requesting guild members of guild ${guild.id}`);

        for (const [_, shard] of bot.gateway.shards) {
            logger.debug(`iteration ${shard.id}`);

            const nonce = `${guild.id}-requestguildmembers-${Date.now()}`;

            bot.gateway.sendShardMessage(
                bot.gateway,
                shard.id,
                {
                    op: GatewayOpcodes.RequestGuildMembers,
                    d: {
                        guild_id: guild.id.toString(),
                        query: "",
                        presences: false,
                        limit: 0,
                        nonce,
                    },
                },
                true,
            );
        }
    };
}
