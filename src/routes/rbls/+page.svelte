<script lang="ts">
import type { PageProps } from './$types';
import { enhance, applyAction } from '$app/forms'
import Datatable from "$lib/components/Datatable.svelte";   
import ModalMany from '$lib/components/ModalMany.svelte';
import { showToast } from '$lib/Toast'
let { data }: PageProps = $props();
let deleteModal = $state(false)
let modalIndex: string|number|undefined = $state()

$effect(() => {
	console.log(data);
});

</script>

<div class="flex justify-between items-center">
    <h1 class="text-base-content text-4xl m-4 ml-0 flex">
        rbls
    </h1>
    <a href={data.activeMenu!.link + "/new"} title="Add a new rbls" class="btn btn-primary btn-circle">+</a>
    
</div>
<Datatable
    Rows={data.records}
    headers={["id","name", "domain", "disabled", "delist","Actions"]}
    action={true}
    onDeleteClick={(recordId) => {modalIndex = recordId; deleteModal = true }} EditRedirect={`/rbls/${modalIndex}`}  onEditClick={(recordId) => {modalIndex = recordId}}
    >
</Datatable>

<ModalMany position="middle" size="lg" Id="deleteModal" title="Delete Row" open={deleteModal} close={() => deleteModal = false} recordId={modalIndex}>
    {#snippet Body(recordId: string|number|undefined)}
        <h1>Are you sure you want to delete this row</h1>
        <form method="POST" action="?/delete" use:enhance={({}) => {
                return async ({ result,update }) => {
                    if (result.type === 'success') {
                        await update()
                    } else {
                        await applyAction(result)
                    }
                }
            }}
            >
            <input type="hidden" name="recordId" value={recordId} />
            <div class="modal-footer">
                <button class="btn btn-primary" type="submit" onclick={() => { 
                deleteModal = false; 
                showToast({
                    type: 'success',
                    message: 'Record Deleted',
                    duration: 100000,
                    dismissible: true,
                    positionX: 'right',
                    positionY: 'top'
                }); 
            }}>Submit</button>
            </div>
        </form>
    {/snippet}
</ModalMany>