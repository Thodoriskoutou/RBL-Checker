import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'
import pb from '$lib/pb'
import type { ClientResponseError} from 'pocketbase'

const PER_PAGE=15
export const load:PageServerLoad  = async ({ url }) => {
    const ip = url.searchParams.get('ip');
    const page = Number(url.searchParams.get('page') ?? 1)
    // TODO pagination ?
    try {
        const data = await pb.collection('history').getList(page, PER_PAGE, {
			fields: 'id,created,expand.ip.ip,expand.rbl.name,reason',
			expand: 'ip,rbl',
			filter: ip ? `ip.ip="${ip}"` : undefined
        })
        const records = data.items.map(({ id,created,expand,reason }) => [
            id,
            created.split('.')[0],
            expand?.ip.ip,
            expand?.rbl.name,
            reason
        ])
        const totalItems = data.totalItems
    const from =
			totalItems === 0 ? 0 : (page - 1) * data.perPage + 1

		const to =
			totalItems === 0 ? 0 : Math.min(page * data.perPage, totalItems)
        return {
            records,
            page: data.page,
			perPage: data.perPage,
			totalPages: data.totalPages,
			totalItems: data.totalItems,
            from,
            to
        }
    } catch (err) {
        error(500, `Failed to fetch history from Pocketbase: ${(err as ClientResponseError).message}`)
    }
}