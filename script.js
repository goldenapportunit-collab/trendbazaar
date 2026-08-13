/* =========================================================
   TREND BAZAAR INDIA 24
   script.js
   ========================================================= */


/* =========================================================
   PRODUCT DATA
   ========================================================= */

const defaultProducts = [
    {
        id: 1,
        name: "Portable Mini Fan",
        category: "Gadgets",
        price: 499,
        oldPrice: 799,
        image: "images/portable-mini-fan.jpg",
        description:
            "Compact rechargeable portable fan for home, office, travel and outdoor use.",
        isNew: true
    },

    {
        id: 2,
        name: "Mini Portable Humidifier",
        category: "Home",
        price: 699,
        oldPrice: 999,
        image: "images/mini-humidifier.jpg",
        description:
            "Compact USB humidifier designed for bedrooms, offices and personal spaces.",
        isNew: true
    },

    {
        id: 3,
        name: "Magic Bar Body Scrub",
        category: "Beauty",
        price: 299,
        oldPrice: 499,
        image: "images/magic-bar.jpg",
        description:
            "Easy-to-use beauty product designed for everyday personal care.",
        isNew: true
    },

    {
        id: 4,
        name: "Smart LED Night Lamp",
        category: "Home",
        price: 599,
        oldPrice: 899,
        image: "images/smart-led-night-lamp.jpg",
        description:
            "Modern LED night lamp with a compact design for bedrooms and workspaces.",
        isNew: false
    },

    {
        id: 5,
        name: "Multi-Function Cleaning Brush",
        category: "Home",
        price: 249,
        oldPrice: 399,
        image: "images/cleaning-brush.jpg",
        description:
            "Useful cleaning brush for different surfaces and everyday household cleaning.",
        isNew: false
    },

    {
        id: 6,
        name: "Wireless Mini Speaker",
        category: "Gadgets",
        price: 899,
        oldPrice: 1299,
        image: "images/wireless-mini-speaker.jpg",
        description:
            "Small wireless speaker with portable design for music at home or outdoors.",
        isNew: true
    },

    {
        id: 7,
        name: "Kitchen Storage Organizer",
        category: "Kitchen",
        price: 349,
        oldPrice: 599,
        image: "images/kitchen-organizer.jpg",
        description:
            "Practical storage solution for keeping kitchen items organized.",
        isNew: false
    },

    {
        id: 8,
        name: "Rechargeable Electric Lighter",
        category: "Gadgets",
        price: 449,
        oldPrice: 699,
        image: "images/electric-lighter.jpg",
        description:
            "Compact rechargeable electric lighter with a modern portable design.",
        isNew: false
    }
];


/* =========================================================
   STATE
   ========================================================= */

let products = [];
let cart = [];

let selectedCategory = "All";
let selectedProduct = null;


/* =========================================================
   DOM
   ========================================================= */

const loader = document.getElementById("loader");

const productGrid = document.getElementById("productGrid");
const newGrid = document.getElementById("newGrid");

const categories = document.getElementById("categories");

const searchInput = document.getElementById("searchInput");

const emptyMessage = document.getElementById("empty");

const cartCount = document.getElementById("cartCount");

const cartModal = document.getElementById("cartModal");

const cartItems = document.getElementById("cartItems");

const cartTotal = document.getElementById("cartTotal");

const productModal = document.getElementById("productModal");

const checkoutModal = document.getElementById("checkoutModal");

const modalImg = document.getElementById("modalImg");

const modalCat = document.getElementById("modalCat");

const modalName = document.getElementById("modalName");

const modalPrice = document.getElementById("modalPrice");

const modalDesc = document.getElementById("modalDesc");

const modalQty = document.getElementById("modalQty");

const orderForm = document.getElementById("orderForm");

const orderSuccess = document.getElementById("orderSuccess");

const mobileNav = document.getElementById("mobileNav");

const menuBtn = document.getElementById("menuBtn");

const cartBtn = document.getElementById("cartBtn");

const searchBtn = document.getElementById("searchBtn");

const heroSearch = document.getElementById("heroSearch");

const checkoutBtn = document.getElementById("checkoutBtn");

const addBtn = document.getElementById("addBtn");

const buyBtn = document.getElementById("buyBtn");


/* =========================================================
   STORAGE HELPERS
   ========================================================= */

