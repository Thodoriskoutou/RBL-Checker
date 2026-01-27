<script lang="ts">
    import Datatable from "$lib/components/Datatable.svelte";   
    import type { PageProps } from './$types';
    let { data }: PageProps = $props();
</script>


<Datatable
    Rows={data.records}
    headers={[
        "_",
        "Date",
        "IP",
        "RBL",
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
