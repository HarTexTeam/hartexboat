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

import {
    DefaultMessageNotificationLevels,
    DiscordenoGuild,
    ExplicitContentFilterLevels,
    GuildFeatures,
    GuildNsfwLevel,
    MfaLevels,
    PremiumTiers,
    PresenceUpdate,
    SystemChannelFlags,
    WelcomeScreen,
} from "../../base/discord.ts";

import {
    Entity,
    EntityId,
} from "../entity.ts";

import { Repository } from "../repository.ts";

export interface GuildEntity extends Entity {
    afkChannelId?: string;
    afkTimeout: number;
    applicationId?: string;
    approximateMemberCount?: number;
    approximatePresenceCount?: number;
    banner?: string;
    defaultMessageNotifications: DefaultMessageNotificationLevels;
    description?: string;
    discoverySplash?: string;
    emojiIds: string[];
    explicitContentFilter: ExplicitContentFilterLevels;
    features: GuildFeatures[];
    icon?: string;
    iconHash?: string;
    id: string;
    joinedAt?: string;
    large?: boolean;
    maxMembers?: number;
    maxPresences?: number;
    maxVideoChannelUsers?: number;
    memberCount?: number;
    mfaLevel: MfaLevels;
    name: string,
    nsfwLevel: GuildNsfwLevel;
    ownerId: string;
    permissions?: string;
    preferredLocale: string;
    premiumProgressBarEnabled: boolean;
    premiumSubscriptionCount?: number;
    premiumTier: PremiumTiers;
    presences?: Partial<PresenceUpdate>;
    publicUpdatesChannelId?: string;
    roleIds: string[];
    rulesChannelId?: string;
    splash?: string;
    stageInstanceIds?: string[];
    systemChannelFlags: SystemChannelFlags;
    systemChannelId?: string;
    threadIds: string[];
    unavailable?: boolean;
    vanityUrlCode?: string;
    voiceStateUserIds: string[];
    welcomeScreen?: WelcomeScreen;
    widgetChannelId?: string;
    widgetEnabled?: boolean;

    uniqueEntityId: EntityId;
}

export interface GuildRepository extends Repository<GuildEntity> {
    get: (entityId: EntityId) => Promise<GuildEntity>;
    upsert: (entity: GuildEntity) => Promise<void>;
}

export function fromGuild(guild: DiscordenoGuild): GuildEntity {
    return {
        afkChannelId: guild.afkChannelId?.toString(),
        afkTimeout: guild.afkTimeout,
        applicationId: guild.applicationId?.toString(),
        approximateMemberCount: guild.approximateMemberCount,
        approximatePresenceCount: guild.approximatePresenceCount,
        banner: guild.banner,
        defaultMessageNotifications: guild.defaultMessageNotifications,
        description: guild.description,
        discoverySplash: guild.discoverySplash,
        emojiIds: guild.emojis.map(emoji => emoji.id?.toString()),
        explicitContentFilter: guild.explicitContentFilter,
        features: guild.features,
        icon: guild.icon,
        iconHash: guild.iconHash,
        id: guild.id.toString(),
        joinedAt: guild.joinedAt,
        large: guild.large,
        maxMembers: guild.maxMembers,
        maxPresences: guild.maxPresences,
        maxVideoChannelUsers: guild.maxVideoChannelUsers,
        memberCount: guild.memberCount,
        mfaLevel: guild.mfaLevel,
        name: guild.name,
        nsfwLevel: guild.nsfwLevel,
        ownerId: guild.ownerId.toString(),
        permissions: guild.permissions.toString(),
        preferredLocale: guild.preferredLocale,
        premiumProgressBarEnabled: guild.premiumProgressBarEnabled,
        premiumSubscriptionCount: guild.premiumSubscriptionCount,
        premiumTier: guild.premiumTier,
        publicUpdatesChannelId: guild.publicUpdatesChannelId?.toString(),
        roleIds: guild.roles.map(role => role.id?.toString()),
        rulesChannelId: guild.rulesChannelId?.toString(),
        splash: guild.splash,
        stageInstanceIds: guild.stageInstances?.map(stageInstance => stageInstance.id.toString()),
        systemChannelFlags: guild.systemChannelFlags,
        systemChannelId: guild.systemChannelId?.toString(),
        threadIds: guild.threads?.map(thread => thread.id),
        unavailable: guild.unavailable,
        vanityUrlCode: guild.vanityUrlCode,
        voiceStateUserIds: guild.voiceStates.map(voiceState => voiceState.userId.toString()),
        welcomeScreen: guild.welcomeScreen,
        widgetChannelId: guild.widgetChannelId,
        widgetEnabled: guild.widgetEnabled,

        uniqueEntityId: guild.id.toString(),
    } as GuildEntity;
}
