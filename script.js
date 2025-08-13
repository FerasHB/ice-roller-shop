// Preise & Titel in DE/EN
const PRICES = {
  silicone: 19.90,
  steel: 29.90,
  bundle: 44.90
};
const TITLES = {
  de: {
    silicone: "Ice Roller – Silikon",
    steel: "Ice Roller – Edelstahl",
    bundle: "Bundle: Silikon + Edelstahl"
  },
  en: {
    silicone: "Ice Roller – Silicone",
    steel: "Ice Roller – Stainless Steel",
    bundle: "Bundle: Silicone + Stainless Steel"
  }
};

// PayPal erst aktivieren, wenn live (Gewerbe + PayPal Business)
window.PAYPAL_LIVE = true;

function setVariant(variant) {
  const lang = document.documentElement.lang || 'de';
  const v = variant || 'silicone';
  document.body.setAttribute('data-variant', v);
  document.querySelectorAll('.variant input').forEach(r => r.checked = (r.value === v));
  document.querySelectorAll('.product-title').forEach(el => el.textContent = TITLES[lang][v]);
  document.querySelectorAll('.price').forEach(el => el.textContent = PRICES[v].toFixed(2) + ' €');
  document.querySelectorAll('.paypal-guard').forEach(el => el.style.display = window.PAYPAL_LIVE ? 'none' : 'block');
}

// ✅ Neue Funktion: PayPal-Buttons robust laden
function renderPayPalButtons() {
  if (!window.PAYPAL_LIVE) return;
  const container = document.getElementById('paypal-button-container');
  if (!container) return;

  if (window.paypal && paypal.Buttons) {
    paypal.Buttons({
      style: { layout: 'vertical', shape: 'rect' },
      createOrder: function (data, actions) {
        const v = document.body.getAttribute('data-variant') || 'silicone';
        const price = PRICES[v].toFixed(2);
        const lang = document.documentElement.lang || 'de';
        const desc = (lang === 'de' ? TITLES.de[v] : TITLES.en[v]);
        return actions.order.create({
          purchase_units: [{ amount: { value: price, currency_code: 'EUR' }, description: desc }]
        });
      },
      onApprove: function (data, actions) {
        return actions.order.capture().then(function (details) {
          const lang = document.documentElement.lang || 'de';
          alert(lang === 'de'
            ? ('Danke, ' + details.payer.name.given_name + '! Bestellung eingegangen.')
            : ('Thanks, ' + details.payer.name.given_name + '! Order received.'));
        });
      }
    }).render('#paypal-button-container');
  } else {
    setTimeout(renderPayPalButtons, 300); // Wiederholen nach 300ms
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setVariant('silicone');
  renderPayPalButtons(); // Jetzt wird wiederholt geprüft
});

// Lead-Formular – öffnet Mail-Client
function onLeadSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('leadEmail').value.trim();
  const v = document.body.getAttribute('data-variant') || 'silicone';
  if (!email) {
    alert(document.documentElement.lang === 'de' ? 'Bitte E-Mail eingeben.' : 'Please enter your email.');
    return;
  }
  const lang = document.documentElement.lang || 'de';
  const subject = encodeURIComponent(lang === 'de' ? 'Vormerkung Ice Roller' : 'Ice Roller Reservation');
  const body = encodeURIComponent(
    (lang === 'de'
      ? 'Bitte informiert mich, sobald der Shop live ist. Variante: '
      : 'Please notify me when the shop is live. Variant: ')
    + v + '\nEmail: ' + email
  );
  window.location.href = 'mailto:info@example.com?subject=' + subject + '&body=' + body;
}
