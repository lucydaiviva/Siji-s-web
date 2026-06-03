

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
        const alcadaDisponible = window.innerHeight - 260;

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
    botons[2].onclick = () => animarAPagina(3); // Portfoli
    botons[3].onclick = () => animarAPagina(4); // Galeria
    botons[4].onclick = () => animarAPagina(5); // CV

    // --- Lògica del clic al Post-it ---
const postitLink = document.getElementById('postit-link');
if (postitLink) {
    postitLink.onclick = function() {
        animarAPagina(1); // Ens porta a la pàgina 1
    };
}

    const infoPagines = {
        0: { text: "Portada", classe: "seccio-portada" },
        1: { text: "About", classe: "seccio-portada" },
        2: { text: "Monomonitos Shop", classe: "seccio-shop" },
        3: { text: "Portfolio", classe: "seccio-portfolio" },
        4: { text: "Galeria", classe: "seccio-galeria" },
        5: { text: "CV", classe: "seccio-cv" },
        6: { text: "Guest Book", classe: "seccio-guestbook" }
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
        document.getElementById('btn-seg').style.visibility = (numPagina === 7) ? "hidden" : "visible";
    }

    // --- NOU: FUNCIÓ PER ACTUALITZAR LES PESTANYES VISUALMENT ---
    function actualitzarPestanyes(numPagina) {
        // 1. Treiem la classe 'activa' a totes les pestanyes
        botons.forEach(boto => boto.classList.remove('activa'));

        // 2. Depenent de la pàgina on siguem, afegim la classe a la pestanya correcta
        if (numPagina === 0 || numPagina === 1) {
            document.getElementById('portada-tab').classList.add('activa');
        } 
        else if (numPagina === 2) {
            document.getElementById('monomonitos-tab').classList.add('activa');
        }
        else if (numPagina === 3) {
            document.getElementById('portfoli-tab').classList.add('activa');
        }
        else if (numPagina === 4) {
            document.getElementById('galeria-tab').classList.add('activa');
        }
        else if (numPagina >= 5) {
            document.getElementById('cv-tab').classList.add('activa');
        }
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
        actualitzarPestanyes(e.data); // Ara sí, funciona perfectament!
    });

    // Inicialització visual en obrir la web
    actualitzarPeu(0);
    actualitzarPestanyes(0);


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
  producte.addEventListener('click', (e) => {
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
    });














    
    //document.getElementById('portfoli-tab').click();
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
            imatgesZoom = llistaImatges; 
            indexZoom = indexActual;     

            if (typeof actualitzarZoom === "function") {
                actualitzarZoom();
            }
            
            document.getElementById('zoom-overlay').classList.remove('ocult');
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

// Variables per recordar quines imatges estem mirant en gran
let imatgesZoomActual = [];
let indexZoomActual = 0;

const btnZoomAnt = document.getElementById('zoom-ant');
const btnZoomSeg = document.getElementById('zoom-seg');
const imgZoom = document.getElementById('zoom-img');

// Lògica per la fletxa ESQUERRA del zoom
if (btnZoomAnt) {
    btnZoomAnt.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitem tancar el zoom al fer clic a la fletxa
        if (imatgesZoomActual.length > 1) {
            indexZoomActual = (indexZoomActual - 1 + imatgesZoomActual.length) % imatgesZoomActual.length;
            imgZoom.src = imatgesZoomActual[indexZoomActual];
        }
    });
}

// Lògica per la fletxa DRETA del zoom
if (btnZoomSeg) {
    btnZoomSeg.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitem tancar el zoom al fer clic a la fletxa
        if (imatgesZoomActual.length > 1) {
            indexZoomActual = (indexZoomActual + 1) % imatgesZoomActual.length;
            imgZoom.src = imatgesZoomActual[indexZoomActual];
        }
    });
}

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
const elementsClicables = document.querySelectorAll('a, button, .retro-button');

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

// ==========================================
// SISTEMA DEL PORTFOLI RETRO INTERACTIU
// ==========================================

