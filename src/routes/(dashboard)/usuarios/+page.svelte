<script lang="ts">
  // Array reactivo con el personal autorizado para operar el sistema
  let usuarios = $state([
    {
      id: 1,
      nombre: "Bryan Salazar",
      rol: "Administrador / Full-Stack",
      estado: "Conectado",
      ultimoAcceso: "Ahora",
    },
    {
      id: 2,
      nombre: "Tairon Rojas",
      rol: "Ingeniero IoT",
      estado: "Conectado",
      ultimoAcceso: "Hace 15 min",
    },
    {
      id: 3,
      nombre: "Emily Rojas",
      rol: "Analista de Datos",
      estado: "Desconectado",
      ultimoAcceso: "Ayer",
    },
    {
      id: 4,
      nombre: "Blas González",
      rol: "Redes y Servidores",
      estado: "Conectado",
      ultimoAcceso: "Hace 2 horas",
    },
    {
      id: 5,
      nombre: "Jeanny Monagas",
      rol: "Supervisora de Planta",
      estado: "Desconectado",
      ultimoAcceso: "Hace 5 días",
    },
    {
      id: 6,
      nombre: "Alexander Fernández",
      rol: "Mantenimiento Técnico",
      estado: "Desconectado",
      ultimoAcceso: "Hace 1 semana",
    },
  ]);
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h1
        class="text-3xl font-bold text-gray-900 dark:text-white tracking-tight"
      >
        Gestión de Usuarios
      </h1>
      <p class="text-gray-500 dark:text-gray-400 mt-1">
        Control de acceso y roles del equipo de ingeniería.
      </p>
    </div>
    <button
      class="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors shadow-sm"
    >
      + Añadir Operador
    </button>
  </div>

  <!-- Tabla de Usuarios -->
  <div
    class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
  >
    <div class="overflow-x-auto">
      <table class="w-full text-left text-sm whitespace-nowrap">
        <thead
          class="bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-300 font-semibold border-b border-gray-200 dark:border-gray-700"
        >
          <tr>
            <th class="px-6 py-4">Ingeniero / Operador</th>
            <th class="px-6 py-4">Rol en el Sistema</th>
            <th class="px-6 py-4">Estado de Red</th>
            <th class="px-6 py-4">Último Acceso</th>
            <th class="px-6 py-4 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody
          class="divide-y divide-gray-100 dark:divide-gray-700 text-gray-700 dark:text-gray-200"
        >
          {#each usuarios as user}
            <tr
              class="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
            >
              <td class="px-6 py-4 flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-700 dark:text-green-400 font-bold uppercase"
                >
                  {user.nombre.charAt(0)}
                </div>
                <span class="font-bold">{user.nombre}</span>
              </td>
              <td class="px-6 py-4">{user.rol}</td>
              <td class="px-6 py-4">
                <span
                  class="px-3 py-1 rounded-full text-xs font-bold {user.estado ===
                  'Conectado'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}"
                >
                  {user.estado}
                </span>
              </td>
              <td class="px-6 py-4">{user.ultimoAcceso}</td>
              <td class="px-6 py-4 text-right">
                <button
                  class="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                  >Editar</button
                >
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>
