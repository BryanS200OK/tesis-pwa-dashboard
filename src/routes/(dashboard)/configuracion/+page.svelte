<script lang="ts">
  // Usamos Svelte 5 Runes para gestionar el estado del formulario de configuración
  let nombreOperador = $state("Administrador BioCore");
  let emailOperador = $state("ingenieria@biocore.ve");

  // Umbrales de alerta crítica
  let tempMax = $state(42.0);
  let phMin = $state(6.2);
  let presMax = $state(1.8);

  // Estado para notificaciones por email
  let notificarEmail = $state(true);

  function guardarConfiguracion() {
    // Aquí iría la lógica para enviar los datos a la API (endpoint +page.server.ts)
    alert(
      "Sincronizando nuevos parámetros operativos con los dispositivos IoT...",
    );
  }
</script>

<div class="space-y-6 max-w-5xl">
  <!-- Cabecera -->
  <div class="flex items-center justify-between">
    <div>
      <h1
        class="text-3xl font-bold text-gray-900 dark:text-white tracking-tight"
      >
        Configuración del Sistema
      </h1>
      <p class="text-gray-500 dark:text-gray-400 mt-1">
        Ajusta los parámetros operativos, umbrales de alerta y perfil de
        usuario.
      </p>
    </div>
    <button
      onclick={guardarConfiguracion}
      class="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors shadow-sm flex items-center gap-2"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
        ></path></svg
      >
      Guardar Cambios
    </button>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <!-- Sección Perfil -->
    <div
      class="md:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-4"
    >
      <h2
        class="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2"
      >
        <svg
          class="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
          ></path></svg
        >
        Perfil del Operador
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            for="nombre"
            class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1"
            >Nombre Completo</label
          >
          <input
            type="text"
            id="nombre"
            bind:value={nombreOperador}
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-200 dark:focus:ring-green-900 focus:border-green-400 transition"
          />
        </div>
        <div>
          <label
            for="email"
            class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1"
            >Correo Electrónico</label
          >
          <input
            type="email"
            id="email"
            bind:value={emailOperador}
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-200 dark:focus:ring-green-900 focus:border-green-400 transition"
          />
        </div>
      </div>
    </div>

    <!-- Sección Preferencias -->
    <div
      class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-4"
    >
      <h2
        class="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2"
      >
        <svg
          class="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          ></path></svg
        >
        Notificaciones
      </h2>
      <div class="flex items-center justify-between py-2">
        <span class="text-sm text-gray-700 dark:text-gray-300"
          >Alertas críticas por Email</span
        >
        <!-- svelte-ignore a11y_consider_explicit_label -->
        <button
          onclick={() => (notificarEmail = !notificarEmail)}
          class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 {notificarEmail
            ? 'bg-green-600'
            : 'bg-gray-300 dark:bg-gray-600'}"
        >
          <span
            class="inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300 {notificarEmail
              ? 'translate-x-6'
              : 'translate-x-1'}"
          ></span>
        </button>
      </div>
    </div>

    <!-- Sección Umbrales Críticos -->
    <div
      class="md:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-5"
    >
      <h2
        class="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2"
      >
        <svg
          class="w-5 h-5 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          ></path></svg
        >
        Umbrales de Alerta Crítica (IoT)
      </h2>
      <p
        class="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700"
      >
        Si un sensor supera estos valores, se dispararán alarmas visuales en el
        panel y se enviarán notificaciones inmediatas.
      </p>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div class="space-y-1">
          <label
            for="temp"
            class="block text-sm font-semibold text-gray-700 dark:text-gray-300"
            >Temperatura Máxima</label
          >
          <div class="relative">
            <input
              type="number"
              id="temp"
              bind:value={tempMax}
              step="0.1"
              class="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-lg focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900 focus:border-red-400 transition"
            />
            <span
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold"
              >°C</span
            >
          </div>
        </div>

        <div class="space-y-1">
          <label
            for="ph"
            class="block text-sm font-semibold text-gray-700 dark:text-gray-300"
            >pH Mínimo</label
          >
          <div class="relative">
            <input
              type="number"
              id="ph"
              bind:value={phMin}
              step="0.1"
              class="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-lg focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900 focus:border-red-400 transition"
            />
            <span
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold"
              >pH</span
            >
          </div>
        </div>

        <div class="space-y-1">
          <label
            for="presion"
            class="block text-sm font-semibold text-gray-700 dark:text-gray-300"
            >Presión Máxima</label
          >
          <div class="relative">
            <input
              type="number"
              id="presion"
              bind:value={presMax}
              step="0.01"
              class="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-lg focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900 focus:border-red-400 transition"
            />
            <span
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold"
              >bar</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
