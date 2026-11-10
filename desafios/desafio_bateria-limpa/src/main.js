const icons = {
  arrow: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  close: '<path d="m6 6 12 12"/><path d="M18 6 6 18"/>',
  drop: '<path d="M12 3s6 6.3 6 11a6 6 0 0 1-12 0c0-4.7 6-11 6-11Z"/>',
  external:
    '<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6"/>',
  factory:
    '<path d="M3 21V9l6 3V8l6 4V5h6v16Z"/><path d="M7 17h2m3 0h2m3 0h2"/>',
  globe:
    '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
  leaf: '<path d="M20 4C11 4 5 8 5 14c0 3 2 5 5 5 6 0 10-7 10-15Z"/><path d="M4 21c2-6 6-10 12-13"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  map: '<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3Z"/><path d="M9 3v15m6-12v15"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  moon: '<path d="M20.5 15.3A8.5 8.5 0 0 1 8.7 3.5 8.5 8.5 0 1 0 20.5 15.3Z"/>',
  phone:
    '<path d="M6.6 3h3l1.5 5-2 1.4a15 15 0 0 0 5.5 5.5l1.4-2 5 1.5v3A3.6 3.6 0 0 1 17.4 21C9.4 20.5 3.5 14.6 3 6.6A3.6 3.6 0 0 1 6.6 3Z"/>',
  pin: '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  recycle:
    '<path d="M19.2 8A8 8 0 0 0 5.8 5.2L4 8"/><path d="M4 4v4h4"/><path d="M4.8 16A8 8 0 0 0 18.2 18.8L20 16"/><path d="M20 20v-4h-4"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  shield:
    '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
  soil: '<path d="M3 16h18M5 20h14M6 12c2-3 4-4 6-4s4 1 6 4"/><path d="M12 8V3m0 3 3-2m-3 2L9 4"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
}

function iconMarkup(name) {
  return `<svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8">${icons[name] || ""}</svg>`
}

function setIcon(element, name) {
  element.dataset.icon = name
  element.innerHTML = iconMarkup(name)
}

document.querySelectorAll("[data-icon]").forEach((element) => {
  setIcon(element, element.dataset.icon)
})

const root = document.documentElement
const header = document.querySelector(".site-header")
const menu = document.querySelector(".main-nav")
const menuButton = document.querySelector(".menu-button")
const themeButton = document.querySelector(".theme-toggle")
const themeIcon = themeButton?.querySelector(".theme-toggle-track")
const themeLabel = themeButton?.querySelector(".theme-toggle-label")
const themeMeta = document.querySelector('meta[name="theme-color"]')
const searchInput = document.querySelector("#point-search")
const pointCards = [...document.querySelectorAll(".point-card")]
const emptyPoints = document.querySelector("#empty-points")
const searchFeedback = document.querySelector("#search-feedback")
const compactNavigation = matchMedia("(max-width: 1099px)")

function readPreference(key) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function savePreference(key, value) {
  try {
    localStorage.setItem(key, value)
  } catch {
    // A interface continua funcionando quando o navegador bloqueia o armazenamento.
  }
}

let language =
  readPreference("bateria-limpa-language") === "en-US" ? "en-US" : "pt-BR"
let theme = readPreference("bateria-limpa-theme")

if (theme !== "light" && theme !== "dark") {
  theme = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function translatePage(nextLanguage) {
  language = nextLanguage
  const key = language === "en-US" ? "en" : "pt"

  document.querySelectorAll("[data-pt][data-en]").forEach((element) => {
    element.textContent = element.dataset[key]
  })
  document
    .querySelectorAll("[data-placeholder-pt][data-placeholder-en]")
    .forEach((element) => {
      element.placeholder =
        element.dataset[`placeholder${key === "pt" ? "Pt" : "En"}`]
    })

  root.lang = language
  savePreference("bateria-limpa-language", language)
  document.title =
    language === "en-US"
      ? "BateriaLimpa | Electronic waste recycling"
      : "BateriaLimpa | Reciclagem de lixo eletrônico"

  document.querySelectorAll("[data-language]").forEach((button) => {
    const active = button.dataset.language === language
    button.classList.toggle("is-active", active)
    button.setAttribute("aria-pressed", String(active))
  })

  updateControlLabels()
  updateSearchFeedback(pointCards.filter((card) => !card.hidden).length)
}

function updateControlLabels() {
  const english = language === "en-US"
  const dark = theme === "dark"
  const menuOpen = menu?.classList.contains("is-open") ?? false

  if (themeLabel) {
    themeLabel.textContent = dark
      ? english
        ? "Dark"
        : "Escuro"
      : english
        ? "Light"
        : "Claro"
  }
  themeButton?.setAttribute(
    "aria-label",
    english
      ? `Enable ${dark ? "light" : "dark"} mode`
      : `Ativar modo ${dark ? "claro" : "escuro"}`,
  )
  menuButton?.setAttribute(
    "aria-label",
    english
      ? menuOpen
        ? "Close menu"
        : "Open menu"
      : menuOpen
        ? "Fechar menu"
        : "Abrir menu",
  )
  document
    .querySelector(".back-to-top")
    ?.setAttribute("aria-label", english ? "Back to top" : "Voltar ao início")
}

function applyTheme(nextTheme) {
  theme = nextTheme
  root.dataset.theme = theme
  root.style.colorScheme = theme
  savePreference("bateria-limpa-theme", theme)
  themeButton?.setAttribute("aria-pressed", String(theme === "dark"))
  if (themeMeta) themeMeta.content = theme === "dark" ? "#10251f" : "#f6f6ef"
  if (themeIcon) setIcon(themeIcon, theme === "dark" ? "sun" : "moon")
  updateControlLabels()
}

function setMenu(open, restoreFocus = false) {
  if (!menu || !menuButton) return
  const shouldOpen = open && compactNavigation.matches
  menu.classList.toggle("is-open", shouldOpen)
  menuButton.setAttribute("aria-expanded", String(shouldOpen))
  const menuIcon = menuButton.querySelector("[data-icon]")
  if (menuIcon) setIcon(menuIcon, shouldOpen ? "close" : "menu")
  updateControlLabels()
  if (restoreFocus && !shouldOpen) menuButton.focus()
}

document.querySelectorAll("[data-language]").forEach((button) => {
  button.addEventListener("click", () => translatePage(button.dataset.language))
})

themeButton?.addEventListener("click", () => {
  applyTheme(theme === "light" ? "dark" : "light")
})

menuButton?.addEventListener("click", () => {
  setMenu(!menu?.classList.contains("is-open"))
})

menu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false))
})

