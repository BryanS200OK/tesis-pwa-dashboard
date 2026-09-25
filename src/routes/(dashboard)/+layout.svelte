<script lang="ts">
  import "../../app.css";
  import favicon from "$lib/assets/favicon.svg";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths"; // <-- Función resolve para proteger las rutas
  import { onMount } from "svelte";
  import {
    collection,
    onSnapshot,
    query,
    orderBy,
    limit,
  } from "firebase/firestore";

  // --- IMPORTACIONES DE FIREBASE ---
  import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
  import { doc, getDoc } from "firebase/firestore";
  import { db } from "../../lib/firebase/firebase";

  let { children } = $props();

  let isDark = $state(false);
  // --- LÓGICA DE CONEXIÓN REAL DEL HARDWARE ---
  let ultimaLecturaTime = $state(0);
  let tiempoActual = $state(Date.now());

  // Si el simulador envió datos hace menos de 20 segundos, está conectado.
  let isConnected = $derived(tiempoActual - ultimaLecturaTime < 20000);

  onMount(() => {
    // ... aquí va lo de la sesión del Auth que ya tienes ...

    // 1. Reloj interno
    const interval = setInterval(() => {
      tiempoActual = Date.now();
    }, 1000);

    // 2. Escuchamos la última lectura del biodigestor
    const qLecturas = query(
      collection(db, "lecturas_biodigestor"),
      orderBy("timestamp", "desc"),
      limit(1),
    );
    const unsubLecturas = onSnapshot(qLecturas, (snap) => {
      if (!snap.empty) {
        const doc = snap.docs[0].data();
        if (doc.timestamp) ultimaLecturaTime = doc.timestamp.toMillis();
      }
    });

    return () => {
      clearInterval(interval);
      unsubLecturas();
      // Y también llamar al unsubscribe() del Auth que ya tienes
    };
  });

  let isSidebarOpen = $state(true);

  // --- ESTADOS REACTIVOS DEL USUARIO LOGUEADO ---
  let inicialUsuario = $state("?");
  let nombreUsuario = $state("Cargando...");
  let rolUsuario = $state("Validando...");

  onMount(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        nombreUsuario =
          user.displayName || user.email?.split("@")[0] || "Usuario";
        inicialUsuario = nombreUsuario.charAt(0).toUpperCase();
        rolUsuario = "Operador";

        try {
          const docRef = doc(db, "usuarios", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            nombreUsuario = docSnap.data().nombre;
            rolUsuario = docSnap.data().rol;
            inicialUsuario = nombreUsuario.charAt(0).toUpperCase();
          }
        } catch (error) {
          console.error("Error obteniendo datos del usuario:", error);
        }
      } else {
        goto(resolve("/login"));
      }
    });

    return () => unsubscribe();
  });

  async function cerrarSesion() {
    try {
      const auth = getAuth();
      await signOut(auth);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  }

  function toggleTheme() {
    isDark = !isDark;
    if (isDark) {
      document.documentElement.classList.add("dark");
      document.body.style.backgroundColor = "#000a08";
    } else {
      document.documentElement.classList.remove("dark");
      document.body.style.backgroundColor = "#f9fafb";
    }
  }

  const navLinkClasses =
    "flex items-center gap-3 px-3 transition-all duration-300 rounded-lg overflow-hidden whitespace-nowrap";
  const inactiveClasses =
    "py-2 hover:bg-[#0b2b1d] text-gray-400 hover:text-white transition-colors border border-transparent";
  const activeClasses =
    "py-2.5 bg-[#001410] border border-emerald-900/50 shadow-inner text-emerald-400 font-bold relative";
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<div
  class="flex h-screen bg-gray-50 dark:bg-[#000a08] font-sans transition-colors duration-300"
>
  <aside
    class="bg-[#011612] dark:bg-[#011612] text-white flex flex-col justify-between shadow-2xl z-20 transition-all duration-300 border-r border-emerald-900/40 {isSidebarOpen
      ? 'w-64'
      : 'w-20'}"
  >
    <div>
      <div
        class="relative bg-[#001410] dark:bg-[#001410] h-16 w-full border-b border-emerald-900/40 transition-all duration-300"
      >
        <div
          class="absolute left-4 top-0 bottom-0 flex items-center gap-3 overflow-hidden whitespace-nowrap transition-opacity duration-300 {isSidebarOpen
            ? 'opacity-100'
            : 'opacity-0 pointer-events-none'}"
        >
          <div
            class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)] shrink-0"
          >
            <svg
              class="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              ></path></svg
            >
          </div>
          <h1
            class="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 tracking-wide"
          >
            BioCore
          </h1>
        </div>

        <button
          onclick={() => (isSidebarOpen = !isSidebarOpen)}
          class="absolute top-1/2 -translate-y-1/2 {isSidebarOpen
            ? 'right-4'
            : 'left-1/2 -translate-x-1/2'} p-2 rounded-lg bg-[#000a08] border border-emerald-900/50 hover:bg-emerald-900/40 text-emerald-500 hover:text-emerald-300 transition-all duration-300 shadow-inner z-10"
          title={isSidebarOpen ? "Colapsar menú" : "Expandir menú"}
        >
          <svg
            class="w-4 h-4 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {#if isSidebarOpen}
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              ></path>
            {:else}
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            {/if}
          </svg>
        </button>
      </div>

      <nav class="mt-6 px-3">
        <ul
          class="space-y-2 text-[13px] uppercase tracking-widest font-semibold"
        >
          <!-- CORRECCIÓN DE LOS 10 ENLACES USANDO resolve() -->
          <li>
            <a
              href={resolve("/")}
              class="{navLinkClasses} {$page.url.pathname === '/'
                ? activeClasses
                : inactiveClasses}"
              title="Resumen"
            >
              {#if $page.url.pathname === "/"}<div
                  class="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 shadow-[0_0_10px_#10b981]"
                ></div>{/if}
              <svg
                class="w-5 h-5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                ><path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z"
                ></path><path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z"
                ></path></svg
              >
              <span
                class="transition-opacity duration-300 {isSidebarOpen
                  ? 'opacity-100'
                  : 'opacity-0'}">Resumen</span
              >
            </a>
          </li>
          <li>
            <a
              href={resolve("/metricas")}
              class="{navLinkClasses} {$page.url.pathname === '/metricas'
                ? activeClasses
                : inactiveClasses}"
              title="Métricas en tiempo real"
            >
              {#if $page.url.pathname === "/metricas"}<div
                  class="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 shadow-[0_0_10px_#10b981]"
                ></div>{/if}
              <svg
                class="w-5 h-5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                ><path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                ></path></svg
              >
              <span
                class="transition-opacity duration-300 {isSidebarOpen
                  ? 'opacity-100'
                  : 'opacity-0'}">Métricas</span
              >
            </a>
          </li>
          <li>
            <a
              href={resolve("/historial")}
              class="{navLinkClasses} {$page.url.pathname === '/historial'
                ? activeClasses
                : inactiveClasses}"
              title="Historial"
            >
              {#if $page.url.pathname === "/historial"}<div
                  class="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 shadow-[0_0_10px_#10b981]"
                ></div>{/if}
              <svg
                class="w-5 h-5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                ><path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                ></path></svg
              >
              <span
                class="transition-opacity duration-300 {isSidebarOpen
                  ? 'opacity-100'
                  : 'opacity-0'}">Historial</span
              >
            </a>
          </li>
          <li>
            <a
              href={resolve("/produccion")}
              class="{navLinkClasses} {$page.url.pathname === '/produccion'
                ? activeClasses
                : inactiveClasses}"
              title="Producción de biogás"
            >
              {#if $page.url.pathname === "/produccion"}<div
                  class="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 shadow-[0_0_10px_#10b981]"
                ></div>{/if}
              <svg
                class="w-5 h-5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                ><path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.047 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z"
                ></path></svg
              >
              <span
                class="transition-opacity duration-300 {isSidebarOpen
                  ? 'opacity-100'
                  : 'opacity-0'}">Producción</span
              >
            </a>
          </li>
          <li>
            <a
              href={resolve("/alertas")}
              class="{navLinkClasses} {$page.url.pathname === '/alertas'
                ? activeClasses
                : inactiveClasses}"
              title="Alertas"
            >
              {#if $page.url.pathname === "/alertas"}<div
                  class="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 shadow-[0_0_10px_#10b981]"
                ></div>{/if}
              <svg
                class="w-5 h-5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                ><path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                ></path></svg
              >
              <span
                class="transition-opacity duration-300 {isSidebarOpen
                  ? 'opacity-100'
                  : 'opacity-0'}">Alertas</span
              >
            </a>
          </li>
          <li>
            <a
              href={resolve("/dispositivos")}
              class="{navLinkClasses} {$page.url.pathname === '/dispositivos'
                ? activeClasses
                : inactiveClasses}"
              title="Dispositivos"
            >
              {#if $page.url.pathname === "/dispositivos"}<div
                  class="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 shadow-[0_0_10px_#10b981]"
                ></div>{/if}
              <svg
                class="w-5 h-5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                ><path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z"
                ></path></svg
              >
              <span
                class="transition-opacity duration-300 {isSidebarOpen
                  ? 'opacity-100'
                  : 'opacity-0'}">Dispositivos</span
              >
            </a>
          </li>
          <li>
            <a
              href={resolve("/reportes")}
              class="{navLinkClasses} {$page.url.pathname === '/reportes'
                ? activeClasses
                : inactiveClasses}"
              title="Reportes"
            >
              {#if $page.url.pathname === "/reportes"}<div
                  class="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 shadow-[0_0_10px_#10b981]"
                ></div>{/if}
              <svg
                class="w-5 h-5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                ><path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                ></path></svg
              >
              <span
                class="transition-opacity duration-300 {isSidebarOpen
                  ? 'opacity-100'
                  : 'opacity-0'}">Reportes</span
              >
            </a>
          </li>
          <li>
            <a
              href={resolve("/configuracion")}
              class="{navLinkClasses} {$page.url.pathname === '/configuracion'
                ? activeClasses
                : inactiveClasses}"
              title="Configuración"
            >
              {#if $page.url.pathname === "/configuracion"}<div
                  class="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 shadow-[0_0_10px_#10b981]"
                ></div>{/if}
              <svg
                class="w-5 h-5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                ><path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854-.107 1.204l-.527-.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71-.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z"
                ></path><path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                ></path></svg
              >
              <span
                class="transition-opacity duration-300 {isSidebarOpen
                  ? 'opacity-100'
                  : 'opacity-0'}">Configuración</span
              >
            </a>
          </li>
          <li>
            <a
              href={resolve("/usuarios")}
              class="{navLinkClasses} {$page.url.pathname === '/usuarios'
                ? activeClasses
                : inactiveClasses}"
              title="Usuarios"
            >
              {#if $page.url.pathname === "/usuarios"}<div
                  class="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 shadow-[0_0_10px_#10b981]"
                ></div>{/if}
              <svg
                class="w-5 h-5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                ><path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                ></path></svg
              >
              <span
                class="transition-opacity duration-300 {isSidebarOpen
                  ? 'opacity-100'
                  : 'opacity-0'}">Usuarios</span
              >
            </a>
          </li>
          <li>
            <a
              href={resolve("/acerca")}
              class="{navLinkClasses} {$page.url.pathname === '/acerca'
                ? activeClasses
                : inactiveClasses}"
              title="Acerca de"
            >
              {#if $page.url.pathname === "/acerca"}<div
                  class="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 shadow-[0_0_10px_#10b981]"
                ></div>{/if}
              <svg
                class="w-5 h-5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                ><path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                ></path></svg
              >
              <span
                class="transition-opacity duration-300 {isSidebarOpen
                  ? 'opacity-100'
                  : 'opacity-0'}">Acerca del Proyecto</span
              >
            </a>
          </li>
        </ul>
      </nav>
    </div>

    <div
      class="p-4 bg-[#000a08] dark:bg-[#000a08] border-t border-emerald-900/40 flex flex-col justify-center h-[70px] overflow-hidden whitespace-nowrap transition-opacity duration-300 {isSidebarOpen
        ? 'opacity-100'
        : 'opacity-0'}"
    >
      <div
        class="flex items-center space-x-1 text-[10px] uppercase tracking-widest text-emerald-500 font-bold"
      >
        <span>ESTADO DE RED</span>
      </div>
      <div class="font-mono mt-1 text-gray-400 text-xs flex items-center gap-2">
        <span class="relative flex h-2 w-2">
          <span
            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
          ></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"
          ></span>
        </span>
        Sincronizado
      </div>
    </div>
  </aside>

  <!-- CONTENEDOR DERECHO -->
  <div
    class="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-[#000a08] transition-colors duration-300 relative"
  >
    <div
      class="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-emerald-900/10 blur-[150px] pointer-events-none z-0"
    ></div>

    <header
      class="bg-white dark:bg-[#001410]/80 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-emerald-900/40 h-16 flex justify-between items-center px-6 z-10 transition-colors duration-300 relative"
    >
      <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100">
        Monitoreo IoT
      </h2>

      <div class="flex items-center space-x-6">
        <div
          class="flex items-center gap-3 border-r border-gray-200 dark:border-emerald-900/50 pr-6"
        >
          <span
            class="text-xs font-bold text-gray-500 dark:text-emerald-500 uppercase tracking-widest hidden sm:block"
          >
            Tema {isDark ? "Oscuro" : "Claro"}
          </span>
          <button
            onclick={toggleTheme}
            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none {isDark
              ? 'bg-emerald-600'
              : 'bg-gray-300'}"
            aria-label="Cambiar tema"
          >
            <span
              class="inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-300 {isDark
                ? 'translate-x-6'
                : 'translate-x-1'}"
            ></span>
          </button>
        </div>

        <div
          class="flex items-center space-x-2 font-bold animate-pulse transition-colors duration-300 {isConnected
            ? 'text-emerald-500'
            : 'text-red-500'}"
        >
          {#if isConnected}
            <svg
              class="w-5 h-5 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12 18.75h.007v.008H12v-.008z"
              ></path></svg
            >
            <span class="text-[10px] uppercase tracking-widest hidden lg:block"
              >Sistema Conectado</span
            >
          {:else}
            <svg
              class="w-5 h-5 drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M18.364 5.636a9 9 0 00-12.728 0M15.536 8.464a5 5 0 00-7.072 0M12 11.293L12 11.293M3 3l18 18"
              ></path></svg
            >
            <span class="text-[10px] uppercase tracking-widest hidden lg:block"
              >Desconectado</span
            >
          {/if}
        </div>

        <button
          onclick={cerrarSesion}
          title="Cerrar sesión"
          class="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-emerald-900/50 cursor-pointer hover:opacity-80 transition-all group"
        >
          <div class="flex flex-col items-end text-right hidden sm:flex">
            <span
              class="text-sm font-bold text-gray-800 dark:text-gray-200 leading-tight"
              >{nombreUsuario}</span
            >
            <span
              class="text-[9px] font-bold text-emerald-600 dark:text-cyan-400 uppercase tracking-widest"
              >{rolUsuario}</span
            >
          </div>
          <div
            class="w-9 h-9 bg-[#001410] border border-emerald-500/50 text-emerald-400 rounded-xl flex items-center justify-center font-black shadow-[0_0_10px_rgba(16,185,129,0.2)] group-hover:border-emerald-400 transition-colors"
          >
            {inicialUsuario}
          </div>
          <svg
            class="w-4 h-4 text-gray-500 group-hover:text-red-500 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            ></path></svg
          >
        </button>
      </div>
    </header>

    <main
      class="flex-1 overflow-x-hidden overflow-y-auto bg-transparent p-4 sm:p-6 transition-colors duration-300 relative z-10"
    >
      {@render children()}
    </main>
  </div>
</div>
