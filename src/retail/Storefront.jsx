import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  ArrowRight,
  Search,
  ShoppingBag,
  Menu,
  X,
  Plus,
  SlidersHorizontal,
  Check,
  Box,
  Camera as Instagram,
} from "lucide-react";
import { ProductDialog, BagDialog } from "./CommerceDialogs";
import { cap3dSpec } from "./cap3dCatalog";
import "./storefront.css";

const asset = (path) => `${import.meta.env.BASE_URL}${path}`;
const instagram = "https://www.instagram.com/supersuerohats/";
const money = (amount) => `RD$${new Intl.NumberFormat("es-DO").format(amount)}`;
const families = [
  "Todos",
  "Gorras",
  "Signature S",
  "Familia",
  "Dominicana",
  "Multicolor",
  "Shorts",
];
const familyOf = (product) =>
  product.category === "Shorts"
    ? "Shorts"
    : product.name.includes("Familia")
      ? "Familia"
      : product.id === "ss-cap-domi"
        ? "Dominicana"
        : ["ss-cap-caribe", "ss-cap-peace", "ss-cap-respect"].includes(
              product.id,
            )
          ? "Multicolor"
          : "Signature S";
const normalize = (text) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

function Logo({ light = false }) {
  return (
    <span className={`rt-logo ${light ? "rt-logo--light" : ""}`}>
      <img src={asset("brand-logo.jpg")} alt="" width="48" height="48" />
      <span>
        SÚPER SUERO<small>HATS + SHORTS</small>
      </span>
    </span>
  );
}

function getStoredBag(products) {
  try {
    const saved = JSON.parse(
      localStorage.getItem("super-suero-bag-v2") ||
        localStorage.getItem("super-suero-cart") ||
        "[]",
    );
    if (!Array.isArray(saved)) return [];
    return saved
      .map((line) => {
        const product = products.find((item) => item.id === line.id);
        if (
          !product ||
          (product.category === "Shorts" &&
            !["M", "L", "XL"].includes(line.size))
        )
          return null;
        return {
          ...product,
          size: product.category === "Shorts" ? line.size : "",
          quantity: Math.max(
            1,
            Math.min(20, Math.floor(Number(line.quantity) || 1)),
          ),
        };
      })
      .filter(Boolean);
  } catch {
    return [];
  }
}

