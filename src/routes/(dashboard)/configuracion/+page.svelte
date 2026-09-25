<script lang="ts">
  import { onMount } from "svelte";
  import { doc, getDoc, setDoc } from "firebase/firestore";
  import { db } from "$lib/firebase/firebase";

  // --- VARIABLES DE ESTADO ---
  let nombreOperador = $state("Administrador BioCore");
  let emailOperador = $state("ingenieria@biocore.ve");

  // Umbrales de alerta crítica (Valores por defecto)
  let tempMax = $state(42.0);
  let phMin = $state(6.2);
  let presMax = $state(1.8);

  let notificarEmail = $state(true);

  // Estados de la interfaz
  let cargandoConfig = $state(true);
  let guardando = $state(false);

  // --- CARGAR CONFIGURACIÓN DESDE FIREBASE ---
  onMount(async () => {
    try {
      const docRef = doc(db, "configuracion", "sistema");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.nombreOperador) nombreOperador = data.nombreOperador;
        if (data.emailOperador) emailOperador = data.emailOperador;
        if (data.tempMax) tempMax = data.tempMax;
        if (data.phMin) phMin = data.phMin;
        if (data.presMax) presMax = data.presMax;
        if (data.notificarEmail !== undefined)
          notificarEmail = data.notificarEmail;
      }
    } catch (error) {
      console.error("Error al cargar la configuración de Firebase:", error);
    } finally {
      cargandoConfig = false;
    }
  });

  // --- GUARDAR CONFIGURACIÓN EN FIREBASE ---
  async function guardarConfiguracion() {
    guardando = true;
    try {
      const docRef = doc(db, "configuracion", "sistema");
      // setDoc con { merge: true } actualiza o crea el documento sin borrar otros campos
      await setDoc(
        docRef,
        {
          nombreOperador,
          emailOperador,
          tempMax,
          phMin,
          presMax,
          notificarEmail,
          ultimaActualizacion: new Date(),
        },
        { merge: true },
      );

      alert(
        "Parámetros operativos sincronizados exitosamente con la base de datos.",
      );
    } catch (error) {
      console.error("Error guardando la configuración:", error);
      alert("Hubo un error al intentar guardar los cambios.");
    } finally {
      guardando = false;
    }
  }
</script>