function loadProducts() {

    try {

        const saved =
            localStorage.getItem("trendBazaarProducts");

        if (saved) {

            const parsed = JSON.parse(saved);

            if (Array.isArray(parsed)) {
                products = parsed;
            } else {
                products = [...defaultProducts];
            }

        } else {

            products = [...defaultProducts];

            saveProducts();
        }

    } catch (error) {

        console.error(
            "Unable to load products:",
            error
        );

        products = [...defaultProducts];
    }
}


function saveProducts() {

    try {

        localStorage.setItem(
            "trendBazaarProducts",
            JSON.stringify(products)
        );

    } catch (error) {

        console.error(
            "Unable to save products:",
            error
        );
    }
}


function loadCart() {

    try {

        const saved =
            localStorage.getItem("trendBazaarCart");

        if (saved) {

            const parsed = JSON.parse(saved);

            cart =
                Array.isArray(parsed)
                    ? parsed
                    : [];
        }

    } catch (error) {

        console.error(
            "Unable to load cart:",
            error
        );

        cart = [];
    }
}


function saveCart() {

    try {

        localStorage.setItem(
            "trendBazaarCart",
            JSON.stringify(cart)
        );

    } catch (error) {

        console.error(
            "Unable to save cart:",
            error
        );
    }
}


/* =========================================================
   FORMAT PRICE
   ========================================================= */

function formatPrice(value) {

    const number = Number(value) || 0;

    return "₹" + number.toLocaleString("en-IN");
}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   PRODUCT CARD
   ========================================================= */

function productCard(product) {

    const discount =
        product.oldPrice &&
        Number(product.oldPrice) > Number(product.price)
            ? Math.round(
                (
                    (Number(product.oldPrice) -
                        Number(product.price)) /
                    Number(product.oldPrice)
                ) * 100
            )
            : 0;

    return `
        <article
            class="product-card"
            data-id="${product.id}"
        >

            <img
                src="${escapeHTML(product.image)}"
                alt="${escapeHTML(product.name)}"
                loading="lazy"
                onerror="this.src='images/trend-bazaar-profile.jpg'"
            >

            <div class="product-body">

                <span class="pill">
                    ${escapeHTML(product.category)}
                </span>

                <h3>
                    ${escapeHTML(product.name)}
                </h3>

                <div class="price">

                    ${formatPrice(product.price)}

                    ${
                        product.oldPrice
                            ? `
                                <span class="old">
                                    ${formatPrice(product.oldPrice)}
                                </span>
                            `
                            : ""
                    }

                </div>

                ${
                    discount
                        ? `
                            <small>
                                ${discount}% OFF
                            </small>
                        `
                        : ""
                }

                <button
                    class="gold-btn full view-product"
                    type="button"
                    data-id="${product.id}"
                >
                    View Product
                </button>

            </div>

        </article>
    `;
}


/* =========================================================
   RENDER PRODUCTS
   ========================================================= */

function renderProducts() {

    const query =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";

    const filtered = products.filter(product => {

        const matchesCategory =
            selectedCategory === "All" ||
            product.category === selectedCategory;

        const searchableText =
            `${product.name}
            ${product.category}
            ${product.description}`
                .toLowerCase();

        const matchesSearch =
            !query ||
            searchableText.includes(query);

        return (
            matchesCategory &&
            matchesSearch
        );
    });


    if (productGrid) {

        productGrid.innerHTML =
            filtered.length
                ? filtered.map(productCard).join("")
                : "";

    }


    if (emptyMessage) {

        emptyMessage.classList.toggle(
            "hidden",
            filtered.length !== 0
        );
    }


    renderNewProducts();

    attachProductEvents();
}


/* =========================================================
   NEW PRODUCTS
   ========================================================= */

function renderNewProducts() {

    if (!newGrid) {
        return;
    }

    const newProducts =
        products
            .filter(product => product.isNew)
            .slice(0, 4);


    if (!newProducts.length) {

        newGrid.innerHTML = `
            <p class="empty">
                New products coming soon.
            </p>
        `;

        return;
    }


    newGrid.innerHTML =
        newProducts.map(productCard).join("");

    attachProductEvents();
}


/* =========================================================
   CATEGORIES
   ========================================================= */

