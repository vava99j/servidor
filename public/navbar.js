const template = document.createElement('template');
template.innerHTML = `
<head>
  <link rel="stylesheet" href="style.css">
</head>
    

  <div class="navbar">
  <div id='navbarrow'>
    <a href="/home" class="logo"><img src="img/icon.png" alt="Logo"></a>
    <button class="menu-btn">☰</button>
      </div>
    <ul id="menu">
      <li><a href="/home">Home</a></li>
      <li><a href="/sobre">Sobre Nós</a></li>
      <li><a href="/infos">Infos Técnicas</a></li>
      <li><a href="/contato">Contacte-nos</a></li>
      <li><a id="modeToggle">🌙</a></li>      
    
      </ul>

  </div>
`;

class Navbar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true));
    const toggleBtn = this.shadowRoot.getElementById("modeToggle");
    const menuBtn = this.shadowRoot.querySelector(".menu-btn");
    const menu = this.shadowRoot.getElementById("menu");

    toggleBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      document.body.classList.toggle("light-mode");
      toggleBtn.textContent = document.body.classList.contains("dark-mode") ? "🌞" : "🌙";
    });

    menuBtn.addEventListener("click", () => {
  menu.classList.toggle("ativo");
    });
  }
}

customElements.define('nav-bar', Navbar);

async function troca(idElemento, ...listaDePalavras) {
  const palavras = listaDePalavras;

  const elemento = document.getElementById(idElemento);
  if (!elemento) return;

  let i = 0;

  // inicia com a primeira palavra
  elemento.textContent = palavras[i];

  setInterval(() => {

    // SAÍDA suave
    elemento.classList.add("hidden");

    // espera a animação terminar antes de trocar o texto
    setTimeout(() => {
      i = (i + 1) % palavras.length;
      elemento.textContent = palavras[i];
      
      // ENTRADA suave
      elemento.classList.remove("hidden");
    }, 600); // mesmo tempo do transition
  }, 3000);
}

troca("h2", "Tecnologia", "Horta", "Horários", "Técnica");
