import CodeLine from "@/components/code-line";

export default function DatabasePage() {
    return (
        <div className="max-w-4xl">
            <h1 className="text-4xl font-bold mb-6">Database with Prisma</h1>
            <p className="text-lg mb-10 text-muted-foreground">
                Dastack uses Prisma ORM to interact with the database. This guide will help you understand how to work with and extend your database schema.
            </p>

            <div className="space-y-12">
                {/* Introduction Section */}
                <section id="introduction" className="space-y-4">
                    <h2 className="text-2xl font-semibold">Introduction to Prisma</h2>
                    <div className="space-y-4">
                        <p>
                            Prisma is a modern database toolkit that simplifies database access with type-safe queries.
                            It consists of three main components:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Prisma Client</strong>: An auto-generated, type-safe query builder for Node.js & TypeScript</li>
                            <li><strong>Prisma Migrate</strong>: A declarative migration system for your database schema</li>
                            <li><strong>Prisma Studio</strong>: A GUI to view and edit data in your database</li>
                        </ul>
                        <p>
                            Dastack uses Prisma with PostgreSQL, but Prisma also supports MySQL, SQLite, SQL Server, MongoDB, and CockroachDB.
                        </p>
                    </div>
                </section>

                {/* Schema Structure Section */}
                <section id="schema-structure" className="space-y-4">
                    <h2 className="text-2xl font-semibold">Schema Structure</h2>
                    <div className="space-y-4">
                        <p>
                            The database schema is defined in <code>prisma/schema.prisma</code>.
                            This file contains your database connection, model definitions, and field types.
                        </p>
                        <p>The default schema includes the following models:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>User</strong>: A user in the system with roles</li>
                            <li><strong>Doc</strong>: A document with text content and optional file attachment</li>
                            <li><strong>File</strong>: Binary file storage with metadata</li>
                        </ul>
                    </div>
                </section>

                {/* Extending the Schema Section */}
                <section id="extending-schema" className="space-y-4">
                    <h2 className="text-2xl font-semibold">Extending the Schema</h2>
                    <div className="space-y-4">
                        <p>
                            To extend the schema, you&apos;ll need to modify the <code>prisma/schema.prisma</code> file
                            and then run migrations to apply your changes to the database.
                        </p>

                        <h3 className="text-xl font-medium mt-6 mb-2">1. Edit the Schema</h3>
                        <p>
                            Add or modify models in the schema file. For example, to add a new Task model:
                        </p>
                        <div className="bg-muted p-4 rounded-md overflow-x-auto font-mono text-sm my-4">
                            <pre>{`model Task {
  id         String   @id @default(ulid())
  ref        String   @unique @default(dbgenerated("generate_short_id()"))
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt
  title      String
  description String?
  status     String   @default("pending")
  due_date   DateTime?
  userId     String?
  user       User?    @relation(fields: [userId], references: [id])
}`}</pre>
                        </div>

                        <h3 className="text-xl font-medium mt-6 mb-2">2. Update the User Model for Relations</h3>
                        <p>
                            If you&apos;re creating relations to existing models, update them as well:
                        </p>
                        <div className="bg-muted p-4 rounded-md overflow-x-auto font-mono text-sm my-4">
                            <pre>{`model User {
  id         String   @id @default(ulid())
  ref        String   @unique @default(dbgenerated("generate_short_id()"))
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt
  name       String
  email      String?  @unique
  phone      String?  @unique
  roles      Role[]   @default([USER])
  tasks      Task[]   // New relation field
}`}</pre>
                        </div>

                        <h3 className="text-xl font-medium mt-6 mb-2">3. Generate a Migration</h3>
                        <p>
                            After modifying your schema, create a migration to apply the changes:
                        </p>
                        <CodeLine content="pnpm dlx prisma migrate dev --name add_task_model" />

                        <p className="mt-4">
                            This command will:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Create a new migration file in <code>prisma/migrations</code></li>
                            <li>Apply the changes to your development database</li>
                            <li>Regenerate the Prisma Client</li>
                        </ul>

                        <h3 className="text-xl font-medium mt-6 mb-2">4. Update the Prisma Client (if needed)</h3>
                        <p>
                            If you only need to regenerate the Prisma Client without creating a migration:
                        </p>
                        <CodeLine content="pnpm dlx prisma generate" />
                    </div>
                </section>

                {/* Using Prisma Client Section */}
                <section id="using-prisma-client" className="space-y-4">
                    <h2 className="text-2xl font-semibold">Using Prisma Client</h2>
                    <div className="space-y-4">
                        <p>
                            Dastack provides a configured Prisma client instance that you can import in your server components or API routes:
                        </p>
                        <div className="bg-muted p-4 rounded-md overflow-x-auto font-mono text-sm my-4">
                            <pre>{`import { db } from "@/lib/db"

// Example of fetching all users
const users = await db.user.findMany()`}</pre>
                        </div>

                        <p>
                            You can use all Prisma Client features like filtering, sorting, pagination, and relations:
                        </p>
                        <div className="bg-muted p-4 rounded-md overflow-x-auto font-mono text-sm my-4">
                            <pre>{`// Find users with the ADMIN role and include their tasks
const admins = await db.user.findMany({
  where: {
    roles: {
      has: "ADMIN"
    }
  },
  include: {
    tasks: true
  }
})`}</pre>
                        </div>
                    </div>
                </section>

                {/* Prisma Studio Section */}
                <section id="prisma-studio" className="space-y-4">
                    <h2 className="text-2xl font-semibold">Using Prisma Studio</h2>
                    <div className="space-y-4">
                        <p>
                            Prisma Studio is a visual database browser that lets you view and edit your data:
                        </p>
                        <CodeLine content="pnpm dlx prisma studio" />

                        <p className="mt-4">
                            This will open a browser window at <code>http://localhost:5555</code> where you can:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Browse all your data</li>
                            <li>Filter and sort records</li>
                            <li>Add, edit, or delete records</li>
                            <li>View relationships between models</li>
                        </ul>
                    </div>
                </section>
            </div>
        </div>
    )
} 