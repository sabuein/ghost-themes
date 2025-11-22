// ES module: productPricing.mjs

/**
 * Single source-of-truth product metadata (set name/price/unit once)
 * Edit these values to update product metadata across hosts.
 */
const products = {
  makdousOkra: { sku: "makdous-okra", name: "Makdous Okra", price: 4.99, unit: "jar" },
  pott: { sku: "pott", name: "Palestine On The Thames: Nakba In My Present", price: 0.0, unit: "ticket" },
  hrpp: { sku: "hrpp", name: "Hot Red Pepper Paste", price: 2.99, unit: "jar" },

};

/**
 * Per-host mapping from internal product SKU -> external platform ID
 * Add new host keys or change IDs here. Keep product metadata in `products`.
 */
const idMap = {
  "auntysuzy.co.uk": {
    makdousOkra: "691ee103d8043438f2426000",
    pott: "691ee01ad8043438f2425fdd",
    hrpp: "",
  },
  default: {
    makdousOkra: "691d0d9b01b58127d6c61d12",
    pott: "691ecd455d762ceb9f911bc6",
    hrpp: "",
  },
};

/** Normalize hostnames for robust matching. */
const normalizeHost = (host) => {
  return (host || "")
    .toString()
    .toLowerCase()
    .replace(/^www\./, "");
};

/**
 * Build a mapping from external ID -> product object for a given host.
 * - hostname: string (optional, fallback to location.hostname)
 * - productsArg and idMapArg allow overriding (useful for tests)
 */
const buildPriceListForHost = (
  hostname = (typeof location !== "undefined" && location.hostname) || "",
  productsArg = products,
  idMapArg = idMap
) => {
  const host = normalizeHost(hostname);
  const skuToId = idMapArg[host] || idMapArg.default || {};
  const result = {};
  for (const [sku, id] of Object.entries(skuToId)) {
    if (productsArg[sku]) {
      result[id] = productsArg[sku];
    } else {
      // preserve a minimal fallback so the externalId exists even if product is missing
      result[id] = { sku, name: "", price: 0.0, unit: "item" };
      // eslint-disable-next-line no-console
      console.warn(`buildPriceListForHost: SKU "${sku}" not found in products.`);
    }
  }
  return result;
};

/** Format price to 2 decimal places as a string. */
const formatPrice = (num) => {
  if (Number.isNaN(Number(num))) return "0.00";
  return Number(num).toFixed(2);
};

/**
 * Apply pricing/ui updates to DOM elements.
 * Options:
 * - root: document root to query within (default document)
 * - hostname: override for buildPriceListForHost (useful for SSR/tests)
 * - selectors: { button, priceCurrent, priceUnit }
 * - useSku: if true, script uses data-sku on buttons and resolves to external IDs via idMap,
 *           then sets data-item-id on the button. This lets templates be host-agnostic.
 * - containerSelector: used for btn.closest(...) to find related price elements
 */
const applyPrices = ({
  root = (typeof document !== "undefined" ? document : null),
  hostname = (typeof location !== "undefined" ? location.hostname : ""),
  selectors = {
    button: "button.snipcart-add-item",
    priceCurrent: "span.pc-price-current",
    priceUnit: "span.pc-price-unit",
  },
  useSku = false,
  containerSelector = ".product, [data-product]",
  productsArg = products,
  idMapArg = idMap,
} = {}) => {
  if (!root) {
    // nothing to do in non-DOM environments
    // eslint-disable-next-line no-console
    console.warn("applyPrices: no root provided (non-DOM environment).");
    return;
  }

  // Build price list (externalId -> product)
  const priceList = buildPriceListForHost(hostname, productsArg, idMapArg);

  const buttons = Array.from(root.querySelectorAll(selectors.button));
  const globalPriceCurrent = Array.from(root.querySelectorAll(selectors.priceCurrent));
  const globalPriceUnit = Array.from(root.querySelectorAll(selectors.priceUnit));

  buttons.forEach((btn, index) => {
    // Optionally resolve SKU -> external ID at runtime (keeps templates host-agnostic)
    let externalId = null;
    if (useSku) {
      const sku = btn.dataset.sku;
      if (sku) {
        const hostMap = idMapArg[normalizeHost(hostname)] || idMapArg.default || {};
        externalId = hostMap[sku];
        if (!externalId) {
          // eslint-disable-next-line no-console
          console.warn(`applyPrices: no external ID for SKU "${sku}" on host "${hostname}"`);
        } else {
          // set data-item-id so Snipcart or other libs see the correct external id
          btn.setAttribute("data-item-id", externalId);
        }
      } else {
        // eslint-disable-next-line no-console
        console.warn("applyPrices: useSku enabled but button has no data-sku attribute", btn);
      }
    }

    // If we didn't set externalId via SKU, fall back to existing attribute
    if (!externalId) externalId = btn.getAttribute("data-item-id");

    const product = priceList[externalId];

    const price = product ? product.price : 0;
    const unit = product ? product.unit : "item";

    // Set snipcart price attribute (two decimals)
    btn.setAttribute("data-item-price", formatPrice(price));

    // Prefer updating elements inside the same product container
    const container = btn.closest(containerSelector) || btn.parentElement || document;

    let priceCurrentEl = container && container.querySelector(selectors.priceCurrent);
    let priceUnitEl = container && container.querySelector(selectors.priceUnit);

    // Fallback to global node lists by index (keeps backward compatibility)
    if (!priceCurrentEl) priceCurrentEl = globalPriceCurrent[index];
    if (!priceUnitEl) priceUnitEl = globalPriceUnit[index];

    if (priceCurrentEl) priceCurrentEl.textContent = `£${formatPrice(price)}`;
    if (priceUnitEl) priceUnitEl.textContent = `/ ${unit}`;

    // Per-tag customisation (same as your original logic)
    const primaryTag = btn.getAttribute("data-primary-tag");
    switch (primaryTag) {
      case "food-pickles":
        btn.setAttribute("data-item-custom1-name", "Container Type");
        btn.setAttribute("data-item-custom1-options", "Jar");
        break;
      case "tickets":
        btn.disabled = true;
        btn.setAttribute("aria-disabled", "true");
        break;
      default:
        break;
    }

    // Keep some metadata in sync if product is known
    if (product) {
      btn.setAttribute("data-item-name", product.name || "");
      // ensure the data-item-id remains the external id (if present)
      if (externalId) btn.setAttribute("data-item-id", externalId);
    } else {
      // eslint-disable-next-line no-console
      console.warn(`applyPrices: no product metadata for external id "${externalId}"`);
    }
  });
};

/**
 * Convenience initializer that runs applyPrices() on import or page load.
 * You can pass the same options as applyPrices.
 * Example:
 * import { initPricing } from './product-pricing.js';
 * initPricing({ useSku: true });
 */
const initPricing = (options = {}) => {
  // run on next microtask to allow DOM to settle if called in head
  Promise.resolve().then(() => applyPrices(options));
};

export {
  initPricing,
};