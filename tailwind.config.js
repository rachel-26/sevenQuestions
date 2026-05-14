/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "background-light": "#f6f6f8",
        "slate-500": "#64748b",
        "amber-500": "#f59e0b",
        "slate-900": "#0f172a",
        "border-subtle": "#e2e8f0",
        "background-dark": "#121520",
        "slate-400": "#94a3b8",
        "primary": "#2563eb",
        "success": "#16a34a"
      },
      borderRadius: {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem"
      },
      spacing: {
        "stack-sm": "1rem",
        "stack-md": "2rem",
        "container-max": "1280px",
        "sidebar-width": "256px",
        "gutter": "2rem"
      },
      fontFamily: {
        "label-bold": ["Inter"],
        "display-lg": ["Inter"],
        "micro-detail": ["Inter"],
        "body-sm": ["Inter"],
        "headline-md": ["Inter"],
        "label-caps": ["Inter"],
        "body-base": ["Inter"],
        "mono": ["JetBrains Mono"]
      },
      fontSize: {
        "label-bold": ["12px", {"lineHeight": "16px", "fontWeight": "700"}],
        "display-lg": ["30px", {"lineHeight": "36px", "letterSpacing": "-0.02em", "fontWeight": "900"}],
        "micro-detail": ["11px", {"lineHeight": "14px", "fontWeight": "400"}],
        "body-sm": ["13px", {"lineHeight": "18px", "fontWeight": "400"}],
        "headline-md": ["18px", {"lineHeight": "24px", "fontWeight": "700"}],
        "label-caps": ["10px", {"lineHeight": "12px", "letterSpacing": "0.05em", "fontWeight": "700"}],
        "body-base": ["14px", {"lineHeight": "20px", "fontWeight": "400"}]
      }
    },
  },
  plugins: [],
}
