import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  Box,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  CreditCard,
  Ellipsis,
  Eye,
  Filter,
  Grid2X2,
  Heart,
  LayoutDashboard,
  Menu,
  Minus,
  PackageCheck,
  Plus,
  Search,
  Settings2,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Tag,
  TrendingUp,
  Truck,
  Users,
  X,
} from 'lucide-react';
import './styles.css';
import './identity.css';

const publicAsset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
const studioAsset = (path) => publicAsset(path.replace('products/caps/', 'products/caps/studio/'));

const products = [
  {
    id: 'ss-cap-red-white',
    name: 'Gorra S Crema / Roja',
    subtitle: 'Crema y roja / ajustable',
    category: 'Gorras',
    price: 1700,
    stock: 10,
    sold: 0,
    accent: 'red',
    badge: 'Disponible',
    code: 'SS-HAT-001',
    image: studioAsset('products/caps/red-white-s-front.jpg'),
    gallery: [studioAsset('products/caps/red-white-s-front.jpg'), studioAsset('products/caps/red-white-s-detail.jpg')],
    imagePosition: 'center 48%',
    description: 'Crown crema con visera roja y la S bordada al frente. Una combinación limpia para representar lo tuyo.',
    details: ['Logo S bordado', 'Visera curva', 'Cierre ajustable', '100% original'],
  },
  {
    id: 'ss-cap-cream-black',
    name: 'Gorra S Crema / Negra',
    subtitle: 'Crema y negra / ajustable',
    category: 'Gorras',
    price: 1700,
    stock: 10,
    sold: 0,
    accent: 'cromo',
    badge: 'Disponible',
    code: 'SS-HAT-002',
    image: studioAsset('products/caps/cream-black-s.jpg'),
    imagePosition: 'center',
    description: 'El contraste crema y negro hace que el logo S sea el protagonista. Simple, fuerte y fácil de combinar.',
    details: ['Logo S bordado', 'Visera negra', 'Cierre ajustable', '100% original'],
  },
  {
    id: 'ss-cap-familia-navy',
    name: 'Gorra Familia Marino',
    subtitle: 'Azul marino y negra / bordado Familia',
    category: 'Gorras',
    price: 1700,
    stock: 10,
    sold: 0,
    accent: 'navy',
    badge: 'Nuevo modelo',
    code: 'SS-HAT-003',
    image: studioAsset('products/caps/familia-navy-front.jpg'),
    gallery: [studioAsset('products/caps/familia-navy-front.jpg'), studioAsset('products/caps/familia-navy-side.jpg')],
    imagePosition: 'center 43%',
    description: 'Una pieza para los tuyos: bordado Familia sobre azul marino, con visera negra y ajuste clásico.',
    details: ['Bordado Familia', 'Azul marino / negro', 'Cierre ajustable', '100% original'],
  },
  {
    id: 'ss-cap-familia-white-blue',
    name: 'Gorra Familia Blanca / Azul',
    subtitle: 'Blanca y azul / bordado Familia',
    category: 'Gorras',
    price: 1700,
    stock: 10,
    sold: 0,
    accent: 'cromo',
    badge: 'Nuevo modelo',
    code: 'SS-HAT-004',
    image: studioAsset('products/caps/familia-white-blue-detail.jpg'),
    gallery: [studioAsset('products/caps/familia-white-blue-detail.jpg'), studioAsset('products/caps/familia-white-blue-front.jpg')],
    imagePosition: 'center 44%',
    description: 'Blanca con visera azul y bordado Familia. Una opción fresh para la calle, la cancha y la familia.',
    details: ['Bordado Familia', 'Blanca / azul', 'Cierre ajustable', '100% original'],
  },
  {
    id: 'ss-cap-corduroy',
    name: 'Gorra S Corduroy',
    subtitle: 'Negra y camel / textura corduroy',
    category: 'Gorras',
    price: 1700,
    stock: 10,
    sold: 0,
    accent: 'ink',
    badge: 'Disponible',
    code: 'SS-HAT-005',
    image: studioAsset('products/caps/corduroy-black-camel.jpg'),
    imagePosition: 'center 48%',
    description: 'Corduroy negra con visera camel y logo S en acabado cálido. Una gorra con textura y presencia.',
    details: ['Textura corduroy', 'Logo S bordado', 'Visera camel', 'Cierre ajustable'],
  },
  {
    id: 'ss-cap-tiger',
    name: 'Gorra S Tiger',
    subtitle: 'Blanca y negra / detalles laterales',
    category: 'Gorras',
    price: 1700,
    stock: 10,
    sold: 0,
    accent: 'cromo',
    badge: 'Disponible',
    code: 'SS-HAT-006',
    image: studioAsset('products/caps/tiger-white-black.jpg'),
    imagePosition: 'center 49%',
    description: 'Base blanca con visera negra, logo S y detalles laterales que le dan un carácter distinto.',
    details: ['Detalles laterales', 'Logo S bordado', 'Visera negra', 'Cierre ajustable'],
  },
  {
    id: 'ss-cap-domi',
    name: 'Gorra DOMI',
    subtitle: 'Roja, blanca y azul / edición dominicana',
    category: 'Gorras',
    price: 1700,
    stock: 10,
    sold: 0,
    accent: 'red',
    badge: 'Edición especial',
    code: 'SS-HAT-007',
    image: studioAsset('products/caps/domi-front.jpg'),
    gallery: [studioAsset('products/caps/domi-front.jpg'), studioAsset('products/caps/domi-side.jpg')],
    imagePosition: 'center 44%',
    description: 'La DOMI lleva los colores de casa al frente y el logo S en el lateral. Para representar lo nuestro.',
    details: ['Edición DOMI', 'Colores dominicanos', 'Logo S lateral', 'Cierre ajustable'],
  },
  {
    id: 'ss-cap-red-black',
    name: 'Gorra S Roja',
    subtitle: 'Roja y negra / logo bordado',
    category: 'Gorras',
    price: 1700,
    stock: 10,
    sold: 0,
    accent: 'red',
    badge: 'Disponible',
    code: 'SS-HAT-008',
    image: studioAsset('products/caps/red-black-s.jpg'),
    imagePosition: 'center 48%',
    description: 'Roja con visera negra y logo S en blanco. Una pieza directa, deportiva y fácil de reconocer.',
    details: ['Logo S bordado', 'Roja / negra', 'Visera curva', 'Cierre ajustable'],
  },
  {
    id: 'ss-cap-yellow-black',
    name: 'Gorra S Amarilla',
    subtitle: 'Amarilla y negra / logo bordado',
    category: 'Gorras',
    price: 1700,
    stock: 10,
    sold: 0,
    accent: 'yellow',
    badge: 'Disponible',
    code: 'SS-HAT-009',
    image: studioAsset('products/caps/yellow-black-s.jpg'),
    imagePosition: 'center 48%',
    description: 'El color amarillo pone la energía; la visera negra y la S bordada mantienen la identidad Súper Suero.',
    details: ['Logo S bordado', 'Amarilla / negra', 'Visera curva', 'Cierre ajustable'],
  },
  {
    id: 'ss-cap-caribe',
    name: 'Gorra Caribe Multicolor',
    subtitle: 'Paneles multicolor / banderas',
    category: 'Gorras',
    price: 1700,
    stock: 10,
    sold: 0,
    accent: 'caribe',
    badge: 'Edición especial',
    code: 'SS-HAT-010',
    image: studioAsset('products/caps/caribe-front.jpg'),
    gallery: [studioAsset('products/caps/caribe-front.jpg'), studioAsset('products/caps/caribe-flags-back.jpg')],
    imagePosition: 'center 46%',
    description: 'Una gorra de muchos colores y muchas historias, con banderas en la parte posterior y la S al frente.',
    details: ['Paneles multicolor', 'Banderas en la parte posterior', 'Logo S bordado', 'Cierre ajustable'],
  },
  {
    id: 'ss-cap-black-gold',
    name: 'Gorra S Negra / Dorada',
    subtitle: 'Negra y camel / logo dorado',
    category: 'Gorras',
    price: 1700,
    stock: 10,
    sold: 0,
    accent: 'ink',
    badge: 'Disponible',
    code: 'SS-HAT-011',
    image: studioAsset('products/caps/black-gold-side.jpg'),
    gallery: [studioAsset('products/caps/black-gold-side.jpg'), studioAsset('products/caps/black-gold-front.jpg')],
    imagePosition: 'center 47%',
    description: 'Negra con costuras blancas, visera camel y una S dorada que resalta desde cualquier ángulo.',
    details: ['Costuras de contraste', 'Logo S dorado', 'Visera camel', 'Cierre ajustable'],
  },
  {
    id: 'ss-cap-green-black',
    name: 'Gorra S Verde',
    subtitle: 'Verde y negra / logo blanco',
    category: 'Gorras',
    price: 1700,
    stock: 10,
    sold: 0,
    accent: 'signal',
    badge: 'Disponible',
    code: 'SS-HAT-012',
    image: studioAsset('products/caps/green-black-front.jpg'),
    gallery: [studioAsset('products/caps/green-black-front.jpg'), studioAsset('products/caps/green-black-back.jpg')],
    imagePosition: 'center 48%',
    description: 'Verde profunda con visera negra y logo S blanco. Un color distinto con la identidad intacta.',
    details: ['Logo S bordado', 'Verde / negra', 'Visera curva', 'Cierre ajustable'],
  },
  {
    id: 'ss-cap-peace',
    name: 'Gorra Peace',
    subtitle: 'Multicolor / mensaje PEACE',
    category: 'Gorras',
    price: 1700,
    stock: 10,
    sold: 0,
    accent: 'caribe',
    badge: 'Más comentada',
    code: 'SS-HAT-013',
    image: studioAsset('products/caps/peace-front.jpg'),
    gallery: [studioAsset('products/caps/peace-front.jpg'), studioAsset('products/caps/peace-back.jpg')],
    imagePosition: 'center 49%',
    description: 'La multicolor de la colección: S al frente, PEACE al costado y un mensaje que se ve desde lejos.',
    details: ['Paneles multicolor', 'Mensaje PEACE', 'Logo S bordado', 'Cierre ajustable'],
  },
  {
    id: 'ss-cap-pinstripe',
    name: 'Gorra S Pinstripe',
    subtitle: 'Crema con rayas / visera negra',
    category: 'Gorras',
    price: 1700,
    stock: 10,
    sold: 0,
    accent: 'cromo',
    badge: 'Nuevo modelo',
    code: 'SS-HAT-014',
    image: studioAsset('products/caps/pinstripe-cream.jpg'),
    imagePosition: 'center 47%',
    description: 'Base crema con rayas finas y visera negra. Un giro limpio y clásico del logo Súper Suero.',
    details: ['Rayas finas', 'Logo S bordado', 'Visera negra', 'Cierre ajustable'],
  },
  {
    id: 'ss-cap-respect',
    name: 'Gorra Respect',
    subtitle: 'Patchwork verde / mensaje RESPECT',
    category: 'Gorras',
    price: 1700,
    stock: 10,
    sold: 0,
    accent: 'lime',
    badge: 'Edición especial',
    code: 'SS-HAT-015',
    image: studioAsset('products/caps/respect-front.jpg'),
    gallery: [studioAsset('products/caps/respect-front.jpg'), studioAsset('products/caps/respect-side.jpg'), studioAsset('products/caps/respect-back.jpg')],
    imagePosition: 'center 50%',
    description: 'Patchwork verde, gris, blanco y negro con el mensaje RESPECT. Una de las piezas más únicas del drop.',
    details: ['Paneles patchwork', 'Mensaje RESPECT', 'Logo S bordado', 'Cierre ajustable'],
  },
  {
    id: 'ss-short-canchero',
    name: 'Short Súper Suero',
    subtitle: 'M / L / XL · para toda ocasión',
    category: 'Shorts',
    price: 1650,
    stock: 9,
    sold: 27,
    accent: 'navy',
    badge: 'Apertura',
    code: 'SS-SHT-001',
    image: publicAsset('products/shorts.jpg'),
    imagePosition: 'center 48%',
    description: 'Pantalones cortos para salir, jugar y ponerse en pinta. Con forro por dentro para que nunca pierdas tu flow.',
    details: ['Tallas M, L y XL', 'Forro interno', 'Para toda ocasión', 'RD$1,650'],
  },
];

