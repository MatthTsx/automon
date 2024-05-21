import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        Rubik_MO: ["var(--font-r-mono-one)", ...fontFamily.sans],
        Rubik_WP: ["var(--font-r-wet-paint)", ...fontFamily.sans],
        Rowdies: ["var(--font-rowdies)", ...fontFamily.sans]
      },
      colors: {
        Main_purple: "#08040C", Main_white: "#DBDBDB",
        t_gray: "#404040", t_brown: "#CC996A", t_yellow: "#FFE177",
      },
    },
  },
  plugins: [],
} satisfies Config;
