<!-- eslint-disable -->
<script lang="ts">
  // @ts-nocheck
  import "../../app.css";

  type FormStatus = "idle" | "error" | "success";

  const photos = {
    kit: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    hero: "https://images.pexels.com/photos/32738814/pexels-photo-32738814.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1600",
    soil: "https://images.pexels.com/photos/31110992/pexels-photo-31110992.jpeg?auto=compress&cs=tinysrgb&h=900&w=1200",
    community:
      "https://images.pexels.com/photos/36869075/pexels-photo-36869075.jpeg?auto=compress&cs=tinysrgb&h=900&w=1200",
    research:
      "https://images.pexels.com/photos/5622487/pexels-photo-5622487.jpeg?auto=compress&cs=tinysrgb&h=900&w=1200",
  };

  const navItems = [
    { label: "Solución", target: "#solucion" },
    { label: "Cómo funciona", target: "#como-funciona" },
    { label: "El kit", target: "#kit" },
    { label: "Impacto", target: "#impacto" },
    { label: "Preguntas", target: "#faq" },
  ];

  const processSteps = [
    {
      number: "01",
      title: "Biodigestor",
      text: "El proceso biológico ocurre en un sistema cuya operación necesita observación contextual.",
    },
    {
      number: "02",
      title: "Sensores",
      text: "Recogen señales del lugar donde se instalan para construir una lectura ordenada.",
    },
    {
      number: "03",
      title: "ESP32",
      text: "El módulo recibe las señales y las prepara para una consulta local o sincronizada.",
    },
    {
      number: "04",
      title: "Registro",
      text: "Los datos se conservan con fecha para comparar cambios y documentar el proceso.",
    },
    {
      number: "05",
      title: "Aplicación",
      text: "BIOCORE presenta el estado, el historial y las alertas de forma comprensible.",
    },
  ];

  const audiences = [
    {
      title: "Comunidades rurales",
      text: "Registros compartidos y una lectura más clara para acompañar el uso cotidiano del biodigestor.",
      image: photos.community,
      alt: "Campo agrícola verde",
    },
    {
      title: "Productores",
      text: "Seguimiento del proceso y señales de revisión para tomar decisiones con más contexto.",
      image: photos.soil,
      alt: "Material orgánico para uso agrícola",
    },
    {
      title: "Instituciones y universidades",
      text: "Datos ordenados para prácticas, ensayos y proyectos de investigación reproducibles.",
      image: photos.research,
      alt: "Investigadora usando una tableta",
    },
  ];

  const faqs = [
    {
      question: "¿Qué incluye BIOCORE?",
      answer:
        "La propuesta reúne un módulo de monitoreo con ESP32, sensores definidos según la instalación y acceso a una aplicación para consultar registros.",
    },
    {
      question: "¿Necesito internet para usarlo?",
      answer:
        "La próxima versión contempla una consulta local cerca del equipo y una modalidad conectada para sincronizar datos. El Wi-Fi local del ESP32 no da acceso a la nube por sí solo.",
    },
    {
      question: "¿Sirve para cualquier biodigestor?",
      answer:
        "No existe una configuración universal. El tipo, el tamaño, la ubicación y las condiciones definen qué sensores y montaje son adecuados.",
    },
    {
      question: "¿Mide cuántos litros de biogás se producen?",
      answer:
        "No. El MVP no mide volumen de gas. El MQ-2 entrega una señal relativa ante gases combustibles y el SHT31 observa temperatura y humedad.",
    },
    {
      question: "¿Cómo solicito un piloto?",
      answer:
        "Completa el formulario con la información de tu organización, ubicación y biodigestor. Revisaremos el caso para conversar.",
    },
  ];

  let menuOpen = $state(false);
  let openFaq = $state(-1);
  let formStatus: FormStatus = $state("idle");
  let formMessage = $state("");
  let formData = $state({
    name: "",
    email: "",
    phone: "",
    organization: "",
    location: "",
    digester: "",
    need: "",
    consent: false,
  });

  function scrollToTarget(target: string) {
    document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
    menuOpen = false;
  }

  function handleNavigate(url: string) {
    window.location.href = url;
  }

  function handleSubmit(event: Event) {
    event.preventDefault();
    if (!formData.consent) {
      formStatus = "error";
      formMessage = "Necesitamos tu consentimiento para poder contactarte.";
      return;
    }
    formStatus = "success";
    formMessage =
      "Recibimos tu solicitud. El equipo de BIOCORE se pondrá en contacto contigo para conocer mejor el caso.";
  }
