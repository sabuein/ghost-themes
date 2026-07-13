import { showToast } from "./toast.mjs";

export function initContactForm() {
    const form = document.getElementById("contact-form");
    if (!(form instanceof HTMLFormElement)) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(form).entries());

        // TODO: send to your endpoint
        // await fetch('/api/contact', { method: 'POST', body: JSON.stringify(data), headers: { 'content-type': 'application/json' } });

        showToast("Message sent. Thank you!", { type: "success" });
        form.closest("dialog")?.close();
        form.reset();
    });
}