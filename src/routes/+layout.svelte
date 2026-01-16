<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { themeChange } from 'theme-change';
	import { afterNavigate } from '$app/navigation';
	import type { LayoutData } from './$types';
	import logoLight from '$lib/assets/logo_light.svg';
	import logoDark from '$lib/assets/logo_dark.svg';
	import ToggleNightMode from '$lib/components/ToggleNightMode.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Avatar from '$lib/components/Avatar.svelte';

	let { data, children } = $props<{ data: LayoutData }>();

	const user = $derived(data.user);
	const company = $derived(data.company);
	let isDark = $state(false);
	onMount(async () => {
		await import('flyonui/flyonui');
		themeChange(false);
		isDark = document.documentElement.getAttribute('data-theme') === 'black';
	});

	afterNavigate(() => {
		if (typeof window !== 'undefined' && window.HSStaticMethods) {
			window.HSStaticMethods.autoInit();
		}
		
	});
	
</script>

<svelte:head>
	<title>RBL Checker</title>
</svelte:head>

<div class="bg-base-200 flex min-h-screen flex-col">

	<div class="bg-base-100 border-base-content/20 lg:ps-75 sticky top-0 z-50 flex border-b">
		<div class="mx-auto w-full">
			<nav class="navbar py-2">
				<div class="navbar-start items-center gap-2">
					<button
						type="button"
						aria-label="button"
						class="btn btn-ghost btn-square lg:hidden"	
					>
						<span class="icon-[tabler--menu-2] size-4.5"></span>
					</button>

			
					</div>
				<div class="navbar-end items-center gap-6">
					<ToggleNightMode icon_moon={'tabler:moon'}  icon_sun={'tabler:sun'}  active={isDark}  Event={() => (isDark = !isDark)}/>
					<Avatar name={'AB'} textSize={'md'} textColor={'neutral'} avatarSize={10} avatarColor={'primary'}/> 
					</div>
			</nav>
		</div>
	</div> 
	<!-- ---------- END HEADER ---------- -->
	<Sidebar 
		name_company='Email4Dev'
		logo_company={isDark ? logoDark : logoLight} 
		Home={[{url:'/',icon:'mdi:chart-bar',title:'Dashboard'}]}
		Services={[{url:'/domains',icon:'meteor-icons:globe',title:'Domains'},{url:'/handlers',icon:'mynaui:zap',title:'Handlers'},{url:'/forms',icon:'material-symbols:format-image-left-rounded',title:'Forms'}]}
		cta_footer={true}
		help={[{url:'https://sendersupport.olc.protection.outlook.com/snds/index',icon:'material-symbols:help-outline',title:'Outlook SNDS'}]}
			/>
	

	<!-- ---------- MAIN CONTENT ---------- -->
	<main class="lg:ps-75 min-w-0 flex-1" >
		<div class="mx-auto w-full max-w-8xl  p-3 sm:p-5 lg:p-7">
			{@render children()}
		</div>
	</main>
	<!-- ---------- END MAIN CONTENT ---------- -->
</div>