// 1. LES DADES (Canvia el text i les rutes d'imatge pels teus projectes reals)
const projectesPortfoli = [
  {
    titol: "Arm the dolls",
    imatges: ["assets/DSC_3503.webp", "assets/DSC_348png.webp"], 
    descripcio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam vel lacus dui. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Proin nisl dolor, consequat vitae ullamcorper a, pretium quis ante. Nullam ornare vitae turpis accumsan dapibus. Morbi egestas ut sem sit amet mollis. Curabitur vitae auctor ipsum. Praesent enim velit, elementum id aliquet ac, consequat pharetra erat. Fusce in lobortis purus. Maecenas dapibus eros porta nunc ultrices, eu lacinia elit cursus. Aliquam eu venenatis purus. Curabitur mattis ligula ac nisi pretium vestibulum. Donec nec leo at lacus vulputate ullamcorper."
  },
  {
    titol: "Comida de dios",
    imatges: ["assets/IMG_8715.webp", "assets/IMG_8744.webp", "assets/IMG_8737.webp", "assets/IMG_8706.webp"],
    descripcio: "Cras egestas nec sapien nec commodo. Proin vitae finibus diam. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Mauris ut tempus ligula, non scelerisque enim. Aliquam congue lorem vel leo convallis, in tincidunt eros sollicitudin. Quisque ornare lobortis leo. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Sed laoreet mauris sed lorem vestibulum ornare. Donec vestibulum lobortis neque, at luctus ex blandit sed. Pellentesque mattis nunc mi, venenatis rutrum turpis tincidunt a. Quisque eleifend interdum feugiat."
  },
  {
    titol: "Other bodies manifesto",
    imatges: ["assets/Fondo de “11 001” eliminado.webp", "assets/Fondo de “4 001” eliminado.webp", "assets/3 001.webp"],
    descripcio: "Quisque non eleifend metus. Phasellus faucibus bibendum massa, sit amet pulvinar risus. Duis elementum ac eros a varius. Donec tempor posuere feugiat. Phasellus mollis ante id sem varius, ac blandit magna finibus. Suspendisse convallis mauris ligula, laoreet interdum dolor sollicitudin quis. In egestas dapibus ligula, nec malesuada est cursus vitae. Nunc volutpat imperdiet enim, sit amet ornare dui vestibulum sit amet. Curabitur ac lacinia tellus, quis mattis mauris. Sed diam erat, consequat eu auctor sit amet, faucibus vitae ex."
  },
  {
    titol: "Proyecto X",
    imatges: ["assets/illus1.webp"],
    descripcio: "HSJHKSUIK kSHJ KHKSKHSHJSjSHHSJ SJK H."
  },
  {
    titol: "Proyecto Y",
    imatges: ["assets/clauer1.webp", "assets/clauer2.webp"],
    descripcio: "AISHiisdh skad jadjsa lsdj sakdjasj adjlasj ajsak sad sakjdkas ."
  }
];

let zIndexWindows = 1000; // Perquè al clicar una finestra es posi per sobre de les altres

