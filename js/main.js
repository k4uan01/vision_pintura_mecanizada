const header = document.getElementById("header");
const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileNav = document.querySelector("[data-mobile-nav]");
const modal = document.getElementById("orcamento-modal");
const form = document.getElementById("orcamento-form");
const tipoSelect = document.getElementById("tipo-obra");
const WA_NUMBER = "5541995227767";

function createIcons() {
  if (window.lucide) {
    window.lucide.createIcons({ attrs: { "stroke-width": 1.85 } });
  }
}

createIcons();

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 8);
});

menuToggle?.addEventListener("click", () => {
  mobileNav.classList.toggle("open");
  const open = mobileNav.classList.contains("open");
  menuToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
});

mobileNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => mobileNav.classList.remove("open"));
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14, rootMargin: "0px 0px -40px 0px" }
);

document.querySelectorAll(".reveal").forEach((el, index) => {
  el.style.transitionDelay = `${Math.min(index % 6, 5) * 70}ms`;
  observer.observe(el);
});

const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav a");

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute("id");
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
      });
    });
  },
  { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
);

sections.forEach((section) => navObserver.observe(section));

document.querySelectorAll(".faq-item button").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.parentElement;
    const willOpen = !item.classList.contains("open");
    document.querySelectorAll(".faq-item").forEach((faq) => faq.classList.remove("open"));
    if (willOpen) item.classList.add("open");
  });
});

function openModal(service) {
  modal.classList.add("open");
  document.body.style.overflow = "hidden";
  if (service && tipoSelect) tipoSelect.value = service;
  createIcons();
}

function closeModal() {
  modal.classList.remove("open");
  document.body.style.overflow = "";
}

document.querySelectorAll("[data-open-modal]").forEach((el) => {
  el.addEventListener("click", (event) => {
    event.preventDefault();
    openModal(el.dataset.service);
  });
});

document.querySelectorAll("[data-close-modal]").forEach((el) => {
  el.addEventListener("click", closeModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeModal();
});

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const nome = data.get("nome");
  const telefone = data.get("telefone");
  const tipo = data.get("tipo");
  const mensagem = data.get("mensagem") || "Gostaria de um orçamento.";
  const text = `Olá! Meu nome é ${nome}.%0ATelefone: ${telefone}%0ATipo de obra: ${tipo}%0A%0A${mensagem}`;
  window.open(`https://wa.me/${WA_NUMBER}?text=${text}`, "_blank", "noopener");
});