<div class="space-y-6 max-w-[1600px] mx-auto pb-10">
  <!-- CABECERA -->
  <div
    class="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-green-900/30 pb-6"
  >
    <div>
      <h1 class="glow-title text-4xl font-black tracking-tight mb-2">
        Configuración del Sistema
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
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          ></path><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          ></path></svg
        >
        Ajusta los parámetros operativos, umbrales de seguridad y el perfil de acceso.
      </p>
    </div>

    <button
      onclick={guardarConfiguracion}
      disabled={guardando || cargandoConfig}
      class="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-500 text-white text-sm font-bold rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] border border-emerald-400/50 hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
    >
      {#if guardando}
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
        Guardando...
      {:else}
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
          ></path></svg
        >
        Guardar Cambios
      {/if}
    </button>
  </div>

  {#if cargandoConfig}
    <div class="flex flex-col items-center justify-center p-20 gap-4">
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
        Cargando configuración de la nube...
      </p>
    </div>
  {:else}
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <!-- SECCIÓN: PERFIL DEL OPERADOR -->
      <div
        class="interactive-card xl:col-span-2 bg-gradient-to-br from-[#011c17] to-[#000a08] p-8 rounded-3xl shadow-xl border border-emerald-900/40 relative overflow-hidden space-y-6"
      >
        <div
          class="absolute -bottom-16 -right-16 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"
        ></div>

        <h2
          class="text-lg font-bold text-gray-200 flex items-center gap-3 border-b border-emerald-900/30 pb-3"
        >
          <div
            class="p-2 bg-emerald-950/50 rounded-lg border border-emerald-900/50"
          >
            <svg
              class="w-5 h-5 text-emerald-400"
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
          </div>
          Perfil del Operador
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <div class="space-y-2">
            <label
              for="nombre"
              class="block text-[10px] font-bold text-emerald-400/80 uppercase tracking-widest pl-1"
            >
              Nombre Completo
            </label>
            <input
              type="text"
              id="nombre"
              bind:value={nombreOperador}
              class="w-full px-5 py-3.5 rounded-xl border border-emerald-900/50 bg-[#001410] text-sm text-gray-200 font-medium focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all shadow-inner hover:border-emerald-700/80"
            />
          </div>
          <div class="space-y-2">
            <label
              for="email"
              class="block text-[10px] font-bold text-emerald-400/80 uppercase tracking-widest pl-1"
            >
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              bind:value={emailOperador}
              class="w-full px-5 py-3.5 rounded-xl border border-emerald-900/50 bg-[#001410] text-sm text-gray-200 font-medium focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all shadow-inner hover:border-emerald-700/80"
            />
          </div>
        </div>
      </div>

      <!-- SECCIÓN: NOTIFICACIONES -->
      <div
        class="interactive-card bg-gradient-to-br from-[#011c17] to-[#000a08] p-8 rounded-3xl shadow-xl border border-cyan-900/40 relative overflow-hidden flex flex-col justify-center"
      >
        <div
          class="absolute -top-16 -left-16 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none"
        ></div>

        <h2
          class="text-lg font-bold text-gray-200 flex items-center gap-3 border-b border-cyan-900/30 pb-3 mb-6"
        >
          <div class="p-2 bg-cyan-950/50 rounded-lg border border-cyan-900/50">
            <svg
              class="w-5 h-5 text-cyan-400"
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
          </div>
          Notificaciones
        </h2>

        <div
          class="flex items-center justify-between p-4 bg-[#001410] border border-cyan-900/30 rounded-xl shadow-inner relative z-10"
        >
          <div>
            <span class="block text-sm font-bold text-gray-200"
              >Alertas por Email</span
            >
            <span class="text-[10px] text-gray-500 uppercase tracking-wide"
              >Recibir reportes críticos</span
            >
          </div>

          <button
            role="switch"
            aria-checked={notificarEmail}
            aria-label="Alternar notificaciones por email"
            onclick={() => (notificarEmail = !notificarEmail)}
            class="relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black {notificarEmail
              ? 'bg-cyan-500'
              : 'bg-gray-800'}"
          >
            <span class="sr-only">Habilitar notificaciones</span>
            <span
              class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-300 ease-in-out {notificarEmail
                ? 'translate-x-5'
                : 'translate-x-0'}"
            ></span>
          </button>
        </div>
      </div>

      <!-- SECCIÓN: UMBRALES DE ALERTA CRÍTICA -->
      <div
        class="interactive-card xl:col-span-3 bg-gradient-to-br from-[#1a0505] to-[#000000] p-8 rounded-3xl shadow-2xl border border-red-900/40 relative overflow-hidden space-y-6"
      >
        <div
          class="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full blur-3xl pointer-events-none"
        ></div>

        <h2
          class="text-lg font-bold text-gray-200 flex items-center gap-3 border-b border-red-900/30 pb-3"
        >
          <div class="p-2 bg-red-950/50 rounded-lg border border-red-900/50">
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
          </div>
          Umbrales de Alerta Crítica (Hardware IoT)
        </h2>

        <div
          class="flex items-start gap-3 p-4 bg-red-950/20 border border-red-900/30 rounded-xl"
        >
          <svg
            class="w-5 h-5 text-red-400 mt-0.5 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path></svg
          >
          <p class="text-sm text-gray-400">
            Si el hardware detecta que las lecturas superan estos valores, el
            sistema de control entrará en estado de emergencia, disparando
            alarmas visuales e interrumpiendo el flujo.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          <!-- Temperatura -->
          <div class="space-y-2 group">
            <label
              for="temp"
              class="block text-[10px] font-bold text-red-400 uppercase tracking-widest pl-1"
            >
              Temperatura Máxima
            </label>
            <div class="relative">
              <input
                type="number"
                id="temp"
                bind:value={tempMax}
                step="0.1"
                class="w-full px-5 py-3.5 rounded-xl border border-red-900/60 bg-red-950/10 text-red-100 font-mono text-lg focus:ring-2 focus:ring-red-500/50 focus:border-red-500 outline-none transition-all shadow-inner hover:border-red-700/80 hover:bg-red-950/20"
              />
              <span
                class="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 font-bold bg-transparent"
                >°C</span
              >
            </div>
          </div>

          <!-- pH -->
          <div class="space-y-2 group">
            <label
              for="ph"
              class="block text-[10px] font-bold text-orange-400 uppercase tracking-widest pl-1"
            >
              Límite Inferior de pH
            </label>
            <div class="relative">
              <input
                type="number"
                id="ph"
                bind:value={phMin}
                step="0.1"
                class="w-full px-5 py-3.5 rounded-xl border border-orange-900/60 bg-orange-950/10 text-orange-100 font-mono text-lg focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 outline-none transition-all shadow-inner hover:border-orange-700/80 hover:bg-orange-950/20"
              />
              <span
                class="absolute right-4 top-1/2 -translate-y-1/2 text-orange-500 font-bold bg-transparent"
                >pH</span
              >
            </div>
          </div>

          <!-- Presión -->
          <div class="space-y-2 group">
            <label
              for="presion"
              class="block text-[10px] font-bold text-purple-400 uppercase tracking-widest pl-1"
            >
              Presión Máxima
            </label>
            <div class="relative">
              <input
                type="number"
                id="presion"
                bind:value={presMax}
                step="0.01"
                class="w-full px-5 py-3.5 rounded-xl border border-purple-900/60 bg-purple-950/10 text-purple-100 font-mono text-lg focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none transition-all shadow-inner hover:border-purple-700/80 hover:bg-purple-950/20"
              />
              <span
                class="absolute right-4 top-1/2 -translate-y-1/2 text-purple-500 font-bold bg-transparent"
                >bar</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

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

  /* Ocultar las flechitas de incremento/decremento en inputs de números */
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    appearance: none; /* SOLUCIÓN AL ERROR AMARILLO */
    margin: 0;
  }
  input[type="number"] {
    -moz-appearance: textfield;
    appearance: textfield; /* SOLUCIÓN AL ERROR AMARILLO */
  }
</style>
