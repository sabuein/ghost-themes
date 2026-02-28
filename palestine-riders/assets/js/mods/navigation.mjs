"use strict";

function scrollTop() {
  const contentBody  = document.getElementById('content-body');
  contentBody.scrollTop = 0;   // always start at top
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Sample content cards — each represents a post / page / media item
const CONTENT = [
  {
    id: 6,
    type: 'video',
    category: 'Trails',
    section: 'local-trails',
    title: 'Cannock Chase — Full Loop Ride',
    date: 'Dec 2024',
    emoji: '🌲',
    body: `
      <h2>Cannock Chase — Full Loop Ride</h2>
      <p class="post-meta">📅 December 2024 &nbsp;|&nbsp; ⏱ 18 min</p>
      <div class="video-wrap">
        <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" allowfullscreen></iframe>
      </div>
      <p>A raw, uncut lap of the Chase in full winter conditions. Muddy, cold, absolutely worth it. This is our spiritual home trail.</p>
    `,
  },
];

// ─── Build Navigation ────────────────────────────────────────────────────────
function buildNav(navigation) {
  Array.from(navigation.children).forEach(item => {
    if (item.childElementCount > 1) {
      // Parent with sub-menu
      const parent = item.querySelector('.nav-parent');
      parent.addEventListener('click', () => {
        item.classList.toggle('open');
      });

    }
  });
}

export {
  buildNav,
  scrollTop
};