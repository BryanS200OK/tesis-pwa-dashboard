<script lang="ts">
  // Simulamos una lista de dispositivos IoT conectados usando Svelte 5 Runes
  let dispositivos = $state([
    {
      id: "BC-ESP32-01",
      nombre: "Nodo Principal Tanque A",
      ubicacion: "Biodigestor Primario",
      tipo: "ESP32 DevKit V1",
      estado: "Conectado",
      ultimaip: "192.168.1.50",
    },
    {
      id: "BC-ARD-02",
      nombre: "Sensor Ph Flujo Entrada",
      ubicacion: "Tubería de Carga",
      tipo: "Arduino Uno WiFi",
      estado: "Desconectado",
      ultimaip: "192.168.1.51",
    },
    {
      id: "BC-ESP32-03",
      nombre: "Control Agitador y Temp",
      ubicacion: "Biodigestor Secundario",
      tipo: "ESP32 DevKit V1",
      estado: "Conectado",
      ultimaip: "192.168.1.52",
    },
  ]);

  // Función para simular añadir un dispositivo
  function agregarDispositivo() {
    alert("Abriendo asistente de emparejamiento para nuevo nodo BioCore...");
  }
</script>

<div class="space-y-6">
  <!-- Cabecera del Módulo -->
  <div class="flex items-center justify-between">
    <div>
      <h1
        class="text-3xl font-bold text-gray-900 dark:text-white tracking-tight"
      >
        Gestión de Dispositivos IoT
      </h1>
      <p class="text-gray-500 dark:text-gray-400 mt-1">
        Administra los nodos sensores y actuadores desplegados en la planta.
      </p>
    </div>
    <button
      onclick={agregarDispositivo}
      class="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors shadow-sm flex items-center gap-2"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 4v16m8-8H4"
        ></path></svg
      >
      Añadir Nodo
    </button>
  </div>

  <!-- Rejilla de Dispositivos -->
  <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
    {#each dispositivos as dispositivo}
      <div
        class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-green-200 dark:hover:border-green-900 transition-colors"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="flex items-center gap-4">
            <!-- Icono abstracto de Microcontrolador -->
            <div
              class="p-3 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-xl"
            >
              <svg
                class="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                ><path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                ></path></svg
              >
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                {dispositivo.nombre}
              </h3>
              <p class="text-sm text-green-600 dark:text-green-400 font-medium">
                {dispositivo.id} • {dispositivo.tipo}
              </p>
            </div>
          </div>

          <!-- Indicador de Estado -->
          <div
            class="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold {dispositivo.estado ===
            'Conectado'
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}"
          >
            <span class="relative flex h-2 w-2">
              {#if dispositivo.estado === "Conectado"}
                <span
                  class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"
                ></span>
              {/if}
              <span
                class="relative inline-flex rounded-full h-2 w-2 {dispositivo.estado ===
                'Conectado'
                  ? 'bg-green-500'
                  : 'bg-red-500'}"
              ></span>
            </span>
            {dispositivo.estado}
          </div>
        </div>

        <div
          class="mt-6 grid grid-cols-2 gap-4 text-sm border-t border-gray-100 dark:border-gray-700 pt-4"
        >
          <div>
            <span class="block text-gray-500 dark:text-gray-400 font-medium"
              >Ubicación</span
            >
            <span class="font-semibold text-gray-800 dark:text-gray-200"
              >{dispositivo.ubicacion}</span
            >
          </div>
          <div>
            <span class="block text-gray-500 dark:text-gray-400 font-medium"
              >Última IP Asignada</span
            >
            <span class="font-mono text-gray-800 dark:text-gray-200"
              >{dispositivo.ultimaip}</span
            >
          </div>
        </div>

        <div class="mt-5 flex justify-end gap-2">
          <button
            class="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >Configurar Pins</button
          >
          <button
            class="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >Reiniciar</button
          >
        </div>
      </div>
    {/each}
  </div>
</div>
