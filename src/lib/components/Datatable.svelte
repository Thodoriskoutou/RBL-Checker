<script lang="ts">
	import { type Size } from './types';
	import { goto } from '$app/navigation'
	import type { data } from 'jquery';
	
	function goToPage(p: number) {
		goto(`?page=${p}`)
	}

	type Datatable = {
		page_number?: string;
		btnSize?: Size;
		headers: string[];
		page?: number;
		total_pages?: number;
		onEditClick?: (record_id: string | number) => any;
		onDeleteClick?: (record_id: string | number) => any;
		Rows: Array<Array<string>>;
		action?: boolean;
		EditRedirect?: string | number | ((id: string | number) => string) | undefined;
		hideEdit?: boolean;
		from: number;
		to: number;
		totalItems: number;
		per_page: number;
	};

	let {
		headers,
		action = false,
		page_number = '5',
		total_pages ,
		page=1,
		Rows,
		onEditClick,
		onDeleteClick,
		EditRedirect,
		hideEdit = false,
		from,
		to,
		totalItems,
		per_page
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
		<div class="text-sm text-base-content/80">
			Showing
			<span >{from}</span>
			to
			<span >{to}</span>
			of
			<span >{totalItems}</span>
			records
		</div>
		<div class="flex justify-center gap-2 mt-4">
			<button
				type="button" class="btn btn-text btn-circle btn-sm"
				disabled={page === 1}
				onclick={() => goToPage(page- 1)}>
					<span aria-hidden="true">«</span>
					<span class="sr-only">Previous</span>
			</button>
	
		<div class="flex items-center space-x-1 [&>.active]:text-bg-soft-primary">
			{page}/{total_pages}
		</div>
			<button type="button" class="btn btn-text btn-circle btn-sm" disabled={page === total_pages}
			onclick={() => goToPage(page + 1)}>
					<span class="sr-only">Next</span>
					<span aria-hidden="true">»</span>
			</button>
		</div>
	</div>
</div>
