const menuToggle = document.querySelector("#menuToggle");
const mainNav = document.querySelector("#mainNav");

function closeMenu() {
  if (!mainNav || !menuToggle) return;
  mainNav.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open menu");
}

const categoryToggle = document.querySelector("#categoryToggle");
const categoryMenu = document.querySelector("#categoryMenu");
const cartTrigger = document.querySelector("#cartTrigger");
const cartPanel = document.querySelector("#cartPanel");
const cartOverlay = document.querySelector("#cartOverlay");
const cartClose = document.querySelector("#cartClose");
const continueShopping = document.querySelector("#continueShopping");

const defaultProducts = [
  {
    id: "from-the-south-black",
    name: "From The South - Black",
    category: "Tees",
    price: 800,
    description: "",
    sizes: ["S", "M", "L", "XL"],
    stock: { S: 5, M: 5, L: 5, XL: 5 },
    frontImage: "TEES/From The South - South Esquina/From The South - Black (front).png",
    backImage: "TEES/From The South - South Esquina/From The South - Black (back).png",
    sizeChartImage: "TEES/From The South - South Esquina/From The South - Black (Size Chart).png",
    isNewRelease: false,
    isPopular: true,
  },
  {
    id: "from-the-south-white",
    name: "From The South - White",
    category: "Tees",
    price: 800,
    description: "",
    sizes: ["S", "M", "L", "XL"],
    stock: { S: 5, M: 5, L: 5, XL: 5 },
    frontImage: "TEES/From The South - South Esquina/From The South - White (front).png",
    backImage: "TEES/From The South - South Esquina/From The South - White (back).png",
    sizeChartImage: "TEES/From The South - South Esquina/From The South - White (Size Chart).png",
    isNewRelease: false,
    isPopular: true,
  },
  {
    id: "luxury-black",
    name: "Luxury - Black",
    category: "Tees",
    price: 800,
    description: "",
    sizes: ["S", "M", "L", "XL"],
    stock: { S: 5, M: 5, L: 5, XL: 5 },
    frontImage: "TEES/Luxury - South Esquina/Luxury - Black (front).png",
    backImage: "TEES/Luxury - South Esquina/Luxury - Black (back).png",
    sizeChartImage: "TEES/Luxury - South Esquina/Luxury - Black (Size Chart).png",
    isNewRelease: true,
    isPopular: false,
  },
  {
    id: "luxury-white",
    name: "Luxury - White",
    category: "Tees",
    price: 800,
    description: "",
    sizes: ["S", "M", "L", "XL"],
    stock: { S: 5, M: 5, L: 5, XL: 5 },
    frontImage: "TEES/Luxury - South Esquina/Luxury - White (front).png",
    backImage: "TEES/Luxury - South Esquina/Luxury - White (back).png",
    sizeChartImage: "TEES/Luxury - South Esquina/Luxury - White (Size Chart).png",
    isNewRelease: true,
    isPopular: false,
  },
  {
    id: "live-in-wealth-black",
    name: "Live in Wealth - Black",
    category: "Tees",
    price: 800,
    description: "",
    sizes: ["S", "M", "L", "XL"],
    stock: { S: 5, M: 5, L: 5, XL: 5 },
    frontImage: "TEES/Live in Wealth - South Esquina/Live in Wealth - Black (front).png",
    backImage: "TEES/Live in Wealth - South Esquina/Live in Wealth - Black (back).png",
    sizeChartImage: "TEES/Live in Wealth - South Esquina/Live in Wealth - Black (size chat).png",
    isNewRelease: true,
    isPopular: false,
  },
  {
    id: "live-in-wealth-white",
    name: "Live in Wealth - White",
    category: "Tees",
    price: 800,
    description: "",
    sizes: ["S", "M", "L", "XL"],
    stock: { S: 5, M: 5, L: 5, XL: 5 },
    frontImage: "TEES/Live in Wealth - South Esquina/Live in Wealth - White (front).png",
    backImage: "TEES/Live in Wealth - South Esquina/Live in Wealth - White (back).png",
    sizeChartImage: "TEES/Live in Wealth - South Esquina/Live in Wealth - White (size chart).png",
    isNewRelease: true,
    isPopular: false,
  },
  {
    id: "journey-of-becoming-black",
    name: "Journey of Becoming - Black",
    category: "Sweaters",
    price: 1600,
    description: "",
    sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
    stock: { XS: 5, S: 5, M: 5, L: 5, XL: 5, "2XL": 5, "3XL": 5 },
    frontImage: "SWEATERS/Journey of Becoming - South Esquina/Journey of Becoming - Black (front).jpg",
    backImage: "SWEATERS/Journey of Becoming - South Esquina/Journey of Becoming - Black (back).jpg",
    sizeChartImage: "SWEATERS/Journey of Becoming - South Esquina/Journey of Becoming - Black (size chart).jpg",
    isNewRelease: true,
    isPopular: false,
  },
  {
    id: "journey-of-becoming-white",
    name: "Journey of Becoming - White",
    category: "Sweaters",
    price: 1600,
    description: "",
    sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
    stock: { XS: 5, S: 5, M: 5, L: 5, XL: 5, "2XL": 5, "3XL": 5 },
    frontImage: "SWEATERS/Journey of Becoming - South Esquina/Journey of Becoming - White (front).jpg",
    backImage: "SWEATERS/Journey of Becoming - South Esquina/Journey of Becoming - White (back).jpg",
    sizeChartImage: "SWEATERS/Journey of Becoming - South Esquina/Journey of Becoming - White (size chart).jpg",
    isNewRelease: true,
    isPopular: false,
  },
  {
    id: "one-of-one-black",
    name: "One of One - Black",
    category: "Tees",
    price: 800,
    description: "",
    sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
    stock: { XS: 5, S: 5, M: 5, L: 5, XL: 5, "2XL": 5, "3XL": 5 },
    frontImage: "TEES/One of One - South Esquina/One of One - Black (front).jpg",
    backImage: "TEES/One of One - South Esquina/One of One - Black (back).jpg",
    sizeChartImage: "TEES/One of One - South Esquina/One of One - Black (size chart).jpg",
    isNewRelease: true,
    isPopular: false,
  },
  {
    id: "one-of-one-white",
    name: "One of One - White",
    category: "Tees",
    price: 800,
    description: "",
    sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
    stock: { XS: 5, S: 5, M: 5, L: 5, XL: 5, "2XL": 5, "3XL": 5 },
    frontImage: "TEES/One of One - South Esquina/One of One - White (front).jpg",
    backImage: "TEES/One of One - South Esquina/One of One - White (back).jpg",
    sizeChartImage: "TEES/One of One - South Esquina/One of One - White (size chart).jpg",
    isNewRelease: true,
    isPopular: false,
  },
];