document.addEventListener("click", (event) => {
  if (header && !header.contains(event.target)) setMenu(false)
})

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menu?.classList.contains("is-open")) {
    setMenu(false, true)
  }
})

compactNavigation.addEventListener("change", () => setMenu(false))

function updateHeader() {
  header?.classList.toggle("is-scrolled", window.scrollY > 18)
  document
    .querySelector(".back-to-top")
    ?.classList.toggle("is-visible", window.scrollY > 650)

  const scrollable = document.documentElement.scrollHeight - innerHeight
  const progress = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0
  const progressBar = document.querySelector(".scroll-progress span")
  if (progressBar) progressBar.style.transform = `scaleX(${progress})`
}

window.addEventListener("scroll", updateHeader, { passive: true })
updateHeader()

function normalize(value) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
}

function filterPoints() {
  if (!searchInput) return
  const query = normalize(searchInput.value.trim())
  let visible = 0

  pointCards.forEach((card) => {
    const matches = normalize(card.dataset.search).includes(query)
    card.hidden = !matches
    if (matches) visible += 1
  })

  if (emptyPoints) emptyPoints.hidden = visible !== 0
  updateSearchFeedback(visible)
}

function updateSearchFeedback(visible) {
  if (!searchFeedback) return
  if (language === "en-US") {
    searchFeedback.textContent = `${visible} ${
      visible === 1 ? "location found" : "locations found"
    }`
  } else {
    searchFeedback.textContent = `${visible} ${
      visible === 1 ? "ponto encontrado" : "pontos encontrados"
    }`
  }
}

searchInput?.addEventListener("input", filterPoints)
document.querySelector("#clear-search")?.addEventListener("click", () => {
  if (!searchInput) return
  searchInput.value = ""
  filterPoints()
  searchInput.focus()
})

const form = document.querySelector("#suggestion-form")
const successState = document.querySelector("#success-state")

form?.addEventListener("submit", (event) => {
  event.preventDefault()
  if (!form.reportValidity()) return
  form.reset()
  form.hidden = true
  if (successState) successState.hidden = false
  successState?.focus()
})

document.querySelector("#new-suggestion")?.addEventListener("click", () => {
  if (successState) successState.hidden = true
  if (!form) return
  form.hidden = false
  form.querySelector("input").focus()
})

document
  .querySelector('input[name="phone"]')
  ?.addEventListener("input", (event) => {
    const digits = event.target.value.replace(/\D/g, "").slice(0, 11)
    const parts = [
      digits.slice(0, 2),
      digits.slice(2, digits.length > 10 ? 7 : 6),
      digits.slice(digits.length > 10 ? 7 : 6),
    ]
    event.target.value = [
      parts[0] && `(${parts[0]}`,
      parts[0].length === 2 ? ") " : "",
      parts[1],
      parts[2] && `-${parts[2]}`,
    ].join("")
  })

document.querySelectorAll(".faq-list details").forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return
    document.querySelectorAll(".faq-list details[open]").forEach((openItem) => {
      if (openItem !== item) openItem.open = false
    })
  })
})

document.querySelector(".back-to-top")?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" })
})

function initializeReveals() {
  if (
    matchMedia("(prefers-reduced-motion: reduce)").matches ||
    !("IntersectionObserver" in window)
  ) {
    return
  }

  const elements = document.querySelectorAll(
    ".section-heading, .journey-heading, .info-card, .journey-list li, .prep-card, .points-heading, .point-card, .faq-heading, .faq-list, .form-aside, .form-card",
  )
  elements.forEach((element, index) => {
    element.dataset.reveal = ""
    element.style.setProperty("--reveal-delay", `${(index % 3) * 70}ms`)
  })
  document.body.classList.add("reveal-ready")

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add("is-revealed")
        observer.unobserve(entry.target)
      })
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px" },
  )
  elements.forEach((element) => observer.observe(element))
}

function initializeActiveNavigation() {
  if (!("IntersectionObserver" in window) || !menu) return
  const links = [...menu.querySelectorAll('a[href^="#"]')]
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean)

  const observer = new IntersectionObserver(
    (entries) => {
      const active = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (!active) return
      links.forEach((link) => {
        const current = link.getAttribute("href") === `#${active.target.id}`
        link.toggleAttribute("aria-current", current)
      })
    },
    { rootMargin: "-25% 0px -65%", threshold: [0, 0.1] },
  )
  sections.forEach((section) => observer.observe(section))
}

const year = document.querySelector("#year")
if (year) year.textContent = new Date().getFullYear()

applyTheme(theme)
translatePage(language)
initializeReveals()
initializeActiveNavigation()
