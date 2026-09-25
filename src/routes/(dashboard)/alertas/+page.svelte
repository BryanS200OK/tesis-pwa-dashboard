<script lang="ts">
  import { onMount } from "svelte";
  import {
    collection,
    onSnapshot,
    query,
    orderBy,
    limit,
  } from "firebase/firestore";
  import { db } from "$lib/firebase/firebase"; // Asegúrate de usar el alias correcto

  interface Alerta {
    id: string;
    tipo: "Crítica" | "Advertencia" | "Info";
    biodigestor: string;
    mensaje: string;
    fecha: string;
    leida: boolean;
    timestampObj: Date;
  }

  let alertas = $state<Alerta[]>([]);
  let cargando = $state(true);

  // Derivamos cuántas alertas faltan por leer para mostrar un contador si quisiéramos
  let alertasNoLeidas = $derived(alertas.filter((a) => !a.leida).length);

  onMount(() => {
    // Escuchamos las últimas 30 lecturas para deducir las alertas recientes
    const q = query(
      collection(db, "lecturas_biodigestor"),
      orderBy("timestamp", "desc"),
      limit(30),
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const nuevasAlertas: Alerta[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (!data.timestamp) return;

        const fechaObj = data.timestamp.toDate();
        const fechaStr = fechaObj.toLocaleString("es-VE", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

        // REGLA 1: Temperatura Crítica (> 40°C)
        if (data.temperatura_c > 40) {
          nuevasAlertas.push({
            id: doc.id + "-temp-crit",
            tipo: "Crítica",
            biodigestor: "Tanque Principal",
            mensaje: `Peligro: Temperatura excedió el límite máximo de seguridad (${data.temperatura_c.toFixed(1)}°C).`,
            fecha: fechaStr,
            leida: false,
            timestampObj: fechaObj,
          });
        }
        // REGLA 2: Temperatura Baja (< 28°C)
        else if (data.temperatura_c < 28 && data.temperatura_c > 0) {
          nuevasAlertas.push({
            id: doc.id + "-temp-baja",
            tipo: "Info",
            biodigestor: "Tanque Principal",
            mensaje: `La temperatura ha descendido a ${data.temperatura_c.toFixed(1)}°C. El proceso de metanogénesis podría ralentizarse.`,
            fecha: fechaStr,
            leida: true, // Asumimos que la info ya está leída para no saturar
            timestampObj: fechaObj,
          });
        }

        // REGLA 3: Simulación de pH (Si cae por debajo de 6.8 es advertencia)
        const ph =
          data.ph || parseFloat((7.0 + Math.random() * 0.4).toFixed(1));
        if (ph < 6.8) {
          nuevasAlertas.push({
            id: doc.id + "-ph",
            tipo: "Advertencia",
            biodigestor: "Tanque Principal",
            mensaje: `Nivel de pH ligeramente ácido detectado (${ph.toFixed(1)}). Se recomienda monitorear.`,
            fecha: fechaStr,
            leida: false,
            timestampObj: fechaObj,
          });
        }

        // REGLA 4: Presión (Simulada o Real)
        const presion =
          data.presion || parseFloat((1.15 + Math.random() * 0.1).toFixed(2));
        if (presion > 1.4) {
          nuevasAlertas.push({
            id: doc.id + "-presion",
            tipo: "Crítica",
            biodigestor: "Válvula de Alivio",
            mensaje: `Presión interna alta detectada (${presion.toFixed(2)} bar). Riesgo estructural.`,
            fecha: fechaStr,
            leida: false,
            timestampObj: fechaObj,
          });
        }
      });

      // Ordenamos las alertas generadas desde la más reciente a la más vieja y tomamos máximo 15
      alertas = nuevasAlertas
        .sort((a, b) => b.timestampObj.getTime() - a.timestampObj.getTime())
        .slice(0, 15);

      cargando = false;
    });

    return () => unsubscribe();
  });

  // Función para marcar todas las alertas de la pantalla como leídas
  function marcarTodasComoLeidas() {
    alertas = alertas.map((alerta) => ({ ...alerta, leida: true }));
  }

  // Función para marcar una alerta individual como leída
  function marcarLeida(id: string) {
    alertas = alertas.map((alerta) =>
      alerta.id === id ? { ...alerta, leida: true } : alerta,
    );
  }
</script>

