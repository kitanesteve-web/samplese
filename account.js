const accountForms = document.querySelector("#accountForms");
const accountTabs = document.querySelector("#accountTabs");
const registerPanel = document.querySelector("#registerPanel");
const signInPanel = document.querySelector("#signInPanel");
const signedInPanel = document.querySelector("#signedInPanel");
const accountForm = document.querySelector("#accountForm");
const signInForm = document.querySelector("#signInForm");
const accountMessage = document.querySelector("#accountMessage");
const signInMessage = document.querySelector("#signInMessage");
const signOutMessage = document.querySelector("#signOutMessage");

function showMessage(element, message, success = false) {
  element.textContent = message;
  element.classList.toggle("is-success", success);
}

function displayCustomer(customer) {
  accountTabs.hidden = true;
  accountForms.hidden = true;
  signedInPanel.hidden = false;
  document.querySelector("#signedInName").textContent = customer.name;
  document.querySelector("#signedInEmail").textContent = customer.email;
}

function selectAccountTab(selectedTab, focusPanel = false) {
  const isSignIn = selectedTab.id === "signInTab";
  signInPanel.hidden = !isSignIn;
  registerPanel.hidden = isSignIn;
  document.querySelector("#signInTab").setAttribute("aria-selected", String(isSignIn));
  document.querySelector("#registerTab").setAttribute("aria-selected", String(!isSignIn));
  document.querySelector("#signInTab").classList.toggle("is-active", isSignIn);
  document.querySelector("#registerTab").classList.toggle("is-active", !isSignIn);
  if (focusPanel) {
    (isSignIn ? signInForm : accountForm).querySelector("input").focus();
  }
}

document.querySelector("#signInTab").addEventListener("click", (event) => {
  selectAccountTab(event.currentTarget);
});

document.querySelector("#registerTab").addEventListener("click", (event) => {
  selectAccountTab(event.currentTarget);
});
if (new URLSearchParams(window.location.search).get("mode") === "signin") {
  selectAccountTab(document.querySelector("#signInTab"));
}

accountForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  showMessage(accountMessage, "");
  const submitButton = accountForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;

  try {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(accountForm))),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Unable to create the account.");
    accountForm.reset();
    showMessage(accountMessage, `${result.message} You can sign in now.`, true);
  } catch (error) {
    showMessage(accountMessage, error.message || "Unable to create the account. Please try again.");
  } finally {
    submitButton.disabled = false;
  }
});

signInForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  showMessage(signInMessage, "");
  const submitButton = signInForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;

  try {
    const response = await fetch("/api/account/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(signInForm))),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Unable to sign in.");
    signInForm.reset();
    displayCustomer(result.customer);
  } catch (error) {
    showMessage(signInMessage, error.message || "Unable to sign in. Please try again.");
  } finally {
    submitButton.disabled = false;
  }
});

document.querySelector("#accountSignOut").addEventListener("click", async () => {
  const button = document.querySelector("#accountSignOut");
  button.disabled = true;
  showMessage(signOutMessage, "");
  try {
    const response = await fetch("/api/account/logout", { method: "POST" });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Unable to sign out.");
    signedInPanel.hidden = true;
    accountForms.hidden = false;
    accountTabs.hidden = false;
    selectAccountTab(document.querySelector("#signInTab"));
    showMessage(signInMessage, "You have signed out.", true);
  } catch (error) {
    showMessage(signOutMessage, error.message || "Unable to sign out. Please try again.");
  } finally {
    button.disabled = false;
  }
});

try {
  const response = await fetch("/api/account/session");
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Unable to check your sign-in status.");
  if (result.authenticated) displayCustomer(result.customer);
} catch (error) {
  showMessage(accountMessage, error.message || "Unable to check your sign-in status.");
}
