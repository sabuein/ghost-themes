"use strict";

// =============================================
// file: server/index.js (Node.js server to collect Beacon logs)
// Run with: node server/index.js
// =============================================

import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import http from "http";
import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3001;

// Create logs directory if missing
const LOG_DIR = path.resolve(process.env.BEACON_LOG_DIR || "./logs");
if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });

// Because sendBeacon often sends with text/plain, we need raw text parsing first
app.use(express.text({ type: ["text/*", "application/octet-stream", "*/*"], limit: "1mb" }));
app.use(express.json({ limit: "1mb" })); // fallback when clients post JSON
app.use(cors());

function todayFile() {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return path.join(LOG_DIR, `beacons-${yyyy}-${mm}-${dd}.log`);
}

function toLine(req, bodyString) {
    // Ensure one JSON object per line for easy ingestion later
    let parsed;
    try {
        parsed = bodyString && bodyString.trim() ? JSON.parse(bodyString) : {};
    } catch (e) {
        parsed = { _raw: bodyString };
    }
    const line = {
        ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
        ua: req.headers["user-agent"],
        receivedAt: Date.now(),
        ...parsed,
    };
    return JSON.stringify(line) + "\n";
}

async function appendLine(line) {
    await fsp.appendFile(todayFile(), line, { encoding: "utf8" });
}

// Primary endpoint for Beacon posts
app.post(["/log", "/beacon"], async (req, res) => {
    try {
        const raw = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
        const line = toLine(req, raw || "{}");
        await appendLine(line);
        res.status(204).end();
    } catch (e) {
        res.status(500).json({ error: "failed_to_write", details: String(e) });
    }
});

// Optional: an endpoint to quickly verify server is alive
app.get("/health", (req, res) => {
    res.json({ ok: true, time: Date.now() });
});

http.createServer(app).listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Beacon server listening on http://localhost:${PORT}`);
});