"use strict";

import { formatTime } from "utils";

export async function importFromURL(
    url,
    title = "Unknown",
    artist = "Unknown artist",
    album = "Unknown album"
) {
    const alreadyExists = await hasRemoteURLSong(url);
    if (alreadyExists) {
        return { error: true, message: "Song already exists" };
    }

    if (!url.startsWith("http")) {
        url = "https://" + url;
    }

    const duration = await getSongDuration(url);
    if (duration === -1) {
        return { error: true, message: "URL is not a valid audio file" };
    }

    await addRemoteURLSong(url, title, artist, album, formatTime(duration));

    return { error: false };
}
/**
 * Import multiple songs from files at once into the store.
 * @param {Array} files
 */
export async function importFromFiles(files) {
    if (!Array.isArray(files)) {
        files = [...files];
    }

    const songs = [];

    // We can do this part in parallel.
    await Promise.all(
        files.map(async (file) => {
            const { title, artist, album } = await guessSongInfo(file);

            const url = await turnFileIntoURL(file);
            const duration = await getSongDuration(url);

            songs.push({
                title,
                artist,
                album,
                duration: formatTime(duration),
                file,
            });
        })
    );

    // And then add all songs in one go in the storage.
    await addMultipleLocalFileSongs(songs);
}

/**
 * DO NOT LOOP OVER THIS FUNCTION TO IMPORT SEVERAL SONGS, THIS WILL LEAD TO
 * AN INCONSISTENT STORE STATE. USE importSongsFromFiles() INSTEAD.
 * Attempt to import a new song into the store from a File object.
 * If the file could not be read as an audio file an error message is returned.
 */
export async function importFromFile(file) {
    const { title, artist, album } = await guessSongInfo(file);
    const url = await turnFileIntoURL(file);
    const duration = await getSongDuration(url);

    await addLocalFileSong(file, title, artist, album, formatTime(duration));

    return { error: false };
}

function turnFileIntoURL(file) {
    return new Promise((resolve) => {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            resolve(e.target.result);
        };
        fileReader.readAsDataURL(file);
    });
}