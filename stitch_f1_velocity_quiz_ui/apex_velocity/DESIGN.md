---
name: Apex Velocity
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#e9bcb5'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#af8781'
  outline-variant: '#5e3f3a'
  surface-tint: '#ffb4a8'
  primary: '#ffb4a8'
  on-primary: '#680200'
  primary-container: '#e10600'
  on-primary-container: '#fff2f0'
  inverse-primary: '#c00500'
  secondary: '#c6c6ca'
  on-secondary: '#2f3034'
  secondary-container: '#47494c'
  on-secondary-container: '#b7b8bc'
  tertiary: '#00dbe9'
  on-tertiary: '#00363a'
  tertiary-container: '#007c84'
  on-tertiary-container: '#d7fbff'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdad4'
  primary-fixed-dim: '#ffb4a8'
  on-primary-fixed: '#410100'
  on-primary-fixed-variant: '#930300'
  secondary-fixed: '#e2e2e6'
  secondary-fixed-dim: '#c6c6ca'
  on-secondary-fixed: '#1a1c1f'
  on-secondary-fixed-variant: '#45474a'
  tertiary-fixed: '#7df4ff'
  tertiary-fixed-dim: '#00dbe9'
  on-tertiary-fixed: '#002022'
  on-tertiary-fixed-variant: '#004f54'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
    fontFamily: Anybody
    fontSize: 72px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Anybody
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Anybody
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  title-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.5'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1440px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
  unit: 8px
---

## Brand & Style

This design system targets high-performance esports enthusiasts, capturing the adrenaline and precision of Formula 1. The aesthetic is **High-Octane Glassmorphism**—a fusion of dark, technical materials and vibrant, luminous accents. It mimics the cockpit of a modern supercar: high-contrast, data-dense, yet sleek and immersive.

The experience relies on deep layering. Backgrounds utilize carbon-fiber patterns and blurred environmental lighting to create a sense of speed and three-dimensional space. The UI feels like a "Heads-Up Display" (HUD) floating over the track, utilizing frosted glass panels to maintain legibility without sacrificing the cinematic atmosphere.

## Colors

The palette is built on a foundation of **Deep Carbon Black (#0B0B0B)** to maximize contrast and focus. 

- **Primary (Neon Red):** Used exclusively for critical actions, finish lines, and high-energy highlights. It should pulse or glow in active states.
- **Secondary (Slate/Silver):** Provides structural definition for containers and borders, preventing the UI from feeling "flat black."
- **Tertiary (Cyan/Data Blue):** An optional accent used for telemetry data, secondary stats, or "optimal path" indicators.
- **Surface Strategy:** Use semi-transparent overlays (Alpha 40-60%) for glass panels to allow background textures and glows to bleed through.

## Typography

Typography balances "Racing Grit" with "Technical Precision." 

- **Headlines:** Use **Anybody** with a condensed or expanded width where appropriate. Its variable nature allows for a "speed-stretched" look in hero sections.
- **Body:** **Inter** provides maximum legibility for dense F1 regulations, driver bios, and race results.
- **Data/Mono:** **Geist** is used for technical readouts, lap times, and telemetry to provide a developer-centric, high-tech feel.
- **Styling:** Headlines should often be italicized (6-8 degree tilt) to suggest forward motion. Use uppercase for labels to mimic pit-wall dashboard aesthetics.

## Layout & Spacing

This system utilizes a **Fluid Grid** with an 8px base unit. 

- **Desktop:** 12-column grid. Layouts should favor asymmetrical compositions—mimicking the organic curves of a racetrack. Use wide gutters (24px+) to give content "breathing room" amidst the dark theme.
- **Mobile:** 4-column grid. Prioritize verticality and thumb-friendly hit zones. Glass cards should span the full width minus the 16px side margins.
- **Safe Zones:** Ensure high-legibility zones are maintained by using backdrop blurs (20px-40px) behind text elements when they overlap carbon textures.

## Elevation & Depth

Depth is conveyed through **Light Leakage** and **Material Refraction**.

- **Level 0 (Background):** Solid #0B0B0B with a subtle 5% opacity carbon fiber tiled SVG pattern.
- **Level 1 (Panels):** #1F2124 at 60% opacity with a `backdrop-filter: blur(24px)`. Borders are 1px solid white at 10% opacity (Top/Left) and 20% opacity (Bottom/Right) to simulate edge lighting.
- **Level 2 (Active Components):** Elevated with a "Neon Underglow." Use a drop shadow with 0px offset, 15px blur, and #E10600 at 30% opacity.
- **Depth Transitions:** When hovering over cards, increase the backdrop blur and scale the element slightly (1.02x) to simulate it lifting off the "dashboard."

## Shapes

The design system uses a **Hyper-Rounded** language (18px-24px) to contrast the aggressive colors and technical typography, creating a "premium-tech" feel similar to high-end automotive interfaces.

- **Standard Radius:** 16px (rounded-lg) for secondary cards.
- **Feature Radius:** 24px (rounded-xl) for primary hero containers and glass panels.
- **Component Specifics:** Buttons use a slightly reduced radius (12px) to maintain a sense of precision and "clickable" intent.

## Components

- **Buttons:** Primary buttons are solid Neon Red with a subtle inner-glow. Use a "Ripple Effect" on click that radiates a lighter shade of red. For secondary buttons, use a "Ghost" style with a glass background and white border.
- **Input Fields:** Deep black backgrounds with 1px slate borders. On focus, the border transitions to Neon Red with a 10px outer "glow" (box-shadow).
- **Cards:** Glassmorphic panels with a "Progressive Blur." The top edge should have a 1px "Highlight" stroke to catch the virtual light.
- **Chips/Badges:** Small, pill-shaped elements with high-contrast backgrounds (e.g., "LIVE" in Neon Red, "P1" in Gold).
- **Telemetry Lists:** Alternate row colors using 5% white overlays. Use Geist Mono for all numerical data to ensure column alignment.
- **Visual FX:** Integrate "Scanline" overlays (1px repeating lines at 3% opacity) on data-heavy components to enhance the HUD aesthetic.