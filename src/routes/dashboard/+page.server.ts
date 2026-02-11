import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'
import pb from '$lib/pb'
import type { ClientResponseError } from 'pocketbase'


export const load:PageServerLoad  = async () => {
    try {
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const todayISO = today.toISOString();

	const history = await pb.collection('history').getFullList({
		sort: '-created'
	})

	const historyToday = await pb.collection('history').getList(1, 1, {
		filter: `created >= "${todayISO}"`
	})

	const ips = await pb.collection('ips').getFullList({})

	const listedIps = ips.filter((ip: any) => ip.listed === true).length

	const rbls = await pb.collection('rbls').getList(1, 50, {})

	const activeRbls = rbls.items.filter((rbl: any) => rbl.disabled === false).length

	const ipStats: { [key: string]: { count: number; listed: boolean } } = {}
	history.forEach((record: any) => {
		if (record.ip) {
			if (!ipStats[record.ip]) {
				ipStats[record.ip] = { count: 0, listed: false }
			}
			ipStats[record.ip].count++
		}
	})
	
	ips.forEach((ip: any) => {
		if (ipStats[ip.ip]) {
			ipStats[ip.ip].listed = ip.listed === true
		}
	})

	return {
		history,
		historyToday: historyToday.totalItems,
		ips,
		listedIps,
		rbls,
		activeRbls,
		ipStats
	}

    } catch (err) {
        error(500, `Failed to fetch forms from Pocketbase: ${(err as ClientResponseError).message}`)
    }
}
