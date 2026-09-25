<script lang="ts">
  import { onMount } from "svelte";
  import { collection, onSnapshot, query } from "firebase/firestore";
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

  // Escuchar la base de datos en tiempo real
  onMount(() => {
    // Apuntamos a la colección "usuarios" que crea el Login
    const q = query(collection(db, "usuarios"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const usuariosDb: Usuario[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();

        // Formatear la fecha de Firebase a texto legible
        let accesoStr = "Nunca";
        if (data.ultimoAcceso && data.ultimoAcceso.toDate) {
          accesoStr = data.ultimoAcceso.toDate().toLocaleString("es-VE", {
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          });
        }

        usuariosDb.push({
          id: doc.id,
          nombre: data.nombre || "Desconocido",
          email: data.email || "",
          rol: data.rol || "Operador",
          estado: data.estado || "Desconectado",
          ultimoAcceso: accesoStr,
        });
      });

      usuarios = usuariosDb;
      cargando = false;
    });

    return () => unsubscribe();
  });
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
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          ></path></svg
        >
        Directorio del equipo sincronizado con la nube.
      </p>
    </div>

    <button
      class="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-500 text-white text-sm font-bold rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] border border-emerald-400/50 hover:-translate-y-0.5 transition-all"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2.5"
          d="M12 4v16m8-8H4"
        ></path></svg
      >
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
                    class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-inner {user.estado ===
                    'Conectado'
                      ? 'bg-emerald-950/40 border-emerald-900/50 text-emerald-400'
                      : 'bg-gray-900/40 border-gray-800 text-gray-500'}"
                  >
                    <span class="relative flex h-2 w-2">
                      {#if user.estado === "Conectado"}
                        <span
                          class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
                        ></span>
                      {/if}
                      <span
                        class="relative inline-flex rounded-full h-2 w-2 {user.estado ===
                        'Conectado'
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
                <td class="px-6 py-5 font-mono text-gray-400 text-xs"
                  >{user.ultimoAcceso}</td
                >
                <td class="px-6 py-5 text-right pr-10">
                  <button
                    class="text-cyan-500 hover:text-cyan-300 font-semibold text-xs tracking-wide transition-colors"
                    >Editar</button
                  >
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
</div>

<style>
  .glow-title {
    background: linear-gradient(135deg, #a3e635 0%, #10b981 50%, #06b6d4 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    filter: drop-shadow(0 4px 8px rgba(16, 185, 129, 0.2));
  }
</style>