let teeProducts = defaultProducts;
if (window.location.protocol !== "file:") {
  try {
    const productsResponse = await fetch("/api/products");
    if (!productsResponse.ok) {
      throw new Error(`Catalog request failed with status ${productsResponse.status}.`);
    }
    const products = await productsResponse.json();
    if (!Array.isArray(products)) {
      throw new TypeError("The product catalog response must be an array.");
    }
    teeProducts = products;
  } catch (error) {
    console.error("Unable to load the saved catalog. Showing the original tees instead.", error);
  }
}

const heroImages = document.querySelectorAll(".hero-image");
if (heroImages.length > 1 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  let activeHeroIndex = 0;
  window.setInterval(() => {
    if (document.hidden) return;
    heroImages[activeHeroIndex].classList.remove("is-active");
    activeHeroIndex = (activeHeroIndex + 1) % heroImages.length;
    heroImages[activeHeroIndex].classList.add("is-active");
  }, 6000);
}

const teeCollection = document.querySelector("#teeCollection");
const teeProductGrid = document.querySelector("#teeProductGrid");
const newReleasesGrid = document.querySelector("#newReleasesGrid");
const mostPopularGrid = document.querySelector("#mostPopularGrid");
const categorySelection = document.querySelector("#categorySelection");
const selectedCategoryTitle = document.querySelector("#selectedCategoryTitle");
const cartItems = document.querySelector("#cartItems");
const cartEmpty = document.querySelector("#cartEmpty");
const cartSubtotal = document.querySelector("#cartSubtotal");
const cartItemCount = document.querySelector("#cartItemCount");
const cartCount = document.querySelector("#cartCount");
const cart = new Map();

function formatPrice(amount) {
  return `₱${amount.toFixed(2)}`;
}

