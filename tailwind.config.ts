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
        display: ["var(--font-sans)"]
      },
      boxShadow: {
        panel: "0 30px 60px -34px rgba(51, 38, 20, 0.2)",
        soft: "0 22px 40px -26px rgba(43, 31, 17, 0.2)",
        float: "0 24px 50px -30px rgba(25, 20, 13, 0.34)",
        insetline: "inset 0 1px 0 rgba(255,255,255,0.65)"
      },
      backgroundImage: {
        "panel-grid":
          "radial-gradient(circle at top left, rgba(190, 137, 48, 0.1), transparent 28%), radial-gradient(circle at bottom right, rgba(225, 29, 46, 0.06), transparent 24%)",
        "brand-veil":
          "radial-gradient(circle at 88% 8%, rgba(190, 137, 48, 0.2), transparent 26%), radial-gradient(circle at 8% 96%, rgba(224, 24, 43, 0.18), transparent 30%), linear-gradient(135deg, rgba(12, 12, 11, 0.99) 0%, rgba(31, 29, 25, 0.98) 54%, rgba(10, 10, 9, 0.99) 100%)"
      }
    }
  },
  plugins: []
};

export default config;
