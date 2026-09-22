<script lang="ts">
  // Array reactivo simulando las alertas detectadas por el ESP32
  let alertas = $state([
    {
      id: 1,
      tipo: "Crítica",
      biodigestor: "Tanque A",
      mensaje: "Presión interna superó el límite de seguridad (1.5 bar).",
      fecha: "08/08/2026 15:30",
      leida: false,
    },
    {
      id: 2,
      tipo: "Advertencia",
      biodigestor: "Sistema Central",
      mensaje: "Descenso rápido de temperatura (-2°C en 1 hora) detectado.",
      fecha: "08/08/2026 12:15",
      leida: false,
    },
    {
      id: 3,
      tipo: "Info",
      biodigestor: "Válvula 3",
      mensaje:
        "Válvula de alivio activada exitosamente durante pico de presión.",
      fecha: "07/08/2026 09:00",
      leida: true,
    },
    {
      id: 4,
      tipo: "Advertencia",
      biodigestor: "Tanque A",
      mensaje: "Nivel de pH ligeramente ácido detectado (6.2). Monitorear.",
      fecha: "06/08/2026 18:45",
      leida: true,
    },
  ]);
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h1
        class="text-3xl font-bold text-gray-900 dark:text-white tracking-tight"
      >
        Centro de Alertas
      </h1>
      <p class="text-gray-500 dark:text-gray-400 mt-1">
        Historial de notificaciones y eventos críticos de los sistemas IoT
        BioCore.
      </p>
    </div>
    <button
      class="text-sm font-bold text-green-600 dark:text-green-400 hover:underline"
    >
      Marcar todas como leídas
    </button>
  </div>

  <!-- Lista de Alertas -->
  <div
    class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
  >
    <div class="divide-y divide-gray-100 dark:divide-gray-700">
      {#each alertas as alerta}
        <div
          class="p-6 flex items-start gap-4 transition-colors {alerta.leida
            ? 'opacity-70 bg-gray-50/50 dark:bg-gray-800/50'
            : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750'}"
        >
          <!-- Icono según tipo de severidad -->
          <div class="shrink-0 mt-1">
            {#if alerta.tipo === "Crítica"}
              <div
                class="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 text-lg"
              >
                ⚠️
              </div>
            {:else if alerta.tipo === "Advertencia"}
              <div
                class="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 dark:text-yellow-400 text-lg"
              >
                ⚡
              </div>
            {:else}
              <div
                class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-lg"
              >
                ℹ️
              </div>
            {/if}
          </div>

          <!-- Contenido de la Alerta -->
          <div class="flex-1">
            <div class="flex items-center justify-between mb-1">
              <div class="flex items-center gap-2">
                <span class="font-bold text-gray-900 dark:text-white text-lg"
                  >{alerta.tipo}</span
                >
                <span
                  class="text-xs bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-gray-600 dark:text-gray-300 font-bold"
                  >{alerta.biodigestor}</span
                >
              </div>
              <span
                class="text-xs font-semibold text-gray-400 dark:text-gray-500"
                >{alerta.fecha}</span
              >
            </div>
            <p class="text-gray-600 dark:text-gray-300">{alerta.mensaje}</p>
          </div>

          <!-- Botón de acción rápido -->
          {#if !alerta.leida}
            <button
              class="shrink-0 w-3 h-3 bg-green-500 rounded-full mt-3 shadow-[0_0_8px_rgba(34,197,94,0.6)]"
              title="Marcar como leída"
            ></button>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</div>
