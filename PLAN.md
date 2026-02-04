# SMRs Website Refactoring Plan

## Executive Summary

**Goal:** Refactor the SMRs static website from 24+ HTML files down to 5-6 HTML files using a tabbed architecture with inline content sections. This approach maintains simplicity, works on GitHub Pages without build tools, and prepares the structure for future hexagonal UI enhancements.

**Reduction:** 24 files → 5 files (80% reduction)

**Approach:** Option B - HTML with inline content sections and CSS/JavaScript-based tabs

---

## Existing CSS Classes Reference

Before creating new CSS, note that `assets/style/style.css` already contains many useful classes:

### Color Variables (use these in new CSS)
```css
--color-dark: #231f20
--color-bg: #ffc061
--color-primary: #ffe373
--color-secondary: #abe26a
--color-accent: #f4eb29
--color-hover: #b9ed7d
```

### Pre-existing Utility Classes
- `.font-roca-bold` - Sets font-weight: 1000
- `.nav-btn` - Pre-styled back/navigation button (yellow bg, green border, rounded, hover effects)
- `.btn-hover` - Generic button hover effect (translateY + brightness)
- `.glow-btn` - Landing page buttons with drop-shadow glow effects
- `.glass-card` - Semi-transparent card with backdrop blur and left border
- `.type-card` - Card with border, backdrop blur, and shadow effects
- `.content-card` - Solid card with thick border (10px)
- `.section-title` - Section heading style with bottom border
- `.hexagon-shape` - Hexagonal clip-path shape
- `.hex-wrapper` - Container with glow drop-shadow effects
- `.hive-container` - Flexbox container for hexagon layouts
- `.rounded-table-container` - Styled table wrapper with rounded borders
- `.tech-table` - Technical specification table styles
- `.explore-link` - Call-to-action link button

### Important Notes
1. **Font:** The custom font is `'Roca Two'` (NOT 'roca-bold')
2. **Font Weight:** Use `font-weight: 1000` or the `.font-roca-bold` class
3. **Back Buttons:** Use `.nav-btn` class instead of custom Tailwind classes
4. **Glow Effects:** Drop-shadow patterns using `var(--color-accent)` are already defined in `.glow-btn` and `.hex-wrapper`

---

## Current State Analysis

### Existing Structure (Old files/)
```
index.html                    # Landing page with navigation
introduction.html             # Introduction page (standalone)
manufacturing.html            # Hub page linking to 5 sub-pages
├── m1_fuel.html             # Reactor Core & Fuel
├── m2_rpv.html              # Reactor Pressure Vessel
├── m3_rods.html             # Control Rods
├── m4_steam.html            # Steam Generators
└── m5_ic.html               # I&C Systems
operating_smrs.html          # Operating SMRs (standalone)
types.html                   # Hub page linking to 4 types + 4 neutron spectrum pages
├── water-cooled.html        # Water-Cooled SMRs
├── gas-cooled.html          # Gas-Cooled SMRs
├── liquid-metal.html        # Liquid Metal SMRs
├── molten-salt.html         # Molten Salt SMRs
├── type_water.html          # Water (neutron spectrum view)
├── type_htgr.html           # HTGR (neutron spectrum view)
├── type_salt.html           # Salt (neutron spectrum view)
└── type_fast.html           # Fast (neutron spectrum view)
nuscale.html                 # Case study 1
htr-pm.html                  # Case study 2
o1_licensing.html            # Licensing & Commissioning
o2_startup.html              # Startup & Power Ascension
o3_normal.html               # Normal Operation
o4_safety.html               # Safety Systems
o5_removal.html              # Decommissioning
05_removal.html              # Duplicate of o5_removal.html
```

### Design Elements
- **Framework:** TailwindCSS (CDN)
- **Custom CSS:** `../assets/style/style.css` and `../assets/style/mobile.css`
- **Color Scheme (CSS Variables):**
  - `--color-dark: #231f20` (text/dark backgrounds)
  - `--color-bg: #ffc061` (page background)
  - `--color-primary: #ffe373` (primary yellow)
  - `--color-secondary: #abe26a` (secondary green)
  - `--color-accent: #f4eb29` (accent yellow for glow effects)
  - `--color-hover: #b9ed7d` (hover state green)
- **Typography:** 
  - Custom font: `'Roca Two'` (loaded via @font-face)
  - Font weight: `1000` for bold text (using `.font-roca-bold` class or directly)
- **UI Elements:** 
  - Hexagonal buttons with glow effects (`.hexagon-shape`, `.hex-wrapper`)
  - Rounded cards (`.content-card`, `.glass-card`, `.type-card`)
  - Glow buttons with drop-shadow effects (`.glow-btn`)
  - Navigation buttons (`.nav-btn`, `.btn-hover`)
- **Navigation:** Back buttons with rounded pill style using `.nav-btn` class
- **Tables:** Rounded table containers (`.rounded-table-container`, `.tech-table`)
- **Effects:** Drop-shadow glow effects using `var(--color-accent)` for hover states

---

## Target Structure

### New File Organization
```
/
├── index.html                    # Landing/home page (unchanged)
├── pages/
│   ├── introduction.html         # Introduction (standalone, minimal changes)
│   ├── manufacturing.html        # NEW: 5 manufacturing sections as tabs
│   ├── operation.html            # NEW: 5 operation sections as tabs
│   ├── types.html                # NEW: 4 coolant types + 4 neutron spectra as tabs
│   └── case-studies.html         # NEW: NuScale & HTR-PM as tabs
├── css/
│   ├── tabs.css                  # NEW: Tab system styles
│   └── hexagon-tabs.css          # NEW: Hexagonal tab button styles
├── js/
│   ├── tabs.js                   # NEW: Tab switching logic
│   └── navigation.js             # NEW: Enhanced navigation utilities
├── assets/
│   ├── images/                   # (existing)
│   ├── pdfs/                     # (existing)
│   └── style/
│       ├── style.css             # (existing, may need minor updates)
│       └── mobile.css            # (existing)
└── Old files/                    # (keep for reference during migration)
```

---

## Detailed Implementation Steps

### Phase 1: Create New Directory Structure

1. **Create directories:**
   ```bash
   mkdir -p pages
   mkdir -p css
   mkdir -p js
   ```

2. **Copy index.html to root** (if not already there)
   - No changes needed to `index.html` initially
   - Will update navigation links in Phase 3

---

### Phase 2: Create Core CSS and JavaScript Files

