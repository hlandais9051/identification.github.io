const bg = document.getElementById("bg-animation");
for (let i = 0; i < 50; i++) {
  const span = document.createElement("span");
  span.style.setProperty("--i", i);
  bg.appendChild(span);
}

const log = "OTA1MQ==";
let userEnCoursDeModif = "";

function showNotify(message, type = "success") {
  const container = document.getElementById("notification-container");
  const notif = document.createElement("div");
  notif.className = `notification ${type}`;
  const icon =
    type === "success" ? "ri-checkbox-circle-fill" : "ri-error-warning-fill";
  notif.innerHTML = `<i class="${icon}" style="color: ${type === "success" ? "rgb(255, 0, 0)" : "#ff4d4d"}"></i><span>${message}</span>`;
  container.appendChild(notif);
  setTimeout(() => {
    notif.style.animation = "fadeOut 0.5s ease forwards";
    setTimeout(() => notif.remove(), 500);
  }, 3000);
}

document
  .getElementById("admin-code-input")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      verifierCodeAdmin();
    }
  });

document
  .getElementById("new-pass-input")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      sauvegarderNouveauPass();
    }
  });

document.getElementById("auth-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value;
  if (user.toUpperCase() === "HUGO" && btoa(pass) === log) {
    showNotify("Bienvenue Hugo !", "success");
    return;
  }
  const savedPass = localStorage.getItem("pass_" + user.toUpperCase());
  if (savedPass && pass === savedPass) {
    showNotify("Connexion établie", "success");
  } else {
    showNotify("Identifiant ou mot de passe incorrects", "error");
  }
});

document
  .getElementById("togglePassword")
  .addEventListener("click", function () {
    const input = document.getElementById("password");
    const isPass = input.getAttribute("type") === "password";
    input.setAttribute("type", isPass ? "text" : "password");
    this.classList.toggle("ri-eye-fill");
    this.classList.toggle("ri-eye-off-fill");
  });

function changerEtape(num) {
  document
    .querySelectorAll(".admin-section")
    .forEach((s) => s.classList.remove("active"));
  document.getElementById(`sec-step-${num}`).classList.add("active");
  if (num === 1)
    setTimeout(() => document.getElementById("admin-code-input").focus(), 100);
  if (num === 4)
    setTimeout(() => document.getElementById("new-pass-input").focus(), 100);
}

let clicks = 0;
document.getElementById("dev-trigger").addEventListener("click", () => {
  clicks++;
  if (clicks === 3) {
    clicks = 0;
    document.getElementById("admin-modal").style.display = "block";
    changerEtape(1);
  }
  setTimeout(() => (clicks = 0), 2000);
});

function verifierCodeAdmin() {
  const val = document.getElementById("admin-code-input").value;
  if (btoa(val.trim()) === log) {
    showNotify("Accès autorisé", "success");
    changerEtape(2);
  } else {
    showNotify("Code incorrect", "error");
  }
}

function ouvrirVoirPass() {
  document.getElementById("disp-jeano").innerText =
    localStorage.getItem("pass_JEANO") || "Non défini";
  document.getElementById("disp-gueno").innerText =
    localStorage.getItem("pass_GUENO") || "Non défini";
  changerEtape(5);
}

function preparerNouveauPass(user) {
  userEnCoursDeModif = user;
  document.getElementById("label-nouveau-pass").innerText =
    `Nouveau MdP pour ${user} :`;
  document.getElementById("new-pass-input").value = "";
  changerEtape(4);
}

function sauvegarderNouveauPass() {
  const nPass = document.getElementById("new-pass-input").value;
  if (nPass.trim() !== "") {
    localStorage.setItem("pass_" + userEnCoursDeModif.toUpperCase(), nPass);
    showNotify("Mis à jour !", "success");
    changerEtape(2);
  }
}

function fermerAdmin() {
  document.getElementById("admin-modal").style.display = "none";
  document.getElementById("admin-code-input").value = "";
  document.getElementById("new-pass-input").value = "";
  changerEtape(1);
}

let utilisateurSelectionne = "";

function ouvrirCreationPass() {
  document.getElementById("user-creation-modal").style.display = "block";
  document.querySelector(".login-box").style.opacity = "0.1";
  retourChoixUtilisateur();
}

function choisirUtilisateurCreation(nom) {
  const existant = localStorage.getItem("pass_" + nom.toUpperCase());

  if (existant) {
    showNotify("Profil déjà configuré. Contactez l'admin.", "error");
  } else {
    utilisateurSelectionne = nom;
    document.getElementById("reg-step-1").style.display = "none";
    document.getElementById("reg-step-2").style.display = "block";
    document.getElementById("reg-label-final").innerText =
      "Mot de passe pour " + nom + " :";
    setTimeout(() => document.getElementById("reg-password").focus(), 100);
  }
}

function retourChoixUtilisateur() {
  document.getElementById("reg-step-1").style.display = "block";
  document.getElementById("reg-step-2").style.display = "none";
  document.getElementById("reg-password").value = "";
}

function fermerCreation() {
  document.getElementById("user-creation-modal").style.display = "none";
  document.querySelector(".login-box").style.opacity = "1";
}

function validerCreationUtilisateur() {
  const pass = document.getElementById("reg-password").value;

  if (pass.trim() === "") {
    showNotify("Le mot de passe ne peut pas être vide", "error");
    return;
  }

  localStorage.setItem("pass_" + utilisateurSelectionne.toUpperCase(), pass);

  showNotify("Compte " + utilisateurSelectionne + " configuré !", "success");
  fermerCreation();
}
