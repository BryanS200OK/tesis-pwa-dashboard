<!-- src/lib/components/LineChart.svelte -->
<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import * as echarts from "echarts";

  let {
    id = "chart",
    title = "",
    seriesName = "Valor", // NUEVA PROPIEDAD: Nombre para el tooltip
    dataAxis = [],
    dataSeries = [],
    lineColor = "#22d3ee",
    areaColor = "rgba(34, 211, 238, 0.2)",
  } = $props();

  let chartContainer: HTMLDivElement;
  let chartInstance: echarts.ECharts | null = null;

  const updateChart = () => {
    if (!chartInstance) return;

    const option = {
      title: {
        text: title,
        show: title !== "",
        textStyle: { color: "#9ca3af", fontSize: 14 },
      },
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(0,0,0,0.8)",
        textStyle: { color: "#fff" },
        // Formato para que se vea más pro
        valueFormatter: (value: number) => value + " m³",
      },
      grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: dataAxis,
        axisLine: { lineStyle: { color: "#4b5563" } },
        axisLabel: { color: "#9ca3af", fontSize: 10 },
      },
      yAxis: {
        type: "value",
        splitLine: { lineStyle: { color: "#1f2937", type: "dashed" } },
        axisLabel: { color: "#9ca3af", fontSize: 10 },
      },
      series: [
        {
          name: seriesName, // AQUÍ ESTÁ LA MAGIA DEL TOOLTIP
          type: "line",
          smooth: true,
          symbol: "circle", // Para que el punto se vea mejor al pasar el cursor
          symbolSize: 6,
          showSymbol: false,
          lineStyle: {
            color: lineColor,
            width: 3,
            shadowColor: lineColor,
            shadowBlur: 10,
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: areaColor },
              { offset: 1, color: "rgba(0,0,0,0)" },
            ]),
          },
          data: dataSeries,
        },
      ],
    };
    chartInstance.setOption(option);
  };

  onMount(() => {
    chartInstance = echarts.init(chartContainer);
    updateChart();
    window.addEventListener("resize", () => chartInstance?.resize());
  });

  onDestroy(() => {
    if (chartInstance) {
      window.removeEventListener("resize", () => chartInstance?.resize());
      chartInstance.dispose();
    }
  });

  $effect(() => {
    if (chartInstance && dataAxis.length > 0 && dataSeries.length > 0) {
      updateChart();
    }
  });
</script>

<div bind:this={chartContainer} {id} class="w-full h-full min-h-[300px]"></div>
