import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'
import pb from '$lib/pb'
import type { ClientResponseError } from 'pocketbase'
import { postValidation } from '$lib/helper'


export const load:PageServerLoad = async ({ params }) => {
    try {
        const recordId = params.id
        if (recordId === "new") {
            return {
                record: {
                    id: "",
                    domain: "",
                    disabled: false,
                    delist: "",
                    name:"",
                }
            }
        }
        const record = await pb.collection('rbls').getOne(`${recordId}`)
        return {
            record
        }
    } catch (err) {
        error(500, `Failed to fetch data from Pocketbase: ${(err as ClientResponseError).message}`)
    }
}


export const actions = {
    create: async ({request}) =>{
        const data = await request.formData()

        const domain = data.get('domain')
        const name = data.get('name')
        const delist = data.get('delist')
        const disabled = data.get('disabled')
        const can_ignore = data.get('can_ignore')

        const record = {
            "name": name,
            "domain": domain,
            "disabled": disabled,
            "delist": delist,
            "can_ignore": can_ignore
            
        }
        try {
            await pb.collection('rbls').create(record)
        } catch(err) {
            error(500, `Failed to create rbls: ${(err as ClientResponseError).message}`)
        }
        return { success: true }
    },
    edit: async({request}) =>{
            const data = await request.formData()
            const recordId = postValidation(data, 'recordId', false, 14)
            const domain = data.get('domain')
            const name = data.get('name')
            const delist = data.get('delist')
            const disabled = data.get('disabled')
            const can_ignore = data.get('can_ignore')
            
            const record = {
                "domain": domain,
                "name": name,
                "delist":delist,
                "disabled":disabled,
                "can_ignore": can_ignore
            }
            try {
                await pb.collection('rbls').update(recordId as string, record)
            } catch(err) {
                error(500, `Failed to edit rbls
                    with id ${recordId}: ${(err as ClientResponseError).message}`)
            }
            return { success: true }
        }
}