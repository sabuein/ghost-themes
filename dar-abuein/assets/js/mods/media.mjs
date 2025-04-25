"use strict";

import apiCall from "service";
import { createElement } from "interface";

const YOUTUBE_PLAYLIST_ITEMS_API = 'https://www.googleapis.com/youtube/v3/playlistItems';

/** Load Stripe's publishable key from the server. */
const loadYouTubeKey = async () => await apiCall({
  endpoint: "config/youtube",
  method: "POST"
});

const getYouTubePlaylists = async (playlistId, apiKey) => await apiCall({
  endpoint: `${YOUTUBE_PLAYLIST_ITEMS_API}?part=snippet&maxResults=50&playlistId=${playlistId}&key=${apiKey}`,
  external: true
});

// YouTube Player API Reference for iframe Embeds https://developers.google.com/youtube/iframe_api_reference
let player = null;

/** Create an embedded player that will load a video, play it for six seconds, and then stop the playback. */
const initializeYouTubeEmbeddedPlayer = () => {
  if (typeof(YT) == 'undefined' || typeof(YT.Player) == 'undefined') {
  // This code loads the IFrame Player API code asynchronously.
  const tag = createElement("script", {
    src: "https://www.youtube.com/iframe_api",
  });

  const firstScriptTag = document.getElementsByTagName("script")[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  
}

onYouTubeIframeAPIReady();

};

/** This function creates an <iframe> (and YouTube player) after the API code downloads. */
const onYouTubeIframeAPIReady = () => {
  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: 'c5dC-iOPYMY',
    playerVars: {
      'playsinline': 1
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });


/** The API will call this function when the video player is ready. */
function onPlayerReady(event) {
  event.target.playVideo();
}

function stopVideo() {
  player.stopVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
let done = false;
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    setTimeout(stopVideo, 6000);
    done = true;
  }
}
};


const initializeYouTubePlaylists = async () => {
  const playlistId = "PL8Aag4kgjMA__RlXZT-RP_DnBKgdGUN8N";
  const { apiKey } = await loadYouTubeKey();
  if (!apiKey) {
      addMessage("No YouTube API key returned from the server. Please check and try again.");
      alert("Please set your YouTube API key on the server.");
  }

  const response = await getYouTubePlaylists(playlistId, atob(apiKey));

  console.log(response);

  return response;
};

export { initializeYouTubeEmbeddedPlayer, initializeYouTubePlaylists };