<!-- src/lib/components/DonutChart.svelte -->
<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import * as echarts from "echarts";

  let {
    id = "donut-chart",
    value = 0, // Recibirá el nivel de gas (0-100)
    color = "#22d3ee", // Color base (Cyan)
  } = $props();

  let chartContainer: HTMLDivElement;
  let chartInstance: echarts.ECharts | null = null;

  const updateChart = () => {
    if (!chartInstance) return;

    // Calculamos cuánto falta para el 100%
    const remainder = Math.max(0, 100 - value);

    const option = {
      tooltip: {
        trigger: "item",
        backgroundColor: "#000",
        textStyle: { color: "#fff" },
      },
      series: [
        {
          name: "Distribución de Gas",
          type: "pie",
          radius: ["55%", "80%"], // El espacio hueco del centro (Dona)
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 8,
            borderColor: "#001410",
            borderWidth: 4,
          },
          label: { show: false },
          data: [
            {
              value: value,
              name: "Gas Almacenado",
              itemStyle: { color: color, shadowBlur: 15, shadowColor: color },
            },
            {
              value: remainder,
              name: "Espacio Libre",
              itemStyle: { color: "rgba(255,255,255,0.05)" }, // Gris transparente
            },
          ],
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

  // Efecto reactivo: Si el nivel de gas cambia, se redibuja sola
  $effect(() => {
    if (chartInstance) {
      updateChart();
    }
  });
</script>

<div bind:this={chartContainer} {id} class="w-full h-full min-h-[200px]"></div>