function addTextElement(parent, tagName, className, text) {
  const element = document.createElement(tagName);
  element.className = className;
  element.textContent = text;
  parent.append(element);
  return element;
}

function addProductImage(parent, className, src, alt) {
  const image = document.createElement("img");
  image.className = className;
  image.src = encodeURI(src);
  image.alt = alt;
  parent.append(image);
  return image;
}

function createTeeCard(product) {
  const card = document.createElement("a");
  card.className = "tee-card tee-product-link";
  card.dataset.category = product.category.toLowerCase();
  card.href = `product.html?id=${encodeURIComponent(product.id)}`;
  card.setAttribute("aria-label", `View ${product.name}`);

  const placeholder = document.createElement("div");
  placeholder.className = "tee-photo-placeholder";
  if (product.frontImage) {
    addProductImage(placeholder, "tee-photo-image tee-photo-front", product.frontImage, `${product.name}, front view`);
    if (product.backImage) {
      addProductImage(placeholder, "tee-photo-image tee-photo-back", product.backImage, `${product.name}, back view`);
      card.addEventListener("pointerenter", () => card.classList.add("is-showing-back"));
      card.addEventListener("pointerleave", () => card.classList.remove("is-showing-back"));
    }
  } else {
    placeholder.setAttribute("aria-label", `Photo coming soon for ${product.name}`);
    addTextElement(placeholder, "span", "", "PHOTO COMING SOON");
  }
  card.append(placeholder);

  const info = document.createElement("div");
  info.className = "tee-product-info";
  addTextElement(info, "h3", "tee-product-name", product.name);
  addTextElement(info, "p", "tee-product-price", formatPrice(product.price));
  card.append(info);
  return card;
}

if (teeProductGrid) {
  teeProducts.forEach((product) => teeProductGrid.append(createTeeCard(product)));
}

if (newReleasesGrid && mostPopularGrid) {
  teeProducts.filter((product) => product.isNewRelease).forEach((product) => newReleasesGrid.append(createTeeCard(product)));
  teeProducts.filter((product) => product.isPopular).forEach((product) => mostPopularGrid.append(createTeeCard(product)));
}

const teeProductCount = document.querySelector("#teeProductCount");
if (teeProductCount) {
  teeProductCount.textContent = `${teeProducts.filter((product) => product.category === "Tees").length} PIECES`;
}

function saveCart() {
  try {
    sessionStorage.setItem("southEsquinaCart", JSON.stringify([...cart.entries()]));
  } catch (error) {
    console.error("Unable to save the shopping cart for this session.", error);
  }
}

function loadCart() {
  try {
    const savedCart = JSON.parse(sessionStorage.getItem("southEsquinaCart") || "[]");
    if (!Array.isArray(savedCart)) {
      throw new TypeError("Saved cart data must be an array.");
    }

    savedCart.forEach(([itemKey, quantity]) => {
      if (typeof itemKey !== "string") return;
      const productId = itemKey.split("|")[0];
      const product = teeProducts.find((item) => item.id === productId);
      const size = itemKey.split("|")[1];
      const available = product?.stock?.[size] ?? 0;
      if (product && Number.isInteger(quantity) && quantity > 0 && available > 0) {
        const remaining = Math.min(quantity, available);
        cart.set(itemKey, remaining);
      }
    });
  } catch (error) {
    console.error("Unable to load the saved shopping cart.", error);
  }
}

