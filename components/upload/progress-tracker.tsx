"use client";

import React from "react";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ProgressTrackerProps {
    steps: {
        id: string;
        label: string;
        status: "pending" | "processing" | "completed" | "error";
    }[];
    progress: number;
}

export function ProgressTracker({ steps, progress }: ProgressTrackerProps) {
    return (
        <div className="space-y-6">
            <Progress value={progress} className="h-2" />
            <div className="grid gap-4">
                {steps.map((step) => (
                    <div
                        key={step.id}
                        className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${step.status === "processing"
                                ? "bg-primary/5 border-primary/20"
                                : "bg-card"
                            }`}
                    >
                        <div className="flex-shrink-0">
                            {step.status === "completed" ? (
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                            ) : step.status === "processing" ? (
                                <Loader2 className="h-5 w-5 text-primary animate-spin" />
                            ) : step.status === "error" ? (
                                <div className="h-5 w-5 rounded-full border-2 border-destructive flex items-center justify-center">
                                    <span className="text-xs font-bold text-destructive">!</span>
                                </div>
                            ) : (
                                <Circle className="h-5 w-5 text-muted-foreground/30" />
                            )}
                        </div>
                        <div className="flex-1">
                            <p
                                className={`text-sm font-medium ${step.status === "completed"
                                        ? "text-foreground"
                                        : step.status === "processing"
                                            ? "text-primary"
                                            : "text-muted-foreground"
                                    }`}
                            >
                                {step.label}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
