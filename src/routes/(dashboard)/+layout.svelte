<script lang="ts">
  import "../../app.css";
  import favicon from "$lib/assets/favicon.svg";
  import { page } from "$app/stores"; // IMPORTANTE: Para detectar la ruta actual

  // Svelte 5 syntax para recibir los componentes hijos
  let { children } = $props();

  // Estado reactivo para el modo oscuro
  let isDark = $state(false);

  // Estado reactivo de la conexión
  let isConnected = $state(false);

  // NUEVO: Estado reactivo para abrir/cerrar el menú lateral
  let isSidebarOpen = $state(true);

  // Función para alternar el tema al hacer clic
  function toggleTheme() {
    isDark = !isDark;
    if (isDark) {
      document.documentElement.classList.add("dark");
      document.body.style.backgroundColor = "#111827"; // bg-gray-900
    } else {
      document.documentElement.classList.remove("dark");
      document.body.style.backgroundColor = "#f9fafb"; // bg-gray-50
    }
  }

  // Clases base para los enlaces del menú
  // Añadimos 'overflow-hidden' y 'whitespace-nowrap' para la animación de cerrar
  const navLinkClasses =
    "flex items-center gap-3 px-3 transition-all duration-300 rounded-lg overflow-hidden whitespace-nowrap";

  // Estilos cuando el enlace NO está activo
  const inactiveClasses =
    "py-2 hover:bg-[#195237] text-gray-300 hover:text-white transition-colors";

  // Estilos cuando el enlace SÍ está activo
  const activeClasses =
    "py-2.5 bg-[#1e6142] border-l-4 border-[#68d391] shadow-md text-white font-semibold";
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<div
  class="flex h-screen bg-gray-50 dark:bg-gray-900 font-sans transition-colors duration-300"