#### File: `css/tabs.css`

**Purpose:** Styles for tab navigation and content panes

**Content:**
```css
/* Tab Container */
.tab-container {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
}

/* Tab Navigation */
.tab-nav {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    justify-content: center;
    margin-bottom: 40px;
    padding: 0 20px;
}

.tab-btn {
    background: var(--color-primary);
    border: 8px solid var(--color-secondary);
    border-radius: 2rem;
    padding: 16px 32px;
    font-family: 'Roca Two', serif;
    font-weight: 1000;
    text-transform: uppercase;
    color: var(--color-dark);
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.tab-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    filter: brightness(1.05);
}

.tab-btn.active {
    background: var(--color-dark);
    color: var(--color-primary);
    border-color: var(--color-dark);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.tab-btn:focus {
    outline: 3px solid var(--color-secondary);
    outline-offset: 2px;
}

/* Tab Content Panes */
.tab-content {
    position: relative;
    min-height: 400px;
}

.tab-pane {
    display: none;
    animation: fadeIn 0.4s ease-in-out;
}

.tab-pane.active {
    display: block;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Responsive Design */
@media (max-width: 768px) {
    .tab-btn {
        padding: 12px 24px;
        font-size: 0.875rem;
        border-width: 6px;
    }
    
    .tab-nav {
        gap: 8px;
    }
}

@media (max-width: 480px) {
    .tab-btn {
        padding: 10px 20px;
        font-size: 0.75rem;
        border-width: 4px;
    }
}
```

**Note:** This CSS uses the existing CSS variables defined in `assets/style/style.css`:
- `var(--color-primary)` = `#ffe373` (yellow)
- `var(--color-secondary)` = `#abe26a` (green)
- `var(--color-dark)` = `#231f20` (dark text)
- Font family: `'Roca Two', serif` with `font-weight: 1000`

---

#### File: `css/hexagon-tabs.css`

**Purpose:** Hexagonal tab button styles (for future UI enhancement)

**Content:**
```css
/* Hexagonal Tab Navigation - Enhanced version for future use */
.hex-tab-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
    margin-bottom: 50px;
    padding: 20px;
}

.hex-tab {
    position: relative;
    width: 140px;
    height: 160px;
    background: var(--color-primary);
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    filter: drop-shadow(0px 0px 0px var(--color-accent))
            drop-shadow(5px 5px 0px var(--color-accent))
            drop-shadow(-5px -5px 0px var(--color-accent))
            drop-shadow(5px -5px 0px var(--color-accent))
            drop-shadow(-5px 5px 0px var(--color-accent));
}

.hex-tab:hover {
    transform: scale(1.1);
    filter: drop-shadow(0px 0px 20px var(--color-accent));
    background-color: var(--color-hover);
}

.hex-tab.active {
    background: var(--color-dark);
    color: var(--color-primary);
    filter: drop-shadow(0px 0px 25px var(--color-secondary));
}

.hex-tab span {
    font-family: 'Roca Two', serif;
    font-weight: 1000;
    text-transform: uppercase;
    color: var(--color-dark);
    text-align: center;
    font-size: 0.875rem;
    line-height: 1.3;
    z-index: 1;
}

.hex-tab.active span {
    color: var(--color-primary);
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .hex-tab {
        width: 110px;
        height: 130px;
    }
    
    .hex-tab span {
        font-size: 0.75rem;
    }
}

/* Note: This is for future use. Initially use .tab-nav with .tab-btn */
/* This style matches the existing hexagon design system with glow effects */
```

---

#### File: `js/tabs.js`

**Purpose:** Tab switching functionality with URL hash support

**Content:**
```javascript
/**
 * Tab System for SMRs Website
 * Handles tab switching, URL hash navigation, and keyboard accessibility
 */

document.addEventListener('DOMContentLoaded', () => {
    initializeTabs();
});

function initializeTabs() {
    const tabButtons = document.querySelectorAll('[data-tab]');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    if (tabButtons.length === 0 || tabPanes.length === 0) {
        console.warn('No tabs found on this page');
        return;
    }

    // Add click event listeners to all tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            switchTab(button.dataset.tab);
        });
        
        // Keyboard accessibility
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                switchTab(button.dataset.tab);
            }
        });
    });

    // Handle URL hash on page load
    if (window.location.hash) {
        const targetTab = window.location.hash.slice(1);
        if (document.getElementById(targetTab)) {
            switchTab(targetTab);
        } else {
            // If hash doesn't match a tab, show first tab
            showFirstTab();
        }
    } else {
        // No hash, show first tab
        showFirstTab();
    }

    // Handle browser back/forward buttons
    window.addEventListener('hashchange', () => {
        if (window.location.hash) {
            const targetTab = window.location.hash.slice(1);
            if (document.getElementById(targetTab)) {
                switchTab(targetTab, false); // false = don't update hash (already changed)
            }
        }
    });
}

function switchTab(tabId, updateHash = true) {
    const tabButtons = document.querySelectorAll('[data-tab]');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    // Remove active class from all tabs and panes
    tabButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
    });
    
    tabPanes.forEach(pane => {
        pane.classList.remove('active');
    });
    
    // Add active class to selected tab and pane
    const selectedButton = document.querySelector(`[data-tab="${tabId}"]`);
    const selectedPane = document.getElementById(tabId);
    
    if (selectedButton && selectedPane) {
        selectedButton.classList.add('active');
        selectedButton.setAttribute('aria-selected', 'true');
        selectedPane.classList.add('active');
        
        // Update URL hash
        if (updateHash) {
            history.pushState(null, '', `#${tabId}`);
        }
        
        // Scroll to top of content
        selectedPane.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function showFirstTab() {
    const firstButton = document.querySelector('[data-tab]');
    if (firstButton) {
        switchTab(firstButton.dataset.tab);
    }
}
```

---

#### File: `js/navigation.js`

**Purpose:** Enhanced navigation utilities (optional, for future use)

**Content:**
```javascript
/**
 * Navigation utilities for SMRs Website
 */

// Smooth scroll to anchor links
document.addEventListener('DOMContentLoaded', () => {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});

// Add active state to current page in navigation
function highlightCurrentPage() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('nav a, .main-nav a');
    
    navLinks.forEach(link => {
        if (link.pathname === currentPath) {
            link.classList.add('active-page');
        }
    });
}

