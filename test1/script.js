// 取得 DOM
const items = Array.from(document.querySelectorAll(".item"));
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const counter = document.querySelector(".counter");

let pageSize = 10; // 預設 = 桌機一頁 10 張
let pageIndex = 0;

// grid 計算設定（自適應用）
const MIN_COL_WIDTH = 180; // px
const GAP = 12; // grid gap

/* 計算每頁顯示數量 */
function updatePageSize() {
  const grid = document.querySelector(".grid-wrapper");
  if (!grid) return;

  const screenWidth = window.innerWidth;

  // ========== 桌機：固定 10 張 ==========
  if (screenWidth >= 1024) {
    pageSize = 10;
    return;
  }

  // ========== 手機 / 平板：自動欄數 ==========
  const gridWidth = grid.getBoundingClientRect().width;
  const possibleColumns = Math.floor((gridWidth + GAP) / (MIN_COL_WIDTH + GAP));
  const columns = Math.max(1, possibleColumns);

  const rows = 2; // 固定 2 行
  pageSize = columns * rows;
}



/* 渲染頁面（真正平移滑動效果） */
function renderCarousel(isSlide = false, direction = 1) {
  updatePageSize();

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  pageIndex = Math.max(0, Math.min(pageIndex, totalPages - 1));

  const slider = document.querySelector(".grid-wrapper");

  // ----------- 左右滑動動畫 -----------
  if (isSlide) {
    slider.style.transition = "transform 0.3s ease-out";
    slider.style.transform = `translateX(${direction * -500}px)`; 
  }

  // 讓滑動有停頓感才有翻頁效果
  setTimeout(() => {
    // 隱藏全部
    items.forEach(item => (item.style.display = "none"));

    // 顯示本頁
    const start = pageIndex * pageSize;
    const end = Math.min(start + pageSize, items.length);
    items.slice(start, end).forEach(item => (item.style.display = "flex"));

    updateCounter();
    updateButtons();

    // 復位
    slider.style.transform = "translateX(0)";
    slider.style.transition = "transform 0.30s ease-out";

  }, isSlide ? 180 : 0);
}


/* 更新 Counter */
function updateCounter() {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  counter.textContent = `${pageIndex + 1} / ${totalPages}`;
}

/* 更新按鈕 */
function updateButtons() {
  prevBtn.disabled = pageIndex === 0;
  nextBtn.disabled = pageIndex >= Math.ceil(items.length / pageSize) - 1;
}

/* 上一頁 */
prevBtn.addEventListener("click", () => {
  if (pageIndex > 0) {
    pageIndex--;
    renderCarousel(true, -1);
  }
});

/* 下一頁 */
nextBtn.addEventListener("click", () => {
  if (pageIndex < Math.ceil(items.length / pageSize) - 1) {
    pageIndex++;
    renderCarousel(true, 1);
  }
});

/* Lightbox */
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
items.forEach(item => {
  item.addEventListener("click", () => {
    const img = item.querySelector("img");
    const imgURL = img.dataset.full || img.src;
    lightboxImg.src = imgURL;
    lightbox.style.display = "flex";
  });
});
lightbox.addEventListener("click", () => lightbox.style.display = "none");

/* resize 時重新渲染 */
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => renderCarousel(), 150);
});

/* 初始化 */
document.addEventListener("DOMContentLoaded", () => renderCarousel());
