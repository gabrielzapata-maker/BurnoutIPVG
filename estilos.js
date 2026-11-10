document.addEventListener('DOMContentLoaded', () => {

    const paginas = document.querySelectorAll('.pagina');
    const enlacesNavegacion = document.querySelectorAll('[data-pagina]');
    const burgerBtn = document.getElementById('burger');
    const menuNav = document.getElementById('menu');

    function navegarA(paginaTarget) {

        paginas.forEach(sec => {

            if (sec.id === paginaTarget) {
                sec.classList.remove('d-none');
            } else {
                sec.classList.add('d-none');
            }

        });

        if (menuNav.classList.contains('open')) {
            menuNav.classList.remove('open');
        }

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

    }

    enlacesNavegacion.forEach(enlace => {

        enlace.addEventListener('click', (e) => {

            e.preventDefault();

            const target = enlace.getAttribute('data-pagina');

            navegarA(target);

        });

    });

    burgerBtn.addEventListener('click', () => {

        menuNav.classList.toggle('open');

    });

});
