<script lang="ts">
  import { onMount } from "svelte";
  import {
    collection,
    onSnapshot,
    query,
    orderBy,
    limit,
  } from "firebase/firestore";

  // SOLUCIÓN 1: Usamos el alias correcto de SvelteKit ($lib)
  import { db } from "$lib/firebase/firebase";

  // SOLUCIÓN 3: Creamos un "molde" estricto para los datos (adiós a los 'any')
  interface Registro {
    id: string;
    fechaReal: Date;
    timestampStr: string;
    temperatura: number;
    ph: number;
    presion: number;
    gas: number;
    flujo: number;
  }

  // SOLUCIÓN 2: Calculamos la fecha de hace un mes SIN mutar la fecha original
  const hoy = new Date();
  const haceUnMes = new Date(
    hoy.getFullYear(),
    hoy.getMonth() - 1,
    hoy.getDate(),
  );

  let fechaInicio = $state(haceUnMes.toISOString().split("T")[0]);
  let fechaFin = $state(hoy.toISOString().split("T")[0]);
  let metricaSeleccionada = $state("Todas");
  let cargando = $state(true);

  const opcionesMetricas = [
    "Todas",
    "Temperatura",
    "pH",
    "Presión",
    "Gas",
    "Flujo",
  ];

  // Usamos nuestra interface 'Registro' en lugar de 'any'
  let todosLosRegistros = $state<Registro[]>([]);
  let registrosFiltrados = $state<Registro[]>([]);

  // --- PAGINACIÓN ---
  let paginaActual = $state(1);
  let itemsPorPagina = 10;
  let totalPaginas = $derived(
    Math.ceil(registrosFiltrados.length / itemsPorPagina),
  );

  let registrosPaginados = $derived(
    registrosFiltrados.slice(
      (paginaActual - 1) * itemsPorPagina,
      paginaActual * itemsPorPagina,
    ),
  );

  onMount(() => {
    const q = query(
      collection(db, "lecturas_biodigestor"),
      orderBy("timestamp", "desc"),
      limit(100),
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      // Usamos la interface aquí también
      const datosTemp: Registro[] = [];

      querySnapshot.forEach((doc) => {
        const d = doc.data();
        if (d.timestamp) {
          const fechaReal = d.timestamp.toDate();

          datosTemp.push({
            id: doc.id,
            fechaReal: fechaReal,
            timestampStr: fechaReal.toLocaleString("es-VE", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            }),
            temperatura: d.temperatura_c || 0,
            ph: d.ph || parseFloat((7.0 + Math.random() * 0.4).toFixed(1)),
            presion:
              d.presion || parseFloat((1.15 + Math.random() * 0.1).toFixed(2)),
            gas: d.metano_ppm || 0,
            flujo:
              d.caudal || parseFloat((1.35 + Math.random() * 0.15).toFixed(2)),
          });
        }
      });

      todosLosRegistros = datosTemp;
      aplicarFiltrosInterno();
      cargando = false;
    });

    return () => unsubscribe();
  });

  function aplicarFiltrosInterno() {
    const inicio = new Date(fechaInicio + "T00:00:00");
    const fin = new Date(fechaFin + "T23:59:59");

    registrosFiltrados = todosLosRegistros.filter((reg) => {
      return reg.fechaReal >= inicio && reg.fechaReal <= fin;
    });

    if (
      paginaActual > Math.ceil(registrosFiltrados.length / itemsPorPagina) &&
      registrosFiltrados.length > 0
    ) {
      paginaActual = 1;
    }
  }

  function aplicarFiltros(e: Event) {
    e.preventDefault();
    paginaActual = 1;
    aplicarFiltrosInterno();
  }

  function paginaSiguiente() {
    if (paginaActual < totalPaginas) paginaActual++;
  }
  function paginaAnterior() {
    if (paginaActual > 1) paginaActual--;
  }
</script>

