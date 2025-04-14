"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Calendar, FileText, MessageSquareText, Mic, Keyboard, Monitor, ClipboardList, CodeXml, Github } from "lucide-react"
import { useEffect } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import AudioBox from '@/components/audio-stream/examples/hero';
import { ChatBox } from '@/components/chat-box';
import Shortcuts from '@/components/shortcuts';
import FileBox from '@/components/file-box';
import { Card } from "../ui/card"
import { demoSchema } from "@/app/ui/forms/schemas"
import DynamicForm from "@/components/form/dynamic-form"
import Link from "next/link";

const FEATURES = [
    {
        title: "File Box",
        description: "Multi file upload, from filesystem, camera feed or direct urls",
        icon: FileText,
        component: () => <Card><FileBox multiple={true} /></Card>,
    },
    {
        title: "Chat Box",
        description: "Voice capable chatbox with context binding",
        icon: MessageSquareText,
        component: ChatBox,
    },
    {
        title: "Audio Box",
        description: "Voice-first apps with integrated audio streaming capabilities",
        icon: Mic,
        component: () => <Card className="p-4"><AudioBox /></Card>,
    },
    {
        title: "Dynamic Forms",
        description: "Dynamic forms with validation and submission handling",
        icon: ClipboardList,
        component: () => <Card className="p-4"> <DynamicForm
            schema={demoSchema}
            initialData={{}}
        /></Card>,
    },
    {
        title: "Admin CRUD",
        description: "Fully customizable admin pages with complete CRUD functionality",
        icon: Monitor,
        component: () => <Card><Image
            src="/img/home/crud.png"
            width={400}
            height={300}
            alt=""
            className="w-full h-full object-cover rounded-lg"
        /></Card>,
    },
    {
        title: "Calendar",
        description: "UX ready calendar component for scheduling and events",
        icon: Calendar,
        component: () => <Card><Image
            src="/img/home/cal.png"
            width={400}
            height={300}
            alt=""
            className="w-full h-full object-cover rounded-lg"
        /></Card>,
    },
    {
        title: "Hotkeys",
        description: "Full keyboard navigation with custom shortcuts for power users",
        icon: Keyboard,
        component: () => <Card className="p-4"><Shortcuts /></Card>,
    }
]

const STACK = [
    { icon: "🚀", text: "Next.js 15 (App router)", url: "https://nextjs.org/" },
    { icon: "⚛️", text: "React 19", url: "https://react.dev/" },
    { icon: "📘", text: "Typescript", url: "https://www.typescriptlang.org/" },
    { icon: "🎨", text: "TailwindCSS v4", url: "https://tailwindcss.com/" },
    { icon: "🛠️", text: "Shadcn/ui", url: "https://ui.shadcn.com/" },
    { icon: "🛡️", text: "Prisma - ORM for node.js", url: "https://www.prisma.io/" },
    { icon: "📋", text: "React-hook-form", url: "https://react-hook-form.com/" },
    { icon: "🔍", text: "Zod - Schema validation library", url: "https://zod.dev/" },
    { icon: "🔹", text: "Icons - From Lucide", url: "https://lucide.dev/" },
    { icon: "🌑", text: "Dark mode - With next-themes", url: "https://next-themes.com/" },
    { icon: "⚙️", text: "T3-env", url: "https://t3.gg/" },
    { icon: "✨", text: "Vercel AI SDK", url: "https://sdk.vercel.ai/" },
    { icon: "🌐", text: "I18n with next-intl", url: "https://next-intl-docs.vercel.app/" },
    { icon: "🔍", text: "Tanstack react-query", url: "https://tanstack.com/query" },
    { icon: "🔗", text: "Nuqs - State management", url: "https://nuqs.dev/" },
    { icon: "🍥", text: "OpenAI - AI SDK", url: "https://openai.com/" },
]


export default function HeroSection() {
    const t = useTranslations('HomePage')

    useEffect(() => {
        // Prevent automatic scroll restoration
        if (typeof window !== 'undefined') {
            window.history.scrollRestoration = 'manual';
            window.scrollTo(0, 0);
        }
    }, []);

    return (
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted/50">
            <div className=" px-4 md:px-6">
                <div className="flex flex-col items-center text-center space-y-4 mb-12">
                    <Badge className="px-3 py-1 text-sm" variant="outline">
                        <CodeXml className="mr-1 h-3.5 w-3.5" />
                        {t('baseline')}
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500">{t('title')}</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground max-w-[800px]">
                        {t('description')}
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 mt-6">
                        <Link href="/docs">
                            <Button size="lg" className="gap-2">
                                Get Started <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                        <Link href="https://github.com/larafale/dastack" target="_blank">
                            <Button size="lg" variant="outline" className="gap-2">
                                <Github className="h-4 w-4" /> View on GitHub
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>


            {/* Stack Section */}
            <div className="section mt-24">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold">✨ Stack Ingredients</h2>
                    <p className="text-muted-foreground mt-2">Battle tested software to power your project</p>
                </div>
                <div className="@container isolate grid sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-2 max-w-screen-lg m-auto">
                    {STACK.map((item, i) => (
                        <div className="flex items-center justify-start rounded-2xl bg-background gap-2 border @md:border-muted @md:p-4 @max-sm:px-4 select-none" key={i}>
                            <span className="text-3xl">{item.icon}</span>
                            <div className="">{item.text}</div>
                            {item.url && <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground">
                                <ArrowRight className="size-3 text-muted-foreground" />
                            </a>}
                        </div>
                    ))}
                </div>
            </div>


            {/* Bakery Section */}
            <div className="section mt-24">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold">🍪 Components Bakery</h2>
                    <p className="text-muted-foreground mt-2">Buildings blocks to cook your application</p>
                </div>

                <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-5">
                    {FEATURES.map((feature, i) => (<div key={i}>
                        <div className="@container isolate flex flex-col gap-2 overflow-hidden rounded-2xl p-4 ">
                            <div className="flex flex-col gap-6 p-6 @md:flex-row @md:gap-x-8 @md:p-8">
                                <div className="flex h-18 shrink-0 items-center justify-center">
                                    <feature.icon className="size-10" />
                                </div>
                                <div className="select-none">
                                    <span className="text-xl/10 font-medium text-gray-950 @md:text-2xl/10 dark:text-white">{feature.title}</span>
                                    <p className="max-w-xl text-sm/7 text-gray-600 dark:text-gray-400">{feature.description}</p>
                                </div>
                            </div>
                            <div className="flex-1"></div>
                            <div className=" p-4 sm:p-8 relative overflow-hidden rounded-lg bg-gray-950/[2.5%] after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:inset-ring after:inset-ring-gray-950/5 dark:after:inset-ring-white/10 bg-[image:radial-gradient(var(--pattern-fg)_1px,_transparent_0)] bg-[size:10px_10px] bg-fixed [--pattern-fg:var(--color-gray-950)]/5 dark:[--pattern-fg:var(--color-white)]/10">

                                {feature.component && <feature.component />}

                            </div>
                        </div>
                    </div>
                    ))}


                </div>
            </div>

        </section>
    )
}

