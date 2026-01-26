<script lang="ts">
	import { type Size } from './types';

	type Datatable = {
		page_number?: string;
		btnSize?: Size;
		headers: string[];
		onEditClick?: (record_id: string | number) => any;
		onDeleteClick?: (record_id: string | number) => any;
		Rows: Array<Array<string>>;
		action?: boolean;
		EditRedirect?: string | number | ((id: string | number) => string) | undefined;
		hideEdit?: boolean;
	};

	let {
		headers,
		action = false,
		page_number = '5',
		Rows,
		onEditClick,
		onDeleteClick,
		EditRedirect,
		hideEdit = false
	}: Datatable = $props();

	const options = {
		pageLength: 50,
		pagingOptions: {
			pageBtnClasses: 'btn btn-text btn-circle btn-sm'
		}
	};
	const showId = $derived(headers[0] !== '_');
</script>

<div
	class="bg-base-100 flex flex-col rounded-md shadow-base-300/20 shadow-sm"
	data-datatable={JSON.stringify(options)}
>
	<div class="overflow-x-auto">
		<div class="inline-block min-w-full align-middle">
			<div class="overflow-hidden">
				<table class="table min-w-full">
					<thead>
						<tr class="text-center">
							{#each headers as header, i}
								{#if (i === 0 && showId) || i > 0}
									<th scope="col" class="group text-center">
										<div class="flex items-center justify-center">
											{header}
											<span class="icon-[tabler--chevron-up] hidden datatable-ordering-asc:block"
											></span>
											<span class="icon-[tabler--chevron-down] hidden datatable-ordering-desc:block"
											></span>
										</div>
									</th>
								{/if}
							{/each}
						</tr>
					</thead>
					<tbody>
						{#each Rows as row}
							<tr>
								{#each row as text, i}
									{#if (i === 0 && showId) || i > 0}
										<td class="text-center">{text}</td>
									{/if}
								{/each}
								{#if action}
									<td class="text-center flex justify-center align-center">
										{#if !hideEdit}
											{#if onEditClick && EditRedirect}
												<button
													class="btn btn-circle btn-text btn-sm"
													aria-label="Edit"
													onclick={() => onEditClick(row[0])}
												><span class="icon-[tabler--pencil] size-5"></span></button>
											{:else}
												<a
													href={typeof EditRedirect === 'function'
														? EditRedirect(row[0])
														: EditRedirect != null
															? String(EditRedirect)
															: undefined}
													class="btn btn-circle btn-text btn-sm"
													aria-label="Edit"><span class="icon-[tabler--pencil] size-5"></span></a
												>
											{/if}
										{/if}
										{#if onDeleteClick}
											<button
												class="btn btn-circle btn-text btn-sm"
												aria-label="Action button"
												onclick={() => onDeleteClick(row[0])}
											>
												<span class="icon-[tabler--trash] size-5"></span>
											</button>
										{/if}
									</td>
								{/if}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
	<div
		class="border-base-content/25 flex items-center justify-between gap-3 border-t p-3 max-md:flex-wrap max-md:justify-center"
	>
		<div class="text-sm text-base-content/80" data-datatable-info="">
			Showing
			<span data-datatable-info-from=""></span>
			to
			<span data-datatable-info-to=""></span>
			of
			<span data-datatable-info-length=""></span>
			records
		</div>
		<div class="flex hidden items-center space-x-1" data-datatable-paging="">
			<button type="button" class="btn btn-text btn-circle btn-sm" data-datatable-paging-prev="">
				<span aria-hidden="true">«</span>
				<span class="sr-only">Previous</span>
			</button>
			<div
				class="flex items-center space-x-1 [&>.active]:text-bg-soft-primary"
				data-datatable-paging-pages=""
			></div>
			<button type="button" class="btn btn-text btn-circle btn-sm" data-datatable-paging-next="">
				<span class="sr-only">Next</span>
				<span aria-hidden="true">»</span>
			</button>
		</div>
	</div>
</div>
