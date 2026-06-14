/**
 * ================================================================
 * SOMIK CHOWDHURY — GSAP SCROLL PORTFOLIO
 *
 * Architecture:
 * 1. Theme system (localStorage persistence)
 * 2. Helper functions (escaping, date formatting, icons)
 * 3. Interactive systems (cursor, magnetic, particles, 3D tilt)
 * 4. Data rendering (JSON → DOM)
 * 5. GSAP animation controller (ScrollTrigger-based)
 * 6. Loader sequence
 * 7. Boot chain
 *
 * All content is fetched from portfolio-data.json at runtime.
 * ================================================================
 */

(() => {
  "use strict";

  gsap.registerPlugin(ScrollTrigger);


  /* ================================================================
     1. THEME SYSTEM
     Reads saved preference from localStorage on load.
     Toggle button swaps data-theme on <html> and saves.
     ================================================================ */

  const THEME_KEY = "sc-portfolio-theme";
  const root = document.documentElement;

  // Apply saved theme immediately (prevents flash)
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme) {
    root.setAttribute("data-theme", savedTheme);
  }

  /**
   * Initializes the theme toggle button click handler.
   */
  function initThemeToggle() {
    const btn = document.getElementById("themeToggle");
    if (!btn) return;

    btn.addEventListener("click", () => {
      const current = root.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";

      root.setAttribute("data-theme", next);
      localStorage.setItem(THEME_KEY, next);

      // Elastic bounce feedback on the button
      gsap.fromTo(
        btn,
        { scale: 0.85 },
        { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.4)" }
      );
    });
  }


  /* ================================================================
     2. HELPER FUNCTIONS
     ================================================================ */

  /**
   * Escapes HTML special characters to prevent XSS.
   * @param {string} str - Raw string
   * @returns {string} - Safe HTML string
   */
  function esc(str = "") {
    return String(str).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[char]));
  }

  /**
   * Formats an ISO date string (YYYY-MM) into "Mon YYYY".
   * @param {string} dateStr - e.g. "2024-01"
   * @returns {string} - e.g. "Jan 2024"
   */
  function fmtDate(dateStr) {
    if (!dateStr) return "";
    const [year, month] = dateStr.split("-");
    const MONTHS = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    return month ? `${MONTHS[+month - 1]} ${year}` : year;
  }

  /**
   * Formats a date range as "Start — End" or "Start — Present".
   */
  function dateRange(start, end) {
    const s = fmtDate(start);
    const e = end ? fmtDate(end) : "Present";
    return s === e ? s : `${s} — ${e}`;
  }

  /**
   * Splits text into per-character <span> elements for GSAP animation.
   * @param {string} text - Regular text
   * @param {string} [emText] - Text to render with .em-char class
   * @returns {string} - HTML string
   */
  function splitChars(text, emText) {
    let html = "";

    for (const char of text) {
      html += char === " "
        ? '<span class="char space"></span>'
        : `<span class="char">${esc(char)}</span>`;
    }

    if (emText) {
      for (const char of emText) {
        html += char === " "
          ? '<span class="char space em-char"></span>'
          : `<span class="char em-char">${esc(char)}</span>`;
      }
    }

    return html;
  }

  /**
   * SVG icon strings for social links and contact.
   */
  const ICONS = {
    email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">'
      + '<rect x="2" y="4" width="20" height="16" rx="2"/>'
      + '<path d="m22 7-10 6L2 7"/></svg>',

    linkedin: '<svg viewBox="0 0 24 24" fill="currentColor">'
      + '<path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17'
      + 'A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5 1.78 1.78 0 016.5 8.25z'
      + 'M19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19V19h-3v-9h2.9v1.3a3.11 3.11'
      + ' 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/></svg>',

    github: '<svg viewBox="0 0 24 24" fill="currentColor">'
      + '<path d="M12 .3a12 12 0 00-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8'
      + '-1.4-1.8-1-.7.1-.7.1-.7 1.2 0 1.9 1.2 1.9 1.2 1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.7-1.6-2.7'
      + '-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6 0-3.2 0 0 1-.3 3.4 1.2a11.5 11.5 0 016'
      + ' 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.6.2 2.8.1 3.2.8.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.5'
      + '.4.9 1.2.9 2.3v3.3c0 .3.1.7.8.6A12 12 0 0012 .3"/></svg>',

    leetcode: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">'
      + '<path d="M13.5 2L4 12l9.5 10M20 12H9"/></svg>',

    loc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">'
      + '<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>'
      + '<circle cx="12" cy="9" r="2.5"/></svg>',
  };


  /* ================================================================
     3. INTERACTIVE SYSTEMS
     ================================================================ */

  /**
   * Custom cursor — dot snaps to mouse, ring follows with elastic lag.
   * Disabled on touch devices.
   */
  function initCursor() {
    if (matchMedia("(pointer: coarse)").matches || innerWidth < 900) return;

    const dot = document.getElementById("cursor");
    const ring = document.getElementById("cursorRing");
    let cursorX = 0;
    let cursorY = 0;
    let ringX = 0;
    let ringY = 0;

    // Dot: snap to mouse instantly
    document.addEventListener("mousemove", (e) => {
      cursorX = e.clientX;
      cursorY = e.clientY;
      dot.style.left = `${cursorX}px`;
      dot.style.top = `${cursorY}px`;
    });

    // Ring: lerp follow at 10% per frame
    (function followRing() {
      ringX += (cursorX - ringX) * 0.1;
      ringY += (cursorY - ringY) * 0.1;
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;
      requestAnimationFrame(followRing);
    })();

    // Hover expansion on interactive elements
    const hoverTargets = "a, button, .proj-card, .skill-chip, .exp-card, "
      + ".cert-card, .edu-card, .btn, .about__lang, .tech-logo";

    document.querySelectorAll(hoverTargets).forEach((el) => {
      el.addEventListener("mouseenter", () => document.body.classList.add("cursor-hover"));
      el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hover"));
    });
  }

  /**
   * Magnetic hover — elements pull toward cursor by 20% offset.
   */
  function initMagnetic() {
    if (matchMedia("(pointer: coarse)").matches || innerWidth < 900) return;

    document.querySelectorAll(".magnetic").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const deltaX = e.clientX - (rect.left + rect.width / 2);
        const deltaY = e.clientY - (rect.top + rect.height / 2);

        gsap.to(el, {
          x: deltaX * 0.2,
          y: deltaY * 0.2,
          duration: 0.4,
          ease: "power3.out",
          overwrite: true,
        });
      });

      el.addEventListener("mouseleave", () => {
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: "power3.out",
          overwrite: true,
        });
      });
    });
  }

  /**
   * Canvas particle system — 45 ambient floating dots.
   */
  function initParticles() {
    const canvas = document.getElementById("particles");
    const ctx = canvas.getContext("2d");
    let width;
    let height;
    const particles = [];
    const PARTICLE_COUNT = 45;

    function resize() {
      width = canvas.width = innerWidth;
      height = canvas.height = innerHeight;
    }
    resize();
    addEventListener("resize", resize);

    // Create particles with random properties
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * innerWidth,
        y: Math.random() * innerHeight,
        radius: Math.random() * 1.2 + 0.3,
        velocityX: (Math.random() - 0.5) * 0.15,
        velocityY: (Math.random() - 0.5) * 0.15,
        alpha: Math.random() * 0.25 + 0.06,
      });
    }

    // Animation loop
    (function draw() {
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        // Update position (wrap at edges)
        p.x += p.velocityX;
        p.y += p.velocityY;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Draw
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 128, 74, ${p.alpha})`;
        ctx.fill();
      }

      requestAnimationFrame(draw);
    })();
  }

  /**
   * 3D tilt effect on project cards — ±6° rotation tracking mouse.
   */
  function initTilt() {
    if (matchMedia("(pointer: coarse)").matches || innerWidth < 900) return;

    document.querySelectorAll("[data-tilt]").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const normalizedX = (e.clientX - rect.left) / rect.width;
        const normalizedY = (e.clientY - rect.top) / rect.height;

        // Set CSS variables for the radial shine effect
        card.style.setProperty("--mx", `${normalizedX * 100}%`);
        card.style.setProperty("--my", `${normalizedY * 100}%`);

        gsap.to(card, {
          rotateX: (normalizedY - 0.5) * -6,
          rotateY: (normalizedX - 0.5) * 6,
          transformPerspective: 900,
          duration: 0.5,
          ease: "power2.out",
          overwrite: true,
        });
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.5,
          ease: "power3.out",
          overwrite: true,
        });
      });
    });
  }


  /* ================================================================
     4. DATA RENDERING
     Reads portfolio-data.json and injects HTML into empty containers.
     ================================================================ */

  /**
   * Main render function — populates every section from JSON data.
   */
  function render(data) {
    const profile = data.profile;
    const contacts = profile.contacts;

    // --- Loader: split name into animated chars ---
    document.getElementById("loaderName").innerHTML = profile.fullName
      .split("")
      .map((ch) =>
        ch === " "
          ? '<span class="char" style="width:.25em">&nbsp;</span>'
          : `<span class="char">${esc(ch)}</span>`
      )
      .join("");

    // --- Hero: per-character title ---
    document.getElementById("heroTag").textContent = "Portfolio / 2026";

    const nameParts = profile.fullName.split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") + ".";

    let titleHTML = '<span class="line">';
    for (const ch of firstName) {
      titleHTML += `<span class="char">${esc(ch)}</span>`;
    }
    titleHTML += '</span><span class="line"><span class="em-wrap">';
    for (const ch of lastName) {
      titleHTML += ch === " "
        ? '<span class="char space"></span>'
        : `<span class="char">${esc(ch)}</span>`;
    }
    titleHTML += "</span></span>";

    document.getElementById("heroTitle").innerHTML = titleHTML;
    document.getElementById("heroSub").textContent = profile.headline;

    // --- Hero: social links ---
    const socialLinks = [
      contacts.email && { href: `mailto:${contacts.email}`, icon: "email", label: "Email" },
      contacts.linkedin && { href: contacts.linkedin, icon: "linkedin", label: "LinkedIn" },
      contacts.github && { href: contacts.github, icon: "github", label: "GitHub" },
      contacts.leetcode && { href: contacts.leetcode, icon: "leetcode", label: "LeetCode" },
    ].filter(Boolean);

    const socialsContainer = document.getElementById("heroSocials");
    socialLinks.forEach((social) => {
      socialsContainer.insertAdjacentHTML(
        "beforeend",
        `<a href="${esc(social.href)}" target="_blank" rel="noopener" aria-label="${social.label}" class="magnetic">${ICONS[social.icon]}</a>`
      );
    });

    // --- Statement sections: split words for scroll reveal ---
    ["statementText", "statementText2"].forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const rawHTML = el.innerHTML;
      el.innerHTML = rawHTML
        .replace(/(<em>|<\/em>)/g, "⌘$1⌘")
        .split(/\s+/)
        .map((word) => `<span class="word">${word.replace(/⌘/g, "")}</span>`)
        .join(" ");
    });

    // --- Marquee: all skills joined with separators, doubled for loop ---
    const allSkills = (data.skills?.categories || []).flatMap((cat) => cat.items);
    const marqueeContent = allSkills
      .map((skill) => `<span>${esc(skill)}</span>`)
      .join('<span class="sep">◆</span>');
    const doubledContent = marqueeContent + '<span class="sep">◆</span>' + marqueeContent;

    document.getElementById("marqueeTrack").innerHTML = doubledContent;
    document.getElementById("marqueeTrack2").innerHTML = doubledContent;

    // --- About: word-split summary for scroll reveal ---
    document.getElementById("aboutText").innerHTML = profile.summary
      .split(/(\s+)/)
      .map((word) => (/^\s+$/.test(word) ? " " : `<span class="word">${esc(word)}</span>`))
      .join("");

    document.getElementById("aboutLangs").innerHTML = (data.languages || [])
      .map((lang) => `<span class="about__lang">${esc(lang.name)} · ${esc(lang.level)}</span>`)
      .join("");

    // --- Experience: store data for pinned reveal ---
    window.__expData = data.experience || [];
    document.getElementById("expTotal").textContent =
      String(window.__expData.length).padStart(2, "0");

    if (window.__expData.length) {
      showExp(0);
    }

    // --- Projects: render cards with 3D tilt ---
    const projectsGrid = document.getElementById("projectsGrid");
    (data.projects || []).forEach((project, index) => {
      const links = (project.links || [])
        .map((link) =>
          `<a class="proj-link magnetic" href="${esc(link.url)}" target="_blank" rel="noopener">${esc(link.label)}</a>`
        )
        .join("");

      const skills = (project.skills || [])
        .slice(0, 5)
        .map((skill) => `<span class="tag">${esc(skill)}</span>`)
        .join("");

      const cardHTML = `
        <div class="proj-card" data-tilt>
          <div class="proj-card__shine"></div>
          <span class="proj-card__num">PROJ / ${String(index + 1).padStart(2, "0")}</span>
          <h3 class="proj-card__title">${esc(project.title)}</h3>
          ${project.associatedWith ? `<div class="proj-card__assoc">${esc(project.associatedWith)}</div>` : ""}
          <p class="proj-card__desc">${esc((project.highlights || [])[0] || "")}</p>
          <div class="proj-card__footer">
            <div class="tags">${skills}</div>
            ${links ? `<div class="proj-card__links">${links}</div>` : ""}
          </div>
        </div>`;

      projectsGrid.insertAdjacentHTML("beforeend", cardHTML);
    });

    // --- Skills: category buttons ---
    const skillsCatsContainer = document.getElementById("skillsCats");
    const categories = data.skills?.categories || [];

    categories.forEach((cat, index) => {
      const btn = document.createElement("button");
      btn.className = "skill-cat-btn" + (index === 0 ? " active" : "");
      btn.textContent = cat.label;
      btn.dataset.index = index;
      skillsCatsContainer.appendChild(btn);
    });

    switchCategory(0);

    // Category click handler with scroll-to-position sync
    skillsCatsContainer.addEventListener("click", (e) => {
      const btn = e.target.closest(".skill-cat-btn");
      if (!btn) return;

      const idx = +btn.dataset.index;
      switchCategory(idx);

      // Scroll to the correct position so scroll-driven switching stays in sync
      const skillsSection = document.querySelector(".skills");
      if (skillsSection && window.__skillsST) {
        const st = window.__skillsST;
        const totalCats = (window.__portfolioData?.skills?.categories || []).length;
        const progress = (idx + 0.5) / totalCats;
        const targetScroll = st.start + progress * (st.end - st.start);
        window.scrollTo({ top: targetScroll, behavior: "smooth" });
      }
    });

    // --- Education ---
    const eduList = document.getElementById("eduList");
    (data.education || []).forEach((edu) => {
      eduList.insertAdjacentHTML("beforeend", `
        <div class="edu-card">
          <h3 class="edu-card__qual">${esc(edu.qualification)}</h3>
          <div class="edu-card__inst">${esc(edu.institution)}</div>
          <div class="edu-card__meta">
            <span>${esc(dateRange(edu.start, edu.end))}</span>
            <span>${esc(edu.location || "")}</span>
          </div>
        </div>`);
    });

    // --- Certifications ---
    const certGrid = document.getElementById("certGrid");
    (data.certifications || []).forEach((cert) => {
      certGrid.insertAdjacentHTML("beforeend", `
        <div class="cert-card">
          <h3 class="cert-card__title">${esc(cert.title)}</h3>
          <div class="cert-card__issuer">${esc(cert.issuer)}</div>
          <span class="cert-card__date">Issued ${esc(cert.issued)}</span>
          ${cert.credentialUrl
            ? `<a class="cert-card__link magnetic" href="${esc(cert.credentialUrl)}" target="_blank" rel="noopener">View credential</a>`
            : ""}
        </div>`);
    });

    // --- Contact: per-character title ---
    document.getElementById("contactTitle").innerHTML = splitChars("Let's ", "connect.");

    const contactLinksContainer = document.getElementById("contactLinks");
    const contactItems = [
      contacts.email && { href: `mailto:${contacts.email}`, label: "Email", icon: "email" },
      contacts.linkedin && { href: contacts.linkedin, label: "LinkedIn", icon: "linkedin" },
      contacts.github && { href: contacts.github, label: "GitHub", icon: "github" },
      contacts.leetcode && { href: contacts.leetcode, label: "LeetCode", icon: "leetcode" },
      { href: "#", label: "Dublin, Ireland", icon: "loc" },
    ].filter(Boolean);

    contactItems.forEach((item) => {
      contactLinksContainer.insertAdjacentHTML(
        "beforeend",
        `<a class="contact__link magnetic" href="${esc(item.href)}" target="_blank" rel="noopener">${ICONS[item.icon]}<span>${esc(item.label)}</span></a>`
      );
    });

    document.getElementById("footerYear").textContent = new Date().getFullYear();
    document.getElementById("footerName").textContent = profile.fullName;
  }


  /* ================================================================
     EXPERIENCE REVEAL — GTA VI character-style content swap
     ================================================================ */

  let isFirstExpLoad = true;

  /**
   * Shows experience at given index. First call populates instantly;
   * subsequent calls crossfade (animate out → swap → animate in).
   */
  function showExp(index) {
    const experiences = window.__expData;
    if (!experiences || !experiences[index]) return;

    const exp = experiences[index];
    const card = document.getElementById("expCard");

    function populateCard() {
      document.getElementById("expDates").textContent = dateRange(exp.start, exp.end);
      document.getElementById("expRole").textContent = exp.title;
      document.getElementById("expCompany").textContent = exp.company;
      document.getElementById("expLocation").textContent = exp.location || "";
      document.getElementById("expHighlights").innerHTML =
        (exp.highlights || []).map((h) => `<li>${esc(h)}</li>`).join("");
      document.getElementById("expTags").innerHTML =
        (exp.tags || []).map((t) => `<span class="tag">${esc(t)}</span>`).join("");
      document.getElementById("expIdx").textContent =
        String(index + 1).padStart(2, "0");
    }

    // First load: no animation needed (nothing to fade out)
    if (isFirstExpLoad) {
      populateCard();
      isFirstExpLoad = false;
      return;
    }

    // Subsequent: crossfade
    gsap.to(card, {
      opacity: 0,
      y: 20,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        populateCard();
        gsap.fromTo(card,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
        );
      },
    });
  }


  /* ================================================================
     SKILL CATEGORY SWITCHING
     ================================================================ */

  /**
   * Switches displayed skills to the given category index.
   * Animates old chips out, then new chips in.
   */
  function switchCategory(index) {
    const categories = window.__portfolioData?.skills?.categories || [];
    const category = categories[index];
    if (!category) return;

    const display = document.getElementById("skillsDisplay");
    const catContainer = document.getElementById("skillsCats");

    // Update active button
    catContainer.querySelectorAll(".skill-cat-btn").forEach((btn, i) => {
      btn.classList.toggle("active", i === index);
    });

    // Animate out existing chips
    const existingChips = display.querySelectorAll(".skill-chip");
    if (existingChips.length) {
      gsap.to(existingChips, {
        opacity: 0,
        y: 8,
        duration: 0.2,
        stagger: 0.01,
        ease: "power2.in",
        onComplete: () => {
          display.innerHTML = "";
          renderChips(category.items);
        },
      });
    } else {
      renderChips(category.items);
    }
  }

  /**
   * Creates chip elements and animates them in.
   */
  function renderChips(items) {
    const display = document.getElementById("skillsDisplay");

    items.forEach((item) => {
      display.insertAdjacentHTML(
        "beforeend",
        `<span class="skill-chip">${esc(item)}</span>`
      );
    });

    gsap.fromTo(
      display.querySelectorAll(".skill-chip"),
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.025, ease: "power3.out" }
    );
  }


  /* ================================================================
     SCROLL SPY
     Highlights the active nav link based on viewport position.
     ================================================================ */

  function initScrollSpy() {
    const sectionIds = [
      "about", "experience", "projects",
      "skills", "education", "certifications", "contact",
    ];

    const navLinks = document.querySelectorAll(".nav__link[data-section]");

    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (!section) return;

      ScrollTrigger.create({
        trigger: section,
        start: "top 40%",
        end: "bottom 40%",
        onToggle: (self) => {
          navLinks.forEach((link) => {
            link.classList.toggle(
              "active",
              self.isActive && link.dataset.section === id
            );
          });
        },
      });
    });
  }


  /* ================================================================
     5. GSAP ANIMATION CONTROLLER
     All scroll-driven animations set up here.
     ================================================================ */

  function initAnimations() {
    const mediaQuery = gsap.matchMedia();

    // --- Scroll progress bar ---
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        document.getElementById("progress")
          .style.setProperty("--sp", `${self.progress * 100}%`);
      },
    });

    // --- Nav: hidden initially, appears after hero ---
    ScrollTrigger.create({
      trigger: ".hero",
      start: "80% top",
      once: true,
      onEnter: () => {
        document.getElementById("nav").classList.add("visible");
        gsap.to("#nav", { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" });
      },
    });

    ScrollTrigger.create({
      start: 30,
      onUpdate: (self) => {
        document.getElementById("nav").classList.toggle("scrolled", self.scroll() > 30);
      },
    });

    // --- HERO: massive centered character reveal ---
    const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });
    heroTimeline
      .to(".hero__title .char",  { y: 0, opacity: 1, duration: 1, stagger: 0.02 })
      .to(".hero__tag",          { opacity: 1, duration: 0.6 }, "-=0.3")
      .to(".hero__sub",          { opacity: 1, duration: 0.6 }, "-=0.2")
      .to(".hero__actions",      { opacity: 1, duration: 0.6 }, "-=0.2")
      .to(".hero__socials",      { opacity: 1, duration: 0.6 }, "-=0.2")
      .to("#heroScroll",         { opacity: 1, duration: 0.5 }, "-=0.1")
      .to(".hero__scene",        { opacity: 0.6, y: 0, scale: 1, duration: 1.2, ease: "power3.out" }, "-=1.2");

    // --- Coder scene: code lines typing animation ---
    const codeTimeline = gsap.timeline({ delay: 1.6 });
    document.querySelectorAll(".code-line").forEach((line, i) => {
      gsap.set(line, { scaleX: 0 });
      codeTimeline.to(line, {
        scaleX: 1,
        duration: 0.25 + Math.random() * 0.2,
        ease: "power2.out",
      }, i * 0.1);
    });

    // --- Floating code symbols: continuous drift ---
    document.querySelectorAll(".float-sym").forEach((sym, i) => {
      const delay = 2.2 + i * 0.35;

      // Fade in
      gsap.to(sym, {
        opacity: 0.25 + Math.random() * 0.2,
        duration: 0.8,
        delay,
        ease: "power2.out",
      });

      // Continuous float loop
      gsap.to(sym, {
        y: -20 - Math.random() * 30,
        x: (Math.random() - 0.5) * 20,
        duration: 4 + Math.random() * 3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay,
      });
    });

    // --- Head bob ---
    gsap.to(".coder__head", {
      y: -2,
      duration: 3,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      delay: 2,
    });

    // --- Tech logos: staggered entrance + continuous float ---
    const logos = document.querySelectorAll(".tech-logo");
    logos.forEach((logo, i) => {
      const angle = (i / logos.length) * Math.PI * 2;
      const fromX = Math.cos(angle) * 40;
      const fromY = Math.sin(angle) * 40;

      // Entrance from radial direction
      gsap.fromTo(logo,
        { opacity: 0, x: fromX, y: fromY, scale: 0.6 },
        { opacity: 0.55, x: 0, y: 0, scale: 1, duration: 1, ease: "power3.out", delay: 1.8 + i * 0.12 }
      );

      // Continuous float
      const floatDuration = 5 + Math.random() * 4;
      gsap.to(logo, {
        y: -8 - Math.random() * 16,
        x: (Math.random() - 0.5) * 10,
        duration: floatDuration,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 2.5 + i * 0.2,
      });

      // Subtle rotation
      gsap.to(logo, {
        rotation: (Math.random() - 0.5) * 8,
        duration: floatDuration * 1.3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 2.5 + i * 0.15,
      });
    });

    // --- Hero scroll parallax (layered depth) ---
    gsap.to(".hero__fg", {
      y: -100,
      opacity: 0,
      scrollTrigger: { trigger: ".hero", start: "40% top", end: "90% top", scrub: true },
    });

    gsap.to(".hero__scene", {
      y: 60,
      opacity: 0,
      scale: 0.9,
      scrollTrigger: { trigger: ".hero", start: "50% top", end: "bottom top", scrub: true },
    });

    gsap.to(".hero__bg-layer", {
      scale: 1.1,
      opacity: 0.2,
      scrollTrigger: { trigger: ".hero", start: "40% top", end: "bottom top", scrub: true },
    });

    gsap.to(".float-sym", {
      y: -50,
      scrollTrigger: { trigger: ".hero", start: "20% top", end: "bottom top", scrub: true },
    });

    // Logos scatter outward on scroll
    logos.forEach((logo, i) => {
      const direction = i % 2 === 0 ? -1 : 1;
      gsap.to(logo, {
        y: -30 - Math.random() * 40,
        x: direction * (20 + Math.random() * 30),
        opacity: 0,
        scale: 0.7,
        scrollTrigger: { trigger: ".hero", start: "30% top", end: "90% top", scrub: true },
      });
    });

    // --- STATEMENT: word-by-word scrub reveal ---
    document.querySelectorAll(".statement").forEach((section) => {
      const words = section.querySelectorAll(".word");
      if (!words.length) return;

      ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.5,
        onUpdate: (self) => {
          const litCount = Math.ceil(self.progress * 2 * words.length);
          words.forEach((word, i) => word.classList.toggle("lit", i < litCount));
        },
      });
    });

    // --- ABOUT: pinned word reveal (desktop only) ---
    mediaQuery.add("(min-width: 861px)", () => {
      const aboutSection = document.querySelector(".about");
      const aboutWords = aboutSection.querySelectorAll(".about__text .word");
      const wordCount = aboutWords.length;
      const scrollDistance = Math.max(wordCount * 18, innerHeight * 1.5);

      aboutSection.style.height = `${scrollDistance + innerHeight}px`;

      ScrollTrigger.create({
        trigger: aboutSection,
        start: "top top",
        end: "bottom bottom",
        pin: ".about__pin",
        pinSpacing: false,
        invalidateOnRefresh: true,
      });

      if (wordCount) {
        ScrollTrigger.create({
          trigger: aboutSection,
          start: "top top",
          end: () => `bottom-=${innerHeight * 0.5} bottom`,
          scrub: 0.5,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const litCount = Math.ceil(self.progress * wordCount);
            aboutWords.forEach((word, i) => word.classList.toggle("lit", i < litCount));
          },
        });
      }

      gsap.fromTo(".about__langs",
        { opacity: 0, y: 16 },
        {
          opacity: 1, y: 0, duration: 0.8,
          scrollTrigger: {
            trigger: aboutSection,
            start: "70% center",
            end: "85% center",
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );

      gsap.fromTo(".about__orb",
        { scale: 0.85 },
        {
          scale: 1.05,
          scrollTrigger: { trigger: aboutSection, start: "top top", end: "bottom bottom", scrub: true },
        }
      );
    });

    // --- EXPERIENCE: GTA VI pinned full-viewport reveal (desktop only) ---
    mediaQuery.add("(min-width: 861px)", () => {
      const section = document.querySelector(".experience");
      const expData = window.__expData || [];
      const total = expData.length;
      if (!total) return;

      const scrollPerRole = innerHeight * 0.9;
      const totalScroll = scrollPerRole * total;
      section.style.height = `${totalScroll + innerHeight}px`;

      let currentExpIndex = 0;

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${totalScroll}`,
        pin: ".experience__pin",
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefresh: () => {
          section.style.height = `${scrollPerRole * total + innerHeight}px`;
        },
        onUpdate: (self) => {
          const index = Math.min(Math.floor(self.progress * total), total - 1);
          document.getElementById("expProgressFill").style.width = `${self.progress * 100}%`;

          if (index !== currentExpIndex) {
            currentExpIndex = index;
            showExp(index);
          }
        },
      });
    });

    // --- PROJECTS: staggered scroll reveal ---
    gsap.utils.toArray(".proj-card").forEach((card, i) => {
      gsap.to(card, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: card, start: "top 90%", toggleActions: "play none none none" },
        delay: (i % 2) * 0.1,
      });
    });

    // --- SKILLS: pinned scroll-driven category switching (desktop only) ---
    mediaQuery.add("(min-width: 861px)", () => {
      const skillsSection = document.querySelector(".skills");
      const catButtons = document.querySelectorAll(".skill-cat-btn");
      const totalCategories = catButtons.length;
      if (!totalCategories) return;

      const scrollPerCategory = innerHeight * 0.65;
      const totalSkillScroll = scrollPerCategory * totalCategories;
      skillsSection.style.height = `${totalSkillScroll + innerHeight}px`;

      let currentCatIndex = 0;

      const skillsST = ScrollTrigger.create({
        trigger: skillsSection,
        start: "top top",
        end: () => `+=${totalSkillScroll}`,
        pin: ".skills__pin",
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefresh: () => {
          skillsSection.style.height = `${scrollPerCategory * totalCategories + innerHeight}px`;
        },
        onUpdate: (self) => {
          const index = Math.min(
            Math.floor(self.progress * totalCategories),
            totalCategories - 1
          );
          if (index !== currentCatIndex) {
            currentCatIndex = index;
            switchCategory(index);
          }
        },
      });

      // Store reference so category click handler can scroll to position
      window.__skillsST = skillsST;
    });

    // --- EDUCATION: slide-in reveal ---
    gsap.utils.toArray(".edu-card").forEach((card, i) => {
      gsap.to(card, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: card, start: "top 88%", toggleActions: "play none none none" },
        delay: i * 0.08,
      });
    });

    // --- CERTIFICATIONS: staggered reveal ---
    gsap.utils.toArray(".cert-card").forEach((card, i) => {
      gsap.to(card, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: card, start: "top 90%", toggleActions: "play none none none" },
        delay: (i % 3) * 0.07,
      });
    });

    // --- CONTACT: per-character reveal ---
    ScrollTrigger.create({
      trigger: ".contact",
      start: "top 70%",
      once: true,
      onEnter: () => {
        gsap.to(".contact__title .char", {
          y: 0, opacity: 1, duration: 0.7, stagger: 0.02, ease: "power3.out",
        });
        gsap.to(".contact__sub", {
          opacity: 1, y: 0, duration: 0.7, delay: 0.3, ease: "power3.out",
        });
        gsap.to(".contact__link", {
          opacity: 1, y: 0, duration: 0.5, stagger: 0.05, delay: 0.5, ease: "power3.out",
        });
      },
    });

    // --- Section labels & titles: scroll-triggered reveal ---
    gsap.utils.toArray(".anim-label").forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0, x: -20 },
        {
          opacity: 1, x: 0, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 92%", toggleActions: "play none none none" },
        }
      );
    });

    gsap.utils.toArray(".anim-title").forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0, y: 28 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
        }
      );
    });

    // --- Glow parallax ---
    gsap.to(".hero__glow--1", {
      y: 200,
      scrollTrigger: { start: "top top", end: "bottom bottom", scrub: 3 },
    });

    gsap.to(".hero__glow--2", {
      y: -200,
      scrollTrigger: { start: "top top", end: "bottom bottom", scrub: 3 },
    });

    // --- Scroll spy ---
    initScrollSpy();

    // --- MARQUEE ARROW BUTTONS ---
    document.querySelectorAll(".marquee").forEach((marquee) => {
      const track = marquee.querySelector(".marquee__track");
      const leftBtn = marquee.querySelector(".marquee__btn--left");
      const rightBtn = marquee.querySelector(".marquee__btn--right");
      if (!track || !leftBtn || !rightBtn) return;

      /**
       * Shifts the marquee track by 300px in the given direction.
       * Pauses auto-scroll, applies transform, resumes after 2s.
       * @param {number} direction - 1 for left (backward), -1 for right (forward)
       */
      function shiftMarquee(direction) {
        const computedStyle = getComputedStyle(track);
        const matrix = new DOMMatrix(computedStyle.transform);
        const currentX = matrix.m41;
        const shiftAmount = direction * 300;

        // Pause CSS animation and apply manual position
        track.style.animation = "none";
        track.style.transform = `translateX(${currentX + shiftAmount}px)`;

        // Resume auto-scroll after delay
        clearTimeout(track.__resumeTimer);
        track.__resumeTimer = setTimeout(() => {
          track.style.animation = "";
          track.style.transform = "";
        }, 2000);
      }

      leftBtn.addEventListener("click", () => shiftMarquee(1));
      rightBtn.addEventListener("click", () => shiftMarquee(-1));
    });
  }


  /* ================================================================
     6. LOADER SEQUENCE
     Animates name chars in, counts to 100%, then fades out.
     ================================================================ */

  function runLoader(onComplete) {
    const fillBar = document.getElementById("loaderFill");
    const percentDisplay = document.getElementById("loaderPct");
    const nameChars = document.querySelectorAll(".loader__name .char");

    // Animate name chars in
    gsap.to(nameChars, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.03,
      ease: "power3.out",
      delay: 0.15,
    });

    // Count up from 0 to 100
    let value = 0;
    const interval = setInterval(() => {
      value += Math.floor(Math.random() * 6) + 3;
      if (value > 100) value = 100;

      fillBar.style.width = `${value}%`;
      percentDisplay.textContent = value;

      if (value >= 100) {
        clearInterval(interval);

        // Animate chars out
        gsap.to(nameChars, {
          y: -80,
          opacity: 0,
          duration: 0.4,
          stagger: 0.015,
          ease: "power3.in",
          delay: 0.25,
        });

        // Fade loader
        gsap.to("#loader", {
          opacity: 0,
          duration: 0.6,
          delay: 0.7,
          onComplete: () => {
            document.getElementById("loader").classList.add("done");
            onComplete();
          },
        });
      }
    }, 45);
  }


  /* ================================================================
     7. RESIZE HANDLER
     Debounced — recalculates all ScrollTrigger positions.
     ================================================================ */

  let resizeTimer;
  addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
  });


  /* ================================================================
     8. BOOT SEQUENCE
     Mobile menu toggle → Fetch data → Render → Loader → Init all.
     ================================================================ */

  // Mobile nav toggle
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("open");
    navMenu.classList.toggle("open");
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.classList.remove("open");
      navMenu.classList.remove("open");
    });
  });

  // Fetch data → render → animate
  fetch("portfolio-data.json", { cache: "no-cache" })
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then((data) => {
      window.__portfolioData = data;
      render(data);

      runLoader(() => {
        initCursor();
        initMagnetic();
        initParticles();
        initTilt();
        initThemeToggle();
        initAnimations();
        ScrollTrigger.refresh();
      });
    })
    .catch((error) => {
      document.getElementById("loader").innerHTML = `
        <div style="text-align:center; padding:40px; font-family:system-ui;">
          <h2>Failed to load data</h2>
          <p style="color:#a09889; margin-top:8px;">${error.message}</p>
          <p style="color:#5c5549; margin-top:12px;">
            Run: <code>python3 -m http.server</code>
          </p>
        </div>`;
    });
})();
