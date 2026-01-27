import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'
import pb from '$lib/pb'
import type { ClientResponseError } from 'pocketbase'


export const load:PageServerLoad  = async () => {
    try {
	const history = await pb.collection('history').getList(1, 50, {
		fields: 'created'
	})


	const ips = await pb.collection('ips').getFullList({})


	const rbls = await pb.collection('rbls').getList(1, 50, {})

	return {
		history,
		ips,
		rbls
	}

    } catch (err) {
        error(500, `Failed to fetch forms from Pocketbase: ${(err as ClientResponseError).message}`)
    }
}
