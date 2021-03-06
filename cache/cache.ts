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

import { addItems, getItemWithKey } from "../base/deta.ts";

import { Bot } from "../base/discord.ts";

import { CurrentUserEntity, CurrentUserRepository } from "./entities/currentUser.ts";
import { GuildEntity, GuildRepository } from "./entities/guild.ts";
import { MemberEntity, MemberRepository } from "./entities/member.ts";
import { EntityId, entityIdIsString } from "./entity.ts";

export type BotWithDetaCache = Bot & DetaCache;

export interface DetaCache extends Bot {
    detaCache: DetaCacheRepositories;
}

export interface DetaCacheRepositories {
    currentUserRepository: CurrentUserRepository;
    guildRepository: GuildRepository;
    memberRepository: MemberRepository;
}

export function createDetaCacheRepositories(): DetaCacheRepositories {
    return {
        currentUserRepository: {
            get: async () => {
                const response = await getItemWithKey("CurrentUserRepository", "currentUser");

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
                        },
                    ],
                };

                await addItems("CurrentUserRepository", bodyObject);
            },
        } as CurrentUserRepository,
        guildRepository: {
            get: async (entityId: EntityId) => {
                if (entityIdIsString(entityId)) {
                    const response = await getItemWithKey("GuildRepository", entityId);

                    if (response.ok) {
                        const json = await response.json();

                        return {
                            afkChannelId: json.afkChannelId,
                            afkTimeout: json.afkTimeout,
                            applicationId: json.applicationId,
                            approximateMemberCount: json.approximateMemberCount,
                            approximatePresenceCount: json.approximatePresenceCount,
                            banner: json.banner,
                            defaultMessageNotifications: json.defaultMessageNotifications,
                            description: json.description,
                            discoverySplash: json.discoverySplash,
                            emojiIds: json.emojiIds,
                            explicitContentFilter: json.explicitContentFilter,
                            features: json.features,
                            icon: json.icon,
                            iconHash: json.iconHash,
                            id: json.id,
                            joinedAt: json.joinedAt,
                            large: json.large,
                            maxMembers: json.maxMembers,
                            maxPresences: json.maxPresences,
                            maxVideoChannelUsers: json.maxVideoChannelUsers,
                            memberCount: json.memberCount,
                            mfaLevel: json.mfaLevel,
                            name: json.name,
                            nsfwLevel: json.nsfwLevel,
                            ownerId: json.ownerId,
                            permissions: json.permissions,
                            preferredLocale: json.preferredLocale,
                            premiumProgressBarEnabled: json.premiumProgressBarEnabled,
                            premiumSubscriptionCount: json.premiumSubscriptionCount,
                            premiumTier: json.premiumTier,
                            publicUpdatesChannelId: json.publicUpdatesChannelId,
                            roleIds: json.roleIds,
                            rulesChannelId: json.rulesChannelId,
                            splash: json.splash,
                            stageInstanceIds: json.stageInstanceIds,
                            systemChannelFlags: json.systemChannelFlags,
                            systemChannelId: json.systemChannelId,
                            threadIds: json.threadIds,
                            unavailable: json.unavailable,
                            vanityUrlCode: json.vanityUrlCode,
                            voiceStateUserIds: json.voiceStateUserIds,
                            welcomeScreen: json.welcomeScreen,
                            widgetChannelId: json.widgetChannelId,
                            widgetEnabled: json.widgetEnabled,

                            uniqueEntityId: json.key,
                        } as GuildEntity;
                    }
                }
            },
            upsert: async (entity: GuildEntity) => {
                const bodyObject = {
                    items: [
                        {
                            key: entity.uniqueEntityId,
                            afkChannelId: entity.afkChannelId,
                            afkTimeout: entity.afkTimeout,
                            applicationId: entity.applicationId,
                            approximateMemberCount: entity.approximateMemberCount,
                            approximatePresenceCount: entity.approximatePresenceCount,
                            banner: entity.banner,
                            defaultMessageNotifications: entity.defaultMessageNotifications,
                            description: entity.description,
                            discoverySplash: entity.discoverySplash,
                            emojiIds: entity.emojiIds,
                            explicitContentFilter: entity.explicitContentFilter,
                            features: entity.features,
                            icon: entity.icon,
                            iconHash: entity.iconHash,
                            id: entity.id,
                            joinedAt: entity.joinedAt,
                            large: entity.large,
                            maxMembers: entity.maxMembers,
                            maxPresences: entity.maxPresences,
                            maxVideoChannelUsers: entity.maxVideoChannelUsers,
                            memberCount: entity.memberCount,
                            mfaLevel: entity.mfaLevel,
                            name: entity.name,
                            nsfwLevel: entity.nsfwLevel,
                            ownerId: entity.ownerId,
                            permissions: entity.permissions,
                            preferredLocale: entity.preferredLocale,
                            premiumProgressBarEnabled: entity.premiumProgressBarEnabled,
                            premiumSubscriptionCount: entity.premiumSubscriptionCount,
                            premiumTier: entity.premiumTier,
                            publicUpdatesChannelId: entity.publicUpdatesChannelId,
                            roleIds: entity.roleIds,
                            rulesChannelId: entity.rulesChannelId,
                            splash: entity.splash,
                            stageInstanceIds: entity.stageInstanceIds,
                            systemChannelFlags: entity.systemChannelFlags,
                            systemChannelId: entity.systemChannelId,
                            threadIds: entity.threadIds,
                            unavailable: entity.unavailable,
                            vanityUrlCode: entity.vanityUrlCode,
                            voiceStateUserIds: entity.voiceStateUserIds,
                            welcomeScreen: entity.welcomeScreen,
                            widgetChannelId: entity.widgetChannelId,
                            widgetEnabled: entity.widgetEnabled,
                        },
                    ],
                };

                await addItems("GuildRepository", bodyObject);
            },
        } as GuildRepository,
        memberRepository: {
            get: async (entityId: EntityId) => {
                if (entityIdIsString(entityId)) {
                    const response = await getItemWithKey("MemberRepository", entityId);

                    if (response.ok) {
                        const json = await response.json();

                        return {
                            avatar: json.avatar,
                            communicationDisabledUntil: json.communicationDisabledUntil,
                            deaf: json.deaf,
                            joinedAt: json.joinedAt,
                            mute: json.mute,
                            nick: json.nick,
                            pending: json.pending,
                            permissions: json.permissions,
                            premiumSince: json.premiumSince,
                            userId: json.userId,

                            uniqueEntityId: json.key,
                        } as MemberEntity;
                    }
                }
            },
            upsert: async (entity: MemberEntity) => {
                const bodyObject = {
                    items: [
                        {
                            key: entity.uniqueEntityId,
                            
                            avatar: entity.avatar,
                            communicationDisabledUntil: entity.communicationDisabledUntil,
                            deaf: entity.deaf,
                            joinedAt: entity.joinedAt,
                            mute: entity.mute,
                            nick: entity.nick,
                            pending: entity.pending,
                            permissions: entity.permissions,
                            premiumSince: entity.premiumSince,
                            userId: entity.userId,
                        },
                    ],
                };

                await addItems("MemberRepository", bodyObject);
            },
            upsertMany: async (entities: MemberEntity[]) => {
                const bodyObject = {
                    items: entities.map(entity => {
                        const obj = {
                            key: entity.uniqueEntityId,
                            
                            avatar: entity.avatar,
                            communicationDisabledUntil: entity.communicationDisabledUntil,
                            deaf: entity.deaf,
                            joinedAt: entity.joinedAt,
                            mute: entity.mute,
                            nick: entity.nick,
                            pending: entity.pending,
                            permissions: entity.permissions,
                            premiumSince: entity.premiumSince,
                            userId: entity.userId,
                        };

                        obj
                    }),
                };

                await addItems("MemberRepository", bodyObject);
            }
        },
    } as DetaCacheRepositories;
}
