document.addEventListener('DOMContentLoaded', function() {
    const llibretaElement = document.querySelector('.llibreta');
    
    const pageFlip = new St.PageFlip(llibretaElement, {
        width: 400,      // Mida base de proporció
        height: 500,     // Mida base de proporció
        size: "stretch", // AIXÒ ÉS VITAL: Fa que agafi l'amplada i altura del teu CSS (els 65vh i 85vh)
        minWidth: 300,
        maxWidth: 1000,
        minHeight: 400,
        maxHeight: 1200,
        showCover: true, 
        mobileScrollSupport: false,
        usePortrait: true // AIXÒ ÉS VITAL: Força que es vegi com 1 sola pàgina de llibreta
    });

    pageFlip.loadFromHTML(document.querySelectorAll('.pagina'));

    // Seleccionem els botons
    const botons = document.querySelectorAll('.tab');

    // Funció per passar la pàgina amb animació
    function animarAPagina(num) {
        // Comprovem que la llibreta està quieta abans de girar
        if (pageFlip.getState() === 'read') {
            pageFlip.flip(num); // "flip" fa l'animació
        }
    }

    // Assignant l'animació a cada botó
botons[0].onclick = () => animarAPagina(0); // Portada
    botons[1].onclick = () => animarAPagina(1); // Monomonitos
    botons[2].onclick = () => animarAPagina(3); // Portfoli
    botons[3].onclick = () => animarAPagina(4); // CV
});

// --- LÒGICA DE LA BOTIGA ---
    const productes = document.querySelectorAll('.enganxina');
    const fonsPopup = document.getElementById('fons-popup');
    const botoTancar = document.getElementById('tancar-popup');
    
    // Elements del popup a actualitzar
    const imgPopup = document.getElementById('popup-img');
    const titolPopup = document.getElementById('popup-titol');
    const preuPopup = document.getElementById('popup-preu');

   // Obrir popup en clicar un producte
    productes.forEach(producte => {
    producte.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Omplim el popup amb les dades de l'enganxina
        imgPopup.src = producte.src;
        titolPopup.textContent = producte.getAttribute('data-nom');
        preuPopup.textContent = producte.getAttribute('data-preu') + " €";
        
        // Configurem el botó de compra amb l'enllaç de Stripe
        const enllaçStripe = producte.getAttribute('data-stripe');
        document.getElementById('boto-stripe').href = enllaçStripe;
        
        fonsPopup.classList.remove('ocult');
    });
});

    // Tancar popup amb la X
    botoTancar.addEventListener('click', () => {
        fonsPopup.classList.add('ocult');
    });

    // Tancar popup clicant fora de la finestra blanca
    fonsPopup.addEventListener('click', (e) => {
        if (e.target === fonsPopup) {
            fonsPopup.classList.add('ocult');
        }
    });

    // Evitar que el formulari recarregui la pàgina en provar-ho
    document.getElementById('form-compra').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('En un futur, això connectarà amb PayPal per cobrar!');
    });