function renderCart() {
  if (!cartItems || !cartEmpty || !cartSubtotal || !cartItemCount || !cartCount) return;

  cartItems.replaceChildren();
  let quantityTotal = 0;
  let subtotal = 0;

  cart.forEach((quantity, itemKey) => {
    const [productId, size = "Not selected"] = itemKey.split("|");
    const product = teeProducts.find((item) => item.id === productId);
    if (!product) return;

    quantityTotal += quantity;
    subtotal += product.price * quantity;

    const line = document.createElement("article");
    line.className = "cart-line";
    if (product.frontImage) {
      addProductImage(line, "cart-line-image", product.frontImage, `${product.name} tee`);
    } else {
      const imagePlaceholder = addTextElement(line, "div", "cart-line-art", "PHOTO COMING SOON");
      imagePlaceholder.setAttribute("aria-hidden", "true");
    }

    const info = document.createElement("div");
    info.className = "cart-line-info";
    addTextElement(info, "h3", "", product.name);
    addTextElement(info, "p", "", `TEE · SIZE ${size.toUpperCase()}`);
    addTextElement(info, "strong", "", formatPrice(product.price * quantity));

    const controls = document.createElement("div");
    controls.className = "quantity-control";
    const decrease = addTextElement(controls, "button", "", "−");
    decrease.type = "button";
    decrease.dataset.cartAction = "decrease";
    decrease.dataset.productId = itemKey;
    decrease.setAttribute("aria-label", `Decrease ${product.name} quantity`);
    addTextElement(controls, "span", "", String(quantity));
    const increase = addTextElement(controls, "button", "", "+");
    increase.type = "button";
    increase.dataset.cartAction = "increase";
    increase.dataset.productId = itemKey;
    increase.setAttribute("aria-label", `Increase ${product.name} quantity`);
    increase.disabled = quantity >= (product.stock?.[size] ?? 0);
    const remove = addTextElement(controls, "button", "remove-line", "Remove");
    remove.type = "button";
    remove.dataset.cartAction = "remove";
    remove.dataset.productId = itemKey;
    remove.setAttribute("aria-label", `Remove ${product.name} from cart`);
    info.append(controls);
    line.append(info);
    cartItems.append(line);
  });

  const hasItems = quantityTotal > 0;
  cartItems.hidden = !hasItems;
  cartEmpty.hidden = hasItems;
  cartCount.textContent = String(quantityTotal);
  cartTrigger.setAttribute("aria-label", `Open shopping cart, ${quantityTotal} ${quantityTotal === 1 ? "item" : "items"}`);
  cartItemCount.textContent = `(${quantityTotal})`;
  cartSubtotal.textContent = `${formatPrice(subtotal)} PHP`;
}

loadCart();
renderCart();

function closeCategoryMenu() {
  if (!categoryToggle || !categoryMenu) return;
  categoryToggle.setAttribute("aria-expanded", "false");
  categoryMenu.classList.remove("is-open");
  window.setTimeout(() => {
    if (categoryToggle.getAttribute("aria-expanded") === "false") {
      categoryMenu.hidden = true;
    }
  }, 240);
}

function closeCart(restoreFocus = true) {
  if (!cartPanel || cartPanel.getAttribute("aria-hidden") === "true") return;
  cartPanel.classList.remove("is-open");
  cartPanel.setAttribute("aria-hidden", "true");
  cartOverlay.classList.remove("is-open");
  cartTrigger.setAttribute("aria-expanded", "false");
  document.body.classList.remove("locked");
  window.setTimeout(() => {
    if (cartPanel.getAttribute("aria-hidden") === "true") {
      cartOverlay.hidden = true;
    }
  }, 380);
  if (restoreFocus) cartTrigger.focus();
}

if (cartTrigger && cartPanel && cartOverlay) {
  cartTrigger.addEventListener("click", () => {
    if (cartPanel.getAttribute("aria-hidden") !== "true") return;
    closeMenu();
    closeCategoryMenu();
    cartOverlay.hidden = false;
    cartPanel.setAttribute("aria-hidden", "false");
    cartTrigger.setAttribute("aria-expanded", "true");
    document.body.classList.add("locked");
    window.setTimeout(() => {
      cartOverlay.classList.add("is-open");
      cartPanel.classList.add("is-open");
      cartClose.focus();
    }, 20);
  });

  cartClose.addEventListener("click", () => closeCart());
  continueShopping?.addEventListener("click", () => closeCart());
  cartOverlay.addEventListener("click", () => closeCart());
}

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });
}

mainNav?.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});

if (categoryToggle && categoryMenu) {
  categoryToggle.addEventListener("click", () => {
    const isOpen = categoryToggle.getAttribute("aria-expanded") === "true";
    if (isOpen) {
      closeCategoryMenu();
      return;
    }

    categoryToggle.setAttribute("aria-expanded", "true");
    categoryMenu.hidden = false;
    window.setTimeout(() => categoryMenu.classList.add("is-open"), 20);
  });

  categoryMenu.addEventListener("click", (event) => {
    const categoryButton = event.target.closest("[data-category]");
    if (!categoryButton) return;

    const category = categoryButton.dataset.category;
    window.location.href = `category.html?category=${encodeURIComponent(category.toLowerCase())}`;
  });
}

