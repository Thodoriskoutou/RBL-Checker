<script lang="ts">
import type { RecordModel } from "pocketbase"
import type { PageProps } from '../$types';
import { slide } from 'svelte/transition';
import { enhance, applyAction } from '$app/forms'
import Input from "$lib/components/Input.svelte"
import Checkbox from "$lib/components/Checkbox.svelte"
import Select from "$lib/components/Select.svelte"
import Switch from "$lib/components/Switch.svelte"
import { goto } from "$app/navigation"
import { showToast } from "$lib/Toast"
import Icon from "@iconify/svelte"

let { data }: PageProps = $props()

const recordId = data.records.id

let fromemail = $state(false)

function ActivateInput(){
    fromemail = !fromemail
}
</script>

{#if recordId}
        <div class="max-w-5xl mx-auto">
            <div class="card bg-base-100 shadow-xl border border-base-200">
                <div class="card-body p-10 space-y-8">

                    <!-- Header -->
                    <div class="flex items-center justify-between">
                        <div>
                            <h2 class="text-2xl font-bold">Edit rbls</h2>
                            <p class="text-sm text-base-content/60 mt-1">
                                Update configuration and availability settings
                            </p>
                        </div>
                    </div>

                    <form
                        method="POST"
                        action="?/edit"
                        use:enhance={() => {
                            return async ({ result, update }) => {
                                if (result.type === 'success') {
                                    await update()
                                    goto('/rbls')
                                } else {
                                    await applyAction(result)
                                }
                            }
                        }}
                        class="space-y-10"
                    >

                        <!-- General Configuration -->
                        <section class="space-y-6">
                            <div class="border-b border-base-200 pb-3">
                                <h3 class="text-sm font-semibold uppercase tracking-widest text-base-content/60">
                                    General Configuration
                                </h3>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                                <Input
                                    labels={["Name", null, null, null]}
                                    name="name"
                                    value={record.name}
                                    minlength={3}
                                    required
                                />

                                <Input
                                    labels={["Delist", null, null, null]}
                                    name="delist"
                                    value={record.delist}
                                />

                                <Input
                                    labels={["Domain", null, null, null]}
                                    name="domain"
                                    value={record.domain}
                                />
                            </div>

                            <!-- Disabled Toggle -->
                            <div class="flex items-center justify-between rounded-xl border border-base-200 bg-base-200/40 px-6 py-4">
                                <div>
                                    <p class="font-medium">Disable Record</p>
                                    <p class="text-sm text-base-content/60">
                                        Prevent this record from being used
                                    </p>
                                </div>

                                <Switch
                                    labels={["Disabled", null]}
                                    name="disabled"
                                    checked={record.disabled}
                                    value="on"
                                    type="checkbox"
                                />
                            </div>
                        </section>

                        <!-- Actions -->
                        <div class="flex justify-end gap-3 border-t border-base-200 pt-6">
                            <button
                                type="submit"
                                class="btn btn-primary px-10"
                                onclick={() => {
                                    showToast({
                                        type: 'success',
                                        message: 'Record Saved',
                                        duration: 100000,
                                        dismissible: true,
                                        positionX: 'right',
                                        positionY: 'top'
                                    })
                                }}
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

{:else}
    <div class="max-w-5xl mx-auto">
        <div class="card bg-base-100 shadow-xl border border-base-200">
            <div class="card-body p-10 space-y-8">

                <div>
                    <h2 class="text-2xl font-bold">Create Record</h2>
                    <p class="text-sm text-base-content/60 mt-1">
                        Configure a new record and its availability
                    </p>
                </div>

                <form
                    method="POST"
                    action="?/create"
                    use:enhance={() => {
                        return async ({ result, update }) => {
                            if (result.type === 'success') {
                                await update()
                                goto('/rbls')
                            } else {
                                await applyAction(result)
                            }
                        }
                    }}
                    class="space-y-10"
                >

                    <section class="space-y-6">
                        <div class="border-b border-base-200 pb-3">
                            <h3 class="text-sm font-semibold uppercase tracking-widest text-base-content/60">
                                General Configuration
                            </h3>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                            <Input labels={["Name", null, null, null]} name="name" minlength={3} required />
                            <Input labels={["Domain", null, null, null]} name="domain" required />
                            <Input labels={["Delist", null, null, null]} name="delist" />
                        </div>

                        <div class="flex items-center justify-between rounded-xl border border-base-200 bg-base-200/40 px-6 py-4">
                            <div>
                                <p class="font-medium">Disable Record</p>
                                <p class="text-sm text-base-content/60">
                                    Prevent this record from being used
                                </p>
                            </div>

                            <Switch labels={["Disabled", null]} name="disabled" value="on" />
                            <Switch labels={["can_ignore", null]} name="can_ignore" value="on" />
                        </div>
                    </section>

                    <div class="flex justify-end border-t border-base-200 pt-6">
                        <button
                            type="submit"
                            class="btn btn-primary px-10"
                            onclick={() => {
                                showToast({
                                    type: 'success',
                                    message: 'Record Created',
                                    duration: 100000,
                                    dismissible: true,
                                    positionX: 'right',
                                    positionY: 'top'
                                })
                            }}
                        >
                            Create Record
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
{/if}
