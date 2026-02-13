<script lang="ts">
	import Datatable from '$lib/components/Datatable.svelte';
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
</script>

<div class="flex justify-between items-center mb-4">
	<div class="flex gap-2">
		<a href="?can_ignore=all" class="btn" class:btn-primary={!data.canIgnore}> All </a>

		<a href="?can_ignore=yes" class="btn" class:btn-primary={data.canIgnore === 'yes'}>
			Ignorable RBL
		</a>

		<a href="?can_ignore=no" class="btn" class:btn-primary={data.canIgnore === 'no'}>
			Non Ignorable RBL
		</a>
	</div>

	<form method="GET" class="flex items-center gap-2">
		<input
			type="text"
			name="ip"
			placeholder="Search by IP"
			value={data.ip}
			class="input input-bordered"
		/>
		<input
			type="text"
			name="rbl"
			placeholder="Search by RBL name"
			value={data.rbl}
			class="input input-bordered"
		/>
		<input type="hidden" name="can_ignore" value={data.canIgnore} />

		<div class="join">
			<select
				class="select select-bordered join-item"
				onchange={(e) => {
					const val = e.currentTarget.value;
					const now = new Date();
					let from = '';
					let to = '';

					if (val === 'today') {
						from = now.toISOString().split('T')[0];
						to = from;
					} else if (val === 'yesterday') {
						const d = new Date(now);
						d.setDate(d.getDate() - 1);
						from = d.toISOString().split('T')[0];
						to = from;
					} else if (val === '7days') {
						const d = new Date(now);
						d.setDate(d.getDate() - 7);
						from = d.toISOString().split('T')[0];
						to = now.toISOString().split('T')[0];
					} else if (val === '30days') {
						const d = new Date(now);
						d.setDate(d.getDate() - 30);
						from = d.toISOString().split('T')[0];
						to = now.toISOString().split('T')[0];
					} else if (val === 'this_month') {
						from = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
						to = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
					} else if (val === 'last_month') {
						from = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0];
						to = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0];
					}

					if (from && to) {
						const fromInput = document.querySelector('input[name="date_from"]') as HTMLInputElement;
						const toInput = document.querySelector('input[name="date_to"]') as HTMLInputElement;
						if (fromInput) fromInput.value = from;
						if (toInput) toInput.value = to;
					}
				}}
			>
				<option disabled selected>Presets</option>
				<option value="today">Today</option>
				<option value="yesterday">Yesterday</option>
				<option value="7days">Last 7 Days</option>
				<option value="30days">Last 30 Days</option>
				<option value="this_month">This Month</option>
				<option value="last_month">Last Month</option>
			</select>
			<input
				type="date"
				name="date_from"
				value={data.dateFrom}
				class="input input-bordered join-item"
				aria-label="Date from"
			/>
			<input
				type="date"
				name="date_to"
				value={data.dateTo}
				class="input input-bordered join-item"
				aria-label="Date to"
			/>
		</div>

		<button type="submit" class="btn btn-primary"> Filter </button>

		<a href="?" class="btn btn-ghost"> Clear </a>
	</form>
</div>

<Datatable
	Rows={data.records}
	headers={['_', 'Date', 'IP', 'RBL', 'Can Ignore', 'Reason']}
	page={data.page}
	total_pages={data.totalPages}
	page_number="10"
	from={data.from}
	to={data.to}
	totalItems={data.totalItems}
	per_page={data.perPage}
></Datatable>
