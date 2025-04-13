import { PageContainer } from "@/components/page-components";
import { Header } from "../header";
import { Footer } from "../footer";
import { Menu } from "./menu";
import { ReactNode } from "react";

export default function DocsLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <Header />
            <PageContainer>
                <div className="section flex flex-col md:flex-row w-full h-full">
                    <div className="md:w-64 shrink-0 py-6 md:pr-8">
                        <div className="">
                            <Menu />
                        </div>
                    </div>
                    <main className="flex-1 py-6 md:border-l pl-0 md:pl-8">
                        {children}
                    </main>
                </div>
                <Footer />
            </PageContainer>
        </>
    )
}