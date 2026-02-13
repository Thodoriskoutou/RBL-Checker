<script lang="ts">
import type { PageProps } from './$types'
import Card from "$lib/components/Card.svelte"
import Linechart from "$lib/components/Linechart.svelte"

let { data }: PageProps = $props();
let dateRange = $state('month')
let selectedIPs = $state<string[]>([])

// Get unique IPs from history
const uniqueIPs = $derived.by(() => {
	return Object.keys(data.ipStats || {}).sort()
})

const filteredIPs = $derived.by(() => {
	return selectedIPs.length > 0 ? selectedIPs : uniqueIPs
})

const average = $derived.by(() => {
	if (filteredIPs.length === 0) return '0.00'
	const total = filteredIPs.reduce((sum, ip) => sum + (data.ipStats[ip]?.count || 0), 0)
	return (total / filteredIPs.length).toFixed(2)
})

const chartData = $derived.by(() => {
	const ipData: number[] = []
	const labels: string[] = []
	
	filteredIPs.forEach(ip => {
		labels.push(ip)
		ipData.push(data.ipStats[ip]?.count || 0)
	})
	
	return { labels, data: ipData }
})

const toggleIP = (ip: string) => {
	if (selectedIPs.includes(ip)) {
		selectedIPs = selectedIPs.filter(i => i !== ip)
	} else {
		selectedIPs = [...selectedIPs, ip]
	}
}

$effect(() => {
	console.log(data);
});
</script>

<div class="p-6 space-y-8">
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
	<Card
		title="History"
		value={`${data.history.length} Records (${data.historyToday} today)`}
		icon="fa7-solid:history"
		textColor="primary"
	/>

	<Card
		title="IPs"
		value={`${data.ips.length} Records (${data.listedIps} listed)`}
		icon="mdi:ip-network-outline"
		textColor="primary"
	/>

	<Card
		title="RBLs"
		value={`${data.rbls.totalItems} Records (${data.activeRbls} active)`}
		icon="material-symbols:list-alt-outline-rounded"
		textColor="primary"
	/>
	</div>

	<div class="flex justify-center">
		<div class="w-full bg-base-100 rounded-2xl shadow-lg border border-base-300 overflow-hidden col-span-1 sm:col-span-2 lg:col-span-3">
			<div class="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 border-b border-base-300">
				<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
					<div>
						<h2 class="text-2xl font-bold text-base-content mb-1">Listings</h2>
						<p class="text-sm text-base-content/60">Monitor IP activity and trends</p>
					</div>
					<div class="flex items-center gap-2">
						<label class="text-sm font-medium text-base-content/70">Date Range:</label>
						<select bind:value={dateRange} class="select select-bordered select-sm font-medium">
							<option value="month">Month (default)</option>
							<option value="quarter">Quarter</option>
							<option value="year">Year</option>
							<option value="all">All Time</option>
						</select>
					</div>
				</div>
			</div>
			<div class="p-6 space-y-6">
				<div class="space-y-3">
					<div class="flex items-center justify-between">
						<label class="text-sm font-semibold text-base-content">Filter by IP</label>
						<span class="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-medium">
							{selectedIPs.length > 0 ? selectedIPs.length : 'All'} selected
						</span>
					</div>
					<div class="flex flex-wrap gap-2">
						{#each uniqueIPs as ip (ip)}
							<button
								on:click={() => toggleIP(ip)}
								class={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
									selectedIPs.includes(ip)
										? 'bg-gradient-to-r from-primary to-primary/80 text-primary-content shadow-lg shadow-primary/30'
										: 'bg-base-200 text-base-content hover:bg-base-300 border border-base-300'
								}`}
							>
								{ip}
								{#if selectedIPs.includes(ip)}
									<span class="ml-1.5">✓</span>
								{/if}
							</button>
						{/each}
					</div>
				</div>
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-base-200/30 rounded-xl border border-base-300">
					<div class="flex items-center justify-between">
						<span class="text-sm font-medium text-base-content/70">Average per date</span>
						<span class="text-2xl font-bold text-primary">{average}</span>
					</div>
					<div class="flex items-center justify-between">
						<span class="text-sm font-medium text-base-content/70">Total Records</span>
						<span class="text-2xl font-bold text-secondary">{filteredIPs.reduce((sum, ip) => sum + (data.ipStats[ip]?.count || 0), 0)}</span>
					</div>
				</div>
				<div class="overflow-x-auto">
					<table class="table table-sm">
						<thead class="bg-base-200">
							<tr>
								<th class="text-base-content/70 font-semibold">IP Address</th>
								<th class="text-base-content/70 font-semibold">Records</th>
								<th class="text-base-content/70 font-semibold">Status</th>
							</tr>
						</thead>
						<tbody>
							{#each filteredIPs as ip (ip)}
								<tr class={`hover:bg-base-200/50 transition-colors ${selectedIPs.includes(ip) ? 'bg-primary/5 border-l-4 border-primary' : ''}`}>
									<td class="font-mono text-sm font-semibold text-primary">{ip}</td>
									<td>
										<div class="flex items-center gap-2">
											<div class="w-24 bg-base-300 rounded-full h-2 overflow-hidden">
												<div 
													class="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all" 
													style="width: {Math.min((data.ipStats[ip]?.count || 0) / 10 * 100, 100)}%"
												></div>
											</div>
											<span class="font-bold text-base-content">{data.ipStats[ip]?.count || 0}</span>
										</div>
									</td>
									<td>
										<span class={`badge font-semibold ${data.ipStats[ip]?.listed ? 'badge-error' : 'badge-success'}`}>
											{data.ipStats[ip]?.listed ? 'Listed' : 'Clean'}
										</span>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
				{#if chartData.data.length > 0}
					<div class="mt-8 p-4 bg-base-200/20 rounded-xl border border-base-300">
						<h3 class="text-lg font-semibold text-base-content mb-4">Activity Trend</h3>
						<Linechart
							Data={chartData.data}
							Categories={chartData.labels}
							DataTitle="Records"
							Height={300}
							color="primary"
							Curve="smooth"
						/>
					</div>
				{:else}
					<div class="text-center py-12 text-base-content/50">
						<p class="text-lg font-medium">No data available for selected filters</p>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>