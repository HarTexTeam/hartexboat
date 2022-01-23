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
import { detaVariables } from "../env/lib.ts";

import { CurrentUserEntity, CurrentUserRepository } from "./entities/currentUser.ts";

export type BotWithDetaCache = Bot & DetaCache;

export interface DetaCache extends Bot {
    detaCache: DetaCacheRepositories;
}

export interface DetaCacheRepositories {
    currentUserRepository: CurrentUserRepository;
}

export function createDetaCacheRepositories(): DetaCacheRepositories {
    return {
        currentUserRepository: {
            get: async () => {
                const response = await fetch(`https://database.deta.sh/v1/${detaVariables.detaProjectId}/CurrentUserRepository/items/currentUser`, {
                    headers: {
                        "Content-Type": "application/json",
                        "X-API-Key": detaVariables.detaProjectKey!,
                    },
                    method: "GET",
                });

                if (response.ok) {
                    const json = await response.json();

                    return {
                        avatar: json.avatar,
                        bot: json.bot,
                        discriminator: json.discriminator,
                        email: json.email,
                        flags: json.flags,
                        id: json.id,
                        mfaEnabled: json.mfaEnabled,
                        name: json.name,
                        premiumType: json.premiumType,
                        publicFlags: json.publicFlags,
                        verified: json.verified,

                        uniqueEntityId: json.key,
                    } as CurrentUserEntity;
                }
            },
            upsert: async (entity: CurrentUserEntity) => {
                const bodyObject = {
                    items: [
                        {
                            key: "currentUser",
                            avatar: entity.avatar,
                            bot: entity.bot,
                            discriminator: entity.discriminator,
                            email: entity.email,
                            flags: entity.flags,
                            id: entity.id,
                            mfaEnabled: entity.mfaEnabled,
                            name: entity.name,
                            premiumType: entity.premiumType,
                            publicFlags: entity.publicFlags,
                            verified: entity.verified,
                        }
                    ],
                };

                await fetch(`https://database.deta.sh/v1/${detaVariables.detaProjectId}/CurrentUserRepository/items`, {
                    body: JSON.stringify(bodyObject),
                    headers: {
                        "Content-Type": "application/json",
                        "X-API-Key": detaVariables.detaProjectKey!,
                    },
                    method: "PUT",
                });
            },
        } as CurrentUserRepository,
    } as DetaCacheRepositories;
}
