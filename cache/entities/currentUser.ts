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

import { PremiumTypes, DiscordenoUser, UserFlags } from "../../base/discord.ts";

import {
    Entity,
    EntityId,
} from "../entity.ts";

import { SingleEntityRepository } from "../repository.ts";

export interface CurrentUserEntity extends Entity {
    avatar?: string;
    bot?: boolean;
    discriminator: string;
    email?: string;
    flags?: UserFlags;
    id: string;
    mfaEnabled?: boolean;
    name: string;
    premiumType?: PremiumTypes;
    publicFlags?: UserFlags;
    verified?: boolean;

    uniqueEntityId: EntityId;
}

export interface CurrentUserRepository extends SingleEntityRepository<CurrentUserEntity> {
    get: () => Promise<CurrentUserEntity>;
    upsert: (entity: CurrentUserEntity) => Promise<void>;
}

export function fromUser(user: DiscordenoUser): CurrentUserEntity {
    return {
        avatar: user.avatar ? user.avatar.toString()! : undefined,
        bot: user.bot,
        discriminator: user.discriminator.toString(),
        email: user.email ? user.email! : undefined,
        flags: user.flags,
        id: user.id.toString(),
        mfaEnabled: user.mfaEnabled,
        name: user.username,
        premiumType: user.premiumType,
        publicFlags: user.publicFlags,
        verified: user.verified,

        uniqueEntityId: user.id.toString(),
    } as CurrentUserEntity;
}
