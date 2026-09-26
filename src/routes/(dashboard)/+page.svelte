<script lang="ts">
  import { onMount } from "svelte";
  import {
    collection,
    onSnapshot,
    query,
    orderBy,
    limit,
  } from "firebase/firestore";
  import { db } from "../../lib/firebase/firebase";
  import LineChart from "$lib/components/LineChart.svelte";
  import DonutChart from "$lib/components/DonutChart.svelte";
  import * as echarts from "echarts";

  // --- LÓGICA DE TIEMPO REAL (Reloj Vivo) ---
  let tiempoActual = $state(new Date());

  // --- VARIABLES DE INTELIGENCIA ARTIFICIAL ---
  type TipoPronostico = {
    mensaje?: string;
    temperatura_promedio?: number;
    metano_proyectado_ppm?: number;
    analisis?: string;
  };
  let pronosticoIA = $state<TipoPronostico | null>(null);
  let cargandoIA = $state(true);
  let errorIA = $state<string | null>(null);

  // --- VARIABLES REACTIVAS PARA LAS TARJETAS ---
  let valTemperatura = $state("0.0");
  let valGas = $state("0");
  let valPresion = $state("1.23");
  let valPh = $state("6.85");
  let valCaudal = $state("1.45");
  let valHumedad = $state("65");

  // Producción total simulada basada en el caudal actual
  let totalProduccion = $derived((parseFloat(valCaudal) * 1.62).toFixed(2));

  // Evalúa automáticamente si la temperatura supera los 40 grados
  let alertaTemperaturaAlta = $derived(parseFloat(valTemperatura) > 40);

  // --- VARIABLES REACTIVAS PARA LAS GRÁFICAS ---
  let historialHoras = $state<string[]>([]);
  let historialMetano = $state<number[]>([]);

  // Historiales para la gráfica cruzada
  let historialTemp = $state<number[]>([]);
  let historialPresion = $state<number[]>([]);
  let historialPh = $state<number[]>([]);
  let historialCaudal = $state<number[]>([]);

  // Referencia para el contenedor de la gráfica cruzada
  let multiChartContainer: HTMLDivElement;
  let multiChartInstance: echarts.ECharts | null = null;

  onMount(() => {
    // Inicializamos la gráfica multilínea
    if (multiChartContainer) {
      multiChartInstance = echarts.init(multiChartContainer);
      window.addEventListener("resize", () => multiChartInstance?.resize());
    }

    // --- PETICIÓN AL MOTOR DE IA (FastAPI) ---
    const fetchIA = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/pronostico-general");
        if (!res.ok) throw new Error("Fallo al conectar con el backend");
        pronosticoIA = await res.json();
      } catch (e) {
        errorIA = (e as Error).message;
      } finally {
        cargandoIA = false;
      }
    };
    fetchIA(); // Llama la primera vez
    // Actualizar el pronóstico de IA cada 60 segundos
    const intervaloIA = setInterval(fetchIA, 60000);

    // 1. Ciclo del Reloj
    const intervalo = setInterval(() => {
      tiempoActual = new Date();
    }, 1000);

    // 2. Conexión a Firebase (Pedimos 15 registros para las gráficas)
    const q = query(
      collection(db, "lecturas_biodigestor"),
      orderBy("timestamp", "desc"),
      limit(15),
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const horas: string[] = [];
      const metanos: number[] = [];
      const temps: number[] = [];
      const presiones: number[] = [];
      const phs: number[] = [];
      const caudales: number[] = [];
      let primerDocumento = true;

      querySnapshot.forEach((doc) => {
        const data = doc.data();

        if (data.timestamp) {
          const fecha = data.timestamp.toDate();
          horas.unshift(
            fecha.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
          );

          // Datos reales (o 0 si fallan)
          metanos.unshift(data.metano_ppm || 0);
          temps.unshift(data.temperatura_c || 0);

          // SIMULACIÓN TEMPORAL: Como el ESP32 aún no envía esto, creamos una pequeña variación
          presiones.unshift(
            data.presion || parseFloat((1.2 + Math.random() * 0.06).toFixed(2)),
          );
          phs.unshift(
            data.ph || parseFloat((6.8 + Math.random() * 0.1).toFixed(2)),
          );
          caudales.unshift(
            data.caudal || parseFloat((1.4 + Math.random() * 0.1).toFixed(2)),
          );

          // Actualizamos las tarjetas SOLO con el dato más reciente
          if (primerDocumento) {
            if (data.temperatura_c)
              valTemperatura = data.temperatura_c.toFixed(1);
            if (data.metano_ppm) valGas = data.metano_ppm.toString();

            // Actualizamos los valores de las tarjetas
            valPresion = presiones[0].toString();
            valPh = phs[0].toString();
            valCaudal = caudales[0].toString();

            primerDocumento = false;
          }
        }
      });

      // Sobrescribimos el estado para animar las gráficas
      historialHoras = horas;
      historialMetano = metanos;
      historialTemp = temps;
      historialPresion = presiones;
      historialPh = phs;
      historialCaudal = caudales;
    });

    return () => {
      clearInterval(intervalo);
      clearInterval(intervaloIA);
      unsubscribe();
      if (multiChartInstance) {
        window.removeEventListener("resize", () =>
          multiChartInstance?.resize(),
        );
        multiChartInstance.dispose();
      }
    };
  });

  // Efecto para actualizar la gráfica multilínea
  $effect(() => {
    if (multiChartInstance && historialHoras.length > 0) {
      multiChartInstance.setOption({
        tooltip: {
          trigger: "axis",
          backgroundColor: "rgba(0,0,0,0.8)",
          textStyle: { color: "#fff" },
        },
        grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: historialHoras,
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
            name: "Temp (°C)",
            type: "line",
            smooth: true,
            symbol: "none",
            itemStyle: { color: "#34d399" },
            lineStyle: { width: 3, shadowColor: "#34d399", shadowBlur: 10 },
            data: historialTemp,
          },
          {
            name: "Presión (kPa)",
            type: "line",
            smooth: true,
            symbol: "none",
            itemStyle: { color: "#60a5fa" },
            lineStyle: { width: 3, shadowColor: "#60a5fa", shadowBlur: 10 },
            data: historialPresion,
          },
          {
            name: "pH",
            type: "line",
            smooth: true,
            symbol: "none",
            itemStyle: { color: "#c084fc" },
            lineStyle: { width: 3, shadowColor: "#c084fc", shadowBlur: 10 },
            data: historialPh,
          },
          {
            name: "Caudal",
            type: "line",
            smooth: true,
            symbol: "none",
            itemStyle: { color: "#fb923c" },
            lineStyle: { width: 3, shadowColor: "#fb923c", shadowBlur: 10 },
            data: historialCaudal,
          },
        ],
      });
    }
  });

  // Derivaciones reactivas del reloj
  let fechaFormateada = $derived(
    tiempoActual.toLocaleDateString("es-VE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
  );
  let horaFormateada = $derived(
    tiempoActual.toLocaleTimeString("es-VE", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
  );

  // --- DATOS DE MÉTRICAS (TARJETAS) ---
  let metrics = $derived([
    {
      title: "Temperatura",
      value: valTemperatura,
      unit: "°C",
      range: "Rango: 20 - 40 °C",
      color: "text-emerald-400",
      bgGlow: "shadow-[0_0_15px_rgba(52,211,153,0.3)]",
      iconPath:
        "M9 17a5 5 0 116 0c.932-1.393 1-3.238 1-5V6a3 3 0 10-6 0v6c0 1.762.068 3.607 1 5z",
      sparkline:
        "0,15 10,18 20,12 30,20 40,10 50,16 60,8 70,14 80,10 90,18 100,12",
    },
    {
      title: "Presión",
      value: valPresion,
      unit: "kPa",
      range: "Rango: 0 - 5 kPa",
      color: "text-blue-400",
      bgGlow: "shadow-[0_0_15px_rgba(96,165,250,0.3)]",
      iconPath: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
      sparkline:
        "0,20 10,14 20,18 30,8 40,16 50,12 60,18 70,10 80,15 90,8 100,14",
    },
    {
      title: "pH",
      value: valPh,
      unit: "",
      range: "Rango: 6.0 - 8.0",
      color: "text-purple-400",
      bgGlow: "shadow-[0_0_15px_rgba(192,132,252,0.3)]",
      iconPath:
        "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
      sparkline:
        "0,18 10,20 20,16 30,22 40,15 50,20 60,14 70,18 80,12 90,16 100,18",
    },
    {
      title: "Nivel de gas",
      value: valGas,
      unit: "%",
      range: "Rango: 0 - 100 %",
      color: "text-cyan-400",
      bgGlow: "shadow-[0_0_15px_rgba(34,211,238,0.3)]",
      iconPath:
        "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z",
      sparkline:
        "0,10 10,8 20,14 30,10 40,18 50,12 60,20 70,15 80,18 90,10 100,14",
    },
    {
      title: "Caudal de biogás",
      value: valCaudal,
      unit: "m³/h",
      range: "Rango: 0 - 5 m³/h",
      color: "text-orange-400",
      bgGlow: "shadow-[0_0_15px_rgba(251,146,60,0.3)]",
      iconPath:
        "M17.657 18.657A8 8 0 016.343 7.343S7 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z",
      sparkline:
        "0,16 10,12 20,18 30,14 40,10 50,15 60,9 70,14 80,8 90,12 100,16",
    },
    {
      title: "Humedad",
      value: valHumedad,
      unit: "%",
      range: "Rango: 0 - 100 %",
      color: "text-indigo-400",
      bgGlow: "shadow-[0_0_15px_rgba(129,140,248,0.3)]",
      iconPath:
        "M12 2.25c-1.39 2.5-5.25 7.82-5.25 11.25a5.25 5.25 0 0 0 10.5 0c0-3.43-3.86-8.75-5.25-11.25Z",
      sparkline:
        "0,14 10,18 20,12 30,16 40,10 50,15 60,12 70,18 80,14 90,10 100,15",
    },
  ]);
</script>

<div
  class="space-y-6 max-w-[1600px] mx-auto pb-10 px-4 sm:px-6 overflow-x-hidden"
>
  <!-- Contenedor Superior -->
  <div
    class="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4"
  >
    <div>
      <h2 class="glow-title text-3xl font-black tracking-tight">
        Resumen del sistema
      </h2>
      <p class="text-sm text-gray-400 mt-1 font-medium">
        Monitoreo integral y telemetría en tiempo real del biodigestor.
      </p>
    </div>

    <!-- Botones y Reloj -->
    <div class="flex flex-wrap items-center gap-3">
      <div
        class="flex items-center gap-2 bg-[#011612] border border-green-900/50 rounded-md px-4 py-2 text-sm font-mono text-lime-400 shadow-[0_0_10px_rgba(22,163,74,0.2)]"
      >
        <svg
          class="w-4 h-4 animate-pulse"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <span>{fechaFormateada}</span>
        <span class="text-gray-500">|</span>
        <span
          class="text-cyan-400 font-bold tracking-widest drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]"
          >{horaFormateada}</span
        >
      </div>

      <button
        class="interactive-card flex items-center gap-2 bg-gradient-to-r from-green-700 to-green-600 hover:from-green-600 hover:to-lime-600 text-white text-sm font-bold px-5 py-2 rounded-md shadow-[0_0_15px_rgba(22,163,74,0.4)] border border-green-500/50"
      >
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.5"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          ></path>
        </svg>
        Exportar Reporte
      </button>
    </div>
  </div>

  <!-- Tarjetas de Métricas -->
  <div
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 mb-8"
  >
    {#each metrics as metric (metric.title)}
      <div
        class="interactive-card bg-gradient-to-br from-[#012b23] to-black/80 p-5 rounded-2xl border border-green-900/50 flex flex-col justify-between {metric.bgGlow}"
      >
        <div class="flex items-center gap-3 mb-4">
          <div
            class="p-2 bg-black/40 rounded-lg border border-white/10 shadow-inner"
          >
            <svg
              class="w-6 h-6 {metric.color} drop-shadow-md"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d={metric.iconPath}
              />
            </svg>
          </div>
          <span class="text-sm font-bold text-gray-200 tracking-wide"
            >{metric.title}</span
          >
        </div>
        <div class="flex flex-col mb-1 text-center">
          <div
            class="flex items-baseline justify-center space-x-1 drop-shadow-lg"
          >
            <span class="text-4xl font-black text-white">{metric.value}</span>
            <span class="text-sm font-bold {metric.color} opacity-90"
              >{metric.unit}</span
            >
          </div>
          <span
            class="text-[11px] text-gray-400 font-semibold mt-2 bg-black/40 mx-auto px-3 py-1 rounded-full border border-white/5 shadow-inner"
            >{metric.range}</span
          >
        </div>
        <div class="mt-4 h-10 w-full overflow-hidden">
          <svg
            viewBox="0 0 100 25"
            class="w-full h-full {metric.color}"
            preserveAspectRatio="none"
          >
            <polyline
              points={metric.sparkline}
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="opacity-90 data-flow"
              style="filter: drop-shadow(0px 2px 4px currentColor);"
            />
          </svg>
        </div>
      </div>
    {/each}
  </div>

  <!-- SECCIÓN DE INTELIGENCIA ARTIFICIAL -->
  <div
    class="mb-6 interactive-card bg-gradient-to-br from-[#012b23] to-black/80 p-6 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.15)] border border-emerald-500/40 relative overflow-hidden"
  >
    <!-- Resplandor de fondo -->
    <div
      class="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"
    ></div>

    <div class="flex items-center gap-3 mb-4 relative z-10">
      <span class="text-3xl animate-bounce" style="animation-duration: 2s;"
        >🤖</span
      >
      <h3 class="text-emerald-400 font-black text-xl tracking-wide glow-title">
        Pronóstico de IA (Próximos 3 días)
      </h3>
    </div>

    {#if cargandoIA}
      <div
        class="flex items-center gap-3 text-emerald-500/70 p-4 relative z-10"
      >
        <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"
          ><circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle><path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path></svg
        >
        <span class="font-mono text-sm"
          >Analizando termodinámica histórica del tanque...</span
        >
      </div>
    {:else if errorIA}
      <p
        class="text-red-400 font-mono text-sm p-4 bg-red-950/30 rounded-lg border border-red-900/50 relative z-10"
      >
        ⚠️ Error de conexión IA: {errorIA}
      </p>
    {:else if pronosticoIA?.mensaje}
      <p
        class="text-amber-400 font-mono text-sm p-4 bg-amber-950/30 rounded-lg border border-amber-900/50 relative z-10"
      >
        ⏳ {pronosticoIA.mensaje}
      </p>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        <div
          class="bg-black/40 p-4 rounded-xl border border-white/5 shadow-inner"
        >
          <p
            class="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1"
          >
            Temp. Base Estable
          </p>
          <p class="text-3xl font-black text-white">
            {pronosticoIA?.temperatura_promedio}<span
              class="text-lg text-emerald-400 ml-1">°C</span
            >
          </p>
        </div>

        <div
          class="bg-black/40 p-4 rounded-xl border border-white/5 shadow-inner"
        >
          <p
            class="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1"
          >
            Producción Estimada
          </p>
          <p class="text-3xl font-black text-white">
            {pronosticoIA?.metano_proyectado_ppm}<span
              class="text-lg text-cyan-400 ml-1">ppm</span
            >
          </p>
        </div>

        <div
          class="bg-emerald-950/30 p-4 rounded-xl border border-emerald-500/20 shadow-inner flex items-center"
        >
          <p class="text-sm text-emerald-100 leading-relaxed font-medium">
            <span
              class="text-emerald-400 font-bold uppercase tracking-wider text-xs block mb-1"
              >Diagnóstico Operativo:</span
            >
            {pronosticoIA?.analisis}
          </p>
        </div>
      </div>
    {/if}
  </div>

  <!-- Gráficos Principales -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
    <!-- Gráfico 1: Producción de biogás -->
    <div
      class="interactive-card bg-gradient-to-br from-[#01211b] to-black/80 p-6 rounded-2xl shadow-lg border border-green-900/50 h-96 flex flex-col"
    >
      <div class="flex justify-between items-center mb-4">
        <div>
          <h3 class="text-gray-100 font-bold text-lg">
            Producción de biogás (m³)
          </h3>
          <div class="flex items-center gap-2 mt-1">
            <span
              class="w-4 h-1 bg-green-500 rounded animate-pulse shadow-[0_0_5px_#22c55e]"
            ></span>
            <span class="text-xs text-gray-400">Producción diaria actual</span>
          </div>
        </div>
        <div
          class="text-right bg-black/30 p-2 rounded-lg border border-white/5"
        >
          <p class="text-xs text-gray-400 mb-1">Total hoy</p>
          <p class="text-2xl font-black text-white flex items-center gap-2">
            {totalProduccion} m³
            <span
              class="text-xs text-lime-400 bg-lime-900/40 px-2 py-0.5 rounded-full border border-lime-500/30 shadow-[0_0_5px_#4ade80]"
              >+12% vs ayer</span
            >
          </p>
        </div>
      </div>

      <div
        class="flex-1 w-full bg-black/30 border border-dashed border-green-900/50 rounded-xl flex items-center justify-center relative overflow-hidden p-4"
      >
        {#if historialMetano.length > 0}
          <LineChart
            id="chart-produccion-resumen"
            title=""
            dataAxis={historialHoras}
            dataSeries={historialMetano}
            lineColor="#a3e635"
            areaColor="rgba(163, 230, 81, 0.2)"
          />
        {:else}
          <p class="text-gray-500 font-mono text-xs animate-pulse">
            Cargando curva de producción...
          </p>
        {/if}
      </div>
    </div>

    <!-- Gráfico 2: Tendencias Multilínea -->
    <div
      class="interactive-card bg-gradient-to-br from-[#01211b] to-black/80 p-6 rounded-2xl shadow-lg border border-green-900/50 h-96 flex flex-col"
    >
      <h3 class="text-gray-100 font-bold text-lg mb-4">
        Métricas cruzadas en tiempo real
      </h3>
      <div
        class="flex justify-center flex-wrap gap-4 mb-4 text-xs font-medium text-gray-400 bg-black/40 py-2 rounded-lg border border-white/5 shadow-inner"
      >
        <span class="flex items-center gap-2"
          ><span
            class="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse"
          ></span> Temp</span
        >
        <span class="flex items-center gap-2"
          ><span
            class="w-3 h-3 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa] animate-pulse"
            style="animation-delay: 0.2s;"
          ></span> Presión</span
        >
        <span class="flex items-center gap-2"
          ><span
            class="w-3 h-3 rounded-full bg-purple-400 shadow-[0_0_8px_#c084fc] animate-pulse"
            style="animation-delay: 0.4s;"
          ></span> pH</span
        >
        <span class="flex items-center gap-2"
          ><span
            class="w-3 h-3 rounded-full bg-orange-400 shadow-[0_0_8px_#fb923c] animate-pulse"
            style="animation-delay: 0.6s;"
          ></span> Caudal</span
        >
      </div>

      <div
        class="flex-1 w-full bg-black/30 border border-dashed border-green-900/50 rounded-xl flex items-center justify-center relative overflow-hidden p-4"
      >
        <div
          bind:this={multiChartContainer}
          class="w-full h-full min-h-[220px]"
        ></div>
      </div>
    </div>
  </div>

  <!-- Contenedores Inferiores -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
    <div
      class="interactive-card bg-gradient-to-br from-[#012b23] to-black/80 p-6 rounded-2xl shadow-lg border border-green-900/50 flex flex-col"
    >
      <h3 class="text-gray-100 font-bold text-lg mb-4">
        Distribución del nivel de gas
      </h3>
      <div
        class="flex-1 w-full min-h-[200px] bg-[#001410] border border-dashed border-green-900/50 rounded-xl flex flex-col items-center justify-center shadow-inner p-4"
      >
        <DonutChart id="dona-gas" value={parseFloat(valGas)} color="#22d3ee" />
      </div>
    </div>

    <div
      class="interactive-card bg-gradient-to-br from-[#012b23] to-black/80 p-6 rounded-2xl shadow-lg border border-green-900/50"
    >
      <h3 class="text-gray-100 font-bold text-lg mb-4">Estado del Hardware</h3>
      <div class="flex items-center gap-4 mt-2">
        <div
          class="w-1/2 bg-[#001410] rounded-xl h-32 border border-green-900/50 flex items-center justify-center shadow-inner relative overflow-hidden"
        >
          <div class="absolute inset-0 bg-lime-500/10 mix-blend-overlay"></div>
          <span class="text-cyan-400 text-xs font-mono text-center z-10"
            >Modelo 3D / SVG<br />Tanque</span
          >
        </div>
        <ul class="w-1/2 space-y-3 text-xs text-gray-300 font-medium">
          <li
            class="flex justify-between items-center bg-black/30 px-2 py-1.5 rounded shadow-sm"
          >
            <span class="flex gap-2 items-center"
              ><span class="text-lime-400 drop-shadow-[0_0_5px_#a3e635]">●</span
              > Sistema</span
            >
            <span class="text-lime-400 font-bold tracking-wider">ÓPTIMO</span>
          </li>
          <li
            class="flex justify-between items-center bg-black/30 px-2 py-1.5 rounded shadow-sm"
          >
            <span class="flex gap-2 items-center"
              ><span class="text-lime-400 drop-shadow-[0_0_5px_#a3e635]">●</span
              > Agitación</span
            >
            <span class="text-lime-400 font-bold tracking-wider">ACTIVO</span>
          </li>
          <li
            class="flex justify-between items-center bg-black/30 px-2 py-1.5 rounded shadow-sm"
          >
            <span class="flex gap-2 items-center"
              ><span class="text-lime-400 drop-shadow-[0_0_5px_#a3e635]">●</span
              > Calor</span
            >
            <span class="text-lime-400 font-bold tracking-wider">ACTIVO</span>
          </li>
        </ul>
      </div>
    </div>

    <div
      class="interactive-card bg-gradient-to-br from-[#012b23] to-black/80 p-6 rounded-2xl shadow-lg border border-green-900/50"
    >
      <h3 class="text-gray-100 font-bold text-lg mb-4">Alertas Recientes</h3>
      <div class="space-y-3">
        {#if alertaTemperaturaAlta}
          <div
            class="p-4 bg-red-950/40 border border-red-900/50 rounded-xl flex gap-3 items-start relative overflow-hidden shadow-[0_0_10px_rgba(239,68,68,0.1)]"
          >
            <div
              class="absolute left-0 top-0 bottom-0 w-1 bg-red-500 shadow-[0_0_10px_#ef4444]"
            ></div>
            <span
              class="text-red-400 font-bold animate-pulse text-xl drop-shadow-[0_0_5px_#ef4444]"
              >⚠️</span
            >
            <div class="w-full">
              <div class="flex justify-between items-center w-full">
                <span class="font-bold text-red-400 text-sm tracking-wide"
                  >Pico de Temperatura</span
                >
                <span
                  class="text-[10px] text-red-300 font-mono bg-red-950 px-2 py-0.5 rounded"
                  >Ahorita</span
                >
              </div>
              <span class="text-gray-300 text-xs mt-1 block leading-relaxed"
                >Peligro: El sensor T1 registra {valTemperatura}°C (Supera
                límite de 40°C).</span
              >
            </div>
          </div>
        {:else}
          <div
            class="p-4 border border-green-900/30 rounded-xl flex items-center justify-center gap-2 opacity-60"
          >
            <span class="text-lime-500">✓</span>
            <span class="text-xs text-gray-400"
              >El sistema opera dentro de parámetros seguros.</span
            >
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  /* --- EFECTOS VISUALES Y ANIMACIONES --- */
  .interactive-card {
    transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
    position: relative;
    overflow: hidden;
  }
  .interactive-card:hover,
  .interactive-card:active {
    transform: translateY(-8px) scale(1.03);
    box-shadow:
      0 15px 35px -10px rgba(52, 211, 153, 0.5),
      0 0 25px rgba(6, 182, 212, 0.3);
    border-color: rgba(163, 230, 81, 0.8) !important;
    z-index: 10;
  }
  .interactive-card::after {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0) 60%
    );
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
  }
  .interactive-card:hover::after {
    opacity: 1;
  }
  .glow-title {
    background-image: linear-gradient(to right, #a3e635, #4ade80, #22d3ee);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    filter: drop-shadow(0 0 5px rgba(74, 222, 128, 0.4));
  }
  @keyframes flowDash {
    0% {
      stroke-dashoffset: 100;
    }
    100% {
      stroke-dashoffset: 0;
    }
  }
  .data-flow {
    stroke-dasharray: 8 6;
    animation: flowDash 2s linear infinite;
  }
</style>
