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
    botons[3].onclick = () => animarAPagina(5); // CV

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
        document.getElementById('btn-seg').style.visibility = (numPagina === 6) ? "hidden" : "visible"; // ATENCIÓ: canviat a 4 per l'última pàgina
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