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

import { Bot, createBot, GatewayIntents } from "../base/discord.ts";
import * as logger from "../base/logger.ts";
import { StartupVariables } from "../env/mod.ts"

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

export let bot: Bot;

export async function main() {
    logger.info("[driver/mod.ts:46] bot version: 0.0.0");

    const startup = new StartupVariables();
    startup.initialize();

    bot = createBot({
        applicationId: startup.applicationId,
        botId: startup.applicationId!,
        events: {},
        intents: gatewayIntents,
        token: startup.botToken!,
    })
}