function renderCategories() {

    if (!categories) {
        return;
    }

    const categoryList = [
        "All",
        ...new Set(
            products
                .map(product => product.category)
                .filter(Boolean)
        )
    ];


    categories.innerHTML =
        categoryList.map(category => {

            const active =
                selectedCategory === category
                    ? "active"
                    : "";

            return `
                <button
                    type="button"
                    class="chip ${active}"
                    data-category="${escapeHTML(category)}"
                >
                    ${escapeHTML(category)}
                </button>
            `;
        }).join("");


    categories
        .querySelectorAll(".chip")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    selectedCategory =
                        button.dataset.category;

                    renderCategories();

                    renderProducts();
                }
            );

        });
}


/* =========================================================
   PRODUCT EVENTS
   ========================================================= */

function attachProductEvents() {

    document
        .querySelectorAll(".view-product")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        Number(button.dataset.id);

                    openProduct(id);
                }
            );

        });
}


/* =========================================================
   OPEN PRODUCT
   ========================================================= */

function openProduct(id) {

    const product =
        products.find(
            item => Number(item.id) === Number(id)
        );


    if (!product) {
        return;
    }


    selectedProduct = product;


    modalImg.src =
        product.image ||
        "images/trend-bazaar-profile.jpg";

    modalImg.alt = product.name;

    modalCat.textContent =
        product.category || "Product";

    modalName.textContent =
        product.name;

    modalPrice.textContent =
        formatPrice(product.price);

    modalDesc.textContent =
        product.description ||
        "Quality product from Trend Bazaar India 24.";

    modalQty.value = 1;


    openModal(productModal);
}


/* =========================================================
   MODAL
   ========================================================= */

function openModal(modal) {

    if (!modal) {
        return;
    }

    modal.classList.add("show");

    document.body.style.overflow = "hidden";
}


function closeModal(modal) {

    if (!modal) {
        return;
    }

    modal.classList.remove("show");

    const anotherOpen =
        document.querySelector(
            ".modal.show"
        );

    if (!anotherOpen) {
        document.body.style.overflow = "";
    }
}


/* =========================================================
   CLOSE BUTTONS
   ========================================================= */

document
    .querySelectorAll("[data-close]")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const id =
                    button.dataset.close;

                closeModal(
                    document.getElementById(id)
                );
            }
        );

    });


/* =========================================================
   CLICK OUTSIDE MODAL
   ========================================================= */

document
    .querySelectorAll(".modal")
    .forEach(modal => {

        modal.addEventListener(
            "click",
            event => {

                if (
                    event.target === modal
                ) {

                    closeModal(modal);
                }

            }
        );

    });


/* =========================================================
   ESCAPE KEY
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (event.key !== "Escape") {
            return;
        }

        document
            .querySelectorAll(".modal.show")
            .forEach(modal => {
                closeModal(modal);
            });

    }
);


/* =========================================================
   ADD TO CART
   ========================================================= */

function addToCart(product, quantity = 1) {

    if (!product) {
        return;
    }


    quantity =
        Math.max(
            1,
            parseInt(quantity, 10) || 1
        );


    const existing =
        cart.find(
            item =>
                Number(item.id) ===
                Number(product.id)
        );


    if (existing) {

        existing.quantity += quantity;

    } else {

        cart.push({
            id: product.id,
            quantity
        });

    }


    saveCart();

    updateCartCount();

    renderCart();
}


/* =========================================================
   ADD BUTTON
   ========================================================= */

if (addBtn) {

    addBtn.addEventListener(
        "click",
        () => {

            if (!selectedProduct) {
                return;
            }


            addToCart(
                selectedProduct,
                modalQty.value
            );


            closeModal(productModal);

            openModal(cartModal);
        }
    );
}


/* =========================================================
   BUY NOW
   ========================================================= */

if (buyBtn) {

    buyBtn.addEventListener(
        "click",
        () => {

            if (!selectedProduct) {
                return;
            }


            cart = [];

            addToCart(
                selectedProduct,
                modalQty.value
            );


            closeModal(productModal);

            openModal(checkoutModal);
        }
    );
}


/* =========================================================
   CART COUNT
   ========================================================= */

function updateCartCount() {

    const count =
        cart.reduce(
            (total, item) =>
                total + Number(item.quantity || 0),
            0
        );


    if (cartCount) {
        cartCount.textContent = count;
    }
}


/* =========================================================
   GET CART PRODUCT
   ========================================================= */

function getCartProduct(item) {

    return products.find(
        product =>
            Number(product.id) ===
            Number(item.id)
    );
}


/* =========================================================
   CART TOTAL
   ========================================================= */

