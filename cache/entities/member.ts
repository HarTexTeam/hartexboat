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

import { GuildMemberWithUser } from "../../base/discord.ts";

import { Entity, EntityId } from "../entity.ts";

import { Repository } from "../repository.ts";

export interface MemberEntity extends Entity {
    avatar?: string;
    communicationDisabledUntil: number;
    deaf?: boolean;
    joinedAt: string;
    mute?: boolean;
    nick?: string;
    pending?: boolean;
    permissions?: string;
    premiumSince?: string;
    userId?: string;

    uniqueEntityId: EntityId;
}

export interface MemberRepository extends Repository<MemberEntity> {
    get: (entityId: EntityId) => Promise<MemberEntity>;
    upsert: (entity: MemberEntity) => Promise<void>;
}

export function fromMember(member: GuildMemberWithUser): MemberEntity {
    return {
        avatar: member.avatar?.toString(),
        communicationDisabledUntil: member.communicationDisabledUntil,
        deaf: member.deaf,
        joinedAt: member.joinedAt,
        mute: member.mute,
        nick: member.nick,
        pending: member.pending,
        permissions: member.permissions?.toString(),
        premiumSince: member.premiumSince?.toString(),
        userId: member.user.id
    } as MemberEntity;
}