// Call on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', highlightCurrentPage);
} else {
    highlightCurrentPage();
}
```

---

### Phase 3: Create Consolidated HTML Pages

---

#### File: `pages/manufacturing.html`

**Purpose:** Consolidates m1_fuel.html, m2_rpv.html, m3_rods.html, m4_steam.html, m5_ic.html

**Structure:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SMRs - Manufacturing Process</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="../assets/style/style.css">
    <link rel="stylesheet" href="../assets/style/mobile.css">
    <link rel="stylesheet" href="../css/tabs.css">
</head>
<body class="min-h-screen p-6 md:p-10 flex flex-col items-center">

    <!-- Back Button -->
    <div class="w-full max-w-7xl flex justify-start mb-8">
        <a href="../index.html" class="nav-btn">
            ← Back Home
        </a>
    </div>

    <!-- Page Header -->
    <div class="text-center mb-12">
        <h1 class="text-5xl md:text-7xl font-roca-bold text-[#231f20] tracking-tighter uppercase">Manufacturing</h1>
        <p class="text-xl md:text-2xl font-roca-bold text-[#231f20] mt-4 tracking-widest uppercase opacity-80">Factory Fabrication Process</p>
    </div>

    <!-- Tab Container -->
    <div class="tab-container">
        
        <!-- Tab Navigation -->
        <nav class="tab-nav" role="tablist">
            <button class="tab-btn" data-tab="fuel" role="tab" aria-selected="false">
                Reactor Core & Fuel
            </button>
            <button class="tab-btn" data-tab="rpv" role="tab" aria-selected="false">
                Reactor Pressure Vessel
            </button>
            <button class="tab-btn" data-tab="rods" role="tab" aria-selected="false">
                Control Rods
            </button>
            <button class="tab-btn" data-tab="steam" role="tab" aria-selected="false">
                Steam Generators
            </button>
            <button class="tab-btn" data-tab="ic" role="tab" aria-selected="false">
                I&C Systems
            </button>
        </nav>

        <!-- Tab Content -->
        <div class="tab-content">
            
            <!-- Tab 1: Reactor Core & Fuel (from m1_fuel.html) -->
            <section id="fuel" class="tab-pane" role="tabpanel">
                <div class="w-full max-w-5xl mx-auto content-card p-8 md:p-12 shadow-xl">
                    <h2 class="text-3xl md:text-5xl font-roca-bold uppercase mb-8 border-b-2 border-[#231f20] pb-4 text-center">
                        Reactor Core & Nuclear Fuel
                    </h2>

                    <div class="space-y-8 text-lg md:text-xl leading-relaxed text-center">
                        <p>
                            Fuel fabrication begins with uranium dioxide powder, which is pressed into pellets, sintered, and loaded into zirconium alloy cladding to form fuel rods. These rods are assembled into fuel bundles that make up the reactor core, requiring extremely precise geometry to ensure safe heat removal, neutron moderation, and long-term operation.
                        </p>

                        <p>
                            Fuel types depend on reactor design. Although LEU and HALEU fabrication processes are similar, HALEU requires stricter criticality controls and specialized licensing. Some advanced SMRs use TRISO fuel, consisting of coated spherical fuel particles that provide exceptional fission product containment and undergo rigorous quality assurance, making them among the safest fuel designs.
                        </p>
                    </div>

                    <div class="mt-12 w-full flex justify-center">
                        <div class="bg-[#abe26a]/20 p-4 rounded-[2.5rem] border-4 border-[#abe26a] shadow-inner max-w-3xl w-full">
                            <img src="../assets/images/triso.png" alt="TRISO Fuel Particle" class="w-full h-auto rounded-[1.8rem] shadow-md">
                            <p class="mt-4 font-roca-bold uppercase tracking-widest text-center text-[#231f20]/70 text-sm">
                                TRISO Fuel particle - US DEPARTMENT OF ENERGY
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Tab 2: Reactor Pressure Vessel (from m2_rpv.html) -->
            <section id="rpv" class="tab-pane" role="tabpanel">
                <div class="w-full max-w-5xl mx-auto content-card p-8 md:p-12 shadow-xl">
                    <h2 class="text-3xl md:text-5xl font-roca-bold uppercase mb-8 border-b-2 border-[#231f20] pb-4 text-center">
                        The Reactor Pressure Vessel
                    </h2>

                    <div class="space-y-8 text-lg md:text-xl leading-relaxed text-center">
                        <p>
                            The reactor pressure vessel (RPV) is a critical component, typically fabricated from low-alloy steel and subjected to rigorous quality control. Manufacturing includes forging or rolling thick steel plates, welding them into cylindrical sections, heat treatment for structural integrity, and cladding the inner surface with corrosion-resistant stainless steel.
                        </p>

                        <p>
                            SMRs benefit from more compact RPV designs, often factory-fabricated and transported as a single unit. Some advanced designs incorporate integral steam generators or pressurizers within the RPV, simplifying construction and reducing the number of large-bore piping penetrations. Non-destructive testing and pressure testing are essential to verify structural soundness before installation.
                        </p>
                    </div>
                </div>
            </section>

            <!-- Tab 3: Control Rods (from m3_rods.html) -->
            <section id="rods" class="tab-pane" role="tabpanel">
                <div class="w-full max-w-5xl mx-auto content-card p-8 md:p-12 shadow-xl">
                    <h2 class="text-3xl md:text-5xl font-roca-bold uppercase mb-8 border-b-2 border-[#231f20] pb-4 text-center">
                        Control Rods & Reactivity Control
                    </h2>

                    <div class="space-y-8 text-lg md:text-xl leading-relaxed text-center">
                        <p>
                            Control rods contain neutron-absorbing materials such as boron carbide, silver-indium-cadmium alloys, or hafnium. They are precision-machined, encased in stainless steel or Inconel cladding, and assembled with drive mechanisms that allow rapid insertion (scram) or gradual withdrawal for power regulation.
                        </p>

                        <p>
                            Manufacturing control rods involves careful material selection, dimensional accuracy, and testing to ensure reliable operation under high neutron flux and temperature. SMRs may use passive reactivity control features, reducing reliance on active control rod systems. Quality assurance confirms that rods can be inserted quickly in emergency scenarios and function reliably throughout the reactor's operational life.
                        </p>
                    </div>
                </div>
            </section>

            <!-- Tab 4: Steam Generators (from m4_steam.html) -->
            <section id="steam" class="tab-pane" role="tabpanel">
                <div class="w-full max-w-5xl mx-auto content-card p-8 md:p-12 shadow-xl">
                    <h2 class="text-3xl md:text-5xl font-roca-bold uppercase mb-8 border-b-2 border-[#231f20] pb-4 text-center">
                        Steam Generators
                    </h2>

                    <div class="space-y-8 text-lg md:text-xl leading-relaxed text-center">
                        <p>
                            Steam generators transfer heat from the reactor coolant to a secondary water circuit, producing steam to drive turbines. They consist of thousands of thin-walled tubes, typically made of Inconel or other corrosion-resistant alloys, enclosed in a pressure vessel. Manufacturing requires precision tube fabrication, tube-to-tubesheet welding, and leak testing.
                        </p>

                        <p>
                            In many SMR designs, steam generators are integrated within the reactor vessel or module, simplifying construction and reducing external piping. This integral approach enhances safety by eliminating large-diameter coolant loops outside containment. Factory fabrication and testing of integral units improve quality control and reduce on-site construction time.
                        </p>
                    </div>
                </div>
            </section>

            <!-- Tab 5: I&C Systems (from m5_ic.html) -->
            <section id="ic" class="tab-pane" role="tabpanel">
                <div class="w-full max-w-5xl mx-auto content-card p-8 md:p-12 shadow-xl">
                    <h2 class="text-3xl md:text-5xl font-roca-bold uppercase mb-8 border-b-2 border-[#231f20] pb-4 text-center">
                        Instrumentation & Control Systems
                    </h2>

                    <div class="space-y-8 text-lg md:text-xl leading-relaxed text-center">
                        <p>
                            Instrumentation and control (I&C) systems monitor reactor parameters—temperature, pressure, neutron flux, coolant flow—and actuate safety systems when needed. Modern SMRs employ digital I&C systems with redundant, diverse channels to meet stringent safety and reliability standards. Manufacturing involves integrating sensors, signal processors, control logic, and human-machine interfaces.
                        </p>

                        <p>
                            Factory pre-integration of I&C systems reduces on-site installation complexity and allows comprehensive testing before deployment. Cybersecurity measures, qualification testing for harsh environments, and regulatory compliance are essential. Continuous monitoring and diagnostics enable predictive maintenance, enhancing operational efficiency and safety margins throughout the reactor's lifetime.
                        </p>
                    </div>
                </div>
            </section>

        </div>
    </div>

    <!-- Footer -->
    <div class="mt-12 opacity-80 text-center">
        <p class="font-roca-bold uppercase tracking-[0.3em] text-sm">Nuclear and Radiation Engineering Department • Alexandria University</p>
    </div>

    <!-- Scripts -->
    <script src="../js/tabs.js"></script>

</body>
</html>
```

