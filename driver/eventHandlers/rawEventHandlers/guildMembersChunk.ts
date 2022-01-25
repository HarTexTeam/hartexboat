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

import { 
    GatewayPayload, 
    GuildMembersChunk,
    SnakeCasedPropertiesDeep, 
} from "../../../base/discord.ts";

import * as logger from "../../../base/logger.ts";

import { fromMember } from "../../../cache/entities/member.ts";

import { bot } from "../../main.ts";

type DiscordGuildMembersChunk = SnakeCasedPropertiesDeep<GuildMembersChunk>;

export async function guildMembersChunkEventHandler(payload: GatewayPayload) {
    const chunk = payload.d as DiscordGuildMembersChunk;

    logger.debug(`received guild members of guild ${chunk.guild_id}`);

    await bot.detaCache.memberRepository.upsertMany(chunk.members.map(
        member => fromMember({
            avatar: member.avatar,
            communicationDisabledUntil: member.communication_disabled_until,
            deaf: member.deaf,
            joinedAt: member.joined_at,
            mute: member.mute,
            nick: member.nick,
            pending: member.pending,
            permissions: member.permissions,
            premiumSince: member.premium_since,
            roles: member.roles,
            user: member.user
        })
    ));
}
