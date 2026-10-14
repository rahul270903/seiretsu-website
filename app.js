// app.js
(() => {
  // Mega Menu Interactions
  const megaBtn = document.getElementById("mega-trigger");
  const megaMenu = document.getElementById("mm-products");

  const toggleMega = (open) => {
    if (!megaMenu || !megaBtn) return;
    megaMenu.hidden = !open;
    megaBtn.setAttribute("aria-expanded", String(open));
  };

  if (megaBtn && megaMenu) {
    megaBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleMega(megaMenu.hidden);
    });

    megaMenu.addEventListener("click", (e) => {
      if (e.target.closest("a")) toggleMega(false);
    });

    document.addEventListener("click", (e) => {
      if (!megaMenu.hidden && !megaMenu.contains(e.target)) {
        toggleMega(false);
      }
    });
  }

  // Mobile Drawer Navigation
  const burgerBtn = document.querySelector(".burger");
  const mobileNav = document.getElementById("mobile-nav");

  const toggleMobileNav = (open) => {
    if (!mobileNav || !burgerBtn) return;
    mobileNav.hidden = !open;
    burgerBtn.setAttribute("aria-expanded", String(open));
  };

  if (burgerBtn && mobileNav) {
    burgerBtn.addEventListener("click", () => {
      toggleMobileNav(mobileNav.hidden);
    });

    mobileNav.addEventListener("click", (e) => {
      if (e.target.closest("a")) toggleMobileNav(false);
    });
  }

  // Global Escape Key Listener
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      toggleMega(false);
      toggleMobileNav(false);
    }
  });

  // Carousel Controller
  const track = document.getElementById("stories-track");
  const prevBtn = document.querySelector("[data-prev]");
  const nextBtn = document.querySelector("[data-next]");

  if (track && prevBtn && nextBtn) {
    const getScrollStep = () => {
      const card = track.querySelector(".story");
      return card ? card.offsetWidth + 22 : 320;
    };

    nextBtn.addEventListener("click", () => {
      track.scrollBy({ left: getScrollStep(), behavior: "smooth" });
    });

    prevBtn.addEventListener("click", () => {
      track.scrollBy({ left: -getScrollStep(), behavior: "smooth" });
    });
  }

  // Platform Tabs Controller
  const platformTabs = [...document.querySelectorAll('.ptabs [role="tab"]')];

  const switchTab = (targetTab, setFocus = false) => {
    platformTabs.forEach((tab) => {
      const isSelected = tab === targetTab;
      tab.setAttribute("aria-selected", String(isSelected));
      tab.classList.toggle("is-active", isSelected);
      tab.tabIndex = isSelected ? 0 : -1;

      const targetPanel = document.getElementById(
        tab.getAttribute("aria-controls"),
      );
      if (targetPanel) {
        targetPanel.hidden = !isSelected;
      }
    });

    if (setFocus) {
      targetTab.focus();
    }
  };

  platformTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => switchTab(tab));

    tab.addEventListener("keydown", (e) => {
      let nextIndex = null;

      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        nextIndex = (index + 1) % platformTabs.length;
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        nextIndex = (index - 1 + platformTabs.length) % platformTabs.length;
      } else if (e.key === "Home") {
        nextIndex = 0;
      } else if (e.key === "End") {
        nextIndex = platformTabs.length - 1;
      }

      if (nextIndex !== null) {
        e.preventDefault();
        switchTab(platformTabs[nextIndex], true);
      }
    });
  });
  // Nikolai AI Terminal Logic
  const answers = [
    [
      /hospital|health|clinic|mri|biomedical|clinical/i,
      "For healthcare networks, Trestara AiiA Clinical CMMS manages biomedical devices, safety recalls, and inspection readiness. Automated field dispatch routes certified technicians, Thorium EHS governs worker safety, and Cyberdyne verifies zero-trust access.",
    ],
    [
      /erp|finance|accounting|procure|veloris|radium|north|xosia|nexavion|saigen/i,
      "Seiretsu AI ERP integrates VELORIS, the newly added Radium platform, North operations (formerly XOSIA), Nexavion, and SAIGEN. Together they manage multi-entity financial ledgers, autonomous procurement, and predictive supply chain logistics.",
    ],
    [
      /gov|agency|public|federal|state|cloud|poseidon/i,
      "Yes. Seiretsu GovCloud includes Poseidon (a sovereign, compliant government cloud platform) and SAIRAA Plus for AI workflows, governed by Cyberdyne identity privileges and Ixiono tamper-evident audit ledgers.",
    ],
    [
      /5g|fiber|mno|mvne|carrier|telecom|wireless|network/i,
      "Seiretsu connectivity covers Seiretsu 5G Wireless, the Fiber Partner Program, and turnkey carrier MNO/MVNE services powered by Infinion, Omnixa, and Qimonda.",
    ],
    [
      /crm|customer|sales|aria/i,
      "ARIA CRM provides predictive customer intelligence natively connected to ERP, billing, and support so enterprise sales and field service share the same single source of truth.",
    ],
    [
      /small|smb|startup|shop|pos|paige|marivia/i,
      "For small and midsize businesses, Paige offers comprehensive all-in-one operations management while Marivia provides modern retail and point-of-sale tools.",
    ],
    [
      /safety|ehs|risk|worker|injury|thorium/i,
      "Thorium AiiA EHS oversees hazard identification, environmental compliance, safety incident reporting, and workers' compensation return-to-work tracking.",
    ],
    [
      /academy|train|learn|certif|course/i,
      "Seiretsu Academy delivers multi-tier curriculum and hands-on certification across ERP, AI, and connectivity for customers, systems integrators, and software teams. Learn, build, and grow.",
    ],
    [
      /security|identity|access|iga|cyberdyne|blockchain|ixiono|vanguard/i,
      "VanguardShield delivers proactive AI threat detection, Cyberdyne strictly governs user and autonomous agent permissions, and Ixiono anchors critical transactional events to a verifiable cryptographic ledger.",
    ],
  ];

  const defaultReply =
    "Seiretsu unifies AI ERP, autonomous agents, asset operations, EHS, GovCloud, zero-trust identity, and private 5G connectivity into one architecture. Specify your industry or requirement to explore relevant solutions, or submit an inquiry in the form below.";

  const chatLog = document.getElementById("chat-log");
  const askForm = document.getElementById("ask-form");
  const askInput = document.getElementById("ask-input");

  const appendMsg = (typeClass, text) => {
    if (!chatLog) return null;
    const msg = document.createElement("div");
    msg.className = `msg ${typeClass}`;
    msg.textContent = text;
    chatLog.appendChild(msg);
    chatLog.scrollTop = chatLog.scrollHeight;
    return msg;
  };

  const handlePrompt = (query) => {
    const q = query.trim();
    if (!q) return;

    appendMsg("msg--me", q);
    const thinkingMsg = appendMsg(
      "msg--ai",
      "Analyzing Seiretsu ecosystem data...",
    );

    const match = answers.find(([regex]) => regex.test(q));

    setTimeout(() => {
      if (thinkingMsg) {
        thinkingMsg.textContent = match ? match[1] : defaultReply;
        chatLog.scrollTop = chatLog.scrollHeight;
      }
    }, 450);
  };

  if (askForm && askInput) {
    askForm.addEventListener("submit", (e) => {
      e.preventDefault();
      handlePrompt(askInput.value);
      askInput.value = "";
    });
  }

  document.querySelectorAll(".chip-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const query = btn.getAttribute("data-query");
      if (query) handlePrompt(query);
    });
  });

  // Lead Contact Form Handling
  const leadForm = document.getElementById("lead-form");
  const feedbackEl = document.getElementById("form-feedback");

  if (leadForm) {
    leadForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const nameInput = document.getElementById("c-name");
      const companyInput = document.getElementById("c-company");
      const emailInput = document.getElementById("c-email");

      const errName = document.getElementById("err-name");
      const errCompany = document.getElementById("err-company");
      const errEmail = document.getElementById("err-email");

      // Clear previous error hints
      [nameInput, companyInput, emailInput].forEach((el) =>
        el.classList.remove("has-error"),
      );
      errName.textContent = "";
      errCompany.textContent = "";
      errEmail.textContent = "";
      feedbackEl.textContent = "";
      feedbackEl.className = "form-feedback";

      let isValid = true;

      if (!nameInput.value.trim()) {
        nameInput.classList.add("has-error");
        errName.textContent = "Please enter your full name.";
        isValid = false;
      }

      if (!companyInput.value.trim()) {
        companyInput.classList.add("has-error");
        errCompany.textContent = "Please provide your organization name.";
        isValid = false;
      }

      const emailVal = emailInput.value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailVal) {
        emailInput.classList.add("has-error");
        errEmail.textContent = "Work email is required.";
        isValid = false;
      } else if (!emailPattern.test(emailVal)) {
        emailInput.classList.add("has-error");
        errEmail.textContent = "Please enter a valid work email address.";
        isValid = false;
      }

      if (!isValid) return;

      const submitBtn = document.getElementById("btn-submit");
      submitBtn.disabled = true;
      submitBtn.querySelector("span").textContent = "Transmitting inquiry...";

      // Simulate API submission
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.querySelector("span").textContent =
          "Submit Enterprise Inquiry";
        feedbackEl.classList.add("is-success");
        feedbackEl.textContent =
          "Inquiry received. A Seiretsu enterprise architecture specialist will contact you shortly.";
        leadForm.reset();
      }, 750);
    });
  }

  // Smooth Back-to-Top Button
  const toTopBtn = document.getElementById("totop-btn");
  if (toTopBtn) {
    toTopBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Legal / Compliance Modals Controller
  const modalBackdrop = document.getElementById("modal-backdrop");
  const modalTitle = document.getElementById("modal-title");
  const modalBody = document.getElementById("modal-body-content");
  const modalCloseBtn = document.getElementById("modal-close-btn");

  const modalContents = {
    "modal-privacy": {
      title: "Seiretsu Privacy Policy",
      content: `
        <p>Seiretsu Group complies with global enterprise privacy standards including GDPR, CCPA/CPRA, and sovereign data laws.</p>
        <h4>Telemetry & Data Governance</h4>
        <p>Client operational data processed across VELORIS, ARIA, and Trestara remains strictly sovereign. Autonomous AI models are never trained across tenant boundaries.</p>
        <h4>Contact & Inquiries</h4>
        <p>For data privacy requests or DPO contact, reach out to <strong>privacy@seiretsu.co</strong>.</p>
      `,
    },
    "modal-terms": {
      title: "Enterprise Terms of Use",
      content: `
        <p>Access to Seiretsu GovCloud, 5G Wireless services, and enterprise software suites is governed by formal Master Services Agreements (MSA) and Service Level Agreements (SLA).</p>
        <h4>System Availability & SLAs</h4>
        <p>Mission-critical deployments are delivered with high-availability 99.99% uptime guarantees backed by regional failover clusters.</p>
      `,
    },
    "modal-accessibility": {
      title: "Accessibility Statement",
      content: `
        <p>Seiretsu is committed to digital accessibility and complies with WCAG 2.1 Level AA recommendations and Section 508 federal guidelines across all web properties and desktop portals.</p>
        <p>For accessibility accommodations, contact <strong>accessibility@seiretsu.co</strong>.</p>
      `,
    },
    "modal-cookies": {
      title: "Cookie & Tracking Preferences",
      content: `
        <p>We use strictly necessary cookies to ensure system stability, session authentication, and zero-trust security checks across the Seiretsu platform.</p>
        <p>Telemetry preferences can be scoped at the organizational administrator level in your Cyberdyne IGA dashboard.</p>
      `,
    },
  };

  const openModal = (key) => {
    const data = modalContents[key];
    if (!data || !modalBackdrop) return;
    modalTitle.textContent = data.title;
    modalBody.innerHTML = data.content;
    modalBackdrop.hidden = false;
  };

  const closeModal = () => {
    if (modalBackdrop) modalBackdrop.hidden = true;
  };

  document.querySelectorAll(".f-modal-trigger").forEach((btn) => {
    btn.addEventListener("click", () =>
      openModal(btn.getAttribute("data-modal")),
    );
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeModal);

  if (modalBackdrop) {
    modalBackdrop.addEventListener("click", (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalBackdrop && !modalBackdrop.hidden) {
      closeModal();
    }
  });

  // Brand Logo Scroll-to-Top Handler
  const brandLogo = document.querySelector(".header .brand");
  if (brandLogo) {
    brandLogo.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      history.replaceState(null, "", window.location.pathname);
    });
  }
})();
