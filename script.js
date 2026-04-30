document.addEventListener('DOMContentLoaded', function() {
    // --- 1. INICIALITZACIÓ DE LA LLIBRETA ---
    const llibretaElement = document.querySelector('.llibreta');
    
    const pageFlip = new St.PageFlip(llibretaElement, {
    width: 400,
    height: 550,
    size: "fixed",           // <-- Canvi important: d'stretch a fixed
    mode: 'portrait',       
    clickEventForward: false, 
    usePortrait: true,      
    startPage: 0,
    showCover: false, 
    mobileScrollSupport: true,
    useMouseEvents: false
    // ELIMINA minWidth, maxWidth, minHeight i maxHeight. Ja no els necessitem!
});
function ajustarEscalaEscriptori() {
        const escriptori = document.querySelector('.escriptori');
        if (!escriptori) return;

        // Canvi clau: Utilitzem 400px (l'amplada real de la llibreta) perquè els marges siguin perfectes
        const ampladaBase = 400; 
        const alcadaBase = 550;  

        // 20px = 10px de marge esquerre + 10px de marge dret
        const ampladaDisponible = window.innerWidth - 60; 
        const alcadaDisponible = window.innerHeight - 60;

        const escalaX = ampladaDisponible / ampladaBase;
        const escalaY = alcadaDisponible / alcadaBase;

        let escalaFinal = Math.min(escalaX, escalaY);

        if (escalaFinal > 1.1) escalaFinal = 1.1; 

        escriptori.style.transform = `scale(${escalaFinal})`;
    }

    // Ara s'executarà correctament perquè l'HTML ja existeix!
    ajustarEscalaEscriptori();
    window.addEventListener('resize', ajustarEscalaEscriptori);

    pageFlip.loadFromHTML(document.querySelectorAll('.pagina'));

    // --- 2. LÒGICA DELS MARCAPÀGINES (TABS) ---
    const botons = document.querySelectorAll('.tab');

    function animarAPagina(num) {
        if (pageFlip.getState() === 'read') {
            pageFlip.flip(num); 
        }
    }

    botons[0].onclick = () => animarAPagina(0); // Portada
    botons[1].onclick = () => animarAPagina(2); // Monomonitos
    botons[2].onclick = () => animarAPagina(4); // Portfoli
    botons[3].onclick = () => animarAPagina(5); // Galeria
    botons[4].onclick = () => animarAPagina(6); // CV

    // --- Lògica del clic al Post-it ---
const postitLink = document.getElementById('postit-link');
if (postitLink) {
    postitLink.onclick = function() {
        animarAPagina(1); // Ens porta a la pàgina 1
    };
}

    // --- 3. LÒGICA DE LES FLETXES I EL PEU DE PÀGINA ---
    const infoPagines = {
        0: { text: "Portada", classe: "seccio-portada" },
        1: { text: "About", classe: "seccio-portada" },
        2: { text: "Monomonitos Shop", classe: "seccio-shop" },
        3: { text: "Monomonitos Shop 2", classe: "seccio-shop" },
        4: { text: "Portfolio", classe: "seccio-portfolio" },
        5: { text: "Galeria", classe: "seccio-galeria" },
        6: { text: "CV", classe: "seccio-cv" },
        7: { text: "Guest Book", classe: "seccio-guestbook" }
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
        document.getElementById('btn-seg').style.visibility = (numPagina === 7) ? "hidden" : "visible"; // ATENCIÓ: canviat a 4 per l'última pàgina
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
const titolPopup = document.getElementById('popup-titol');
const preuPopup = document.getElementById('popup-preu');
const descripcioPopup = document.getElementById('popup-descripcio');
const botoStripe = document.getElementById('boto-stripe'); // El botó de comprar!

// Variables del carrussel
const carruselImg = document.getElementById('carrusel-img');
const carruselAnt = document.getElementById('carrusel-ant');
const carruselSeg = document.getElementById('carrusel-seg');
let imatgesActuals = [];
let indexImatge = 0;

// Funció per actualitzar la imatge visible
function actualitzarCarrusel() {
    carruselImg.src = imatgesActuals[indexImatge];
    
    // Mostrem o amaguem les fletxes depenent de si hi ha més d'1 imatge
    if (imatgesActuals.length > 1) {
        carruselAnt.style.display = 'block';
        carruselSeg.style.display = 'block';
    } else {
        carruselAnt.style.display = 'none';
        carruselSeg.style.display = 'none';
    }
}

// Clics a les fletxes
carruselAnt.addEventListener('click', () => {
    indexImatge = (indexImatge > 0) ? indexImatge - 1 : imatgesActuals.length - 1;
    actualitzarCarrusel();
});

carruselSeg.addEventListener('click', () => {
    indexImatge = (indexImatge < imatgesActuals.length - 1) ? indexImatge + 1 : 0;
    actualitzarCarrusel();
});

// Quan cliquem un producte
productes.forEach(producte => {
  ['click', 'touchend'].forEach(evt => producte.addEventListener(evt, (e) => {
    e.preventDefault();
    
    // 1. Preparar Carrussel
    const imatgesString = producte.getAttribute('data-imatges-popup');
    if (imatgesString) {
        imatgesActuals = imatgesString.split(',').map(img => img.trim());
    } else {
        imatgesActuals = [producte.src]; // Si no hi ha popup, posa la mateixa enganxina
    }
    indexImatge = 0;
    actualitzarCarrusel();
    
    // 2. Omplir Textos
    titolPopup.textContent = producte.getAttribute('data-nom');
    preuPopup.textContent = producte.getAttribute('data-preu') + " €";
    descripcioPopup.innerHTML = producte.getAttribute('data-descripcio') || '';

    // 3. Omplir Enllaç del botó de Comprar
    const enllac = producte.getAttribute('data-stripe');
    if (enllac) {
        botoStripe.href = enllac;
        botoStripe.style.display = 'inline-block'; // L'ensenyem
    } else {
        botoStripe.style.display = 'none'; // L'amaguem si no té link (opcional)
    }
    
    fonsPopup.classList.remove('ocult');
  }));
});

// Tancar popup
botoTancar.addEventListener('click', () => { fonsPopup.classList.add('ocult'); });
fonsPopup.addEventListener('click', (e) => { if (e.target === fonsPopup) fonsPopup.classList.add('ocult'); });

    // Forçar que l'scroll funcioni al mòbil dins del contingut
    document.querySelectorAll('.page-content').forEach(content => {
        content.addEventListener('touchmove', (e) => {
            e.stopPropagation(); 
        }, { passive: true });
    });
});
/* =========================================
   LÒGICA DEL GUESTBOOK
   ========================================= */
const formGb = document.getElementById('guestbook-form');
const inputMissatge = document.getElementById('gb-missatge');
const charCount = document.getElementById('char-count');
const messagesContainer = document.getElementById('messages-container');
const errorMsg = document.getElementById('gb-error');

// Comptador de caràcters en temps real
if (inputMissatge) {
  inputMissatge.addEventListener('input', () => {
    charCount.textContent = inputMissatge.value.length;
  });
}

// Funció per comprovar si l'usuari ja ha enviat 2 missatges avui
function potEnviarAvui() {
  const avui = new Date().toLocaleDateString();
  const registre = JSON.parse(localStorage.getItem('guestbook_limit')) || { data: avui, count: 0 };

  // Si és un dia diferent, resetegem el comptador
  if (registre.data !== avui) {
    registre.data = avui;
    registre.count = 0;
  }

  if (registre.count >= 2) {
    return false;
  }
  
  return true;
}

// Funció per registrar un nou enviament
function registrarEnviament() {
  const avui = new Date().toLocaleDateString();
  const registre = JSON.parse(localStorage.getItem('guestbook_limit')) || { data: avui, count: 0 };
  registre.count++;
  localStorage.setItem('guestbook_limit', JSON.stringify(registre));
}

// Gestionar l'enviament del formulari
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw7-qDyeDSrGYeSsWhID6Qda5PcILlb9DHPpUd5oVEDQiWGtJD6bWkDkoo-teZJ436s/exec';

if (formGb) {
  formGb.addEventListener('submit', (e) => {
    e.preventDefault();
    errorMsg.style.display = 'none';
    const btn = document.getElementById('btn-enviar-gb');

    if (!potEnviarAvui()) {
      errorMsg.textContent = "Has arribat al límit de 2 notes per dia. Torna demà!";
      errorMsg.style.display = 'block';
      return;
    }

    // Bloquegem el botó mentre s'envia
    btn.disabled = true;
    btn.textContent = "Enviant...";

    const nom = document.getElementById('gb-nom').value;
    const missatge = inputMissatge.value;
    const dataActual = new Date().toLocaleString();

    const dades = {
      nom: nom,
      missatge: missatge,
      data: dataActual
    };

    // Enviament a Google Sheets
    fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', // Necessari per evitar problemes de CORS amb Apps Script
      cache: 'no-cache',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dades)
    })
    .then(() => {
      // Com que fem 'no-cors', no podem llegir la resposta JSON, 
      // però si no dóna error és que ha anat bé.
      afegirNotaALaPantalla(nom, missatge, dataActual);
      registrarEnviament();
      formGb.reset();
      charCount.textContent = '0';
      btn.disabled = false;
      btn.textContent = "Deixar nota";
    })
    .catch(error => {
      console.error('Error:', error);
      errorMsg.textContent = "Hi ha hagut un error en enviar la nota.";
      errorMsg.style.display = 'block';
      btn.disabled = false;
      btn.textContent = "Deixar nota";
    });
  });
}