const initialOrders = [
  { id: '#SS-1048', customer: 'Ray D. La Rosa', items: 2, total: 5150, status: 'En preparación', time: 'Hace 18 min', initials: 'RL', tone: 'blue' },
  { id: '#SS-1047', customer: 'Mara Valdez', items: 1, total: 2800, status: 'Enviado', time: 'Hace 42 min', initials: 'MV', tone: 'pink' },
  { id: '#SS-1046', customer: 'Domingo Reyes', items: 3, total: 7500, status: 'Entregado', time: 'Ayer, 5:36 PM', initials: 'DR', tone: 'yellow' },
  { id: '#SS-1045', customer: 'Ana Beltré', items: 1, total: 2350, status: 'Entregado', time: 'Ayer, 2:11 PM', initials: 'AB', tone: 'green' },
];

const money = (value) => `RD$${new Intl.NumberFormat('es-DO').format(value)}`;
const formatNumber = (value) => new Intl.NumberFormat('es-DO').format(value);
const cartLineKey = (item) => `${item.id}:${item.size || 'default'}`;

function requestStoreCategory(category) {
  window.dispatchEvent(new CustomEvent('super-suero:category', { detail: category }));
}

function BrandMark({ inverse = false, compact = false }) {
  return (
    <div className={`brand-mark ${inverse ? 'brand-mark--inverse' : ''} ${compact ? 'brand-mark--compact' : ''}`} aria-label="Súper Suero">
      <span className="brand-mark__seal">
        {inverse ? (
          <svg className="brand-mark__svg" viewBox="0 0 200 200" role="img" aria-label="Logo Súper Suero">
            <circle cx="100" cy="100" r="94" fill="none" stroke="currentColor" strokeWidth="3" />
            <circle cx="100" cy="100" r="84" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <text x="100" y="38" textAnchor="middle" fill="currentColor" fontSize="16" fontWeight="800" letterSpacing="1.1">SUPER SUERO</text>
            <text x="100" y="176" textAnchor="middle" fill="currentColor" fontSize="13" fontWeight="800" letterSpacing="1.4">HATS + SHORTS</text>
            <text x="35" y="108" textAnchor="middle" fill="currentColor" fontSize="19">★</text>
            <text x="165" y="108" textAnchor="middle" fill="currentColor" fontSize="19">★</text>
            <path d="M100 57 132 69 125 126 100 144 75 126 68 69Z" fill="none" stroke="currentColor" strokeWidth="4" />
            <text x="100" y="112" textAnchor="middle" fill="currentColor" fontSize="57" fontWeight="900" fontStyle="italic" letterSpacing="-7">S</text>
            <path d="M82 128c12 8 24 8 36 0M86 134c9-4 19-4 28 0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        ) : (
          <img className="brand-mark__image" src={publicAsset('brand-logo.jpg')} alt="Logo Súper Suero" />
        )}
      </span>
      {!compact && <span className="brand-mark__word">SÚPER<br /><em>SUERO</em></span>}
    </div>
  );
}

