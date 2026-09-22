<script lang="ts">
  // Usamos Svelte 5 Runes para gestionar el estado
  let busqueda = $state("");
  let tipoFiltro = $state("Todos los tipos");
  let mostrarModalNuevo = $state(false); // Controla la ventana flotante

  // Base de datos de reportes inmutable
  const todosLosReportes = [
    {
      id: "REP001",
      nombre: "Resumen Operativo Diario - Tanque A",
      fecha: "08/08/2026",
      rango: "07/08/2026 - 08/08/2026",
      tipo: "Diario",
      estado: "Listo",
      size: "1.2 MB",
    },
    {
      id: "REP002",
      nombre: "Rendimiento Semanal de Producción de Biogás",
      fecha: "05/08/2026",
      rango: "29/07/2026 - 05/08/2026",
      tipo: "Semanal",
      estado: "Listo",
      size: "4.5 MB",
    },
    {
      id: "REP003",
      nombre: "Auditoría de Sensores y Estado de Nodos IoT",
      fecha: "01/08/2026",
      rango: "01/07/2026 - 31/07/2026",
      tipo: "Mantenimiento",
      estado: "Listo",
      size: "3.1 MB",
    },
    {
      id: "REP004",
      nombre: "Reporte de Eficiencia de Conversión Energética Jul-26",
      fecha: "31/07/2026",
      rango: "01/07/2026 - 31/07/2026",
      tipo: "Mensual",
      estado: "Listo",
      size: "5.0 MB",
    },
    {
      id: "REP005",
      nombre: "Incidencias Operativas y Alertas Críticas (T1)",
      fecha: "28/07/2026",
      rango: "01/07/2026 - 28/07/2026",
      tipo: "Alertas",
      estado: "Archivado",
      size: "2.8 MB",
    },
  ];

  // LÓGICA DE FILTRADO EN TIEMPO REAL
  // $derived se actualiza automáticamente cada vez que 'busqueda' o 'tipoFiltro' cambian
  let reportesFiltrados = $derived(
    todosLosReportes.filter((reporte) => {
      // Filtrar por tipo (Dropdown)
      const coincideTipo =
        tipoFiltro === "Todos los tipos" || reporte.tipo === tipoFiltro;

      // Filtrar por búsqueda de texto (Nombre o ID)
      const termino = busqueda.toLowerCase();
      const coincideBusqueda =
        reporte.nombre.toLowerCase().includes(termino) ||
        reporte.id.toLowerCase().includes(termino);

      return coincideTipo && coincideBusqueda;
    }),
  );

  // Función simulada para descargar
  function descargarArchivo(id: string, formato: string) {
    // En un proyecto real, aquí llamarías a tu API (ej. fetch(`/api/reportes/${id}/download?format=${formato}`))
    console.log(`Iniciando descarga: ${id}.${formato}`);

    // Mostramos un efecto visual en el botón (simulado)
    const btn = document.getElementById(`btn-${id}-${formato}`);
    if (btn) {
      const originalText = btn.innerHTML;
      btn.innerHTML = `<span class="animate-pulse">Descargando...</span>`;
      setTimeout(() => {
        btn.innerHTML = originalText;
      }, 2000);
    }
  }
</script>