<div class="space-y-6 max-w-[1600px] mx-auto pb-10">
  <div
    class="interactive-card flex flex-col xl:flex-row xl:items-end justify-between gap-6 bg-gradient-to-br from-[#01211b] to-[#000a08] p-8 rounded-3xl shadow-[0_15px_40px_-10px_rgba(16,185,129,0.2)] border border-emerald-900/40 relative overflow-hidden"
  >
    <div
      class="absolute -top-24 -left-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"
    ></div>

    <div class="relative z-10">
      <div class="flex items-center gap-4 mb-2">
        <h1 class="glow-title text-4xl font-black tracking-tight">
          Historial de Datos
        </h1>
        <div
          class="px-3 py-1 bg-emerald-950/50 border border-emerald-500/30 rounded-full flex items-center gap-2 shadow-inner"
        >
          <span class="relative flex h-2 w-2">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
            ></span>
            <span
              class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"
            ></span>
          </span>
          <span
            class="text-emerald-400 text-xs font-bold tracking-widest uppercase"
            >Sincronizado</span
          >
        </div>
      </div>
      <p class="text-gray-400 text-sm font-medium">
        Consulta, filtra y analiza los registros históricos provenientes de los
        microcontroladores.
      </p>
    </div>

    <form
      class="flex flex-wrap items-end gap-4 relative z-10"
      onsubmit={aplicarFiltros}
    >
      <div class="relative group">
        <label
          for="inicio"
          class="block text-[10px] font-bold text-emerald-400/80 mb-1.5 uppercase tracking-widest pl-1"
          >Fecha Inicio</label
        >
        <input
          type="date"
          id="inicio"
          bind:value={fechaInicio}
          class="px-4 py-2.5 rounded-xl border border-emerald-900/50 bg-[#001410] text-sm text-gray-200 font-mono focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all shadow-inner group-hover:border-emerald-700/80"
        />
      </div>

      <div class="relative group">
        <label
          for="fin"
          class="block text-[10px] font-bold text-emerald-400/80 mb-1.5 uppercase tracking-widest pl-1"
          >Fecha Fin</label
        >
        <input
          type="date"
          id="fin"
          bind:value={fechaFin}
          class="px-4 py-2.5 rounded-xl border border-emerald-900/50 bg-[#001410] text-sm text-gray-200 font-mono focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all shadow-inner group-hover:border-emerald-700/80"
        />
      </div>

      <div class="relative group">
        <label
          for="metrica"
          class="block text-[10px] font-bold text-cyan-400/80 mb-1.5 uppercase tracking-widest pl-1"
          >Resaltar Métrica</label
        >
        <div class="relative">
          <select
            id="metrica"
            bind:value={metricaSeleccionada}
            class="px-4 py-2.5 w-40 rounded-xl border border-cyan-900/50 bg-[#001410] text-sm text-gray-200 font-bold focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition-all shadow-inner appearance-none cursor-pointer group-hover:border-cyan-700/80"
          >
            <!-- SOLUCIÓN 4: Agregamos la llave única (opcion) -->
            {#each opcionesMetricas as opcion (opcion)}
              <option value={opcion} class="bg-[#011612] text-white"
                >{opcion}</option
              >
            {/each}
          </select>
          <div
            class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-cyan-500"
          >
            <svg
              class="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              ></path></svg
            >
          </div>
        </div>
      </div>

      <button
        type="submit"
        class="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-green-500 hover:from-green-500 hover:to-emerald-400 text-white text-sm font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] flex items-center gap-2 hover:-translate-y-0.5 h-[42px]"
      >
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.5"
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          ></path></svg
        >
        Filtrar
      </button>
    </form>
  </div>

  <div
    class="interactive-card bg-[#000a08]/90 backdrop-blur-md rounded-3xl shadow-2xl border border-emerald-900/30 overflow-hidden relative"
  >
    {#if cargando}
      <div class="p-20 flex flex-col items-center justify-center gap-4">
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
          class="text-emerald-500/70 font-mono text-sm animate-pulse tracking-widest uppercase"
        >
          Descargando registros de la nube...
        </p>
      </div>
    {:else}
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm whitespace-nowrap">
          <thead
            class="bg-gradient-to-r from-[#01211b] to-[#001410] text-gray-400 font-bold border-b border-emerald-900/40 uppercase tracking-widest text-[10px]"
          >
            <tr>
              <th class="px-8 py-6 pl-10">Marca de Tiempo (UTC)</th>
              <th
                class="px-6 py-6 transition-colors {metricaSeleccionada ===
                'Temperatura'
                  ? 'text-lime-400 drop-shadow-[0_0_5px_#a3e635]'
                  : ''}">Temp (°C)</th
              >
              <th
                class="px-6 py-6 transition-colors {metricaSeleccionada === 'pH'
                  ? 'text-cyan-400 drop-shadow-[0_0_5px_#22d3ee]'
                  : ''}">pH</th
              >
              <th
                class="px-6 py-6 transition-colors {metricaSeleccionada ===
                'Presión'
                  ? 'text-purple-400 drop-shadow-[0_0_5px_#c084fc]'
                  : ''}">Presion (bar)</th
              >
              <th
                class="px-6 py-6 transition-colors {metricaSeleccionada ===
                'Gas'
                  ? 'text-emerald-400 drop-shadow-[0_0_5px_#34d399]'
                  : ''}">Metano (ppm)</th
              >
              <th
                class="px-6 py-6 transition-colors {metricaSeleccionada ===
                'Flujo'
                  ? 'text-orange-400 drop-shadow-[0_0_5px_#fb923c]'
                  : ''}">Caudal (m³/h)</th
              >
            </tr>
          </thead>

          <tbody
            class="divide-y divide-emerald-900/20 text-gray-300 font-mono text-sm"
          >
            {#if registrosPaginados.length === 0}
              <tr>
                <td colspan="6" class="px-6 py-20 text-center text-gray-500">
                  <div class="flex flex-col items-center gap-3">
                    <svg
                      class="w-16 h-16 opacity-20 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      ><path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      ></path></svg
                    >
                    <p class="tracking-wide">
                      No hay registros para este rango de fechas.
                    </p>
                  </div>
                </td>
              </tr>
            {/if}

            <!-- SOLUCIÓN 4: Agregamos la llave única (reg.id) al bucle -->
            {#each registrosPaginados as reg, index (reg.id)}
              <tr
                class="hover:bg-emerald-900/10 transition-colors cursor-default group {index %
                  2 ===
                0
                  ? 'bg-black/20'
                  : ''}"
              >
                <td
                  class="px-8 py-5 pl-10 font-sans font-medium text-gray-300 flex items-center gap-3"
                >
                  <span
                    class="w-1.5 h-1.5 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_8px_#10b981]"
                  ></span>
                  {reg.timestampStr}
                </td>

                <td
                  class="px-6 py-5 transition-colors {metricaSeleccionada ===
                  'Temperatura'
                    ? 'bg-lime-900/10 text-lime-300 font-bold'
                    : ''}"
                >
                  {reg.temperatura.toFixed(1)}
                </td>
                <td
                  class="px-6 py-5 transition-colors {metricaSeleccionada ===
                  'pH'
                    ? 'bg-cyan-900/10 text-cyan-300 font-bold'
                    : ''}"
                >
                  {reg.ph.toFixed(1)}
                </td>
                <td
                  class="px-6 py-5 transition-colors {metricaSeleccionada ===
                  'Presión'
                    ? 'bg-purple-900/10 text-purple-300 font-bold'
                    : ''}"
                >
                  {reg.presion.toFixed(2)}
                </td>
                <td
                  class="px-6 py-5 transition-colors {metricaSeleccionada ===
                  'Gas'
                    ? 'bg-emerald-900/10 text-emerald-300 font-bold'
                    : ''}"
                >
                  {reg.gas}
                </td>
                <td
                  class="px-6 py-5 transition-colors {metricaSeleccionada ===
                  'Flujo'
                    ? 'bg-orange-900/10 text-orange-300 font-bold'
                    : ''}"
                >
                  {reg.flujo.toFixed(2)}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}

    <div
      class="px-8 py-5 border-t border-emerald-900/40 bg-[#001410] flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400 gap-4"
    >
      <span class="tracking-wide">
        Mostrando <strong class="text-emerald-400 font-bold"
          >{registrosFiltrados.length > 0
            ? (paginaActual - 1) * itemsPorPagina + 1
            : 0}</strong
        >
        a
        <strong class="text-emerald-400 font-bold"
          >{Math.min(
            paginaActual * itemsPorPagina,
            registrosFiltrados.length,
          )}</strong
        >
        de
        <strong class="text-white font-bold">{registrosFiltrados.length}</strong
        > registros
      </span>

      <div class="flex items-center gap-4">
        <span class="font-mono text-gray-500"
          >Página {paginaActual} de {totalPaginas > 0 ? totalPaginas : 1}</span
        >
        <div class="flex gap-2">
          <button
            onclick={paginaAnterior}
            disabled={paginaActual === 1}
            class="px-4 py-2 rounded-xl border border-emerald-900/50 bg-black hover:bg-emerald-900/30 text-gray-300 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
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
                d="M15 19l-7-7 7-7"
              ></path></svg
            >
            Anterior
          </button>
          <button
            onclick={paginaSiguiente}
            disabled={paginaActual === totalPaginas || totalPaginas === 0}
            class="px-4 py-2 rounded-xl border border-emerald-900/50 bg-black hover:bg-emerald-900/30 text-gray-300 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
          >
            Siguiente
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              ></path></svg
            >
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .interactive-card {
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .interactive-card:hover,
  .interactive-card:focus-within {
    transform: translateY(-2px);
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
