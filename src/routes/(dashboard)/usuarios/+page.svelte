<script lang="ts">
  import { onMount } from "svelte";
  import {
    collection,
    onSnapshot,
    query,
    doc,
    updateDoc,
  } from "firebase/firestore";
  import { db } from "../../../lib/firebase/firebase";

  // Interfaz para TypeScript
  interface Usuario {
    id: string;
    nombre: string;
    email: string;
    rol: string;
    estado: string;
    ultimoAcceso: string;
  }

  let usuarios = $state<Usuario[]>([]);
  let cargando = $state(true);

  // --- VARIABLES PARA EL MODAL DE EDICIÓN ---
  let mostrarModalEditar = $state(false);
  let guardando = $state(false);
  let usuarioEditando = $state<Usuario | null>(null);

  // Escuchar la base de datos en tiempo real
  onMount(() => {
    const q = query(collection(db, "usuarios"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const usuariosDb: Usuario[] = [];
      const ahora = new Date();

      querySnapshot.forEach((documento) => {
        const data = documento.data();

        // Formatear la fecha de Firebase a texto legible
        let accesoStr = "Nunca";
        let diffMinutos = 999; // Valor alto por defecto si no hay fecha

        if (data.ultimoAcceso && data.ultimoAcceso.toDate) {
          const fechaAcceso = data.ultimoAcceso.toDate();
          accesoStr = fechaAcceso.toLocaleString("es-VE", {
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          });

          // Calcular la diferencia de tiempo para la verificación estricta de conexión
          diffMinutos = (ahora.getTime() - fechaAcceso.getTime()) / 60000;
        }

        // Verificación estricta: Si Firebase dice "Conectado" pero pasaron más de 30 min sin actividad, es "Desconectado"
        let estadoReal = data.estado || "Desconectado";
        if (estadoReal === "Conectado" && diffMinutos > 30) {
          estadoReal = "Desconectado";
        }

        usuariosDb.push({
          id: documento.id,
          nombre: data.nombre || "Desconocido",
          email: data.email || "",
          rol: data.rol || "Operador",
          estado: estadoReal,
          ultimoAcceso: accesoStr,
        });
      });

      usuarios = usuariosDb;
      cargando = false;
    });

    return () => unsubscribe();
  });

  // --- FUNCIONES DEL MODAL DE EDICIÓN ---
  function abrirModalEditar(usuario: Usuario) {
    // Clonamos el usuario para no alterar la tabla antes de guardar
    usuarioEditando = { ...usuario };
    mostrarModalEditar = true;
  }

  function cerrarModalEditar() {
    mostrarModalEditar = false;
    usuarioEditando = null;
  }

  async function guardarEdicion() {
    if (!usuarioEditando) return;
    guardando = true;

    try {
      const userRef = doc(db, "usuarios", usuarioEditando.id);
      await updateDoc(userRef, {
        rol: usuarioEditando.rol,
        estado: usuarioEditando.estado,
      });
      cerrarModalEditar();
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      alert("Hubo un error al actualizar los datos en Firebase.");
    } finally {
      guardando = false;
    }
  }
</script>