const categoryPage = document.querySelector("#categoryPage");
if (categoryPage) {
  const categories = {
    tees: "Tees",
    hoodies: "Hoodies",
    sweaters: "Sweaters",
    polos: "Polos",
    pants: "Pants",
    shorts: "Shorts",
  };
  const selectedCategory = new URLSearchParams(window.location.search).get("category")?.toLowerCase();
  const categoryName = categories[selectedCategory];
  const categoryNotFound = document.querySelector("#categoryNotFound");

  if (!categoryName) {
    categoryPage.hidden = true;
    categoryNotFound.hidden = false;
  } else {
    const categoryTitle = document.querySelector("#categoryTitle");
    const categoryProducts = document.querySelector("#categoryProducts");
    const categoryComingSoon = document.querySelector("#categoryComingSoon");
    const products = teeProducts.filter((product) => product.category.toLowerCase() === selectedCategory);
    document.title = `${categoryName} — South Esquina`;
    document.querySelector("#categoryBreadcrumbName").textContent = categoryName;
    categoryTitle.textContent = categoryName;
    document.querySelector("#categoryProductCount").textContent = `${products.length} ${products.length === 1 ? "PIECE" : "PIECES"}`;
    categoryProducts.hidden = products.length === 0;
    categoryComingSoon.hidden = products.length > 0;
    products.forEach((product) => categoryProducts.append(createTeeCard(product)));
  }
}

const categorySelectionClose = document.querySelector("#categorySelectionClose");
if (categorySelectionClose) {
  categorySelectionClose.addEventListener("click", () => {
    document.querySelector("#categorySelection").hidden = true;
  });
}

