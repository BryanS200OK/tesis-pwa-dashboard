<script lang="ts">
  import { onMount } from "svelte";
  import {
    collection,
    onSnapshot,
    query,
    orderBy,
    limit,
  } from "firebase/firestore";
  import { db } from "../../../lib/firebase/firebase"; // Asegúrate de que apunte a tu archivo firebase.ts
  import LineChart from "$lib/components/LineChart.svelte"; // Importamos nuestro componente gráfico

  // Variables reactivas (Svelte 5) para las tarjetas
  let temperatura = $state(0);
  let ph = $state(7.1); // Queda estático por ahora
  let presion = $state(1.2); // Queda estático por ahora
  let nivelGas = $state(0);
  let ultimaActualizacion = $state("Conectando...");

  // Arreglos reactivos para la historia de la gráfica
  let historialHoras = $state<string[]>([]);
  let historialMetano = $state<number[]>([]);

  onMount(() => {
    // Pedimos los últimos 15 registros para tener historia que dibujar
    const q = query(
      collection(db, "lecturas_biodigestor"),
      orderBy("timestamp", "desc"),
      limit(15),
    );

    // onSnapshot escucha cambios 24/7 sin recargar
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      // Necesitamos invertir los datos porque Firestore nos da del más nuevo al más viejo
      // Y las gráficas se dibujan de izquierda (viejo) a derecha (nuevo)
      const nuevosTiempos: string[] = [];
      const nuevosMetanos: number[] = [];

      let primerDocumento = true;

      querySnapshot.forEach((doc) => {
        const data = doc.data();

        // Extraemos la historia para la gráfica
        if (data.timestamp) {
          const fecha = data.timestamp.toDate();
          nuevosTiempos.unshift(
            fecha.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
          );
          nuevosMetanos.unshift(data.metano_ppm);

          // Actualizamos los números grandes de arriba SOLAMENTE con el dato más reciente
          if (primerDocumento) {
            temperatura = data.temperatura_c;
            nivelGas = data.metano_ppm;
            ultimaActualizacion = fecha.toLocaleTimeString();
            primerDocumento = false;
          }
        }
      });

      // Sobrescribimos el estado reactivo
      historialHoras = nuevosTiempos;
      historialMetano = nuevosMetanos;
    });

    // Desconecta el websocket si el usuario sale de la página
    return () => unsubscribe();
  });
</script>