function inicialitzarPortfoli() {
  const contenidorLlibreta = document.getElementById('contenidor-llibreta-portfoli');
  const contenidorEscriptori = document.body; 

  projectesPortfoli.forEach((projecte, index) => {
    const finestra = document.createElement('div');
    finestra.className = 'finestra-retro a-llibreta';
    
    let fletxesHTML = projecte.imatges.length > 1 ? `
      <button class="btn-fletxa prev">&#10094;</button>
      <button class="btn-fletxa next">&#10095;</button>
    ` : '';

    finestra.innerHTML = `
      <div class="capcalera-finestra">
        <span>${projecte.titol}</span>
        <div class="botons-finestra">
          <button class="btn-minimitzar" title="Tornar a la llibreta">&minus;</button>
        </div>
      </div>
      <div class="contingut-finestra">
        <div class="carrusel-finestra">
          ${fletxesHTML}
          <img src="${projecte.imatges[0]}" class="img-activa" data-index="0" alt="Projecte">
        </div>
        <p>${projecte.descripcio}</p>
      </div>
    `;

    // --- LÒGICA DEL CARRUSEL (Ara arreglada pel mòbil) ---
    if (projecte.imatges.length > 1) {
      const imgActiva = finestra.querySelector('.img-activa');
      
      finestra.querySelector('.prev').addEventListener('click', (e) => {
        e.stopPropagation(); // Evitem conflictes de tocs a la pantalla
        let actual = parseInt(imgActiva.getAttribute('data-index'));
        actual = (actual - 1 + projecte.imatges.length) % projecte.imatges.length;
        imgActiva.src = projecte.imatges[actual];
        imgActiva.setAttribute('data-index', actual);
      });

      finestra.querySelector('.next').addEventListener('click', (e) => {
        e.stopPropagation(); // Evitem conflictes de tocs a la pantalla
        let actual = parseInt(imgActiva.getAttribute('data-index'));
        actual = (actual + 1) % projecte.imatges.length;
        imgActiva.src = projecte.imatges[actual];
        imgActiva.setAttribute('data-index', actual);
      });
    }

    // --- LÒGICA DE ZOOM CORREGIDA I SEGURA ---
    const imatgeCarrusel = finestra.querySelector('.img-activa');
    
    finestra.addEventListener('click', function(e) {
    if (window.innerWidth <= 600) {
        // En mòbil, si cliquen la finestra directament s'obre el zoom
        // Si han clicat a una fletxa de dins el carrusel de la finestra, no fem això
        if (!e.target.classList.contains('btn-fletxa')) {
            
            // --- NOVA LÒGICA (Utilitzem el sistema global del Zoom) ---
            
            // 1. Enviem totes les imatges d'aquest projecte al sistema global
            imatgesZoom = [...projecte.imatges]; 
            
            // 2. Li diem que comenci des de la primera foto
            indexZoom = 0;
            
            // 3. Cridem la funció global que ja s'encarrega automàticament 
            // de posar la foto que toca i amagar/mostrar les fletxes correctament
            if (typeof actualitzarZoom === "function") {
                actualitzarZoom();
            }
            
            // 4. Fem visible la pantalla de zoom
            document.getElementById('zoom-overlay').classList.remove('ocult');
            
            // -----------------------------------------------------------
        }
    }
});

    contenidorLlibreta.appendChild(finestra);

    // Lògica per EXTREURE a l'escriptori (Ordinador)
    finestra.addEventListener('click', function(e) {
      if (window.innerWidth > 600 && finestra.classList.contains('a-llibreta')) {
        finestra.classList.remove('a-llibreta');
        finestra.classList.add('a-escriptori');
        contenidorEscriptori.appendChild(finestra);
        
        finestra.style.left = (60 + (index * 30)) + 'px';
        finestra.style.top = (60 + (index * 30)) + 'px';
        
        zIndexWindows++;
        finestra.style.zIndex = zIndexWindows;
      }
    });

    // Lògica per MINIMITZAR
    const btnMinimitzar = finestra.querySelector('.btn-minimitzar');
    btnMinimitzar.addEventListener('click', (e) => {
      e.stopPropagation();
      finestra.classList.remove('a-escriptori');
      finestra.classList.add('a-llibreta');
      
      finestra.style.left = '';
      finestra.style.top = '';
      finestra.style.width = '';
      finestra.style.height = '';
      
      contenidorLlibreta.appendChild(finestra);
    });

    // Lògica d'ARROSSEGAR
    const capcalera = finestra.querySelector('.capcalera-finestra');
        let arrosegant = false;
        let startX, startY, iniciX, iniciY;

        capcalera.addEventListener('pointerdown', (e) => {
           if (e.target.closest('.btn-minimitzar')) return;
            if (window.innerWidth <= 600 || finestra.classList.contains('a-llibreta')) return;
            
            arrosegant = true;
            capcalera.setPointerCapture(e.pointerId); 

            startX = e.clientX;
            startY = e.clientY;
            iniciX = finestra.offsetLeft;
            iniciY = finestra.offsetTop;
            
            zIndexWindows++;
            finestra.style.zIndex = zIndexWindows;
            e.preventDefault(); 
        });

        capcalera.addEventListener('pointermove', (e) => {
            if (!arrosegant) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            finestra.style.left = (iniciX + dx) + 'px';
            finestra.style.top = (iniciY + dy) + 'px';
        });

        capcalera.addEventListener('pointerup', (e) => {
            arrosegant = false;
            capcalera.releasePointerCapture(e.pointerId);
        });

        capcalera.addEventListener('pointercancel', (e) => {
            arrosegant = false;
            capcalera.releasePointerCapture(e.pointerId);
        });
  });
}


