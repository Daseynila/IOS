/* ========================================================
   iOS 18 SANDBOX FOR ANDROID — MASTER JAVASCRIPT ENGINE
   Author: Yusupov Oyattuloh (Novosibirsk College NPPC)
   ======================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // --- DOM Elements ---
  const statusTime = document.getElementById("status-time");
  const lockTime = document.getElementById("lock-time");
  const lockDate = document.getElementById("lock-date");
  const lockScreen = document.getElementById("lock-screen");
  const homeScreen = document.getElementById("home-screen");
  const homeIndicatorBar = document.getElementById("home-indicator-bar");
  const dynamicIsland = document.getElementById("dynamic-island");
  const controlCenter = document.getElementById("control-center");
  const statusRightTrigger = document.getElementById("status-right-trigger");
  const closeCcBtn = document.getElementById("close-cc-btn");
  
  // Modals
  const iosModal = document.getElementById("ios-modal-overlay");
  const androidModal = document.getElementById("android-modal-overlay");
  const showIosDialogBtn = document.getElementById("show-ios-dialog-btn");
  const showAndroidDialogBtn = document.getElementById("show-android-dialog-btn");

  // Haptic Feedback Helper
  function haptic(ms = 15) {
    if (navigator.vibrate) {
      navigator.vibrate(ms);
    }
  }

  // ========================================================
  // 1. CLOCK & CALENDAR ENGINE
  // ========================================================
  function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const timeStr = `${hours}:${minutes}`;

    if (statusTime) statusTime.textContent = timeStr;
    if (lockTime) lockTime.textContent = timeStr;

    // Russian Date Formatting
    const days = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
    const months = [
      "января", "февраля", "марта", "апреля", "мая", "июня",
      "июля", "августа", "сентября", "октября", "ноября", "декабря"
    ];
    const dayName = days[now.getDay()];
    const dateNum = now.getDate();
    const monthName = months[now.getMonth()];
    
    if (lockDate) {
      lockDate.textContent = `${dayName}, ${dateNum} ${monthName}`;
    }
  }
  updateTime();
  setInterval(updateTime, 1000);

  // ========================================================
  // 2. LOCK SCREEN & UNLOCK TRANSITIONS
  // ========================================================
  function unlockDevice() {
    haptic(25);
    lockScreen.classList.add("unlocked");
    setTimeout(() => {
      lockScreen.classList.remove("active");
      homeScreen.classList.add("active");
    }, 350);
  }

  // Swipe or click unlock
  lockScreen.addEventListener("click", (e) => {
    // Prevent triggering if clicked on flashlight/camera
    if (e.target.closest(".circle-tool-btn")) return;
    unlockDevice();
  });

  // Flashlight toggle on lockscreen
  const torchBtn = document.getElementById("lock-flashlight-btn");
  if (torchBtn) {
    torchBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      haptic(20);
      torchBtn.classList.toggle("active");
    });
  }

  // Camera button on lockscreen
  const lockCameraBtn = document.getElementById("lock-camera-btn");
  if (lockCameraBtn) {
    lockCameraBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      unlockDevice();
      setTimeout(() => openApp("camera"), 300);
    });
  }

  // ========================================================
  // 3. DYNAMIC ISLAND (INTERACTIVE PILL)
  // ========================================================
  let isIslandExpanded = false;
  dynamicIsland.addEventListener("click", (e) => {
    e.stopPropagation();
    haptic(15);
    isIslandExpanded = !isIslandExpanded;
    if (isIslandExpanded) {
      dynamicIsland.classList.remove("island-compact");
      dynamicIsland.classList.add("island-expanded");
    } else {
      dynamicIsland.classList.remove("island-expanded");
      dynamicIsland.classList.add("island-compact");
    }
  });

  // Close island on click outside
  document.addEventListener("click", (e) => {
    if (isIslandExpanded && !dynamicIsland.contains(e.target)) {
      isIslandExpanded = false;
      dynamicIsland.classList.remove("island-expanded");
      dynamicIsland.classList.add("island-compact");
    }
  });

  const islandPlayToggle = document.getElementById("island-play-toggle");
  if (islandPlayToggle) {
    islandPlayToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      haptic(15);
      const icon = islandPlayToggle.querySelector("i");
      if (icon.classList.contains("fa-pause")) {
        icon.classList.remove("fa-pause");
        icon.classList.add("fa-play");
      } else {
        icon.classList.remove("fa-play");
        icon.classList.add("fa-pause");
      }
    });
  }

  // ========================================================
  // 4. CONTROL CENTER (ШТОРКА)
  // ========================================================
  function toggleControlCenter(show) {
    haptic(20);
    if (show) {
      controlCenter.classList.add("open");
    } else {
      controlCenter.classList.remove("open");
    }
  }

  statusRightTrigger.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleControlCenter(true);
  });

  closeCcBtn.addEventListener("click", () => {
    toggleControlCenter(false);
  });

  // Connectivity tiles toggle
  document.querySelectorAll(".cc-conn-box .cc-tile").forEach((tile) => {
    tile.addEventListener("click", () => {
      haptic(12);
      tile.classList.toggle("active");
    });
  });

  // Vertical Slider: Brightness
  const sliderBrightness = document.getElementById("slider-brightness");
  if (sliderBrightness) {
    let isDragging = false;
    const updateSlider = (clientY) => {
      const rect = sliderBrightness.getBoundingClientRect();
      let percent = ((rect.bottom - clientY) / rect.height) * 100;
      percent = Math.max(10, Math.min(100, percent));
      const fill = sliderBrightness.querySelector(".slider-fill");
      if (fill) fill.style.height = `${percent}%`;
      // Adjust phone screen brightness
      const screen = document.getElementById("iphone-screen");
      screen.style.filter = `brightness(${0.4 + (percent / 100) * 0.6})`;
    };

    sliderBrightness.addEventListener("mousedown", (e) => {
      isDragging = true;
      updateSlider(e.clientY);
    });
    sliderBrightness.addEventListener("touchstart", (e) => {
      isDragging = true;
      updateSlider(e.touches[0].clientY);
    });
    window.addEventListener("mousemove", (e) => {
      if (isDragging) updateSlider(e.clientY);
    });
    window.addEventListener("touchmove", (e) => {
      if (isDragging) updateSlider(e.touches[0].clientY);
    });
    window.addEventListener("mouseup", () => (isDragging = false));
    window.addEventListener("touchend", () => (isDragging = false));
  }

  // Vertical Slider: Volume
  const sliderVolume = document.getElementById("slider-volume");
  if (sliderVolume) {
    let isDraggingVol = false;
    const updateVol = (clientY) => {
      const rect = sliderVolume.getBoundingClientRect();
      let percent = ((rect.bottom - clientY) / rect.height) * 100;
      percent = Math.max(0, Math.min(100, percent));
      const fill = sliderVolume.querySelector(".slider-fill");
      if (fill) fill.style.height = `${percent}%`;
    };
    sliderVolume.addEventListener("mousedown", (e) => {
      isDraggingVol = true;
      updateVol(e.clientY);
    });
    sliderVolume.addEventListener("touchstart", (e) => {
      isDraggingVol = true;
      updateVol(e.touches[0].clientY);
    });
    window.addEventListener("mousemove", (e) => {
      if (isDraggingVol) updateVol(e.clientY);
    });
    window.addEventListener("touchmove", (e) => {
      if (isDraggingVol) updateVol(e.touches[0].clientY);
    });
    window.addEventListener("mouseup", () => (isDraggingVol = false));
    window.addEventListener("touchend", () => (isDraggingVol = false));
  }

  // Quick Action in CC: Calculator
  document.getElementById("cc-calc")?.addEventListener("click", () => {
    toggleControlCenter(false);
    openApp("calculator");
  });

  // Quick Action in CC: Open Compare
  document.getElementById("cc-open-compare")?.addEventListener("click", () => {
    toggleControlCenter(false);
    openApp("compare");
  });

  // ========================================================
  // 5. APP WINDOW ROUTER & HOME BAR
  // ========================================================
  const appWindows = {
    calculator: document.getElementById("app-calculator"),
    settings: document.getElementById("app-settings"),
    compare: document.getElementById("app-compare"),
    notes: document.getElementById("app-notes"),
    quiz: document.getElementById("app-quiz"),
  };

  let currentOpenApp = null;

  function openApp(appName) {
    haptic(15);
    const win = appWindows[appName];
    if (win) {
      win.classList.add("open");
      currentOpenApp = win;
    } else {
      // Alert simulation for apps without full view
      alert(`Запуск системного модуля ${appName.toUpperCase()} в песочнице iOS.`);
    }
  }

  function closeCurrentApp() {
    haptic(20);
    if (currentOpenApp) {
      currentOpenApp.classList.remove("open");
      currentOpenApp = null;
    }
  }

  // Bind app icons
  document.querySelectorAll(".app-item").forEach((item) => {
    item.addEventListener("click", () => {
      const app = item.dataset.app;
      if (app) openApp(app);
    });
  });

  // Bind Compare Widget click
  document.getElementById("open-compare-widget")?.addEventListener("click", () => {
    openApp("compare");
  });

  // Back button inside apps
  document.querySelectorAll(".app-back-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      closeCurrentApp();
    });
  });

  // Bottom Home Indicator Bar (Swipe up / click returns to Home)
  homeIndicatorBar.addEventListener("click", () => {
    if (controlCenter.classList.contains("open")) {
      toggleControlCenter(false);
    } else if (currentOpenApp) {
      closeCurrentApp();
    } else if (!homeScreen.classList.contains("active")) {
      unlockDevice();
    }
  });

  // ========================================================
  // 6. APP 1: CALCULATOR ENGINE
  // ========================================================
  const calcDisplay = document.getElementById("calc-display");
  let calcCurrentVal = "0";
  let calcPrevVal = null;
  let calcOperator = null;
  let calcResetNext = false;

  function updateCalcDisplay() {
    if (!calcDisplay) return;
    calcDisplay.textContent = calcCurrentVal.replace(".", ",");
    // Scale font size if too many digits
    if (calcCurrentVal.length > 7) {
      calcDisplay.style.fontSize = "46px";
    } else if (calcCurrentVal.length > 5) {
      calcDisplay.style.fontSize = "58px";
    } else {
      calcDisplay.style.fontSize = "72px";
    }
  }

  document.querySelectorAll(".calc-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      haptic(10);
      const num = btn.dataset.num;
      const op = btn.dataset.op;

      if (num !== undefined) {
        if (calcResetNext) {
          calcCurrentVal = num === "." ? "0." : num;
          calcResetNext = false;
        } else {
          if (num === "." && calcCurrentVal.includes(".")) return;
          if (calcCurrentVal === "0" && num !== ".") {
            calcCurrentVal = num;
          } else {
            calcCurrentVal += num;
          }
        }
        updateCalcDisplay();
      } else if (op !== undefined) {
        if (op === "clear") {
          calcCurrentVal = "0";
          calcPrevVal = null;
          calcOperator = null;
          calcResetNext = false;
        } else if (op === "plusminus") {
          calcCurrentVal = String(parseFloat(calcCurrentVal) * -1);
        } else if (op === "percent") {
          calcCurrentVal = String(parseFloat(calcCurrentVal) / 100);
        } else if (op === "=") {
          if (calcOperator && calcPrevVal !== null) {
            const a = parseFloat(calcPrevVal);
            const b = parseFloat(calcCurrentVal);
            let res = 0;
            switch (calcOperator) {
              case "+": res = a + b; break;
              case "-": res = a - b; break;
              case "*": res = a * b; break;
              case "/": res = b !== 0 ? a / b : "Ошибка"; break;
            }
            calcCurrentVal = String(res);
            calcOperator = null;
            calcPrevVal = null;
            calcResetNext = true;
          }
        } else {
          // Math Operators +, -, *, /
          calcOperator = op;
          calcPrevVal = calcCurrentVal;
          calcResetNext = true;
        }
        updateCalcDisplay();
      }
    });
  });

  // ========================================================
  // 7. APP 2: SETTINGS (SPECS TOGGLE)
  // ========================================================
  const openAboutRow = document.getElementById("open-about-row");
  const specsBox = document.getElementById("specs-box");
  if (openAboutRow && specsBox) {
    openAboutRow.addEventListener("click", () => {
      haptic(12);
      specsBox.scrollIntoView({ behavior: "smooth" });
      specsBox.style.outline = "2px solid var(--ios-blue)";
      setTimeout(() => (specsBox.style.outline = "none"), 1200);
    });
  }

  // ========================================================
  // 8. APP 3: OS COMPARE ENGINE & MODAL SIMULATIONS
  // ========================================================
  // Segment Switcher
  const segButtons = document.querySelectorAll(".seg-btn");
  const segContents = document.querySelectorAll(".seg-content");

  segButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      haptic(15);
      segButtons.forEach((b) => b.classList.remove("active"));
      segContents.forEach((c) => c.classList.remove("active"));
      btn.classList.add("active");
      const targetSeg = btn.dataset.seg;
      document.getElementById(`seg-${targetSeg}`)?.classList.add("active");
    });
  });

  // iOS Dialog Simulation
  showIosDialogBtn?.addEventListener("click", () => {
    haptic(15);
    iosModal.classList.add("open");
  });
  document.getElementById("close-ios-modal")?.addEventListener("click", () => {
    iosModal.classList.remove("open");
  });
  document.getElementById("confirm-ios-modal")?.addEventListener("click", () => {
    iosModal.classList.remove("open");
  });

  // Android Dialog Simulation
  showAndroidDialogBtn?.addEventListener("click", () => {
    haptic(15);
    androidModal.classList.add("open");
  });
  document.getElementById("close-android-modal")?.addEventListener("click", () => {
    androidModal.classList.remove("open");
  });
  document.getElementById("confirm-android-modal")?.addEventListener("click", () => {
    androidModal.classList.remove("open");
  });

  // ========================================================
  // 9. APP 4: NOTES ENGINE
  // ========================================================
  const newNoteBtn = document.getElementById("new-note-btn");
  const notesList = document.getElementById("notes-list");
  if (newNoteBtn && notesList) {
    newNoteBtn.addEventListener("click", () => {
      haptic(15);
      const title = prompt("Введите заголовок заметки:", "Новая заметка");
      if (title) {
        const noteCard = document.createElement("div");
        noteCard.className = "note-card";
        noteCard.innerHTML = `
          <div class="note-title">${escapeHTML(title)}</div>
          <div class="note-preview">Создано в песочнице iOS для сравнения с Android Keep.</div>
          <div class="note-date">Только что</div>
        `;
        notesList.prepend(noteCard);
      }
    });
  }

  function escapeHTML(str) {
    return str.replace(/[&<>"']/g, (m) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[m]);
  }

  // ========================================================
  // 10. APP 5: INTERACTIVE QUIZ ENGINE
  // ========================================================
  const quizData = [
    {
      q: "1. Каков ваш приоритет по бюджету и выбору моделей?",
      options: [
        { text: "Нужен огромный выбор: от бюджетника до складного флагмана (Android)", score: "android" },
        { text: "Готов заплатить за премиум-сегмент с единым стандартом (iOS)", score: "ios" }
      ]
    },
    {
      q: "2. Насколько для вас важна свобода установки приложений?",
      options: [
        { text: "Критично: качаю APK из интернета, RuStore и ставлю моды (Android)", score: "android" },
        { text: "Достаточно официального App Store, ценю проверку безопасности (iOS)", score: "ios" }
      ]
    },
    {
      q: "3. Насколько важна кастомизация внешнего вида?",
      options: [
        { text: "Люблю менять лаунчеры, темы, наборы иконок и виджеты (Android)", score: "android" },
        { text: "Предпочитаю единый строгий дизайн 'из коробки' (iOS)", score: "ios" }
      ]
    },
    {
      q: "4. Есть ли у вас другие устройства экосистемы?",
      options: [
        { text: "ПК на Windows, смарт-часы разных брендов, сервисы Google (Android)", score: "android" },
        { text: "Использую Mac, iPad, Apple Watch или AirPods (iOS)", score: "ios" }
      ]
    },
    {
      q: "5. Что важнее в поддержке смартфона?",
      options: [
        { text: "Быстрый доступ к новинкам «железа» и гибкость (Android)", score: "android" },
        { text: "Гарантированные обновления 5–6 лет в день релиза (iOS)", score: "ios" }
      ]
    }
  ];

  let currentQIdx = 0;
  let androidScore = 0;
  let iosScore = 0;

  function renderQuiz() {
    const container = document.getElementById("quiz-container");
    if (!container) return;

    if (currentQIdx < quizData.length) {
      const q = quizData[currentQIdx];
      container.innerHTML = `
        <div class="quiz-card">
          <div class="quiz-q-num">Вопрос ${currentQIdx + 1} из ${quizData.length}</div>
          <div class="quiz-q-text">${q.q}</div>
          <div class="quiz-options">
            ${q.options
              .map(
                (opt, idx) => `
              <button class="quiz-opt-btn" data-score="${opt.score}">${opt.text}</button>
            `
              )
              .join("")}
          </div>
        </div>
      `;

      container.querySelectorAll(".quiz-opt-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          haptic(15);
          const score = btn.dataset.score;
          if (score === "android") androidScore++;
          if (score === "ios") iosScore++;
          currentQIdx++;
          renderQuiz();
        });
      });
    } else {
      // Results
      const total = androidScore + iosScore;
      const aPct = Math.round((androidScore / total) * 100);
      const iPct = 100 - aPct;
      const winner = aPct > iPct ? "Android" : (iPct > aPct ? "iOS" : "Ничья (Обе системы)");
      const winnerColor = aPct > iPct ? "var(--ios-green)" : "var(--ios-blue)";

      container.innerHTML = `
        <div class="quiz-card quiz-result-box">
          <h3>РЕЗУЛЬТАТ ТЕСТИРОВАНИЯ</h3>
          <div class="quiz-score-badge" style="color: ${winnerColor}">${winner}</div>
          <p style="font-size: 15px; margin-bottom: 12px;">Соответствие вашим привычкам:</p>
          <div style="font-size: 18px; font-weight: 700; margin-bottom: 20px;">
            <span style="color: var(--ios-green);">Android: ${aPct}%</span> &nbsp;|&nbsp; 
            <span style="color: var(--ios-blue);">iOS: ${iPct}%</span>
          </div>
          <p style="font-size: 13px; color: var(--ios-gray); line-height: 1.4; margin-bottom: 20px;">
            ${
              winner === "Android"
                ? "Вам важнее свобода настройки, гибкость ценовых категорий и разнообразие форматов."
                : "Вам идеально подходят предсказуемость, длительная поддержка и строгие стандарты Apple."
            }
          </p>
          <button class="test-dialog-btn ios" id="restart-quiz-btn" style="width: 100%;">Пройти заново</button>
        </div>
      `;

      document.getElementById("restart-quiz-btn")?.addEventListener("click", () => {
        currentQIdx = 0;
        androidScore = 0;
        iosScore = 0;
        renderQuiz();
      });
    }
  }

  renderQuiz();
});
