# UI Style Guide: "The Sanctuary"

This document defines the visual language, design principles, and technical tokens for the Psykho application. It serves as a reference for maintaining consistency across all features.

## 1. Design Philosophy: "The Sanctuary"

Psykho is designed to be a psychological companion. The UI must feel:
- **Calm**: Low-stress layouts with ample white space.
- **Grounded**: Earthy, organic color palettes (Sage Green, Forest Green).
- **Empathetic**: Smooth transitions and soft corners.
- **Modern**: Glassmorphism effects and subtle micro-interactions.

---

## 2. Color Palette (OKLCH)

We use `oklch` for consistent perceived brightness across light and dark modes.

| Token | Light Mode Value | Dark Mode Value | Usage |
|-------|------------------|-----------------|-------|
| `--primary` | `0.65 0.06 150` | `0.75 0.06 150` | Main buttons, active states, key branding |
| `--secondary` | `0.45 0.05 150` | `0.35 0.05 150` | Secondary buttons, subtle highlights |
| `--background` | `0.98 0.01 150` | `0.15 0.02 150` | Main application background |
| `--card` | `1 0 0` | `0.18 0.02 150` | Surfaces, modals, sidebar backgrounds |
| `--border` | `0.9 0.02 150` | `1 0 0 / 10%` | Subtle separators, input outlines |

> [!TIP]
> Always use Tailwind utility classes (e.g., `bg-primary`, `border-border`) instead of hardcoding values.

---

## 3. Component Patterns

### Glassmorphism
Surfaces like the Sidebar and Cards should feel light and layered.
- **Snippet**: `bg-card/50 backdrop-blur-xl border-border/50`
- **Application**: Sidebar, Profile Cards, Popovers.

### Motion & Interactions
We use `framer-motion` to provide a sense of life to the interface.
- **Page Transitions**: Subtle fade-in and upward slide (`initial={{ opacity: 0, y: 20 }}`).
- **Active States**: Layout-persistent indicators (e.g., `layoutId="sidebar-active"`).
- **Buttons**: Subtle hover scale or background shifts.

### Form Inputs
- **Radius**: Large, friendly corners (`--radius: 0.625rem`).
- **Icons**: Always include an icon in the input field to provide visual context (using `lucide-react`).
- **State**: Clear focus rings using `--primary`.

---

## 4. Typography

- **Font Family**: Geist Sans (Sans-serif) for body and headers. Geist Mono for technical data (IDs, JSON).
- **Sizing**:
    - `text-2xl font-bold`: Main headers with gradients.
    - `text-sm font-medium`: Navigation links and labels.
    - `text-xs`: Metadata and secondary details.

---

## 5. Layout & Responsiveness

### Unified Shell (`AppLayout`)
All authenticated pages reside within `src/app/(app)/layout.tsx`.
- **Desktop**: Fixed sidebar on the left (`w-64`).
- **Mobile**: Fixed top header with a hamburger menu leading to a `Sheet` (drawer).
- **Container**: Use `max-w-5xl` for content areas to prevent uncomfortably wide lines of text.

---

## 6. Guidelines for New Features

1. **Avoid Harsh Colors**: Never use pure blacks or vibration-heavy reds. Use earthy alternatives.
2. **Icon Consistency**: Stick to `lucide-react`. Use consistent stroke weights (default `2px`).
3. **Empty States**: Always design empty states to be encouraging (e.g., "Your sanctuary is waiting for your first check-in").
4. **Z-index**: Keep z-index values clean. Header/Mobile Nav at `50`, Sheets/Modals above that.

---

## 7. Gradients & FX

- **Branding Gradient**: `bg-gradient-to-r from-primary to-secondary`
- **Ambient Orbs**: Use blurred absolute-positioned divs with primary/secondary backgrounds to create "atmosphere" in the background if a page feels too empty.