<div class="space-y-6 max-w-[1600px] mx-auto pb-10">
  <!-- Cabecera del Módulo -->
  <div
    class="interactive-card flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-br from-[#01211b] to-black/80 p-6 rounded-2xl shadow-xl border border-green-900/50"
  >
    <div>
      <h1 class="glow-title text-4xl font-black tracking-tight">
        Centro de Reportes
      </h1>
      <p class="text-gray-400 mt-2 text-sm font-medium">
        Genera, visualiza y descarga históricos operativos de la planta de
        biodigestión en múltiples formatos.
      </p>
    </div>
    <button
      onclick={() => (mostrarModalNuevo = true)}
      class="px-6 py-3 bg-gradient-to-r from-green-700 to-green-500 hover:from-lime-600 hover:to-green-400 text-white text-sm font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(22,163,74,0.4)] hover:shadow-[0_0_20px_rgba(163,230,81,0.6)] flex items-center justify-center gap-2 shrink-0"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2.5"
          d="M12 4v16m8-8H4"
        ></path></svg
      >
      Generar Nuevo
    </button>
  </div>

  <!-- Barra de Búsqueda y Filtros -->
  <div
    class="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#001612] p-5 rounded-2xl shadow-sm border border-green-900/40 relative overflow-hidden"
  >
    <div
      class="absolute inset-0 bg-gradient-to-r from-lime-500/5 to-cyan-500/5 pointer-events-none"
    ></div>

    <div class="relative md:col-span-2 z-10">
      <span
        class="absolute inset-y-0 left-0 flex items-center pl-4 text-lime-500"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path></svg
        >
      </span>
      <input
        type="text"
        bind:value={busqueda}
        placeholder="Buscar por nombre de reporte o código ID..."
        class="w-full pl-12 pr-4 py-3 rounded-lg border border-green-900/60 bg-black/60 text-sm text-gray-200 font-medium focus:ring-2 focus:ring-lime-500/50 focus:border-lime-500 outline-none transition-all shadow-inner placeholder-gray-500"
      />
    </div>

    <div class="relative z-10">
      <select
        bind:value={tipoFiltro}
        class="w-full px-4 py-3 rounded-lg border border-cyan-900/60 bg-black/60 text-sm text-gray-200 font-bold focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition-all shadow-inner appearance-none pr-10 cursor-pointer"
      >
        <option class="bg-[#011612] text-white">Todos los tipos</option>
        <option class="bg-[#011612] text-white">Diario</option>
        <option class="bg-[#011612] text-white">Semanal</option>
        <option class="bg-[#011612] text-white">Mensual</option>
        <option class="bg-[#011612] text-white">Mantenimiento</option>
        <option class="bg-[#011612] text-white">Alertas</option>
      </select>
      <div
        class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-cyan-500"
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
  </div>

  <!-- Tabla de Reportes Históricos (Reacciona a los filtros) -->
  <div
    class="interactive-card bg-gradient-to-br from-[#01211b] to-black/80 rounded-2xl shadow-2xl border border-green-900/50 overflow-hidden"
  >
    <div class="overflow-x-auto">
      <table class="w-full text-left text-sm whitespace-nowrap">
        <thead
          class="bg-black/40 text-gray-400 font-semibold border-b border-green-900/50 uppercase tracking-wider text-[11px]"
        >
          <tr>
            <th class="px-6 py-5">ID</th>
            <th class="px-6 py-5">Nombre del Reporte</th>
            <th class="px-6 py-5">Período Cubierto</th>
            <th class="px-6 py-5">Fecha Generado</th>
            <th class="px-6 py-5 text-center">Exportar Archivo</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/5 text-gray-300">
          <!-- Mostrar mensaje si no hay resultados -->
          {#if reportesFiltrados.length === 0}
            <tr>
              <td
                colspan="5"
                class="px-6 py-16 text-center text-gray-500 bg-black/20"
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
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path></svg
                >
                No se encontraron reportes que coincidan con tu búsqueda.
              </td>
            </tr>
          {/if}

          <!-- Iterar sobre el array filtrado -->
          {#each reportesFiltrados as reporte}
            <tr class="hover:bg-white/5 transition-colors group">
              <td class="px-6 py-4 font-mono text-lime-500/70 font-bold"
                >{reporte.id}</td
              >
              <td class="px-6 py-4 flex flex-col">
                <span
                  class="font-bold text-gray-100 group-hover:text-white transition-colors"
                  >{reporte.nombre}</span
                >
                <div class="flex items-center gap-2 mt-1">
                  <span
                    class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-black/40 border border-green-900/50 text-cyan-400"
                    >{reporte.tipo}</span
                  >
                  <span class="text-[11px] text-gray-500 font-mono"
                    >{reporte.size}</span
                  >
                </div>
              </td>
              <td class="px-6 py-4 font-mono text-gray-400 text-xs"
                >{reporte.rango}</td
              >
              <td class="px-6 py-4 font-medium text-gray-300"
                >{reporte.fecha}</td
              >

              <td class="px-6 py-4">
                <!-- BOTONES DE EXPORTACIÓN MUNDIAL (PDF, EXCEL, CSV) -->
                <div class="flex items-center justify-center gap-2">
                  <!-- Botón PDF -->
                  <button
                    id="btn-{reporte.id}-pdf"
                    onclick={() => descargarArchivo(reporte.id, "pdf")}
                    class="flex items-center justify-center w-9 h-9 bg-red-950/40 hover:bg-red-900/60 border border-red-900/50 hover:border-red-500 text-red-400 rounded-lg transition-all"
                    title="Descargar como PDF"
                  >
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"
                      ><path
                        fill-rule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                        clip-rule="evenodd"
                      /></svg
                    >
                  </button>
                  <!-- Botón EXCEL (XLSX) -->
                  <button
                    id="btn-{reporte.id}-xlsx"
                    onclick={() => descargarArchivo(reporte.id, "xlsx")}
                    class="flex items-center justify-center w-9 h-9 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-900/50 hover:border-emerald-500 text-emerald-400 rounded-lg transition-all"
                    title="Descargar como Excel (XLSX)"
                  >
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"
                      ><path
                        d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a2 2 0 100-4V6z"
                      /></svg
                    >
                  </button>
                  <!-- Botón CSV -->
                  <button
                    id="btn-{reporte.id}-csv"
                    onclick={() => descargarArchivo(reporte.id, "csv")}
                    class="flex items-center justify-center w-9 h-9 bg-blue-950/40 hover:bg-blue-900/60 border border-blue-900/50 hover:border-blue-500 text-blue-400 rounded-lg transition-all"
                    title="Descargar Datos Planos (CSV)"
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
                        d="M4 6h16M4 10h16M4 14h16M4 18h16"
                      ></path></svg
                    >
                  </button>
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <div
      class="px-6 py-4 border-t border-green-900/50 bg-[#001410] flex justify-between items-center text-xs text-gray-400"
    >
      <span
        >Mostrando <strong class="text-lime-400"
          >{reportesFiltrados.length}</strong
        > reportes</span
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

<!-- ============================================== -->
<!-- MODAL FLOTANTE PARA "GENERAR NUEVO REPORTE"    -->
<!-- ============================================== -->
{#if mostrarModalNuevo}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm transition-opacity"
  >
    <div
      class="bg-gradient-to-br from-[#01211b] to-[#001410] border border-green-500/30 rounded-2xl shadow-[0_0_40px_rgba(22,163,74,0.3)] w-full max-w-lg overflow-hidden transform scale-100 transition-transform"
    >
      <div
        class="flex justify-between items-center p-6 border-b border-white/10"
      >
        <h3 class="text-xl font-bold text-white glow-title">
          Crear Nuevo Reporte
        </h3>
        <button
          onclick={() => (mostrarModalNuevo = false)}
          class="text-gray-400 hover:text-white bg-black/20 hover:bg-red-500/20 rounded-full p-2 transition-colors"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path></svg
          >
        </button>
      </div>

      <div class="p-6 space-y-4">
        <div>
          <label
            for="tituloReporte"
            class="block text-xs font-bold text-gray-400 mb-1 uppercase"
            >Título del Reporte</label
          >
          <input
            type="text"
            id="tituloReporte"
            placeholder="Ej. Auditoría de Sensores Agitación..."
            class="w-full px-4 py-3 rounded-lg border border-green-900/60 bg-black/60 text-white focus:border-lime-500 outline-none"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label
              for="fechaIni"
              class="block text-xs font-bold text-gray-400 mb-1 uppercase"
              >Desde</label
            >
            <input
              type="date"
              id="fechaIni"
              class="w-full px-4 py-3 rounded-lg border border-green-900/60 bg-black/60 text-white focus:border-lime-500 outline-none"
            />
          </div>
          <div>
            <label
              for="fechaFin"
              class="block text-xs font-bold text-gray-400 mb-1 uppercase"
              >Hasta</label
            >
            <input
              type="date"
              id="fechaFin"
              class="w-full px-4 py-3 rounded-lg border border-green-900/60 bg-black/60 text-white focus:border-lime-500 outline-none"
            />
          </div>
        </div>
      </div>

      <div
        class="p-6 bg-black/40 border-t border-white/5 flex justify-end gap-3"
      >
        <button
          onclick={() => (mostrarModalNuevo = false)}
          class="px-5 py-2.5 rounded-lg font-bold text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
          >Cancelar</button
        >
        <button
          onclick={() => {
            alert("Generando y procesando la data...");
            mostrarModalNuevo = false;
          }}
          class="px-5 py-2.5 bg-lime-600 hover:bg-lime-500 text-black font-black rounded-lg transition-colors shadow-[0_0_15px_rgba(163,230,81,0.4)]"
          >Comenzar Generación</button
        >
      </div>
    </div>
  </div>
{/if}

<style>
  /* --- EFECTOS VISUALES BIO-ENERGÍA --- */
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
