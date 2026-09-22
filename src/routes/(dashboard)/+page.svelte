<script lang="ts">
  import { onMount } from "svelte";

  // --- LÓGICA DE TIEMPO REAL (Reloj Vivo) ---
  // En Svelte 5, para que la fecha se actualice en pantalla cada segundo,
  // el estado debe estar directamente vinculado a la vista.
  let tiempoActual = $state(new Date());

  onMount(() => {
    const intervalo = setInterval(() => {
      tiempoActual = new Date();
    }, 1000);
    return () => clearInterval(intervalo);
  });

  // Derivaciones reactivas para que cambien cada vez que 'tiempoActual' hace un tic-tac
  let fechaFormateada = $derived(
    tiempoActual.toLocaleDateString("es-VE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
  );
  let horaFormateada = $derived(
    tiempoActual.toLocaleTimeString("es-VE", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
  );

  // --- DATOS DE MÉTRICAS CON NUEVOS ICONOS HD ---
  const metrics = [
    {
      title: "Temperatura",
      value: "32.6",
      unit: "°C",
      range: "Rango: 20 - 40 °C",
      color: "text-emerald-400",
      bgGlow: "shadow-[0_0_15px_rgba(52,211,153,0.3)]",
      iconPath: "M9 17a5 5 0 116 0c.932-1.393 1-3.238 1-5V6a3 3 0 10-6 0v6c0 1.762.068 3.607 1 5z", // Termómetro
      sparkline: "0,15 10,18 20,12 30,20 40,10 50,16 60,8 70,14 80,10 90,18 100,12",
    },
    {
      title: "Presión",
      value: "1.23",
      unit: "kPa",
      range: "Rango: 0 - 5 kPa",
      color: "text-blue-400",
      bgGlow: "shadow-[0_0_15px_rgba(96,165,250,0.3)]",
      iconPath: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", // Reloj/Medidor
      sparkline: "0,20 10,14 20,18 30,8 40,16 50,12 60,18 70,10 80,15 90,8 100,14",
    },
    {
      title: "pH",
      value: "6.85",
      unit: "",
      range: "Rango: 6.0 - 8.0",
      color: "text-purple-400",
      bgGlow: "shadow-[0_0_15px_rgba(192,132,252,0.3)]",
      iconPath: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z", // Matraz
      sparkline: "0,18 10,20 20,16 30,22 40,15 50,20 60,14 70,18 80,12 90,16 100,18",
    },
    {
      title: "Nivel de gas",
      value: "78",
      unit: "%",
      range: "Rango: 0 - 100 %",
      color: "text-cyan-400",
      bgGlow: "shadow-[0_0_15px_rgba(34,211,238,0.3)]",
      iconPath: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z", // Nube de gas
      sparkline: "0,10 10,8 20,14 30,10 40,18 50,12 60,20 70,15 80,18 90,10 100,14",
    },
    {
      title: "Caudal de biogás",
      value: "1.45",
      unit: "m³/h",
      range: "Rango: 0 - 5 m³/h",
      color: "text-orange-400",
      bgGlow: "shadow-[0_0_15px_rgba(251,146,60,0.3)]",
      iconPath: "M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z", // Llama/Fuego
      sparkline: "0,16 10,12 20,18 30,14 40,10 50,15 60,9 70,14 80,8 90,12 100,16",
    },
    {
      title: "Humedad",
      value: "65",
      unit: "%",
      range: "Rango: 0 - 100 %",
      color: "text-indigo-400",
      bgGlow: "shadow-[0_0_15px_rgba(129,140,248,0.3)]",
      iconPath: "M12 2.25c-1.39 2.5-5.25 7.82-5.25 11.25a5.25 5.25 0 0 0 10.5 0c0-3.43-3.86-8.75-5.25-11.25Z", // Gota de agua
      sparkline: "0,14 10,18 20,12 30,16 40,10 50,15 60,12 70,18 80,14 90,10 100,15",
    },
  ];
</script>

<style>
  /* --- EFECTOS VISUALES Y ANIMACIONES --- */
  
  /* Tarjetas Interactivas con efecto de flotación extrema y Glow */
  .interactive-card {
    transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
    position: relative;
    overflow: hidden;
  }

  .interactive-card:hover, .interactive-card:active {
    transform: translateY(-8px) scale(1.03); /* Se eleva más */
    box-shadow: 0 15px 35px -10px rgba(52, 211, 153, 0.5), 0 0 25px rgba(6, 182, 212, 0.3);
    border-color: rgba(163, 230, 81, 0.8) !important;
    z-index: 10;
  }

  /* Destello sutil interno (Efecto cristal de agua) */
  .interactive-card::after {
    content: '';
    position: absolute;
    top: -50%; left: -50%;
    width: 200%; height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 60%);
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
  }
  .interactive-card:hover::after { opacity: 1; }

  /* Títulos Luminosos */
  .glow-title {
    background-image: linear-gradient(to right, #a3e635, #4ade80, #22d3ee);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    filter: drop-shadow(0 0 5px rgba(74, 222, 128, 0.4));
  }

  /* Animación para las rayas de las gráficas (Flujo Láser/Datos) */
  @keyframes flowDash {
    0% { stroke-dashoffset: 100; }
    100% { stroke-dashoffset: 0; }
  }
  
  .data-flow {
    stroke-dasharray: 8 6; /* Guiones más separados y notorios */
    animation: flowDash 2s linear infinite; /* Animación continua hacia la izquierda */
  }
</style>

<div class="space-y-6 max-w-[1600px] mx-auto pb-10">
  
  <!-- Contenedor Superior: Títulos y Botones de Acción -->
  <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
    <div>
      <h2 class="glow-title text-3xl font-black tracking-tight">
        Resumen del sistema
      </h2>
      <p class="text-sm text-gray-400 mt-1 font-medium">
        Monitoreo integral y telemetría en tiempo real del biodigestor.
      </p>
    </div>

    <!-- Botones de Fecha Dinámica y Exportar -->
    <div class="flex flex-wrap items-center gap-3">
      <!-- Reloj en vivo (El estado reactivo lo mantiene corriendo) -->
      <div class="flex items-center gap-2 bg-[#011612] border border-green-900/50 rounded-md px-4 py-2 text-sm font-mono text-lime-400 shadow-[0_0_10px_rgba(22,163,74,0.2)] transition-colors">
        <svg class="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>{fechaFormateada}</span>
        <span class="text-gray-500">|</span>
        <span class="text-cyan-400 font-bold tracking-widest drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]">{horaFormateada}</span>
      </div>

      <button class="interactive-card flex items-center gap-2 bg-gradient-to-r from-green-700 to-green-600 hover:from-green-600 hover:to-lime-600 text-white text-sm font-bold px-5 py-2 rounded-md shadow-[0_0_15px_rgba(22,163,74,0.4)] border border-green-500/50">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
        </svg>
        Exportar Reporte
      </button>
    </div>
  </div>

  <!-- Cuadrícula de Tarjetas Estilo Sparkline -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 mb-8">
    {#each metrics as metric (metric.title)}
      <div class="interactive-card bg-gradient-to-br from-[#012b23] to-black/80 p-5 rounded-2xl border border-green-900/50 flex flex-col justify-between {metric.bgGlow}">
        
        <div class="flex items-center gap-3 mb-4">
          <!-- Círculo del icono con luz interna -->
          <div class="p-2 bg-black/40 rounded-lg border border-white/10 shadow-inner">
            <svg class="w-6 h-6 {metric.color} drop-shadow-md" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d={metric.iconPath} />
            </svg>
          </div>
          <span class="text-sm font-bold text-gray-200 tracking-wide">{metric.title}</span>
        </div>

        <div class="flex flex-col mb-1 text-center">
          <div class="flex items-baseline justify-center space-x-1 drop-shadow-lg">
            <span class="text-4xl font-black text-white">{metric.value}</span>
            <span class="text-sm font-bold {metric.color} opacity-90">{metric.unit}</span>
          </div>
          <span class="text-[11px] text-gray-400 font-semibold mt-2 bg-black/40 mx-auto px-3 py-1 rounded-full border border-white/5 shadow-inner">{metric.range}</span>
        </div>

        <!-- Línea animada (data-flow) -->
        <div class="mt-4 h-10 w-full overflow-hidden">
          <svg viewBox="0 0 100 25" class="w-full h-full {metric.color}" preserveAspectRatio="none">
            <polyline
              points={metric.sparkline}
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="opacity-90 data-flow"
              style="filter: drop-shadow(0px 2px 4px currentColor);"
            />
          </svg>
        </div>
      </div>
    {/each}
  </div>

  <!-- Contenedores Centrales de Gráficos -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
    <!-- Gráfico 1: Producción -->
    <div class="interactive-card bg-gradient-to-br from-[#01211b] to-black/80 p-6 rounded-2xl shadow-lg border border-green-900/50 h-96 flex flex-col">
      <div class="flex justify-between items-center mb-4">
        <div>
          <h3 class="text-gray-100 font-bold text-lg">Producción de biogás (m³)</h3>
          <div class="flex items-center gap-2 mt-1">
            <span class="w-4 h-1 bg-green-500 rounded animate-pulse shadow-[0_0_5px_#22c55e]"></span>
            <span class="text-xs text-gray-400">Producción diaria actual</span>
          </div>
        </div>
        <div class="text-right bg-black/30 p-2 rounded-lg border border-white/5">
          <p class="text-xs text-gray-400 mb-1">Total hoy</p>
          <p class="text-2xl font-black text-white flex items-center gap-2">
            2.35 m³ 
            <span class="text-xs text-lime-400 bg-lime-900/40 px-2 py-0.5 rounded-full border border-lime-500/30 shadow-[0_0_5px_#4ade80]">+12% vs ayer</span>
          </p>
        </div>
      </div>
      
      <div class="flex-1 w-full bg-[#001410] border border-dashed border-green-900/50 rounded-xl flex items-center justify-center relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-b from-transparent via-lime-500/5 to-transparent animate-[bounce_4s_infinite]"></div>
        <p class="text-gray-500 text-sm font-mono z-10 text-center">
          <span class="block text-2xl mb-2 drop-shadow-md">📈</span>
          Área para ECharts: Curva de Producción
        </p>
      </div>
    </div>

    <!-- Gráfico 2: Tendencias -->
    <div class="interactive-card bg-gradient-to-br from-[#01211b] to-black/80 p-6 rounded-2xl shadow-lg border border-green-900/50 h-96 flex flex-col">
      <h3 class="text-gray-100 font-bold text-lg mb-4">Métricas cruzadas en tiempo real</h3>
      <div class="flex justify-center flex-wrap gap-4 mb-4 text-xs font-medium text-gray-400 bg-black/40 py-2 rounded-lg border border-white/5 shadow-inner">
        <span class="flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse"></span> Temp</span>
        <span class="flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa] animate-pulse" style="animation-delay: 0.2s;"></span> Presión</span>
        <span class="flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-purple-400 shadow-[0_0_8px_#c084fc] animate-pulse" style="animation-delay: 0.4s;"></span> pH</span>
        <span class="flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-orange-400 shadow-[0_0_8px_#fb923c] animate-pulse" style="animation-delay: 0.6s;"></span> Caudal</span>
      </div>
      
      <div class="flex-1 w-full bg-[#001410] border border-dashed border-green-900/50 rounded-xl flex items-center justify-center relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-t from-transparent via-cyan-500/5 to-transparent animate-[bounce_5s_infinite]"></div>
        <p class="text-gray-500 text-sm font-mono z-10 text-center">
          <span class="block text-2xl mb-2 drop-shadow-md">📊</span>
          Área para ECharts: Tendencias
        </p>
      </div>
    </div>
  </div>

  <!-- Contenedores Inferiores -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
    <!-- Nivel de Gas -->
    <div class="interactive-card bg-gradient-to-br from-[#012b23] to-black/80 p-6 rounded-2xl shadow-lg border border-green-900/50 flex flex-col">
      <h3 class="text-gray-100 font-bold text-lg mb-4">Distribución del nivel de gas</h3>
      <div class="flex-1 w-full min-h-[200px] bg-[#001410] border border-dashed border-green-900/50 rounded-xl flex flex-col items-center justify-center shadow-inner">
        <p class="text-gray-500 text-sm font-mono text-center">Gráfico Pie/Dona (ECharts)</p>
      </div>
    </div>

    <!-- Estado del Biodigestor -->
    <div class="interactive-card bg-gradient-to-br from-[#012b23] to-black/80 p-6 rounded-2xl shadow-lg border border-green-900/50">
      <h3 class="text-gray-100 font-bold text-lg mb-4">Estado del Hardware</h3>
      <div class="flex items-center gap-4 mt-2">
        <div class="w-1/2 bg-[#001410] rounded-xl h-32 border border-green-900/50 flex items-center justify-center shadow-inner relative overflow-hidden">
          <div class="absolute inset-0 bg-lime-500/10 mix-blend-overlay"></div>
          <span class="text-cyan-400 text-xs font-mono text-center z-10">Modelo 3D / SVG<br />Tanque</span>
        </div>
        <ul class="w-1/2 space-y-3 text-xs text-gray-300 font-medium">
          <li class="flex justify-between items-center bg-black/30 px-2 py-1.5 rounded shadow-sm">
            <span class="flex gap-2 items-center"><span class="text-lime-400 drop-shadow-[0_0_5px_#a3e635]">●</span> Sistema</span>
            <span class="text-lime-400 font-bold tracking-wider">ÓPTIMO</span>
          </li>
          <li class="flex justify-between items-center bg-black/30 px-2 py-1.5 rounded shadow-sm">
            <span class="flex gap-2 items-center"><span class="text-lime-400 drop-shadow-[0_0_5px_#a3e635]">●</span> Agitación</span>
            <span class="text-lime-400 font-bold tracking-wider">ACTIVO</span>
          </li>
          <li class="flex justify-between items-center bg-black/30 px-2 py-1.5 rounded shadow-sm">
            <span class="flex gap-2 items-center"><span class="text-lime-400 drop-shadow-[0_0_5px_#a3e635]">●</span> Calor</span>
            <span class="text-lime-400 font-bold tracking-wider">ACTIVO</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Alertas -->
    <div class="interactive-card bg-gradient-to-br from-[#012b23] to-black/80 p-6 rounded-2xl shadow-lg border border-green-900/50">
      <h3 class="text-gray-100 font-bold text-lg mb-4">Alertas Recientes</h3>
      <div class="space-y-3">
        <!-- Alerta simulada -->
        <div class="p-4 bg-red-950/40 border border-red-900/50 rounded-xl flex gap-3 items-start relative overflow-hidden shadow-[0_0_10px_rgba(239,68,68,0.1)]">
          <div class="absolute left-0 top-0 bottom-0 w-1 bg-red-500 shadow-[0_0_10px_#ef4444]"></div>
          <span class="text-red-400 font-bold animate-pulse text-xl drop-shadow-[0_0_5px_#ef4444]">⚠️</span>
          <div class="w-full">
            <div class="flex justify-between items-center w-full">
              <span class="font-bold text-red-400 text-sm tracking-wide">Pico de Temperatura</span>
              <span class="text-[10px] text-red-300 font-mono bg-red-950 px-2 py-0.5 rounded">Hace 2 min</span>
            </div>
            <span class="text-gray-300 text-xs mt-1 block leading-relaxed">El sensor T1 superó el rango máximo configurado (40°C).</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>