
// 1) Dark Mode / Light Mode

var themeButton = document.getElementById("theme-toggle-button");
var page = document.documentElement;

function changeTheme(theme) {
    if (theme === "dark") {
        page.classList.add("dark");
    } else {
        page.classList.remove("dark");
    }

    if (themeButton) {
        themeButton.setAttribute("aria-pressed", theme === "dark");
    }

    localStorage.setItem("theme", theme);
}

var savedTheme = localStorage.getItem("theme");

if (savedTheme === null) {
    savedTheme = "dark";
}

changeTheme(savedTheme);

if (themeButton) {
    themeButton.addEventListener("click", function () {
        if (page.classList.contains("dark")) {
            changeTheme("light");
        } else {
            changeTheme("dark");
        }
    });
}

// 2) Highlight the current section in the navbar

var navLinks = document.querySelectorAll(".nav-links a[href^='#']");

function updateNavbar() {
    var currentLink = null;

    for (var i = 0; i < navLinks.length; i++) {
        var sectionId = navLinks[i].getAttribute("href");
        var section = document.querySelector(sectionId);

        if (section && section.getBoundingClientRect().top <= 120) {
            currentLink = navLinks[i];
        }
    }

    if (window.innerHeight + window.scrollY >= page.scrollHeight - 4) {
        if (navLinks.length > 0) {
            currentLink = navLinks[navLinks.length - 1];
        }
    }

    for (var j = 0; j < navLinks.length; j++) {
        navLinks[j].classList.remove("active");
    }

    if (currentLink) {
        currentLink.classList.add("active");
    }
}

// 3) Scroll to top button

var scrollTopButton = document.getElementById("scroll-to-top");

function checkScrollButton() {
    if (!scrollTopButton) {
        return;
    }

    if (window.scrollY > 400) {
        scrollTopButton.classList.remove("opacity-0", "invisible");
        scrollTopButton.classList.add("opacity-100", "visible");
    } else {
        scrollTopButton.classList.add("opacity-0", "invisible");
        scrollTopButton.classList.remove("opacity-100", "visible");
    }
}

