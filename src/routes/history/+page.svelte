<script lang="ts">
    import Datatable from "$lib/components/Datatable.svelte";   
    import type { PageProps } from './$types';
    let { data }: PageProps = $props();
</script>


<Datatable
    Rows={data.records}
    headers={[
        "_",
        "IP",
        "RBL",
        "Reason",
        "TTL"
    ]}
    >
</Datatable>