<div class="space-y-6 max-w-[1600px] mx-auto pb-10">
  <div
    class="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-br from-[#01211b] to-black/80 p-6 rounded-2xl shadow-xl border border-green-900/50"
  >
    <div>
      <h1 class="glow-title text-3xl md:text-4xl font-black tracking-tight">
        Métricas en Tiempo Real
      </h1>
      <p class="text-gray-400 mt-2 text-sm font-medium">
        Lectura directa de los microcontroladores conectados al reactor
        anaerobio.
      </p>
    </div>

    <div
      class="flex items-center gap-3 px-5 py-2.5 bg-black/40 border border-green-900/60 rounded-xl shadow-inner"
    >
      <span class="relative flex h-3 w-3">
        <span
          class="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"
        ></span>
        <span
          class="relative inline-flex rounded-full h-3 w-3 bg-lime-500 shadow-[0_0_5px_#a3e635]"
        ></span>
      </span>
      <span class="text-lime-400 text-sm font-bold tracking-wide"
        >Sistema Activo</span
      >
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
    <div
      class="interactive-card bg-gradient-to-br from-[#01211b] to-black/80 p-6 rounded-2xl shadow-xl border border-green-900/40 flex flex-col justify-between"
    >
      <div>
        <div class="flex justify-between items-start mb-4">
          <div
            class="p-2.5 bg-orange-950/40 text-orange-400 rounded-lg border border-orange-900/50"
          >
            <svg
              class="w-6 h-6"
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
          </div>
          <span
            class="text-[10px] font-bold text-orange-300 bg-orange-950/50 px-2.5 py-1 rounded-md border border-orange-900/50 uppercase tracking-wider"
            >Estable</span
          >
        </div>
        <h3
          class="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-2"
        >
          Temperatura
        </h3>
        <div class="flex items-baseline gap-1.5">
          <span class="text-4xl font-black text-white">{temperatura}</span>
          <span class="text-lg font-bold text-orange-400">°C</span>
        </div>
      </div>
      <div
        class="mt-6 w-full h-10 flex items-end justify-between gap-1.5 opacity-60"
      >
        <div
          class="w-full bg-orange-500/20 hover:bg-orange-400/40 transition-colors rounded-t-sm h-[40%]"
        ></div>
        <div
          class="w-full bg-orange-500/30 hover:bg-orange-400/40 transition-colors rounded-t-sm h-[50%]"
        ></div>
        <div
          class="w-full bg-orange-500/20 hover:bg-orange-400/40 transition-colors rounded-t-sm h-[45%]"
        ></div>
        <div
          class="w-full bg-orange-500/50 hover:bg-orange-400/40 transition-colors rounded-t-sm h-[60%]"
        ></div>
        <div
          class="w-full bg-orange-500/40 hover:bg-orange-400/40 transition-colors rounded-t-sm h-[55%]"
        ></div>
        <div
          class="w-full bg-orange-500/80 hover:bg-orange-400/40 transition-colors rounded-t-sm h-[58%] shadow-[0_0_8px_rgba(249,115,22,0.5)]"
        ></div>
      </div>
    </div>

    <div
      class="interactive-card bg-gradient-to-br from-[#01211b] to-black/80 p-6 rounded-2xl shadow-xl border border-green-900/40 flex flex-col justify-between"
    >
      <div>
        <div class="flex justify-between items-start mb-4">
          <div
            class="p-2.5 bg-cyan-950/40 text-cyan-400 rounded-lg border border-cyan-900/50"
          >
            <svg
              class="w-6 h-6"
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
          </div>
          <span
            class="text-[10px] font-bold text-cyan-300 bg-cyan-950/50 px-2.5 py-1 rounded-md border border-cyan-900/50 uppercase tracking-wider"
            >Óptimo</span
          >
        </div>
        <h3
          class="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-2"
        >
          Nivel de pH
        </h3>
        <div class="flex items-baseline gap-1.5">
          <span class="text-4xl font-black text-white">{ph}</span>
        </div>
      </div>
      <div
        class="mt-6 w-full h-10 flex items-end justify-between gap-1.5 opacity-60"
      >
        <div
          class="w-full bg-cyan-500/20 hover:bg-cyan-400/40 transition-colors rounded-t-sm h-[70%]"
        ></div>
        <div
          class="w-full bg-cyan-500/30 hover:bg-cyan-400/40 transition-colors rounded-t-sm h-[72%]"
        ></div>
        <div
          class="w-full bg-cyan-500/40 hover:bg-cyan-400/40 transition-colors rounded-t-sm h-[71%]"
        ></div>
        <div
          class="w-full bg-cyan-500/50 hover:bg-cyan-400/40 transition-colors rounded-t-sm h-[71%]"
        ></div>
        <div
          class="w-full bg-cyan-500/60 hover:bg-cyan-400/40 transition-colors rounded-t-sm h-[70%]"
        ></div>
        <div
          class="w-full bg-cyan-500/80 hover:bg-cyan-400/40 transition-colors rounded-t-sm h-[71%] shadow-[0_0_8px_rgba(6,182,212,0.5)]"
        ></div>
      </div>
    </div>

    <div
      class="interactive-card bg-gradient-to-br from-[#01211b] to-black/80 p-6 rounded-2xl shadow-xl border border-green-900/40 flex flex-col justify-between"
    >
      <div>
        <div class="flex justify-between items-start mb-4">
          <div
            class="p-2.5 bg-purple-950/40 text-purple-400 rounded-lg border border-purple-900/50"
          >
            <svg
              class="w-6 h-6"
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
          </div>
          <span
            class="text-[10px] font-bold text-purple-300 bg-purple-950/50 px-2.5 py-1 rounded-md border border-purple-900/50 uppercase tracking-wider animate-pulse"
            >Alerta</span
          >
        </div>
        <h3
          class="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-2"
        >
          Presión Biogás
        </h3>
        <div class="flex items-baseline gap-1.5">
          <span class="text-4xl font-black text-white">{presion}</span>
          <span class="text-lg font-bold text-purple-400">bar</span>
        </div>
      </div>
      <div
        class="mt-6 w-full h-10 flex items-end justify-between gap-1.5 opacity-60"
      >
        <div
          class="w-full bg-purple-500/20 hover:bg-purple-400/40 transition-colors rounded-t-sm h-[60%]"
        ></div>
        <div
          class="w-full bg-purple-500/30 hover:bg-purple-400/40 transition-colors rounded-t-sm h-[65%]"
        ></div>
        <div
          class="w-full bg-purple-500/50 hover:bg-purple-400/40 transition-colors rounded-t-sm h-[80%]"
        ></div>
        <div
          class="w-full bg-purple-500/70 hover:bg-purple-400/40 transition-colors rounded-t-sm h-[95%]"
        ></div>
        <div
          class="w-full bg-purple-500/60 hover:bg-purple-400/40 transition-colors rounded-t-sm h-[85%]"
        ></div>
        <div
          class="w-full bg-purple-500/80 hover:bg-purple-400/40 transition-colors rounded-t-sm h-[90%] shadow-[0_0_8px_rgba(168,85,247,0.5)]"
        ></div>
      </div>
    </div>

    <div
      class="interactive-card bg-gradient-to-br from-[#01211b] to-black/80 p-6 rounded-2xl shadow-xl border border-green-900/40 flex flex-col justify-between"
    >
      <div>
        <div class="flex justify-between items-start mb-4">
          <div
            class="p-2.5 bg-lime-950/40 text-lime-400 rounded-lg border border-lime-900/50"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 11l7-7 7 7M5 19l7-7 7 7"
              ></path></svg
            >
          </div>
          <span
            class="text-[10px] font-bold text-lime-300 bg-lime-950/50 px-2.5 py-1 rounded-md border border-lime-900/50 uppercase tracking-wider"
            >Subiendo</span
          >
        </div>
        <h3
          class="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-2"
        >
          Volumen Almacenado
        </h3>
        <div class="flex items-baseline gap-1.5">
          <span class="text-4xl font-black text-white">{nivelGas}</span>
          <span class="text-lg font-bold text-lime-400">ppm</span>
        </div>
      </div>
      <div
        class="mt-6 w-full h-10 flex items-end justify-between gap-1.5 opacity-60"
      >
        <div
          class="w-full bg-lime-500/20 hover:bg-lime-400/40 transition-colors rounded-t-sm h-[40%]"
        ></div>
        <div
          class="w-full bg-lime-500/30 hover:bg-lime-400/40 transition-colors rounded-t-sm h-[50%]"
        ></div>
        <div
          class="w-full bg-lime-500/40 hover:bg-lime-400/40 transition-colors rounded-t-sm h-[60%]"
        ></div>
        <div
          class="w-full bg-lime-500/60 hover:bg-lime-400/40 transition-colors rounded-t-sm h-[75%]"
        ></div>
        <div
          class="w-full bg-lime-500/70 hover:bg-lime-400/40 transition-colors rounded-t-sm h-[80%]"
        ></div>
        <div
          class="w-full bg-lime-500/90 hover:bg-lime-400/40 transition-colors rounded-t-sm h-[85%] shadow-[0_0_8px_rgba(132,204,22,0.5)]"
        ></div>
      </div>
    </div>
  </div>

  <div
    class="interactive-card bg-gradient-to-br from-[#01211b] to-black/80 p-6 md:p-8 rounded-2xl border border-green-900/40 shadow-xl min-h-[350px] flex flex-col"
  >
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-lg font-bold text-gray-200 flex items-center gap-2">
        <svg
          class="w-5 h-5 text-cyan-400"
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
        Flujo de Datos en Vivo
      </h2>
      <div class="flex gap-2">
        <span
          class="px-3 py-1.5 bg-black/40 border border-green-900/30 rounded-lg text-xs font-mono text-gray-400 shadow-inner"
          >Último dato: {ultimaActualizacion}</span
        >
      </div>
    </div>

    <!-- AQUÍ REEMPLAZAMOS EL MARCADOR POR LA GRÁFICA REAL -->
    <div
      class="flex-1 w-full bg-black/30 border border-dashed border-green-900/50 rounded-xl flex items-center justify-center relative overflow-hidden p-4"
    >
      {#if historialMetano.length > 0}
        <LineChart
          id="grafica-metano"
          title="Producción de Metano (ppm)"
          dataAxis={historialHoras}
          dataSeries={historialMetano}
          lineColor="#a3e635"
          areaColor="rgba(163, 230, 81, 0.4)"
        />
      {:else}
        <p class="text-gray-500 font-mono text-xs animate-pulse">
          Cargando curva histórica...
        </p>
      {/if}
    </div>
  </div>
</div>

<style>
  .interactive-card {
    transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
    position: relative;
    overflow: hidden;
  }

  .interactive-card:hover {
    transform: translateY(-4px) scale(1.01);
    box-shadow:
      0 10px 30px -10px rgba(52, 211, 153, 0.3),
      0 0 20px rgba(6, 182, 212, 0.15);
    border-color: rgba(163, 230, 81, 0.4) !important;
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
      rgba(255, 255, 255, 0.03) 0%,
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
    filter: drop-shadow(0 0 5px rgba(74, 222, 128, 0.3));
  }
</style>
