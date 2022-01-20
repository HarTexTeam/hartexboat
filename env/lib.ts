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

import "https://deno.land/x/dotenv@v3.1.0/load.ts";

import * as logger from "../base/logger.ts";

export interface AuthorizationVariables {
    eventHandlerAuthorizationKey: string | undefined;
    restAuthorizationKey: string | undefined;
}

export interface DatabaseVariables {
    pgsqlCacheDbCredentials: string | undefined;
}

export interface RestVariables {
    eventHandlerPort: number | undefined;
    restPort: number | undefined;
}

export interface StartupVariables {
    applicationId: bigint | undefined;
    botToken: string | undefined;
}

export let authorizationVariables: AuthorizationVariables;
export let databaseVariables: DatabaseVariables;
export let restVariables: RestVariables;
export let startupVariables: StartupVariables;

export function createEnvironments() {
    logger.debug("creating environment variables for later use")

    authorizationVariables = {
        eventHandlerAuthorizationKey: Deno.env.get("EVENT_HANDLER_AUTHORIZATION_KEY"),
        restAuthorizationKey: Deno.env.get("REST_AUTHORIZATION_KEY"),
    } as AuthorizationVariables;

    databaseVariables = {
        pgsqlCacheDbCredentials: Deno.env.get("PGSQL_CACHEDB_CREDENTIALS"),
    } as DatabaseVariables;

    restVariables = {
        eventHandlerPort: Number(Deno.env.get("EVENT_HANDLER_PORT")!),
        restPort: Number(Deno.env.get("REST_PORT")!),
    } as RestVariables;

    startupVariables = {
        applicationId: BigInt(Deno.env.get("APPLICATION_ID")!),
        botToken: Deno.env.get("BOT_TOKEN")!
    } as StartupVariables;
}
