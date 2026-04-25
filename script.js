document.addEventListener('DOMContentLoaded', function() {
    // --- 1. INICIALITZACIÓ DE LA LLIBRETA ---
    const llibretaElement = document.querySelector('.llibreta');
    
    const pageFlip = new St.PageFlip(llibretaElement, {
        width: 400,
        height: 550,
        size: "stretch",
        mode: 'portrait',       
        clickEventForward: false, 
        usePortrait: true,      
        startPage: 0,
        minWidth: 300,
        maxWidth: 800, 
        minHeight: 400,
        maxHeight: 1200,
        showCover: false, 
        mobileScrollSupport: true,
        useMouseEvents: false
    });

    pageFlip.loadFromHTML(document.querySelectorAll('.pagina'));

    // --- 2. LÒGICA DELS MARCAPÀGINES (TABS) ---
    const botons = document.querySelectorAll('.tab');

    function animarAPagina(num) {
        if (pageFlip.getState() === 'read') {
            pageFlip.flip(num); 
        }
    }

    botons[0].onclick = () => animarAPagina(0); // Portada
    botons[1].onclick = () => animarAPagina(1); // Monomonitos
    botons[2].onclick = () => animarAPagina(3); // Portfoli
    botons[3].onclick = () => animarAPagina(4); // CV


    // --- 3. LÒGICA DE LES FLETXES I EL PEU DE PÀGINA ---
    const infoPagines = {
        0: { text: "Portada", classe: "seccio-portada" },
        1: { text: "Monomonitos Shop", classe: "seccio-shop" },
        2: { text: "Monomonitos Shop 2", classe: "seccio-shop" },
        3: { text: "Portfolio", classe: "seccio-portfolio" },
        4: { text: "CV", classe: "seccio-cv" }
    };

    function actualitzarPeu(numPagina) {
        const peu = document.getElementById('peu-dinamic');
        const etiqueta = document.getElementById('etiqueta-pagina');
        
        // Si la pàgina no existeix al diccionari, usem la portada per defecte
        const info = infoPagines[numPagina] || infoPagines[0];
        
        etiqueta.textContent = info.text;
        peu.className = "peu-navegacio " + info.classe;

        // Gestió de visibilitat de fletxes
        document.getElementById('btn-ant').style.visibility = (numPagina === 0) ? "hidden" : "visible";
        document.getElementById('btn-seg').style.visibility = (numPagina === 4) ? "hidden" : "visible"; // ATENCIÓ: canviat a 4 per l'última pàgina
    }

    // Controls de les fletxes
    document.getElementById('btn-ant').addEventListener('click', () => {
        pageFlip.flipPrev();
    });

    document.getElementById('btn-seg').addEventListener('click', () => {
        pageFlip.flipNext();
    });

    // Escoltador d'esdeveniments de la llibreta (canvi de pàgina)
    pageFlip.on('flip', (e) => {
        actualitzarPeu(e.data);
    });

    // Inicialització visual del peu de pàgina
    actualitzarPeu(0);


    // --- 4. LÒGICA DE LA BOTIGA (POPUP I ENGANXINES) ---
    const productes = document.querySelectorAll('.enganxina');
    const fonsPopup = document.getElementById('fons-popup');
    const botoTancar = document.getElementById('tancar-popup');
    
    const imgPopup = document.getElementById('popup-img');
    const titolPopup = document.getElementById('popup-titol');
    const preuPopup = document.getElementById('popup-preu');

    productes.forEach(producte => {
        ['click', 'touchend'].forEach(evt => 
            producte.addEventListener(evt, (e) => {
                e.preventDefault(); 
                
                imgPopup.src = producte.src;
                titolPopup.textContent = producte.getAttribute('data-nom');
                preuPopup.textContent = producte.getAttribute('data-preu') + " €";
                
                const enllaçStripe = producte.getAttribute('data-stripe');
                document.getElementById('boto-stripe').href = enllaçStripe;
                
                fonsPopup.classList.remove('ocult');
            })
        );
    });

    botoTancar.addEventListener('click', () => {
        fonsPopup.classList.add('ocult');
    });

    fonsPopup.addEventListener('click', (e) => {
        if (e.target === fonsPopup) {
            fonsPopup.classList.add('ocult');
        }
    });

    // Forçar que l'scroll funcioni al mòbil dins del contingut
    document.querySelectorAll('.page-content').forEach(content => {
        content.addEventListener('touchmove', (e) => {
            e.stopPropagation(); 
        }, { passive: true });
    });
});