function ProductArt({ product, small = false, hero = false, imageOverride }) {
  const artClass = `product-art product-art--${product.accent} ${small ? 'product-art--small' : ''} ${hero ? 'product-art--hero' : ''}`;
  const image = imageOverride || product.image;
  if (image) {
    return (
      <div className={`${artClass} product-art--photo`} aria-hidden="true">
        <img src={image} alt="" style={{ objectPosition: product.imagePosition || 'center' }} />
        {!small && <span className="product-art__photo-tag">SÚPER SUERO</span>}
      </div>
    );
  }
  if (product.category === 'Shorts') {
    return (
      <div className={artClass} aria-hidden="true">
        <div className="short-art">
          <span className="short-art__waist" />
          <span className="short-art__left" />
          <span className="short-art__right" />
          <span className="short-art__logo">S</span>
        </div>
        <span className="product-art__ghost">{product.subtitle}</span>
        <span className="product-art__tag">SS / 01</span>
      </div>
    );
  }
  return (
    <div className={artClass} aria-hidden="true">
      <div className="cap-art">
        <span className="cap-art__crown"><span>S</span></span>
        <span className="cap-art__brim" />
        <span className="cap-art__seam" />
        <span className="cap-art__strap" />
      </div>
      {product.name.includes('Peace') && <span className="cap-art__word">PEACE</span>}
      {product.name.includes('Respect') && <span className="cap-art__word">RESPECT</span>}
      <span className="product-art__ghost">{product.subtitle}</span>
      <span className="product-art__tag">SÚPER SUERO</span>
      {product.accent === 'caribe' && <span className="product-art__confetti product-art__confetti--one" />}
      {product.accent === 'caribe' && <span className="product-art__confetti product-art__confetti--two" />}
    </div>
  );
}

function Sidebar({ page, setPage, cartCount, lowStockCount, onCart, mobileOpen, setMobileOpen }) {
  const go = (next) => {
    setPage(next);
    setMobileOpen(false);
  };
  return (
    <>
      <button className={`sidebar-backdrop ${mobileOpen ? 'is-visible' : ''}`} aria-label="Cerrar menú" onClick={() => setMobileOpen(false)} />
      <aside className={`sidebar ${mobileOpen ? 'is-open' : ''}`}>
        <div className="sidebar__top">
          <BrandMark inverse />
          <button className="icon-button sidebar__close" onClick={() => setMobileOpen(false)} aria-label="Cerrar menú"><X size={18} /></button>
        </div>
        <div className="sidebar__label">Workspace</div>
        <button className={`shop-switcher ${page === 'store' ? 'is-active' : ''}`} onClick={() => go('store')}>
          <span className="shop-switcher__avatar">S</span>
          <span><strong>Súper Suero</strong><small>Tienda oficial</small></span>
          <ChevronDown size={15} />
        </button>
        <nav className="sidebar__nav" aria-label="Navegación principal">
          <div className="sidebar__label">Gestionar</div>
          <button className={`sidebar-link ${page === 'store' ? 'is-active' : ''}`} onClick={() => go('store')}>
            <ShoppingBag size={17} /><span>Tienda</span><span className="sidebar-link__hint">Vista pública</span>
          </button>
          <button className={`sidebar-link ${page === 'dashboard' ? 'is-active' : ''}`} onClick={() => go('dashboard')}>
            <LayoutDashboard size={17} /><span>Resumen</span>
          </button>
          <button className={`sidebar-link ${page === 'inventory' ? 'is-active' : ''}`} onClick={() => go('inventory')}>
            <Box size={17} /><span>Inventario</span><span className="sidebar-link__count">{lowStockCount}</span>
          </button>
          <button className={`sidebar-link ${page === 'orders' ? 'is-active' : ''}`} onClick={() => go('orders')}>
            <CreditCard size={17} /><span>Pedidos</span><span className="sidebar-link__count sidebar-link__count--light">8</span>
          </button>
          <div className="sidebar__label sidebar__label--spaced">Marca</div>
          <button className="sidebar-link" onClick={() => go('store')}><Grid2X2 size={17} /><span>Colecciones</span></button>
          <button className="sidebar-link" onClick={() => go('store')}><Tag size={17} /><span>Descuentos</span></button>
        </nav>
        <div className="sidebar__bottom">
          <div className="sidebar__label">Cuenta</div>
          <button className="sidebar-link"><Settings2 size={17} /><span>Configuración</span></button>
          <button className="sidebar-link"><CircleHelp size={17} /><span>Ayuda</span></button>
          <div className="profile-row">
            <span className="profile-row__avatar">AG</span>
            <span><strong>Ángel G.</strong><small>Administrador</small></span>
            <Ellipsis size={17} />
          </div>
        </div>
      </aside>
      <button type="button" className="mobile-cart-button" onClick={onCart} aria-label="Abrir carrito">
        <ShoppingCart size={18} /><span>{cartCount}</span>
      </button>
    </>
  );
}

