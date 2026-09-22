<script lang="ts">
  // Datos estáticos del proyecto
  const versionInfo = {
    software: "v1.0.2-stable",
    hardware_api: "v1.0.0",
    last_update: "05 de Agosto, 2026",
  };

  const equipo = [
    { nombre: "Bryan Salazar", rol: "Líder de Proyecto / Full-Stack" },
    { nombre: "Tairon Rojas", rol: "Ingeniería IoT / Firmware" },
    { nombre: "Emily Rojas", rol: "Análisis de Datos Biológicos" },
    { nombre: "Blas González", rol: "Infraestructura y Redes" },
    { nombre: "Jeanny Monagas", rol: "QA / Documentación Técnica" },
    { nombre: "Alexander Fernández", rol: "Soporte Técnico de Campo" },
  ];
</script>

<div class="space-y-8 max-w-6xl mx-auto">
  <!-- Cabecera con Logo Grande y Gradient Effect -->
  <div
    class="water-card text-center bg-gradient-to-br from-charcoal to-deepteal/60 p-10 rounded-3xl shadow-[0_0_20px_rgba(22,163,74,0.4)] border border-white/10 hover:border-lime-400 flex flex-col items-center"
  >
    <!-- Ícono del Biodigestor IoT (Reutilizado del layout pero más grande) -->
    <svg
      class="w-24 h-24 drop-shadow-lg mb-6 transition-all duration-300 hover:scale-110"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="bgGradLarge" x1="0%" y1="0%" x2="100%" y2="100%"
          ><stop offset="0%" stop-color="#b4f836" /><stop
            offset="100%"
            stop-color="#0f8b3c"
          /></linearGradient
        >
        <linearGradient id="domeGradLarge" x1="0%" y1="0%" x2="100%" y2="0%"
          ><stop offset="50%" stop-color="#f7fcd6" /><stop
            offset="100%"
            stop-color="#e2f5a6"
          /></linearGradient
        >
      </defs>
      <circle cx="50" cy="50" r="48" fill="url(#bgGradLarge)" />
      <path
        d="M 28 45 L 28 36 C 28 20 72 20 72 36 L 72 45 Z"
        fill="url(#domeGradLarge)"
      />
      <rect x="28" y="45" width="44" height="30" fill="#0c6b32" />
      <rect x="50" y="45" width="22" height="30" fill="#0f7a3a" />
      <rect x="33" y="42" width="6" height="33" rx="3" fill="#46b749" />
      <rect x="43" y="42" width="6" height="33" rx="3" fill="#46b749" />
      <rect x="56" y="52" width="12" height="7" fill="#def494" />
      <path
        d="M 20 74 L 80 74 C 80 86 65 93 50 93 C 35 93 20 86 20 74 Z"
        fill="#9de234"
      />
    </svg>

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
      class="water-card md:col-span-2 bg-gradient-to-br from-charcoal to-deepteal/60 p-8 rounded-2xl shadow-[0_0_15px_rgba(22,163,74,0.3)] border border-white/10 hover:border-cyan-400 space-y-4"
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
      class="water-card bg-gradient-to-br from-charcoal to-deepteal/60 p-8 rounded-2xl shadow-[0_0_15px_rgba(22,163,74,0.3)] border border-white/10 hover:border-cyan-400 space-y-4 font-mono text-sm"
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

  <!-- Equipo -->
  <div
    class="water-card bg-gradient-to-br from-charcoal to-deepteal/60 p-8 rounded-2xl shadow-[0_0_15px_rgba(22,163,74,0.3)] border border-white/10 hover:border-lime-400"
  >
    <h2
      class="text-2xl font-bold text-lime-400 mb-6 flex items-center gap-2 hover:text-cyan-400"
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
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        ></path></svg
      >
      Equipo de Ingeniería
    </h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each equipo as miembro}
        <div
          class="member-card p-5 bg-gradient-to-br from-charcoal to-deepteal rounded-xl border border-white/10 flex items-center gap-4 transition-all duration-300 hover:scale-105 hover:border-cyan-400 relative"
        >
          <div
            class="w-12 h-12 rounded-full bg-gradient-to-br from-lime-400 to-green-600 flex items-center justify-center text-white font-bold text-xl uppercase shadow-[0_0_10px_rgba(22,163,74,0.5)]"
          >
            {miembro.nombre.charAt(0)}
          </div>
          <div>
            <p class="font-bold text-white">
              {miembro.nombre}
            </p>
            <p
              class="text-sm text-lime-400 hover:text-cyan-400 transition-colors"
            >
              {miembro.rol}
            </p>
          </div>
        </div>
      {/each}
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
    transform: translateY(-8px) scale(1.03); /* Lift and subtle scale */
    box-shadow: 0 0 25px rgba(22, 163, 74, 0.5); /* Primary glow */
  }

  /* Subtitle glow effect on hover */
  .water-card-title-hover:hover {
    color: #a3e635; /* Hover lime text */
  }

  /* Team member card hover ripple simulation */
  .member-card:hover::after {
    content: "";
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 60%;
    height: 10px;
    background: radial-gradient(
      circle,
      #2dd4bf 0%,
      transparent 70%
    ); /* Subtle water ripple under */
    opacity: 0.8;
    filter: blur(5px);
    border-radius: 50%;
  }
</style>
