<script lang="ts">
import Icon from '@iconify/svelte'
type SideItems = {
    url:string,
    icon:string,
    title:string,
    external?:boolean
}

type Sidebar={
    name_company:string,
    logo_company:string,    
    name_user?:string,
    Home?:SideItems[],
    Services:SideItems[],
    Domains?:SideItems[],
    Footer?:SideItems[],
    service_title?:string,
    domains_title?:string,
    cta_footer?:boolean,
    help?:SideItems[],
    help_title?:string
}

let {name_company,logo_company,name_user,Home,Services,Domains,Footer,service_title,domains_title,cta_footer,help,help_title}:Sidebar=$props()
</script>

<aside
		id="layout-sidebar"
		class="overlay overlay-open:translate-x-0 drawer drawer-start sm:w-64 inset-y-0 start-0 hidden h-full [--auto-close:lg] lg:z-50 lg:block lg:translate-x-0 lg:shadow-none"
		aria-label="Sidebar"
		tabindex="-1"
	>
		<div class="drawer-body border-base-content/20 h-full border-e p-0">
			<div class="flex h-full max-h-full flex-col">
				<button
					type="button"
					class="btn btn-text btn-circle btn-sm absolute end-3 top-3 lg:hidden"
					aria-label="Close"
					data-overlay="#layout-sidebar"
				>
					<span class="icon-[tabler--x] size-4.5"></span>
				</button>
				<div class="aside-header flex flex-col gap-2 p-4 justify-center items-center border-b border-base-content/20">
				
					<div class="flex flex-col overflow-hidden quote">
						<span class="truncate font-semibold text-base-content text-center text-xl">{name_company}</span>
						<span class="truncate text-xs text-base-content/70">{name_user}</span>
					</div>
				</div>
				<div class="h-full overflow-y-auto">
					<ul class="menu menu-sm gap-1 p-3">
                        <!-- class:menu-active={globalThis.$page.url.pathname === `${link.url}`} -->
                        {#each Home as link}
                            <li>
                                <a
                                    href={link.url}
                                    data-sveltekit-reload
                                    class="inline-flex w-full items-center px-2"
                                >
                                    <span class=""><Icon height={24} icon={link.icon}/></span>
                                    <span>{link.title}</span>
                                </a>
                            </li>
                        {/each}
                        {#if service_title}
                        <hr class="border-base-content/20 -mx-2 my-1" />
						<li class="menu-title">{service_title}</li>
                        {/if}
                        {#each Services as link}
                            <li>
                                <a
                                    href={link.url}
                                    class="inline-flex w-full items-center px-2"
                                    target={link?.external ? "_blank" : "_self"}
                                >
                                    <span class=""><Icon height={24} icon={link.icon}/></span>
                                    <span>{link.title}</span>
                                </a>
                            </li>
                        {/each}
                        {#if help_title}
                            <hr class="border-base-content/20 -mx-2 my-1" />
                            <li class="menu-title">{help_title}</li>
                        {/if}
                        {#each help as link}
                        <li>
							<a
								href={link.url}
								class="inline-flex w-full items-center px-2"
                                target={link?.external ? "_blank" : "_self"}
							>
                                <span class=""><Icon height={24} icon={link.icon}/></span>
                                <span>{link.title}</span>
                            </a>
                        </li>
                        {/each}
                        {#if domains_title}
                            <hr class="border-base-content/20 -mx-2 my-1" />
                            <li class="menu-title">{domains_title}</li>
                        {/if}
                            {#each Domains as link}
						<li>
							<a
								href={link.url}
								class="inline-flex w-full items-center px-2"
							>
                                <span class=""><Icon height={24} icon={link.icon}/></span>
                                <span>{link.title}</span>
                            </a>
                        </li>
						
                        {/each}
						<hr class="border-base-content/20 -mx-2 my-1" />
						{#each Footer as link}
                            <li>
                                <a
                                    href={link.url}
                            
                                    class="inline-flex w-full items-center px-2"
                                >
                                    <span class=""><Icon height={24} icon={link.icon}/></span>
                                    <span>{link.title}</span>
                                </a>
                            </li>
                        {/each}
					</ul>
                    {#if cta_footer}
                        <div class="bg-base-200/30 border-base-content/10 mt-85 rounded-md border p-3">
                            <div class="avatar avatar-placeholder">
                                <div class="bg-neutral text-neutral-content w-10 rounded-full">
                                <span class="icon-[tabler--crown] size-6 shrink-0"></span>
                                </div>
                            </div>
                            <h5 class="text-base-content mt-4 text-lg font-semibold">Upgrade to Pro</h5>
                            <p class="text-base-content/80 text-xs">Reminder, extra projects, advanced search and more</p>
                            <a class="btn btn-primary btn-block mt-2" href="/">Upgrade Now</a>
                        </div>
                    {/if}
				</div>
			</div>
		</div>
	</aside>