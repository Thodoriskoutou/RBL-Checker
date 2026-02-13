<script lang="ts">
	import { enhance, applyAction } from '$app/forms';
	import { showToast } from '$lib/Toast';
	import Input from '$lib/components/Input.svelte';
	import { goto } from '$app/navigation';
</script>

<form
	method="POST"
	action="?/create"
	use:enhance={() => {
		return async ({ result, update }) => {
			if (result.type === 'success') {
				await update();
				goto('/ips');
			} else {
				await applyAction(result);
			}
		};
	}}
>
	<div class="flex gap-4">
		<Input labels={['Please enter ip', null, null, null]} name="ip" minlength={7} required />
		<Input labels={['Please enter notes', null, null, null]} name="notes" />
	</div>
	<div class="modal-footer">
		<button
			class="btn btn-primary"
			type="submit"
			onclick={() => {
				showToast({
					type: 'success',
					message: 'Record Created',
					duration: 100000,
					dismissible: true,
					positionX: 'right',
					positionY: 'top'
				});
			}}>
			Submit
		</button>
	</div>
</form>
