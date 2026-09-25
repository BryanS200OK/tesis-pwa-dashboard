<script lang="ts">
  import { collection, getDocs, query, orderBy } from "firebase/firestore";
  import { db } from "$lib/firebase/firebase";

  // --- VARIABLES DE ESTADO Y FILTROS ---
  let busqueda = $state("");
  let tipoFiltro = $state("Todos los tipos");
  let mostrarModalNuevo = $state(false);
  let generandoDescarga = $state(false);

  // --- INTERFAZ ESTRICTA PARA REPORTES SIMULADOS ---
  interface Reporte {
    id: string;
    nombre: string;
    fecha: string;
    rango: string;
    tipo: string;
    estado: string;
    size: string;
  }

  // Base de datos de reportes inmutable (Simulada para visualización)
  const todosLosReportes: Reporte[] = [
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
  let reportesFiltrados = $derived(
    todosLosReportes.filter((reporte) => {
      const coincideTipo =
        tipoFiltro === "Todos los tipos" || reporte.tipo === tipoFiltro;
      const termino = busqueda.toLowerCase();
      const coincideBusqueda =
        reporte.nombre.toLowerCase().includes(termino) ||
        reporte.id.toLowerCase().includes(termino);
      return coincideTipo && coincideBusqueda;
    }),
  );

  // --- PAGINACIÓN ---
  let paginaActual = $state(1);
  let itemsPorPagina = 4;
  let totalPaginas = $derived(
    Math.ceil(reportesFiltrados.length / itemsPorPagina),
  );
  let reportesPaginados = $derived(
    reportesFiltrados.slice(
      (paginaActual - 1) * itemsPorPagina,
      paginaActual * itemsPorPagina,
    ),
  );

  function paginaSiguiente() {
    if (paginaActual < totalPaginas) paginaActual++;
  }
  function paginaAnterior() {
    if (paginaActual > 1) paginaActual--;
  }

  // --- LÓGICA PARA EXPORTAR DATOS REALES DE FIREBASE (CSV) ---
  // Esta función descarga todo el historial de la BD y crea un archivo CSV para que el usuario lo abra en Excel
  async function exportarDatosRealesCSV() {
    generandoDescarga = true;
    try {
      const q = query(
        collection(db, "lecturas_biodigestor"),
        orderBy("timestamp", "desc"),
      );
      const querySnapshot = await getDocs(q);

      let csvContent = "data:text/csv;charset=utf-8,";
      // Cabecera del archivo Excel/CSV
      csvContent +=
        "FECHA_HORA,TEMPERATURA_C,METANO_PPM,PH,PRESION_BAR,CAUDAL\n";

      querySnapshot.forEach((doc) => {
        const d = doc.data();
        if (d.timestamp) {
          const fechaStr = d.timestamp.toDate().toLocaleString("es-VE");
          // Si no existe el dato, ponemos 'N/A'
          const temp = d.temperatura_c ?? "N/A";
          const metano = d.metano_ppm ?? "N/A";
          const ph = d.ph ?? "N/A";
          const presion = d.presion ?? "N/A";
          const caudal = d.caudal ?? "N/A";

          csvContent += `${fechaStr},${temp},${metano},${ph},${presion},${caudal}\n`;
        }
      });

      // Crear archivo y forzar descarga
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute(
        "download",
        `Reporte_BioCore_${new Date().toISOString().split("T")[0]}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exportando datos: ", error);
      alert("Hubo un error al intentar generar el archivo.");
    } finally {
      generandoDescarga = false;
    }
  }

  function simularDescargaVisual(id: string, formato: string) {
    if (formato === "csv" || formato === "xlsx") {
      // Ejecuta la descarga real si piden CSV o Excel
      exportarDatosRealesCSV();
      return;
    }

    const btn = document.getElementById(`btn-${id}-${formato}`);
    if (btn) {
      const originalText = btn.innerHTML;
      btn.innerHTML = `<svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`;
      setTimeout(() => {
        btn.innerHTML = originalText;
      }, 2000);
    }
  }
</script>

<div class="space-y-6 max-w-[1600px] mx-auto pb-10">
  <!-- CABECERA PRINCIPAL -->
  <div
    class="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-green-900/30 pb-6"
  >
    <div>
      <h1 class="glow-title text-4xl font-black tracking-tight mb-2">
        Centro de Reportes
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
            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          ></path></svg
        >
        Genera, visualiza y descarga históricos operativos de la planta.
      </p>
    </div>

    <button
      onclick={() => (mostrarModalNuevo = true)}
      class="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-green-500 text-white text-sm font-bold rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] border border-emerald-400/50 hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all duration-300 hover:-translate-y-0.5"
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

  <!-- BARRA DE BÚSQUEDA Y FILTROS -->
  <div
    class="interactive-card flex flex-col md:flex-row gap-4 bg-gradient-to-br from-[#011c17] to-[#000a08] p-6 rounded-3xl shadow-xl border border-emerald-900/40 relative overflow-hidden"
  >
    <div
      class="absolute -top-16 -left-16 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"
    ></div>

    <div class="relative w-full md:w-2/3 z-10 group">
      <span
        class="absolute inset-y-0 left-0 flex items-center pl-4 text-emerald-500"
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
        class="w-full pl-12 pr-4 py-3.5 rounded-xl border border-emerald-900/50 bg-[#001410] text-sm text-gray-200 font-medium focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all shadow-inner placeholder-gray-600 group-hover:border-emerald-700/80"
      />
    </div>

    <div class="relative w-full md:w-1/3 z-10 group">
      <select
        bind:value={tipoFiltro}
        class="w-full px-4 py-3.5 rounded-xl border border-cyan-900/50 bg-[#001410] text-sm text-gray-200 font-bold focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition-all shadow-inner appearance-none cursor-pointer group-hover:border-cyan-700/80"
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

  <!-- TABLA DE REPORTES HISTÓRICOS -->
  <div
    class="interactive-card bg-[#000a08]/90 backdrop-blur-md rounded-3xl shadow-2xl border border-emerald-900/30 overflow-hidden relative"
  >
    <div class="overflow-x-auto">
      <table class="w-full text-left text-sm whitespace-nowrap">
        <thead
          class="bg-gradient-to-r from-[#01211b] to-[#001410] text-gray-400 font-bold border-b border-emerald-900/40 uppercase tracking-widest text-[10px]"
        >
          <tr>
            <th class="px-8 py-6 pl-10">ID</th>
            <th class="px-6 py-6">Nombre del Reporte</th>
            <th class="px-6 py-6">Período Cubierto</th>
            <th class="px-6 py-6">Fecha Generado</th>
            <th class="px-6 py-6 text-center">Exportar Archivo</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-emerald-900/20 text-gray-300">
          {#if reportesPaginados.length === 0}
            <tr>
              <td colspan="5" class="px-6 py-20 text-center text-gray-500">
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
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path></svg
                  >
                  <p class="tracking-wide font-mono">
                    No se encontraron reportes que coincidan con tu búsqueda.
                  </p>
                </div>
              </td>
            </tr>
          {/if}

          <!-- CORRECCIÓN DE KEY: Añadido (reporte.id) -->
          {#each reportesPaginados as reporte (reporte.id)}
            <tr
              class="hover:bg-emerald-900/10 transition-colors cursor-default group"
            >
              <td
                class="px-8 py-5 pl-10 font-mono text-emerald-400/80 font-bold flex items-center gap-3"
              >
                <span
                  class="w-1.5 h-1.5 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_8px_#10b981]"
                ></span>
                {reporte.id}
              </td>
              <td class="px-6 py-5 flex flex-col">
                <span
                  class="font-bold text-gray-200 group-hover:text-white transition-colors text-base"
                  >{reporte.nombre}</span
                >
                <div class="flex items-center gap-2 mt-1.5">
                  <span
                    class="text-[9px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-md bg-[#001410] border border-cyan-900/50 text-cyan-400 shadow-inner"
                    >{reporte.tipo}</span
                  >
                  <span class="text-[10px] text-gray-500 font-mono"
                    >{reporte.size}</span
                  >
                </div>
              </td>
              <td class="px-6 py-5 font-mono text-gray-400 text-xs"
                >{reporte.rango}</td
              >
              <td class="px-6 py-5 font-medium text-gray-300"
                >{reporte.fecha}</td
              >
              <td class="px-6 py-5">
                <div class="flex items-center justify-center gap-2">
                  <!-- Botón PDF -->
                  <button
                    id="btn-{reporte.id}-pdf"
                    onclick={() => simularDescargaVisual(reporte.id, "pdf")}
                    class="flex items-center justify-center w-10 h-10 bg-red-950/20 hover:bg-red-900/40 border border-red-900/30 hover:border-red-500 text-red-500 hover:text-red-400 rounded-xl transition-all shadow-inner"
                    title="Descargar como PDF"
                  >
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
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
                    onclick={() => simularDescargaVisual(reporte.id, "xlsx")}
                    class="flex items-center justify-center w-10 h-10 bg-emerald-950/20 hover:bg-emerald-900/40 border border-emerald-900/30 hover:border-emerald-500 text-emerald-500 hover:text-emerald-400 rounded-xl transition-all shadow-inner"
                    title="Descargar datos reales (CSV)"
                  >
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                      ><path
                        d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a2 2 0 100-4V6z"
                      /></svg
                    >
                  </button>
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <!-- PIE DE TABLA Y PAGINACIÓN -->
    <div
      class="px-8 py-5 border-t border-emerald-900/40 bg-[#001410] flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400 gap-4"
    >
      <span class="tracking-wide">
        Mostrando <strong class="text-emerald-400 font-bold"
          >{reportesFiltrados.length > 0
            ? (paginaActual - 1) * itemsPorPagina + 1
            : 0}</strong
        >
        a
        <strong class="text-emerald-400 font-bold"
          >{Math.min(
            paginaActual * itemsPorPagina,
            reportesFiltrados.length,
          )}</strong
        >
        de
        <strong class="text-white font-bold">{reportesFiltrados.length}</strong> reportes
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

<!-- ============================================== -->
<!-- MODAL FLOTANTE PARA "GENERAR NUEVO REPORTE"    -->
<!-- ============================================== -->
{#if mostrarModalNuevo}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm transition-opacity"
  >
    <div
      class="bg-gradient-to-br from-[#01211b] to-[#001410] border border-emerald-500/30 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.2)] w-full max-w-lg overflow-hidden transform scale-100 transition-transform"
    >
      <div
        class="flex justify-between items-center p-6 md:p-8 border-b border-emerald-900/30"
      >
        <h3 class="text-2xl font-bold text-white glow-title tracking-tight">
          Generar Reporte Dinámico
        </h3>
        <button
          aria-label="Cerrar"
          onclick={() => (mostrarModalNuevo = false)}
          class="text-gray-400 hover:text-white bg-black/40 hover:bg-red-500/20 rounded-full p-2.5 transition-colors border border-gray-800 hover:border-red-500/50"
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

      <div class="p-6 md:p-8 space-y-6">
        <div>
          <label
            for="tituloReporte"
            class="block text-[10px] font-bold text-emerald-400/80 mb-2 uppercase tracking-widest pl-1"
            >Título del Reporte</label
          >
          <input
            type="text"
            id="tituloReporte"
            placeholder="Ej. Extracción General del Mes..."
            class="w-full px-5 py-3.5 rounded-xl border border-emerald-900/50 bg-[#001410] text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 outline-none shadow-inner transition-all"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label
              for="fechaIni"
              class="block text-[10px] font-bold text-emerald-400/80 mb-2 uppercase tracking-widest pl-1"
              >Fecha Desde</label
            >
            <input
              type="date"
              id="fechaIni"
              class="w-full px-4 py-3.5 rounded-xl border border-emerald-900/50 bg-[#001410] text-gray-300 font-mono focus:border-emerald-500 outline-none shadow-inner transition-all"
            />
          </div>
          <div>
            <label
              for="fechaFin"
              class="block text-[10px] font-bold text-emerald-400/80 mb-2 uppercase tracking-widest pl-1"
              >Fecha Hasta</label
            >
            <input
              type="date"
              id="fechaFin"
              class="w-full px-4 py-3.5 rounded-xl border border-emerald-900/50 bg-[#001410] text-gray-300 font-mono focus:border-emerald-500 outline-none shadow-inner transition-all"
            />
          </div>
        </div>
      </div>

      <div
        class="p-6 md:p-8 bg-[#000a08]/50 border-t border-emerald-900/30 flex justify-end gap-3"
      >
        <button
          onclick={() => (mostrarModalNuevo = false)}
          class="px-6 py-3 rounded-xl font-bold text-gray-400 hover:text-white bg-[#001410] border border-gray-800 hover:border-gray-600 transition-colors shadow-inner"
        >
          Cancelar
        </button>
        <button
          onclick={() => {
            exportarDatosRealesCSV();
            mostrarModalNuevo = false;
          }}
          class="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-500 hover:from-green-500 hover:to-emerald-400 text-white font-black rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)] flex items-center gap-2"
        >
          {#if generandoDescarga}
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
            Exportando...
          {:else}
            Extraer Datos de la Nube
          {/if}
        </button>
      </div>
    </div>
  </div>
{/if}

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