>
  <!-- MENÚ LATERAL (Sidebar) -->
  <aside
    class="bg-[#11422c] dark:bg-green-950 text-white flex flex-col justify-between shadow-2xl z-20 transition-all duration-300 border-r border-green-900/50 {isSidebarOpen
      ? 'w-64'
      : 'w-20'}"
  >
    <div>
      <!-- ENCABEZADO DEL MENÚ (Lógica arreglada para que no se aplaste) -->
      <div
        class="relative bg-[#0b2b1d] dark:bg-gray-900 h-16 w-full border-b border-green-900/50 dark:border-gray-800 transition-all duration-300"
      >
        <!-- Logo y Texto (Se anclan a la izquierda y se ocultan suavemente al cerrar) -->
        <div
          class="absolute left-4 top-0 bottom-0 flex items-center gap-3 overflow-hidden whitespace-nowrap transition-opacity duration-300 {isSidebarOpen
            ? 'opacity-100'
            : 'opacity-0 pointer-events-none'}"
        >
          <!-- Ícono del Biodigestor -->
          <svg
            class="w-10 h-10 shrink-0 drop-shadow-sm"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%"
                ><stop offset="0%" stop-color="#b4f836" /><stop
                  offset="100%"
                  stop-color="#0f8b3c"
                /></linearGradient
              >
              <linearGradient id="domeGrad" x1="0%" y1="0%" x2="100%" y2="0%"
                ><stop offset="50%" stop-color="#f7fcd6" /><stop
                  offset="100%"
                  stop-color="#e2f5a6"
                /></linearGradient
              >
            </defs>
            <circle cx="50" cy="50" r="48" fill="url(#bgGrad)" />
            <path
              d="M 28 45 L 28 36 C 28 20 72 20 72 36 L 72 45 Z"
              fill="url(#domeGrad)"
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
          <h1 class="text-xl font-extrabold text-white tracking-tight">
            BioCore
          </h1>
        </div>

        <!-- Botón de Colapsar/Expandir (Se centra automáticamente cuando se cierra) -->
        <button
          onclick={() => (isSidebarOpen = !isSidebarOpen)}
          class="absolute top-1/2 -translate-y-1/2 {isSidebarOpen
            ? 'right-4'
            : 'left-1/2 -translate-x-1/2'} p-2 rounded-lg bg-[#195237] hover:bg-lime-500 text-white hover:text-green-950 transition-all duration-300 shadow-[0_0_10px_rgba(0,0,0,0.2)] hover:shadow-[0_0_15px_rgba(132,204,22,0.5)] z-10"
          title={isSidebarOpen ? "Colapsar menú" : "Expandir menú"}
        >
          <svg
            class="w-5 h-5 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {#if isSidebarOpen}
              <!-- Icono de doble flecha hacia la izquierda (Cerrar) -->
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              ></path>
            {:else}
              <!-- Icono de Hamburguesa (Abrir) -->
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            {/if}
          </svg>
        </button>
      </div>

      <!-- Lista de Navegación -->
      <nav class="mt-6 px-3">
        <ul class="space-y-2 text-[15px]">
          <!-- Resumen -->
          <li>
            <a
              href="/"
              class="{navLinkClasses} {$page.url.pathname === '/'
                ? activeClasses
                : inactiveClasses}"
              title="Resumen"
            >
              <svg
                class="w-6 h-6 shrink-0 {$page.url.pathname === '/'
                  ? 'opacity-100'
                  : 'opacity-70'}"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z"
                ></path>
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z"
                ></path>
              </svg>
              <span
                class="transition-opacity duration-300 {isSidebarOpen
                  ? 'opacity-100'
                  : 'opacity-0'}">Resumen</span
              >
            </a>
          </li>

          <!-- Métricas en tiempo real -->
          <li>
            <a
              href="/metricas"
              class="{navLinkClasses} {$page.url.pathname === '/metricas'
                ? activeClasses
                : inactiveClasses}"
              title="Métricas en tiempo real"
            >
              <svg
                class="w-6 h-6 shrink-0 {$page.url.pathname === '/metricas'
                  ? 'opacity-100'
                  : 'opacity-70'}"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                ></path>
              </svg>
              <span
                class="transition-opacity duration-300 {isSidebarOpen
                  ? 'opacity-100'
                  : 'opacity-0'}">Métricas en tiempo real</span
              >
            </a>
          </li>

          <!-- Historial -->
          <li>
            <a
              href="/historial"
              class="{navLinkClasses} {$page.url.pathname === '/historial'
                ? activeClasses
                : inactiveClasses}"
              title="Historial"
            >
              <svg
                class="w-6 h-6 shrink-0 {$page.url.pathname === '/historial'
                  ? 'opacity-100'
                  : 'opacity-70'}"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                ></path>
              </svg>
              <span
                class="transition-opacity duration-300 {isSidebarOpen
                  ? 'opacity-100'
                  : 'opacity-0'}">Historial de datos</span
              >
            </a>
          </li>

          <!-- Producción de biogás -->
          <li>
            <a
              href="/produccion"
              class="{navLinkClasses} {$page.url.pathname === '/produccion'
                ? activeClasses
                : inactiveClasses}"
              title="Producción de biogás"
            >
              <svg
                class="w-6 h-6 shrink-0 {$page.url.pathname === '/produccion'
                  ? 'opacity-100'
                  : 'opacity-70'}"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.047 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z"
                ></path>
              </svg>
              <span
                class="transition-opacity duration-300 {isSidebarOpen
                  ? 'opacity-100'
                  : 'opacity-0'}">Producción de biogás</span
              >
            </a>
          </li>

          <!-- Alertas -->
          <li>
            <a
              href="/alertas"
              class="{navLinkClasses} {$page.url.pathname === '/alertas'
                ? activeClasses
                : inactiveClasses}"
              title="Alertas"
            >
              <svg
                class="w-6 h-6 shrink-0 {$page.url.pathname === '/alertas'
                  ? 'opacity-100'
                  : 'opacity-70'}"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                ></path>
              </svg>
              <span
                class="transition-opacity duration-300 {isSidebarOpen
                  ? 'opacity-100'
                  : 'opacity-0'}">Alertas del sistema</span
              >
            </a>
          </li>

          <!-- Dispositivos -->
          <li>
            <a
              href="/dispositivos"
              class="{navLinkClasses} {$page.url.pathname === '/dispositivos'
                ? activeClasses
                : inactiveClasses}"
              title="Dispositivos"
            >
              <svg
                class="w-6 h-6 shrink-0 {$page.url.pathname === '/dispositivos'
                  ? 'opacity-100'
                  : 'opacity-70'}"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z"
                ></path>
              </svg>
              <span
                class="transition-opacity duration-300 {isSidebarOpen
                  ? 'opacity-100'
                  : 'opacity-0'}">Dispositivos y Nodos</span
              >
            </a>
          </li>

          <!-- Reportes -->
          <li>
            <a
              href="/reportes"
              class="{navLinkClasses} {$page.url.pathname === '/reportes'
                ? activeClasses
                : inactiveClasses}"
              title="Reportes"
            >
              <svg
                class="w-6 h-6 shrink-0 {$page.url.pathname === '/reportes'
                  ? 'opacity-100'
                  : 'opacity-70'}"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                ></path>
              </svg>
              <span
                class="transition-opacity duration-300 {isSidebarOpen
                  ? 'opacity-100'
                  : 'opacity-0'}">Descargar Reportes</span
              >
            </a>
          </li>

          <!-- Configuración -->
          <li>
            <a
              href="/configuracion"
              class="{navLinkClasses} {$page.url.pathname === '/configuracion'
                ? activeClasses
                : inactiveClasses}"
              title="Configuración"
            >
              <svg
                class="w-6 h-6 shrink-0 {$page.url.pathname === '/configuracion'
                  ? 'opacity-100'
                  : 'opacity-70'}"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854-.107 1.204l-.527-.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71-.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z"
                ></path>
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
              </svg>
              <span
                class="transition-opacity duration-300 {isSidebarOpen
                  ? 'opacity-100'
                  : 'opacity-0'}">Configuración</span
              >
            </a>
          </li>

          <!-- Usuarios -->
          <li>
            <a
              href="/usuarios"
              class="{navLinkClasses} {$page.url.pathname === '/usuarios'
                ? activeClasses
                : inactiveClasses}"
              title="Usuarios"
            >
              <svg
                class="w-6 h-6 shrink-0 {$page.url.pathname === '/usuarios'
                  ? 'opacity-100'
                  : 'opacity-70'}"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                ></path>
              </svg>
              <span
                class="transition-opacity duration-300 {isSidebarOpen
                  ? 'opacity-100'
                  : 'opacity-0'}">Gestión de Usuarios</span
              >
            </a>
          </li>

          <!-- Acerca de -->
          <li>
            <a
              href="/acerca"
              class="{navLinkClasses} {$page.url.pathname === '/acerca'
                ? activeClasses
                : inactiveClasses}"
              title="Acerca de"
            >
              <svg
                class="w-6 h-6 shrink-0 {$page.url.pathname === '/acerca'
                  ? 'opacity-100'
                  : 'opacity-70'}"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                ></path>
              </svg>
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

    <!-- Indicador inferior (Se oculta al cerrar) -->
    <div
      class="p-4 bg-[#0a291b] dark:bg-green-900 border-t border-green-800/50 flex flex-col justify-center h-[70px] overflow-hidden whitespace-nowrap transition-opacity duration-300 {isSidebarOpen
        ? 'opacity-100'
        : 'opacity-0'}"
    >
      <div class="flex items-center space-x-1 text-xs text-green-300">
        <span>🕒 Última sincronización:</span>
      </div>
      <div class="font-mono mt-1 text-white opacity-90 text-sm">
        08/05/2026 09:41
      </div>
    </div>
  </aside>

  <!-- CONTENEDOR DERECHO (Top Bar y Main) -->
  <div
    class="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
  >
    <!-- Barra Superior (Topbar) -->
    <header
      class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 h-16 flex justify-between items-center px-6 z-10 transition-colors duration-300"
    >
      <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100">
        Monitoreo IoT
      </h2>

      <div class="flex items-center space-x-6">
        <!-- Interruptor de Tema -->
        <div
          class="flex items-center gap-3 border-r border-gray-200 dark:border-gray-700 pr-6"
        >
          <span class="text-xs font-bold text-gray-500 dark:text-gray-400">
            Tema {isDark ? "Oscuro" : "Claro"}
          </span>
          <button
            onclick={toggleTheme}
            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none {isDark
              ? 'bg-green-600'
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

        <!-- Indicador de Conexión -->
        <div
          class="flex items-center space-x-1.5 font-bold animate-pulse transition-colors duration-300 {isConnected
            ? 'text-green-600 dark:text-green-400'
            : 'text-red-500 dark:text-red-400'}"
        >
          {#if isConnected}
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12 18.75h.007v.008H12v-.008z"
              ></path>
            </svg>
            <span class="text-sm">Sistema conectado</span>
          {:else}
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M18.364 5.636a9 9 0 00-12.728 0M15.536 8.464a5 5 0 00-7.072 0M12 11.293L12 11.293M3 3l18 18"
              ></path>
            </svg>
            <span class="text-sm">Sistema desconectado</span>
          {/if}
        </div>

        <!-- Notificaciones -->
        <button
          class="text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 transition"
          aria-label="Ver notificaciones"
        >
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"
            ></path>
          </svg>
        </button>

        <!-- Administrador -->
        <div
          class="flex items-center space-x-2 pl-4 border-l border-gray-200 dark:border-gray-700 cursor-pointer hover:opacity-80 transition"
        >
          <div
            class="w-8 h-8 bg-green-700 text-white rounded-full flex items-center justify-center font-bold"
          >
            A
          </div>
          <span class="text-sm font-semibold text-gray-700 dark:text-gray-200"
            >Administrador</span
          >
          <svg
            class="w-4 h-4 text-gray-500 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </div>
      </div>
    </header>

    <!-- RENDERIZADO DEL CONTENIDO DE LA PÁGINA -->
    <main
      class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 p-6 transition-colors duration-300 relative"
    >
      {@render children()}
    </main>
  </div>
</div>