// Inicialitzem quant la web hagi carregat
inicialitzarPortfoli();
// Variable per controlar que només s'obrin un cop automàticament
let portfoliJaObert = false;

function obrirTresPrimeresFinestres() {
    // Només ho fem si estem en ordinador i no s'han obert encara
    if (window.innerWidth <= 600 || portfoliJaObert) return;
    
    portfoliJaObert = true;
    const finestres = document.querySelectorAll('.finestra-retro');
    const so = document.getElementById('so-popup');
    const contenidorEscriptori = document.body;

    // Definim posicions diferents per a les 3 primeres
    const posicions = [
        { top: '15%', left: '10%' },
        { top: '45%', left: '65%' },
        { top: '10%', left: '70%' }
    ];

    for (let i = 0; i < 3; i++) {
        if (finestres[i]) {
            // Un petit retard (delay) perquè no surtin totes exactament al mateix mil·lisegon
            setTimeout(() => {
                const f = finestres[i];
                
                // Si encara està a la llibreta, l'extraiem
                if (f.classList.contains('a-llibreta')) {
                    f.classList.remove('a-llibreta');
                    f.classList.add('a-escriptori');
                    contenidorEscriptori.appendChild(f);
                    
                    // Apliquem la posició específica
                    f.style.top = posicions[i].top;
                    f.style.left = posicions[i].left;
                    
                    // So de popup
                    if (so) {
                        so.currentTime = 0; // Reinicia el so si encara sona l'anterior
                        so.play().catch(e => console.log("El navegador ha blocat el so inicial:", e));
                    }
                    
                    zIndexWindows++;
                    f.style.zIndex = zIndexWindows;
                }
            }, i * 300); // Surten amb un interval de 300ms entre elles
        }
    }
}

// LÒGICA PER DETECTAR QUAN ARRIBEM AL PORTFOLI
// Busquem el botó del marcapàgines que porta al portfoli
// Suposem que el botó té un ID o que saps quina pàgina és.
// Si el teu botó de Portfoli al "marcapagines" té un ID, l'utilitzem:

document.addEventListener('DOMContentLoaded', () => {

    // Detectar clic al marcapàgines de Portfoli
    // (Ajusta 'portfoli-tab' si el teu ID és diferent)
    const botoPortfoli = document.getElementById('portfoli-tab'); 
    if (botoPortfoli) {
        botoPortfoli.addEventListener('click', () => {
            // Donem un marge de temps perquè la pàgina giri abans d'obrir els popups
            setTimeout(obrirTresPrimeresFinestres, 600);
        });
    }
    
    // OPCIONAL: Si vols que també passi si l'usuari arriba passant pàgines manualment:
    // pageFlip.on('flip', (e) => {
    //    if (e.data === 4) { // Posa aquí el número de la pàgina on està el portfoli
    //        setTimeout(obrirTresPrimeresFinestres, 600);
    //    }
    // });
});
// Si girem el mòbil o redimensionem la finestra, fiquem tot a llibretes
window.addEventListener('resize', () => {
  if (window.innerWidth <= 600) {
    const finestres = document.querySelectorAll('.finestra-retro');
    const contenidorLlibreta = document.getElementById('contenidor-llibreta-portfoli');
    finestres.forEach(finestra => {
      if (finestra.classList.contains('a-escriptori')) {
        finestra.classList.remove('a-escriptori');
        finestra.classList.add('a-llibreta');
        finestra.style.left = '';
        finestra.style.top = '';
        contenidorLlibreta.appendChild(finestra);
      }
    });
  }
});






