import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'
import pb from '$lib/pb'
import type { ClientResponseError} from 'pocketbase'

const PER_PAGE=15
export const load:PageServerLoad  = async ({ url }) => {
    const ip = url.searchParams.get('ip');
    const rbl = url.searchParams.get('rbl');
    const canIgnore = url.searchParams.get('can_ignore')
    const dateFrom = url.searchParams.get('date_from')
	const dateTo = url.searchParams.get('date_to')
    const page = Number(url.searchParams.get('page') ?? 1)
    // TODO pagination ?
    try {
        const filters: string[] = []

        if (ip) {
            filters.push(`ip.ip ~ "${ip}"`)
        }

        if (rbl) {
            const safeRbl = rbl.replace(/"/g, '\\"')
            filters.push(`rbl.name ~ "${safeRbl}"`)
        }

        if (canIgnore === 'yes') {
            filters.push(`rbl.can_ignore = true`)
        } else if (canIgnore === 'no') {
            filters.push(`rbl.can_ignore = false`)
        }

        if (dateFrom) {
            filters.push(`created >= "${dateFrom}T00:00:00"`)
        }

        if (dateTo) {
            filters.push(`created <= "${dateTo}T23:59:59"`)
        }


        const data = await pb.collection('history').getList(page, PER_PAGE, {
			fields: 'id,created,expand.ip.ip,expand.rbl.name,expand.rbl.can_ignore,reason',
			expand: 'ip,rbl',
			filter: filters.length ? filters.join(" && ") : undefined
        })
        const records = data.items.map(({ id,created,expand,reason }) => [
            id,
            created.split('.')[0],
            expand?.ip.ip,
            expand?.rbl.name,
            expand?.rbl.can_ignore ? '✅' : '❌',
            reason
        ])
        const totalItems = data.totalItems
    const from =
			totalItems === 0 ? 0 : (page - 1) * data.perPage + 1

		const to =
			totalItems === 0 ? 0 : Math.min(page * data.perPage, totalItems)
        return {
            records,
            ip,
            rbl,
            dateFrom,
            dateTo,
            canIgnore,
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