const loginPanel = document.querySelector("#adminLogin");
const dashboard = document.querySelector("#adminDashboard");
const loginForm = document.querySelector("#adminLoginForm");
const loginMessage = document.querySelector("#adminLoginMessage");
const productForm = document.querySelector("#productForm");
const productList = document.querySelector("#adminProductList");
const productFormMessage = document.querySelector("#productFormMessage");
const productListMessage = document.querySelector("#productListMessage");
const accountListMessage = document.querySelector("#accountListMessage");
const reviewList = document.querySelector("#adminReviewList");
const reviewListMessage = document.querySelector("#reviewListMessage");
const fileFields = ["frontImage", "backImage", "sizeChartImage"];
let products = [];

async function request(path, options = {}) {
  const response = await fetch(path, { credentials: "same-origin", ...options });
  const result = response.headers.get("content-type")?.includes("application/json")
    ? await response.json()
    : {};
  if (!response.ok) throw new Error(result.error || "The request could not be completed.");
  return result;
}

function showMessage(element, message, success = false) {
  element.textContent = message;
  element.classList.toggle("is-success", success);
}

function setAuthenticated(username) {
  loginPanel.hidden = true;
  dashboard.hidden = false;
  document.querySelector(".admin-dashboard-heading .eyebrow").textContent = `SIGNED IN · ${username.toUpperCase()}`;
  loadProducts();
  loadAccounts();
  loadReviews();
}

function makeProductCard(product) {
  const card = document.createElement("article");
  card.className = "admin-product-card";
  const image = document.createElement("img");
  image.src = encodeURI(product.frontImage);
  image.alt = `${product.name}, front`;
  image.loading = "lazy";
  card.append(image);

  const info = document.createElement("div");
  info.className = "admin-product-info";
  const name = document.createElement("h3");
  name.textContent = product.name;
  const detail = document.createElement("p");
  detail.textContent = `${product.category} · ₱${Number(product.price).toFixed(2)}`;
  const inventory = document.createElement("p");
  inventory.textContent = product.sizes.map((size) => `${size}: ${product.stock[size] ?? 0}`).join(" · ");
  const badges = document.createElement("p");
  badges.className = "admin-product-badges";
  badges.textContent = [
    product.isNewRelease ? "New release" : "",
    product.isPopular ? "Most popular" : "",
  ].filter(Boolean).join(" · ") || "Standard listing";
  info.append(name, detail, inventory, badges);

  const actions = document.createElement("div");
  actions.className = "admin-product-actions";
  const edit = document.createElement("button");
  edit.type = "button";
  edit.className = "admin-refresh";
  edit.textContent = "Edit";
  edit.addEventListener("click", () => startEdit(product));
  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "admin-delete";
  remove.textContent = "Remove";
  remove.addEventListener("click", () => removeProduct(product));
  actions.append(edit, remove);
  card.append(info, actions);
  return card;
}

async function loadProducts() {
  productListMessage.textContent = "";
  try {
    products = await request("/api/products");
    productList.replaceChildren(...products.map(makeProductCard));
    document.querySelector("#adminProductCount").textContent = String(products.length);
  } catch (error) {
    showMessage(productListMessage, error.message);
  }
}

async function loadAccounts() {
  accountListMessage.textContent = "";
  try {
    const result = await request("/api/admin/accounts");
    document.querySelector("#adminAccountCount").textContent = String(result.count);
    document.querySelector("#adminAccountTabCount").textContent = String(result.count);
    const rows = result.accounts.map((account) => {
      const row = document.createElement("tr");
      for (const value of [
        account.name,
        account.email,
        new Date(account.created_at).toLocaleString(),
      ]) {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.append(cell);
      }
      return row;
    });
    const tbody = document.querySelector("#adminAccountList");
    tbody.replaceChildren(...rows);
    if (!rows.length) {
      const row = document.createElement("tr");
      const empty = document.createElement("td");
      empty.colSpan = 3;
      empty.textContent = "No customer accounts have registered yet.";
      row.append(empty);
      tbody.append(row);
    }
  } catch (error) {
    showMessage(accountListMessage, error.message);
  }
}

