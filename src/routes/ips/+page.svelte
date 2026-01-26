<script lang="ts">
	import type { PageProps } from './$types';
	import { enhance, applyAction } from '$app/forms';
	import Datatable from '$lib/components/Datatable.svelte';
	import ModalMany from '$lib/components/ModalMany.svelte';
	import { showToast } from '$lib/Toast';
	let { data }: PageProps = $props();
	let modalOpen = $state(false);
	let modalIndex: string | number | undefined = $state();

	// TODO: add table link to per-ip history /history?ip=${record.ip}
</script>

<div class="flex justify-between items-center">
	<h1 class="text-base-content text-4xl m-4 ml-0 flex">IPS</h1>
	<a href={data.activeMenu!.link + '/new'} title="Add a new IP" class="btn btn-primary btn-circle"
		>+</a
	>
</div>

<Datatable
	Rows={data.records}
	headers={['_', 'ip', 'notes', 'ptr', 'listed', 'Actions']}
	action={true}
	onDeleteClick={(recordId) => {
		modalIndex = recordId;
		modalOpen = true;
	}}
	hideEdit={true}
></Datatable>

<ModalMany
	position="middle"
	size="lg"
	Id="deleteModal"
	title="Delete Row"
	open={modalOpen}
	close={() => (modalOpen = false)}
	recordId={modalIndex}
>
	{#snippet Body(recordId: string | number | undefined)}
		<h1>Are you sure you want to delete this row</h1>
		<form
			method="POST"
			action="?/delete"
			use:enhance={({}) => {
				return async ({ result, update }) => {
					if (result.type === 'success') {
						await update();
					} else {
						await applyAction(result);
					}
				};
			}}
		>
			<input type="hidden" name="recordId" value={recordId} />
			<div class="modal-footer">
				<button
					class="btn btn-primary"
					type="submit"
					onclick={() => {
						modalOpen = false;
						showToast({
							type: 'success',
							message: 'Record Deleted',
							duration: 100000,
							dismissible: true,
							positionX: 'right',
							positionY: 'top'
						});
					}}>Submit</button
				>
			</div>
		</form>
	{/snippet}
</ModalMany>