**Migration Instructions:**
1. Copy content from `Old files/m1_fuel.html`, `m2_rpv.html`, `m3_rods.html`, `m4_steam.html`, `m5_ic.html`
2. Extract the main content sections (inside `.content-card` or main content divs)
3. Place each section's content into corresponding tab panes
4. Update image paths to `../assets/images/` (note the `..` since we're in `/pages/` now)
5. Remove individual back buttons from content (single back button at top)
6. Test all tabs switch correctly

---

#### File: `pages/operation.html`

**Purpose:** Consolidates o1_licensing.html, o2_startup.html, o3_normal.html, o4_safety.html, o5_removal.html

**Structure:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SMRs - Operation Process</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="../assets/style/style.css">
    <link rel="stylesheet" href="../assets/style/mobile.css">
    <link rel="stylesheet" href="../css/tabs.css">
</head>
<body class="min-h-screen p-6 md:p-10 flex flex-col items-center">

    <!-- Back Button -->
    <div class="w-full max-w-7xl flex justify-start mb-8">
        <a href="../index.html" class="btn-hover bg-[#ffe373] border-[8px] border-[#abe26a] rounded-full py-2 px-8 text-lg font-roca-bold text-[#231f20] uppercase shadow-sm">
            ← Back Home
        </a>
    </div>

    <!-- Page Header -->
    <div class="text-center mb-12">
        <h1 class="text-5xl md:text-7xl font-roca-bold text-[#231f20] tracking-tighter uppercase">Operation</h1>
        <p class="text-xl md:text-2xl font-roca-bold text-[#231f20] mt-4 tracking-widest uppercase opacity-80">Operational Processes</p>
    </div>

    <!-- Tab Container -->
    <div class="tab-container">
        
        <!-- Tab Navigation -->
        <nav class="tab-nav" role="tablist">
            <button class="tab-btn" data-tab="licensing" role="tab" aria-selected="false">
                Licensing & Commissioning
            </button>
            <button class="tab-btn" data-tab="startup" role="tab" aria-selected="false">
                Startup & Power Ascension
            </button>
            <button class="tab-btn" data-tab="normal" role="tab" aria-selected="false">
                Normal Operation
            </button>
            <button class="tab-btn" data-tab="safety" role="tab" aria-selected="false">
                Safety Systems
            </button>
            <button class="tab-btn" data-tab="decommissioning" role="tab" aria-selected="false">
                Decommissioning
            </button>
        </nav>

        <!-- Tab Content -->
        <div class="tab-content">
            
            <!-- Tab 1: Licensing & Commissioning (from o1_licensing.html) -->
            <section id="licensing" class="tab-pane" role="tabpanel">
                <div class="w-full max-w-5xl mx-auto content-card p-8 md:p-12 shadow-xl">
                    <h2 class="text-3xl md:text-5xl font-roca-bold uppercase mb-8 border-b-2 border-[#231f20] pb-4 text-center">
                        Licensing & Commissioning
                    </h2>

                    <div class="space-y-8 text-lg md:text-xl leading-relaxed text-center">
                        <!-- COPY CONTENT FROM o1_licensing.html HERE -->
                        <p>[Content to be migrated from o1_licensing.html]</p>
                    </div>
                </div>
            </section>

            <!-- Tab 2: Startup & Power Ascension (from o2_startup.html) -->
            <section id="startup" class="tab-pane" role="tabpanel">
                <div class="w-full max-w-5xl mx-auto content-card p-8 md:p-12 shadow-xl">
                    <h2 class="text-3xl md:text-5xl font-roca-bold uppercase mb-8 border-b-2 border-[#231f20] pb-4 text-center">
                        Startup & Power Ascension
                    </h2>

                    <div class="space-y-8 text-lg md:text-xl leading-relaxed text-center">
                        <!-- COPY CONTENT FROM o2_startup.html HERE -->
                        <p>[Content to be migrated from o2_startup.html]</p>
                    </div>
                </div>
            </section>

            <!-- Tab 3: Normal Operation (from o3_normal.html) -->
            <section id="normal" class="tab-pane" role="tabpanel">
                <div class="w-full max-w-5xl mx-auto content-card p-8 md:p-12 shadow-xl">
                    <h2 class="text-3xl md:text-5xl font-roca-bold uppercase mb-8 border-b-2 border-[#231f20] pb-4 text-center">
                        Normal Operation & Thermal Hydraulic Behavior
                    </h2>

                    <div class="space-y-8 text-lg md:text-xl leading-relaxed text-center">
                        <!-- COPY CONTENT FROM o3_normal.html HERE -->
                        <p>[Content to be migrated from o3_normal.html]</p>
                    </div>
                </div>
            </section>

            <!-- Tab 4: Safety Systems (from o4_safety.html) -->
            <section id="safety" class="tab-pane" role="tabpanel">
                <div class="w-full max-w-5xl mx-auto content-card p-8 md:p-12 shadow-xl">
                    <h2 class="text-3xl md:text-5xl font-roca-bold uppercase mb-8 border-b-2 border-[#231f20] pb-4 text-center">
                        Safety Systems
                    </h2>

                    <div class="space-y-8 text-lg md:text-xl leading-relaxed text-center">
                        <!-- COPY CONTENT FROM o4_safety.html HERE -->
                        <p>[Content to be migrated from o4_safety.html]</p>
                    </div>
                </div>
            </section>

            <!-- Tab 5: Decommissioning (from o5_removal.html) -->
            <section id="decommissioning" class="tab-pane" role="tabpanel">
                <div class="w-full max-w-5xl mx-auto content-card p-8 md:p-12 shadow-xl">
                    <h2 class="text-3xl md:text-5xl font-roca-bold uppercase mb-8 border-b-2 border-[#231f20] pb-4 text-center">
                        Decommissioning & Waste Management
                    </h2>

                    <div class="space-y-8 text-lg md:text-xl leading-relaxed text-center">
                        <!-- COPY CONTENT FROM o5_removal.html HERE -->
                        <p>[Content to be migrated from o5_removal.html]</p>
                    </div>
                </div>
            </section>

        </div>
    </div>

    <!-- Footer -->
    <div class="mt-12 opacity-80 text-center">
        <p class="font-roca-bold uppercase tracking-[0.3em] text-sm">Nuclear and Radiation Engineering Department • Alexandria University</p>
    </div>

    <!-- Scripts -->
    <script src="../js/tabs.js"></script>

</body>
</html>
```

**Migration Instructions:**
1. Copy content from `Old files/o1_licensing.html`, `o2_startup.html`, `o3_normal.html`, `o4_safety.html`, `o5_removal.html`
2. Extract main content sections from each file
3. Place into corresponding tab panes
4. Update image paths if any
5. Test all tabs

---

#### File: `pages/types.html`

**Purpose:** Consolidates water-cooled.html, gas-cooled.html, liquid-metal.html, molten-salt.html, type_water.html, type_htgr.html, type_salt.html, type_fast.html

**Structure:** This page has TWO levels of tabs:
1. **Main tabs:** Coolant Types (Water, Gas, Liquid Metal, Molten Salt)
2. **Sub-tabs (optional):** Neutron Spectrum views can be integrated as sub-sections or additional tabs

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SMRs - Reactor Types</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="../assets/style/style.css">
    <link rel="stylesheet" href="../assets/style/mobile.css">
    <link rel="stylesheet" href="../css/tabs.css">
</head>
<body class="min-h-screen p-6 md:p-10 flex flex-col items-center">

    <!-- Back Button -->
    <div class="w-full max-w-7xl flex justify-start mb-8">
        <a href="../index.html" class="btn-hover bg-[#ffe373] border-[8px] border-[#abe26a] rounded-full py-2 px-8 text-lg font-roca-bold text-[#231f20] uppercase shadow-sm">
            ← Back Home
        </a>
    </div>

    <!-- Page Header -->
    <div class="text-center mb-12">
        <h1 class="text-5xl md:text-7xl font-roca-bold text-[#231f20] tracking-tighter uppercase">Reactor Types</h1>
        <p class="text-xl md:text-2xl font-roca-bold text-[#231f20] mt-4 tracking-widest uppercase opacity-80">Classification by Coolant & Neutron Spectrum</p>
    </div>

    <!-- Tab Container -->
    <div class="tab-container">
        
        <!-- Main Tab Navigation: Coolant Types -->
        <nav class="tab-nav" role="tablist">
            <button class="tab-btn" data-tab="water" role="tab" aria-selected="false">
                Water-Cooled
            </button>
            <button class="tab-btn" data-tab="gas" role="tab" aria-selected="false">
                Gas-Cooled
            </button>
            <button class="tab-btn" data-tab="liquid-metal" role="tab" aria-selected="false">
                Liquid Metal
            </button>
            <button class="tab-btn" data-tab="molten-salt" role="tab" aria-selected="false">
                Molten Salt
            </button>
        </nav>

        <!-- Tab Content -->
        <div class="tab-content">
            
            <!-- Tab 1: Water-Cooled (from water-cooled.html + type_water.html) -->
            <section id="water" class="tab-pane" role="tabpanel">
                <div class="w-full max-w-6xl mx-auto">
                    
                    <!-- Description Section -->
                    <div class="content-card p-8 md:p-12 shadow-xl mb-10">
                        <h2 class="text-3xl md:text-5xl font-roca-bold uppercase mb-8 text-center">
                            Water-Cooled SMRs
                        </h2>
                        <div class="space-y-6 text-lg md:text-xl leading-relaxed text-center">
                            <!-- COPY CONTENT FROM water-cooled.html HERE -->
                            <p>[Content to be migrated from water-cooled.html]</p>
                        </div>
                    </div>

                    <!-- Table Section from type_water.html -->
                    <div class="content-card p-8 md:p-12 shadow-xl">
                        <h3 class="text-2xl md:text-4xl font-roca-bold uppercase mb-6 text-center">
                            Current Global Status & Development
                        </h3>
                        <div class="rounded-table-container overflow-x-auto">
                            <!-- COPY TABLE FROM type_water.html HERE -->
                        </div>
                    </div>

                </div>
            </section>

            <!-- Tab 2: Gas-Cooled (from gas-cooled.html + type_htgr.html) -->
            <section id="gas" class="tab-pane" role="tabpanel">
                <div class="w-full max-w-6xl mx-auto">
                    
                    <div class="content-card p-8 md:p-12 shadow-xl mb-10">
                        <h2 class="text-3xl md:text-5xl font-roca-bold uppercase mb-8 text-center">
                            Gas-Cooled SMRs
                        </h2>
                        <div class="space-y-6 text-lg md:text-xl leading-relaxed text-center">
                            <!-- COPY CONTENT FROM gas-cooled.html HERE -->
                            <p>[Content to be migrated from gas-cooled.html]</p>
                        </div>
                    </div>

                    <div class="content-card p-8 md:p-12 shadow-xl">
                        <h3 class="text-2xl md:text-4xl font-roca-bold uppercase mb-6 text-center">
                            HTGR Development Status
                        </h3>
                        <div class="rounded-table-container overflow-x-auto">
                            <!-- COPY TABLE FROM type_htgr.html HERE -->
                        </div>
                    </div>

                </div>
            </section>

            <!-- Tab 3: Liquid Metal (from liquid-metal.html + type_fast.html) -->
            <section id="liquid-metal" class="tab-pane" role="tabpanel">
                <div class="w-full max-w-6xl mx-auto">
                    
                    <div class="content-card p-8 md:p-12 shadow-xl mb-10">
                        <h2 class="text-3xl md:text-5xl font-roca-bold uppercase mb-8 text-center">
                            Liquid Metal-Cooled SMRs
                        </h2>
                        <div class="space-y-6 text-lg md:text-xl leading-relaxed text-center">
                            <!-- COPY CONTENT FROM liquid-metal.html HERE -->
                            <p>[Content to be migrated from liquid-metal.html]</p>
                        </div>
                    </div>

                    <div class="content-card p-8 md:p-12 shadow-xl">
                        <h3 class="text-2xl md:text-4xl font-roca-bold uppercase mb-6 text-center">
                            Fast Spectrum Reactor Status
                        </h3>
                        <div class="rounded-table-container overflow-x-auto">
                            <!-- COPY TABLE FROM type_fast.html HERE -->
                        </div>
                    </div>

                </div>
            </section>

            <!-- Tab 4: Molten Salt (from molten-salt.html + type_salt.html) -->
            <section id="molten-salt" class="tab-pane" role="tabpanel">
                <div class="w-full max-w-6xl mx-auto">
                    
                    <div class="content-card p-8 md:p-12 shadow-xl mb-10">
                        <h2 class="text-3xl md:text-5xl font-roca-bold uppercase mb-8 text-center">
                            Molten Salt SMRs
                        </h2>
                        <div class="space-y-6 text-lg md:text-xl leading-relaxed text-center">
                            <!-- COPY CONTENT FROM molten-salt.html HERE -->
                            <p>[Content to be migrated from molten-salt.html]</p>
                        </div>
                    </div>

                    <div class="content-card p-8 md:p-12 shadow-xl">
                        <h3 class="text-2xl md:text-4xl font-roca-bold uppercase mb-6 text-center">
                            Molten Salt Reactor Development
                        </h3>
                        <div class="rounded-table-container overflow-x-auto">
                            <!-- COPY TABLE FROM type_salt.html HERE -->
                        </div>
                    </div>

                </div>
            </section>

        </div>
    </div>

    <!-- Footer -->
    <div class="mt-12 opacity-80 text-center">
        <p class="font-roca-bold uppercase tracking-[0.3em] text-sm">Nuclear and Radiation Engineering Department • Alexandria University</p>
    </div>

    <!-- Scripts -->
    <script src="../js/tabs.js"></script>

</body>
</html>
```

**Migration Instructions:**
1. Copy content from coolant-based files (water-cooled.html, gas-cooled.html, liquid-metal.html, molten-salt.html)
2. Copy table content from neutron spectrum files (type_water.html, type_htgr.html, type_fast.html, type_salt.html)
3. Combine both into each tab (description + table)
4. Update image paths and any internal links
5. Test all tabs and ensure tables render correctly

---

#### File: `pages/case-studies.html`

**Purpose:** Consolidates nuscale.html and htr-pm.html

**Structure:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SMRs - Case Studies</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="../assets/style/style.css">
    <link rel="stylesheet" href="../assets/style/mobile.css">
    <link rel="stylesheet" href="../css/tabs.css">
</head>
<body class="min-h-screen p-6 md:p-10 flex flex-col items-center">

    <!-- Back Button -->
    <div class="w-full max-w-7xl flex justify-start mb-8">
        <a href="../index.html" class="btn-hover bg-[#ffe373] border-[8px] border-[#abe26a] rounded-full py-2 px-8 text-lg font-roca-bold text-[#231f20] uppercase shadow-sm">
            ← Back Home
        </a>
    </div>

    <!-- Page Header -->
    <div class="text-center mb-12">
        <h1 class="text-5xl md:text-7xl font-roca-bold text-[#231f20] tracking-tighter uppercase">Case Studies</h1>
        <p class="text-xl md:text-2xl font-roca-bold text-[#231f20] mt-4 tracking-widest uppercase opacity-80">Real-World SMR Implementations</p>
    </div>

    <!-- Tab Container -->
    <div class="tab-container">
        
        <!-- Tab Navigation -->
        <nav class="tab-nav" role="tablist">
            <button class="tab-btn" data-tab="nuscale" role="tab" aria-selected="false">
                NuScale Power Module™
            </button>
            <button class="tab-btn" data-tab="htr-pm" role="tab" aria-selected="false">
                HTR-PM (China)
            </button>
        </nav>

        <!-- Tab Content -->
        <div class="tab-content">
            
            <!-- Tab 1: NuScale (from nuscale.html) -->
            <section id="nuscale" class="tab-pane" role="tabpanel">
                <div class="w-full max-w-7xl mx-auto">
                    
                    <!-- Copy entire content from nuscale.html -->
                    <!-- Keep all sections: Overview, Target Applications, Technical Specs, etc. -->
                    <!-- Example structure: -->
                    
                    <div class="flex flex-col lg:flex-row gap-12 items-start">
                        
                        <div class="flex-1 w-full lg:w-2/3">
                            
                            <section class="glass-card">
                                <h2 class="section-title font-roca-bold">Overview</h2>
                                <p class="text-xl leading-relaxed">
                                    <!-- COPY CONTENT FROM nuscale.html -->
                                </p>
                            </section>

                            <!-- More sections -->

                        </div>

                        <!-- Sidebar if exists -->
                        <aside class="w-full lg:w-1/3">
                            <!-- COPY SIDEBAR CONTENT -->
                        </aside>

                    </div>

                </div>
            </section>

            <!-- Tab 2: HTR-PM (from htr-pm.html) -->
            <section id="htr-pm" class="tab-pane" role="tabpanel">
                <div class="w-full max-w-7xl mx-auto">
                    
                    <!-- Copy entire content from htr-pm.html -->
                    <div class="flex flex-col lg:flex-row gap-12 items-start">
                        
                        <div class="flex-1 w-full lg:w-2/3">
                            
                            <section class="glass-card">
                                <h2 class="section-title font-roca-bold">Overview</h2>
                                <p class="text-xl leading-relaxed">
                                    <!-- COPY CONTENT FROM htr-pm.html -->
                                </p>
                            </section>

                            <!-- More sections -->

                        </div>

                        <aside class="w-full lg:w-1/3">
                            <!-- COPY SIDEBAR CONTENT -->
                        </aside>

                    </div>

                </div>
            </section>

        </div>
    </div>

    <!-- Footer -->
    <div class="mt-12 opacity-80 text-center">
        <p class="font-roca-bold uppercase tracking-[0.3em] text-sm">Nuclear and Radiation Engineering Department • Alexandria University</p>
    </div>

    <!-- Scripts -->
    <script src="../js/tabs.js"></script>

</body>
</html>
```

**Migration Instructions:**
1. Copy ENTIRE content from `nuscale.html` and `htr-pm.html`
2. These are longer pages, so preserve all sections, images, and layouts
3. Place each complete page content into respective tab pane
4. Update image paths to `../assets/images/`
5. Test thoroughly due to complexity

---

#### File: `pages/introduction.html`

**Purpose:** Copy from introduction.html with minimal changes (standalone page)

**Structure:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SMRs - Introduction</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="../assets/style/style.css">
    <link rel="stylesheet" href="../assets/style/mobile.css">
</head>
<body class="min-h-screen p-6 md:p-10 flex flex-col items-center">

    <!-- Back Button -->
    <div class="w-full max-w-7xl flex justify-start mb-8">
        <a href="../index.html" class="btn-hover bg-[#ffe373] border-[8px] border-[#abe26a] rounded-full py-2 px-8 text-lg font-roca-bold text-[#231f20] uppercase shadow-sm">
            ← Back Home
        </a>
    </div>

    <!-- COPY ENTIRE CONTENT FROM Old files/introduction.html -->
    <!-- Update image paths to ../assets/images/ -->

    <!-- Footer -->
    <div class="mt-12 opacity-80 text-center">
        <p class="font-roca-bold uppercase tracking-[0.3em] text-sm">Nuclear and Radiation Engineering Department • Alexandria University</p>
    </div>

</body>
</html>
```

**Migration Instructions:**
1. Copy entire content from `Old files/introduction.html`
2. Update back button link to `../index.html`
3. Update image paths if any
4. No tabs needed for this page

---

### Phase 4: Update index.html Navigation

**File:** `index.html` (root level)

**Changes needed:**
Update the navigation links in the grid section:

```html
<!-- OLD LINKS -->
<a href="introduction.html" class="glow-btn">
<a href="manufacturing.html" class="glow-btn">
<a href="types.html" class="glow-btn">
<a href="operating_smrs.html" class="glow-btn">
<a href="nuscale.html" class="glow-btn">
<a href="htr-pm.html" class="glow-btn">

<!-- NEW LINKS -->
<a href="pages/introduction.html" class="glow-btn">
    <span class="btn-text">Introduction</span>
</a>
<a href="pages/manufacturing.html" class="glow-btn">
    <span class="btn-text">Manufacturing</span>
</a>
<a href="pages/operation.html" class="glow-btn">
    <span class="btn-text">Operation</span>
</a>
<a href="pages/types.html" class="glow-btn">
    <span class="btn-text">Reactor Types</span>
</a>
<a href="pages/case-studies.html" class="glow-btn">
    <span class="btn-text">Case Studies</span>
</a>
```

**Note:** We're going from 6 main links to 5 main links. Remove or consolidate as needed. The "operating_smrs.html" content should be integrated into the appropriate section (possibly introduction or types).

---

### Phase 5: Handle operating_smrs.html

**Decision needed:** Where should `operating_smrs.html` content go?

**Option 1:** Add as a separate page `pages/operating-smrs.html` (6th page)
**Option 2:** Integrate into `introduction.html` as a section
**Option 3:** Add as a tab in `types.html`

**Recommendation:** Create a separate page `pages/operating-smrs.html` and update index.html to include it as a 6th link.

---

## Testing Checklist

After implementation, test the following:

### Functionality Tests
- [ ] All tabs switch correctly on each page
- [ ] First tab loads as active by default
- [ ] URL hash updates when switching tabs
- [ ] Direct URL with hash (e.g., `manufacturing.html#rpv`) loads correct tab
- [ ] Browser back/forward buttons work with tab navigation
- [ ] All images load correctly
- [ ] All internal links work
- [ ] External links (PDFs) work

### Visual Tests
- [ ] Tab buttons style correctly (active/inactive states)
- [ ] Content transitions smoothly between tabs
- [ ] Responsive design works on mobile (test at 320px, 768px, 1024px, 1440px)
- [ ] Back buttons work and style correctly
- [ ] Footer appears on all pages
- [ ] Typography renders correctly (font-roca-bold)
- [ ] Color scheme consistent (#ffe373, #abe26a, #231f20)

### Accessibility Tests
- [ ] Tab buttons have proper ARIA attributes
- [ ] Keyboard navigation works (Tab, Enter, Space)
- [ ] Screen reader announces tab changes
- [ ] Focus indicators visible
- [ ] Semantic HTML maintained

### Performance Tests
- [ ] Pages load quickly
- [ ] No console errors
- [ ] Smooth animations
- [ ] Works on GitHub Pages

---

## Deployment Steps

1. **Local Testing:**
   ```bash
   # Start a local server (any method)
   python -m http.server 8000
   # OR
   npx serve .
   # OR
   php -S localhost:8000
   ```
   
2. **Test all pages and tabs locally**

3. **Commit to Git:**
   ```bash
   git add pages/ css/ js/ index.html
   git commit -m "Refactor: Consolidate HTML files into tabbed architecture"
   ```

4. **Push to GitHub:**
   ```bash
   git push origin main
   ```

5. **Verify on GitHub Pages:**
   - Wait for deployment (usually 1-2 minutes)
   - Test live site
   - Check all functionality

---

## File Count Comparison

### Before:
- 24 HTML files in `Old files/`
- 2 CSS files
- 0 JavaScript files

### After:
- 1 index.html (root)
- 5-6 HTML files in `pages/`
- 4 CSS files (2 existing + 2 new)
- 2 JavaScript files (new)
- **Total: 6-7 HTML files** (80% reduction!)

---

## Future Enhancements (Post-Refactoring)

### Phase 6: Hexagonal UI (Future)
1. Replace `.tab-nav` with `.hex-tab-container`
2. Replace `.tab-btn` with `.hex-tab`
3. Implement zigzag lattice layout
4. Add hover effects and animations
5. Test on all devices

### Phase 7: Advanced Features (Future)
- Add search functionality
- Implement dark mode
- Add print-friendly styles
- Create table of contents for long pages
- Add "Share" functionality
- Implement analytics

### Phase 8: Content Management (Optional Future)
- Consider build tool (Vite, 11ty, or Jekyll)
- Move content to Markdown files
- Auto-generate HTML from templates
- Add content validation

---

## Content Migration Mapping

### Detailed file-by-file mapping:

| Old File | New Location | Tab ID | Notes |
|----------|-------------|--------|-------|
| m1_fuel.html | pages/manufacturing.html | #fuel | Full content migration |
| m2_rpv.html | pages/manufacturing.html | #rpv | Full content migration |
| m3_rods.html | pages/manufacturing.html | #rods | Full content migration |
| m4_steam.html | pages/manufacturing.html | #steam | Full content migration |
| m5_ic.html | pages/manufacturing.html | #ic | Full content migration |
| o1_licensing.html | pages/operation.html | #licensing | Full content migration |
| o2_startup.html | pages/operation.html | #startup | Full content migration |
| o3_normal.html | pages/operation.html | #normal | Full content migration |
| o4_safety.html | pages/operation.html | #safety | Full content migration |
| o5_removal.html | pages/operation.html | #decommissioning | Full content migration |
| 05_removal.html | DELETE | - | Duplicate of o5 |
| water-cooled.html | pages/types.html | #water | Description section |
| type_water.html | pages/types.html | #water | Table section |
| gas-cooled.html | pages/types.html | #gas | Description section |
| type_htgr.html | pages/types.html | #gas | Table section |
| liquid-metal.html | pages/types.html | #liquid-metal | Description section |
| type_fast.html | pages/types.html | #liquid-metal | Table section |
| molten-salt.html | pages/types.html | #molten-salt | Description section |
| type_salt.html | pages/types.html | #molten-salt | Table section |
| nuscale.html | pages/case-studies.html | #nuscale | Full content migration |
| htr-pm.html | pages/case-studies.html | #htr-pm | Full content migration |
| introduction.html | pages/introduction.html | - | Standalone, minimal changes |
| operating_smrs.html | TBD | - | Decision needed |
| types.html | DELETE/REPLACE | - | Hub page no longer needed |
| manufacturing.html | DELETE/REPLACE | - | Hub page no longer needed |

---

## Important Notes for AI Implementation

1. **Image Paths:** All old files reference `../assets/images/`. New files in `/pages/` must also use `../assets/images/` (same relative path).

2. **CSS Paths:** New files in `/pages/` reference CSS as `../assets/style/style.css` and `../css/tabs.css`.

3. **Content Extraction:** When copying content from old files, extract only the main content area (usually inside `.content-card` or the main content div), NOT the entire HTML structure.

4. **Tab IDs:** Tab IDs in `data-tab` attributes must match the `id` of corresponding `.tab-pane` sections exactly.

5. **Active State:** The first tab should have `active` class by default, but JavaScript will handle this on page load.

6. **Tables:** Some pages have large tables. Preserve the `.rounded-table-container` wrapper and table styles.

7. **Glass Card Styles:** Some content uses `.glass-card` class. Preserve this styling.

8. **Hexagon Elements:** The old `manufacturing.html` has `.hive-container` and `.hexagon-shape` classes. These are not needed in the new consolidated pages (just tab buttons).

9. **Responsive Classes:** Preserve all Tailwind responsive classes (md:, lg:, etc.).

10. **Font Classes:** Always use `font-roca-bold` class for text that should use the custom font.

11. **Back Buttons:** Use the `.nav-btn` class for back buttons (defined in style.css) instead of inline Tailwind classes. This class already includes proper styling with `var(--color-primary)` background, `var(--color-secondary)` border, rounded corners, and hover effects.

12. **CSS Variables:** Always use CSS variables (`var(--color-primary)`, `var(--color-secondary)`, etc.) instead of hardcoded hex values for consistency with the existing design system.

---

## Success Criteria

✅ **Functionality:**
- All content accessible through tabs
- Navigation works seamlessly
- No broken links or images

✅ **Code Quality:**
- Clean, semantic HTML
- Well-organized CSS
- Readable JavaScript
- Consistent code style

✅ **User Experience:**
- Fast page loads
- Smooth transitions
- Intuitive navigation
- Mobile-friendly

✅ **Maintainability:**
- Easy to update content
- Clear file structure
- Good documentation
- Engineer-friendly

---

## Timeline Estimate

- **Phase 1:** Create directories - 5 minutes
- **Phase 2:** Create CSS/JS files - 30 minutes
- **Phase 3:** Create consolidated HTML files - 3-4 hours
- **Phase 4:** Update index.html - 15 minutes
- **Phase 5:** Handle operating_smrs.html - 30 minutes
- **Testing:** 1-2 hours
- **Deployment:** 15 minutes

**Total:** ~6-8 hours of work

---

## Contact & Questions

If you encounter any issues during implementation:
1. Check browser console for JavaScript errors
2. Verify all file paths are correct
3. Ensure tab IDs match between buttons and panes
4. Test with browser dev tools (mobile view)
5. Clear browser cache if styles don't update

---

## End of Plan

This plan provides complete instructions for refactoring the SMRs website from 24 HTML files to 5-6 organized, tabbed pages. The new structure is maintainable, scalable, and ready for future UI enhancements like hexagonal navigation.

**Key Achievement:** 80% file reduction while maintaining all content and improving user experience! 🚀
