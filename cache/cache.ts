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

import { Bot } from "../base/discord.ts";
import * as postgres from "../base/postgres.ts";

import { CurrentUserRepository } from "./entities/currentUser.ts";

export type BotWithPostgresCache = Bot & PostgresCache;

export interface PostgresCache extends Bot {
    postgresCache: PostgresCacheRepositories;
}

export interface PostgresCacheRepositories {
    currentUserRepository: CurrentUserRepository;
}

export function createPostgresCacheRepositories(): PostgresCacheRepositories {
    return {
        currentUserRepository: { } as CurrentUserRepository,
    } as PostgresCacheRepositories;
}