// Funció visual per pintar la nota a la pàgina
function afegirNotaALaPantalla(nom, missatge, data) {
  const card = document.createElement('div');
  card.className = 'missatge-card';
  card.innerHTML = `
    <div class="missatge-header">
      <strong>${nom}</strong>
      <span>${data}</span>
    </div>
    <div class="missatge-body">
      ${missatge.replace(/\n/g, '<br>')} </div>
  `;
  // Ho afegim a dalt de tot de la llista
  messagesContainer.prepend(card);
}

window.addEventListener('load', () => {
  fetch(SCRIPT_URL)
    .then(response => response.json())
    .then(notes => {
      // Les notes venen en ordre cronològic, les invertim per veure la més nova primer
      notes.reverse().forEach(nota => {
        afegirNotaALaPantalla(nota.nom, nota.missatge, nota.data);
      });
    });
});

/* =========================================
   LÒGICA DEL ZOOM (GALERIA I BOTIGA)
   ========================================= */
const zoomOverlay = document.getElementById('zoom-overlay');
const zoomImg = document.getElementById('zoom-img');
const tancarZoom = document.getElementById('tancar-zoom');
const imgPrincipalPopup = document.getElementById('carrusel-img');

// Noves fletxes
const zoomAnt = document.getElementById('zoom-ant');
const zoomSeg = document.getElementById('zoom-seg');

