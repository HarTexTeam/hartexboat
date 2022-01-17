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

import "https://deno.land/x/dotenv@v3.1.0/load.ts";

import * as logger from "../base/logger.ts";

export class AuthorizationVariables {
    public eventHandlerAuthorizationKey: string | undefined;
    public restAuthorizationKey: string | undefined;

    constructor() {
        logger.debug("retrieving environment variables for authorization environment");

        this.eventHandlerAuthorizationKey = Deno.env.get("EVENT_HANDLER_AUTHORIZATION_KEY");
        this.restAuthorizationKey = Deno.env.get("REST_AUTHORIZATION_KEY");
    }
}

export class RestVariables {
    public eventHandlerPort: number | undefined;
    public restPort: number | undefined;

    constructor() {
        logger.debug("retrieving environment variables for rest environment");

        this.eventHandlerPort = Number(Deno.env.get("EVENT_HANDLER_PORT")!);
        this.restPort = Number(Deno.env.get("REST_PORT")!);
    }
}

export class StartupVariables {
    public applicationId: bigint | undefined;
    public botToken: string | undefined;

    constructor() {
        logger.debug("retrieving environment variables for startup environment");

        this.applicationId = BigInt(Deno.env.get("APPLICATION_ID")!);
        this.botToken = Deno.env.get("BOT_TOKEN")!;
    }
}

export let authorizationVariables: AuthorizationVariables;
export let restVariables: RestVariables;
export let startupVariables: StartupVariables;

export function initializeEnvironments() {
    authorizationVariables = new AuthorizationVariables();
    restVariables = new RestVariables();
    startupVariables = new StartupVariables();
}