if (scrollTopButton) {
    scrollTopButton.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

window.addEventListener("scroll", function () {
    updateNavbar();
    checkScrollButton();
});

window.addEventListener("resize", updateNavbar);

updateNavbar();
checkScrollButton();

// 4) Portfolio filter buttons

var filterButtons = document.querySelectorAll(".portfolio-filter");
var portfolioItems = document.querySelectorAll(".portfolio-item");

function filterPortfolio(category) {
    for (var i = 0; i < filterButtons.length; i++) {
        var button = filterButtons[i];

        button.classList.remove(
            "active",
            "bg-linear-to-r",
            "from-primary",
            "to-secondary",
            "text-white",
            "hover:shadow-lg",
            "hover:shadow-primary/50",
            "border",
            "border-slate-300",
            "dark:border-slate-700",
            "bg-white",
            "dark:bg-slate-800",
            "text-slate-600",
            "dark:text-slate-300",
            "hover:bg-slate-100",
            "dark:hover:bg-slate-700"
        );

        if (button.getAttribute("data-filter") === category) {
            button.classList.add(
                "active",
                "bg-linear-to-r",
                "from-primary",
                "to-secondary",
                "text-white"
            );

            button.classList.add(
                "hover:shadow-lg",
                "hover:shadow-primary/50"
            );
        } else {
            button.classList.add(
                "bg-white",
                "dark:bg-slate-800",
                "text-slate-600",
                "dark:text-slate-300"
            );

            button.classList.add(
                "hover:bg-slate-100",
                "dark:hover:bg-slate-700",
                "border",
                "border-slate-300",
                "dark:border-slate-700"
            );
        }

        button.setAttribute(
            "aria-pressed",
            button.getAttribute("data-filter") === category
        );
    }

    for (var j = 0; j < portfolioItems.length; j++) {
        var itemCategory = portfolioItems[j].getAttribute("data-category");

        if (category === "all" || itemCategory === category) {
            portfolioItems[j].classList.remove("hidden");
        } else {
            portfolioItems[j].classList.add("hidden");
        }
    }
}

for (var i = 0; i < filterButtons.length; i++) {
    filterButtons[i].addEventListener("click", function () {
        filterPortfolio(this.getAttribute("data-filter"));
    });
}
// 5) Testimonials carousel

var carousel = document.getElementById("testimonials-carousel");
var previousButton = document.getElementById("prev-testimonial");
var nextButton = document.getElementById("next-testimonial");

var testimonialCards = [];
var dotsContainer = null;
var slideIndex = 0;
var cardsPerView = 1;
var carouselTimer = null;

if (carousel) {
    testimonialCards = carousel.querySelectorAll(".testimonial-card");

    var firstDot = document.querySelector(".carousel-indicator");

    if (firstDot) {
        dotsContainer = firstDot.parentElement;
    }
}

function getCardsPerView() {
    if (window.innerWidth >= 1024) {
        return 3;
    } else if (window.innerWidth >= 640) {
        return 2;
    }

    return 1;
}

function getLastSlide() {
    return Math.max(0, testimonialCards.length - cardsPerView);
}

function makeCarouselDots() {
    if (!dotsContainer) {
        return;
    }

    dotsContainer.innerHTML = "";

    var lastSlide = getLastSlide();

    for (var i = 0; i <= lastSlide; i++) {
        var dot = document.createElement("button");

        dot.type = "button";

        dot.className =
            "carousel-indicator w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 cursor-pointer";

        dot.setAttribute("aria-label", "التوصية " + (i + 1));
        dot.setAttribute("aria-pressed", "false");

        dot.addEventListener("click", function () {
            var allDots = dotsContainer.querySelectorAll(".carousel-indicator");

            for (var j = 0; j < allDots.length; j++) {
                if (allDots[j] === this) {
                    showSlide(j);
                    break;
                }
            }

            restartCarouselTimer();
        });

        dotsContainer.appendChild(dot);
    }
}

function showSlide(index) {
    if (!carousel || testimonialCards.length === 0) {
        return;
    }

    var lastSlide = getLastSlide();

    if (index > lastSlide) {
        slideIndex = 0;
    } else if (index < 0) {
        slideIndex = lastSlide;
    } else {
        slideIndex = index;
    }

    var direction = getComputedStyle(page).direction === "rtl" ? 1 : -1;

    carousel.style.transform =
        "translateX(" + direction * slideIndex * (100 / cardsPerView) + "%)";

    if (dotsContainer) {
        var dots = dotsContainer.querySelectorAll(".carousel-indicator");

        for (var i = 0; i < dots.length; i++) {
            dots[i].classList.remove("bg-accent");

            dots[i].classList.add(
                "bg-slate-400",
                "dark:bg-slate-600"
            );

            dots[i].setAttribute("aria-pressed", "false");

            if (i === slideIndex) {
                dots[i].classList.add("bg-accent");

                dots[i].classList.remove(
                    "bg-slate-400",
                    "dark:bg-slate-600"
                );

                dots[i].setAttribute("aria-pressed", "true");
            }
        }
    }
}

function stopCarouselTimer() {
    clearInterval(carouselTimer);
}

function startCarouselTimer() {
    stopCarouselTimer();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
    }

    carouselTimer = setInterval(function () {
        showSlide(slideIndex + 1);
    }, 5000);
}

function restartCarouselTimer() {
    stopCarouselTimer();
    startCarouselTimer();
}

if (carousel) {
    if (nextButton) {
        nextButton.addEventListener("click", function () {
            showSlide(slideIndex + 1);
            restartCarouselTimer();
        });
    }

    if (previousButton) {
        previousButton.addEventListener("click", function () {
            showSlide(slideIndex - 1);
            restartCarouselTimer();
        });
    }

    if (carousel.parentElement) {
        carousel.parentElement.addEventListener("mouseenter", stopCarouselTimer);
        carousel.parentElement.addEventListener("mouseleave", startCarouselTimer);
    }

    var touchStartX = 0;

    carousel.addEventListener("touchstart", function (event) {
        touchStartX = event.changedTouches[0].clientX;
        stopCarouselTimer();
    });

    carousel.addEventListener("touchend", function (event) {
        var difference = event.changedTouches[0].clientX - touchStartX;

        if (Math.abs(difference) > 50) {
            var isRTL = getComputedStyle(page).direction === "rtl";
            var shouldGoNext = isRTL ? difference > 0 : difference < 0;

            if (shouldGoNext) {
                showSlide(slideIndex + 1);
            } else {
                showSlide(slideIndex - 1);
            }
        }

        startCarouselTimer();
    });

    window.addEventListener("resize", function () {
        var newCardsPerView = getCardsPerView();

        if (newCardsPerView !== cardsPerView) {
            cardsPerView = newCardsPerView;
            makeCarouselDots();
        }

        if (slideIndex > getLastSlide()) {
            slideIndex = getLastSlide();
        }

        showSlide(slideIndex);
    });

    cardsPerView = getCardsPerView();

    makeCarouselDots();
    showSlide(0);
    startCarouselTimer();
}
// 6) Settings sidebar

