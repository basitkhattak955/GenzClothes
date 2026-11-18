/* ================= GENZ CLOTHES — main.js ================= */

const IMG = id => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=700&q=80`;

/* ---------- product data (real Unsplash images) ---------- */
const PRODUCTS = [
  { id:1,  name:"Essential White Tee",      cat:"tees",       price:1499, old:1999, rating:4.9, sold:820,  badge:"BESTSELLER", img:"1521572163474-6864f9cf17ab" },
  { id:2,  name:"Original Graphic Tee",     cat:"tees",       price:1799, old:0,    rating:4.8, sold:410,  badge:"NEW",        img:"1576566588028-4147f3842f27" },
  { id:3,  name:"Midnight Oversized Tee",   cat:"tees",       price:1899, old:2499, rating:4.7, sold:655,  badge:"-24%",       img:"1583743814966-8936f5b7be1a" },
  { id:4,  name:"Trail Graphic Tee",        cat:"tees",       price:1699, old:0,    rating:4.6, sold:290,  badge:"",           img:"1554568218-0f1715e72254" },
  { id:5,  name:"785 Boxy Tee",             cat:"tees",       price:1599, old:0,    rating:4.8, sold:512,  badge:"NEW",        img:"1618354691373-d851c5c3a990" },
  { id:6,  name:"Bonez Street Tee",         cat:"tees",       price:1999, old:2599, rating:4.9, sold:930,  badge:"-23%",       img:"1503341504253-dff4815485f1" },
  { id:7,  name:"Clean Slate Tee",          cat:"tees",       price:1449, old:0,    rating:4.5, sold:240,  badge:"",           img:"1581655353564-df123a1eb820" },
  { id:8,  name:"Cloud Crew Sweatshirt",    cat:"layers",     price:3299, old:4199, rating:4.8, sold:377,  badge:"-21%",       img:"1620799140408-edc6dcb6d633" },
  { id:9,  name:"705 Long Sleeve",          cat:"layers",     price:2599, old:0,    rating:4.7, sold:198,  badge:"",           img:"1618354691229-88d47f285158" },
  { id:10, name:"Rust Bomber Jacket",       cat:"layers",     price:5499, old:6999, rating:4.9, sold:156,  badge:"-21%",       img:"1591047139829-d91aecb6caea" },
  { id:11, name:"Faux Leather Jacket",      cat:"layers",     price:6499, old:0,    rating:4.8, sold:203,  badge:"HOT",        img:"1551028719-00167b16eac5" },
  { id:12, name:"Fringe Knit Cape",         cat:"layers",     price:4299, old:0,    rating:4.6, sold:88,   badge:"",           img:"1434389677669-e08b4cac3105" },
  { id:13, name:"Blush Jogger Pants",       cat:"bottoms",    price:2899, old:3599, rating:4.7, sold:341,  badge:"-19%",       img:"1594633312681-425c7b97ccd1" },
  { id:14, name:"Ripped Blue Denim",        cat:"bottoms",    price:3799, old:0,    rating:4.9, sold:602,  badge:"BESTSELLER", img:"1541099649105-f69ad21f3246" },
  { id:15, name:"Crimson Runners",          cat:"shoes",      price:6999, old:8999, rating:4.8, sold:274,  badge:"-22%",       img:"1542291026-7eec264c27ff" },
  { id:16, name:"Tan Street Kicks",         cat:"shoes",      price:7499, old:0,    rating:4.9, sold:419,  badge:"NEW",        img:"1549298916-b41d501d3772" },
  { id:17, name:"Pastel Air Kicks",         cat:"shoes",      price:7999, old:0,    rating:4.7, sold:187,  badge:"",           img:"1595950653106-6c9ebd614d3a" },
  { id:18, name:"Retro Multicolor Sneakers",cat:"shoes",      price:5999, old:7499, rating:4.6, sold:265,  badge:"-20%",       img:"1560769629-975ec94e6a86" },
  { id:19, name:"Bloom Heels",              cat:"shoes",      price:4599, old:0,    rating:4.5, sold:96,   badge:"",           img:"1543163521-1bf539c55dd2" },
  { id:20, name:"Chelsea Boot Kit",         cat:"shoes",      price:5299, old:6499, rating:4.7, sold:132,  badge:"-18%",       img:"1479064555552-3ef4979f8908" },
  { id:21, name:"Clean Logo Cap",           cat:"accessories",price:1299, old:0,    rating:4.8, sold:455,  badge:"NEW",        img:"1622445275576-721325763afe" },
  { id:22, name:"Minimal Sling Bag",        cat:"accessories",price:3499, old:4299, rating:4.9, sold:221,  badge:"-18%",       img:"1492707892479-7bc8d5a4ee93" },
  { id:23, name:"Everyday Shopper Tote",    cat:"accessories",price:2799, old:0,    rating:4.6, sold:174,  badge:"",           img:"1483985988355-763728e1935b" }
];

const CAT_NAMES = { tees:"Tees", layers:"Hoodies & Jackets", bottoms:"Bottoms", shoes:"Shoes", accessories:"Accessories" };
const FREE_SHIP = 3000, SHIP_FEE = 250;

/* ---------- state ---------- */
let activeCat = "all";
let searchTerm = "";
const cart = JSON.parse(localStorage.getItem("genz_cart") || "[]");
const wishlist = new Set(JSON.parse(localStorage.getItem("genz_wish") || "[]"));

/* ---------- helpers ---------- */
const $ = s => document.querySelector(s);
const money = n => "Rs. " + n.toLocaleString("en-US");

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("on");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove("on"), 2400);
}

/* ---------- product rendering ---------- */
function stars(r) {
  const full = Math.round(r);
  return "★".repeat(full) + "☆".repeat(5 - full);
}

function renderProducts() {
  const grid = $("#productGrid");
  const list = PRODUCTS.filter(p => {
    const catOk = activeCat === "all" || p.cat === activeCat;
    const searchOk = !searchTerm ||
      p.name.toLowerCase().includes(searchTerm) ||
      CAT_NAMES[p.cat].toLowerCase().includes(searchTerm);
    return catOk && searchOk;
  });

  $("#emptyMsg").hidden = list.length > 0;

  grid.innerHTML = list.map((p, i) => {
    const sale = p.old > 0;
    const liked = wishlist.has(p.id) ? "on" : "";
    const heart = wishlist.has(p.id) ? "♥" : "♡";
    return `
    <article class="card" style="animation-delay:${i * 40}ms">
      <div class="card-img">
        <img src="${IMG(p.img)}" alt="${p.name}" loading="lazy">
        ${p.badge ? `<span class="tag ${sale ? "sale" : ""}">${p.badge}</span>` : ""}
        <button class="heart ${liked}" data-wish="${p.id}" aria-label="Wishlist">${heart}</button>
      </div>
      <div class="card-body">
        <span class="cat-label">${CAT_NAMES[p.cat]}</span>
        <h3>${p.name}</h3>
        <div class="rate">${stars(p.rating)} <span>${p.rating} (${p.sold} sold)</span></div>
        <div class="price">${money(p.price)} ${sale ? `<s>${money(p.old)}</s>` : ""}</div>
        <button class="add" data-add="${p.id}">Add to Cart +</button>
      </div>
    </article>`;
  }).join("");
}

/* ---------- cart ---------- */
function saveCart() { localStorage.setItem("genz_cart", JSON.stringify(cart)); }

function addToCart(id, btn) {
  const item = cart.find(c => c.id === id);
  if (item) item.qty++;
  else cart.push({ id, qty: 1 });
  saveCart();
  updateCartUI();
  const p = PRODUCTS.find(x => x.id === id);
  toast(`${p.name} cart mein add ho gaya 🛒`);
  if (btn) {
    btn.classList.add("done");
    btn.textContent = "Added ✔";
    setTimeout(() => { btn.classList.remove("done"); btn.textContent = "Add to Cart +"; }, 1300);
  }
}

function changeQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart.splice(cart.indexOf(item), 1);
  saveCart();
  updateCartUI();
}

function removeItem(id) {
  const i = cart.findIndex(c => c.id === id);
  if (i > -1) cart.splice(i, 1);
  saveCart();
  updateCartUI();
  toast("Item hata diya gaya");
}

function cartTotals() {
  const sub = cart.reduce((sum, c) => {
    const p = PRODUCTS.find(x => x.id === c.id);
    return sum + (p ? p.price * c.qty : 0);
  }, 0);
  const ship = sub === 0 || sub >= FREE_SHIP ? 0 : SHIP_FEE;
  return { sub, ship, total: sub + ship };
}

function updateCartUI() {
  const count = cart.reduce((s, c) => s + c.qty, 0);
  $("#cartCount").textContent = count;
  $("#cartHeadCount").textContent = `(${count})`;

  const box = $("#cartItems");
  if (!cart.length) {
    box.innerHTML = `<div class="cart-empty"><span>🛍️</span>Tera cart abhi khali hai.<br>Apna pehla fit pick kar!</div>`;
  } else {
    box.innerHTML = cart.map(c => {
      const p = PRODUCTS.find(x => x.id === c.id);
      if (!p) return "";
      return `
      <div class="ci">
        <img src="${IMG(p.img)}" alt="${p.name}">
        <div>
          <h4>${p.name}</h4>
          <div class="ci-price">${money(p.price)}</div>
          <div class="qty">
            <button data-dec="${p.id}" aria-label="Kam karo">−</button>
            <span>${c.qty}</span>
            <button data-inc="${p.id}" aria-label="Barhao">+</button>
          </div>
        </div>
        <button class="rm" data-rm="${p.id}">Remove</button>
      </div>`;
    }).join("");
  }

  const { sub, ship, total } = cartTotals();
  $("#subtotal").textContent = money(sub);
  $("#shipping").textContent = ship === 0 ? (sub > 0 ? "FREE 🚚" : "Rs. 0") : money(ship);
  $("#total").textContent = money(total);
  $("#shipNote").textContent = sub >= FREE_SHIP
    ? "Free shipping unlock ho gayi 🎉"
    : `Sirf ${money(FREE_SHIP - sub)} aur — free shipping milegi 🚚`;
}

function openCart() {
  $("#cartDrawer").classList.add("on");
  $("#overlay").classList.add("on");
  document.body.style.overflow = "hidden";
}
function closeCart() {
  $("#cartDrawer").classList.remove("on");
  $("#overlay").classList.remove("on");
  document.body.style.overflow = "";
}

/* ---------- events: grid ---------- */
$("#productGrid").addEventListener("click", e => {
  const add = e.target.closest("[data-add]");
  if (add) return addToCart(+add.dataset.add, add);

  const wish = e.target.closest("[data-wish]");
  if (wish) {
    const id = +wish.dataset.wish;
    if (wishlist.has(id)) { wishlist.delete(id); toast("Wishlist se hata diya"); }
    else { wishlist.add(id); toast("Wishlist mein save ho gaya ♥"); }
    localStorage.setItem("genz_wish", JSON.stringify([...wishlist]));
    renderProducts();
  }
});

/* ---------- events: filters + search ---------- */
$("#filters").addEventListener("click", e => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  activeCat = chip.dataset.cat;
  document.querySelectorAll(".chip").forEach(c => c.classList.toggle("active", c === chip));
  renderProducts();
});

document.querySelectorAll("[data-filter]").forEach(el => {
  el.addEventListener("click", () => {
    activeCat = el.dataset.filter;
    document.querySelectorAll(".chip").forEach(c =>
      c.classList.toggle("active", c.dataset.cat === activeCat));
    renderProducts();
  });
});

$("#searchInput").addEventListener("input", e => {
  searchTerm = e.target.value.trim().toLowerCase();
  renderProducts();
  if (searchTerm) document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
});

/* ---------- events: cart UI ---------- */
$("#cartBtn").addEventListener("click", openCart);
$("#cartClose").addEventListener("click", closeCart);
$("#overlay").addEventListener("click", closeCart);
document.addEventListener("keydown", e => { if (e.key === "Escape") closeCart(); });

$("#cartItems").addEventListener("click", e => {
  const inc = e.target.closest("[data-inc]");
  const dec = e.target.closest("[data-dec]");
  const rm  = e.target.closest("[data-rm]");
  if (inc) changeQty(+inc.dataset.inc, 1);
  if (dec) changeQty(+dec.dataset.dec, -1);
  if (rm) removeItem(+rm.dataset.rm);
});

$("#checkoutBtn").addEventListener("click", () => {
  if (!cart.length) return toast("Pehle kuch add karo na 😅");
  toast("Demo store hai — checkout jald launch hoga! 🚀");
});

/* ---------- mobile menu ---------- */
const burger = $("#burger"), links = $("#navLinks");
burger.addEventListener("click", () => links.classList.toggle("on"));
links.addEventListener("click", e => { if (e.target.tagName === "A") links.classList.remove("on"); });

/* ---------- countdown (3 din ka sale) ---------- */
const saleEnd = (() => {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  d.setHours(23, 59, 59, 0);
  return d;
})();

function tickCountdown() {
  let ms = saleEnd - new Date();
  if (ms < 0) ms = 0;
  const s = Math.floor(ms / 1000);
  const pad = n => String(n).padStart(2, "0");
  $("#cdD").textContent = pad(Math.floor(s / 86400));
  $("#cdH").textContent = pad(Math.floor(s % 86400 / 3600));
  $("#cdM").textContent = pad(Math.floor(s % 3600 / 60));
  $("#cdS").textContent = pad(s % 60);
}
setInterval(tickCountdown, 1000);
tickCountdown();

/* ---------- newsletter ---------- */
$("#newsForm").addEventListener("submit", e => {
  e.preventDefault();
  const val = $("#newsEmail").value.trim();
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val);
  if (!ok) {
    $("#newsMsg").style.color = "#ffd0e0";
    return $("#newsMsg").textContent = "Sahi email likho phir discount lena 😬";
  }
  $("#newsMsg").style.color = "var(--lime)";
  $("#newsMsg").textContent = "Welcome to the crew! 10% off code: GENZ10 🎉";
  $("#newsEmail").value = "";
  toast("Subscribe ho gaya — GENZ10 use karo!");
});

/* ---------- reveal on scroll ---------- */
const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

/* ---------- back to top ---------- */
const toTop = $("#toTop");
window.addEventListener("scroll", () => {
  toTop.classList.toggle("on", window.scrollY > 600);
});
toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

/* ---------- init ---------- */
renderProducts();
updateCartUI();
