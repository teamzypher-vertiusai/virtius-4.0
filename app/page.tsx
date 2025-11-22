import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                        Welcome to Virtius 4.0
                    </h1>
                    <p className="text-xl text-muted-foreground mb-8">
                        A complete Next.js 14 application with TypeScript, Tailwind CSS, and shadcn/ui
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link href="/login">
                            <Button size="lg">Get Started</Button>
                        </Link>
                        <Link href="/register">
                            <Button size="lg" variant="outline">
                                Sign Up
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mt-16">
                    <Card>
                        <CardHeader>
                            <CardTitle>🚀 Next.js 14</CardTitle>
                            <CardDescription>Latest App Router with server components</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Built on the latest Next.js 14 with App Router for optimal performance and developer experience.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>🎨 Tailwind CSS</CardTitle>
                            <CardDescription>Utility-first CSS framework</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Fully configured Tailwind CSS with shadcn/ui components for beautiful, accessible UI.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>🔐 NextAuth.js</CardTitle>
                            <CardDescription>Complete authentication solution</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Integrated authentication with NextAuth.js and Prisma for secure user management.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
