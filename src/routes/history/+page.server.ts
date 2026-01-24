import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'
import pb from '$lib/pb'
import type { ClientResponseError} from 'pocketbase'


export const load:PageServerLoad  = async ({ url }) => {
    const ip = url.searchParams.get('ip');
    try {
        const data = ip ? 
            await pb.collection('history').getList(1,50, {fields: 'id,created_at,ip,rbl,reason', filter: `ip="${ip}"`}) :
            await pb.collection('history').getList(1,50, {fields: 'id,created_at,ip,rbl,reason'})
        const records = data.items.map(({ id,created_at,ip,rbl,reason }) => [
            id,
            created_at,
            ip,
            rbl,
            reason
        ])
        return {
            records
        }
    } catch (err) {
        error(500, `Failed to fetch history from Pocketbase: ${(err as ClientResponseError).message}`)
    }
}