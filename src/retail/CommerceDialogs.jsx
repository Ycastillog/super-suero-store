import React, {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  Camera as Instagram,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
  ZoomIn,
  ZoomOut,
  Play,
  Pause,
} from "lucide-react";
import MotionPreview from "./MotionPreview";
import "./commerce.css";

const money = (amount) => `RD$${new Intl.NumberFormat("es-DO").format(amount)}`;
const clampQuantity = (value) =>
  Math.max(1, Math.min(20, Math.floor(Number(value) || 1)));

function DialogFrame({ open, onClose, titleId, children, drawer = false }) {
  const frameRef = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useLayoutEffect(() => {
    if (!open) return undefined;
    const opener = document.activeElement;
    const root = document.getElementById("root");
    const previousInert = root?.inert;
    const overflow = document.body.style.overflow;
    const padding = document.body.style.paddingRight;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;
    if (root) root.inert = true;
    frameRef.current
      ?.querySelector("[data-dialog-close]")
      ?.focus({ preventScroll: true });
    const keydown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeRef.current();
        return;
      }
      if (event.key !== "Tab") return;
      const controls = [
        ...frameRef.current.querySelectorAll(
          'button:not(:disabled),a[href],input:not(:disabled),select,textarea,[tabindex="0"]',
        ),
      ].filter((node) => node.getClientRects().length);
      const first = controls[0];
      const last = controls.at(-1);
      if (!first) {
        event.preventDefault();
        frameRef.current.focus();
        return;
      }
      if (
        event.shiftKey &&
        (document.activeElement === first ||
          !frameRef.current.contains(document.activeElement))
      ) {
        event.preventDefault();
        last.focus();
      }
      if (
        !event.shiftKey &&
        (document.activeElement === last ||
          !frameRef.current.contains(document.activeElement))
      ) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", keydown);
    return () => {
      document.removeEventListener("keydown", keydown);
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = padding;
      if (root) root.inert = previousInert;
      const target = opener?.isConnected
        ? opener
        : document.querySelector(".rt-bag-trigger");
      target?.focus({ preventScroll: true });
    };
  }, [open]);
  if (!open) return null;
  return createPortal(
    <div
      className={`rt-dialog-layer ${drawer ? "rt-dialog-layer--drawer" : ""}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        ref={frameRef}
        className={drawer ? "rt-bag-dialog" : "rt-detail-dialog"}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        {children}
      </section>
    </div>,
    document.body,
  );
}

function Quantity({ value, onChange, label }) {
  const [draft, setDraft] = useState(String(value));
  useEffect(() => setDraft(String(value)), [value]);
  const commit = () => {
    const next = clampQuantity(draft);
    setDraft(String(next));
    onChange(next);
  };
  return (
    <div className="rt-quantity">
      <button
        type="button"
        aria-label={`Disminuir cantidad de ${label}`}
        disabled={value <= 1}
        onClick={() => onChange(value - 1)}
      >
        <Minus size={15} />
      </button>
      <input
        type="number"
        min="1"
        max="20"
        step="1"
        value={draft}
        aria-label={`Cantidad de ${label}`}
        onChange={(event) => {
          const next = event.target.value;
          setDraft(next);
          if (
            next !== "" &&
            Number.isInteger(Number(next)) &&
            Number(next) >= 1 &&
            Number(next) <= 20
          )
            onChange(Number(next));
        }}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === "Enter") event.currentTarget.blur();
        }}
      />
      <button
        type="button"
        aria-label={`Aumentar cantidad de ${label}`}
        disabled={value >= 20}
        onClick={() => onChange(value + 1)}
      >
        <Plus size={15} />
      </button>
    </div>
  );
}

export function ProductDialog({ product, onClose, onAdd }) {
  const id = useId();
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("");
  const [imageIndex, setImageIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [photoPlaying, setPhotoPlaying] = useState(false);
  const [share, setShare] = useState({ status: "idle", url: "" });
  const photoViewportRef = useRef(null);
  const shareInputRef = useRef(null);
  const shareRequestRef = useRef(0);
  useEffect(() => {
    setQuantity(1);
    setSize("");
    setImageIndex(0);
    setPhotoPlaying(false);
    setShare({ status: "idle", url: "" });
    return () => {
      shareRequestRef.current += 1;
    };
  }, [product?.id]);
  const gallery = product
    ? [...new Set([product.image, ...(product.gallery || [])].filter(Boolean))]
    : [];
  const image = gallery[imageIndex] || gallery[0];
  useLayoutEffect(() => {
    setZoomed(false);
  }, [product?.id, image]);
  useLayoutEffect(() => {
    const viewport = photoViewportRef.current;
    if (!viewport) return;
    viewport.scrollTop = 0;
    viewport.scrollLeft = 0;
  }, [zoomed, product?.id, image]);
  useLayoutEffect(() => {
    if (zoomed) photoViewportRef.current?.focus({ preventScroll: true });
  }, [zoomed]);
  useLayoutEffect(() => {
    if (share.status !== "manual") return;
    shareInputRef.current?.focus();
    shareInputRef.current?.select();
  }, [share]);
  const copyProductLink = async () => {
    const request = ++shareRequestRef.current;
    const url = window.location.href;
    setShare({ status: "copying", url });
    try {
      await navigator.clipboard.writeText(url);
      if (request === shareRequestRef.current) {
        setShare({ status: "copied", url });
      }
    } catch {
      if (request === shareRequestRef.current) {
        setShare({ status: "manual", url });
      }
    }
  };
  const short = product?.category === "Shorts";
  return (
    <DialogFrame open={Boolean(product)} onClose={onClose} titleId={id}>
      {product && (
        <>
          <div className="rt-detail-heading">
            <span className="rt-detail-kicker">SÚPER SUERO · LA PIEZA</span>
            <button
              type="button"
              className="rt-dialog-close"
              data-dialog-close
              aria-label="Cerrar detalle del producto"
              onClick={onClose}
            >
              <X size={22} />
            </button>
          </div>
          <div className="rt-detail-body">
            <div className="rt-detail-visual">
              <div className="rt-detail-photo-frame">
                <div
                  ref={photoViewportRef}
                  id={`${id}-photo`}
                  className="rt-detail-photo-viewport"
                  role="region"
                  aria-label={`Foto${zoomed ? " ampliada" : ""} de ${product.name}`}
                  aria-describedby={zoomed ? `${id}-zoom-help` : undefined}
                  tabIndex={zoomed ? 0 : -1}
                >
                  <div
                    className={`rt-detail-photo${zoomed ? " rt-detail-photo--zoomed" : ""}`}
                  >
                    <MotionPreview
                      key={image}
                      images={[image]}
                      alt={product.name}
                      playing={photoPlaying && !zoomed}
                    />
                  </div>
                </div>
              </div>
              <div className="rt-detail-photo-actions">
                <button
                  type="button"
                  className="rt-commerce-button rt-commerce-button--outline"
                  aria-controls={`${id}-photo`}
                  aria-pressed={zoomed}
                  onClick={() => {
                    setPhotoPlaying(false);
                    setZoomed((current) => !current);
                  }}
                >
                  {zoomed ? <ZoomOut size={17} /> : <ZoomIn size={17} />}
                  {zoomed ? "Ver foto completa" : "Ampliar foto"}
                </button>
                {!zoomed && (
                  <button
                    type="button"
                    className="rt-commerce-button rt-commerce-button--outline"
                    aria-label={
                      photoPlaying
                        ? "Pausar movimiento de la foto"
                        : "Reproducir movimiento de la foto"
                    }
                    aria-pressed={photoPlaying}
                    onClick={() => setPhotoPlaying((current) => !current)}
                  >
                    {photoPlaying ? <Pause size={16} /> : <Play size={16} />}
                    {photoPlaying ? "Pausar" : "Ver en movimiento"}
                  </button>
                )}
                {zoomed && (
                  <p id={`${id}-zoom-help`}>
                    Con la foto enfocada, usa las flechas para recorrerla.
                    También puedes usar el gesto táctil o las barras de
                    desplazamiento.
                  </p>
                )}
              </div>
              {gallery.length > 1 && (
                <div
                  className="rt-detail-thumbs"
                  aria-label="Fotografías del producto"
                >
                  {gallery.map((image, index) => (
                    <button
                      key={image}
                      onClick={() => {
                        setPhotoPlaying(false);
                        setImageIndex(index);
                      }}
                      aria-label={`Ver foto ${index + 1} de ${product.name}`}
                      aria-pressed={imageIndex === index}
                    >
                      <img src={image} alt="" width="60" height="60" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="rt-detail-copy">
              <span className="rt-detail-kicker">
                {product.category} / {product.code}
              </span>
              <h2 id={id}>{product.name}</h2>
              <p className="rt-detail-subtitle">{product.subtitle}</p>
              <strong className="rt-detail-price">
                {money(product.price)}
              </strong>
              <p className="rt-detail-description">{product.description}</p>
              <ul className="rt-detail-list">
                {product.details.map((detail) => (
                  <li key={detail}>
                    <Check size={15} />
                    {detail}
                  </li>
                ))}
              </ul>
              {short ? (
                <fieldset className="rt-sizes">
                  <legend>Elige tu talla</legend>
                  <div>
                    {["M", "L", "XL"].map((option) => (
                      <button
                        type="button"
                        key={option}
                        onClick={() => setSize(option)}
                        aria-pressed={size === option}
                        aria-label={`Talla ${option}`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <small>
                    Consulta las medidas y el diseño disponible por mensaje.
                  </small>
                </fieldset>
              ) : (
                <p className="rt-detail-fit">Talla única · Ajustable</p>
              )}
              <div className="rt-detail-buy">
                <Quantity
                  value={quantity}
                  onChange={setQuantity}
                  label={product.name}
                />
                <button
                  className="rt-commerce-button"
                  disabled={short && !size}
                  onClick={() => onAdd(product, quantity, size)}
                >
                  {short && !size ? "Selecciona tu talla" : "Añadir a la bolsa"}
                  <Plus size={17} />
                </button>
              </div>
              <p className="rt-detail-service">
                El equipo confirma disponibilidad, precio final, envío y pago
                por Instagram.
              </p>
              <div className="rt-detail-share">
                <button
                  type="button"
                  className="rt-commerce-button rt-commerce-button--outline"
                  disabled={share.status === "copying"}
                  onClick={copyProductLink}
                >
                  <Copy size={17} /> Compartir pieza
                </button>
                <span
                  className="rt-share-status"
                  role="status"
                  aria-live="polite"
                >
                  {share.status === "copied"
                    ? "Enlace copiado"
                    : share.status === "manual"
                      ? "Copia el enlace del campo para compartir esta pieza."
                      : ""}
                </span>
                {share.status === "manual" && (
                  <label className="rt-share-fallback">
                    Enlace de la pieza
                    <input
                      ref={shareInputRef}
                      type="text"
                      value={share.url}
                      readOnly
                      onFocus={(event) => event.currentTarget.select()}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </DialogFrame>
  );
}

export function BagDialog({ open, onClose, cart, onQuantity, onRemove }) {
  const id = useId();
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const summaryRef = useRef(null);
  const linesRef = useRef(null);
  const exploreRef = useRef(null);
  const removedLineRef = useRef(null);
  useLayoutEffect(() => {
    if (!open) {
      removedLineRef.current = null;
      return;
    }
    const removed = removedLineRef.current;
    if (
      !removed ||
      cart.some((item) => item.id === removed.id && item.size === removed.size)
    ) {
      return;
    }
    const buttons = linesRef.current?.querySelectorAll("[data-bag-remove]");
    const target =
      buttons?.[Math.min(removed.index, buttons.length - 1)] ||
      exploreRef.current;
    target?.focus();
    removedLineRef.current = null;
  }, [cart, open]);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const summary = `Hola, Súper Suero. Me gustaría consultar esta selección:\n\n${cart.map((item) => `${item.quantity} × ${item.name}${item.size ? ` · Talla ${item.size}` : ""}\nSKU: ${item.code} · ${money(item.price)} c/u`).join("\n\n")}\n\nSubtotal del catálogo: ${money(total)} (sin envío).\nPor favor, confirmar disponibilidad, precio final, envío y formas de pago.`;
  useEffect(() => {
    setCopied(false);
    setCopyError(false);
  }, [open, summary]);
  const copySelection = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopyError(true);
      requestAnimationFrame(() => {
        summaryRef.current?.focus();
        summaryRef.current?.select();
      });
    }
  };
  return (
    <DialogFrame open={open} onClose={onClose} titleId={id} drawer>
      <div className="rt-bag-heading">
        <div>
          <span className="rt-detail-kicker">TU SELECCIÓN</span>
          <h2 id={id}>
            Tu bolsa <span>({count})</span>
          </h2>
        </div>
        <button
          className="rt-dialog-close rt-dialog-close--bag"
          data-dialog-close
          onClick={onClose}
          aria-label="Cerrar bolsa"
        >
          <X size={23} />
        </button>
      </div>
      {cart.length ? (
        <>
          <div className="rt-bag-lines" ref={linesRef}>
            {cart.map((item, index) => (
              <article className="rt-bag-line" key={`${item.id}:${item.size}`}>
                <img
                  src={item.image}
                  alt={item.name}
                  width="100"
                  height="100"
                />
                <div>
                  <h3>{item.name}</h3>
                  <p>
                    {item.size
                      ? `Talla ${item.size}`
                      : "Ajustable · Talla única"}
                  </p>
                  <strong>{money(item.price * item.quantity)}</strong>
                  <div className="rt-bag-line-actions">
                    <Quantity
                      value={item.quantity}
                      onChange={(next) => onQuantity(item.id, item.size, next)}
                      label={`${item.name}${item.size ? ` talla ${item.size}` : ""}`}
                    />
                    <button
                      className="rt-bag-remove"
                      data-bag-remove
                      onClick={() => {
                        removedLineRef.current = {
                          id: item.id,
                          size: item.size,
                          index,
                        };
                        onRemove(item.id, item.size);
                      }}
                      aria-label={`Quitar ${item.name}${item.size ? ` talla ${item.size}` : ""} de la bolsa`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
            <div className="rt-bag-message">
              <Instagram size={20} />
              <div>
                <strong>Lo coordinamos contigo.</strong>
                <p>
                  Copia tu selección y envíala por mensaje. El equipo confirma
                  disponibilidad, envío y pago.
                </p>
              </div>
            </div>
            <details className="rt-order-summary" open={copyError || undefined}>
              <summary>Ver resumen para enviar</summary>
              <textarea
                ref={summaryRef}
                aria-label="Resumen de tu selección para Instagram"
                value={summary}
                readOnly
                rows={10}
              />
            </details>
          </div>
          <div className="rt-bag-bottom">
            <div className="rt-bag-total">
              <span>Subtotal</span>
              <strong>{money(total)}</strong>
            </div>
            <p>Envío y precio final por confirmar con el equipo.</p>
            <button className="rt-commerce-button" onClick={copySelection}>
              {copied ? (
                <>
                  <Check size={18} /> Selección copiada
                </>
              ) : (
                <>
                  <Copy size={17} /> 1. Copiar selección
                </>
              )}
            </button>
            <a
              className="rt-commerce-button rt-commerce-button--outline"
              href="https://www.instagram.com/supersuerohats/"
              target="_blank"
              rel="noreferrer"
            >
              2. Abrir Instagram <ArrowUpRight size={18} />
            </a>
            <span className="rt-copy-status" role="status" aria-live="polite">
              {copyError
                ? "Selecciona el texto del resumen y cópialo manualmente."
                : copied
                  ? "Listo. Pega el resumen en tu mensaje a @supersuerohats."
                  : "Tu selección se guarda en este navegador."}
            </span>
          </div>
        </>
      ) : (
        <div className="rt-empty-bag">
          <ShoppingBag size={42} strokeWidth={1} />
          <h3>Tu próximo estilo empieza aquí.</h3>
          <p>Explora las colecciones y guarda las piezas que van contigo.</p>
          <button
            ref={exploreRef}
            className="rt-commerce-button"
            onClick={onClose}
          >
            Seguir explorando <ArrowRight size={18} />
          </button>
        </div>
      )}
    </DialogFrame>
  );
}
