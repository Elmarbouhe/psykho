# Multi-language (i18n) System & RTL Developer Guide

This document explains the architecture of the Internationalization (i18n) system in Psykho and provides instructions for extending it.

## Architecture

The system is built on a custom `LanguageProvider` that manages:
1.  **Global Language State**: `en` | `fr` | `ar`
2.  **Directionality**: `ltr` | `rtl` (derived automatically from language)
3.  **Persistence**: Saves preference to `localStorage` and syncs with the `User` database model.
4.  **Translation Helper**: A simple `t('key.path')` function for retrieving strings.

### File Structure
- `src/components/providers/language-provider.tsx`: Core context logic.
- `src/locales/*.ts`: Translation files (Object-based).
- `src/components/layout/sidebar.tsx`: Example of RTL implementation.

---

## How to Add a New Language

### 1. Create Translation File
Create a new file in `src/locales/`, e.g., `es.ts` (Spanish).
```typescript
export const es = {
  common: {
    loading: 'Cargando...',
    // ...
  },
  // Copy structure from en.ts
};
```

### 2. Register Language
Update `src/components/providers/language-provider.tsx`:

```typescript
import { es } from '@/locales/es';

// ...

const translations = {
  en,
  fr,
  ar,
  es, // Add here
};

export type Language = 'en' | 'fr' | 'ar' | 'es'; // Add type
```

### 3. Add to UI
Update the selector in `src/app/(app)/profile/page.tsx`:
```tsx
<SelectItem value="es">Español</SelectItem>
```

---

## RTL (Right-to-Left) Implementation

The system automatically switches `document.dir` to `rtl` when Arabic (`ar`) is selected.

### Styling for RTL
Use Tailwind's logical properties or `rtl:` modifier.

**Margins/Padding:**
- **Bad**: `pl-4` (Always left padding)
- **Good**: `ps-4` (Padding Start - flips automatically) or `ltr:pl-4 rtl:pr-4`

**Icons:**
If an icon interacts with direction (e.g., arrows), flip it dynamically:
```tsx
const { dir } = useTranslation();
<Icon className={cn("h-4 w-4", dir === 'rtl' && "rotate-180")} />
```

**Positioning:**
- **Bad**: `left-0`
- **Good**: `start-0` (if supported) or conditional class:
```tsx
className={cn(
  "absolute top-0",
  isRtl ? "right-0" : "left-0"
)}
```

---

## Translating Components

### 1. Hook Usage
```tsx
import { useTranslation } from '@/components/providers/language-provider';

export function MyComponent() {
  const { t } = useTranslation();
  
  return <button>{t('common.save')}</button>;
}
```

### 2. Dynamic Keys (Safely)
The `t` function accepts a string path. Ensure fallback logic exists if a key might be missing during development.
