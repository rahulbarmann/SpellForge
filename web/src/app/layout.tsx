import Providers from "@/components/auth-provider";
import { Navbar } from "@/components/navbar";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LogsProvider } from "@/context/logs.context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "SpellForge",
    description: "",
    icons: [
        {
            rel: "icon",
            type: "image/png",
            url: "./icon.png",
        },
    ],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <Providers>
                    <div className="flex flex-col h-[100vh] w-[100vw] overflow-hidden">
                        {/* <Navbar /> */}
                        <LogsProvider>
                            <div className="flex-1 overflow-hidden">
                                <div className="bg-black flex flex-col h-full">
                                    <div className="border-2 border-black rounded-xl bg-white m-4 p-4 flex flex-col min-h-[calc(100vh-2rem)]">
                                        {children}
                                    </div>
                                </div>
                            </div>
                        </LogsProvider>
                    </div>
                </Providers>
            </body>
        </html>
    );
}
