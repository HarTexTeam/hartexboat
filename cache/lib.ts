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
    BotWithPostgresCache,
    createPostgresCacheRepositories,
} from "./cache.ts";

export * from "./entities/mod.ts";
export * from "./entity.ts";
export * from "./repository.ts";

import { Bot } from "../base/discord.ts";

export function extendBotWithPostgresCache(bot: Bot): BotWithPostgresCache {
    const botWithPostgresCache = bot as BotWithPostgresCache;
    botWithPostgresCache.postgresCache = createPostgresCacheRepositories();

    return botWithPostgresCache;
}