function makeReviewCard(review) {
  const card = document.createElement("article");
  card.className = "admin-review-card";

  const content = document.createElement("div");
  content.className = "admin-review-content";
  const heading = document.createElement("div");
  heading.className = "admin-review-heading";
  const product = document.createElement("h3");
  product.textContent = review.product_name;
  const status = document.createElement("span");
  status.className = review.is_hidden ? "admin-review-status is-hidden" : "admin-review-status";
  status.textContent = review.is_hidden ? "Hidden" : "Visible";
  heading.append(product, status);

  const metadata = document.createElement("p");
  metadata.className = "admin-review-meta";
  metadata.textContent = `${review.customer_name} · ${review.email} · ${new Date(review.created_at).toLocaleString()}`;
  const rating = document.createElement("p");
  rating.className = "admin-review-rating";
  rating.textContent = `${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)} (${review.rating}/5)`;
  const comment = document.createElement("p");
  comment.className = "admin-review-comment";
  comment.textContent = review.comment || "No written comment.";
  content.append(heading, metadata, rating, comment);

  const actions = document.createElement("div");
  actions.className = "admin-review-actions";
  const visibility = document.createElement("button");
  visibility.type = "button";
  visibility.className = "admin-refresh";
  visibility.textContent = review.is_hidden ? "Show" : "Hide";
  visibility.addEventListener("click", () => setReviewVisibility(review, !review.is_hidden, visibility));
  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "admin-delete";
  remove.textContent = "Delete";
  remove.addEventListener("click", () => removeReview(review, remove));
  actions.append(visibility, remove);
  card.append(content, actions);
  return card;
}

async function loadReviews() {
  reviewListMessage.textContent = "";
  try {
    const reviews = await request("/api/admin/reviews");
    const cards = reviews.map(makeReviewCard);
    reviewList.replaceChildren(...cards);
    document.querySelector("#adminReviewCount").textContent = String(reviews.length);
    document.querySelector("#adminReviewTabCount").textContent = String(reviews.length);
    if (!reviews.length) {
      const empty = document.createElement("p");
      empty.className = "admin-review-empty";
      empty.textContent = "There are no product reviews yet.";
      reviewList.append(empty);
    }
  } catch (error) {
    showMessage(reviewListMessage, error.message);
  }
}