<div class="space-y-6 max-w-[1600px] mx-auto pb-10">
  <!-- CABECERA -->
  <div
    class="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-green-900/30 pb-6"
  >
    <div>
      <div class="flex items-center gap-4 mb-2">
        <h1 class="glow-title text-4xl font-black tracking-tight">
          Centro de Alertas
        </h1>
        {#if alertasNoLeidas > 0}
          <div
            class="px-3 py-1 bg-red-950/50 border border-red-500/30 rounded-full flex items-center gap-2 shadow-inner"
          >
            <span class="relative flex h-2.5 w-2.5">
              <span
                class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"
              ></span>
              <span
                class="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"
              ></span>
            </span>
            <span
              class="text-red-400 text-xs font-bold tracking-widest uppercase"
              >{alertasNoLeidas} Nuevas</span
            >
          </div>
        {/if}
      </div>
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
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          ></path></svg
        >
        Historial de notificaciones y eventos críticos en tiempo real.
      </p>
    </div>

    <button
      onclick={marcarTodasComoLeidas}
      disabled={alertasNoLeidas === 0}
      class="flex items-center gap-2 px-5 py-2.5 bg-[#001410] border border-green-900/50 text-emerald-400 text-sm font-bold rounded-xl shadow-inner hover:bg-[#01211b] hover:text-emerald-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2.5"
          d="M5 13l4 4L19 7"
        ></path></svg
      >
      Marcar todas como leídas
    </button>
  </div>

  <!-- LISTA DE ALERTAS -->
  <div
    class="interactive-card bg-[#000a08]/90 backdrop-blur-md rounded-3xl shadow-2xl border border-emerald-900/30 overflow-hidden relative min-h-[400px]"
  >
    {#if cargando}
      <div class="p-20 flex flex-col items-center justify-center gap-4">
        <svg
          class="w-12 h-12 text-emerald-600/50 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
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
        <p
          class="text-emerald-500/70 font-mono text-sm animate-pulse tracking-widest uppercase"
        >
          Evaluando parámetros del sistema...
        </p>
      </div>
    {:else if alertas.length === 0}
      <div
        class="p-20 flex flex-col items-center justify-center gap-4 text-emerald-500/50"
      >
        <svg
          class="w-16 h-16 opacity-50 mb-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path></svg
        >
        <p class="tracking-widest uppercase font-mono">
          No se han registrado eventos recientes.
        </p>
      </div>
    {:else}
      <div class="divide-y divide-emerald-900/20">
        {#each alertas as alerta (alerta.id)}
          <div
            class="p-6 md:p-8 flex items-start gap-5 transition-all duration-500 {alerta.leida
              ? 'opacity-60 bg-black/20 hover:opacity-100'
              : 'bg-emerald-900/5 hover:bg-emerald-900/10'} relative group"
          >
            <!-- Línea indicadora izquierda para alertas no leídas -->
            {#if !alerta.leida}
              <div
                class="absolute left-0 top-0 bottom-0 w-1 {alerta.tipo ===
                'Crítica'
                  ? 'bg-red-500 shadow-[0_0_10px_#ef4444]'
                  : alerta.tipo === 'Advertencia'
                    ? 'bg-orange-500 shadow-[0_0_10px_#f97316]'
                    : 'bg-cyan-500 shadow-[0_0_10px_#06b6d4]'}"
              ></div>
            {/if}

            <!-- Icono según tipo de severidad -->
            <div class="shrink-0 mt-1">
              {#if alerta.tipo === "Crítica"}
                <div
                  class="w-12 h-12 rounded-2xl bg-red-950/40 border border-red-900/50 flex items-center justify-center text-red-400 text-xl shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                >
                  ⚠️
                </div>
              {:else if alerta.tipo === "Advertencia"}
                <div
                  class="w-12 h-12 rounded-2xl bg-orange-950/40 border border-orange-900/50 flex items-center justify-center text-orange-400 text-xl shadow-[0_0_15px_rgba(249,115,22,0.2)]"
                >
                  ⚡
                </div>
              {:else}
                <div
                  class="w-12 h-12 rounded-2xl bg-cyan-950/40 border border-cyan-900/50 flex items-center justify-center text-cyan-400 text-xl shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                >
                  ℹ️
                </div>
              {/if}
            </div>

            <!-- Contenido de la Alerta -->
            <div class="flex-1">
              <div
                class="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2"
              >
                <div class="flex items-center gap-3">
                  <span
                    class="font-black text-gray-100 text-lg tracking-wide {alerta.tipo ===
                    'Crítica'
                      ? 'text-red-400 drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]'
                      : ''}"
                  >
                    {alerta.tipo}
                  </span>
                  <span
                    class="text-xs bg-[#001410] border border-emerald-900/50 px-3 py-1 rounded-md text-emerald-400 font-mono shadow-inner"
                  >
                    {alerta.biodigestor}
                  </span>
                </div>
                <span
                  class="text-xs font-mono text-gray-500 flex items-center gap-1.5"
                >
                  <svg
                    class="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    ><path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path></svg
                  >
                  {alerta.fecha}
                </span>
              </div>
              <p class="text-gray-300 text-sm leading-relaxed max-w-4xl">
                {alerta.mensaje}
              </p>
            </div>

            <!-- Botón de acción rápido (Punto Verde) -->
            {#if !alerta.leida}
              <button
                onclick={() => marcarLeida(alerta.id)}
                class="shrink-0 flex items-center justify-center w-8 h-8 rounded-full hover:bg-emerald-900/40 transition-colors group/btn"
                title="Marcar como leída"
              >
                <div
                  class="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)] group-hover/btn:scale-125 transition-transform"
                ></div>
              </button>
            {/if}
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .interactive-card {
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .glow-title {
    background: linear-gradient(135deg, #a3e635 0%, #10b981 50%, #06b6d4 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    filter: drop-shadow(0 4px 8px rgba(16, 185, 129, 0.2));
  }
</style>
