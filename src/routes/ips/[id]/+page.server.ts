import type { PageServerLoad } from './$types'
import { error, fail } from '@sveltejs/kit'
import pb from '$lib/pb'
import type { ClientResponseError } from 'pocketbase'
import { resolve4, resolve6 } from 'node:dns/promises';
import { isIP } from 'node:net';

export const load: PageServerLoad = async ({ params }) => {
    try {
        const recordId = params.id
        if (recordId === "new") {
            return {
                record: {
                    ip: "",
                    notes: ""
                }
            }
        }
        const record = await pb.collection('ips').getOne(`${recordId}`)
        return {
            record
        }
    } catch (err) {
        error(500, `Failed to fetch data from Pocketbase: ${(err as ClientResponseError).message}`)
    }
}

export const actions = {
    create: async ({ request }) => {
        const data = await request.formData()
        const ip = data.get("ip")
        const notes = data.get("notes")

        if (!ip || typeof ip !== 'string') {
            return fail(400, { ip, missing: true })
        }

        if (isIP(ip) > 0) {
            const ipv4list = await resolve4(ip);
            const ipv6list = await resolve6(ip);

            if (!ipv4list.length && !ipv6list.length) {
                return fail(400, { ip, invalid: true })
            }
            const batch = pb.createBatch();
            for (const resolvedIP of [...ipv4list, ...ipv6list]) {
                batch.collection('ips').create({ip: resolvedIP, notes});
            }
            try {
                await batch.send();
            } catch (err) {
                error(500, `Failed to add IPs: ${(err as ClientResponseError).message}`)
            }
        } else {
            try {
                await pb.collection('ips').create({ip, notes})
            } catch (err) {
                error(500, `Failed to add IP: ${(err as ClientResponseError).message}`)
            }
        }

        return { success: true }
    }
}