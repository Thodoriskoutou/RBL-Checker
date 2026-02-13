import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'
import pb from '$lib/pb'
import type { ClientResponseError } from 'pocketbase'


export const load: PageServerLoad = async () => {
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

		// Build a lookup from IP record id -> address, and address -> listed status
		const ipsById: { [id: string]: string } = {}
		const listedByAddress: { [address: string]: boolean } = {}
		ips.forEach((ip: any) => {
			// pocketbase ip record likely has fields `id` and `ip` (address)
			if (ip.id && ip.ip) {
				ipsById[ip.id] = ip.ip
				listedByAddress[ip.ip] = ip.listed === true
			}
		})

		// Build stats keyed by actual IP address (not by record id)
		const ipStats: { [key: string]: { count: number; listed: boolean } } = {}
		history.forEach((record: any) => {
			if (!record.ip) return

			// record.ip may be an id referencing `ips` collection, or an IP string
			const address = ipsById[record.ip] ?? String(record.ip)

			if (!ipStats[address]) {
				ipStats[address] = { count: 0, listed: listedByAddress[address] ?? false }
			}
			ipStats[address].count++
		})

		return {
			history,
			historyToday: historyToday.totalItems,
			ips,
			listedIps,
			rbls,
			activeRbls,
			ipStats,
			ipsById
		}

	} catch (err) {
		error(500, `Failed to fetch forms from Pocketbase: ${(err as ClientResponseError).message}`)
	}
}
