import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'
import pb from '$lib/pb'
import type { ClientResponseError } from 'pocketbase'


const PER_PAGE = 15

export const load: PageServerLoad = async ({ url }) => {
	const page = Number(url.searchParams.get('page') ?? 1)
	const search = url.searchParams.get('search')?.trim() ?? ''

	try {
		let filter = ''

		if (search) {
			const safeSearch = search.replace(/"/g, '\\"')
			filter = `
				ip ~ "${safeSearch}" ||
				notes ~ "${safeSearch}" ||
				ptr ~ "${safeSearch}"
			`
		}

		const data = await pb.collection('ips').getList(page, PER_PAGE, {
			fields: 'id,ip,notes,ptr,listed',
			filter
		})

		const records = data.items.map(({ id, ip, notes, ptr, listed }) => [
			id,
			ip,
			notes,
			ptr,
			listed ? '✅' : '❌'
		])

		const totalItems = data.totalItems
		const from = totalItems === 0 ? 0 : (page - 1) * data.perPage + 1
		const to =
			totalItems === 0 ? 0 : Math.min(page * data.perPage, totalItems)

		return {
			records,
			search, 
			page: data.page,
			perPage: data.perPage,
			totalPages: data.totalPages,
			totalItems: data.totalItems,
			from,
			to
		}
	} catch (err) {
		error(500, `Failed to fetch IPS from Pocketbase: ${(err as ClientResponseError).message}`)
	}
}
