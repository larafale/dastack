

export function DocContent({ children }: { children: React.ReactNode }) {
    return (
        <div className="max-w-2xl prose">
            {children}
        </div>
    )
}