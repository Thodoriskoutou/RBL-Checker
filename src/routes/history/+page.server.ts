import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'
import pb from '$lib/pb'
import type { ClientResponseError} from 'pocketbase'


export const load:PageServerLoad  = async ({ url }) => {
    const ip = url.searchParams.get('ip');
    // TODO pagination ?
    try {
        const data = ip ? 
            await pb.collection('history').getList(1,50, {fields: 'id,created,expand.ip.ip,expand.rbl.name,reason', expand: 'ip,rbl', filter: `ip.ip="${ip}"`}) :
            await pb.collection('history').getList(1,50, {fields: 'id,created,expand.ip.ip,expand.rbl.name,reason', expand: 'ip,rbl'})
        const records = data.items.map(({ id,created,expand,reason }) => [
            id,
            created.split('.')[0],
            expand?.ip.ip,
            expand?.rbl.name,
            reason
        ])
        return {
            records
        }
    } catch (err) {
        error(500, `Failed to fetch history from Pocketbase: ${(err as ClientResponseError).message}`)
    }
}