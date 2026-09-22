<script lang="ts">
  // Simulamos datos históricos y actuales usando Svelte 5 Runes
  let produccionDiariaTotal = $state(45.2);
  let produccionAcumuladaMes = $state(1250);
  let eficienciaObjetivo = $state(88);
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h1
        class="text-3xl font-bold text-gray-900 dark:text-white tracking-tight"
      >
        Producción de Biogás
      </h1>
      <p class="text-gray-500 dark:text-gray-400 mt-1">
        Análisis de rendimiento y conversión energética del reactor anaerobio.
      </p>
    </div>
    <div class="flex gap-2">
      <button
        class="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-bold rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition"
      >
        Exportar Datos
      </button>
      <button
        class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors shadow-sm"
      >
        Ver Historial Completo
      </button>
    </div>
  </div>

  <!-- Cuadrícula de Datos Clave -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <!-- Volumen Total Hoy -->
    <div
      class="bg-gradient-to-br from-green-500 to-green-700 p-6 rounded-2xl shadow-lg text-white"
    >
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-green-100 font-medium">Volumen Total Hoy</h3>
        <span class="text-xs bg-black/20 px-3 py-1 rounded-full text-green-100"
          >Estable</span
        >
      </div>
      <div class="text-5xl font-black">
        {produccionDiariaTotal}
        <span class="text-2xl font-bold opacity-80">m³</span>
      </div>
      <p class="mt-4 text-green-100 text-sm">
        Producción diaria promedio de gas metano.
      </p>
    </div>

    <!-- Acumulado Mes -->
    <div
      class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
    >
      <h3 class="text-gray-500 dark:text-gray-400 font-medium mb-1">
        Acumulado Mes (Agosto 2026)
      </h3>
      <div class="text-5xl font-black text-gray-900 dark:text-white">
        {produccionAcumuladaMes}
        <span class="text-2xl font-bold text-gray-400">m³</span>
      </div>
      <div
        class="mt-4 text-sm text-green-500 font-semibold flex items-center gap-1"
      >
        <span>↑</span> Rendimiento superior a Julio.
      </div>
    </div>

    <!-- Eficiencia % -->
    <div
      class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
    >
      <h3 class="text-gray-500 dark:text-gray-400 font-medium mb-1">
        Eficiencia de Conversión %
      </h3>
      <div class="text-5xl font-black text-gray-900 dark:text-white">
        {eficienciaObjetivo}<span class="text-2xl font-bold text-gray-400"
          >%</span
        >
      </div>
      <div class="mt-4 text-sm text-gray-500 flex items-center gap-1">
        Convertido a partir de 2.5 ton biomasa/día.
      </div>
    </div>
  </div>

  <!-- Contenedor del Gráfico de Producción Semanal (Simulado) -->
  <div
    class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 min-h-[400px]"
  >
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-gray-700 dark:text-gray-200 font-bold text-lg">
        Tendencia de Producción Semanal (m³)
      </h3>
      <div
        class="flex items-center gap-2 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-gray-50 dark:bg-gray-900 text-sm text-gray-600 dark:text-gray-300"
      >
        Últimos 7 días
      </div>
    </div>

    <div
      class="w-full h-96 bg-gray-50 dark:bg-gray-900 border border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex items-center justify-center"
    >
      <p class="text-gray-400 dark:text-gray-500 font-medium text-center">
        <span class="block text-3xl mb-2">📊</span>
        Aquí se integrará el gráfico detallado de producción (ECharts/Chart.js)
      </p>
    </div>
  </div>
</div>