function calculateCartTotal() {

    return cart.reduce(
        (total, item) => {

            const product =
                getCartProduct(item);

            if (!product) {
                return total;
            }

            return (
                total +
                Number(product.price || 0) *
                Number(item.quantity || 0)
            );
        },
        0
    );
}


/* =========================================================
   RENDER CART
   ========================================================= */

function renderCart() {

    if (!cartItems || !cartTotal) {
        return;
    }


    if (!cart.length) {

        cartItems.innerHTML = `
            <div class="empty">
                Your cart is empty.
            </div>
        `;

        cartTotal.textContent =
            formatPrice(0);

        if (checkoutBtn) {
            checkoutBtn.disabled = true;
        }

        return;
    }


    cartItems.innerHTML =
        cart.map(item => {

            const product =
                getCartProduct(item);

            if (!product) {
                return "";
            }


            return `
                <div class="cart-row">

                    <img
                        src="${escapeHTML(product.image)}"
                        alt="${escapeHTML(product.name)}"
                    >

                    <div class="grow">

                        <b>
                            ${escapeHTML(product.name)}
                        </b>

                        <div>
                            ${formatPrice(product.price)}
                            × ${item.quantity}
                        </div>

                    </div>

                    <button
                        type="button"
                        class="cart-minus"
                        data-id="${product.id}"
                    >
                        −
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        type="button"
                        class="cart-plus"
                        data-id="${product.id}"
                    >
                        +
                    </button>

                    <button
                        type="button"
                        class="cart-remove"
                        data-id="${product.id}"
                    >
                        ×
                    </button>

                </div>
            `;
        }).join("");


    cartTotal.textContent =
        formatPrice(
            calculateCartTotal()
        );


    if (checkoutBtn) {
        checkoutBtn.disabled = false;
    }


    attachCartEvents();
}


/* =========================================================
   CART EVENTS
   ========================================================= */

function attachCartEvents() {

    document
        .querySelectorAll(".cart-minus")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    changeQuantity(
                        Number(button.dataset.id),
                        -1
                    );
                }
            );

        });


    document
        .querySelectorAll(".cart-plus")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    changeQuantity(
                        Number(button.dataset.id),
                        1
                    );
                }
            );

        });


    document
        .querySelectorAll(".cart-remove")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    removeFromCart(
                        Number(button.dataset.id)
                    );
                }
            );

        });
}


/* =========================================================
   CHANGE QUANTITY
   ========================================================= */

function changeQuantity(id, amount) {

    const item =
        cart.find(
            cartItem =>
                Number(cartItem.id) === Number(id)
        );


    if (!item) {
        return;
    }


    item.quantity =
        Number(item.quantity) + Number(amount);


    if (item.quantity <= 0) {

        cart =
            cart.filter(
                cartItem =>
                    Number(cartItem.id) !== Number(id)
            );
    }


    saveCart();

    updateCartCount();

    renderCart();
}


/* =========================================================
   REMOVE CART ITEM
   ========================================================= */

function removeFromCart(id) {

    cart =
        cart.filter(
            item =>
                Number(item.id) !== Number(id)
        );


    saveCart();

    updateCartCount();

    renderCart();
}


/* =========================================================
   CART BUTTON
   ========================================================= */

if (cartBtn) {

    cartBtn.addEventListener(
        "click",
        () => {

            renderCart();

            openModal(cartModal);
        }
    );
}


/* =========================================================
   CHECKOUT
   ========================================================= */

if (checkoutBtn) {

    checkoutBtn.addEventListener(
        "click",
        () => {

            if (!cart.length) {
                return;
            }

            closeModal(cartModal);

            openModal(checkoutModal);

        }
    );
}


/* =========================================================
   ORDER ID
   ========================================================= */

function createOrderId() {

    const timestamp =
        Date.now()
            .toString()
            .slice(-7);

    const random =
        Math.floor(
            100 +
            Math.random() * 900
        );

    return `TB-${timestamp}-${random}`;
}


/* =========================================================
   SAVE ORDER
   ========================================================= */

function saveOrder(order) {

    let orders = [];

    try {

        const saved =
            localStorage.getItem(
                "trendBazaarOrders"
            );

        if (saved) {

            const parsed =
                JSON.parse(saved);

            if (Array.isArray(parsed)) {
                orders = parsed;
            }
        }

    } catch (error) {

        console.error(
            "Unable to read orders:",
            error
        );
    }


    orders.push(order);


    try {

        localStorage.setItem(
            "trendBazaarOrders",
            JSON.stringify(orders)
        );

    } catch (error) {

        console.error(
            "Unable to save order:",
            error
        );
    }
}


