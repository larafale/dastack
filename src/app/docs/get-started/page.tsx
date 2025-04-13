import CodeLine from "@/components/code-line";

export default function GetStartedPage() {
    return (
        <div className="max-w-4xl">
            <h1 className="text-4xl font-bold mb-6">Get Started with Dastack</h1>
            <p className="text-lg mb-10 text-muted-foreground">
                This guide will help you set up and run your Dastack project quickly.
            </p>

            <div className="space-y-12">
                {/* Installation Section */}
                <section id="installation" className="space-y-4">
                    <h2 className="text-2xl font-semibold">Installation</h2>
                    <div className="space-y-4">
                        <p>Clone the repository to your local machine:</p>
                        <CodeLine content="git clone https://github.com/yourusername/dastack.git" />

                        <p>Navigate to the project directory:</p>
                        <CodeLine content="cd dastack" />

                        <p>Install dependencies using pnpm:</p>
                        <CodeLine content="pnpm install" />
                    </div>
                </section>

                {/* Environment Variables Section */}
                <section id="environment-variables" className="space-y-4">
                    <h2 className="text-2xl font-semibold">Environment Variables</h2>
                    <div className="space-y-4">
                        <p>Create a <code>.env</code> file in the root directory based on the example below:</p>
                        <div className="bg-muted p-4 rounded-md overflow-x-auto font-mono text-sm">
                            <div>DATABASE_URL=&apos;postgresql://user:password@host:port/database_name&apos;</div>
                            <div>APP_URL=&apos;http://localhost:3000&apos;</div>
                            <div>OPENAI_API_KEY=&apos;sk-proj-...&apos; # Optional</div>
                        </div>

                        <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 p-4 rounded-md">
                            <h3 className="text-base font-medium mb-2">Note:</h3>
                            <p>You&apos;ll need to set up a PostgreSQL database. We recommend using <a href="https://neon.tech" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Neon</a> for a serverless Postgres database with a generous free tier.</p>
                        </div>
                    </div>
                </section>

                {/* Database Setup Section */}
                <section id="database-setup" className="space-y-4">
                    <h2 className="text-2xl font-semibold">Database Setup</h2>
                    <div className="space-y-4">
                        <p>Dastack uses Prisma ORM for database management. Run the following commands to set up your database:</p>

                        <p>Generate the Prisma client:</p>
                        <CodeLine content="pnpm dlx prisma generate" />

                        <p>Run database migrations:</p>
                        <CodeLine content="pnpm dlx prisma migrate dev" />

                        <p>Seed the database with initial data (optional):</p>
                        <CodeLine content="pnpm db:seed" />
                    </div>
                </section>

                {/* Running the Application Section */}
                <section id="running-the-app" className="space-y-4">
                    <h2 className="text-2xl font-semibold">Running the Application</h2>
                    <div className="space-y-4">
                        <p>Start the development server with Turbopack:</p>
                        <CodeLine content="pnpm dev" />

                        <p>This will start your application at <a href="http://localhost:3000" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">http://localhost:3000</a>.</p>

                        <div className="bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 p-4 rounded-md">
                            <h3 className="text-base font-medium mb-2">Hot Reloading</h3>
                            <p>The development server includes hot reloading, so changes you make to your code will be reflected immediately without needing to restart the server.</p>
                        </div>
                    </div>
                </section>

                {/* Building for Production Section */}
                <section id="production-build" className="space-y-4">
                    <h2 className="text-2xl font-semibold">Building for Production</h2>
                    <div className="space-y-4">
                        <p>To create a production build of your application:</p>
                        <CodeLine content="pnpm build" />

                        <p>To start the production server:</p>
                        <CodeLine content="pnpm start" />
                    </div>
                </section>

                {/* Features Overview Section */}
                <section id="features-overview" className="space-y-4">
                    <h2 className="text-2xl font-semibold">Features Overview</h2>
                    <div className="space-y-4">
                        <p>Dastack comes with the following features out of the box:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Next.js 15 with App Router and React 19</li>
                            <li>TypeScript for type safety</li>
                            <li>TailwindCSS v4 for styling</li>
                            <li>Shadcn/ui components</li>
                            <li>Prisma ORM for database operations</li>
                            <li>Dark mode support with next-themes</li>
                            <li>Form handling with react-hook-form and zod validation</li>
                            <li>Internationalization with next-intl</li>
                            <li>Admin CRUD pages</li>
                            <li>Keyboard navigation</li>
                            <li>File management system</li>
                            <li>Calendar component</li>
                        </ul>
                    </div>
                </section>

                {/* Next Steps Section */}
                <section id="next-steps" className="space-y-4">
                    <h2 className="text-2xl font-semibold">Next Steps</h2>
                    <div className="space-y-4">
                        <p>Now that you have your Dastack project up and running, you can:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Explore the admin interface</li>
                            <li>Customize the UI to match your brand</li>
                            <li>Add your own components</li>
                            <li>Extend the database schema</li>
                            <li>Configure authentication for your users</li>
                        </ul>
                        <p>Check out our other documentation sections for more detailed guides on these topics.</p>
                    </div>
                </section>
            </div>
        </div>
    )
} 