function Topbar({ page, setPage, setMobileOpen, onCart, cartCount, onAddProduct }) {
  const isStore = page === 'store';
  if (isStore) return (
    <header className="topbar topbar--storefront">
      <a className="storefront-brand" href="#top" aria-label="Súper Suero"><BrandMark /></a>
      <nav className="storefront-nav" aria-label="Navegación de tienda">
        <button type="button" onClick={() => requestStoreCategory('Gorras')}>Gorras</button><button type="button" onClick={() => requestStoreCategory('Shorts')}>Shorts</button><a href="#brand-story">La marca</a><a href="https://www.instagram.com/supersuerohats/" target="_blank" rel="noreferrer">Instagram ↗</a>
      </nav>
      <div className="topbar__actions">
        <button className="storefront-admin-link" onClick={() => setPage('dashboard')}>Acceso interno ↗</button>
        <a className="dm-link" href="https://www.instagram.com/supersuerohats/" target="_blank" rel="noreferrer">DM para pedidos <span>📩</span></a>
        <button className="cart-trigger" onClick={onCart} aria-label="Abrir bolsa de compra"><ShoppingCart size={17} /><span>Bolsa</span>{cartCount > 0 && <b>{cartCount}</b>}</button>
      </div>
    </header>
  );
  return (
    <header className="topbar">
      <div className="topbar__mobile-brand"><BrandMark compact inverse /></div>
      <button className="icon-button topbar__menu" onClick={() => setMobileOpen(true)} aria-label="Abrir menú"><Menu size={20} /></button>
      <div className="breadcrumbs">
        <span className="breadcrumbs__root">Súper Suero</span>
        <ChevronRight size={14} />
        <span>{isStore ? 'Tienda oficial' : page === 'inventory' ? 'Inventario' : page === 'orders' ? 'Pedidos' : 'Resumen'}</span>
      </div>
      <div className="topbar__actions">
        <button className="search-trigger"><Search size={16} /><span>Buscar</span><kbd>⌘ K</kbd></button>
        {isStore ? (
          <button className="cart-trigger" onClick={onCart}><ShoppingCart size={17} /><span>Carrito</span>{cartCount > 0 && <b>{cartCount}</b>}</button>
        ) : (
          <button className="topbar__primary" onClick={onAddProduct}><Plus size={16} /> Nuevo producto</button>
        )}
        <button className="notification-button" aria-label="Notificaciones"><Bell size={18} /><i /></button>
        <span className="topbar__avatar">AG</span>
      </div>
    </header>
  );
}

function AnnouncementStrip() {
  return (
    <div className="announcement-strip">
      <span>ORDENA HOY MISMO</span><i />
      <span>DM PARA PEDIDOS 📩</span><i />
      <span>ENVÍOS A TODO RD</span><i />
      <span>GORRAS Y SHORTS</span><i />
      <span>100% ORIGINALES</span>
    </div>
  );
}