/* =========================================================
   CREATE ORDER
   ========================================================= */

function createOrder(formData) {

    const items =
        cart.map(item => {

            const product =
                getCartProduct(item);

            if (!product) {
                return null;
            }

            return {
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: item.quantity
            };

        }).filter(Boolean);


    return {
        id: createOrderId(),

        date:
            new Date().toISOString(),

        customer: {
            name: formData.get("name"),
            phone: formData.get("phone"),
            address: formData.get("address"),
            city: formData.get("city"),
            pincode: formData.get("pincode")
        },

        payment:
            formData.get("payment"),

        items,

        total:
            calculateCartTotal(),

        status:
            "New"
    };
}


/* =========================================================
   ORDER FORM
   ========================================================= */

if (orderForm) {

    orderForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            if (!cart.length) {

                alert(
                    "Your cart is empty."
                );

                return;
            }


            const formData =
                new FormData(orderForm);


            const order =
                createOrder(formData);


            saveOrder(order);


            orderSuccess.innerHTML = `
                <strong>
                    Order placed successfully! 🎉
                </strong>

                <br>

                Order ID:
                <b>${escapeHTML(order.id)}</b>

                <br>

                Total:
                <b>${formatPrice(order.total)}</b>

                <br><br>

                Thank you for shopping with
                Trend Bazaar India 24.
            `;


            orderSuccess.classList.remove(
                "hidden"
            );


            orderForm.reset();


            cart = [];

            saveCart();

            updateCartCount();

            renderCart();


            setTimeout(
                () => {

                    closeModal(
                        checkoutModal
                    );

                    orderSuccess.classList.add(
                        "hidden"
                    );

                },
                5000
            );

        }
    );
}


/* =========================================================
   SEARCH
   ========================================================= */

if (searchInput) {

    searchInput.addEventListener(
        "input",
        renderProducts
    );
}


function focusSearch() {

    const catalog =
        document.getElementById(
            "catalog"
        );

    if (catalog) {

        catalog.scrollIntoView({
            behavior: "smooth"
        });

    }


    setTimeout(
        () => {

            if (searchInput) {

                searchInput.focus();

                searchInput.select();
            }

        },
        500
    );
}


if (searchBtn) {

    searchBtn.addEventListener(
        "click",
        focusSearch
    );
}


if (heroSearch) {

    heroSearch.addEventListener(
        "click",
        focusSearch
    );
}


/* =========================================================
   MOBILE MENU
   ========================================================= */

if (menuBtn) {

    menuBtn.addEventListener(
        "click",
        () => {

            mobileNav.classList.toggle(
                "show"
            );

        }
    );
}


if (mobileNav) {

    mobileNav
        .querySelectorAll("a")
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    mobileNav.classList.remove(
                        "show"
                    );

                }
            );

        });
}


/* =========================================================
   CLOSE MOBILE MENU ON OUTSIDE CLICK
   ========================================================= */

document.addEventListener(
    "click",
    event => {

        if (
            !mobileNav ||
            !menuBtn
        ) {
            return;
        }


        if (
            mobileNav.classList.contains("show") &&
            !mobileNav.contains(event.target) &&
            !menuBtn.contains(event.target)
        ) {

            mobileNav.classList.remove(
                "show"
            );

        }

    }
);


/* =========================================================
   LOADER
   ========================================================= */

function hideLoader() {

    if (!loader) {
        return;
    }


    loader.classList.add("hide");


    setTimeout(
        () => {

            loader.style.display =
                "none";

        },
        600
    );
}


/* =========================================================
   INITIALIZE
   ========================================================= */

function initializeApp() {

    loadProducts();

    loadCart();

    renderCategories();

    renderProducts();

    renderCart();

    updateCartCount();
}


/* =========================================================
   START APP
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeApp();


        /*
         * Give the logo enough time to appear
         * before removing the loader.
         */

        setTimeout(
            hideLoader,
            1400
        );

    }
);


/* =========================================================
   SAFETY FALLBACK
   ========================================================= */

window.addEventListener(
    "load",
    () => {

        setTimeout(
            hideLoader,
            1800
        );

    }
);