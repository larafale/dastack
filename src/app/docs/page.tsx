import Link from 'next/link'

export default function DocsPage() {
    return (
        <div className="max-w-4xl">
            <h1 className="text-4xl font-bold mb-6">Documentation</h1>
            <p className="text-lg mb-10 text-muted-foreground">
                Welcome to the Dastack documentation. Here you&apos;ll find guides to help you get the most out of your Dastack project.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <Link
                    href="/docs/get-started"
                    className="group block p-6 border rounded-lg hover:border-foreground transition-colors"
                >
                    <h2 className="text-2xl font-semibold mb-2 group-hover:underline">Get Started</h2>
                    <p className="text-muted-foreground">Learn how to install and set up your Dastack project.</p>
                </Link>

                <Link
                    href="/docs/database"
                    className="group block p-6 border rounded-lg hover:border-foreground transition-colors"
                >
                    <h2 className="text-2xl font-semibold mb-2 group-hover:underline">Database</h2>
                    <p className="text-muted-foreground">Understand how to work with Prisma and extend your database schema.</p>
                </Link>
            </div>

            <h2 className="text-2xl font-bold mb-4">What is Dastack?</h2>
            <p className="text-muted-foreground mb-6">
                Dastack is a modern full-stack web application starter kit built with Next.js, React, TypeScript, TailwindCSS, and other cutting-edge technologies. It provides a solid foundation for building robust web applications with a focus on developer experience and performance.
            </p>

            <h2 className="text-2xl font-bold mb-4">Key Features</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-6">
                <li>Next.js 15 with App Router</li>
                <li>React 19 with latest features</li>
                <li>Tailwind CSS v4 for styling</li>
                <li>Type safety with TypeScript</li>
                <li>Database integration with Prisma ORM</li>
                <li>Ready-to-use admin interface</li>
                <li>Internationalization support</li>
            </ul>
        </div>
    )
} 