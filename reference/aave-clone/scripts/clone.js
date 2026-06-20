(() => {
  const q = (selector, root = document) => root.querySelector(selector);
  const qa = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function setupDesktopMenus() {
    const nav = q(".styles_nav__UhczD");
    if (!nav) return;

    const buttons = qa(".styles_navMenuButton__yu3IQ", nav);
    const floating = q(".styles_menuWrapper__BGdua", nav)?.parentElement;
    const wrapper = q(".styles_menuWrapper__BGdua", nav);
    const menu = q(".styles_menu__JjoKB", nav);
    const panes = menu ? qa(':scope > div[style*="position:absolute"]', menu) : [];
    const arrow = q(".styles_menuArrow__iV5Gh", nav);

    if (!buttons.length || !floating || !wrapper || !menu || !panes.length) return;

    const sizes = [
      { width: 296, height: 272, shift: -160 },
      { width: 326, height: 336, shift: -156 },
      { width: 364, height: 272, shift: -150 },
      { width: 304, height: 144, shift: -136 }
    ];

    let closeTimer = 0;

    function setPane(index) {
      const size = sizes[index] || sizes[0];
      floating.classList.add("clone-menu-open");
      floating.style.top = "38px";
      floating.style.opacity = "1";
      floating.style.pointerEvents = "auto";
      floating.style.transform = "translateY(0)";
      wrapper.style.transform = `translateX(${size.shift}px)`;
      menu.style.width = `${size.width}px`;
      menu.style.height = `${size.height}px`;
      if (arrow) {
        arrow.style.opacity = "1";
        arrow.style.transform = `translate(${buttons[index].offsetLeft + buttons[index].offsetWidth / 2 - 14}px, 0)`;
      }

      panes.forEach((pane, paneIndex) => {
        const inner = pane.firstElementChild;
        pane.style.pointerEvents = paneIndex === index ? "auto" : "none";
        if (inner) {
          inner.classList.toggle("clone-menu-pane-open", paneIndex === index);
          inner.classList.toggle("clone-menu-pane-closed", paneIndex !== index);
        }
      });
    }

    function closePane() {
      floating.classList.remove("clone-menu-open");
      floating.style.opacity = "0";
      floating.style.pointerEvents = "none";
      floating.style.transform = "translateY(-10px)";
      if (arrow) {
        arrow.style.opacity = "0";
        arrow.style.transform = "translateY(-10px)";
      }
      panes.forEach((pane) => {
        pane.style.pointerEvents = "none";
        pane.firstElementChild?.classList.remove("clone-menu-pane-open");
      });
    }

    buttons.forEach((button, index) => {
      button.addEventListener("mouseenter", () => {
        window.clearTimeout(closeTimer);
        setPane(index);
      });
      button.addEventListener("focus", () => setPane(index));
      button.addEventListener("click", () => setPane(index));
    });

    nav.addEventListener("mouseleave", () => {
      closeTimer = window.setTimeout(closePane, 140);
    });
    nav.addEventListener("mouseenter", () => window.clearTimeout(closeTimer));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closePane();
    });
  }

  function setupMobileMenu() {
    const button = q(".styles_hamburgerButton__Z_2zQ");
    const menu = q(".styles_container__CV4xN");
    if (!button || !menu) return;

    button.removeAttribute("aria-hidden");
    button.setAttribute("aria-label", "Open menu");
    button.addEventListener("click", () => {
      const open = button.getAttribute("data-open") !== "true";
      button.setAttribute("data-open", String(open));
      button.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      menu.setAttribute("data-open", String(open));
      menu.setAttribute("aria-hidden", String(!open));
      document.body.style.overflow = open ? "hidden" : "";
    });
  }

  function setupFaq() {
    qa(".styles_collapsible__aqKSz").forEach((item) => {
      const button = q(".styles_collapsibleButton__MlK3f", item);
      const wrapper = q(".styles_collapsibleContentWrapper__gWHrn", item);
      const content = q(".styles_collapsibleContent__g9P4z", item);
      const vertical = q(".styles_collapsibleIcon__WuJte path:nth-of-type(2)", item);
      if (!button || !wrapper || !content) return;

      button.setAttribute("aria-expanded", "false");
      button.addEventListener("click", () => {
        const open = button.getAttribute("aria-expanded") !== "true";
        button.setAttribute("aria-expanded", String(open));
        wrapper.style.height = open ? `${content.scrollHeight}px` : "0px";
        content.style.opacity = open ? "1" : "0";
        if (vertical) {
          vertical.style.transform = open ? "scaleY(0)" : "none";
        }
      });
    });
  }

  function setupNewsletter() {
    const formArea = q(".styles_newsletter__Q_ryO");
    if (!formArea) return;

    const input = q("input", formArea);
    const button = q("button", formArea);
    const dot = q(".styles_dot__q9sFn", formArea);
    const status = q(".styles_status__waBZd", formArea) || document.createElement("span");

    if (!input || !button) return;

    status.classList.add("clone-status");
    if (!status.parentElement) {
      q(".styles_label__SdZuI", formArea)?.append(status);
    }

    button.addEventListener("click", (event) => {
      event.preventDefault();
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
      if (dot) dot.setAttribute("data-error", String(!valid));
      status.textContent = valid ? "Signed up" : "Enter a valid email";
      status.classList.toggle("styles_success__fUMYt", valid);
      status.classList.toggle("styles_error__sTBED", !valid);
    });
  }

  function setupDownloadFeedback() {
    const button = qa("button").find((candidate) => candidate.textContent.trim() === "Download on iOS");
    if (!button) return;

    const toast = document.createElement("div");
    toast.className = "clone-download-feedback";
    toast.textContent = "Download link unavailable on desktop, matching the live page behavior.";
    toast.setAttribute("data-show", "false");
    document.body.append(toast);

    let timer = 0;
    button.addEventListener("click", () => {
      window.clearTimeout(timer);
      toast.setAttribute("data-show", "true");
      timer = window.setTimeout(() => toast.setAttribute("data-show", "false"), 2200);
    });
  }

  setupDesktopMenus();
  setupMobileMenu();
  setupFaq();
  setupNewsletter();
  setupDownloadFeedback();
})();
