<script lang="ts">
  import { onMount } from "svelte";
  import {
    collection,
    onSnapshot,
    query,
    orderBy,
    limit,
  } from "firebase/firestore";
  import { db } from "$lib/firebase/firebase";

  // --- 1. INTERFACES ESTRICTAS DE TYPESCRIPT ---
  interface Periferico {
    nombre: string;
    tipo: string;
  }

  interface Dispositivo {
    id: string;
    nombre: string;
    modelo: string;
    ubicacion: string;
    ip: string;
    themeText: string;
    themeBg: string;
    themeBorder: string;
    themeSoftBg: string;
    icon: string;
    perifericos: Periferico[];
  }

  // --- 2. DATOS BASADOS EXACTAMENTE EN TU DIAGRAMA FÍSICO ---
  let nodos = $state<Dispositivo[]>([
    {
      id: "BC-ESP32-MAIN",
      nombre: "Controlador Principal Fermentación",
      modelo: "ESP32 D1 Mini",
      ubicacion: "Mesa de Pruebas (Protoboard)",
      ip: "Conexión USB / Serial",
      themeText: "text-emerald-400",
      themeBg: "bg-emerald-500",
      themeBorder: "border-emerald-900/50",
      themeSoftBg: "bg-emerald-950/40",
      icon: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z",
      perifericos: [
        { nombre: "Sensor Gas MQ (Flying Fish)", tipo: "Entrada Analógica" },
        { nombre: "Sensor Temp. (TO-92)", tipo: "Entrada Digital/Analógica" },
        { nombre: "Interruptor Inclinación", tipo: "Entrada Digital" },
        { nombre: "Potenciómetros de Ajuste", tipo: "Entrada Analógica" },
      ],
    },
    {
      id: "BC-ESP32-OUT",
      nombre: "Módulo de Actuadores y Alertas",
      modelo: "Lógica interna ESP32",
      ubicacion: "Mesa de Pruebas (Protoboard)",
      ip: "Conexión I/O Física",
      themeText: "text-cyan-400",
      themeBg: "bg-cyan-500",
      themeBorder: "border-cyan-900/50",
      themeSoftBg: "bg-cyan-950/40",
      icon: "M13 10V3L4 14h7v7l9-11h-7z", // Rayo
      perifericos: [
        { nombre: "Pantalla OLED", tipo: "Comunicación I2C" },
        { nombre: "Módulo Relé (Control)", tipo: "Salida Digital" },
        { nombre: "Zumbador (Alarma)", tipo: "Salida Digital/PWM" },
      ],
    },
    {
      id: "BC-SRV-01",
      nombre: "Estación de Monitoreo Local",
      modelo: "Servidor FastAPI + SvelteKit",
      ubicacion: "Laptop de Monitoreo",
      ip: "127.0.0.1 (Localhost)",
      themeText: "text-purple-400",
      themeBg: "bg-purple-500",
      themeBorder: "border-purple-900/50",
      themeSoftBg: "bg-purple-950/40",
      icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", // Laptop
      perifericos: [
        { nombre: "Broker MQTT (Mosquitto)", tipo: "Puerto 1883" },
        { nombre: "Conexión Firebase", tipo: "Cloud API" },
        { nombre: "Script simulador.py", tipo: "Proceso Backend" },
      ],
    },
  ]);

  // --- 3. LÓGICA DE CONEXIÓN EN TIEMPO REAL (WATCHDOG) ---
  let ultimaLecturaTime = $state(0);
  let tiempoActual = $state(Date.now());

  // El sistema se considera ONLINE si la última lectura en Firebase ocurrió hace menos de 20 segundos
  let isSystemOnline = $derived(tiempoActual - ultimaLecturaTime < 20000);

  onMount(() => {
    // Reloj interno para evaluar la conexión cada segundo
    const interval = setInterval(() => {
      tiempoActual = Date.now();
    }, 1000);

    // Escuchamos el último dato recibido en Firebase
    const q = query(
      collection(db, "lecturas_biodigestor"),
      orderBy("timestamp", "desc"),
      limit(1),
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        const doc = snap.docs[0].data();
        if (doc.timestamp) {
          // Guardamos el momento exacto en que se registró el último dato en la BD
          ultimaLecturaTime = doc.timestamp.toMillis();
        }
      }
    });

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  });
</script>