<div class="space-y-6 max-w-[1600px] mx-auto pb-10">
  <div
    class="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-emerald-900/30 pb-6"
  >
    <div>
      <h1 class="glow-title text-4xl font-black tracking-tight mb-2">
        Gestión de Usuarios
      </h1>
      <p class="text-gray-400 text-sm font-medium flex items-center gap-2">
        <svg
          class="w-4 h-4 text-emerald-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          ></path>
        </svg>
        Directorio del equipo sincronizado con la nube.
      </p>
    </div>

    <button
      class="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-500 text-white text-sm font-bold rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] border border-emerald-400/50 hover:-translate-y-0.5 transition-all"
    >
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
          d="M12 4v16m8-8H4"
        ></path>
      </svg>
      Añadir Operador
    </button>
  </div>

  <div
    class="interactive-card bg-[#011612]/80 backdrop-blur-md rounded-3xl shadow-2xl border border-emerald-900/40 overflow-hidden relative min-h-[400px]"
  >
    {#if cargando}
      <div class="p-20 flex flex-col items-center justify-center gap-4">
        <svg
          class="w-12 h-12 text-emerald-600/50 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p
          class="text-emerald-500/70 font-mono text-sm animate-pulse tracking-widest uppercase"
        >
          Cargando directorio...
        </p>
      </div>
    {:else}
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm whitespace-nowrap">
          <thead
            class="bg-[#000a08] text-gray-400 font-bold border-b border-emerald-900/40 uppercase tracking-widest text-[10px]"
          >
            <tr>
              <th class="px-8 py-6 pl-10">Ingeniero / Operador</th>
              <th class="px-6 py-6">Rol en el Sistema</th>
              <th class="px-6 py-6">Estado de Red</th>
              <th class="px-6 py-6">Último Acceso</th>
              <th class="px-6 py-6 text-right pr-10">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-emerald-900/20 text-gray-300">
            {#each usuarios as user (user.id)}
              <tr class="hover:bg-emerald-900/10 transition-colors group">
                <td class="px-8 py-5 pl-10 flex items-center gap-4">
                  <div
                    class="w-10 h-10 rounded-xl bg-[#001410] border border-emerald-900/50 flex items-center justify-center text-emerald-400 font-black uppercase shadow-inner group-hover:border-emerald-500/50 transition-colors"
                  >
                    {user.nombre.charAt(0)}
                  </div>
                  <div class="flex flex-col">
                    <span
                      class="font-bold text-gray-100 group-hover:text-white transition-colors"
                      >{user.nombre}</span
                    >
                    <span class="text-[10px] text-gray-500 font-mono mt-0.5"
                      >{user.email}</span
                    >
                  </div>
                </td>
                <td class="px-6 py-5">
                  <span
                    class="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-md bg-[#001410] border border-cyan-900/50 text-cyan-400 shadow-inner"
                  >
                    {user.rol}
                  </span>
                </td>
                <td class="px-6 py-5">
                  <div
                    class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-inner {user.estado.toLowerCase() ===
                    'conectado'
                      ? 'bg-emerald-950/40 border-emerald-900/50 text-emerald-400'
                      : 'bg-gray-900/40 border-gray-800 text-gray-500'}"
                  >
                    <span class="relative flex h-2 w-2">
                      {#if user.estado.toLowerCase() === "conectado"}
                        <span
                          class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
                        ></span>
                      {/if}
                      <span
                        class="relative inline-flex rounded-full h-2 w-2 {user.estado.toLowerCase() ===
                        'conectado'
                          ? 'bg-emerald-500'
                          : 'bg-gray-600'}"
                      ></span>
                    </span>
                    <span
                      class="text-[10px] font-bold tracking-widest uppercase"
                      >{user.estado}</span
                    >
                  </div>
                </td>
                <td class="px-6 py-5 font-mono text-gray-400 text-xs">
                  {user.ultimoAcceso}
                </td>
                <td class="px-6 py-5 text-right pr-10">
                  <button
                    onclick={() => abrirModalEditar(user)}
                    class="text-cyan-500 hover:text-cyan-300 font-semibold text-xs tracking-wide transition-colors"
                  >
                    Editar
                  </button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
</div>

<!-- ========================================== -->
<!-- MODAL FLOTANTE PARA EDITAR USUARIO         -->
<!-- ========================================== -->
{#if mostrarModalEditar && usuarioEditando}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm transition-opacity"
  >
    <div
      class="bg-gradient-to-br from-[#01211b] to-[#001410] border border-emerald-500/30 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.2)] w-full max-w-md overflow-hidden transform scale-100 transition-transform"
    >
      <!-- Cabecera del Modal -->
      <div
        class="flex justify-between items-center p-6 border-b border-emerald-900/30"
      >
        <h3 class="text-xl font-bold text-white glow-title tracking-tight">
          Editar Operador
        </h3>
        <button
          aria-label="Cerrar"
          onclick={cerrarModalEditar}
          class="text-gray-400 hover:text-white bg-black/40 hover:bg-red-500/20 rounded-full p-2 transition-colors border border-gray-800 hover:border-red-500/50"
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

      <!-- Cuerpo del Modal (Inputs) -->
      <div class="p-6 space-y-5">
        <div>
          <label
            for="edit-nombre"
            class="block text-[10px] font-bold text-emerald-400/80 mb-2 uppercase tracking-widest pl-1"
            >Nombre</label
          >
          <input
            id="edit-nombre"
            type="text"
            value={usuarioEditando.nombre}
            disabled
            class="w-full px-4 py-3 rounded-xl border border-emerald-900/30 bg-black/50 text-gray-500 cursor-not-allowed shadow-inner"
          />
        </div>

        <div>
          <label
            for="edit-rol"
            class="block text-[10px] font-bold text-emerald-400/80 mb-2 uppercase tracking-widest pl-1"
            >Rol en el Sistema</label
          >
          <select
            id="edit-rol"
            bind:value={usuarioEditando.rol}
            class="w-full px-4 py-3 rounded-xl border border-emerald-900/50 bg-[#001410] text-gray-200 focus:border-emerald-500 outline-none shadow-inner transition-all appearance-none cursor-pointer"
          >
            <option value="Administrador">Administrador</option>
            <option value="Administrador / Full-Stack"
              >Administrador / Full-Stack</option
            >
            <option value="Operador">Operador</option>
            <option value="Visualizador">Visualizador</option>
          </select>
        </div>

        <div>
          <label
            for="edit-estado"
            class="block text-[10px] font-bold text-emerald-400/80 mb-2 uppercase tracking-widest pl-1"
            >Forzar Estado de Red</label
          >
          <select
            id="edit-estado"
            bind:value={usuarioEditando.estado}
            class="w-full px-4 py-3 rounded-xl border border-emerald-900/50 bg-[#001410] text-gray-200 focus:border-emerald-500 outline-none shadow-inner transition-all appearance-none cursor-pointer"
          >
            <option value="Conectado">Conectado</option>
            <option value="Desconectado">Desconectado</option>
          </select>
        </div>
      </div>
      <!-- <- Este era el div de cierre que faltaba -->

      <!-- Botones de Acción -->
      <div
        class="p-6 bg-[#000a08]/50 border-t border-emerald-900/30 flex justify-end gap-3"
      >
        <button
          onclick={cerrarModalEditar}
          class="px-5 py-2.5 rounded-xl font-bold text-gray-400 hover:text-white bg-[#001410] border border-gray-800 hover:border-gray-600 transition-colors shadow-inner"
        >
          Cancelar
        </button>
        <button
          onclick={guardarEdicion}
          disabled={guardando}
          class="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-green-500 hover:from-green-500 hover:to-emerald-400 text-white font-black rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)] flex items-center gap-2 disabled:opacity-50"
        >
          {#if guardando}
            <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"
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
            Guardar Cambios
          {/if}
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .glow-title {
    background: linear-gradient(135deg, #a3e635 0%, #10b981 50%, #06b6d4 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    filter: drop-shadow(0 4px 8px rgba(16, 185, 129, 0.2));
  }
</style>
