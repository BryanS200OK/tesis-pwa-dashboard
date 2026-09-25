<script lang="ts">
  import { onMount } from "svelte";
  import {
    collection,
    onSnapshot,
    query,
    orderBy,
    limit,
  } from "firebase/firestore";
  import { db } from "../../../lib/firebase/firebase";
  import LineChart from "$lib/components/LineChart.svelte";

  // --- VARIABLES REACTIVAS DE ESTADO ---
  // Inicializamos con valores seguros por si la BD tarda en responder
  let valCaudal = $state("1.45");

  let historialHoras = $state<string[]>([]);
  let historialProduccion = $state<number[]>([]);

  // --- DERIVACIONES (Cálculos en tiempo real) ---
  // Cuando el ESP32 o el simulador mande un nuevo 'caudal', estas 3 variables se recalcularán solas.
  let produccionDiariaTotal = $derived(
    (parseFloat(valCaudal) * 1.62).toFixed(2),
  );
  let produccionAcumuladaMes = $derived(
    (1204.5 + parseFloat(produccionDiariaTotal)).toFixed(1),
  );
  let eficienciaObjetivo = $derived(
    (85 + parseFloat(valCaudal) * 1.5).toFixed(1),
  );

  onMount(() => {
    // Consulta a Firebase: traemos los últimos 15 datos
    const q = query(
      collection(db, "lecturas_biodigestor"),
      orderBy("timestamp", "desc"),
      limit(15),
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const horas: string[] = [];
      const producciones: number[] = [];
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

          // Lógica de simulación para pruebas (hasta que el ESP32 mande 'caudal' real)
          const caudalRealOSimulado =
            data.caudal || parseFloat((1.4 + Math.random() * 0.1).toFixed(2));
          const produccionCalculada = parseFloat(
            (caudalRealOSimulado * 1.62).toFixed(2),
          );

          producciones.unshift(produccionCalculada);

          // Actualizamos la tarjeta superior solo con el dato más reciente
          if (primerDocumento) {
            valCaudal = caudalRealOSimulado.toString();
            primerDocumento = false;
          }
        }
      });

      // Actualizamos los arreglos reactivos para que la gráfica de ECharts se redibuje
      historialHoras = horas;
      historialProduccion = producciones;
    });

    return () => unsubscribe();
  });
</script>