let imatgesZoom = [];
let indexZoom = 0;

// Funció per actualitzar la imatge gran i mostrar/amagar fletxes
function actualitzarZoom() {
    zoomImg.src = imatgesZoom[indexZoom];
    
    if (imatgesZoom.length > 1) {
        zoomAnt.style.display = 'flex';
        zoomSeg.style.display = 'flex';
    } else {
        zoomAnt.style.display = 'none';
        zoomSeg.style.display = 'none';
    }
}

// Clic a les fletxes del Zoom
zoomAnt.addEventListener('click', (e) => {
    e.stopPropagation(); // Evita que es tanqui el fons fosc en clicar la fletxa
    indexZoom = (indexZoom > 0) ? indexZoom - 1 : imatgesZoom.length - 1;
    actualitzarZoom();
});

zoomSeg.addEventListener('click', (e) => {
    e.stopPropagation();
    indexZoom = (indexZoom < imatgesZoom.length - 1) ? indexZoom + 1 : 0;
    actualitzarZoom();
});

// 1. OBRIR ZOOM DES DE LA GALERIA
// 1. LÒGICA DEL CARRUSEL INLINE I OBRIR ZOOM DES DE LA GALERIA
const carruselsInline = document.querySelectorAll('.galeria-inline-wrapper');

