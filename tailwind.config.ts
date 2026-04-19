import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./services/**/*.{ts,tsx}",
    "./utils/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        card: "hsl(var(--card))",
        border: "hsl(var(--border))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        accent: "hsl(var(--accent))",
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        danger: "hsl(var(--danger))"
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        display: ["var(--font-display)"]
      },
      boxShadow: {
        panel: "0 30px 60px -34px rgba(9, 24, 52, 0.18)",
        soft: "0 22px 40px -26px rgba(15, 23, 42, 0.18)",
        float: "0 24px 50px -34px rgba(20, 39, 84, 0.28)",
        insetline: "inset 0 1px 0 rgba(255,255,255,0.65)"
      },
      backgroundImage: {
        "panel-grid":
          "radial-gradient(circle at top left, rgba(30, 41, 59, 0.06), transparent 28%), radial-gradient(circle at bottom right, rgba(14, 116, 144, 0.08), transparent 24%)",
        "brand-veil":
          "linear-gradient(135deg, rgba(14, 26, 56, 0.98) 0%, rgba(17, 45, 92, 0.95) 52%, rgba(11, 30, 66, 0.98) 100%)"
      }
    }
  },
  plugins: []
};

export default config;
