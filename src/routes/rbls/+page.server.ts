import type { LayoutServerLoad } from './$types'
import { error } from '@sveltejs/kit'
import pb from '$lib/pb'
import type { ClientResponseError } from 'pocketbase'
import { postValidation } from '$lib/helper'

export const load:LayoutServerLoad  = async () => {
    try {
        const data = await pb.collection('rbls').getList(1, 50, {
		    fields: 'id,name,domain,disabled,delist',
	    })

    const records = data.items.map(({ id, name, domain , disabled, delist }) => [
            id,
            name,
            domain,
            disabled ? '✅' : '❌',
            delist 

    ])
	return {
        records
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