function StorePage({ inventory, onAddToCart, onOpenProduct, setPage }) {
  const [category, setCategory] = useState('Todo');
  const [query, setQuery] = useState('');
  const catalogProducts = useMemo(() => products.map((product) => {
    const liveProduct = inventory.find((item) => item.id === product.id);
    return liveProduct ? { ...product, stock: liveProduct.stock, sold: liveProduct.sold } : product;
  }), [inventory]);
  useEffect(() => {
    const handleCategoryRequest = (event) => {
      setCategory(event.detail || 'Todo');
      requestAnimationFrame(() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    };
    window.addEventListener('super-suero:category', handleCategoryRequest);
    return () => window.removeEventListener('super-suero:category', handleCategoryRequest);
  }, []);
  const filteredProducts = useMemo(() => catalogProducts.filter((product) => {
    const matchCategory = category === 'Todo' || product.category === category;
    const matchQuery = `${product.name} ${product.subtitle} ${product.category} ${product.code}`.toLowerCase().includes(query.toLowerCase());
    return matchCategory && matchQuery;
  }), [catalogProducts, category, query]);

  return (
    <div className="store-page" id="top">
      <AnnouncementStrip />
      <section className="store-profile" aria-label="Perfil de Súper Suero">
        <div className="store-profile__identity">
          <div className="store-profile__avatar"><BrandMark compact /></div>
          <div className="store-profile__details">
            <div className="store-profile__handle"><h1>supersuerohats</h1><span>•••</span></div>
            <p className="store-profile__name">SÚPER SUERO GORRAS Y SHORTS</p>
            <div className="store-profile__stats"><span><strong>17</strong> publicaciones</span><span><strong>1,446</strong> seguidores</span><span><strong>12</strong> seguidos</span></div>
            <div className="store-profile__bio"><span>Marca de ropa</span><strong>Gorras y shorts</strong><p>Una marca del jugador de baloncesto dominicano:<br />Ángel Gerardo Suero Castillo<br />aka SÚPER SUERO<br />DM para pedidos 📩</p></div>
          </div>
        </div>
        <div className="store-profile__actions"><a className="profile-button profile-button--primary" href="#shop">Comprar ahora</a><a className="profile-button" href="https://www.instagram.com/supersuerohats/" target="_blank" rel="noreferrer">Enviar mensaje</a><a className="profile-button profile-button--icon" href="https://www.instagram.com/supersuerohats/" target="_blank" rel="noreferrer" aria-label="Abrir Instagram">✣</a></div>
        <div className="store-profile__tabs"><a className="is-active" href="#shop"><Grid2X2 size={17} /> Colección</a><a href="https://www.instagram.com/supersuerohats/" target="_blank" rel="noreferrer"><span className="profile-tab__ig">◎</span> Instagram</a><a href="#brand-story"><Heart size={17} /> La marca</a></div>
      </section>

      <section className="store-hero store-hero--identity">
        <div className="store-hero__copy">
          <div className="eyebrow eyebrow--light"><span className="eyebrow__dot" /> Nuevo drop <span className="eyebrow__line" /></div>
          <h2>Ponte<br /><em>peluche.</em></h2>
          <p>Gorras y shorts de Súper Suero. La marca de Ángel Gerardo Suero Castillo, para la cancha y para la calle.</p>
          <div className="store-hero__actions"><a className="button button--lime" href="#shop" onClick={() => setCategory('Gorras')}>Ver gorras <ArrowDownRight size={16} /></a><a className="text-button text-button--light" href="https://www.instagram.com/supersuerohats/" target="_blank" rel="noreferrer">Ver Instagram <ArrowUpRight size={15} /></a></div>
        </div>
        <div className="store-hero__art" aria-label="Gorras del nuevo drop">
          <div className="hero-photo hero-photo--back"><ProductArt product={products[1]} hero /></div>
          <div className="hero-photo hero-photo--front"><ProductArt product={products[0]} hero /></div>
          <div className="hero-seal"><BrandMark compact /><span>HATS + SHORTS<br />HECHO EN RD</span></div>
          <span className="hero-sticker hero-sticker--top">NUEVO<br />ARRIVAL</span>
          <span className="hero-number">01</span>
        </div>
        <div className="store-hero__side-note"><span>DESLIZA PARA VER</span><ArrowDownRight size={15} /></div>
      </section>

      <section className="story-row" id="brand-story">
        <div className="story-row__number">01</div>
        <div className="story-row__title"><span>Una marca del jugador</span><strong>dominicano.</strong></div>
        <p>Ángel Gerardo Suero Castillo, aka SÚPER SUERO. Gorras y shorts para representar lo tuyo dentro y fuera de la cancha.</p>
        <div className="story-row__mark"><BrandMark compact /><span>RD / 2026</span></div>
      </section>

      <section className="collection-section" id="shop">
        <div className="section-heading">
          <div><div className="eyebrow"><span className="eyebrow__dot" /> Gorras y shorts</div><h2>La colección <em>real.</em></h2></div>
          <div className="section-heading__aside"><span>{filteredProducts.length.toString().padStart(2, '0')} piezas · disponibles</span><div className="heading-rule" /></div>
        </div>
        <div className="catalog-toolbar">
          <div className="filter-tabs">
            {['Todo', 'Gorras', 'Shorts'].map((item) => <button key={item} type="button" className={category === item ? 'is-active' : ''} onClick={() => setCategory(item)} aria-pressed={category === item}>{item}</button>)}
          </div>
          <label className="catalog-search"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar piezas" aria-label="Buscar piezas" /></label>
        </div>
        <div className="product-grid">
          {filteredProducts.map((product, index) => <ProductCard key={product.id} product={product} index={index} onAdd={onAddToCart} onOpen={onOpenProduct} />)}
        </div>
        {filteredProducts.length === 0 && <div className="empty-state"><Search size={20} /><strong>No encontramos esa pieza</strong><span>Prueba con “gorra”, “short” o el nombre del modelo.</span></div>}
      </section>

      <section className="manifesto-section">
        <div className="manifesto-section__label">De la cancha / a la calle</div>
        <div className="manifesto-section__content"><span>Gorras que</span><strong>representan.</strong></div>
        <div className="manifesto-section__seal"><BrandMark inverse compact /><span>HECHO<br />EN RD</span></div>
      </section>

      <section className="social-proof-section">
        <div className="social-proof-section__heading"><div className="eyebrow"><span className="eyebrow__dot" /> Desde Instagram</div><h2>Síguenos en <em>la calle.</em></h2><p>Para novedades, colores y pedidos: <strong>@supersuerohats</strong>.</p></div>
        <div className="instagram-card"><div className="instagram-card__seal"><BrandMark /></div><div className="instagram-card__copy"><span className="instagram-card__handle">@supersuerohats</span><h3>Gorras y shorts.<br /><em>La que pega con tooo.</em></h3><p>Ordena hoy mismo por DM y mira los nuevos arrivals de Súper Suero.</p><a className="button button--dark" href="https://www.instagram.com/supersuerohats/" target="_blank" rel="noreferrer">Abrir Instagram <ArrowUpRight size={16} /></a></div><div className="instagram-card__mini-grid"><ProductArt product={products[3]} /><ProductArt product={products[1]} /><ProductArt product={products[5]} /></div></div>
      </section>

      <footer className="store-footer"><BrandMark /><div className="store-footer__links"><a href="#shop">Tienda</a><a href="#shop">Cambios</a><a href="#shop">Contacto</a><span>© 2026 Súper Suero / Hecho en RD</span></div><div className="store-footer__social"><a href="https://www.instagram.com/supersuerohats/" target="_blank" rel="noreferrer">IG</a><span>TK</span></div></footer>
    </div>
  );
}

function ProductCard({ product, index, onAdd, onOpen }) {
  const requiresSize = product.category === 'Shorts';
  return (
    <article className={`product-card product-card--${index === 0 ? 'featured' : 'standard'}`}>
      <button className="product-card__media" onClick={() => onOpen(product)} aria-label={`Ver ${product.name}`}><ProductArt product={product} /></button>
      <div className="product-card__info">
        <div><span className="product-card__category">{product.category}</span><h3>{product.name}</h3><p>{product.subtitle}</p></div>
        <span className="product-card__price">{money(product.price)}</span>
      </div>
      <div className="product-card__bottom"><span className={`stock-note ${product.stock < 6 ? 'stock-note--critical' : ''}`}><i /> {product.stock < 6 ? `Quedan ${product.stock}` : 'Disponible'}</span><button className="add-product-button" onClick={() => requiresSize ? onOpen(product) : onAdd(product)}><Plus size={16} /><span>{requiresSize ? 'Elegir talla' : 'Agregar'}</span></button></div>
      <span className="product-card__badge">{product.badge}</span>
    </article>
  );
}

function DashboardPage({ orders, inventory, onAddProduct, onNavigate }) {
  const [range, setRange] = useState('Últimos 30 días');
  const lowStock = inventory.filter((product) => product.stock <= 10);
  const freshOrders = orders.slice(initialOrders.length);
  const currentSales = 187450 + freshOrders.reduce((sum, order) => sum + order.total, 0);
  const currentOrderCount = 48 + freshOrders.length;
  const currentAverage = Math.round(currentSales / currentOrderCount);
  return (
    <div className="dashboard-page">
      <div className="page-heading page-heading--dashboard"><div><div className="eyebrow"><span className="eyebrow__dot" /> Domingo, 16 agosto 2026</div><h1>Buen día, Ángel <span>✦</span></h1><p>Este es el pulso de tu tienda hoy.</p></div><div className="page-heading__actions"><button className="outline-button"><Eye size={16} /> Vista previa</button><button className="button button--dark" onClick={onAddProduct}><Plus size={16} /> Nuevo producto</button></div></div>
      <div className="metric-grid">
        <MetricCard label="Ventas del mes" value={money(currentSales)} trend="12.8%" icon={<TrendingUp size={18} />} note="vs. mes anterior" accent="lime" />
        <MetricCard label="Pedidos" value={String(currentOrderCount)} trend="8.4%" icon={<ShoppingBag size={18} />} note="en este periodo" accent="blue" />
        <MetricCard label="Ticket promedio" value={money(currentAverage)} trend="4.2%" icon={<CreditCard size={18} />} note="vs. mes anterior" accent="pink" />
        <MetricCard label="Stock crítico" value={String(lowStock.length)} trend="Revisar" icon={<Box size={18} />} note="productos necesitan atención" accent="yellow" critical />
      </div>
      <div className="dashboard-grid dashboard-grid--top">
        <section className="panel sales-chart-panel"><div className="panel-heading"><div><span className="panel-kicker">Rendimiento</span><h2>Ventas de la tienda</h2></div><button className="select-button" onClick={() => setRange(range === 'Últimos 30 días' ? 'Últimos 7 días' : 'Últimos 30 días')}>{range}<ChevronDown size={14} /></button></div><div className="chart-summary"><strong>{money(currentSales)}</strong><span><ArrowUpRight size={14} /> 12.8%</span><small>Últimos 30 días</small></div><SalesChart /></section>
        <section className="panel category-panel"><div className="panel-heading"><div><span className="panel-kicker">Mix de ventas</span><h2>Por categoría</h2></div><button className="icon-button"><Ellipsis size={18} /></button></div><div className="donut-wrap"><div className="donut"><div className="donut__center"><strong>100%</strong><span>ventas</span></div></div><div className="donut-legend"><LegendRow color="purple" label="Gorras" value="58%" amount="RD$ 108,621" /><LegendRow color="lime" label="Shorts" value="31%" amount="RD$ 58,110" /><LegendRow color="blue" label="Accesorios" value="11%" amount="RD$ 20,719" /></div></div><div className="category-footer"><span><Users size={14} /> 117 clientes activos</span><ArrowUpRight size={15} /></div></section>
      </div>
      <div className="dashboard-grid dashboard-grid--bottom">
        <section className="panel orders-panel"><div className="panel-heading"><div><span className="panel-kicker">Actividad reciente</span><h2>Últimos pedidos</h2></div><button className="text-button" onClick={() => onNavigate('orders')}>Ver todos <ArrowUpRight size={15} /></button></div><OrderTable orders={orders.slice(0, 4)} compact /></section>
        <section className="panel inventory-alert-panel"><div className="panel-heading"><div><span className="panel-kicker">Atención necesaria</span><h2>Stock bajo</h2></div><button className="text-button" onClick={() => onNavigate('inventory')}>Gestionar <ArrowUpRight size={15} /></button></div><div className="low-stock-list">{lowStock.slice(0, 3).map((product) => <div className="low-stock-row" key={product.id}><div className={`low-stock-thumb low-stock-thumb--${product.accent}`}><ProductArt product={product} small /></div><div><strong>{product.name}</strong><span>{product.code}</span></div><div className="low-stock-count"><strong>{product.stock}</strong><span>unidades</span></div><ChevronRight size={16} /></div>)}</div></section>
      </div>
    </div>
  );
}

function MetricCard({ label, value, trend, note, icon, accent, critical }) {
  return <div className={`metric-card metric-card--${accent}`}><div className="metric-card__top"><span>{label}</span><span className="metric-card__icon">{icon}</span></div><div className="metric-card__value">{value}</div><div className={`metric-card__trend ${critical ? 'metric-card__trend--critical' : ''}`}>{!critical && <ArrowUpRight size={14} />}{trend}</div><small>{note}</small></div>;
}

function SalesChart() {
  const points = '0,138 32,128 64,132 96,104 128,112 160,89 192,96 224,69 256,81 288,52 320,59 352,32 384,43 416,18 448,31 480,6';
  const area = `${points} 480,160 0,160`;
  return <div className="sales-chart"><div className="sales-chart__y"><span>40K</span><span>30K</span><span>20K</span><span>10K</span><span>0</span></div><div className="sales-chart__plot"><svg viewBox="0 0 480 160" preserveAspectRatio="none" role="img" aria-label="Gráfica de ventas ascendentes"><defs><linearGradient id="chart-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#c5f700" stopOpacity="0.28" /><stop offset="1" stopColor="#c5f700" stopOpacity="0" /></linearGradient></defs><polygon points={area} fill="url(#chart-fill)" /><polyline points={points} fill="none" stroke="#b8e900" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /><circle cx="416" cy="18" r="5" fill="#b8e900" stroke="#20201c" strokeWidth="4" /></svg><div className="sales-chart__x"><span>18 jul</span><span>25 jul</span><span>01 ago</span><span>08 ago</span><span>15 ago</span></div></div></div>;
}

function LegendRow({ color, label, value, amount }) {
  return <div className="legend-row"><span className={`legend-row__dot legend-row__dot--${color}`} /><span>{label}</span><strong>{value}</strong><small>{amount}</small></div>;
}

function OrderTable({ orders, compact = false }) {
  return <div className={`order-table ${compact ? 'order-table--compact' : ''}`}><div className="order-table__head"><span>Pedido</span><span>Cliente</span><span>Estado</span><span>Total</span><span /></div>{orders.map((order) => <div className="order-row" key={order.id}><span className="order-id">{order.id}<small>{order.time}</small></span><span className="order-customer"><i className={`customer-avatar customer-avatar--${order.tone}`}>{order.initials}</i><span>{order.customer}<small>{order.items} {order.items === 1 ? 'pieza' : 'piezas'}</small></span></span><span className={`status-pill status-pill--${order.status.toLowerCase().replace(' ', '-')}`}><i />{order.status}</span><strong>{money(order.total)}</strong><button className="icon-button"><Ellipsis size={17} /></button></div>)}</div>;
}

function InventoryPage({ inventory, onAddProduct, onAdjustStock }) {
  const [filter, setFilter] = useState('Todos');
  const [search, setSearch] = useState('');
  const inventoryValue = inventory.reduce((sum, item) => sum + item.price * item.stock, 0);
  const filtered = inventory.filter((product) => {
    const matchesFilter = filter === 'Todos' || (filter === 'Stock bajo' ? product.stock <= 10 : product.category === filter);
    return matchesFilter && `${product.name} ${product.code}`.toLowerCase().includes(search.toLowerCase());
  });
  return <div className="subpage"><div className="page-heading"><div><div className="eyebrow"><span className="eyebrow__dot" /> Catálogo y existencias</div><h1>Inventario</h1><p>Controla cada pieza antes de que llegue a la calle.</p></div><div className="page-heading__actions"><button className="outline-button"><Filter size={16} /> Exportar</button><button className="button button--dark" onClick={onAddProduct}><Plus size={16} /> Nuevo producto</button></div></div><div className="inventory-summary"><div><span>Valor del inventario</span><strong>{money(inventoryValue)}</strong><small><ArrowUpRight size={13} /> calculado en tiempo real</small></div><div><span>Unidades disponibles</span><strong>{formatNumber(inventory.reduce((sum, item) => sum + item.stock, 0))}</strong><small>en {products.length} productos</small></div><div><span>Stock bajo</span><strong className="text-critical">{inventory.filter((item) => item.stock <= 10).length}</strong><small>requieren atención</small></div></div><section className="panel inventory-panel"><div className="inventory-toolbar"><div className="filter-tabs filter-tabs--panel">{['Todos', 'Gorras', 'Shorts', 'Stock bajo'].map((item) => <button key={item} type="button" className={filter === item ? 'is-active' : ''} onClick={() => setFilter(item)} aria-pressed={filter === item}>{item}</button>)}</div><label className="catalog-search"><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nombre o SKU" aria-label="Buscar inventario" /></label></div><div className="inventory-table"><div className="inventory-table__head"><span>Producto</span><span>Categoría</span><span>Precio</span><span>Disponibles</span><span>Vendidas</span><span>Estado</span><span /></div>{filtered.map((product) => <div className="inventory-table__row" key={product.id}><div className="inventory-product-cell"><div className={`inventory-thumb inventory-thumb--${product.accent}`}><ProductArt product={product} small /></div><span><strong>{product.name}</strong><small>{product.code}</small></span></div><span>{product.category}</span><strong>{money(product.price)}</strong><span className={`inventory-quantity ${product.stock <= 10 ? 'inventory-quantity--low' : ''}`}><b>{product.stock}</b> uds.</span><span>{product.sold}</span><span className={`inventory-status ${product.stock <= 5 ? 'inventory-status--critical' : product.stock <= 10 ? 'inventory-status--low' : ''}`}><i />{product.stock <= 5 ? 'Crítico' : product.stock <= 10 ? 'Bajo' : 'Saludable'}</span><button className="icon-button" onClick={() => onAdjustStock(product)} aria-label={`Ajustar stock de ${product.name}`}><Ellipsis size={17} /></button></div>)}</div></section></div>;
}

function OrdersPage({ orders, onNavigate }) {
  return <div className="subpage"><div className="page-heading"><div><div className="eyebrow"><span className="eyebrow__dot" /> Flujo de ventas</div><h1>Pedidos</h1><p>Todo lo que está pasando después de cada compra.</p></div><div className="page-heading__actions"><button className="outline-button"><Filter size={16} /> Filtrar</button><button className="button button--dark" onClick={() => onNavigate('store')}><ShoppingBag size={16} /> Ver tienda</button></div></div><div className="order-summary"><div><span>Pedidos totales</span><strong>48</strong><small><ArrowUpRight size={13} /> 8.4% este periodo</small></div><div><span>Por preparar</span><strong>7</strong><small><Clock3 size={13} /> requieren acción</small></div><div><span>En camino</span><strong>12</strong><small><Truck size={13} /> con courier</small></div><div><span>Entregados</span><strong>29</strong><small><PackageCheck size={13} /> completados</small></div></div><section className="panel orders-full-panel"><div className="panel-heading"><div><span className="panel-kicker">Historial</span><h2>Todos los pedidos</h2></div><label className="catalog-search"><Search size={15} /><input placeholder="Buscar pedido o cliente" aria-label="Buscar pedidos" /></label></div><OrderTable orders={orders} /></section></div>;
}

function CartDrawer({ cart, setCart, inventory, isOpen, onClose, onCheckout }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const getStock = (item) => inventory.find((product) => product.id === item.id)?.stock ?? item.stock;
  const updateQuantity = (lineKey, delta) => setCart((current) => current.map((item) => cartLineKey(item) === lineKey ? { ...item, quantity: Math.min(getStock(item), Math.max(1, item.quantity + delta)) } : item));
  const remove = (lineKey) => setCart((current) => current.filter((item) => cartLineKey(item) !== lineKey));
  return <><button className={`drawer-backdrop ${isOpen ? 'is-open' : ''}`} onClick={onClose} aria-label="Cerrar carrito" /><aside className={`cart-drawer ${isOpen ? 'is-open' : ''}`} role="dialog" aria-modal="true" aria-labelledby="cart-title" aria-hidden={!isOpen}><div className="cart-drawer__header"><div><span className="eyebrow"><span className="eyebrow__dot" /> Tu selección</span><h2 id="cart-title">Carrito <small>{cart.length} {cart.length === 1 ? 'pieza' : 'piezas'}</small></h2></div><button className="icon-button" onClick={onClose} aria-label="Cerrar carrito"><X size={19} /></button></div>{cart.length === 0 ? <div className="cart-empty"><div className="cart-empty__icon"><ShoppingBag size={22} /></div><h3>Tu carrito está vacío</h3><p>Agrega una pieza para empezar a representar lo tuyo.</p><button className="button button--dark" onClick={onClose}>Explorar colección</button></div> : <><div className="cart-drawer__items">{cart.map((item) => <div className="cart-item" key={cartLineKey(item)}><div className={`cart-item__thumb cart-item__thumb--${item.accent}`}><ProductArt product={item} small /></div><div className="cart-item__copy"><div><strong>{item.name}</strong><span>{item.subtitle}{item.size ? ` · Talla ${item.size}` : ''}</span></div><b>{money(item.price)}</b><div className="quantity-control"><button onClick={() => updateQuantity(cartLineKey(item), -1)} aria-label="Disminuir cantidad"><Minus size={13} /></button><span>{item.quantity}</span><button onClick={() => updateQuantity(cartLineKey(item), 1)} aria-label="Aumentar cantidad"><Plus size={13} /></button><button className="quantity-control__remove" onClick={() => remove(cartLineKey(item))} aria-label={`Eliminar ${item.name}`}><X size={13} /></button></div></div></div>)}</div><div className="cart-drawer__footer"><div className="cart-total"><span>Subtotal</span><strong>{money(total)}</strong></div><small>Envío calculado al solicitar el pedido.</small><button className="button button--lime button--full" onClick={onCheckout}>Solicitar pedido <ArrowUpRight size={16} /></button><span className="secure-note"><Check size={13} /> Solicitud registrada · confirmación por DM</span></div></>}</aside></>;
}

function ProductModal({ product, onClose, onAdd }) {
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product?.image || '');
  const [size, setSize] = useState('');
  useEffect(() => {
    setQuantity(1);
    setActiveImage(product?.image || '');
    setSize('');
  }, [product]);
  useEffect(() => {
    if (!product) return undefined;
    const handleKeyDown = (event) => { if (event.key === 'Escape') onClose(); };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', handleKeyDown); };
  }, [product, onClose]);
  if (!product) return null;
  const gallery = product.gallery?.length ? product.gallery : [product.image];
  const requiresSize = product.category === 'Shorts';
  return <><button className="modal-backdrop" onClick={onClose} aria-label="Cerrar detalle" /><div className="product-modal" role="dialog" aria-modal="true" aria-labelledby="product-modal-title"><button className="icon-button product-modal__close" onClick={onClose} aria-label="Cerrar detalle"><X size={19} /></button><div className="product-modal__visual"><ProductArt product={product} imageOverride={activeImage} />{gallery.length > 1 && <div className="product-modal__gallery" aria-label="Fotos del producto">{gallery.map((image, index) => <button key={image} type="button" className={activeImage === image ? 'is-active' : ''} onClick={() => setActiveImage(image)} aria-current={activeImage === image ? 'true' : undefined} aria-label={`Ver foto ${index + 1} de ${product.name}`}><img src={image} alt="" /></button>)}</div>}</div><div className="product-modal__copy"><span className="eyebrow"><span className="eyebrow__dot" /> {product.category} · {product.code}</span><h2 id="product-modal-title">{product.name}</h2><p className="product-modal__subtitle">{product.subtitle}</p><strong className="product-modal__price">{money(product.price)}</strong><p className="product-modal__description">{product.description}</p><div className="detail-list">{product.details.map((detail) => <span key={detail}><Check size={14} />{detail}</span>)}</div>{requiresSize && <label className="size-picker"><span>Talla</span><select value={size} onChange={(event) => setSize(event.target.value)}><option value="">Selecciona una talla</option><option value="M">M</option><option value="L">L</option><option value="XL">XL</option></select></label>}<div className="modal-buy-row"><div className="quantity-control"><button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={13} /></button><span>{quantity}</span><button type="button" onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}><Plus size={13} /></button></div><button className="button button--dark button--full" disabled={product.stock < 1 || (requiresSize && !size)} onClick={() => onAdd(product, quantity, size)}>{product.stock < 1 ? 'Agotada' : requiresSize ? 'Elegir talla para continuar' : 'Agregar al carrito'} <Plus size={16} /></button></div><small className="modal-stock"><i /> {product.stock < 6 ? `Solo quedan ${product.stock} unidades` : 'Listo para solicitar por DM'}</small></div></div></>;
}

