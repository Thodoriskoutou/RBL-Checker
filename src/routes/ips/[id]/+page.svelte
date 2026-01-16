<script lang="ts">
import type { PageProps } from './$types';
import { enhance, applyAction } from '$app/forms'
import Datatable from "$lib/components/Datatable.svelte";   
import ModalMany from '$lib/components/ModalMany.svelte';
import { showToast } from '$lib/Toast'
	import Input from '$lib/components/Input.svelte';
	import { goto } from '$app/navigation';
let { data }: PageProps = $props();
</script>


<form method="POST" action="?/create" use:enhance={() => {
    return async ({ result, update }) => {
        if (result.type === 'success') {
            await update()
            goto('/ips')
        } else {
            await applyAction(result)
        }
    }
}}>
    <div class="flex gap-4">
        <Input labels={["Please enter ip",null,null,null]} name="ip" minlength={3} required />
        <Input labels={["Please enter notes",null,null,null]} name="notes" minlength={3} required />
    </div>
    <div class="modal-footer">
        <button class="btn btn-primary" type="submit" onclick={() => {  
            showToast({
                type: 'success',
                message: 'Record Created',
                duration: 100000,
                dismissible: true,
                positionX: 'right',
                positionY: 'top'
            })
        }}>Submit</button>
    </div>
</form>