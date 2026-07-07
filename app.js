document.addEventListener("DOMContentLoaded", () => {
  const movieGrid = document.getElementById("movieGrid");
  const searchStatus = document.getElementById("searchStatus");
  const videoModal = document.getElementById("videoModal");
  const videoIframe = document.getElementById("videoIframe");
  const closePlayer = document.getElementById("closePlayer");
  
  const adsModal = document.getElementById("adsModal");
  const adsIframe = document.getElementById("adsIframe");
  const adsCloseBtn = document.getElementById("adsCloseBtn");

  const prevPageBtn = document.getElementById("prevPage");
  const nextPageBtn = document.getElementById("nextPage");
  const pageNumberSpan = document.getElementById("pageNumber");

  let currentPage = 1;
  const perPage = 30; 
  let pendingVideoUrl = ""; 
  let countdownTimer;

  const ADS_LINK = "https://missiondifferentyawn.com/ysnnykz0?key=767a1fcc31c26b4d569736848298428e";

  function loadPremiumVideos(page) {
    if (searchStatus) searchStatus.style.display = "block";
    if (movieGrid) movieGrid.innerHTML = "";

    const API_URL = `https://www.eporner.com/api/v2/video/search/?query=asian&per_page=${perPage}&page=${page}&thumbsize=big`;

    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        if (searchStatus) searchStatus.style.display = "none";

        if (data && data.videos && data.videos.length > 0) {
          const fragment = document.createDocumentFragment();

          data.videos.forEach(video => {
            const movieCard = document.createElement("div");
            movieCard.className = "movie-card";
            
            const realEmbedUrl = `https://www.eporner.com/embed/${video.id}/`;

            movieCard.innerHTML = `
              <div class="card-img-box">
                <img src="${video.default_thumb.src}" alt="${video.title}" loading="lazy" style="width:100%; height:100%; object-fit:cover;">
                <span class="badge-rate">HD 1080p</span>
              </div>
              <div style="padding: 12px; display: flex; flex-direction: column; justify-content: space-between; flex-grow: 1;">
                <div>
                  <h3 class="movie-title">${video.title}</h3>
                  <p class="movie-desc"><i class="fa-regular fa-clock"></i> ${video.length_min} Mins</p>
                </div>
                <button class="custom-play-btn" data-embed="${realEmbedUrl}">
                  <i class="fa-solid fa-circle-play"></i> Watch Now
                </button>
              </div>
            `;
            fragment.appendChild(movieCard);
          });

          if (movieGrid) movieGrid.appendChild(fragment);
        }
      })
      .catch(() => {
        if (searchStatus) searchStatus.style.display = "none";
      });
  }

  if (movieGrid) {
    movieGrid.addEventListener("click", (e) => {
      const button = e.target.closest('.custom-play-btn');
      if (button) {
        pendingVideoUrl = button.getAttribute("data-embed");
        
        if (adsModal && adsIframe && adsCloseBtn) {
          adsIframe.src = ADS_LINK;
          adsModal.style.display = "flex";
          document.body.style.overflow = "hidden";
          
          let timeLeft = 20;
          adsCloseBtn.disabled = true;
          adsCloseBtn.classList.remove("active");
          adsCloseBtn.innerText = `Close (${timeLeft}s)`;

          clearInterval(countdownTimer);
          countdownTimer = setInterval(() => {
            timeLeft--;
            if (timeLeft > 0) {
              adsCloseBtn.innerText = `Close (${timeLeft}s)`;
            } else {
              clearInterval(countdownTimer);
              adsCloseBtn.disabled = false;
              adsCloseBtn.classList.add("active");
              adsCloseBtn.innerText = "Close ✕";
            }
          }, 1000);
        }
      }
    });
  }

  if (adsCloseBtn) {
    adsCloseBtn.addEventListener("click", () => {
      if (!adsCloseBtn.disabled) {
        if (adsModal && adsIframe) {
          adsModal.style.display = "none";
          adsIframe.src = "";
        }
        
        if (videoIframe && videoModal && pendingVideoUrl) {
          videoIframe.src = pendingVideoUrl;
          videoModal.style.display = "flex";
        }
      }
    });
  }

  if (nextPageBtn) {
    nextPageBtn.addEventListener("click", () => {
      currentPage++;
      pageNumberSpan.innerText = `Page ${currentPage}`;
      if (prevPageBtn) prevPageBtn.disabled = false;
      loadPremiumVideos(currentPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (prevPageBtn) {
    prevPageBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        pageNumberSpan.innerText = `Page ${currentPage}`;
        if (currentPage === 1) prevPageBtn.disabled = true;
        loadPremiumVideos(currentPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  if (closePlayer) {
    closePlayer.addEventListener("click", () => {
      if (videoModal && videoIframe) {
        videoModal.style.display = "none";
        videoIframe.src = ""; 
        document.body.style.overflow = "auto"; 
      }
    });
  }

  loadPremiumVideos(currentPage);
});
