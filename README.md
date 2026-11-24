# Mental Health Burnout · Facultad de Psicología UdeC

Plataforma web informativa, preventiva y de autoevaluación orientativa sobre el Síndrome de Burnout académico y laboral, desarrollada para la comunidad de la Facultad de Psicología de la Universidad de Concepción (~1.200 estudiantes, además de docentes y personal administrativo).

## Sitio Web Publicado
* **URL de producción (GitHub Pages):** https://gabrielzapata-maker.github.io/BurnoutIPVG/

## Funcionalidades Principales 
* **Inicio:** Presentación del proyecto, acceso directo al autotest y contexto institucional.
* **¿Qué es?:** Diferenciación clara entre estrés cotidiano y síndrome de burnout, síntomas principales y enlaces a fuentes científicas confiables (OMS, APA, MINSAL).
* **Autotest Orientativo:** Formulario dinámico de 15 preguntas cargado desde `datos.json` mediante `fetch`, con validación visual en tiempo real (bordes en rojo ante respuestas faltantes), cálculo de nivel de riesgo (bajo, moderado o alto) y almacenamiento local privado (`localStorage`) únicamente del nivel obtenido.
* **Manual de Cuidado:** Estrategias prácticas de prevención, higiene del sueño y gestión de carga académica.
* **Directorio de Recursos de Ayuda:** Listado de 5 redes de apoyo institucionales y nacionales (DISE UdeC, Salud Mental UdeC, Línea *4141 MINSAL) cargado con `fetch` y filtrable por categoría.
* **Sobre el Proyecto:** Alcance académico, enfoque ético de privacidad (sin almacenamiento de respuestas individuales ni datos personales) y equipo de trabajo.

## Tecnologías Utilizadas
* **HTML5:** Estructura semántica accesible con atributos `aria-*`, etiquetas `<label>` vinculadas y textos alternativos.
* **CSS3 y Bootstrap 5:** Diseño responsivo (*mobile-first* y escritorio) con paleta institucional de alto contraste y tipografías Google Fonts (`Inter` y `Nunito`).
* **JavaScript (ES6+):** Consumo asíncrono de datos con `fetch`, manipulación del DOM, validación de formularios, filtrado dinámico y persistencia con `localStorage`.
* **JSON (`datos.json`):** Base de datos local estructurada con los ítems del instrumento y los recursos de orientación.

## Cómo Ejecutar el Proyecto Localmente
Debido a que el sitio carga `datos.json` mediante la API `fetch()`, requiere ejecutarse a través de un servidor HTTP local (abrir `index.html` directamente con doble clic mediante `file://` bloqueará la carga por políticas CORS del navegador):

1. Descarga el proyecto haciendo clic en el botón verde **Code > Download ZIP** (o clónalo con `git clone https://github.com/gabrielzapata-maker/BurnoutIPVG.git`).
2. Abre la carpeta del proyecto en **Visual Studio Code**.
3. Instala la extensión **Live Server** (de Ritwick Dey) si aún no la tienes.
4. Haz clic derecho sobre `index.html` y selecciona **Open with Live Server** (o presiona **Go Live** en la barra inferior derecha).

## Equipo de Trabajo y Roles
* **Gabriel Zapata** — Jefe de Proyecto (JP) / Coordinador y Lógica JavaScript (`funciones.js`, `datos.json`, `localStorage`, gestión de repositorio y PRs).
* **Matías Bravo** — Desarrollador Front-End y Accesibilidad (`index.html`, `estilos.css`, diseño responsivo con Bootstrap y cumplimiento de accesibilidad).
* **David Troncoso** — Product Owner y Documentación (levantamiento de requisitos ERS, validación funcional, contenido preventivo y `README.md`).

---
*Asignatura: Interfaz de Usuario · Ingeniería en Informática · Instituto Profesional Virginio Gómez / UdeC.*
