document.addEventListener('DOMContentLoaded', () => {
    const paginas = document.querySelectorAll('.pagina');
    const enlacesNavegacion = document.querySelectorAll('[data-pagina]');
    const burgerBtn = document.getElementById('burger');
    const menuNav = document.getElementById('menu');

    const contenedorPreguntas = document.getElementById('contenedor-preguntas');
    const formTest = document.getElementById('form-test');
    const errorTest = document.getElementById('error-test');
    const cuerpoModalResultado = document.getElementById('cuerpo-modal-resultado');
    const contenedorManual = document.getElementById('contenedor-manual');
    const historialBanner = document.getElementById('historial-banner');
    const formContacto = document.getElementById('form-contacto');
    const alertaContacto = document.getElementById('alerta-contacto');

    const opcionesEscala = [
        { valor: 0, texto: 'Nunca' },
        { valor: 1, texto: 'A veces' },
        { valor: 2, texto: 'A menudo' },
        { valor: 3, texto: 'Casi siempre' }
    ];

    let preguntasCargadas = [];

    function navegarA(paginaTarget) {
        if (!paginaTarget) return;

        paginas.forEach(sec => {
            if (sec.id === paginaTarget) {
                sec.classList.remove('d-none');
            } else {
                sec.classList.add('d-none');
            }
        });

        if (menuNav && menuNav.classList.contains('open')) {
            menuNav.classList.remove('open');
        }

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    enlacesNavegacion.forEach(enlace => {
        enlace.addEventListener('click', (e) => {
            const target = enlace.getAttribute('data-pagina');
            if (!target) return;

            if (enlace.tagName === 'A') {
                e.preventDefault();
            }

            navegarA(target);
        });
    });

    if (burgerBtn && menuNav) {
        burgerBtn.addEventListener('click', () => {
            menuNav.classList.toggle('open');
        });
    }

    function renderizarPreguntas(preguntas) {
        if (!contenedorPreguntas) return;
        contenedorPreguntas.innerHTML = '';

        preguntas.forEach((p, index) => {
            const card = document.createElement('div');
            card.className = 'card mb-3 shadow-sm card-pregunta';

            const radiosHtml = opcionesEscala.map(op => {
                const inputId = `p${p.id}_op${op.valor}`;
                return `
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="pregunta_${p.id}" id="${inputId}" value="${op.valor}">
                        <label class="form-check-label" for="${inputId}">${op.texto}</label>
                    </div>
                `;
            }).join('');

            card.innerHTML = `
                <div class="card-body">
                    <span class="badge bg-light text-success border mb-2">${p.dimension}</span>
                    <p class="fw-semibold mb-3">${index + 1}. ${p.texto}</p>
                    <div class="d-flex flex-wrap gap-3">
                        ${radiosHtml}
                    </div>
                </div>
            `;

            contenedorPreguntas.appendChild(card);
        });
    }

    function renderizarManual(itemsManual) {
        if (!contenedorManual || !Array.isArray(itemsManual)) return;
        contenedorManual.innerHTML = '';

        itemsManual.forEach(item => {
            const col = document.createElement('div');
            col.className = 'col-md-6';
            col.innerHTML = `
                <div class="card h-100 shadow-sm border-light">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start gap-2 mb-2">
                            <h5 class="card-title text-success fw-bold mb-0">${item.titulo}</h5>
                            <span class="badge bg-success-subtle text-success">${item.badge}</span>
                        </div>
                        <p class="small text-muted mb-2">Categoría: ${item.categoria}</p>
                        <p class="card-text text-muted mb-0">${item.descripcion}</p>
                    </div>
                </div>
            `;
            contenedorManual.appendChild(col);
        });
    }

    function mostrarHistorial() {
        if (!historialBanner) return;
        const guardado = localStorage.getItem('ultimoResultadoBurnout');
        if (!guardado) return;

        try {
            const data = JSON.parse(guardado);
            historialBanner.classList.remove('d-none');
            historialBanner.innerHTML = `Último autotest orientativo: <strong>${data.nivel}</strong> (${data.puntaje}/${data.maximo} pts).`;
        } catch (err) {
            localStorage.removeItem('ultimoResultadoBurnout');
        }
    }

    if (formTest) {
        formTest.addEventListener('submit', (e) => {
            e.preventDefault();

            if (!preguntasCargadas.length) return;

            let puntajeTotal = 0;
            let todasRespondidas = true;
            const puntajePorDimension = {};

            preguntasCargadas.forEach(p => {
                const seleccionada = formTest.querySelector(`input[name="pregunta_${p.id}"]:checked`);
                if (!seleccionada) {
                    todasRespondidas = false;
                    return;
                }
                const valor = Number(seleccionada.value);
                puntajeTotal += valor;
                puntajePorDimension[p.dimension] = (puntajePorDimension[p.dimension] || 0) + valor;
            });

            if (!todasRespondidas) {
                if (errorTest) errorTest.classList.remove('d-none');
                return;
            }

            if (errorTest) errorTest.classList.add('d-none');

            const puntajeMaximo = preguntasCargadas.length * 3; // 45 pts máx con 15 preguntas (0 a 3)
            let nivel = '';
            let mensaje = '';
            let badgeClase = '';

            if (puntajeTotal <= 15) {
                nivel = 'Señales leves o cansancio habitual';
                badgeClase = 'bg-success';
                mensaje = 'Tus respuestas sugieren un nivel bajo de indicadores asociados a burnout en las últimas 2 semanas. Mantén tus hábitos de descanso y prevención.';
            } else if (puntajeTotal <= 30) {
                nivel = 'Nivel moderado / Alerta preventiva';
                badgeClase = 'bg-warning text-dark';
                mensaje = 'Se observan señales moderadas que conviene atender a tiempo. Revisar tus pausas, límites digitales y organización puede ayudarte a evitar que aumenten.';
            } else {
                nivel = 'Nivel alto de señales orientativas';
                badgeClase = 'bg-danger';
                mensaje = 'Tus respuestas reflejan una alta frecuencia de síntomas asociados a desgaste y burnout. Te recomendamos revisar el Manual de Cuidado y conversar con apoyo o un profesional.';
            }

            const detalleDimensionesHtml = Object.entries(puntajePorDimension)
                .map(([dim, pts]) => `<li class="list-group-item d-flex justify-content-between px-0"><span>${dim}</span><strong>${pts} pts</strong></li>`)
                .join('');

            if (cuerpoModalResultado) {
                cuerpoModalResultado.innerHTML = `
                    <div class="mb-3">
                        <span class="badge ${badgeClase} mb-2">${nivel}</span>
                        <h4 class="fw-bold mb-1">Puntaje: ${puntajeTotal} / ${puntajeMaximo}</h4>
                        <p class="text-muted mb-0">${mensaje}</p>
                    </div>
                    <ul class="list-group list-group-flush mb-3">
                        ${detalleDimensionesHtml}
                    </ul>
                    <p class="small text-muted mb-0"><strong>Nota orientativa:</strong> Este autotest es educativo y orientativo; no equivale a un diagnóstico clínico.</p>
                `;
            }

            localStorage.setItem('ultimoResultadoBurnout', JSON.stringify({
                nivel,
                puntaje: puntajeTotal,
                maximo: puntajeMaximo
            }));
            mostrarHistorial();

            const modalEl = document.getElementById('modalResultado');
            if (modalEl && window.bootstrap) {
                const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
                modalInstance.show();
            }
        });

        formTest.addEventListener('reset', () => {
            if (errorTest) errorTest.classList.add('d-none');
        });
    }

    if (formContacto) {
        formContacto.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!formContacto.checkValidity()) {
                formContacto.classList.add('was-validated');
                return;
            }
            formContacto.classList.remove('was-validated');
            formContacto.reset();
            if (alertaContacto) alertaContacto.classList.remove('d-none');
        });
    }

    fetch('datos.json')
        .then(res => {
            if (!res.ok) throw new Error('No se pudo cargar datos.json');
            return res.json();
        })
        .then(data => {
            preguntasCargadas = Array.isArray(data.preguntasTest) ? data.preguntasTest : [];
            renderizarPreguntas(preguntasCargadas);
            renderizarManual(data.manualCuidado);
        })
        .catch(err => {
            console.error(err);
            if (contenedorPreguntas) {
                contenedorPreguntas.innerHTML = '<div class="alert alert-warning">No se pudieron cargar las preguntas desde <code>datos.json</code>. Si abres el archivo directo desde el disco, usa un servidor local (como Live Server).</div>';
            }
        });

    mostrarHistorial();
});