var settingsButton = document.getElementById("settings-toggle");
var settingsSidebar = document.getElementById("settings-sidebar");
var closeSettingsButton = document.getElementById("close-settings");
var resetSettingsButton = document.getElementById("reset-settings");

function openSettings() {
    if (!settingsSidebar || !settingsButton) {
        return;
    }

    settingsSidebar.classList.remove("translate-x-full");

    settingsSidebar.setAttribute("aria-hidden", "false");
    settingsButton.setAttribute("aria-expanded", "true");

    settingsButton.style.transform =
        "translateY(-50%) translateX(-" + settingsSidebar.offsetWidth + "px)";
}

function closeSettings() {
    if (!settingsSidebar || !settingsButton) {
        return;
    }

    settingsSidebar.classList.add("translate-x-full");

    settingsSidebar.setAttribute("aria-hidden", "true");
    settingsButton.setAttribute("aria-expanded", "false");

    settingsButton.style.transform = "translateY(-50%)";
}

function settingsAreOpen() {
    return settingsSidebar &&
        !settingsSidebar.classList.contains("translate-x-full");
}

if (settingsButton) {
    settingsButton.addEventListener("click", function () {
        if (settingsAreOpen()) {
            closeSettings();
        } else {
            openSettings();
        }
    });
}

if (closeSettingsButton) {
    closeSettingsButton.addEventListener("click", closeSettings);
}

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && settingsAreOpen()) {
        closeSettings();
    }
});

document.addEventListener("click", function (event) {
    if (!settingsAreOpen()) {
        return;
    }

    if (
        !settingsSidebar.contains(event.target) &&
        !settingsButton.contains(event.target)
    ) {
        closeSettings();
    }
});

// 7) Change the page font

var fontButtons = document.querySelectorAll(".font-option");

var availableFonts = [
    "alexandria",
    "tajawal",
    "cairo"
];

function changeFont(fontName) {
    for (var i = 0; i < availableFonts.length; i++) {
        document.body.classList.remove("font-" + availableFonts[i]);
    }

    document.body.classList.add("font-" + fontName);

    for (var j = 0; j < fontButtons.length; j++) {
        fontButtons[j].classList.remove("active", "border-primary");

        fontButtons[j].setAttribute("aria-checked", "false");

        if (fontButtons[j].getAttribute("data-font") === fontName) {
            fontButtons[j].classList.add("active", "border-primary");

            fontButtons[j].setAttribute("aria-checked", "true");
        }
    }

    localStorage.setItem("font", fontName);
}

for (var i = 0; i < fontButtons.length; i++) {
    fontButtons[i].addEventListener("click", function () {
        changeFont(this.getAttribute("data-font"));
    });
}

var savedFont = localStorage.getItem("font");

if (availableFonts.indexOf(savedFont) === -1) {
    savedFont = "tajawal";
}

changeFont(savedFont);

// 8) Theme color choices

var colorsContainer = document.getElementById("theme-colors-grid");

var themeColors = [
    {
        name: "نيلي",
        primary: "#6366f1",
        secondary: "#8b5cf6",
        accent: "#a855f7"
    },
    {
        name: "زمردي",
        primary: "#10b981",
        secondary: "#14b8a6",
        accent: "#84cc16"
    },
    {
        name: "وردي",
        primary: "#f43f5e",
        secondary: "#ec4899",
        accent: "#f97316"
    },
    {
        name: "سماوي",
        primary: "#0ea5e9",
        secondary: "#3b82f6",
        accent: "#06b6d4"
    },
    {
        name: "كهرماني",
        primary: "#f59e0b",
        secondary: "#f97316",
        accent: "#ef4444"
    },
    {
        name: "بنفسجي",
        primary: "#8b5cf6",
        secondary: "#a855f7",
        accent: "#d946ef"
    },
    {
        name: "فيروزي",
        primary: "#14b8a6",
        secondary: "#0ea5e9",
        accent: "#6366f1"
    },
    {
        name: "أحمر",
        primary: "#ef4444",
        secondary: "#f97316",
        accent: "#f59e0b"
    }
];

