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

import * as logger from "../../base/logger.ts";

import { guildMembersChunkEventHandler } from "./rawEventHandlers/guildMembersChunk.ts";

import { bot } from "../main.ts";

export function setRawEventHandler() {
    bot.events.raw = async (_denoBot, payload, _shardId) => {
        logger.debug(`received event of type $${payload.t}`);

        if (payload.t === "GUILD_MEMBERS_CHUNK") {
            await guildMembersChunkEventHandler(payload);
        }
    }
}
