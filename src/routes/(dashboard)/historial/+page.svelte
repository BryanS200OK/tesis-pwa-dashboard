<script lang="ts">
  import { onMount } from "svelte";
  import { obtenerHistorial, guardarMedicion } from "$lib/firebase/services";

  let fechaInicio = $state("2026-08-01");
  let fechaFin = $state("2026-08-31");
  let metricaSeleccionada = $state("Todas");
  let cargando = $state(true);
  let simulando = $state(false);

  const opcionesMetricas = [
    "Todas",
    "Temperatura",
    "pH",
    "Presión",
    "Gas",
    "Flujo",
  ];

  let todosLosRegistros = $state<any[]>([]);
  let registros = $state<any[]>([]);

  async function cargarDatos() {
    cargando = true;
    try {
      const datosFirebase = await obtenerHistorial("Todas");

      const agrupados: Record<string, any> = {};

      datosFirebase.forEach((dato) => {
        const fechaObj = new Date(dato.device_timestamp);
        const llave = fechaObj.toLocaleString("es-VE");

        if (!agrupados[llave]) {
          agrupados[llave] = {
            timestamp: llave,
            fechaReal: fechaObj,
            temperatura: 0,
            ph: 0,
            presion: 0,
            gas: 0,
            flujo: 0,
          };
        }

        const variableStr = dato.variable.toLowerCase();
        if (variableStr.includes("temp"))
          agrupados[llave].temperatura = dato.value;
        if (variableStr.includes("ph")) agrupados[llave].ph = dato.value;
        if (variableStr.includes("presi"))
          agrupados[llave].presion = dato.value;
        if (variableStr.includes("gas")) agrupados[llave].gas = dato.value;
        if (variableStr.includes("flujo") || variableStr.includes("caudal"))
          agrupados[llave].flujo = dato.value;
      });

      todosLosRegistros = Object.values(agrupados).sort(
        (a, b) => b.fechaReal.getTime() - a.fechaReal.getTime(),
      );
      registros = [...todosLosRegistros];
    } catch (error) {
      console.error(error);
    } finally {
      cargando = false;
    }
  }

  onMount(async () => {
    await cargarDatos();
  });

  async function simularLecturaESP32() {
    simulando = true;
    const ahora = new Date().toISOString();
    const idBase = Date.now();

    const nuevasLecturas = [
      {
        measurement_id: "t-" + idBase,
        device_id: "esp32-nodo-1",
        variable: "Temperatura",
        value: Number((34 + Math.random() * 3).toFixed(1)),
        unit: "°C",
        device_timestamp: ahora,
        quality: "valid",
        sync_status: "pending" as const,
      },
      {
        measurement_id: "ph-" + idBase,
        device_id: "esp32-nodo-1",
        variable: "pH",
        value: Number((6.8 + Math.random() * 0.6).toFixed(1)),
        unit: "",
        device_timestamp: ahora,
        quality: "valid",
        sync_status: "pending" as const,
      },
      {
        measurement_id: "p-" + idBase,
        device_id: "esp32-nodo-1",
        variable: "Presión",
        value: Number((1.1 + Math.random() * 0.3).toFixed(2)),
        unit: "bar",
        device_timestamp: ahora,
        quality: "valid",
        sync_status: "pending" as const,
      },
      {
        measurement_id: "g-" + idBase,
        device_id: "esp32-nodo-1",
        variable: "Gas",
        value: Math.floor(70 + Math.random() * 15),
        unit: "%",
        device_timestamp: ahora,
        quality: "valid",
        sync_status: "pending" as const,
      },
      {
        measurement_id: "f-" + idBase,
        device_id: "esp32-nodo-1",
        variable: "Flujo",
        value: Number((1.3 + Math.random() * 0.4).toFixed(2)),
        unit: "m³/h",
        device_timestamp: ahora,
        quality: "valid",
        sync_status: "pending" as const,
      },
    ];

    for (const lectura of nuevasLecturas) {
      await guardarMedicion(lectura);
    }

    await cargarDatos();
    simulando = false;
  }

  function aplicarFiltros(e: Event) {
    e.preventDefault();

    const inicio = new Date(fechaInicio + "T00:00:00");
    const fin = new Date(fechaFin + "T23:59:59");

    registros = todosLosRegistros.filter((reg) => {
      return reg.fechaReal >= inicio && reg.fechaReal <= fin;
    });
  }
