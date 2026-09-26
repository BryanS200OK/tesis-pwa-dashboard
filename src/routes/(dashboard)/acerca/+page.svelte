<script lang="ts">
  // Datos estáticos del proyecto
  const versionInfo = {
    software: "v1.0.2-stable",
    hardware_api: "v1.0.0",
    last_update: "05 de Agosto, 2026",
  };
</script>

<div class="space-y-8 max-w-6xl mx-auto">
  <!-- Cabecera con Logo del Rayo y Gradient Effect -->
  <div
    class="water-card text-center bg-gradient-to-br from-[#01211b] to-black/80 p-10 rounded-3xl shadow-[0_0_20px_rgba(22,163,74,0.4)] border border-green-900/50 hover:border-lime-400 flex flex-col items-center"
  >
    <!-- Ícono del Rayo (Reemplazo del biodigestor) -->
    <div
      class="w-24 h-24 mb-6 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all duration-300 hover:scale-110 border border-emerald-400/30"
    >
      <svg
        class="w-12 h-12 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 10V3L4 14h7v7l9-11h-7z"
        ></path>
      </svg>
    </div>

    <h1
      class="text-5xl font-black bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent tracking-tighter"
    >
      BioCore IoT
    </h1>
    <p
      class="text-xl text-green-400 font-bold mt-2 hover:text-lime-400 transition-colors"
    >
      Plataforma de Monitoreo Inteligente para Biodigestores
    </p>
    <p class="text-white mt-4 max-w-2xl text-center">
      Unificando ingeniería de software avanzada con hardware de campo para
      garantizar la estabilidad operativa y maximizar la producción de biogás en
      Venezuela.
    </p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
    <!-- Misión Técnica with Water Shimmer effect base -->
    <div
      class="water-card md:col-span-2 bg-gradient-to-br from-[#01211b] to-black/80 p-8 rounded-2xl shadow-[0_0_15px_rgba(22,163,74,0.3)] border border-green-900/50 hover:border-cyan-400 space-y-4"
    >
      <h2
        class="text-2xl font-bold text-lime-400 hover:text-cyan-400 flex items-center gap-2"
      >
        <svg
          class="w-6 h-6 text-lime-400"
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
        Nuestra Misión Técnica
      </h2>
      <p class="text-white leading-relaxed">
        BioCore IoT nace de la necesidad de digitalizar y optimizar procesos
        biológicos complejos. Nuestra misión es proporcionar a los ingenieros y
        operadores de planta una herramienta de telemetría confiable y en tiempo
        real. Utilizamos microcontroladores de código abierto (ESP32/Arduino) y
        una arquitectura web moderna para transformar lecturas sensoriales
        crudas en decisiones operativas inteligentes, previniendo la
        acidificación del reactor y asegurando un flujo constante de energía
        renovable.
      </p>
    </div>

    <!-- Detalles Técnicos -->
    <div
      class="water-card bg-gradient-to-br from-[#01211b] to-black/80 p-8 rounded-2xl shadow-[0_0_15px_rgba(22,163,74,0.3)] border border-green-900/50 hover:border-cyan-400 space-y-4 font-mono text-sm"
    >
      <h2 class="text-xl font-bold text-lime-400 font-sans hover:text-cyan-400">
        Detalles del Sistema
      </h2>
      <div class="space-y-2 text-white">
        <p>
          <span class="font-semibold text-gray-500">Plataforma:</span>
          {versionInfo.software}
        </p>
        <p>
          <span class="font-semibold text-gray-500">IoT API:</span>
          {versionInfo.hardware_api}
        </p>
        <p>
          <span class="font-semibold text-gray-500">Actualizado:</span>
          {versionInfo.last_update}
        </p>
        <p>
          <span class="font-semibold text-gray-500">Core:</span> SvelteKit / Svelte
          5
        </p>
        <p><span class="font-semibold text-gray-500">UI:</span> Tailwind CSS</p>
      </div>
    </div>
  </div>

  <!-- Footer Acerca de -->
  <div class="text-center text-xs text-gray-500 pb-6">
    BioCore IoT Venezuela • Desarrollado para ingeniería y sostenibilidad
    anaerobia • 2026
  </div>
</div>

<style>
  /* Common interactive card styles for water effect, gradients, and motion */
  .water-card {
    transition: all 0.3s ease-in-out;
    background-size: 200% 200%;
  }

  .water-card:hover,
  .water-card:active {
    transform: translateY(-8px) scale(1.03);
    box-shadow: 0 0 25px rgba(22, 163, 74, 0.5);
  }

  .water-card-title-hover:hover {
    color: #a3e635;
  }
</style>
