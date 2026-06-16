const section = document.querySelector("#cartoes");
const scenes = [...document.querySelectorAll("[data-scene]")];
const copies = [...document.querySelectorAll("[data-copy]")];
const tabs = [...document.querySelectorAll(".tab")];
const pill = document.querySelector("#activePill");
const bigWord = document.querySelector("#bigWord");
const benefitOne = document.querySelector("#benefitOne");
const benefitTwo = document.querySelector("#benefitTwo");
const benefitThree = document.querySelector("#benefitThree");
const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
const mobileMenuPanel = document.querySelector("#mobileMenu");
const headerPrimaryButton = document.querySelector(".header-button-primary");

const states = [
  {
    word: "Platinum",
    benefits: ["Conta completa", "Cartão flexível", "Mais controle"],
  },
  {
    word: "Black",
    benefits: ["Cashback", "Banco digital", "Experiência premium"],
  },
  {
    word: "Ultrablue",
    benefits: ["Assessoria", "Salas VIP", "Benefícios elevados"],
  },
  {
    word: "TAP",
    benefits: ["Milhas", "Viagens", "Experiência internacional"],
  },
];

let activeIndex = -1;

function setState(index) {
  if (index === activeIndex) return;
  activeIndex = index;

  scenes.forEach((scene, sceneIndex) => {
    scene.classList.remove("state-active", "state-hidden", "state-past");
    if (sceneIndex === index) scene.classList.add("state-active");
    else if (sceneIndex < index) scene.classList.add("state-past");
    else scene.classList.add("state-hidden");
  });

  copies.forEach((copy, copyIndex) => {
    copy.classList.remove("hidden-up", "hidden-down");
    if (copyIndex < index) copy.classList.add("hidden-up");
    if (copyIndex > index) copy.classList.add("hidden-down");
  });

  tabs.forEach((tab, tabIndex) => tab.classList.toggle("active", tabIndex === index));

  const activeTab = tabs[index];
  pill.style.transform = `translateX(${activeTab.offsetLeft - 8}px)`;
  pill.style.width = `${activeTab.offsetWidth}px`;

  const state = states[index];
  bigWord.textContent = state.word;
  bigWord.style.transform = `translateX(-50%) translateY(${index === 1 ? 4 : 0}px) scale(${index === 1 ? 1.03 : 1})`;

  [benefitOne, benefitTwo, benefitThree].forEach((item, itemIndex) => {
    item.textContent = state.benefits[itemIndex];
  });
}

function getScrollIndex() {
  const rect = section.getBoundingClientRect();
  const scrollable = section.offsetHeight - window.innerHeight;
  const progress = Math.min(1, Math.max(0, -rect.top / scrollable));
  return Math.min(states.length - 1, Math.floor(progress * states.length));
}

function onScroll() {
  setState(getScrollIndex());
}

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => {
    const scrollable = section.offsetHeight - window.innerHeight;
    const targetProgress = index / states.length + 0.01;
    const top = window.scrollY + section.getBoundingClientRect().top + scrollable * targetProgress;

    window.scrollTo({ top, behavior: "smooth" });
    setState(index);
  });
});

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll);
onScroll();

function setMobileMenu(open) {
  document.body.classList.toggle("menu-open", open);
  mobileMenuToggle?.setAttribute("aria-expanded", String(open));
  mobileMenuToggle?.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  mobileMenuPanel?.setAttribute("aria-hidden", String(!open));
}

mobileMenuToggle?.addEventListener("click", () => {
  setMobileMenu(!document.body.classList.contains("menu-open"));
});

mobileMenuPanel?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMobileMenu(false));
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMobileMenu(false);
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 600) setMobileMenu(false);
});
