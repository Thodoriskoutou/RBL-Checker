<script lang="ts">
    import Datatable from "$lib/components/Datatable.svelte";   
    import type { PageProps } from './$types';
    let { data }: PageProps = $props();
</script>

<div class="flex justify-between items-center mb-4">
	<div class="flex gap-2">
		<a
			href="?can_ignore=all"
			class="btn"
			class:btn-primary={!data.canIgnore}
		>
			All
		</a>

		<a
			href="?can_ignore=yes"
			class="btn"
			class:btn-primary={data.canIgnore === 'yes'}
		>
			Ignorable RBL
		</a>

		<a
			href="?can_ignore=no"
			class="btn"
			class:btn-primary={data.canIgnore === 'no'}
		>
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
        
		<input type="hidden" name="can_ignore" value={data.canIgnore} />

		<input
			type="date"
			name="date_from"
			value={data.dateFrom}
			class="input input-bordered"
		/>

		<input
			type="date"
			name="date_to"
			value={data.dateTo}
			class="input input-bordered"
		/>

		<button type="submit" class="btn btn-primary">
			Filter
		</button>

		<a href="?" class="btn btn-ghost">
			Clear
		</a>

	</form>

</div>



<Datatable
    Rows={data.records}
    headers={[
        "_",
        "Date",
        "IP",
        "RBL",
        "Can Ignore",
        "Reason"
    ]}
    page={data.page}
    total_pages={data.totalPages}
    page_number="10"
    from={data.from}
    to={data.to}
    totalItems={data.totalItems}
    per_page={data.perPage}	
    >
</Datatable>
