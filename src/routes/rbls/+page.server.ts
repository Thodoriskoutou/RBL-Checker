import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'
import pb from '$lib/pb'
import type { ClientResponseError } from 'pocketbase'
import { postValidation } from '$lib/helper'
const PER_PAGE=15
export const load:PageServerLoad  = async ({url}) => {
    const page = Number(url.searchParams.get('page') ?? 1)
    const status=url.searchParams.get('status') ?? 'all'
    try {
        let filter = ''

		if (status === 'enabled') {
			filter = 'disabled = false'
		}

		if (status === 'disabled') {
			filter = 'disabled = true'
		}

        const data = await pb.collection('rbls').getList(page, PER_PAGE, {
		    fields: 'id,name,domain,disabled,delist,can_ignore',
            filter
	    })

    const records = data.items.map(({ id, name, domain , disabled, delist, can_ignore }) => [
            id,
            name,
            domain,
            disabled ? '✅' : '❌',
            delist,
            can_ignore ? '✅' : '❌'

    ])
    const totalItems = data.totalItems
    const from =
			totalItems === 0 ? 0 : (page - 1) * data.perPage + 1

		const to =
			totalItems === 0 ? 0 : Math.min(page * data.perPage, totalItems)

	return {
        records,
        status,
        page: data.page,
			perPage: data.perPage,
			totalPages: data.totalPages,
			totalItems: data.totalItems,
            from,
            to
	}

    } catch (err) {
        error(500, `Failed to fetch rbls from Pocketbase: ${(err as ClientResponseError).message}`)
    }
}

export const actions = {
    delete: async({request}: {request: Request}) =>{
        const data = await request.formData()
        const recordId = postValidation(data, 'recordId', false, 14)
        if(typeof recordId !== 'string') return recordId
        try {
            await pb.collection('rbls').delete(recordId)
        } catch(err) {
            error(500, `Failed to delete rbls with id ${recordId}: ${(err as ClientResponseError).message}`)
        }
        return { success: true }
    }
}
