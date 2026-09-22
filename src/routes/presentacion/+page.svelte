<script lang="ts">
  import "../../app.css";
  import { goto } from "$app/navigation";

  function handleStart(event: Event) {
    event.preventDefault();
    goto("/login");
  }
</script>

<svelte:head>
  <title>BioCore IoT - Plataforma de Monitoreo</title>
  <meta name="theme-color" content="#0a0a0a" />
</svelte:head>

<!-- Línea superior decorativa verde neón -->
<div class="h-1 w-full bg-[#a3e635] fixed top-0 z-50"></div>

<!-- Contenedor Principal con fondo oscuro -->
<div
  class="relative min-h-screen bg-[#0a0a0a] bg-cover bg-center bg-no-repeat bg-fixed text-white font-sans selection:bg-[#a3e635] selection:text-black overflow-x-hidden flex flex-col pt-1"
  style="background-image: url('https://images.pexels.com/photos/259280/pexels-photo-259280.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080');"
>
  <!-- Overlay ultra oscuro para resaltar el texto verde y blanco -->
  <div class="absolute inset-0 bg-black/85 z-0 pointer-events-none"></div>

  <!-- BARRA DE NAVEGACIÓN -->
  <header
    class="relative z-50 w-full px-6 md:px-12 py-4 flex items-center justify-between border-b border-gray-800/50 bg-black/30 backdrop-blur-sm"
  >
    <!-- Logo -->
    <div class="flex items-center gap-2">
      <svg
        class="w-8 h-8 md:w-10 md:h-10 text-[#a3e635] shrink-0"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="50" cy="50" r="48" fill="#a3e635" />
        <path
          d="M 28 45 L 28 36 C 28 20 72 20 72 36 L 72 45 Z"
          fill="#000000"
        />
        <rect x="28" y="45" width="44" height="30" fill="#0a0a0a" />
      </svg>
      <span class="text-xl font-bold tracking-widest text-white">
        BIOCORE<span class="text-[#a3e635]">IOT</span>
      </span>
    </div>

    <!-- Enlaces centrales (Ocultos en móviles) -->
    <nav
      class="hidden lg:flex items-center gap-6 text-[10px] sm:text-xs font-bold tracking-[0.2em] text-gray-300"
    >
      <a href="/" class="hover:text-[#a3e635] transition-colors">INICIO</a>
      <a href="#monitoreo" class="hover:text-[#a3e635] transition-colors"
        >MONITOREO</a
      >
      <a href="#servicios" class="hover:text-[#a3e635] transition-colors"
        >SERVICIOS</a
      >
      <a href="#reportes" class="hover:text-[#a3e635] transition-colors"
        >REPORTES</a
      >
      <a href="#contacto" class="hover:text-[#a3e635] transition-colors"
        >CONTACTO</a
      >
    </nav>

    <!-- Botones de Acción Derecha -->
    <div class="flex items-center gap-4">
      <button
        on:click={handleStart}
        class="bg-[#a3e635] text-black text-xs font-bold tracking-[0.15em] px-6 py-2.5 rounded-full hover:bg-lime-500 transition-colors uppercase"
      >
        Iniciar Sesión
      </button>
    </div>
  </header>

  <!-- HERO SECTION CENTRAL -->
  <main
    class="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 pt-16 pb-20"
  >
    <div class="max-w-5xl mx-auto flex flex-col items-center">
      <!-- Pequeño texto decorativo superior -->
      <div
        class="flex items-center gap-2 text-[#a3e635] text-[10px] md:text-xs font-bold tracking-[0.25em] mb-6 uppercase"
      >
        <span>✦</span>
        <span>Sistema integral de telemetría y control</span>
        <span>✦</span>
      </div>

      <!-- Título Principal -->
      <h1
        class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6 leading-[1.05] uppercase"
      >
        Transforma tu planta y <br class="hidden sm:block" />
        alcanza su
        <span class="text-[#a3e635] drop-shadow-[0_0_15px_rgba(163,230,53,0.4)]"
          >máximo <br class="hidden sm:block" /> potencial</span
        >
      </h1>

      <!-- Subtítulo / Descripción -->
      <p
        class="text-sm md:text-base text-gray-300 mb-10 max-w-3xl leading-relaxed font-light"
      >
        Disfruta de instalaciones de alto rendimiento y acceso inteligente
        instantáneo. Monitorea biogás, temperatura y niveles en una plataforma
        interactiva 24/7 sin límites.
      </p>

      <!-- Botones Principales -->
      <div class="flex flex-col sm:flex-row items-center gap-6">
        <button
          on:click={handleStart}
          class="w-full sm:w-auto bg-[#a3e635] text-black font-black uppercase tracking-[0.15em] text-xs md:text-sm px-10 py-4 rounded-full hover:bg-lime-400 hover:scale-105 transition-all shadow-[0_0_20px_rgba(163,230,53,0.3)] flex items-center justify-center gap-2"
        >
          Empezar Monitoreo
          <span class="text-lg leading-none">→</span>
        </button>
        <button
          class="w-full sm:w-auto text-white font-bold uppercase tracking-[0.15em] text-xs md:text-sm px-8 py-4 rounded-full hover:text-[#a3e635] transition-all flex items-center justify-center gap-2"
        >
          Ver planes y precios
          <span class="text-lg leading-none">→</span>
        </button>
      </div>
    </div>
  </main>

  <!-- BARRA DE ESTADÍSTICAS INFERIOR -->
  <div
    class="relative z-10 w-full border-t border-gray-800/50 bg-black/40 backdrop-blur-md"
  >
    <div class="max-w-5xl mx-auto py-8 px-4">
      <div
        class="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x md:divide-gray-700 text-center"
      >
        <!-- Item 1 -->
        <div class="flex flex-col items-center justify-center">
          <span class="text-2xl md:text-3xl font-black text-white mb-1"
            >+1,500</span
          >
          <span
            class="text-[10px] md:text-xs font-bold tracking-[0.2em] text-gray-400 uppercase"
            >Lecturas/Hora</span
          >
        </div>
        <!-- Item 2 -->
        <div class="flex flex-col items-center justify-center">
          <span class="text-2xl md:text-3xl font-black text-white mb-1"
            >3 Sedes</span
          >
          <span
            class="text-[10px] md:text-xs font-bold tracking-[0.2em] text-gray-400 uppercase"
            >Monitoreadas</span
          >
        </div>
        <!-- Item 3 -->
        <div class="flex flex-col items-center justify-center">
          <span class="text-2xl md:text-3xl font-black text-white mb-1"
            >5 Sensores</span
          >
          <span
            class="text-[10px] md:text-xs font-bold tracking-[0.2em] text-gray-400 uppercase"
            >Tipos de variables</span
          >
        </div>
        <!-- Item 4 -->
        <div class="flex flex-col items-center justify-center">
          <span class="text-2xl md:text-3xl font-black text-white mb-1"
            >24/7</span
          >
          <span
            class="text-[10px] md:text-xs font-bold tracking-[0.2em] text-gray-400 uppercase"
            >Acceso en vivo</span
          >
        </div>
      </div>
    </div>
  </div>
</div>