</script>

<div class="space-y-6 max-w-[1600px] mx-auto pb-10">
  <div
    class="interactive-card flex flex-col md:flex-row md:items-end justify-between gap-6 bg-gradient-to-br from-[#01211b] to-black/80 p-6 rounded-2xl shadow-xl border border-green-900/50"
  >
    <div>
      <div class="flex items-center gap-4">
        <h1 class="glow-title text-4xl font-black tracking-tight">
          Historial de Datos
        </h1>
        <button
          onclick={simularLecturaESP32}
          disabled={simulando}
          class="px-3 py-1 bg-cyan-700 hover:bg-cyan-600 text-white text-xs font-bold rounded-lg transition-all shadow-md flex items-center gap-1 cursor-pointer"
        >
          {#if simulando}
            Enviando...
          {:else}
            + Simular ESP32
          {/if}
        </button>
      </div>
      <p class="text-gray-400 mt-2 text-sm font-medium">
        Consulta y analiza los registros historicos de los sensores del
        biodigestor.
      </p>
    </div>

    <form class="flex flex-wrap items-end gap-4" onsubmit={aplicarFiltros}>
      <div class="relative">
        <label
          for="inicio"
          class="block text-[11px] font-bold text-lime-400/80 mb-1 uppercase tracking-wider"
          >Fecha Inicio</label
        >
        <input
          type="date"
          id="inicio"
          bind:value={fechaInicio}
          class="px-4 py-2 rounded-lg border border-green-900/60 bg-black/50 text-sm text-gray-200 font-mono focus:ring-2 focus:ring-lime-500/50 focus:border-lime-500 outline-none transition-all shadow-inner"
        />
      </div>

      <div class="relative">
        <label
          for="fin"
          class="block text-[11px] font-bold text-lime-400/80 mb-1 uppercase tracking-wider"
          >Fecha Fin</label
        >
        <input
          type="date"
          id="fin"
          bind:value={fechaFin}
          class="px-4 py-2 rounded-lg border border-green-900/60 bg-black/50 text-sm text-gray-200 font-mono focus:ring-2 focus:ring-lime-500/50 focus:border-lime-500 outline-none transition-all shadow-inner"
        />
      </div>

      <div class="relative">
        <label
          for="metrica"
          class="block text-[11px] font-bold text-cyan-400/80 mb-1 uppercase tracking-wider"
          >Resaltar Metrica</label
        >
        <select
          id="metrica"
          bind:value={metricaSeleccionada}
          class="px-4 py-2 rounded-lg border border-cyan-900/60 bg-black/50 text-sm text-gray-200 font-bold focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition-all shadow-inner appearance-none pr-8 cursor-pointer"
        >
          {#each opcionesMetricas as opcion}
            <option value={opcion} class="bg-[#011612] text-white"
              >{opcion}</option
            >
          {/each}
        </select>
        <div
          class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 pt-4 text-cyan-500"
        >
          <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"
            ><path
              fill-rule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clip-rule="evenodd"
            /></svg
          >
        </div>
      </div>

      <button
        type="submit"
        class="px-6 py-2.5 bg-gradient-to-r from-green-700 to-green-500 hover:from-lime-600 hover:to-green-400 text-white text-sm font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(22,163,74,0.4)] hover:shadow-[0_0_20px_rgba(163,230,81,0.6)] flex items-center gap-2"
      >
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="3"
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          ></path></svg
        >
        Aplicar
      </button>
    </form>
  </div>

  <div
    class="interactive-card bg-gradient-to-br from-[#01211b] to-black/80 rounded-2xl shadow-2xl border border-green-900/50 overflow-hidden"
  >
    {#if cargando}
      <div class="p-12 text-center text-gray-400 font-mono">
        Cargando mediciones desde la nube...
      </div>
    {:else}
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm whitespace-nowrap">
          <thead
            class="bg-black/40 text-gray-400 font-semibold border-b border-green-900/50 uppercase tracking-wider text-[11px]"
          >
            <tr>
              <th class="px-6 py-5">Marca de Tiempo (UTC)</th>
              <th
                class="px-6 py-5 transition-colors {metricaSeleccionada ===
                'Temperatura'
                  ? 'text-lime-400 drop-shadow-[0_0_5px_#a3e635]'
                  : ''}">Temp (°C)</th
              >
              <th
                class="px-6 py-5 transition-colors {metricaSeleccionada === 'pH'
                  ? 'text-cyan-400 drop-shadow-[0_0_5px_#22d3ee]'
                  : ''}">pH</th
              >
              <th
                class="px-6 py-5 transition-colors {metricaSeleccionada ===
                'Presión'
                  ? 'text-purple-400 drop-shadow-[0_0_5px_#c084fc]'
                  : ''}">Presion (bar)</th
              >
              <th
                class="px-6 py-5 transition-colors {metricaSeleccionada ===
                'Gas'
                  ? 'text-emerald-400 drop-shadow-[0_0_5px_#34d399]'
                  : ''}">Gas (%)</th
              >
              <th
                class="px-6 py-5 transition-colors {metricaSeleccionada ===
                'Flujo'
                  ? 'text-orange-400 drop-shadow-[0_0_5px_#fb923c]'
                  : ''}">Flujo (m3/h)</th
              >
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5 text-gray-300 font-mono">
            {#if registros.length === 0}
              <tr>
                <td
                  colspan="6"
                  class="px-6 py-12 text-center text-gray-500 bg-black/20"
                >
                  <svg
                    class="w-12 h-12 mx-auto mb-3 opacity-50"
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
                  No se encontraron registros en el servidor para este filtro.
                </td>
              </tr>
            {/if}

            {#each registros as reg}
              <tr
                class="hover:bg-white/5 transition-colors cursor-default group"
              >
                <td
                  class="px-6 py-4 font-sans font-medium text-gray-100 flex items-center gap-2"
                >
                  <span
                    class="w-2 h-2 rounded-full bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  ></span>
                  {reg.timestamp}
                </td>
                <td
                  class="px-6 py-4 transition-colors {metricaSeleccionada ===
                  'Temperatura'
                    ? 'bg-lime-900/20 text-lime-300 font-bold'
                    : ''}"
                >
                  {reg.temperatura.toFixed(1)}
                </td>
                <td
                  class="px-6 py-4 transition-colors {metricaSeleccionada ===
                  'pH'
                    ? 'bg-cyan-900/20 text-cyan-300 font-bold'
                    : ''}"
                >
                  {reg.ph.toFixed(1)}
                </td>
                <td
                  class="px-6 py-4 transition-colors {metricaSeleccionada ===
                  'Presión'
                    ? 'bg-purple-900/20 text-purple-300 font-bold'
                    : ''}"
                >
                  {reg.presion.toFixed(2)}
                </td>
                <td
                  class="px-6 py-4 transition-colors {metricaSeleccionada ===
                  'Gas'
                    ? 'bg-emerald-900/20 text-emerald-300 font-bold'
                    : ''}"
                >
                  {reg.gas}
                </td>
                <td
                  class="px-6 py-4 transition-colors {metricaSeleccionada ===
                  'Flujo'
                    ? 'bg-orange-900/20 text-orange-300 font-bold'
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
      class="px-6 py-4 border-t border-green-900/50 bg-[#001410] flex justify-between items-center text-xs text-gray-400"
    >
      <span
        >Mostrando <strong class="text-lime-400">{registros.length}</strong> registros
        encontrados</span
      >
      <div class="flex gap-2">
        <button
          class="px-4 py-1.5 rounded-md border border-green-900/50 bg-black hover:bg-green-900/30 text-gray-300 hover:text-white transition-colors"
          >Anterior</button
        >
        <button
          class="px-4 py-1.5 rounded-md border border-green-900/50 bg-black hover:bg-green-900/30 text-gray-300 hover:text-white transition-colors"
          >Siguiente</button
        >
      </div>
    </div>
  </div>
</div>

<style>
  .bio-gradient-bg {
    background-image: linear-gradient(
      to bottom right,
      #012b23,
      #011612,
      #013f31
    );
  }

  .interactive-card {
    transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
    position: relative;
    overflow: hidden;
  }

  .interactive-card:hover,
  .interactive-card:focus-within {
    transform: translateY(-4px) scale(1.01);
    box-shadow:
      0 10px 30px -10px rgba(52, 211, 153, 0.4),
      0 0 20px rgba(6, 182, 212, 0.2);
    border-color: rgba(163, 230, 81, 0.5) !important;
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
      rgba(255, 255, 255, 0.05) 0%,
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
