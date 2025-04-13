'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Menu() {
    const pathname = usePathname();

    const menuSections = [
        {
            title: "Getting Started",
            items: [
                { label: "Overview", href: "/docs" },
                { label: "Installation", href: "/docs/get-started" }
            ]
        },
        // {
        //     title: "Features",
        //     items: [
        //         { label: "Admin CRUD", href: "/docs/features/admin" },
        //         { label: "File Management", href: "/docs/features/files" },
        //         { label: "Internationalization", href: "/docs/features/i18n" }
        //     ]
        // }
    ];

    return (
        <nav className="flex flex-col space-y-6">
            {menuSections.map((section, idx) => (
                <div key={idx} className="space-y-3">
                    <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
                        {section.title}
                    </h3>
                    <ul className="space-y-1">
                        {section.items.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "block text-sm py-2 px-3 rounded-md transition-colors",
                                        pathname === item.href
                                            ? "bg-muted font-medium text-foreground"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                    )}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </nav>
    );
}