import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'
import pb from '$lib/pb'
import type { ClientResponseError } from 'pocketbase'
import { postValidation } from '$lib/helper'

export const load:PageServerLoad  = async () => {
    try {
        const data = await pb.collection('ips').getList(1,50, {
            fields: 'id,ip,notes,ptr,listed'
        })
        const records = data.items.map(({ id , ip , notes, ptr , listed}) => [
            id,
            ip,
            notes,
            ptr,
            listed ? '✅' : '❌'
        ])
        return {
            records
        }
    } catch (err) {
        error(500, `Failed to fetch IPS from Pocketbase: ${(err as ClientResponseError).message}`)
    }
}


export const actions = {
    delete: async({request}: {request: Request}) =>{
        const data = await request.formData()
        const recordId = postValidation(data, 'recordId', false, 14)
        if(typeof recordId !== 'string') return recordId
        try {
            await pb.collection('ips').delete(recordId)
        } catch(err) {
            error(500, `Failed to delete ip with id ${recordId}: ${(err as ClientResponseError).message}`)
        }
    }
}