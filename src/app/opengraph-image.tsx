import { ImageResponse } from 'next/og'

// Image metadata
export const alt = 'Dastack - UX Starter Kit'
export const size = {
    width: 1200,
    height: 630,
}

export const contentType = 'image/png'

// Image generation
export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: 'hsl(240 10% 3.9%)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    fontFamily: 'Inter, sans-serif',
                    padding: '32px',
                }}
            >
                {/* Subtle grid pattern */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: 'radial-gradient(hsla(0, 0%, 100%, 0.05) 1px, transparent 0)',
                        backgroundSize: '25px 25px',
                        backgroundPosition: '0 0',
                    }}
                />

                {/* Content */}
                <div
                    style={{
                        width: '100%',
                        maxWidth: '960px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        zIndex: 10,
                        padding: '50px',
                        border: '1px solid hsla(240, 5%, 84%, 0.1)',
                        borderRadius: '16px',
                        background: 'linear-gradient(145deg, hsla(240, 10%, 10%, 0.4), hsla(240, 10%, 5%, 0.7))',
                        boxShadow: '0 8px 32px hsla(0, 0%, 0%, 0.2)',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    {/* Radial glow effects */}
                    <div
                        style={{
                            position: 'absolute',
                            right: 0,
                            bottom: 0,
                            width: 450,
                            height: 450,
                            background: 'radial-gradient(circle at bottom right, hsla(210, 100%, 50%, 0.08), transparent 70%)',
                            zIndex: 1,
                        }}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            width: 450,
                            height: 450,
                            background: 'radial-gradient(circle at top left, hsla(280, 100%, 50%, 0.08), transparent 70%)',
                            zIndex: 1,
                        }}
                    />

                    {/* Content wrapper with higher z-index */}
                    <div
                        style={{
                            position: 'relative',
                            zIndex: 2,
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <div
                            style={{
                                fontSize: 22,
                                color: 'hsl(240 5% 64.9%)',
                                marginBottom: 16,
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                fontWeight: 500,
                            }}
                        >
                            UX Starter Kit
                        </div>

                        <div
                            style={{
                                fontSize: 96,
                                fontWeight: 800,
                                color: 'hsl(0 0% 98%)',
                                lineHeight: 1.1,
                                marginBottom: 24,
                            }}
                        >
                            dastack
                        </div>

                        <div
                            style={{
                                fontSize: 28,
                                color: 'hsl(240 5% 80%)',
                                maxWidth: 600,
                                marginBottom: 40,
                                lineHeight: 1.5,
                            }}
                        >
                            Redefining user experience for the AI era with premium NextJS components
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 12,
                                marginTop: 16,
                                maxWidth: '100%',
                            }}
                        >
                            {['NextJS', 'React', 'TypeScript', 'TailwindCSS', 'Shadcn/ui', 'Prisma'].map((tech, i) => (
                                <div
                                    key={i}
                                    style={{
                                        background: 'hsla(240, 5%, 84%, 0.1)',
                                        borderRadius: '8px',
                                        padding: '10px 16px',
                                        fontSize: 18,
                                        color: 'hsl(240 5% 84.9%)',
                                    }}
                                >
                                    {tech}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    )
}