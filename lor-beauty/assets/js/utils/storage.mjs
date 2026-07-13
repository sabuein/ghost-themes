// assets/js/utils/storage.mjs
// Minimal promise-based wrapper around IndexedDB. Used for anything that
// needs to persist across page loads / offline sessions — right now, that's
// the background-sync queue in pwa/sync.mjs. Deliberately not localStorage:
// IndexedDB is asynchronous and won't block the main thread.

const DB_NAME = "lor-beauty";
const DB_VERSION = 1;

let dbPromise = null;

function openDatabase() {
    if (dbPromise) return dbPromise;

    dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.addEventListener("upgradeneeded", () => {
            const db = request.result;
            if (!db.objectStoreNames.contains("keyval")) {
                db.createObjectStore("keyval");
            }
            if (!db.objectStoreNames.contains("sync-queue")) {
                db.createObjectStore("sync-queue", {
                    keyPath: "id",
                    autoIncrement: true,
                });
            }
        });

        request.addEventListener("success", () => resolve(request.result));
        request.addEventListener("error", () => reject(request.error));
    });

    return dbPromise;
}

function runRequest(storeName, mode, fn) {
    return openDatabase().then(
        (db) =>
            new Promise((resolve, reject) => {
                const store = db
                    .transaction(storeName, mode)
                    .objectStore(storeName);
                const request = fn(store);
                request.addEventListener("success", () =>
                    resolve(request.result),
                );
                request.addEventListener("error", () => reject(request.error));
            }),
    );
}

// Generic key/value store
export const get = (key) =>
    runRequest("keyval", "readonly", (store) => store.get(key));
export const set = (key, value) =>
    runRequest("keyval", "readwrite", (store) => store.put(value, key));
export const remove = (key) =>
    runRequest("keyval", "readwrite", (store) => store.delete(key));

// Offline action queue (consumed by pwa/sync.mjs)
export const enqueue = (item) =>
    runRequest("sync-queue", "readwrite", (store) => store.add(item));
export const peekQueue = () =>
    runRequest("sync-queue", "readonly", (store) => store.getAll());

export async function dequeueAll() {
    const items = await peekQueue();
    await runRequest("sync-queue", "readwrite", (store) => store.clear());
    return items;
}
