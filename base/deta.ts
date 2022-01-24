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

import { detaVariables } from "../env/lib.ts";

export async function addItems(repository: string, items: Record<string, unknown>): Promise<Response> {
    return await fetch(`https://database.deta.sh/v1/${detaVariables.detaProjectId}/${repository}/items`, {
        body: JSON.stringify(items),
        headers: {
            "Content-Type": "application/json",
            "X-API-Key": detaVariables.detaProjectKey!,
        },
        method: "PUT",
    });
}

export async function getItemWithKey(repository: string, key: string): Promise<Response> {
    return await fetch(`https://database.deta.sh/v1/${detaVariables.detaProjectId}/${repository}/items/${key}`, {
        headers: {
            "Content-Type": "application/json",
            "X-API-Key": detaVariables.detaProjectKey!,
        },
        method: "GET",
    });
}