</script>

<svelte:head>
  <title>BIOCORE | Monitoreo para biodigestores rurales</title>
  <meta
    name="description"
    content="BIOCORE reúne sensores y una aplicación para consultar el estado del proceso en biodigestores rurales."
  />
</svelte:head>

<div
  class="min-h-screen bg-[#0a0a0a] text-gray-300 font-sans selection:bg-lime-400 selection:text-black overflow-x-hidden"
>
  <header
    class="fixed w-full top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10"
  >
    <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
      <button
        onclick={() => handleNavigate("/")}
        class="flex items-center gap-2 focus:outline-none"
      >
        <div
          class="bg-emerald-500 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20"
        >
          <svg
            class="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            stroke-width="2.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            ></path>
          </svg>
        </div>
        <span class="text-2xl font-black text-cyan-400 tracking-wide"
          >BioCore</span
        >
      </button>

      <button
        class="lg:hidden text-white focus:outline-none"
        aria-label="Abrir menú"
        onclick={() => (menuOpen = !menuOpen)}
      >
        <svg
          class="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
          ></path></svg
        >
      </button>

      <nav
        class="{menuOpen
          ? 'flex'
          : 'hidden'} absolute lg:relative top-full left-0 w-full lg:w-auto bg-black lg:bg-transparent flex-col lg:flex-row items-center gap-6 lg:flex py-6 lg:py-0 border-b lg:border-none border-white/10"
      >
        {#each navItems as item (item.label)}
          <button
            type="button"
            onclick={() => scrollToTarget(item.target)}
            class="text-xs font-bold uppercase tracking-widest hover:text-lime-400 transition-colors focus:outline-none"
            >{item.label}</button
          >
        {/each}
        <div class="flex flex-col lg:flex-row items-center gap-4 mt-4 lg:mt-0">
          <button
            class="text-xs font-bold uppercase tracking-widest hover:text-lime-400 transition-colors focus:outline-none"
            onclick={() => handleNavigate("/login")}>Iniciar sesión</button
          >
          <button
            class="bg-lime-400 text-black px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-lime-500 transition-colors focus:outline-none"
            onclick={() => scrollToTarget("#solicitar")}
            >Solicitar BIOCORE</button
          >
        </div>
      </nav>
    </div>
  </header>

  <main class="pt-24 pb-20">
    <section class="max-w-5xl mx-auto px-6 pt-16 pb-20 text-center">
      <div
        class="inline-flex items-center gap-2 text-lime-400 text-xs font-bold tracking-[0.25em] uppercase mb-8"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-lime-400"></span> Del prototipo a
        una solución rural
      </div>
      <h1
        class="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[1.05] mb-8"
      >
        Comprende lo que ocurre <br class="hidden md:block" />
        <em
          class="text-lime-400 not-italic drop-shadow-[0_0_15px_rgba(163,230,53,0.3)]"
          >dentro de tu biodigestor</em
        >
      </h1>
      <p
        class="max-w-2xl mx-auto text-lg text-gray-400 font-light mb-10 leading-relaxed"
      >
        BIOCORE reúne sensores y una aplicación para consultar el estado del
        proceso, conservar registros y preparar mejores decisiones en campo.
      </p>
      <div
        class="flex flex-col sm:flex-row justify-center items-center gap-6 mb-16"
      >
        <button
          class="w-full sm:w-auto bg-lime-400 text-black px-10 py-4 rounded-full text-sm font-black uppercase tracking-widest hover:bg-lime-500 hover:scale-105 transition-all shadow-[0_0_20px_rgba(163,230,53,0.2)] focus:outline-none"
          onclick={() => scrollToTarget("#solicitar")}>Solicitar BIOCORE</button
        >
        <button
          type="button"
          class="text-sm font-bold text-white uppercase tracking-widest hover:text-lime-400 transition-colors focus:outline-none"
          onclick={() => scrollToTarget("#como-funciona")}
          >Conocer cómo funciona</button
        >
      </div>
      <div
        class="relative w-full aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
      >
        <div class="absolute inset-0 bg-black/40 z-10"></div>
        <img
          src={photos.hero}
          alt="Biodigestor rural"
          class="w-full h-full object-cover"
        />
        <div
          class="absolute bottom-6 left-6 z-20 bg-black/80 backdrop-blur border border-white/10 p-4 rounded-xl text-left"
        >
          <strong class="text-lime-400 text-2xl font-black block">01</strong>
          <span class="text-xs uppercase tracking-widest font-bold text-white"
            >Monitoreo Rural</span
          >
        </div>
      </div>
    </section>

    <section class="border-y border-white/5 bg-neutral-950/50 py-20">
      <div
        class="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center"
      >
        <div>
          <span
            class="text-lime-400 text-xs font-bold tracking-widest uppercase mb-4 block"
            >Origen Académico</span
          >
          <h2 class="text-3xl md:text-4xl font-black text-white mb-6">
            Innovación desde la UNEG para un campo más sostenible
          </h2>
          <p class="text-gray-400 mb-8 leading-relaxed">
            BIOCORE nació como un trabajo de investigación de Ingeniería
            Informática en la Universidad Nacional Experimental de Guayana.
            Integra tecnología, aprovechamiento responsable de residuos
            orgánicos y una propuesta de monitoreo pensada para contextos
            rurales.
          </p>

          <div
            class="flex items-center gap-5 bg-black/50 p-5 rounded-2xl border border-white/5"
          >
            <div
              class="bg-blue-900/30 p-3 rounded-xl border border-blue-500/30 flex items-center justify-center"
            >
              <svg
                class="w-8 h-8 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 14l9-5-9-5-9 5 9 5z"
                ></path>
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                ></path>
              </svg>
            </div>
            <div>
              <span
                class="text-xs text-gray-500 uppercase tracking-widest block mb-1"
                >Autores</span
              >
              <strong class="text-white">Yrene Corrales · Bryan Salazar</strong>
            </div>
          </div>
        </div>
        <div
          class="relative h-[400px] rounded-3xl overflow-hidden border border-white/10"
        >
          <img
            src={photos.community}
            alt="Comunidad rural"
            class="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>

    <section id="solucion" class="max-w-7xl mx-auto px-6 py-24">
      <div class="mb-16 max-w-3xl">
        <span
          class="text-lime-400 text-xs font-bold tracking-widest uppercase mb-4 block"
          >El punto de partida</span
        >
        <h2 class="text-4xl font-black text-white mb-6">
          Cuando el proceso no deja registro, cada decisión empieza de nuevo.
        </h2>
        <p class="text-gray-400 text-lg">
          Muchos biodigestores artesanales se operan mediante observación
          ocasional. Sin una bitácora continua, es difícil relacionar lo que se
          ve hoy con lo que ocurrió antes.
        </p>
      </div>
      <div class="grid md:grid-cols-3 gap-6">
        <div
          class="bg-neutral-900 border border-white/5 p-8 rounded-3xl hover:border-lime-400/30 transition-colors"
        >
          <strong class="text-lime-400 text-xl font-black block mb-4">01</strong
          >
          <h3 class="text-white font-bold text-lg mb-3">
            Condiciones difíciles de interpretar
          </h3>
          <p class="text-gray-400 text-sm">
            Temperatura, humedad y señales ante gases combustibles pueden
            cambiar según el entorno y la etapa del proceso.
          </p>
        </div>
        <div
          class="bg-neutral-900 border border-white/5 p-8 rounded-3xl hover:border-lime-400/30 transition-colors"
        >
          <strong class="text-lime-400 text-xl font-black block mb-4">02</strong
          >
          <h3 class="text-white font-bold text-lg mb-3">
            Sin una línea de tiempo
          </h3>
          <p class="text-gray-400 text-sm">
            La disponibilidad de gas y las situaciones que requieren revisión
            quedan sujetas a impresiones aisladas.
          </p>
        </div>
        <div class="bg-neutral-800 border border-white/10 p-8 rounded-3xl">
          <strong class="text-lime-400 text-xl font-black block mb-4">03</strong
          >
          <h3 class="text-white font-bold text-lg mb-3">
            Observar para aprender
          </h3>
          <p class="text-gray-300 text-sm">
            BIOCORE propone convertir observaciones de campo en una historia
            consultable, sin prometer más de lo que los sensores pueden validar.
          </p>
        </div>
      </div>
    </section>

    <section id="como-funciona" class="bg-black py-24 border-y border-white/5">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <span
            class="text-lime-400 text-xs font-bold tracking-widest uppercase mb-4 block"
            >El sistema</span
          >
          <h2 class="text-4xl font-black text-white mb-6">
            Una cadena simple para hacer visible el proceso.
          </h2>
          <p class="text-gray-400">
            Desde el biodigestor hasta la aplicación, cada etapa tiene un papel
            concreto.
          </p>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {#each processSteps as step (step.number)}
            <div
              class="bg-neutral-900 border border-white/5 p-6 rounded-2xl relative"
            >
              <span class="text-lime-400 font-mono text-sm mb-4 block"
                >{step.number}</span
              >
              <h3 class="text-white font-bold mb-2">{step.title}</h3>
              <p class="text-gray-400 text-sm leading-relaxed">{step.text}</p>
            </div>
          {/each}
        </div>
      </div>
    </section>

    <section id="kit" class="bg-neutral-950/50 border-b border-white/5 py-24">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <span
            class="text-lime-400 text-xs font-bold tracking-widest uppercase mb-4 block"
            >La próxima pieza</span
          >
          <h2 class="text-4xl font-black text-white mb-6">
            BIOCORE: tecnología preparada para llegar al campo
          </h2>
          <p class="text-gray-400">
            Una propuesta de integración con módulo ESP32, sensores definidos
            según la instalación, alimentación y carcasa protectora.
          </p>
        </div>

        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div
            class="relative bg-neutral-900 p-8 rounded-3xl border border-white/5 flex justify-center items-center h-[400px] overflow-hidden"
          >
            <span
              class="absolute top-6 left-6 text-xs text-lime-400 font-mono bg-lime-400/10 px-3 py-1 rounded-full z-20"
              >Diseño Conceptual</span
            >
            <img
              src={photos.kit}
              alt="Kit BIOCORE Sensores"
              class="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"
            ></div>
          </div>
          <div class="grid sm:grid-cols-2 gap-6">
            <div class="bg-black/50 p-6 rounded-2xl border border-white/5">
              <strong class="text-lime-400 text-lg block mb-2"
                >01. Caja protectora</strong
              >
              <p class="text-gray-400 text-sm">
                Módulo central pensado para resguardar la electrónica en el
                entorno de trabajo.
              </p>
            </div>
            <div class="bg-black/50 p-6 rounded-2xl border border-white/5">
              <strong class="text-lime-400 text-lg block mb-2"
                >02. ESP32 integrado</strong
              >
              <p class="text-gray-400 text-sm">
                Recibe señales, habilita una consulta cercana y prepara la
                sincronización.
              </p>
            </div>
            <div class="bg-black/50 p-6 rounded-2xl border border-white/5">
              <strong class="text-lime-400 text-lg block mb-2"
                >03. Sensores externos</strong
              >
              <p class="text-gray-400 text-sm">
                Conexiones ordenadas para ajustar la instrumentación a cada
                biodigestor.
              </p>
            </div>
            <div class="bg-black/50 p-6 rounded-2xl border border-white/5">
              <strong class="text-lime-400 text-lg block mb-2"
                >04. Alimentación</strong
              >
              <p class="text-gray-400 text-sm">
                El esquema de energía se define según el lugar de instalación.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="impacto" class="py-24 max-w-7xl mx-auto px-6">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <span
          class="text-lime-400 text-xs font-bold tracking-widest uppercase mb-4 block"
          >Un mismo lenguaje de datos</span
        >
        <h2 class="text-4xl font-black text-white mb-6">
          Tecnología que se adapta a quienes sostienen el proceso.
        </h2>
      </div>
      <div class="grid md:grid-cols-3 gap-8">
        {#each audiences as audience, index (audience.title)}
          <div
            class="bg-neutral-900 border border-white/5 rounded-3xl overflow-hidden group"
          >
            <div class="h-48 overflow-hidden relative">
              <img
                src={audience.image}
                alt={audience.alt}
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span
                class="absolute top-4 left-4 bg-black/80 text-lime-400 text-xs font-bold px-3 py-1 rounded-full border border-white/10"
                >0{index + 1}</span
              >
            </div>
            <div class="p-8">
              <h3 class="text-white font-bold text-lg mb-3">
                {audience.title}
              </h3>
              <p class="text-gray-400 text-sm mb-6">{audience.text}</p>
              <button
                type="button"
                class="text-lime-400 text-sm font-bold uppercase tracking-widest hover:text-white transition-colors focus:outline-none"
                onclick={() => scrollToTarget("#solicitar")}
                >Conocer la propuesta</button
              >
            </div>
          </div>
        {/each}
      </div>
    </section>

    <section
      id="solicitar"
      class="max-w-4xl mx-auto px-6 py-24 border-t border-white/5"
    >
      <div class="text-center mb-12">
        <span
          class="text-lime-400 text-xs font-bold tracking-widest uppercase mb-4 block"
          >Abramos la conversación</span
        >
        <h2 class="text-4xl font-black text-white mb-4">
          Cuéntanos qué quieres observar.
        </h2>
        <p class="text-gray-400">
          Cuanto más contexto tengamos, mejor podremos entender si BIOCORE puede
          acompañar tu instalación o proyecto.
        </p>
        <div class="mt-6 flex flex-col items-center justify-center text-sm">
          <span class="text-gray-500 mb-2">Contacto directo:</span>
          <button
            type="button"
            onclick={() => handleNavigate("mailto:hola@biocore.org")}
            class="text-lime-400 hover:text-white transition-colors focus:outline-none"
            >hola@biocore.org</button
          >
        </div>
      </div>

      <form
        onsubmit={handleSubmit}
        class="bg-neutral-900 border border-white/10 p-8 rounded-3xl space-y-6"
      >
        <div class="grid md:grid-cols-2 gap-6">
          <label class="block">
            <span class="text-sm font-bold text-white mb-2 block"
              >Nombre completo</span
            >
            <input
              bind:value={formData.name}
              required
              type="text"
              class="w-full bg-black border border-neutral-700 rounded-lg p-3 text-white focus:border-lime-400 focus:outline-none transition-colors"
              placeholder="Tu nombre"
            />
          </label>
          <label class="block">
            <span class="text-sm font-bold text-white mb-2 block"
              >Correo electrónico</span
            >
            <input
              bind:value={formData.email}
              required
              type="email"
              class="w-full bg-black border border-neutral-700 rounded-lg p-3 text-white focus:border-lime-400 focus:outline-none transition-colors"
              placeholder="tu@correo.com"
            />
          </label>
        </div>
        <div class="grid md:grid-cols-2 gap-6">
          <label class="block">
            <span class="text-sm font-bold text-white mb-2 block"
              >Organización o comunidad</span
            >
            <input
              bind:value={formData.organization}
              required
              type="text"
              class="w-full bg-black border border-neutral-700 rounded-lg p-3 text-white focus:border-lime-400 focus:outline-none transition-colors"
              placeholder="Nombre"
            />
          </label>
          <label class="block">
            <span class="text-sm font-bold text-white mb-2 block"
              >Tipo y tamaño aproximado</span
            >
            <select
              bind:value={formData.digester}
              required
              class="w-full bg-black border border-neutral-700 rounded-lg p-3 text-white focus:border-lime-400 focus:outline-none transition-colors"
            >
              <option value="" disabled>Selecciona una opción</option>
              <option>Artesanal · hasta 50 L</option>
              <option>Experimental · 50 a 200 L</option>
              <option>Rural · 200 a 500 L</option>
              <option>Otro tamaño o tipo</option>
            </select>
          </label>
        </div>
        <label class="block">
          <span class="text-sm font-bold text-white mb-2 block"
            >Cuéntanos tu necesidad</span
          >
          <textarea
            bind:value={formData.need}
            required
            rows="4"
            class="w-full bg-black border border-neutral-700 rounded-lg p-3 text-white focus:border-lime-400 focus:outline-none transition-colors"
            placeholder="¿Qué te gustaría monitorear o aprender?"
          ></textarea>
        </label>
        <label class="flex items-start gap-3 cursor-pointer">
          <input
            bind:checked={formData.consent}
            type="checkbox"
            class="mt-1 w-5 h-5 accent-lime-400 bg-black border-neutral-700 rounded"
          />
          <span class="text-sm text-gray-400"
            >Acepto que BIOCORE use estos datos para contactarme sobre una
            posible evaluación o piloto.</span
          >
        </label>

        <button
          type="submit"
          class="w-full bg-lime-400 text-black font-bold uppercase tracking-widest py-4 rounded-xl hover:bg-lime-500 transition-colors"
          >Enviar Solicitud</button
        >

        {#if formStatus === "error"}
          <p
            class="text-red-400 text-sm text-center bg-red-950/50 py-3 rounded-lg border border-red-900/50"
          >
            {formMessage}
          </p>
        {:else if formStatus === "success"}
          <p
            class="text-lime-400 text-sm text-center bg-lime-950/50 py-3 rounded-lg border border-lime-900/50"
          >
            {formMessage}
          </p>
        {/if}
      </form>
    </section>

    <section id="faq" class="max-w-3xl mx-auto px-6 py-12">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-black text-white mb-4">
          Preguntas Frecuentes
        </h2>
      </div>
      <div class="space-y-4">
        {#each faqs as faq, index (faq.question)}
          <div
            class="bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden"
          >
            <button
              class="w-full px-6 py-5 text-left flex justify-between items-center text-white font-bold hover:text-lime-400 transition-colors"
              onclick={() => (openFaq = openFaq === index ? -1 : index)}
            >
              <span>{faq.question}</span>
              <span class="text-lime-400 text-xl"
                >{openFaq === index ? "−" : "+"}</span
              >
            </button>
            {#if openFaq === index}
              <div
                class="px-6 pb-5 text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-4"
              >
                {faq.answer}
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </section>
  </main>

  <footer class="bg-black border-t border-white/10 pt-16 pb-8">
    <div class="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 mb-12">
      <div class="md:col-span-2">
        <button
          type="button"
          onclick={() => handleNavigate("/")}
          class="flex items-center gap-2 mb-4 focus:outline-none text-left"
        >
          <div
            class="bg-emerald-500 w-8 h-8 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20"
          >
            <svg
              class="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              stroke-width="2.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              ></path>
            </svg>
          </div>
          <span class="text-xl font-black text-cyan-400 tracking-wide"
            >BioCore</span
          >
        </button>
        <p class="text-gray-500 text-sm max-w-sm text-left">
          Tecnología desarrollada en la UNEG para investigar y mejorar el
          aprovechamiento de residuos orgánicos en el estado Bolívar.
        </p>
      </div>
      <div>
        <strong class="text-white font-bold mb-4 block">Navegación</strong>
        <div class="flex flex-col gap-3 text-sm text-gray-400 items-start">
          <button
            type="button"
            onclick={() => scrollToTarget("#solucion")}
            class="hover:text-lime-400 transition-colors focus:outline-none"
            >Solución</button
          >
          <button
            type="button"
            onclick={() => scrollToTarget("#kit")}
            class="hover:text-lime-400 transition-colors focus:outline-none"
            >El Kit</button
          >
          <button
            type="button"
            onclick={() => scrollToTarget("#faq")}
            class="hover:text-lime-400 transition-colors focus:outline-none"
            >Preguntas Frecuentes</button
          >
        </div>
      </div>
      <div>
        <strong class="text-white font-bold mb-4 block">Acceso</strong>
        <div class="flex flex-col gap-3 text-sm text-gray-400 items-start">
          <button
            onclick={() => handleNavigate("/login")}
            class="text-left hover:text-lime-400 transition-colors focus:outline-none"
            >Iniciar sesión al sistema</button
          >
          <button
            onclick={() => scrollToTarget("#solicitar")}
            class="text-left text-lime-400 hover:text-white transition-colors focus:outline-none"
            >Solicitar Piloto</button
          >
          <button
            type="button"
            onclick={() => handleNavigate("mailto:hola@biocore.org")}
            class="hover:text-lime-400 transition-colors mt-2 focus:outline-none"
            >hola@biocore.org</button
          >
        </div>
      </div>
    </div>
    <div
      class="max-w-7xl mx-auto px-6 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600"
    >
      <span>© 2026 BIOCORE IoT. Todos los derechos reservados.</span>
      <span class="mt-2 md:mt-0"
        >Proyecto de Grado - Ingeniería en Informática</span
      >
    </div>
  </footer>
</div>
