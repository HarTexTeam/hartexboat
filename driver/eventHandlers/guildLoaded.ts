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

import { leaveGuild } from "../../base/discord.ts";

import { detaVariables } from "../../env/lib.ts";

import { bot } from "../main.ts";

export function setGuildLoadedEventHandler() {
    bot.events.guildLoaded = async (bot, guild) => {
        logger.debug(`new guild loaded with id ${guild.id}; checking whether the guild is whitelisted`);

        const response = await fetch(`https://database.deta.sh/v1/${detaVariables.detaProjectId}/Whitelists/items/${guild.id}`, {
            headers: {
                "Content-Type": "application/json",
                "X-API-Key": detaVariables.detaProjectKey!,
            },
            method: "GET",
        });

        if (response.status === 404) {
            logger.debug("guild is not whitelisted, leaving guild");
            await leaveGuild(bot, guild.id);

            return;
        }

        logger.debug("guild is whitelisted");
    };
}
