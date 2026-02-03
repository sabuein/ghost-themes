"use strict";

// =============================================
// file: mods/beaconClient.js
// A tiny, framework-agnostic Beacon/analytics helper for PWAs
// Importable as an ES module.
// =============================================

export class BeaconClient {
    constructor({
        endpoint = "/log",
        autoInit = true,
        withCredentials = false,
        headers = {},
        getContext = () => ({}),
    } = {}) {
        this.endpoint = endpoint;
        this.withCredentials = withCredentials;
        this.headers = headers;
        this.getContext = getContext;
        this._state = this._computeState();
        this._beforeUnloadListener = null;

        if (autoInit) this.init();
    }

    // ------------------------
    // Public API
    // ------------------------

    init() {
        if (this._initialized) return;
        this._initialized = true;

        const opts = { capture: true, passive: true };

        const onStateCandidate = () => this._logState(this._computeState());

        ["pageshow", "focus", "blur", "visibilitychange", "resume"].forEach((t) => {
            addEventListener(t, onStateCandidate, opts);
        });

        addEventListener(
            "freeze",
            () => this._logState("frozen"),
            opts
        );

        addEventListener(
            "pagehide",
            (ev) => this._logState(ev.persisted ? "frozen" : "terminated"),
            opts
        );

        const terminationEvent = "onpagehide" in self ? "pagehide" : "unload";
        addEventListener(terminationEvent, () => {
            /* noop but keeps parity with older browsers */
        });

        addEventListener("visibilitychange", () => {
            if (document.visibilityState === "hidden") {
                this.send({ type: "page_hidden" });
            }
        }, opts);

        this.send({ type: "page_init" });
    }

    enableBeforeUnloadGuard(getMessage = () => "Unsaved changes") {
        if (this._beforeUnloadListener) return;
        this._beforeUnloadListener = (event) => {
            event.preventDefault();
            event.returnValue = getMessage();
            return getMessage();
        };
        addEventListener("beforeunload", this._beforeUnloadListener);
    }

    disableBeforeUnloadGuard() {
        if (!this._beforeUnloadListener) return;
        removeEventListener("beforeunload", this._beforeUnloadListener);
        this._beforeUnloadListener = null;
    }

    send(payload = {}, url = this.endpoint) {
        const body = this._normalizePayload(payload);
        if (navigator.sendBeacon) {
            try {
                const ok = navigator.sendBeacon(url, body);
                if (ok) return true;
            } catch (_) {
                /* fall through to fetch */
            }
        }
        // Fallback for older browsers
        return fetch(url, {
            method: "POST",
            body,
            headers: {
                "Content-Type": typeof body === "string" ? "text/plain;charset=UTF-8" : undefined,
                ...this.headers,
            },
            keepalive: true,
            credentials: this.withCredentials ? "include" : "same-origin",
        })
            .then(() => true)
            .catch(() => false);
    }

    // Convenience helpers
    event(name, data = {}) {
        return this.send({ type: "event", name, data });
    }

    error(errorLike, extra = {}) {
        const err = this._normalizeError(errorLike);
        return this.send({ type: "error", error: err, extra });
    }

    performance(markName, data = {}) {
        return this.send({ type: "perf", mark: markName, data });
    }

    // ------------------------
    // Internals
    // ------------------------

    _computeState() {
        if (document.visibilityState === "hidden") return "hidden";
        if (document.hasFocus && document.hasFocus()) return "active";
        return "passive";
    }

    _logState(next) {
        const prev = this._state;
        if (next === prev) return;
        this._state = next;
        this.send({ type: "state", from: prev, to: next });
    }

    _normalizePayload(payload) {
        const base = {
            ts: Date.now(),
            url: location.href,
            referrer: document.referrer || null,
            state: this._state,
            ctx: this.getContext ? this.getContext() : {},
        };

        let out = { ...base, ...payload };

        // if caller passes FormData / Blob / ArrayBuffer, just forward
        if (
            typeof out === "object" &&
            (out instanceof FormData || out instanceof Blob || out instanceof ArrayBuffer)
        ) {
            return out;
        }

        // stringify to a compact line for append-only logs
        return JSON.stringify(out);
    }

    _normalizeError(e) {
        if (!e) return { message: "Unknown error" };
        if (e instanceof Error) {
            return {
                name: e.name,
                message: e.message,
                stack: e.stack,
            };
        }
        if (typeof e === "string") return { message: e };
        try {
            return { ...e };
        } catch (_) {
            return { message: String(e) };
        }
    }
}

// Factory for quick usage
export function createBeacon(options) {
    return new BeaconClient(options);
}

// Minimal standalone helper equivalent to your original function
export function reportSomething(url, data = null) {
    const body = data && typeof data === "object" ? JSON.stringify(data) : data;
    if (navigator.sendBeacon) return navigator.sendBeacon(url, body ?? undefined);
    return fetch(url, {
        method: "POST",
        body: body ?? "",
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        keepalive: true,
    });
}