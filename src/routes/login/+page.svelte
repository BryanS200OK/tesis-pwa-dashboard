<script lang="ts">
  import "../../app.css";
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";

  import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
  } from "firebase/auth";
  import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    serverTimestamp,
  } from "firebase/firestore";
  import { db } from "../../lib/firebase/firebase";

  // --- ESTADOS DEL LOGIN ---
  let email = $state("");
  let password = $state("");
  let rememberMe = $state(true);
  let mostrarPasswordLogin = $state(false); // Controla el ojito del login
  let errorMsg = $state("");

  // --- ESTADOS DEL REGISTRO (MODAL) ---
  let mostrarModalRegistro = $state(false);
  let nombreReg = $state("");
  let emailReg = $state("");
  let passwordReg = $state("");
  let mostrarPasswordRegistro = $state(false); // Controla el ojito del registro
  let errorReg = $state("");

  // Estado global de carga
  let cargando = $state(false);
  let accion = $state("");

  // --- FUNCIÓN 1: INICIAR SESIÓN (CUENTA EXISTENTE) ---
  async function handleLogin() {
    if (!email || !password) {
      errorMsg = "Por favor, ingresa tu correo y contraseña.";
      return;
    }

    cargando = true;
    accion = "login";
    errorMsg = "";
    let loginExitoso = false;

    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      const userRef = doc(db, "usuarios", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        await updateDoc(userRef, {
          estado: "Conectado",
          ultimoAcceso: serverTimestamp(),
        });
      } else {
        // Fallback por si la cuenta existe en Auth pero no en Firestore
        await setDoc(userRef, {
          nombre: email.split("@")[0],
          email: email,
          rol: "Administrador / Full-Stack",
          estado: "Conectado",
          ultimoAcceso: serverTimestamp(),
          creadoEn: serverTimestamp(),
        });
      }

      loginExitoso = true;
    } catch (error: unknown) {
      console.error("Error en login:", error);
      const err = error as { code?: string };

      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password"
      ) {
        errorMsg = "Credenciales incorrectas o la cuenta no existe.";
      } else {
        errorMsg = "Error al conectar con el servidor.";
      }
    } finally {
      cargando = false;
    }

    if (loginExitoso) {
      return goto(resolve("/"));
    }
  }

  // --- FUNCIÓN 2: CREAR CUENTA NUEVA DESDE EL MODAL ---
  async function handleRegister(event: Event) {
    event.preventDefault(); // Evita que se recargue la página al enviar el formulario del modal

    if (!nombreReg || !emailReg || !passwordReg) {
      errorReg = "Por favor, llena todos los campos.";
      return;
    }
    if (passwordReg.length < 6) {
      errorReg = "La contraseña debe tener al menos 6 caracteres.";
      return;
    }

    cargando = true;
    accion = "registro";
    errorReg = "";
    let registroExitoso = false;

    try {
      const auth = getAuth();
      // Crea el usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        emailReg,
        passwordReg,
      );
      const user = userCredential.user;

      // Guarda el perfil en la base de datos Firestore usando el nombre ingresado
      const userRef = doc(db, "usuarios", user.uid);
      await setDoc(userRef, {
        nombre: nombreReg,
        email: emailReg,
        rol: "Administrador / Full-Stack",
        estado: "Conectado",
        ultimoAcceso: serverTimestamp(),
        creadoEn: serverTimestamp(),
      });

      registroExitoso = true;
    } catch (error: unknown) {
      console.error("Error en registro:", error);
      const err = error as { code?: string };

      if (err.code === "auth/email-already-in-use") {
        errorReg =
          "Este correo ya está registrado. Cierra esta ventana e inicia sesión.";
      } else {
        errorReg = "Error al crear la cuenta nueva.";
      }
    } finally {
      cargando = false;
    }

    if (registroExitoso) {
      mostrarModalRegistro = false;
      return goto(resolve("/"));
    }
  }

  // Funciones para limpiar errores y abrir el modal
  function abrirModalRegistro() {
    errorReg = "";
    nombreReg = "";
    emailReg = "";
    passwordReg = "";
    mostrarModalRegistro = true;
  }
</script>

<svelte:head>
  <title>Acceso - BioCore</title>
  <meta name="theme-color" content="#001410" />
