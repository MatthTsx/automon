import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { Inter, Rubik_Mono_One, Rubik_Wet_Paint, Rowdies } from "next/font/google";

import { api } from "~/utils/api";

import "~/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});
const Rubik_MO = Rubik_Mono_One({
  weight: "400", variable: "--font-r-mono-one", subsets: ["latin"]
})
const Rubik_WP = Rubik_Wet_Paint({
  weight: "400", variable: "--font-r-wet-paint", subsets: ["latin"]
})

const Rowd = Rowdies({
  weight: "400", variable: "--font-rowdies", subsets: ["latin"]
})

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <main className={`font-sans
        ${inter.variable} ${Rubik_MO.variable} ${Rubik_WP.variable}
        ${Rowd.variable}
      `}>
        <Component {...pageProps} />
      </main>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