carruselsInline.forEach(wrapper => {
    const img = wrapper.querySelector('.img-galeria');
    const btnAnt = wrapper.querySelector('.inline-ant');
    const btnSeg = wrapper.querySelector('.inline-seg');
    
    // Llegim les fotos
    const dadesImatges = img.getAttribute('data-imatges');
    let llistaImatges = dadesImatges ? dadesImatges.split(',').map(i => i.trim()) : [img.src];
    let indexActual = 0;

    // Si només hi ha 1 foto (o cap extres), amaguem les fletxes integrades
    if (llistaImatges.length <= 1) {
        btnAnt.style.display = 'none';
        btnSeg.style.display = 'none';
    }

    // Funció per canviar la foto de dins la llibreta
    function canviarFotoInline(nouIndex) {
        indexActual = nouIndex;
        img.src = llistaImatges[indexActual];
    }

    // Clics a les fletxes de la llibreta
    btnAnt.addEventListener('click', (e) => {
        e.stopPropagation(); // Evita clics per error a la imatge
        let nouIndex = (indexActual > 0) ? indexActual - 1 : llistaImatges.length - 1;
        canviarFotoInline(nouIndex);
    });

    btnSeg.addEventListener('click', (e) => {
        e.stopPropagation(); 
        let nouIndex = (indexActual < llistaImatges.length - 1) ? indexActual + 1 : 0;
        canviarFotoInline(nouIndex);
    });

    // Clic a la imatge per obrir el ZOOM (a pantalla completa)
    img.addEventListener('click', () => {
        imatgesZoom = [...llistaImatges]; // Li passem tota la llista al zoom
        indexZoom = indexActual;          // Li diem al zoom que comenci per la foto que estàvem mirant
        actualitzarZoom();
        zoomOverlay.classList.remove('ocult');
    });
});

// 2. OBRIR ZOOM DES DE LA BOTIGA (Monomonitos)
imgPrincipalPopup.addEventListener('click', () => {
    // Aprofitem la llista d'imatges que ja té el popup de la botiga
    imatgesZoom = [...imatgesActuals];
    indexZoom = indexImatge; // Obrim directament la que estàvem mirant
    actualitzarZoom();
    zoomOverlay.classList.remove('ocult');
});

// Tancar zoom
tancarZoom.addEventListener('click', () => zoomOverlay.classList.add('ocult'));
zoomOverlay.addEventListener('click', (e) => {
    // Si cliquem al fons fosc (no a la foto ni a les fletxes), es tanca
    if (e.target === zoomOverlay) {
        zoomOverlay.classList.add('ocult');
    }
});

// 1. Seleccionem el nostre cursor
const cursorAnimat = document.getElementById('cursor-animat');

// 2. Definim les rutes a les nostres imatges (ACTUALITZA-LES AMB LES TEVES RUTES REALS)
const gifNormal = 'assets/cursor.gif'; // El cursor per defecte
const gifEnllac = 'assets/cursor-select.gif'; // El cursor per quan es pot fer clic

// 3. Fem que persegueixi el ratolí
document.addEventListener('mousemove', function(e) {
    cursorAnimat.style.left = (e.clientX + 0) + 'px';
    cursorAnimat.style.top = (e.clientY + 0) + 'px';
});

// 4. Seleccionem tot allò on es pot fer clic (enllaços i botons)
const elementsClicables = document.querySelectorAll('a, button');

// 5. Afegim l'efecte de canvi a cada element clicable
elementsClicables.forEach(element => {
    // Quan el ratolí entra a l'enllaç, canviem la imatge
    element.addEventListener('mouseenter', () => {
        cursorAnimat.src = gifEnllac;
    });
    
    // Quan el ratolí surt de l'enllaç, tornem a la imatge normal
    element.addEventListener('mouseleave', () => {
        cursorAnimat.src = gifNormal;
    });
});