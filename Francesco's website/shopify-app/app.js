function navSlide() {
  const burger = document.querySelector(".toggle-button");
  const nav = document.querySelector(".main-nav__list-items");
  const navLinks = document.querySelectorAll(".main-nav__list-item");

  if (!burger) {
    return;
  }

  burger.addEventListener("click", () => {
    nav.classList.toggle("nav-active");

    navLinks.forEach((link, index) => {
      if (link.style.animation) {
        link.style.animation = "";
      } else {
        link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.5}s`;
      }
    });

    burger.classList.toggle("toggle");
  });
}

function buildFieldData() {
  const baseLabels = [
    "Riga",
    "Font",
    "Allineamento",
    "Logo",
    "Colore",
    "QR Code",
    "Riga",
    "Riga",
  ];
  const fields = [];

  for (let i = 1; i <= 220; i += 1) {
    const labelBase = baseLabels[i % baseLabels.length];
    fields.push({
      id: i,
      label: `${labelBase} ${i}`,
      type: i % 5 === 0 ? "upload" : "text",
      max: i % 5 === 0 ? 1 : 20,
      required: i % 3 !== 0,
      price: i % 4 === 0 ? 2.5 : 0,
    });
  }

  return fields;
}

function renderFields(fields) {
  const list = document.getElementById("fieldsList");
  const count = document.getElementById("fieldCount");

  if (!list || !count) {
    return;
  }

  list.innerHTML = "";
  fields.forEach((field) => {
    const card = document.createElement("div");
    card.className = "field-card";
    card.innerHTML = `
      <strong>${field.label}</strong>
      <span>Tipo: ${field.type}</span>
      <span>Max: ${field.max}</span>
      <span>${field.required ? "Obbligatorio" : "Opzionale"}</span>
      <span>Extra: €${field.price.toFixed(2)}</span>
    `;
    list.appendChild(card);
  });

  count.textContent = fields.length;
}

function registerForm(fields) {
  const form = document.getElementById("fieldForm");
  if (!form) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const newField = {
      id: fields.length + 1,
      label: formData.get("label"),
      type: formData.get("type"),
      max: Number(formData.get("max")) || 0,
      required: formData.get("required") === "on",
      price: Number(formData.get("price")) || 0,
    };

    fields.unshift(newField);
    renderFields(fields);
    form.reset();
  });
}

function setupPreviewModal() {
  const previewButton = document.getElementById("previewButton");
  const previewModal = document.getElementById("previewModal");
  const closePreview = document.getElementById("closePreview");
  const closePreviewSecondary = document.getElementById("closePreviewSecondary");
  const downloadPreview = document.getElementById("downloadPreview");

  if (!previewButton || !previewModal) {
    return;
  }

  const closeModal = () => {
    previewModal.classList.remove("is-visible");
    previewModal.setAttribute("aria-hidden", "true");
  };

  previewButton.addEventListener("click", () => {
    previewModal.classList.add("is-visible");
    previewModal.setAttribute("aria-hidden", "false");
  });

  [closePreview, closePreviewSecondary].forEach((button) => {
    if (!button) {
      return;
    }

    button.addEventListener("click", closeModal);
  });

  previewModal.addEventListener("click", (event) => {
    if (event.target === previewModal) {
      closeModal();
    }
  });

  if (downloadPreview) {
    downloadPreview.addEventListener("click", () => {
      const content =
        "Anteprima demo timbro\\n\\nMerceria Bianchi\\nVia A. Moro 25\\nCon riserva\\n";
      const blob = new Blob([content], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "anteprima-demo.txt";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(link.href);
    });
  }
}

navSlide();

const fieldData = buildFieldData();
renderFields(fieldData);
registerForm(fieldData);
setupPreviewModal();