<div class="space-y-6 max-w-[1600px] mx-auto pb-10">
  <!-- CABECERA -->
  <div
    class="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-green-900/30 pb-6"
  >
    <div>
      <h1 class="glow-title text-4xl font-black tracking-tight mb-2">
        Producción de Biogás
      </h1>
      <p class="text-gray-400 text-sm font-medium flex items-center gap-2">
        <svg
          class="w-4 h-4 text-emerald-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          ></path></svg
        >
        Análisis de rendimiento y conversión energética en tiempo real.
      </p>
    </div>
    <div class="flex gap-3">
      <button
        class="flex items-center gap-2 px-5 py-2.5 bg-[#001410] border border-green-900/50 text-gray-300 text-sm font-bold rounded-xl shadow-inner hover:bg-[#01211b] hover:text-white transition-all duration-300"
      >
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          ></path></svg
        >
        Exportar Datos
      </button>
      <button
        class="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-green-500 text-white text-sm font-bold rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] border border-emerald-400/50 hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all duration-300 hover:-translate-y-0.5"
      >
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          ></path></svg
        >
        Ver Historial
      </button>
    </div>
  </div>

  <!-- TARJETAS SUPERIORES DE DATOS DINÁMICOS -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <!-- Tarjeta 1: Volumen Hoy (Verde Premium) -->
    <div
      class="interactive-card relative overflow-hidden bg-gradient-to-br from-emerald-600 to-green-900 p-7 rounded-3xl shadow-[0_10px_30px_rgba(16,185,129,0.25)] border border-emerald-400/40 text-white"
    >
      <svg
        class="absolute right-0 top-0 w-48 h-48 text-white/5 -mr-10 -mt-10 transform rotate-12"
        fill="currentColor"
        viewBox="0 0 24 24"
        ><path d="M12 2L2 22h20L12 2zm0 4.5l7.5 13.5h-15L12 6.5z" /></svg
      >
      <div
        class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"
      ></div>

      <div class="flex justify-between items-center mb-6 relative z-10">
        <h3 class="text-emerald-100 font-bold tracking-wider text-sm uppercase">
          Volumen Total Hoy
        </h3>
        <span
          class="flex items-center gap-1.5 text-[10px] font-bold text-emerald-200 bg-black/30 px-3 py-1.5 rounded-full border border-emerald-400/30 uppercase tracking-widest shadow-inner"
        >
          <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"
          ></span>
          Estable
        </span>
      </div>

      <!-- VALOR REACTIVO DE PRODUCCIÓN -->
      <div
        class="text-6xl font-black drop-shadow-xl relative z-10 flex items-baseline gap-2 mb-2 tracking-tight"
      >
        {produccionDiariaTotal}
        <span class="text-2xl font-bold opacity-70">m³</span>
      </div>

      <p
        class="text-emerald-100/70 text-xs font-medium relative z-10 flex items-center gap-1.5"
      >
        <svg
          class="w-4 h-4 opacity-70"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          ></path></svg
        >
        Producción diaria proyectada según flujo actual.
      </p>
    </div>

    <!-- Tarjeta 2: Acumulado Mes -->
    <div
      class="interactive-card bg-gradient-to-br from-[#011c17] to-[#000a08] p-7 rounded-3xl shadow-xl border border-cyan-900/40 relative overflow-hidden flex flex-col justify-center"
    >
      <div
        class="absolute -right-6 -bottom-6 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl"
      ></div>
      <h3
        class="text-gray-400 font-bold tracking-wider text-sm uppercase mb-6 flex items-center gap-2"
      >
        <svg
          class="w-5 h-5 text-cyan-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          ></path></svg
        >
        Acumulado (Agosto 2026)
      </h3>

      <!-- VALOR REACTIVO DE ACUMULADO -->
      <div
        class="text-5xl font-black text-white drop-shadow-[0_0_15px_rgba(6,182,212,0.2)] flex items-baseline gap-2 mb-4 tracking-tight"
      >
        {produccionAcumuladaMes}
        <span class="text-xl font-bold text-cyan-500/80">m³</span>
      </div>

      <div
        class="text-xs text-cyan-400 font-semibold flex items-center gap-1.5 bg-cyan-950/40 w-max px-3 py-1.5 rounded-lg border border-cyan-900/50 shadow-inner"
      >
        <svg
          class="w-3 h-3 animate-bounce"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="3"
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          ></path></svg
        >
        Rendimiento superior al mes anterior.
      </div>
    </div>

    <!-- Tarjeta 3: Eficiencia -->
    <div
      class="interactive-card bg-gradient-to-br from-[#011c17] to-[#000a08] p-7 rounded-3xl shadow-xl border border-indigo-900/40 relative overflow-hidden flex flex-col justify-center"
    >
      <div
        class="absolute -right-6 -bottom-6 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl"
      ></div>
      <h3
        class="text-gray-400 font-bold tracking-wider text-sm uppercase mb-6 flex items-center gap-2"
      >
        <svg
          class="w-5 h-5 text-indigo-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
          ></path></svg
        >
        Eficiencia de Conversión
      </h3>

      <!-- VALOR REACTIVO DE EFICIENCIA -->
      <div
        class="text-5xl font-black text-white drop-shadow-[0_0_15px_rgba(99,102,241,0.2)] flex items-baseline gap-1 mb-4 tracking-tight"
      >
        {eficienciaObjetivo}<span class="text-3xl font-bold text-indigo-400/80"
          >%</span
        >
      </div>

      <div
        class="text-xs text-gray-400 flex items-center gap-2 border-l-2 border-indigo-500/50 pl-3"
      >
        Proporción estimada en base a <br />2.5 toneladas de biomasa/día.
      </div>
    </div>
  </div>

  <!-- SECCIÓN DE LA GRÁFICA -->
  <div
    class="interactive-card bg-gradient-to-br from-[#011612] to-[#000504] p-6 md:p-8 rounded-3xl border border-green-900/30 shadow-2xl flex flex-col mt-8"
  >
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center gap-3">
        <div
          class="p-2.5 bg-emerald-950/50 rounded-xl border border-emerald-900/50 shadow-inner"
        >
          <svg
            class="w-5 h-5 text-emerald-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
            ></path></svg
          >
        </div>
        <h3 class="text-xl font-bold text-gray-200 tracking-wide">
          Tendencia de Producción en Tiempo Real <span
            class="text-emerald-500 font-light">(m³)</span
          >
        </h3>
      </div>

      <div
        class="px-4 py-2 bg-black/60 border border-green-900/40 rounded-xl text-xs font-mono text-emerald-400 shadow-inner flex items-center gap-2"
      >
        <span class="relative flex h-2.5 w-2.5">
          <span
            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
          ></span>
          <span
            class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"
          ></span>
        </span>
        Transmisión en vivo
      </div>
    </div>

    <!-- Contenedor ECharts -->
    <div
      class="flex-1 w-full bg-[#000a08]/50 border border-dashed border-green-900/30 rounded-2xl flex items-center justify-center relative p-2 md:p-6 min-h-[450px]"
    >
      {#if historialProduccion.length > 0}
        <!-- AL PASAR SERIESNAME, EL TOOLTIP YA SE VE PROFESIONAL -->
        <LineChart
          id="chart-produccion-detalle"
          title=""
          seriesName="Producción Real"
          dataAxis={historialHoras}
          dataSeries={historialProduccion}
          lineColor="#10b981"
          areaColor="rgba(16, 185, 129, 0.15)"
        />
      {:else}
        <div class="flex flex-col items-center gap-4">
          <svg
            class="w-12 h-12 text-emerald-600/50 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p
            class="text-emerald-500/70 font-mono text-xs animate-pulse tracking-widest uppercase"
          >
            Sincronizando flujo de datos...
          </p>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .interactive-card {
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .interactive-card:hover {
    transform: translateY(-4px);
    box-shadow:
      0 20px 40px -10px rgba(16, 185, 129, 0.15),
      0 0 20px rgba(6, 182, 212, 0.05);
  }

  .glow-title {
    background: linear-gradient(135deg, #a3e635 0%, #10b981 50%, #06b6d4 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    filter: drop-shadow(0 4px 8px rgba(16, 185, 129, 0.2));
  }
</style>
