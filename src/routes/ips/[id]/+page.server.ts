import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'
import pb from '$lib/pb'
import type { ClientResponseError } from 'pocketbase'



export const load:PageServerLoad = async ({ params }) => {
    try {
        const recordId = params.id
        if (recordId === "new") {
            return {
                record: {
                    ip:"",
                    notes:""
                }
            }
        }
        const record = await pb.collection('ips').getOne(`${recordId}`)
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
        const ip= data.get("ip")
        const notes = data.get("notes")
        const record = {
            "ip": ip,
            "notes":notes
        }
        try {
            await pb.collection('ips').create(record)
        } catch(err) {
            error(500, `Failed to create ips: ${(err as ClientResponseError).message}`)
        }
        return { success: true }
    }
}