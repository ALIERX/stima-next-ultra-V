// app/fonts.ts
import { Urbanist, Roboto_Mono } from "next/font/google";

export const sans = Urbanist({ subsets: ["latin"], variable: "--font-sans", weight: ["400","500","600","700"] });
export const mono = Roboto_Mono({ subsets: ["latin"], variable: "--font-mono" });