<div class="space-y-6 max-w-[1600px] mx-auto pb-10">
  <!-- CABECERA -->
  <div class="mb-8 border-b border-green-900/30 pb-6">
    <h1 class="glow-title text-4xl font-black tracking-tight mb-2">
      Gestión de Dispositivos IoT
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
          d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
        ></path></svg
      >
      Monitor de estado de comunicación del hardware físico, sensores y actuadores.
    </p>
  </div>

  <!-- GRILLA DE DISPOSITIVOS -->
  <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
    {#each nodos as nodo (nodo.id)}
      <div
        class="interactive-card bg-gradient-to-br from-[#011c17] to-[#000a08] rounded-3xl shadow-xl border {isSystemOnline
          ? nodo.themeBorder
          : 'border-red-900/30'} relative overflow-hidden flex flex-col transition-colors duration-500"
      >
        <!-- Parte Superior: Título y Estado Dinámico -->
        <div class="p-6 md:p-8 flex justify-between items-start gap-4">
          <div class="flex items-start gap-4">
            <div
              class="shrink-0 p-3 bg-black/40 border {isSystemOnline
                ? nodo.themeBorder
                : 'border-red-900/50'} rounded-2xl shadow-inner transition-colors duration-500"
            >
              <svg
                class="w-8 h-8 {isSystemOnline
                  ? nodo.themeText
                  : 'text-red-500'} drop-shadow-[0_0_8px_currentColor] transition-colors duration-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d={nodo.icon}
                ></path>
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-100 tracking-wide">
                {nodo.nombre}
              </h2>
              <div class="flex items-center flex-wrap gap-2 mt-1">
                <span
                  class="text-xs font-mono {isSystemOnline
                    ? nodo.themeText
                    : 'text-red-400'} {isSystemOnline
                    ? nodo.themeSoftBg
                    : 'bg-red-950/40'} px-2 py-0.5 rounded border {isSystemOnline
                    ? nodo.themeBorder
                    : 'border-red-900/50'} transition-colors duration-500"
                  >{nodo.id}</span
                >
                <span class="text-xs font-semibold text-gray-400"
                  >• {nodo.modelo}</span
                >
              </div>
            </div>
          </div>

          <!-- BOTÓN DE ESTADO (AHORA ES REACTIVO) -->
          <div
            class="shrink-0 px-3 py-1.5 {isSystemOnline
              ? nodo.themeSoftBg
              : 'bg-red-950/40'} border {isSystemOnline
              ? nodo.themeBorder
              : 'border-red-900/50'} rounded-full flex items-center gap-2 shadow-inner transition-colors duration-500"
          >
            <span class="relative flex h-2 w-2">
              {#if isSystemOnline}
                <span
                  class="animate-ping absolute inline-flex h-full w-full rounded-full {nodo.themeBg} opacity-75"
                ></span>
              {/if}
              <span
                class="relative inline-flex rounded-full h-2 w-2 {isSystemOnline
                  ? nodo.themeBg
                  : 'bg-red-500'} transition-colors duration-500"
              ></span>
            </span>
            <span
              class="{isSystemOnline
                ? nodo.themeText
                : 'text-red-400'} text-xs font-bold tracking-widest uppercase transition-colors duration-500"
            >
              {isSystemOnline ? "Conectado" : "Desconectado"}
            </span>
          </div>
        </div>

        <!-- Parte Media: Información de Red -->
        <div
          class="px-6 md:px-8 py-4 bg-black/20 border-y {isSystemOnline
            ? 'border-emerald-900/20'
            : 'border-red-900/20'} flex justify-between items-center transition-colors duration-500"
        >
          <div>
            <span
              class="block text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-1"
              >Ubicación Física</span
            >
            <span
              class="text-sm font-medium text-gray-300 flex items-center gap-1.5"
            >
              <svg
                class="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                ><path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                ></path><path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                ></path></svg
              >
              {nodo.ubicacion}
            </span>
          </div>
          <div class="text-right">
            <span
              class="block text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-1"
              >Enlace de Comunicación</span
            >
            <span
              class="text-sm font-mono {isSystemOnline
                ? nodo.themeText
                : 'text-red-400'} transition-colors duration-500"
              >{nodo.ip}</span
            >
          </div>
        </div>

        <!-- Lista de Periféricos -->
        <div class="p-6 md:p-8 flex-1">
          <h3
            class="text-[11px] uppercase font-bold tracking-widest text-gray-500 mb-4 border-b {isSystemOnline
              ? 'border-emerald-900/30'
              : 'border-red-900/30'} pb-2 transition-colors duration-500"
          >
            Hardware Conectado (I/O)
          </h3>
          <ul class="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2">
            {#each nodo.perifericos as periferico (periferico.nombre)}
              <li
                class="flex items-center justify-between p-2.5 rounded-lg bg-black/30 border {isSystemOnline
                  ? 'border-emerald-900/20'
                  : 'border-red-900/20'} transition-colors duration-500"
              >
                <span
                  class="text-xs font-semibold {isSystemOnline
                    ? 'text-gray-300'
                    : 'text-gray-500'} flex items-center gap-2 transition-colors duration-500"
                >
                  <span
                    class="w-1.5 h-1.5 rounded-full {isSystemOnline
                      ? nodo.themeBg
                      : 'bg-red-500'} opacity-70 transition-colors duration-500"
                  ></span>
                  {periferico.nombre}
                </span>
                <span
                  class="text-[9px] font-mono text-gray-500 bg-black/50 px-2 py-0.5 rounded border border-gray-800"
                >
                  {periferico.tipo}
                </span>
              </li>
            {/each}
          </ul>
        </div>
        <!-- BOTONES INSERVIBLES ELIMINADOS DE AQUÍ PARA MANTENER LA LIMPIEZA -->
      </div>
    {/each}
  </div>
</div>

<style>
  .interactive-card {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .interactive-card:hover {
    transform: translateY(-4px);
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
