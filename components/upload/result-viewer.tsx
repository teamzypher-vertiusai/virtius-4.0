"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ResultViewerProps {
    originalUrl: string;
    protectedUrl: string;
    stats: {
        manipulationScore: number;
        protectionScore: number;
        cloakingLevel: string;
    };
}

export function ResultViewer({
    originalUrl,
    protectedUrl,
    stats,
}: ResultViewerProps) {
    return (
        <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm text-muted-foreground">Original</h3>
                    <Badge variant="outline">Unprotected</Badge>
                </div>
                <Card className="overflow-hidden bg-muted/10">
                    <div className="aspect-video relative flex items-center justify-center">
                        <img
                            src={originalUrl}
                            alt="Original"
                            className="max-w-full max-h-full object-contain"
                        />
                    </div>
                </Card>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm text-primary">Protected</h3>
                    <Badge className="bg-green-500 hover:bg-green-600">
                        {stats.protectionScore.toFixed(1)}% Secure
                    </Badge>
                </div>
                <Card className="overflow-hidden bg-muted/10 relative">
                    <div className="aspect-video relative flex items-center justify-center">
                        <img
                            src={protectedUrl}
                            alt="Protected"
                            className="max-w-full max-h-full object-contain"
                        />
                        {/* Visual overlay to indicate protection layers */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent pointer-events-none" />
                    </div>
                </Card>
            </div>

            <div className="md:col-span-2 grid grid-cols-3 gap-4 mt-4">
                <div className="text-center p-4 bg-card rounded-lg border">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                        Cloaking
                    </p>
                    <p className="text-xl font-bold text-primary capitalize">
                        {stats.cloakingLevel}
                    </p>
                </div>
                <div className="text-center p-4 bg-card rounded-lg border">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                        Manipulation
                    </p>
                    <p className="text-xl font-bold text-primary">
                        {stats.manipulationScore.toFixed(1)}%
                    </p>
                </div>
                <div className="text-center p-4 bg-card rounded-lg border">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                        AI Immunity
                    </p>
                    <p className="text-xl font-bold text-green-500">
                        {stats.protectionScore.toFixed(1)}%
                    </p>
                </div>
            </div>
        </div>
    );
}