const productDetail = document.querySelector("#productDetail");
if (productDetail) {
  const productId = new URLSearchParams(window.location.search).get("id");
  const product = teeProducts.find((item) => item.id === productId);
  const productNotFound = document.querySelector("#productNotFound");

  if (product) {
    productDetail.hidden = false;
    productNotFound.hidden = true;
    document.querySelector("#productBreadcrumbs").hidden = false;
    document.querySelector("#productFeatures").hidden = false;
    document.querySelector("#productReviews").hidden = false;
    document.querySelector("#peopleAlsoViewedSection").hidden = false;
    document.title = `${product.name} — South Esquina`;
    document.querySelector("#detailProductName").textContent = product.name;
    document.querySelector("#detailProductPrice").textContent = formatPrice(product.price);
    document.querySelector("#detailProductDescription").textContent = product.description;
    document.querySelector("#detailProductDescription").hidden = !product.description;
    document.querySelector("#detailBreadcrumbName").textContent = product.name;
    const categoryBreadcrumb = document.querySelector("#productCategoryBreadcrumb");
    categoryBreadcrumb.textContent = product.category;
    categoryBreadcrumb.href = `category.html?category=${encodeURIComponent(product.category.toLowerCase())}`;
    document.querySelector("#detailGalleryLabel").textContent = product.name;
    document.querySelector("#productCategoryLabel").textContent = `SOUTH ESQUINA · ${product.category.toUpperCase()}`;
    document.querySelector("#productCollectionValue").textContent = `South Esquina · ${product.category}`;

    const peopleAlsoViewed = document.querySelector("#peopleAlsoViewed");
    const otherProducts = teeProducts.filter((item) => item.id !== product.id);
    const viewedProducts = otherProducts.slice(0, 4);

    viewedProducts.forEach((viewedProduct) => {
      const link = document.createElement("a");
      link.className = "viewed-product";
      link.href = `product.html?id=${encodeURIComponent(viewedProduct.id)}`;
      const image = document.createElement("div");
      image.className = "tee-photo-placeholder viewed-product-image";
      if (viewedProduct.frontImage) {
        addProductImage(image, "tee-photo-image", viewedProduct.frontImage, `${viewedProduct.name}, front view`);
      } else {
        addTextElement(image, "span", "", "PHOTO COMING SOON");
      }
      link.append(image);
      const nameAndPrice = document.createElement("div");
      addTextElement(nameAndPrice, "h3", "tee-product-name", viewedProduct.name);
      addTextElement(nameAndPrice, "p", "tee-product-price", formatPrice(viewedProduct.price));
      link.append(nameAndPrice);
      peopleAlsoViewed.append(link);
    });

      const reviewList = document.querySelector("#productReviewList");
      const reviewEmpty = document.querySelector("#productReviewsEmpty");
      const reviewForm = document.querySelector("#productReviewForm");
      const reviewMessage = document.querySelector("#reviewFormMessage");
      const signInPrompt = document.querySelector("#reviewSignInPrompt");

      async function loadProductReviews() {
        const response = await fetch(`/api/products/${encodeURIComponent(product.id)}/reviews`);
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Unable to load reviews.");

        document.querySelector("#productReviewCount").textContent = `Reviews (${result.count})`;
        document.querySelector("#reviewCountHeading").textContent = result.count
          ? `· ${result.count} · ${result.averageRating} / 5`
          : "";
        const roundedRating = Math.round(result.averageRating);
        document.querySelector("#productReviewStars").textContent =
          `${"★".repeat(roundedRating)}${"☆".repeat(5 - roundedRating)}`;
        reviewList.replaceChildren();
        reviewEmpty.hidden = result.reviews.length > 0;
        result.reviews.forEach((review) => {
          const article = document.createElement("article");
          article.className = "product-review";
          const header = document.createElement("div");
          header.className = "product-review-heading";
          addTextElement(header, "strong", "", review.name);
          const stars = addTextElement(header, "span", "product-review-stars", `${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}`);
          stars.setAttribute("aria-label", `${review.rating} out of 5 stars`);
          article.append(header);
          if (review.comment) addTextElement(article, "p", "product-review-comment", review.comment);
          const date = new Date(review.created_at);
          addTextElement(article, "time", "product-review-date", Number.isNaN(date.valueOf()) ? "" : date.toLocaleDateString());
          reviewList.append(article);
        });
      }

      async function loadReviewFormAccess() {
        if (window.location.protocol === "file:") {
          signInPrompt.hidden = false;
          signInPrompt.textContent = "Sign in through the local store to leave a review.";
          return;
        }
        const response = await fetch("/api/account/session");
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Unable to check your sign-in status.");
        reviewForm.hidden = !result.authenticated;
        signInPrompt.hidden = result.authenticated;
      }

      loadProductReviews().catch((error) => {
        reviewEmpty.hidden = false;
        reviewEmpty.textContent = error.message || "Unable to load reviews.";
      });
      loadReviewFormAccess().catch((error) => {
        signInPrompt.hidden = false;
        signInPrompt.textContent = error.message || "Unable to check your sign-in status.";
      });

      reviewForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        reviewMessage.textContent = "";
        const submitButton = reviewForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        try {
          const rating = reviewForm.querySelector('input[name="rating"]:checked');
          if (!rating) throw new Error("Choose a star rating before submitting.");
          const response = await fetch(`/api/products/${encodeURIComponent(product.id)}/reviews`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              rating: Number(rating.value),
              comment: document.querySelector("#reviewComment").value,
            }),
          });
          const result = await response.json();
          if (!response.ok) throw new Error(result.error || "Unable to submit your review.");
          reviewForm.reset();
          reviewMessage.textContent = result.message;
          reviewMessage.classList.add("is-success");
          await loadProductReviews();
        } catch (error) {
          reviewMessage.textContent = error.message || "Unable to submit your review.";
          reviewMessage.classList.remove("is-success");
        } finally {
          submitButton.disabled = false;
        }
      });

      if (product.frontImage || product.backImage) {
      const productGallery = document.querySelector("#productGallery");
      const galleryImages = [
        { src: product.frontImage, label: "Front view" },
        { src: product.backImage, label: "Back view" },
        { src: product.sizeChartImage, label: "Size chart" },
      ].filter((image) => image.src);
      Array.from(productGallery.children).forEach((tile, index) => {
        const galleryImage = galleryImages[index];
        tile.hidden = !galleryImage;
        if (!galleryImage) return;
        tile.replaceChildren();
        tile.dataset.gallerySlide = galleryImage.label.toLowerCase().replaceAll(" ", "-");
        addProductImage(tile, "product-gallery-image", galleryImage.src, `${product.name} ${galleryImage.label.toLowerCase()}`);
        addTextElement(tile, "small", "", galleryImage.label === "Size chart" ? "Size chart" : `${product.name} · ${galleryImage.label}`);
      });

      const sizeChartButton = document.querySelector("#sizeChartButton");
      if (product.sizeChartImage) {
        sizeChartButton.hidden = false;
        sizeChartButton.addEventListener("click", () => {
          const sizeChartSlide = productGallery.querySelector('[data-gallery-slide="size-chart"]');
          productGallery.scrollTo({ left: sizeChartSlide.offsetLeft, behavior: "instant" });
        });
      }
    }

    const sizeOptions = document.querySelector("#productSizes");
    sizeOptions.replaceChildren();
    product.sizes.forEach((size) => {
      const sizeButton = addTextElement(sizeOptions, "button", "product-size-button", size);
      sizeButton.type = "button";
      sizeButton.dataset.size = size;
      const available = product.stock?.[size] ?? 0;
      sizeButton.textContent = size;
      sizeButton.disabled = available <= 0;
      sizeButton.setAttribute("aria-label", `${size}, ${available} in stock`);
      sizeButton.setAttribute("aria-pressed", "false");
    });
    sizeOptions.addEventListener("click", (event) => {
      const sizeButton = event.target.closest("[data-size]");
      if (!sizeButton) return;
      sizeOptions.querySelectorAll("[data-size]").forEach((button) => {
        const selected = button === sizeButton;
        button.classList.toggle("is-selected", selected);
        button.setAttribute("aria-pressed", String(selected));
      });
      document.querySelector("#sizeError").textContent = "";
    });

    document.querySelector("#detailAddToCart").addEventListener("click", () => {
      const selectedSize = sizeOptions.querySelector("[data-size].is-selected");
      if (!selectedSize) {
        const firstAvailableSize = sizeOptions.querySelector("[data-size]:not(:disabled)");
        document.querySelector("#sizeError").textContent = firstAvailableSize
          ? "Choose a size to continue."
          : "This product is sold out.";
        firstAvailableSize?.focus();
        return;
      }

      const itemKey = `${product.id}|${selectedSize.dataset.size}`;
      const available = product.stock?.[selectedSize.dataset.size] ?? 0;
      const quantity = cart.get(itemKey) || 0;
      if (quantity >= available) {
        document.querySelector("#productAddedMessage").textContent = `Only ${available} in size ${selectedSize.dataset.size} are in stock.`;
        return;
      }
      cart.set(itemKey, quantity + 1);
      saveCart();
      renderCart();
      document.querySelector("#productAddedMessage").textContent = `${product.name}, size ${selectedSize.dataset.size}, added to your cart.`;
    });
  }
}