async function setReviewVisibility(review, hidden, button) {
  button.disabled = true;
  reviewListMessage.textContent = "";
  try {
    await request(`/api/admin/reviews/${review.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hidden }),
    });
    await loadReviews();
  } catch (error) {
    showMessage(reviewListMessage, error.message);
    button.disabled = false;
  }
}

async function removeReview(review, button) {
  if (!window.confirm(`Permanently delete this review for "${review.product_name}" by ${review.customer_name}?`)) return;
  button.disabled = true;
  reviewListMessage.textContent = "";
  try {
    await request(`/api/admin/reviews/${review.id}`, { method: "DELETE" });
    await loadReviews();
  } catch (error) {
    showMessage(reviewListMessage, error.message);
    button.disabled = false;
  }
}

function startEdit(product) {
  productForm.reset();
  document.querySelector("#productId").value = product.id;
  document.querySelector("#productName").value = product.name;
  document.querySelector("#productCategory").value = product.category;
  document.querySelector("#productPrice").value = product.price;
  document.querySelector("#productSizes").value = product.sizes.join(", ");
  document.querySelector("#productStock").value = product.sizes
    .map((size) => `${size}: ${product.stock[size] ?? 0}`)
    .join(", ");
  document.querySelector("#productDescription").value = product.description;
  document.querySelector("#productNewRelease").checked = product.isNewRelease;
  document.querySelector("#productPopular").checked = product.isPopular;
  document.querySelector("#productFormTitle").textContent = "Edit product";
  document.querySelector("#productSaveButton").textContent = "Save changes";
  document.querySelector("#frontImageNote").textContent = "Leave empty to keep current image · PNG, JPG, WebP · max 8 MB";
  document.querySelector("#cancelProductEdit").hidden = false;
  productFormMessage.textContent = "";
  productForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

function resetProductForm() {
  productForm.reset();
  document.querySelector("#productStock").value = "S: 0, M: 0, L: 0, XL: 0";
  document.querySelector("#productId").value = "";
  document.querySelector("#productFormTitle").textContent = "Add a product";
  document.querySelector("#productSaveButton").textContent = "Add product";
  document.querySelector("#frontImageNote").textContent = "Required for a new product · PNG, JPG, WebP · max 8 MB";
  document.querySelector("#cancelProductEdit").hidden = true;
  productFormMessage.textContent = "";
}

async function removeProduct(product) {
  if (!window.confirm(`Remove "${product.name}" from the storefront?`)) return;
  try {
    await request(`/api/admin/products/${encodeURIComponent(product.id)}`, { method: "DELETE" });
    if (document.querySelector("#productId").value === product.id) resetProductForm();
    await loadProducts();
  } catch (error) {
    showMessage(productListMessage, error.message);
  }
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  loginMessage.textContent = "";
  const button = loginForm.querySelector('button[type="submit"]');
  button.disabled = true;
  try {
    const result = await request("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(loginForm))),
    });
    loginForm.reset();
    setAuthenticated(result.username);
  } catch (error) {
    showMessage(loginMessage, error.message);
  } finally {
    button.disabled = false;
  }
});

productForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  showMessage(productFormMessage, "");
  const button = document.querySelector("#productSaveButton");
  button.disabled = true;
  try {
    const formData = new FormData(productForm);
    formData.set("isNewRelease", String(document.querySelector("#productNewRelease").checked));
    formData.set("isPopular", String(document.querySelector("#productPopular").checked));
    for (const field of fileFields) {
      if (!formData.get(field)?.size) formData.delete(field);
    }
    const id = document.querySelector("#productId").value;
    await request(id ? `/api/admin/products/${encodeURIComponent(id)}` : "/api/admin/products", {
      method: id ? "PUT" : "POST",
      body: formData,
    });
    resetProductForm();
    showMessage(productFormMessage, id ? "Product updated." : "Product added.", true);
    await loadProducts();
  } catch (error) {
    showMessage(productFormMessage, error.message);
  } finally {
    button.disabled = false;
  }
});

document.querySelector("#cancelProductEdit").addEventListener("click", resetProductForm);
document.querySelector("#refreshProducts").addEventListener("click", loadProducts);
document.querySelector("#refreshAccounts").addEventListener("click", loadAccounts);
document.querySelector("#refreshReviews").addEventListener("click", loadReviews);

document.querySelectorAll("[data-admin-view]").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll("[data-admin-view]").forEach((item) => item.classList.toggle("is-active", item === tab));
    document.querySelector("#adminProductsView").hidden = tab.dataset.adminView !== "products";
    document.querySelector("#adminAccountsView").hidden = tab.dataset.adminView !== "accounts";
    document.querySelector("#adminReviewsView").hidden = tab.dataset.adminView !== "reviews";
    if (tab.dataset.adminView === "accounts") loadAccounts();
    if (tab.dataset.adminView === "reviews") loadReviews();
  });
});

document.querySelector("#adminLogout").addEventListener("click", async () => {
  try {
    await request("/api/admin/logout", { method: "POST" });
    dashboard.hidden = true;
    loginPanel.hidden = false;
    loginMessage.textContent = "You have signed out.";
    loginMessage.classList.add("is-success");
  } catch (error) {
    window.alert(error.message);
  }
});

try {
  const session = await request("/api/admin/session");
  if (session.authenticated) setAuthenticated(session.username);
} catch (error) {
  showMessage(loginMessage, error.message);
}