function EntryGate({ onEnter }) {
  return <main className="entry-gate">
    <div className="entry-gate__grain" />
    <div className="entry-gate__court entry-gate__court--left" />
    <div className="entry-gate__court entry-gate__court--right" />
    <div className="entry-gate__orbit entry-gate__orbit--one" />
    <div className="entry-gate__orbit entry-gate__orbit--two" />
    <div className="entry-gate__top"><span>SÚPER SUERO / GORRAS + SHORTS</span><span>RD / 2026</span></div>
    <div className="entry-gate__center">
      <div className="entry-gate__mark"><BrandMark inverse compact /></div>
      <div className="entry-gate__title"><span>SÚPER</span><strong>SUERO</strong></div>
      <p>Gorras + shorts.<br />Una marca del jugador de baloncesto dominicano.</p>
      <button className="entry-gate__cta" onClick={onEnter}>Entrar a la tienda <ArrowUpRight size={17} /></button>
    </div>
    <div className="entry-gate__bottom"><span><i /> @supersuerohats</span><span>Ángel Gerardo Suero Castillo · Hecho en RD</span><span>DM para pedidos 📩</span></div>
  </main>;
}

function Toast({ message, onClose }) {
  useEffect(() => { const timeout = setTimeout(onClose, 3200); return () => clearTimeout(timeout); }, [onClose]);
  return <div className="toast" role="status" aria-live="polite"><span><Check size={15} /></span>{message}</div>;
}