</svelte:head>

<div
  class="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#000a08]"
>
  <!-- Fondo Decorativo -->
  <div class="absolute inset-0 z-0 pointer-events-none">
    <div
      class="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-emerald-900/20 blur-[120px]"
    ></div>
    <div
      class="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-cyan-900/20 blur-[120px]"
    ></div>
    <div
      class="absolute top-[30%] left-[20%] w-[40%] h-[40%] rounded-full bg-lime-500/5 blur-[150px]"
    ></div>
  </div>

  <div
    class="absolute top-0 left-0 w-full p-6 sm:p-8 z-20 flex justify-center sm:justify-start"
  >
    <div class="flex items-center gap-3">
      <div
        class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5)]"
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
      <span
        class="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 tracking-wide"
        >BioCore</span
      >
    </div>
  </div>

  <!-- TARJETA PRINCIPAL DE LOGIN -->
  <div
    class="relative z-10 w-full max-w-[420px] mx-4 p-8 sm:p-10 bg-[#011612]/80 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-emerald-900/30 text-white"
  >
    <h1 class="text-3xl font-bold mb-2 text-center sm:text-left text-gray-100">
      Acceso Seguro
    </h1>
    <p class="text-gray-400 text-sm mb-8 text-center sm:text-left">
      Ingresa tus credenciales operativas.
    </p>

    {#if errorMsg}
      <div
        class="mb-6 p-3 bg-red-950/50 border border-red-900/50 rounded-xl flex items-center gap-2 text-red-400 text-sm"
      >
        <svg
          class="w-6 h-6 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path></svg
        >
        <span class="leading-tight">{errorMsg}</span>
      </div>
    {/if}

    <form class="space-y-5">
      <div class="space-y-1">
        <label
          for="email"
          class="block text-[10px] font-bold text-emerald-400/80 uppercase tracking-widest pl-1"
          >Correo Electrónico</label
        >
        <input
          type="email"
          id="email"
          bind:value={email}
          required
          class="w-full px-5 py-3.5 rounded-xl border border-emerald-900/50 bg-[#000a08] text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 outline-none shadow-inner transition-all"
        />
      </div>

      <div class="space-y-1 relative">
        <label
          for="password"
          class="block text-[10px] font-bold text-emerald-400/80 uppercase tracking-widest pl-1"
          >Contraseña</label
        >
        <input
          type={mostrarPasswordLogin ? "text" : "password"}
          id="password"
          bind:value={password}
          required
          class="w-full pl-5 pr-12 py-3.5 rounded-xl border border-emerald-900/50 bg-[#000a08] text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 outline-none shadow-inner transition-all"
        />

        <!-- BOTÓN DEL OJITO (LOGIN) -->
        <button
          type="button"
          aria-label="Mostrar contraseña"
          onclick={() => (mostrarPasswordLogin = !mostrarPasswordLogin)}
          class="absolute right-4 top-[34px] text-gray-500 hover:text-emerald-400 transition-colors"
        >
          {#if mostrarPasswordLogin}
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
              ></path></svg
            >
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
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              ></path><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              ></path></svg
            >
          {/if}
        </button>
      </div>

      <div class="flex items-center justify-between pt-2 pb-2">
        <label
          class="flex items-center gap-2 cursor-pointer text-sm text-gray-400 hover:text-gray-300"
        >
          <input
            type="checkbox"
            bind:checked={rememberMe}
            class="w-4 h-4 rounded bg-[#000a08] border-emerald-900/50 text-emerald-500 focus:ring-0 focus:ring-offset-0"
          />
          Recordarme
        </label>
      </div>

      <div class="space-y-3 mt-4">
        <button
          type="button"
          onclick={handleLogin}
          disabled={cargando}
          class="w-full bg-gradient-to-r from-emerald-600 to-green-500 hover:from-green-500 hover:to-emerald-400 text-white font-black py-4 rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {#if cargando && accion === "login"}
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
            Ingresando...
          {:else}
            Ingresar al Sistema
          {/if}
        </button>

        <button
          type="button"
          onclick={abrirModalRegistro}
          disabled={cargando}
          class="w-full bg-[#000a08] border border-emerald-900/50 hover:border-emerald-500/80 text-emerald-400 font-bold py-4 rounded-xl transition-all shadow-inner flex items-center justify-center gap-2 disabled:opacity-50"
        >
          Crear Cuenta Nueva
        </button>
      </div>
    </form>
  </div>
</div>

<!-- ============================================== -->
<!-- MODAL FLOTANTE PARA REGISTRAR CUENTA NUEVA     -->
<!-- ============================================== -->
{#if mostrarModalRegistro}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-md transition-opacity"
  >
    <div
      class="bg-gradient-to-br from-[#01211b] to-[#001410] border border-emerald-500/30 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.2)] w-full max-w-md overflow-hidden"
    >
      <div
        class="flex justify-between items-center p-6 md:p-8 border-b border-emerald-900/30"
      >
        <h3 class="text-2xl font-bold text-white tracking-tight">
          Nuevo Operador
        </h3>
        <button
          aria-label="Cerrar modal"
          onclick={() => (mostrarModalRegistro = false)}
          class="text-gray-400 hover:text-white bg-black/40 hover:bg-red-500/20 rounded-full p-2.5 transition-colors border border-gray-800 hover:border-red-500/50"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path></svg
          >
        </button>
      </div>

      <form onsubmit={handleRegister} class="p-6 md:p-8 space-y-5">
        {#if errorReg}
          <div
            class="p-3 bg-red-950/50 border border-red-900/50 rounded-xl flex items-center gap-2 text-red-400 text-sm"
          >
            <svg
              class="w-5 h-5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path></svg
            >
            <span class="leading-tight">{errorReg}</span>
          </div>
        {/if}

        <div>
          <label
            for="nomReg"
            class="block text-[10px] font-bold text-emerald-400/80 mb-2 uppercase tracking-widest pl-1"
            >Nombre Completo</label
          >
          <input
            type="text"
            id="nomReg"
            bind:value={nombreReg}
            placeholder="Ej. Bryan Salazar"
            required
            class="w-full px-5 py-3.5 rounded-xl border border-emerald-900/50 bg-[#001410] text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 outline-none shadow-inner transition-all"
          />
        </div>

        <div>
          <label
            for="emlReg"
            class="block text-[10px] font-bold text-emerald-400/80 mb-2 uppercase tracking-widest pl-1"
            >Correo Electrónico</label
          >
          <input
            type="email"
            id="emlReg"
            bind:value={emailReg}
            placeholder="correo@biocore.ve"
            required
            class="w-full px-5 py-3.5 rounded-xl border border-emerald-900/50 bg-[#001410] text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 outline-none shadow-inner transition-all"
          />
        </div>

        <div class="relative">
          <label
            for="passReg"
            class="block text-[10px] font-bold text-emerald-400/80 mb-2 uppercase tracking-widest pl-1"
            >Contraseña (Mín. 6 caracteres)</label
          >
          <input
            type={mostrarPasswordRegistro ? "text" : "password"}
            id="passReg"
            bind:value={passwordReg}
            required
            class="w-full pl-5 pr-12 py-3.5 rounded-xl border border-emerald-900/50 bg-[#001410] text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 outline-none shadow-inner transition-all"
          />

          <!-- BOTÓN DEL OJITO (REGISTRO) -->
          <button
            type="button"
            aria-label="Mostrar contraseña"
            onclick={() => (mostrarPasswordRegistro = !mostrarPasswordRegistro)}
            class="absolute right-4 top-[38px] text-gray-500 hover:text-emerald-400 transition-colors"
          >
            {#if mostrarPasswordRegistro}
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                ><path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                ></path></svg
              >
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
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                ></path><path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                ></path></svg
              >
            {/if}
          </button>
        </div>

        <div
          class="pt-4 flex justify-end gap-3 border-t border-emerald-900/30 mt-6"
        >
          <button
            type="button"
            onclick={() => (mostrarModalRegistro = false)}
            class="px-6 py-3 rounded-xl font-bold text-gray-400 hover:text-white bg-[#001410] border border-gray-800 hover:border-gray-600 transition-colors shadow-inner"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={cargando}
            class="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-500 hover:from-green-500 hover:to-emerald-400 text-white font-black rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)] flex items-center gap-2 disabled:opacity-50"
          >
            {#if cargando && accion === "registro"}
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
              Creando...
            {:else}
              Registrar
            {/if}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}
