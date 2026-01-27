<script lang="ts">
import {onDestroy } from 'svelte';
import type ApexCharts from 'apexcharts';
import {ChartColor} from '$lib/helper'
import type { Color } from './types';

type DoughnutChart = {
    colors?:Color[],
    Data:number[],
    Categories:string[],
    Height?:number,
    Size?:string,
    DataTitle:string
}

let {Data,Categories,Height=350,colors=[],Size="70%",DataTitle}:DoughnutChart = $props()

let chart: ApexCharts | null = null

const DonutColors = $derived(colors.map(ChartColor))

async function initializeChart() {
    const ApexChartsModule = await import('apexcharts')
    const ApexCharts = ApexChartsModule.default

    const options: ApexCharts.ApexOptions  = {
        chart: {
            height:Height,
            type: "donut"
        },
        plotOptions : {
            pie: {
                donut: {
                    size: Size,
                    labels:{
                        show:true,
                        name:{
                            fontSize: "2rem"
                        },
                        value:{
                            fontSize: "1.5rem",
                            color: 'var(--color-base-content)',
                            formatter: function (val) {
                                return parseInt(val, 10) + "%"
                            }
                        },
                    total:{
                        show:true,
                        fontSize: "1rem",
                        label: DataTitle,
                        color: 'var(--color-primary)',
                    }
                    }
                }
            }
        },
        series:Data,
        labels:Categories,
        legend: {
            show: true,
            position:"bottom",
            markers: {offsetX: -3},
            labels:{
                useSeriesColors:true
            }
        },
        dataLabels:{
            enabled:false
        },
        stroke:{
            show:false,
            curve:"straight"
        },
        colors:['var(--color-primary)', 'var(--color-secondary)', 'var(--color-info)'],
        states:{
            hover:{
                filter:{
                    type:"none"
                }
            }
        },
        tooltip:{
            enabled:true
        }
    }
    chart = new ApexCharts(document.querySelector('#apex-doughnut-chart'), options)
    await chart.render()
}
$effect(() => {
    initializeChart()
});

onDestroy(() => {
    if (chart) {
        chart.destroy()
    }
});
</script>

<div id="apex-doughnut-chart"></div>