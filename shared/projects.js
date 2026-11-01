export async function initProjects(root, getPack, base) {
  const track = root.querySelector("#projects-track");
  const slider = root.querySelector("#projects-slider");
  const nextBtn = root.querySelector("#nextBtn");
  const prevBtn = root.querySelector("#prevBtn");

  if (track?.dataset.initialized) return;
  let projects = [];
  let currentIndex = 0;
  let startX = 0;
  let endX = 0;

  if (!track || !slider) {
    return;
  }

  async function loadProjects() {
    try {
      const response = await fetch(new URL("shared/projects.json", base));

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      projects = await response.json();

      renderProjects();
      updateSlider();
    } catch (error) {
      console.error("Failed to load projects:", error);
    }
  }

  function renderProjects() {
    track.innerHTML = "";

    projects.forEach((entry) => {
      const project = { ...entry, ...getPack().projects[entry.id] };
      const card = document.createElement("div");
      card.className = "w-full md:w-1/3 flex-shrink-0 p-4";

      const tagsHTML = (project.tags || [])
        .map(
          (tag) => `
            <span class="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs rounded-full">
              ${tag}
            </span>
          `
        )
        .join("");

      card.innerHTML = `
        <div class="rounded-xl overflow-hidden shadow-lg card-hover bg-gray-50 dark:bg-gray-700 h-full">
          <img src="${project.image}" alt="${project.title}" class="w-full h-40 object-cover">
          <div class="p-5">
            <h4 class="text-xl font-semibold mb-2">
              <a href="${new URL(project.link, base).href}">${project.title}</a>
            </h4>
            <p class="text-sm mb-3 text-gray-600 dark:text-gray-300">${project.description}</p>
            <div class="flex flex-wrap gap-2">
              ${tagsHTML}
            </div>
          </div>
        </div>
      `;

      track.appendChild(card);
    });
  }

  function getCardsPerView() {
    return window.innerWidth >= 768 ? 3 : 1;
  }

  function updateSlider() {
    const cardsPerView = getCardsPerView();
    currentIndex = Math.min(currentIndex, Math.max(projects.length - cardsPerView, 0));
    const movePercent = 100 / cardsPerView;
    track.style.transform = `translateX(-${currentIndex * movePercent}%)`;
  }

  function nextSlide() {
    const cardsPerView = getCardsPerView();
    const maxIndex = Math.max(projects.length - cardsPerView, 0);

    currentIndex += cardsPerView;
    if (currentIndex > maxIndex) currentIndex = maxIndex;

    updateSlider();
  }

  function prevSlide() {
    const cardsPerView = getCardsPerView();

    currentIndex -= cardsPerView;
    if (currentIndex < 0) currentIndex = 0;

    updateSlider();
  }

  function handleSwipe() {
    const diff = startX - endX;

    if (diff > 50) {
      nextSlide();
    } else if (diff < -50) {
      prevSlide();
    }
  }

  slider.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });

  slider.addEventListener("touchend", (e) => {
    endX = e.changedTouches[0].clientX;
    handleSwipe();
  });

  slider.addEventListener("mousedown", (e) => {
    startX = e.clientX;
  });

  slider.addEventListener("mouseup", (e) => {
    endX = e.clientX;
    handleSwipe();
  });

  if (nextBtn) {
    nextBtn.addEventListener("click", nextSlide);
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", prevSlide);
  }

  window.addEventListener("resize", updateSlider);

  await loadProjects();
  track.dataset.initialized = "true";
  document.addEventListener("portfolio:language", () => { renderProjects(); updateSlider(); });
}
