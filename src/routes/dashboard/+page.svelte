<script lang="ts">
import type { PageProps } from './$types'
import Card from "$lib/components/Card.svelte"
import Linechart from "$lib/components/Linechart.svelte"
import Doughnut from '$lib/components/Doughnut.svelte'

let { data }: PageProps = $props();
let deleteModal = $state(false)
let modalIndex: string|number|undefined = $state()

$effect(() => {
	console.log(data);
});
</script>


<div class="p-6 space-y-8">
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
	<Card
		title="History"
		value={`${data.history.totalItems} Records`}
		icon="fa7-solid:history"
		textColor="primary"
	/>

	<Card
		title="Ips"
		value={`${data.ips.length} Records`}
		icon="mdi:ip-network-outline"
		textColor="primary"
	/>

	<Card
		title="Rbls"
		value={`${data.rbls.totalItems} Records`}
		icon="material-symbols:list-alt-outline-rounded"
		textColor="primary"
	/>
	</div>


	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
	<div class="lg:col-span-1 bg-base-100 rounded-xl shadow p-4">
		<h3 class="text-lg font-semibold mb-4">Record Distribution</h3>
		<Doughnut
		Data={[
			data.history.totalItems,
			data.ips.length,
			data.rbls.totalItems,
		]}
		Categories={['History', 'Ips', 'Rbls']}
		DataTitle="Total Records"
		Height={300}
		colors={['primary', 'secondary', 'accent']}
		/>
	</div>

	<div class="lg:col-span-2 bg-base-100 rounded-xl shadow p-4">
		<h3 class="text-lg font-semibold mb-4">Growth Over Time</h3>
		<Linechart
		Data={[10, 41, 35, 51, 49, 62, 69, 91, 148]}
		Categories={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']}
		DataTitle="Records"
		Height={300}
		color="primary"
		Curve="smooth"
		/>
	</div>
	</div>
</div>