// ===== Асан Жасмин — сайттың JavaScript коды =====

document.addEventListener("DOMContentLoaded", () => {

  // 1. Ашық / қараңғы режим (таңдау браузерде сақталады)
  const themeBtn = document.getElementById("themeToggle");
  let saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) {}
  if (saved === "dark") document.body.classList.add("dark");
  const updateIcon = () => {
    if (themeBtn) themeBtn.textContent = document.body.classList.contains("dark") ? "☀" : "☾";
  };
  updateIcon();
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      try {
        localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
      } catch (e) {}
      updateIcon();
    });
  }

  // 2. Мобильді мәзір (бургер батырмасы)
  const burger = document.getElementById("burger");
  const navLinks = document.querySelector(".nav-links");
  if (burger && navLinks) {
    burger.addEventListener("click", () => {
      navLinks.classList.toggle("open");
      burger.textContent = navLinks.classList.contains("open") ? "✕" : "☰";
    });
    navLinks.querySelectorAll("a").forEach(link =>
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        burger.textContent = "☰";
      })
    );
  }

  // 3. Ағымдағы бетті мәзірде белгілеу
  const page = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(a => {
    if (a.getAttribute("href") === page) a.classList.add("active");
  });

  // 4. Scroll кезінде элементтердің біртіндеп пайда болуы
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

  // 5. Басты беттегі "жазылып жатқан" мәтін
  const typed = document.getElementById("typed");
  if (typed) {
    const words = ["Менеджмент студенті", "Шығармашыл тұлға", "Команда ойыншысы", "Визуалды дизайнды жақсы көремін"];
    let w = 0, c = 0, deleting = false;
    const tick = () => {
      const word = words[w];
      typed.textContent = deleting ? word.slice(0, c--) : word.slice(0, c++);
      if (!deleting && c > word.length) { deleting = true; setTimeout(tick, 1400); return; }
      if (deleting && c < 0) { deleting = false; w = (w + 1) % words.length; c = 0; }
      setTimeout(tick, deleting ? 45 : 90);
    };
    tick();
  }

  // 6. Аватарға арналған өз бейнеплеер
  const avatarBox = document.querySelector(".avatar-box");
  const player = document.getElementById("player");
  const video = document.getElementById("avatarVideo");
  if (avatarBox && player && video) {
    const playBtn = document.getElementById("playBtn");
    const bigPlay = document.getElementById("bigPlay");
    const muteBtn = document.getElementById("muteBtn");
    const volume = document.getElementById("volume");
    const progress = document.getElementById("progress");
    const timeLabel = document.getElementById("timeLabel");
    const replayBtn = document.getElementById("replayBtn");
    const fullBtn = document.getElementById("fullBtn");
    const playSound = document.getElementById("playSound");
    const playMuted = document.getElementById("playMuted");
    const picker = document.getElementById("videoPicker");

    // Бейне файлы жоқ болса — бос күйді көрсету
    const setEmpty = (empty) => {
      player.classList.toggle("empty", empty);
      avatarBox.classList.toggle("no-video", empty);
    };
    const source = video.querySelector("source");
    video.addEventListener("error", () => setEmpty(true));
    if (source) source.addEventListener("error", () => setEmpty(true));
    if (video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) setEmpty(true);
    video.addEventListener("loadedmetadata", () => {
      setEmpty(false);
      // Плеер бейненің пішініне бейімделеді (көлденең немесе тік)
      if (video.videoWidth && video.videoHeight) {
        player.style.aspectRatio = `${video.videoWidth} / ${video.videoHeight}`;
        const vertical = video.videoHeight > video.videoWidth;
        player.style.maxWidth = vertical ? "340px" : "";
        player.style.margin = vertical ? "0 auto" : "";
      }
      updateTime();
    });

    const fmt = (s) => {
      if (!isFinite(s)) return "0:00";
      const m = Math.floor(s / 60);
      const sec = Math.floor(s % 60).toString().padStart(2, "0");
      return `${m}:${sec}`;
    };
    const updateTime = () => {
      timeLabel.textContent = `${fmt(video.currentTime)} / ${fmt(video.duration)}`;
      if (video.duration) progress.value = (video.currentTime / video.duration) * 100;
    };
    const updateMute = () => {
      const silent = video.muted || video.volume === 0;
      muteBtn.textContent = silent ? "🔇" : "🔊";
      muteBtn.title = silent ? "Дыбысты қосу" : "Дыбысты өшіру";
      volume.value = video.muted ? 0 : video.volume;
    };
    const togglePlay = () => (video.paused ? video.play() : video.pause());

    video.addEventListener("play", () => { player.classList.add("playing"); playBtn.textContent = "❚❚"; });
    video.addEventListener("pause", () => { player.classList.remove("playing"); playBtn.textContent = "▶"; });
    video.addEventListener("ended", () => { player.classList.remove("playing"); playBtn.textContent = "▶"; });
    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("volumechange", updateMute);
    video.addEventListener("click", togglePlay);

    playBtn.addEventListener("click", togglePlay);
    bigPlay.addEventListener("click", togglePlay);
    muteBtn.addEventListener("click", () => {
      video.muted = !video.muted;
      if (!video.muted && video.volume === 0) video.volume = 1;
    });
    volume.addEventListener("input", () => {
      video.volume = Number(volume.value);
      video.muted = video.volume === 0;
    });
    progress.addEventListener("input", () => {
      if (video.duration) video.currentTime = (progress.value / 100) * video.duration;
    });
    replayBtn.addEventListener("click", () => { video.currentTime = 0; video.play(); });
    fullBtn.addEventListener("click", () => {
      if (document.fullscreenElement) document.exitFullscreen();
      else if (player.requestFullscreen) player.requestFullscreen();
      else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen(); // iPhone
    });

    // «Дыбыспен көру» және «Дыбыссыз көру» батырмалары
    playSound.addEventListener("click", () => {
      video.muted = false;
      if (video.volume === 0) video.volume = 1;
      video.play();
    });
    playMuted.addEventListener("click", () => {
      video.muted = true;
      video.play();
    });

    // ===== Бейнені ауыстыру және сақтау =====
    // Таңдалған бейне браузердің IndexedDB қоймасында сақталады,
    // сондықтан бетті қайта ашқанда да сол бейне көрсетіледі.
    const changeInput = document.getElementById("videoChange");
    const resetBtn = document.getElementById("videoReset");
    const status = document.getElementById("saveStatus");
    const DB_NAME = "avatarDB", STORE = "videos", KEY = "custom";

    const openDB = () => new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => req.result.createObjectStore(STORE);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    const dbAction = async (mode, action) => {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, mode);
        const req = action(tx.objectStore(STORE));
        tx.oncomplete = () => resolve(req && req.result);
        tx.onerror = () => reject(tx.error);
      });
    };
    const saveVideo = (blob) => dbAction("readwrite", s => s.put(blob, KEY));
    const loadVideo = () => dbAction("readonly", s => s.get(KEY));
    const deleteVideo = () => dbAction("readwrite", s => s.delete(KEY));

    let currentUrl = null;
    const showBlob = (blob) => {
      if (currentUrl) URL.revokeObjectURL(currentUrl);
      currentUrl = URL.createObjectURL(blob);
      video.src = currentUrl;
      video.load();
      if (resetBtn) resetBtn.hidden = false;
    };
    const setStatus = (text) => {
      if (!status) return;
      status.textContent = text;
      clearTimeout(setStatus.t);
      setStatus.t = setTimeout(() => (status.textContent = ""), 4000);
    };

    const handleFile = async (input) => {
      const file = input.files[0];
      if (!file) return;
      showBlob(file);
      try {
        await saveVideo(file);
        setStatus("✓ Бейне сақталды");
      } catch (e) {
        setStatus("Бейне көрсетілді, бірақ сақталмады");
      }
      input.value = "";
    };
    if (changeInput) changeInput.addEventListener("change", () => handleFile(changeInput));
    if (picker) picker.addEventListener("change", () => handleFile(picker));

    if (resetBtn) {
      resetBtn.addEventListener("click", async () => {
        try { await deleteVideo(); } catch (e) {}
        if (currentUrl) URL.revokeObjectURL(currentUrl);
        currentUrl = null;
        video.removeAttribute("src");   // қайтадан videos/avatar.mp4 файлы қолданылады
        video.load();
        resetBtn.hidden = true;
        setStatus("Бастапқы бейне қайтарылды");
      });
    }

    // Бет ашылғанда сақталған бейне бар-жоғын тексеру
    if (window.indexedDB) {
      loadVideo().then(blob => { if (blob) showBlob(blob); }).catch(() => {});
    }
    updateMute();
  }

  // 7. Портфолио: санат бойынша сүзгі
  const filterBtns = document.querySelectorAll(".filter-btn");
  const certCards = document.querySelectorAll(".cert-card");
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const f = btn.dataset.filter;
      certCards.forEach(card => {
        card.classList.toggle("hide", f !== "all" && card.dataset.category !== f);
      });
    });
  });

  // 8. Сертификатты үлкейтіп көру (lightbox)
  const lightbox = document.getElementById("lightbox");
  if (lightbox) {
    const lbImg = lightbox.querySelector("img");
    certCards.forEach(card => {
      card.addEventListener("click", () => {
        const img = card.querySelector("img");
        lbImg.src = img.src;
        lbImg.alt = img.alt;
        lightbox.classList.add("open");
      });
    });
    const close = () => lightbox.classList.remove("open");
    lightbox.addEventListener("click", e => { if (e.target !== lbImg) close(); });
    document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
  }

  // 9. Байланыс формасын тексеру (деректер серверге жіберілмейді)
  const form = document.getElementById("contactForm");
  if (form) {
    const setError = (input, msg) => {
      const group = input.closest(".form-group");
      group.classList.toggle("error", Boolean(msg));
      group.querySelector(".error-text").textContent = msg;
    };
    form.addEventListener("submit", e => {
      e.preventDefault();
      const name = form.name;
      const email = form.email;
      const message = form.message;
      let ok = true;

      if (name.value.trim().length < 2) { setError(name, "Атыңызды жазыңыз (кемінде 2 әріп)."); ok = false; }
      else setError(name, "");

      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!emailRe.test(email.value.trim())) { setError(email, "Электрондық поштаны дұрыс енгізіңіз."); ok = false; }
      else setError(email, "");

      if (message.value.trim().length < 10) { setError(message, "Хабарлама кемінде 10 таңбадан тұруы керек."); ok = false; }
      else setError(message, "");

      const success = document.getElementById("formSuccess");
      if (ok) {
        success.textContent = `Рақмет, ${name.value.trim()}! Хабарламаңыз қабылданды (демо-форма).`;
        success.classList.add("show");
        form.reset();
      } else {
        success.classList.remove("show");
      }
    });
  }

  // 10. Жоғарыға шығу батырмасы
  const toTop = document.getElementById("toTop");
  if (toTop) {
    window.addEventListener("scroll", () => toTop.classList.toggle("show", window.scrollY > 400));
    toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  // 11. Футердегі жыл
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});