function App() {
  const [hasEntered, setHasEntered] = useState(() => {
    try { return sessionStorage.getItem('super-suero-entered') === 'true'; } catch { return false; }
  });
  const [page, setPage] = useState('store');
  const [cart, setCart] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('super-suero-cart') || '[]');
      return stored.map((item) => { const current = products.find((product) => product.id === item.id); return current ? { ...current, quantity: item.quantity } : null; }).filter(Boolean);
    } catch { return []; }
  });
  const [orders, setOrders] = useState(initialOrders);
  const [inventory, setInventory] = useState(products);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toast, setToast] = useState('');
  const [showProductPrompt, setShowProductPrompt] = useState(false);

  useEffect(() => { localStorage.setItem('super-suero-cart', JSON.stringify(cart)); }, [cart]);

  const navigatePage = (next) => { setPage(next); setCartOpen(false); setMobileOpen(false); };

  const addToCart = (product, quantity = 1, size = '') => {
    const currentProduct = inventory.find((item) => item.id === product.id) || product;
    if (currentProduct.category === 'Shorts' && !size) { setToast('Selecciona una talla antes de continuar'); return; }
    if (currentProduct.stock < 1) { setToast(`${currentProduct.name} está agotada`); return; }
    const safeQuantity = Math.min(quantity, currentProduct.stock);
    setCart((current) => {
      const exists = current.find((item) => item.id === currentProduct.id && item.size === size);
      if (exists) return current.map((item) => item.id === currentProduct.id && item.size === size ? { ...item, ...currentProduct, size, quantity: Math.min(currentProduct.stock, item.quantity + safeQuantity) } : item);
      return [...current, { ...currentProduct, size, quantity: safeQuantity }];
    });
    setSelectedProduct(null);
    setCartOpen(true);
    setToast(`${currentProduct.name} se agregó al carrito`);
  };

  const checkout = () => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (!cart.length) return;
    const unavailable = cart.find((item) => item.quantity > (inventory.find((product) => product.id === item.id)?.stock ?? 0));
    if (unavailable) { setToast(`Revisa el stock de ${unavailable.name}`); return; }
    setOrders((current) => [{ id: `#SS-${1049 + current.length}`, customer: 'Cliente nuevo', items: cart.reduce((sum, item) => sum + item.quantity, 0), total, status: 'En preparación', time: 'Ahora mismo', initials: 'CN', tone: 'purple' }, ...current]);
    setInventory((current) => current.map((product) => { const item = cart.find((cartItem) => cartItem.id === product.id); return item ? { ...product, stock: Math.max(0, product.stock - item.quantity), sold: product.sold + item.quantity } : product; }));
    setCart([]);
    setCartOpen(false);
    setToast('Solicitud registrada. Confirma los detalles por DM.');
  };

  const adjustStock = (product) => {
    setInventory((current) => current.map((item) => item.id === product.id ? { ...item, stock: item.stock + 5 } : item));
    setToast(`Stock de ${product.name} actualizado`);
  };

  const renderPage = () => {
    if (page === 'store') return <StorePage inventory={inventory} onAddToCart={addToCart} onOpenProduct={setSelectedProduct} setPage={navigatePage} />;
    if (page === 'dashboard') return <DashboardPage orders={orders} inventory={inventory} onAddProduct={() => setShowProductPrompt(true)} onNavigate={navigatePage} />;
    if (page === 'inventory') return <InventoryPage inventory={inventory} onAddProduct={() => setShowProductPrompt(true)} onAdjustStock={adjustStock} />;
    return <OrdersPage orders={orders} onNavigate={navigatePage} />;
  };

  const activeProduct = selectedProduct ? inventory.find((product) => product.id === selectedProduct.id) || selectedProduct : null;

  if (!hasEntered) return <EntryGate onEnter={() => { try { sessionStorage.setItem('super-suero-entered', 'true'); } catch { /* demo mode */ } setHasEntered(true); }} />;

  return <div className={`app-shell ${page === 'store' ? 'app-shell--store' : 'app-shell--admin'}`}>{page !== 'store' && <Sidebar page={page} setPage={navigatePage} cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} lowStockCount={inventory.filter((item) => item.stock <= 10).length} onCart={() => setCartOpen(true)} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />}<div className="app-main"><Topbar page={page} setPage={navigatePage} setMobileOpen={setMobileOpen} onCart={() => setCartOpen(true)} cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} onAddProduct={() => setShowProductPrompt(true)} />{renderPage()}</div><CartDrawer cart={cart} setCart={setCart} inventory={inventory} isOpen={cartOpen} onClose={() => setCartOpen(false)} onCheckout={checkout} /><ProductModal product={activeProduct} onClose={() => setSelectedProduct(null)} onAdd={addToCart} />{toast && <Toast message={toast} onClose={() => setToast('')} />}{showProductPrompt && <ProductPrompt onClose={() => setShowProductPrompt(false)} onSave={() => { setShowProductPrompt(false); setToast('Producto creado como borrador'); }} />}</div>;
}

function ProductPrompt({ onClose, onSave }) {
  return <><button className="modal-backdrop" onClick={onClose} aria-label="Cerrar nuevo producto" /><div className="simple-modal"><button className="icon-button simple-modal__close" onClick={onClose} aria-label="Cerrar"><X size={19} /></button><span className="eyebrow"><span className="eyebrow__dot" /> Nuevo artículo</span><h2>Crear producto</h2><p>Configura la pieza y déjala lista para el próximo drop.</p><label>Nombre del producto<input placeholder="Ej. Cap Santiago" autoFocus /></label><div className="simple-modal__row"><label>Precio<input placeholder="RD$ 0" /></label><label>Stock inicial<input placeholder="0" /></label></div><button className="button button--dark button--full" onClick={onSave}>Guardar como borrador <Check size={16} /></button></div></>;
}

createRoot(document.getElementById('root')).render(<App />);