export default function Storefront({ products: suppliedProducts }) {
  const products = useMemo(
    () =>
      suppliedProducts.map((product) => ({
        ...product,
        // These are different embroidery variants, not two views of the same cap.
        gallery:
          product.id === "ss-cap-red-white" ? [product.image] : product.gallery,
        subtitle:
          product.id === "ss-cap-black-gold"
            ? "Negra / bordado amarillo y costuras blancas"
            : product.subtitle,
        description:
          product.id === "ss-cap-black-gold"
            ? "Base negra, costuras blancas y la S bordada en amarillo. Contraste y carácter en cada detalle."
            : product.category === "Shorts"
              ? "Elige tu talla y consulta con el equipo el diseño que quieres de los mostrados en la foto. Shorts con forro interno, para la cancha y para salir."
              : product.description,
        details:
          product.id === "ss-cap-black-gold"
            ? [
                "Costuras de contraste",
                "Logo S amarillo",
                "Visera negra",
                "Cierre ajustable",
              ]
            : product.details,
      })),
    [suppliedProducts],
  );
  const [family, setFamily] = useState("Todos");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  const [detailMode, setDetailMode] = useState(() =>
    new URLSearchParams(window.location.search).get("mode") === "3d"
      ? "3d"
      : "photos",
  );
  const [selected, setSelected] = useState(
    () =>
      products.find(
        (product) =>
          product.id ===
          new URLSearchParams(window.location.search).get("product"),
      ) || null,
  );
  const [bagOpen, setBagOpen] = useState(false);
  const [cart, setCart] = useState(() => getStoredBag(products));
  const [notice, setNotice] = useState("");
  const searchRef = useRef(null);
  const menuRef = useRef(null);
  const menuTrigger = useRef(null);
  const menuDestination = useRef(null);

  const selectProduct = (product, mode = "photos") => {
    const url = new URL(window.location.href);
    if (product) url.searchParams.set("product", product.id);
    else url.searchParams.delete("product");
    const nextMode =
      product && cap3dSpec(product.id) && mode === "3d" ? "3d" : "photos";
    if (nextMode === "3d") url.searchParams.set("mode", "3d");
    else url.searchParams.delete("mode");
    window.history.replaceState(window.history.state, "", url);
    setSelected(product);
    setDetailMode(nextMode);
  };

  useEffect(() => {
    const syncProduct = () => {
      const id = new URLSearchParams(window.location.search).get("product");
      setSelected(products.find((product) => product.id === id) || null);
      setDetailMode(
        new URLSearchParams(window.location.search).get("mode") === "3d"
          ? "3d"
          : "photos",
      );
    };
    window.addEventListener("popstate", syncProduct);
    return () => window.removeEventListener("popstate", syncProduct);
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "super-suero-bag-v2",
        JSON.stringify(
          cart.map(({ id, quantity, size }) => ({ id, quantity, size })),
        ),
      );
    } catch {
      /* Bag remains usable when browser storage is unavailable. */
    }
  }, [cart]);
  useEffect(() => {
    if (!notice) return undefined;
    const timeout = setTimeout(() => setNotice(""), 3500);
    return () => clearTimeout(timeout);
  }, [notice]);
  useEffect(() => {
    if (!menuOpen) return undefined;
    const desktop = window.matchMedia("(min-width: 801px)");
    const closeOnDesktop = (event) => {
      if (event.matches) setMenuOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    menuRef.current?.querySelector("button")?.focus();
    const onKey = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
      if (event.key === "Tab") {
        const controls = [...menuRef.current.querySelectorAll("button,a")];
        const first = controls[0];
        const last = controls.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
        if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", closeOnDesktop);
      (menuDestination.current || menuTrigger.current)?.focus({
        preventScroll: true,
      });
      menuDestination.current = null;
    };
  }, [menuOpen]);

  const filtered = useMemo(() => {
    const list = products.filter(
      (product) =>
        (family === "Todos" ||
          product.category === family ||
          familyOf(product) === family) &&
        normalize(
          `${product.name} ${product.subtitle} ${product.code} ${familyOf(product)}`,
        ).includes(normalize(query.trim())),
    );
    if (sort === "price-up") list.sort((a, b) => a.price - b.price);
    if (sort === "price-down") list.sort((a, b) => b.price - a.price);
    if (sort === "name")
      list.sort((a, b) => a.name.localeCompare(b.name, "es"));
    return list;
  }, [products, family, query, sort]);
  const count = cart.reduce((sum, line) => sum + line.quantity, 0);
  const goShop = (nextFamily = "Todos", focusSearch = false) => {
    setFamily(nextFamily);
    setQuery("");
    if (menuOpen)
      menuDestination.current = document.getElementById("catalog-title");
    setMenuOpen(false);
    requestAnimationFrame(() => {
      document.getElementById("shop")?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
      if (focusSearch) searchRef.current?.focus({ preventScroll: true });
      else
        document
          .getElementById("catalog-title")
          ?.focus({ preventScroll: true });
    });
  };
  const add = (product, quantity = 1, size = "") => {
    if (product.category === "Shorts" && !["M", "L", "XL"].includes(size)) {
      selectProduct(product);
      return;
    }
    setCart((current) => {
      const existing = current.find(
        (line) => line.id === product.id && line.size === size,
      );
      return existing
        ? current.map((line) =>
            line === existing
              ? { ...line, quantity: Math.min(20, line.quantity + quantity) }
              : line,
          )
        : [...current, { ...product, quantity, size }];
    });
    selectProduct(null);
    setBagOpen(true);
    setNotice("Añadido a tu bolsa");
  };

  const heroEditions = [
    {
      product: products.find((p) => p.id === "ss-cap-red-white"),
      label: "Signature",
      family: "SIGNATURE S",
      caption: "LA S LO DICE TODO.",
      color: "Crema / Roja",
    },
    {
      product: products.find((p) => p.id === "ss-cap-familia-navy"),
      label: "Familia",
      family: "COLECCIÓN FAMILIA",
      caption: "EL ESTILO SE COMPARTE.",
      color: "Marino / Negro",
    },
    {
      product: products.find((p) => p.id === "ss-cap-domi"),
      label: "DOMI",
      family: "EDICIÓN DOMINICANA",
      caption: "LOS COLORES DE LOS TUYOS.",
      color: "Rojo / Blanco / Azul",
    },
  ];
  const edition = heroEditions[heroIndex];
  const featured = edition.product;
  const storyProduct = products.find((p) => p.id === "ss-cap-familia-navy");
  const collections = [
    {
      family: "Signature S",
      title: "La firma original.",
      label: "EL SELLO SÚPER SUERO",
      product: products[1],
    },
    {
      family: "Familia",
      title: "Para los tuyos.",
      label: "COLECCIÓN FAMILIA",
      product: products[2],
    },
    {
      family: "Dominicana",
      title: "Lo nuestro se lleva.",
      label: "EDICIÓN DOMI",
      product: products[6],
    },
  ];

  return (
    <div className="rt-store" id="top">
      <a className="rt-skip" href="#shop">
        Saltar al catálogo
      </a>
      <div className="rt-announcement">
        <span>DE LA CANCHA A LA CALLE.</span>
        <span>
          Pedidos por Instagram <ArrowUpRight size={12} />
        </span>
      </div>
      <header className="rt-header">
        <button
          ref={menuTrigger}
          className="rt-icon rt-menu-trigger"
          aria-label="Abrir menú"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
        >
          <Menu size={23} />
        </button>
        <a className="rt-brand" href="#top" aria-label="Súper Suero — inicio">
          <Logo />
        </a>
        <nav className="rt-main-nav" aria-label="Navegación principal">
          <button onClick={() => goShop()}>La colección</button>
          <button onClick={() => goShop("Gorras")}>Gorras</button>
          <button onClick={() => goShop("Shorts")}>Shorts</button>
          <a href="#brand-story">Nuestro juego</a>
        </nav>
        <div className="rt-header-actions">
          <button
            className="rt-icon rt-search-trigger"
            aria-label="Buscar productos"
            onClick={() => goShop("Todos", true)}
          >
            <Search size={20} />
          </button>
          <button
            className="rt-bag-trigger"
            onClick={() => setBagOpen(true)}
            aria-label={`Abrir bolsa, ${count} ${count === 1 ? "artículo" : "artículos"}`}
          >
            <ShoppingBag size={20} />
            <span>Bolsa</span>
            <b>{count}</b>
          </button>
        </div>
      </header>

      {menuOpen && (
        <div
          className="rt-mobile-nav"
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación"
        >
          <div>
            <Logo />
            <button
              className="rt-icon"
              aria-label="Cerrar menú"
              onClick={() => setMenuOpen(false)}
            >
              <X size={24} />
            </button>
          </div>
          <nav>
            <button onClick={() => goShop()}>
              La colección <ArrowUpRight />
            </button>
            <button onClick={() => goShop("Gorras")}>
              Gorras <ArrowUpRight />
            </button>
            <button onClick={() => goShop("Familia")}>
              Familia <ArrowUpRight />
            </button>
            <button onClick={() => goShop("Dominicana")}>
              Dominicana <ArrowUpRight />
            </button>
            <button onClick={() => goShop("Shorts")}>
              Shorts <ArrowUpRight />
            </button>
            <a
              href="#brand-story"
              onClick={() => {
                menuDestination.current =
                  document.getElementById("story-title");
                setMenuOpen(false);
              }}
            >
              Nuestro juego <ArrowUpRight />
            </a>
          </nav>
          <a href={instagram} target="_blank" rel="noreferrer">
            @supersuerohats <Instagram size={19} />
          </a>
        </div>
      )}

      <main>
        <section className="rt-hero" aria-labelledby="hero-title">
          <div className="rt-hero-copy">
            <div className="rt-eyebrow">
              <span className="rt-red-dot" /> SÚPER SUERO · HATS + SHORTS
            </div>
            <h1 id="hero-title">
              PONTE
              <br />
              <em>PELUCHE.</em>
            </h1>
            <p>
              El juego es tuyo.
              <br />
              El estilo también.
            </p>
            <span className="rt-hero-description">
              Gorras y shorts de Ángel Gerardo Suero Castillo.
              <br />
              Identidad dominicana, dentro y fuera de la cancha.
            </span>
            <div className="rt-hero-actions">
              <button className="rt-button" onClick={() => goShop()}>
                Explorar la colección <ArrowUpRight size={18} />
              </button>
              {cap3dSpec(featured.id) ? (
                <button
                  className="rt-text-link"
                  onClick={() => selectProduct(featured, "3d")}
                >
                  Girar gorra en 3D <Box size={16} />
                </button>
              ) : (
                <a href="#brand-story" className="rt-text-link">
                  Conoce la marca <ArrowRight size={15} />
                </a>
              )}
            </div>
            <div
              className="rt-hero-editions"
              role="tablist"
              aria-label="Piezas destacadas"
            >
              {heroEditions.map((item, index) => (
                <button
                  key={item.label}
                  id={`edition-tab-${index}`}
                  type="button"
                  role="tab"
                  aria-selected={heroIndex === index}
                  aria-controls="edition-preview"
                  tabIndex={heroIndex === index ? 0 : -1}
                  onClick={() => setHeroIndex(index)}
                  onKeyDown={(event) => {
                    if (
                      !["ArrowRight", "ArrowLeft", "Home", "End"].includes(
                        event.key,
                      )
                    )
                      return;
                    event.preventDefault();
                    const next =
                      event.key === "Home"
                        ? 0
                        : event.key === "End"
                          ? 2
                          : (index +
                              (event.key === "ArrowRight" ? 1 : -1) +
                              3) %
                            3;
                    setHeroIndex(next);
                    document.getElementById(`edition-tab-${next}`)?.focus();
                  }}
                >
                  <img src={item.product.image} alt="" width="36" height="36" />
                  <span>
                    <small>0{index + 1}</small>
                    {item.label}
                  </span>
                  <span className="rt-edition-indicator" />
                </button>
              ))}
            </div>
          </div>
          <div
            className={`rt-hero-visual rt-hero-visual--${heroIndex}`}
            role="tabpanel"
            id="edition-preview"
            aria-labelledby={`edition-tab-${heroIndex}`}
          >
            <div className="rt-hero-caption">
              <span>{edition.caption}</span>
              <div className="rt-hero-playback">
                <span>
                  0{heroIndex + 1} / {edition.label.toUpperCase()}
                </span>
                {cap3dSpec(featured.id) && (
                  <button
                    type="button"
                    className="rt-icon"
                    onClick={() => selectProduct(featured, "3d")}
                    aria-label="Girar gorra destacada en 3D"
                    title="Girar gorra en 3D"
                  >
                    <Box size={16} />
                  </button>
                )}
              </div>
            </div>
            <button
              className="rt-hero-product"
              onClick={() => selectProduct(featured)}
              aria-label={`Ver ${featured.name}`}
            >
              <img
                src={featured.image}
                alt={featured.name}
                fetchPriority="high"
                width="1254"
                height="1254"
              />
            </button>
            <div className="rt-hero-product-label">
              <div>
                <small>{edition.family}</small>
                <strong>{edition.color}</strong>
              </div>
              <span>{money(featured.price)}</span>
              <button
                className="rt-icon"
                onClick={() => selectProduct(featured)}
                aria-label="Ver detalles de la gorra destacada"
              >
                <ArrowUpRight size={23} />
              </button>
            </div>
          </div>
        </section>
        <div className="rt-values">
          <span>
            <Check size={16} /> Bordado con identidad
          </span>
          <span>
            <ShoppingBag size={16} /> Gorras + shorts
          </span>
          <span>
            <Instagram size={16} /> Atención directa por DM
          </span>
          <a href="#how-to-order">
            Cómo pedir <ArrowDown size={14} />
          </a>
        </div>

        <section
          className="rt-collections rt-section"
          aria-labelledby="collections-title"
        >
          <div className="rt-section-heading">
            <div>
              <span className="rt-eyebrow">ENCUENTRA TU ESTILO</span>
              <h2 id="collections-title">
                Un mismo sello.
                <br />
                Diferentes formas de llevarlo.
              </h2>
            </div>
            <button className="rt-text-link" onClick={() => goShop()}>
              Ver todas las piezas <ArrowUpRight size={17} />
            </button>
          </div>
          <div className="rt-collection-grid">
            {collections.map((collection) => (
              <button
                className="rt-collection-card"
                key={collection.family}
                onClick={() => goShop(collection.family)}
              >
                <div className="rt-collection-image">
                  <span className="rt-eyebrow">{collection.label}</span>
                  <img
                    src={collection.product.image}
                    alt={collection.product.name}
                    loading="lazy"
                    width="1254"
                    height="1254"
                  />
                </div>
                <div className="rt-collection-title">
                  <h3>{collection.title}</h3>
                  <ArrowUpRight size={24} />
                </div>
              </button>
            ))}
          </div>
        </section>

        <section
          className="rt-catalog rt-section"
          id="shop"
          aria-labelledby="catalog-title"
        >
          <div className="rt-section-heading">
            <div>
              <span className="rt-eyebrow">ELIGE TU PRÓXIMA PIEZA</span>
              <h2 id="catalog-title" tabIndex={-1}>
                La colección.
              </h2>
            </div>
            <p>
              La firma de Súper Suero.
              <br />
              Tu manera de llevarla.
            </p>
          </div>
          <div className="rt-catalog-toolbar">
            <div
              className="rt-family-tabs"
              role="group"
              aria-label="Filtrar por colección"
            >
              {families.map((item) => (
                <button
                  key={item}
                  aria-pressed={family === item}
                  className={family === item ? "is-selected" : ""}
                  onClick={() => setFamily(item)}
                >
                  {item}
                  {item === "Todos" && <small>{products.length}</small>}
                </button>
              ))}
            </div>
            <div className="rt-search-sort">
              <label className="rt-search">
                <Search size={18} />
                <input
                  ref={searchRef}
                  type="search"
                  aria-label="Buscar en la colección"
                  placeholder="Buscar modelo, color…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                {query && (
                  <button
                    className="rt-icon"
                    aria-label="Limpiar búsqueda"
                    onClick={() => {
                      setQuery("");
                      searchRef.current?.focus();
                    }}
                  >
                    <X size={16} />
                  </button>
                )}
              </label>
              <label className="rt-sort">
                <SlidersHorizontal size={15} />
                <span className="rt-sr-only">Ordenar productos</span>
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="featured">Selección de la marca</option>
                  <option value="price-up">Precio: menor a mayor</option>
                  <option value="price-down">Precio: mayor a menor</option>
                  <option value="name">Nombre: A–Z</option>
                </select>
              </label>
            </div>
          </div>
          <div className="rt-results" role="status" aria-live="polite">
            <span>
              {filtered.length} {filtered.length === 1 ? "pieza" : "piezas"}
              {family !== "Todos" && ` en ${family}`}
              {query.trim() && ` para “${query.trim()}”`}
            </span>
            {(family !== "Todos" || query) && (
              <button
                onClick={() => {
                  setFamily("Todos");
                  setQuery("");
                }}
              >
                Limpiar filtros <X size={12} />
              </button>
            )}
            <span>PRECIOS EN PESOS DOMINICANOS</span>
          </div>
          <div className="rt-product-grid">
            {filtered.map((product) => (
              <article className="rt-product-card" key={product.id}>
                <button
                  className="rt-product-image"
                  onClick={() => selectProduct(product)}
                  aria-label={`Ver ${product.name}`}
                >
                  <span className="rt-product-family">{familyOf(product)}</span>
                  <img
                    className="rt-product-primary"
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                    width="1254"
                    height="1254"
                  />
                  {product.gallery?.length > 1 && (
                    <img
                      className="rt-product-alternate"
                      src={product.gallery[1]}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      width="1254"
                      height="1254"
                    />
                  )}
                  {product.gallery?.length > 1 && (
                    <span className="rt-photo-count">
                      {product.gallery.length} vistas
                    </span>
                  )}
                  <span className="rt-view-product">
                    Ver la pieza <ArrowUpRight size={15} />
                  </span>
                </button>
                <div className="rt-product-info">
                  <h3>
                    <button onClick={() => selectProduct(product)}>
                      {product.name.replace("Gorra ", "")}
                    </button>
                  </h3>
                  <strong>{money(product.price)}</strong>
                </div>
                <p>{product.subtitle}</p>
                <button
                  className="rt-add"
                  aria-label={
                    product.category === "Shorts"
                      ? `Elegir talla de ${product.name}`
                      : `Añadir ${product.name} a la bolsa`
                  }
                  onClick={() =>
                    product.category === "Shorts"
                      ? selectProduct(product)
                      : add(product)
                  }
                >
                  {product.category === "Shorts"
                    ? "Elegir talla"
                    : "Añadir a la bolsa"}
                  <Plus size={16} />
                </button>
              </article>
            ))}
          </div>
          {!filtered.length && (
            <div className="rt-no-results">
              <Search size={30} />
              <h3>Tu próxima pieza está por aquí.</h3>
              <p>Prueba con otro modelo o explora la colección completa.</p>
              <button
                className="rt-button"
                onClick={() => {
                  setFamily("Todos");
                  setQuery("");
                }}
              >
                Ver toda la colección <ArrowRight size={17} />
              </button>
            </div>
          )}
          <p className="rt-catalog-note">
            Prepara tu selección y confirma disponibilidad, precio final, envío
            y forma de pago con el equipo por Instagram.
          </p>
        </section>

        <section
          className="rt-story"
          id="brand-story"
          aria-labelledby="story-title"
        >
          <button
            className="rt-story-art"
            onClick={() => selectProduct(storyProduct)}
            aria-label="Ver el bordado de la Gorra Familia Marino"
          >
            <img
              src={storyProduct.image}
              alt="Bordado Familia en azul marino y amarillo de Súper Suero"
              loading="lazy"
              width="1254"
              height="1254"
            />
            <span className="rt-story-art-top">EL VÍNCULO QUE NOS UNE.</span>
            <span className="rt-story-word">FAMILIA.</span>
            <span className="rt-story-art-bottom">
              <span>EL DETALLE TIENE HISTORIA.</span>
              <span>
                VER LA PIEZA <ArrowUpRight size={19} />
              </span>
            </span>
          </button>
          <div className="rt-story-copy">
            <span className="rt-eyebrow">NUESTRO JUEGO</span>
            <h2 id="story-title" tabIndex={-1}>
              De la cancha.
              <br />
              Para la calle.
              <br />
              <em>Para los tuyos.</em>
            </h2>
            <p>
              Súper Suero es la marca de Ángel Gerardo Suero Castillo, jugador
              de baloncesto dominicano. Una extensión de su identidad y de la
              gente que lo acompaña.
            </p>
            <p>
              La S, los colores y el bordado Familia llevan esa conexión a
              piezas para el día a día.
            </p>
            <div className="rt-founder">
              <img
                src={asset("brand-logo.jpg")}
                alt=""
                width="44"
                height="44"
              />
              <span>
                <strong>Ángel Gerardo Suero Castillo</strong>
                <small>EL JUGADOR DETRÁS DE LA MARCA.</small>
              </span>
            </div>
            <a
              href={instagram}
              target="_blank"
              rel="noreferrer"
              className="rt-text-link"
            >
              Sigue la historia en Instagram <ArrowUpRight size={17} />
            </a>
          </div>
        </section>

        <section
          className="rt-order-guide rt-section"
          id="how-to-order"
          aria-labelledby="order-title"
        >
          <div className="rt-section-heading">
            <div>
              <span className="rt-eyebrow">TU PRÓXIMA PIEZA, PASO A PASO</span>
              <h2 id="order-title">Así la haces tuya.</h2>
            </div>
            <a
              className="rt-text-link"
              href={instagram}
              target="_blank"
              rel="noreferrer"
            >
              Habla con el equipo <ArrowUpRight size={17} />
            </a>
          </div>
          <div className="rt-order-steps">
            <div>
              <span>01</span>
              <h3>Encuentra tu estilo.</h3>
              <p>
                Explora las colecciones, mira los detalles y elige tu talla si
                llevas shorts.
              </p>
            </div>
            <div>
              <span>02</span>
              <h3>Prepara tu bolsa.</h3>
              <p>
                Añade tus piezas y copia el resumen de tu selección con modelos,
                tallas y cantidades.
              </p>
            </div>
            <div>
              <span>03</span>
              <h3>Confirma por mensaje.</h3>
              <p>
                Envíalo a @supersuerohats. El equipo confirma disponibilidad,
                envío y pago antes de cerrar tu pedido.
              </p>
            </div>
          </div>
          <div className="rt-faq">
            <h3>Antes de pedir.</h3>
            <div>
              <details>
                <summary>¿Cómo elijo la talla?</summary>
                <p>
                  Las gorras del catálogo son ajustables. Los shorts se muestran
                  en M, L y XL. Si tienes dudas sobre el ajuste, consulta las
                  medidas al equipo antes de confirmar.
                </p>
              </details>
              <details>
                <summary>¿Cuánto cuesta el envío y cómo pago?</summary>
                <p>
                  El equipo te confirma las opciones, el costo de envío a tu
                  localidad y las formas de pago por mensaje. El subtotal de la
                  bolsa no incluye envío.
                </p>
              </details>
              <details>
                <summary>¿Qué pasa si necesito un cambio?</summary>
                <p>
                  Consulta las condiciones de cambio con @supersuerohats antes
                  de confirmar tu pedido. Conserva la conversación y el
                  comprobante de compra para cualquier consulta.
                </p>
              </details>
            </div>
          </div>
        </section>
      </main>

      <footer className="rt-footer">
        <div className="rt-footer-top">
          <div>
            <a href="#top" aria-label="Súper Suero — volver al inicio">
              <Logo light />
            </a>
            <p>
              El juego es tuyo.
              <br />
              El estilo también.
            </p>
            <a
              className="rt-social"
              href={instagram}
              target="_blank"
              rel="noreferrer"
            >
              <Instagram size={18} /> @supersuerohats <ArrowUpRight size={14} />
            </a>
          </div>
          <div>
            <h2>La colección</h2>
            <button onClick={() => goShop("Signature S")}>Signature S</button>
            <button onClick={() => goShop("Familia")}>Familia</button>
            <button onClick={() => goShop("Dominicana")}>Dominicana</button>
            <button onClick={() => goShop("Shorts")}>Shorts</button>
          </div>
          <div>
            <h2>Estamos aquí</h2>
            <a href="#how-to-order">Cómo pedir</a>
            <a href="#how-to-order">Tallas, envíos y cambios</a>
            <a href={instagram} target="_blank" rel="noreferrer">
              Contactar por Instagram
            </a>
            <a href="#brand-story">Nuestra historia</a>
          </div>
          <div className="rt-footer-brandline">
            <span>CON IDENTIDAD.</span>
            <strong>
              CON LOS
              <br />
              TUYOS.
            </strong>
            <span>REPÚBLICA DOMINICANA</span>
          </div>
        </div>
        <div className="rt-footer-bottom">
          <span>© {new Date().getFullYear()} Súper Suero. Hats + Shorts.</span>
          <span>RD$ · ESPAÑOL</span>
          <a href="?view=admin-demo">
            Vista de gestión · demo <ArrowUpRight size={12} />
          </a>
        </div>
      </footer>
      <ProductDialog
        key={selected?.id || "closed"}
        product={selected}
        view={detailMode}
        onViewChange={(mode) => selectProduct(selected, mode)}
        onClose={() => selectProduct(null)}
        onAdd={add}
      />
      <BagDialog
        open={bagOpen}
        onClose={() => setBagOpen(false)}
        cart={cart}
        onQuantity={(id, size, quantity) =>
          setCart((current) =>
            current.map((line) =>
              line.id === id && line.size === size
                ? { ...line, quantity: Math.max(1, Math.min(20, quantity)) }
                : line,
            ),
          )
        }
        onRemove={(id, size) =>
          setCart((current) =>
            current.filter((line) => !(line.id === id && line.size === size)),
          )
        }
      />
      {notice && (
        <span className="rt-sr-only" role="status">
          {notice}
        </span>
      )}
    </div>
  );
}
