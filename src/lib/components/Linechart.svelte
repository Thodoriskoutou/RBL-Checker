<script lang="ts">
	import { onDestroy } from 'svelte';
	import type ApexCharts from 'apexcharts';
	import type { Color } from '$lib/components/types.ts';
	import { ChartColor } from '$lib/helper';

	type LineChart = {
		Curve?:
			| 'smooth'
			| 'straight'
			| 'stepline'
			| 'linestep'
			| 'monotoneCubic'
			| 'smooth'
			| 'straight'
			| 'stepline'
			| 'linestep'
			| 'monotoneCubic';
		color?: Color;
		Series: { name: string; data: number[] }[];
		Categories: string[];
		Title?: string;
		Height?: number;
	};

	let {
		Series,
		Categories,
		Title,
		Height = 350,
		color = 'primary',
		Curve = 'straight'
	}: LineChart = $props();

	let chart: ApexCharts | null = null;

	async function initializeChart() {
		const ApexChartsModule = await import('apexcharts');
		const ApexCharts = ApexChartsModule.default;
		const options: ApexCharts.ApexOptions = {
			chart: {
				height: Height,
				type: 'line',
				toolbar: {
					show: false
				},
				zoom: {
					enabled: false
				}
			},
			series: Series,
			dataLabels: {
				enabled: false
			},
			stroke: {
				curve: Curve,
				width: [4, 4, 4]
			},
			title: {
				text: Title,
				align: 'center',
				style: {
					color: 'oklch(var(--bc))'
				}
			},
			legend: {
				show: false
			},
			grid: {
				strokeDashArray: 0,
				borderColor: 'color-mix(in oklab, var(--color-base-content) 40%, transparent)',
				padding: {
					top: -20,
					right: 0
				}
			},
			colors: ['var(--color-primary)'],
			xaxis: {
				type: 'category',
				categories: Categories,
				axisBorder: {
					show: false
				},
				axisTicks: {
					show: false
				},
				tooltip: {
					enabled: false
				},
				labels: {
					offsetY: 5,
					style: {
						colors: 'var(--color-base-content)',
						fontSize: '12px',
						fontWeight: 400
					}
				}
			},
			yaxis: {
				labels: {
					align: 'left',
					minWidth: 0,
					maxWidth: 140,
					style: {
						colors: 'var(--color-base-content)',
						fontSize: '12px',
						fontWeight: 400
					}
				}
			}
		};
		chart = new ApexCharts(document.querySelector('#apex-single-line-chart'), options);
		await chart.render();
	}

	$effect(() => {
		initializeChart();
	});

	onDestroy(() => {
		if (chart) {
			chart.destroy();
		}
	});
</script>

<div id="apex-single-line-chart" class="w-full"></div>
