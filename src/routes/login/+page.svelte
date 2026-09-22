<script lang="ts">
  // Importamos Tailwind para esta página aislada.
  import "../../app.css";
  // Importamos el enrutador de SvelteKit para viajar entre páginas
  import { goto } from "$app/navigation";

  let email = $state("");
  let password = $state("");
  let rememberMe = $state(true);

  function handleLogin(event: Event) {
    event.preventDefault();
    console.log("Iniciando autenticación en la nube para:", email);

    // Redirección automática al dashboard (ruta raíz)
    goto("/");
  }
</script>

<svelte:head>
  <title>Iniciar Sesión - BioLink</title>
  <meta name="theme-color" content="#111827" />
</svelte:head>

<!-- Contenedor Principal -->
<div
  class="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#05140c]"
>
  <!-- Fondo Mesh Gradient (Luces difuminadas tecnológicas) -->
  <div class="absolute inset-0 z-0">
    <!-- Luz superior izquierda (Verde esmeralda oscuro) -->
    <div
      class="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-emerald-900/40 blur-[120px]"
    ></div>
    <!-- Luz inferior derecha (Verde intenso) -->
    <div
      class="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-[#0f8b3c]/30 blur-[120px]"
    ></div>
    <!-- Detalle de luz central (Verde lima brillante, muy sutil) -->
    <div
      class="absolute top-[30%] left-[20%] w-[40%] h-[40%] rounded-full bg-[#b4f836]/10 blur-[150px]"
    ></div>
  </div>

  <!-- Header del Logo -->
  <div
    class="absolute top-0 left-0 w-full p-6 sm:p-8 z-20 flex justify-center sm:justify-start"
  >
    <div class="flex items-center gap-2">
      <!-- Ícono del Biodigestor -->
      <svg
        class="w-8 h-8 sm:w-10 sm:h-10 text-green-500"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#b4f836" />
            <stop offset="100%" stop-color="#0f8b3c" />
          </linearGradient>
          <linearGradient id="domeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="50%" stop-color="#f7fcd6" />
            <stop offset="100%" stop-color="#e2f5a6" />
          </linearGradient>
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
      <!-- Nombre del sistema -->
      <span class="text-2xl sm:text-3xl font-extrabold text-white tracking-wide"
        >BioLink</span
      >
    </div>
  </div>

  <!-- Tarjeta de Login -->
  <div
    class="relative z-10 w-full max-w-[450px] mx-4 sm:mx-0 p-8 sm:p-12 bg-black/40 backdrop-blur-md rounded-2xl sm:rounded-xl shadow-2xl border border-white/10 text-white mt-16 sm:mt-0"
  >
    <h1 class="text-3xl font-bold mb-8 text-center sm:text-left">
      Iniciar sesión
    </h1>

    <form onsubmit={handleLogin} class="space-y-5">
      <!-- Input Animado: Email -->
      <div class="relative">
        <input
          type="email"
          id="email"
          bind:value={email}
          class="block w-full rounded-lg bg-white/5 border border-white/10 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:bg-white/10 text-white px-4 pt-6 pb-2 peer transition-all"
          placeholder=" "
          required
        />
        <label
          for="email"
          class="absolute text-sm text-gray-400 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 cursor-text"
        >
          Email del operador
        </label>
      </div>

      <!-- Input Animado: Contraseña -->
      <div class="relative">
        <input
          type="password"
          id="password"
          bind:value={password}
          class="block w-full rounded-lg bg-white/5 border border-white/10 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:bg-white/10 text-white px-4 pt-6 pb-2 peer transition-all"
          placeholder=" "
          required
        />
        <label
          for="password"
          class="absolute text-sm text-gray-400 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 cursor-text"
        >
          Contraseña
        </label>
      </div>

      <!-- Botón Principal PWA -->
      <button
        type="submit"
        class="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3.5 rounded-lg mt-6 transition-all shadow-[0_0_15px_rgba(22,163,74,0.4)] hover:shadow-[0_0_25px_rgba(22,163,74,0.6)] active:scale-[0.98]"
      >
        Ingresar al Dashboard
      </button>

      <div class="text-center text-gray-500 text-sm py-1">O</div>

      <!-- Botón Modo Local Offline -->
      <button
        type="button"
        class="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 font-semibold py-3.5 rounded-lg transition-colors"
      >
        Conectar por Intranet (Sin WiFi)
      </button>

      <!-- Utilidades Inferiores -->
      <div class="flex items-center justify-between mt-8 text-sm text-gray-400">
        <label
          class="flex items-center gap-2 cursor-pointer hover:text-gray-300 transition-colors"
        >
          <input
            type="checkbox"
            bind:checked={rememberMe}
            class="w-4 h-4 rounded bg-white/10 border-white/20 text-green-500 focus:ring-0 focus:ring-offset-0"
          />
          Mantener sesión
        </label>
        <a href="/" class="hover:text-white transition-colors"
          >¿Necesitas ayuda?</a
        >
      </div>

      <div
        class="mt-8 text-gray-500 text-xs sm:text-sm leading-relaxed border-t border-white/10 pt-6"
      >
        Sistema protegido. El acceso es exclusivo para el personal autorizado de
        la planta. <a
          href="/"
          class="text-green-500 hover:text-green-400 hover:underline transition-colors"
          >Políticas de uso.</a
        >
      </div>
    </form>
  </div>
</div>
