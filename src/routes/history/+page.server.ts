import type { LayoutServerLoad } from './$types'
import { error } from '@sveltejs/kit'
import pb from '$lib/pb'
import type { ClientResponseError} from 'pocketbase'
import { postValidation } from '$lib/helper'


export const load:LayoutServerLoad  = async () => {
    try {
        const data = await pb.collection('history').getList(1,50, {
            fields: 'id,ip,rbl,reason,ttl'
        })
        const records = data.items.map(({ id,ip,rbl,reason,ttl }) => [
            id,
            ip,
            rbl,
            reason,
            ttl
        ])
        return {
            records
        }
    } catch (err) {
        error(500, `Failed to fetch history from Pocketbase: ${(err as ClientResponseError).message}`)
    }
}

export const actions = {
    delete: async({request}: {request: Request}) =>{
        const data = await request.formData()
        const recordId = postValidation(data, 'recordId', false, 14)
        if(typeof recordId !== 'string') return recordId
        try {
            await pb.collection('history').delete(recordId)
        } catch(err) {
            error(500, `Failed to delete history with id ${recordId}: ${(err as ClientResponseError).message}`)
        }
        return { success: true }
    }
}