function highlightColor(selectedIndex) {
    if (!colorsContainer) {
        return;
    }

    var colorButtons = colorsContainer.querySelectorAll("button");

    for (var i = 0; i < colorButtons.length; i++) {
        if (i === selectedIndex) {
            colorButtons[i].style.transform = "scale(1.1)";

            colorButtons[i].style.boxShadow =
                "0 0 0 3px " + themeColors[i].primary + "66";

            colorButtons[i].firstElementChild.style.opacity = "1";

            colorButtons[i].setAttribute("aria-pressed", "true");
        } else {
            colorButtons[i].style.transform = "";
            colorButtons[i].style.boxShadow = "none";

            colorButtons[i].firstElementChild.style.opacity = "0";

            colorButtons[i].setAttribute("aria-pressed", "false");
        }
    }
}

function changeColor(index) {
    if (!themeColors[index]) {
        return;
    }

    var selectedColor = themeColors[index];

    page.style.setProperty("--color-primary", selectedColor.primary);
    page.style.setProperty("--color-secondary", selectedColor.secondary);
    page.style.setProperty("--color-accent", selectedColor.accent);

    highlightColor(index);

    localStorage.setItem("color", index);
}

if (colorsContainer) {
    for (var i = 0; i < themeColors.length; i++) {
        var colorButton = document.createElement("button");

        colorButton.type = "button";
        colorButton.title = themeColors[i].name;

        colorButton.setAttribute(
            "aria-label",
            "لون " + themeColors[i].name
        );

        colorButton.style.cssText =
            "aspect-ratio:1/1;border-radius:9999px;border:0;cursor:pointer;color:#fff;display:flex;align-items:center;justify-content:center;transition:all .2s;background:linear-gradient(135deg," +
            themeColors[i].primary + "," +
            themeColors[i].secondary + ")";

        colorButton.innerHTML =
            '<i class="fa-solid fa-check" aria-hidden="true" style="opacity:0"></i>';

        colorButton.addEventListener("click", function () {
            var buttons = colorsContainer.querySelectorAll("button");

            for (var j = 0; j < buttons.length; j++) {
                if (buttons[j] === this) {
                    changeColor(j);
                    break;
                }
            }
        });

        colorsContainer.appendChild(colorButton);
    }
}
// 9) Reset settings to the default values

if (resetSettingsButton) {
    resetSettingsButton.addEventListener("click", function () {
        localStorage.removeItem("theme");
        localStorage.removeItem("font");
        localStorage.removeItem("color");

        changeTheme("dark");
        changeFont("tajawal");

        page.style.removeProperty("--color-primary");
        page.style.removeProperty("--color-secondary");
        page.style.removeProperty("--color-accent");

        highlightColor(0);
    });
}

var savedColor = localStorage.getItem("color");

if (savedColor !== null && themeColors[Number(savedColor)]) {
    changeColor(Number(savedColor));
} else {
    highlightColor(0);
}

// 10) Custom select menus in the contact form

var customSelects = document.querySelectorAll(".custom-select");

for (var i = 0; i < customSelects.length; i++) {

    (function (select) {

        var wrapper = select.closest(".custom-select-wrapper");

        if (!wrapper) {
            return;
        }

        var optionsList = wrapper.querySelector(".custom-options");
        var selectedText = select.querySelector(".selected-text");
        var arrow = select.querySelector("i");

        if (!optionsList || !selectedText) {
            return;
        }

        function toggleOptions(showOptions) {
            if (showOptions) {
                optionsList.classList.remove("hidden");
            } else {
                optionsList.classList.add("hidden");
            }

            select.setAttribute("aria-expanded", showOptions);

            if (arrow) {
                arrow.style.transform = showOptions ? "rotate(180deg)" : "";
            }
        }

        select.addEventListener("click", function () {
            toggleOptions(optionsList.classList.contains("hidden"));
        });

        select.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();

                toggleOptions(optionsList.classList.contains("hidden"));
            }

            if (event.key === "Escape") {
                toggleOptions(false);
            }
        });

        var options = optionsList.querySelectorAll(".custom-option");

        for (var j = 0; j < options.length; j++) {
            options[j].addEventListener("click", function () {
                selectedText.textContent = this.textContent.trim();

                select.setAttribute(
                    "data-value",
                    this.getAttribute("data-value")
                );

                toggleOptions(false);
            });
        }

        document.addEventListener("click", function (event) {
            if (!wrapper.contains(event.target)) {
                toggleOptions(false);
            }
        });

    })(customSelects[i]);
}