if (cartItems) {
  cartItems.addEventListener("click", (event) => {
    const actionButton = event.target.closest("[data-cart-action]");
    if (!actionButton) return;

    const { productId: itemKey } = actionButton.dataset;
    const quantity = cart.get(itemKey);
    if (!quantity) return;

    if (actionButton.dataset.cartAction === "increase") {
      const [productId, size] = itemKey.split("|");
      const product = teeProducts.find((item) => item.id === productId);
      if (!product || quantity >= (product.stock?.[size] ?? 0)) return;
      cart.set(itemKey, quantity + 1);
    } else if (actionButton.dataset.cartAction === "decrease") {
      if (quantity === 1) cart.delete(itemKey);
      else cart.set(itemKey, quantity - 1);
    } else if (actionButton.dataset.cartAction === "remove") {
      cart.delete(itemKey);
    } else {
      return;
    }

    saveCart();
    renderCart();
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (cartPanel && cartPanel.getAttribute("aria-hidden") === "false") {
      closeCart();
      return;
    }
    closeMenu();
    closeCategoryMenu();
  }

  if (event.key === "Tab" && cartPanel && cartPanel.getAttribute("aria-hidden") === "false") {
    const focusableElements = [...cartPanel.querySelectorAll("button:not(:disabled), a[href], input:not(:disabled)")];
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }
});

const newsletterForm = document.querySelector("#newsletterForm");

if (newsletterForm) {
  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.querySelector("#newsletterEmail");
    if (!email.checkValidity()) {
      email.reportValidity();
      return;
    }

    const subject = encodeURIComponent("Join the South Esquina mailing list");
    const body = encodeURIComponent(`Hi South Esquina! Please add ${email.value.trim()} to your mailing list.`);
    document.querySelector("#newsletterMessage").textContent = "Opening your email app so we can add you to the list.";
    window.location.href = `mailto:southesquinalgl@gmail.com?subject=${subject}&body=${body}`;
  });
}

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
