const API_URL = "https://newsdata.io/api/1/news";
const API_KEY = "pub_2b8ec9b8c9dd4d80a3b7dd86cd98d5ba";

const formulario  = document.getElementById("formulario");
const resultados  = document.getElementById("resultados");
const estado      = document.getElementById("estado");

const fechaCorta = (iso) => {
  const d = new Date(iso || "");
  return isNaN(d) ? "" : d.toLocaleString();
};

const urlNoticias = ({ palabra, categoria, idioma, pais }) => {
  const p = new URLSearchParams();
  p.set("apikey", API_KEY);
  if (palabra)   p.set("q", palabra.trim());
  if (categoria) p.set("category", categoria);
  if (idioma)    p.set("language", idioma);
  if (pais)      p.set("country", pais);
  return `${API_URL}?${p.toString()}`;
};

const vistaNoticia = (n) => {
  const enlace = n.link || "#";
  const titulo = n.title || "Sin título";
  const imagen = n.image_url || "https://placehold.co/800x500?text=Noticia";
  const fuente = n.source_id ? ` • ${n.source_id}` : "";
  const fecha  = n.pubDate ? ` • ${fechaCorta(n.pubDate)}` : "";
  const desc   = n.description || "";

  return `
    <article class="noticia">
      <a class="miniatura" href="${enlace}" target="_blank" rel="noopener noreferrer" aria-label="Abrir noticia">
        <img src="${imagen}" alt="${titulo}" />
      </a>
      <div>
        <a class="titulo clamp-2" href="${enlace}" target="_blank" rel="noopener noreferrer">${titulo}</a>
        <p class="meta">${(fuente + fecha).slice(3) || " "}</p>
        <p class="descripcion clamp-3">${desc}</p>
      </div>
    </article>
  `;
};

formulario.addEventListener("submit", async (ev) => {
  ev.preventDefault();

  const palabra   = document.getElementById("palabra").value;
  const categoria = document.getElementById("categoria").value;
  const idioma    = document.getElementById("idioma").value;
  const pais      = document.getElementById("pais").value;

  resultados.innerHTML = "";
  estado.textContent = "Buscando noticias…";

  try {
    const res = await fetch(urlNoticias({ palabra, categoria, idioma, pais }));
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    const lista = Array.isArray(data.results) ? data.results : [];
    if (!lista.length) {
      estado.textContent = "No se encontraron noticias.";
      return;
    }
    
    resultados.innerHTML = lista.map(vistaNoticia).join("");
    estado.textContent = "";
  } catch (e) {
    console.error(e);
    estado.textContent = "Error al cargar las noticias. Revisa tu API key o intenta de nuevo.";
  }
});
