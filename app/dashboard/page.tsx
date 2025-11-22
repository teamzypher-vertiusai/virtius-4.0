"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserProfile } from "@/components/dashboard/user-profile";
import { ContentHistory } from "@/components/dashboard/content-history";
import { Analytics } from "@/components/dashboard/analytics";
import { VerificationPortal } from "@/components/dashboard/verification-portal";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
    const { data: session, status } = useSession();

    if (status === "unauthenticated") {
        redirect("/login");
    }

    // Mock data - in real app, fetch from API
    const mockHistory = [
        {
            id: "1",
            title: "Project Alpha Design",
            thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=200&q=80",
            date: "2024-03-15",
            protectionScore: 98.5,
            status: "protected" as const,
        },
        {
            id: "2",
            title: "Contract Scan",
            thumbnail: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=200&q=80",
            date: "2024-03-14",
            protectionScore: 99.0,
            status: "protected" as const,
        },
    ];

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                        <p className="text-muted-foreground">
                            Welcome back, {session?.user?.name || "User"}
                        </p>
                    </div>
                    <Link href="/upload">
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            New Protection
                        </Button>
                    </Link>
                </div>

                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="content">My Content</TabsTrigger>
                        <TabsTrigger value="analytics">Analytics</TabsTrigger>
                        <TabsTrigger value="verification">Verification</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                        <Analytics />
                        <ContentHistory items={mockHistory} />
                    </TabsContent>

                    <TabsContent value="content">
                        <ContentHistory items={mockHistory} />
                    </TabsContent>

                    <TabsContent value="analytics">
                        <Analytics />
                    </TabsContent>

                    <TabsContent value="verification">
                        <VerificationPortal />
                    </TabsContent>

                    <TabsContent value="settings">
                        <UserProfile user={session?.user || {}} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
