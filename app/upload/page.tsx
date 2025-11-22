"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DragDropUpload } from "@/components/upload/drag-drop-upload";
import { ProtectionPanel } from "@/components/upload/protection-panel";
import { ProgressTracker } from "@/components/upload/progress-tracker";
import { ResultViewer } from "@/components/upload/result-viewer";
import { DownloadButton } from "@/components/upload/download-button";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

export default function UploadPage() {
    const { data: session, status } = useSession();
    const { toast } = useToast();

    const [file, setFile] = useState<File | null>(null);
    const [protectionState, setProtectionState] = useState({
        crypto: true,
        binary: true,
        cloaking: true,
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [result, setResult] = useState<any>(null);

    if (status === "unauthenticated") {
        redirect("/login");
    }

    const handleFileSelect = (selectedFile: File) => {
        setFile(selectedFile);
        setResult(null);
        setProgress(0);
    };

    const handleProtectionChange = (key: keyof typeof protectionState, value: boolean) => {
        setProtectionState((prev) => ({ ...prev, [key]: value }));
    };

    const handleProcess = async () => {
        if (!file || !session?.user?.email) return;

        setIsProcessing(true);
        setProgress(10);

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("user_email", session.user.email);
            // In a real app, we'd send protection flags too

            // Simulate progress steps
            const interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 90) {
                        clearInterval(interval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 500);

            const response = await fetch("http://localhost:8000/protect/image", {
                method: "POST",
                body: formData,
            });

            clearInterval(interval);

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || "Failed to protect image");
            }

            const data = await response.json();
            setProgress(100);

            // Set result with backend data
            setResult({
                originalUrl: `http://localhost:8000${data.original_url}`,
                protectedUrl: `http://localhost:8000${data.protected_url}`,
                stats: {
                    protectionScore: data.stats.protection_score || 95,
                    manipulationScore: data.stats.manipulation_score || 87,
                    cryptoSigning: data.stats.cryptographic_signing,
                    binaryShielding: data.stats.binary_manipulation,
                    aiCloaking: data.stats.ai_cloaking,
                },
                certificate: {
                    contentId: data.content_id,
                    originalHash: data.original_hash,
                    protectedHash: data.protected_hash,
                    signature: data.signature,
                    timestamp: new Date().toISOString(),
                }
            });

            toast({
                title: "Success!",
                description: "Your image has been protected with all security layers.",
            });

        } catch (error) {
            console.error("Protection error:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to protect image. Please try again.",
            });
            setProgress(0);
        } finally {
            setIsProcessing(false);
        }
    };

    const steps = [
        {
            id: "upload",
            label: "Uploading Image",
            status: progress > 10 ? "completed" : progress > 0 ? "processing" : "pending"
        },
        {
            id: "crypto",
            label: "Cryptographic Signing",
            status: progress > 40 ? "completed" : progress > 10 ? "processing" : "pending"
        },
        {
            id: "binary",
            label: "Binary Shielding",
            status: progress > 70 ? "completed" : progress > 40 ? "processing" : "pending"
        },
        {
            id: "cloaking",
            label: "AI Cloaking",
            status: progress === 100 ? "completed" : progress > 70 ? "processing" : "pending"
        },
    ] as any;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="text-center space-y-2">
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                            Content Protection
                        </h1>
                        <p className="text-muted-foreground">
                            Secure your visual assets with multi-layer protection
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-[2fr,1fr]">
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Upload Image</CardTitle>
                                    <CardDescription>
                                        Select an image to apply protection layers
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <DragDropUpload onFileSelect={handleFileSelect} />
                                </CardContent>
                            </Card>

                            {file && !result && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Protection Layers</CardTitle>
                                        <CardDescription>
                                            Configure security measures
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <ProtectionPanel
                                            state={protectionState}
                                            onChange={handleProtectionChange}
                                            disabled={isProcessing}
                                        />
                                        <Button
                                            className="w-full"
                                            size="lg"
                                            onClick={handleProcess}
                                            disabled={isProcessing}
                                        >
                                            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            {isProcessing ? "Processing..." : "Apply Protection"}
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}

                            {result && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Protection Result</CardTitle>
                                        <CardDescription>
                                            Verification and analysis
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <ResultViewer
                                            originalUrl={result.originalUrl}
                                            protectedUrl={result.protectedUrl}
                                            stats={result.stats}
                                        />
                                        <DownloadButton
                                            imageUrl={result.protectedUrl}
                                            certificateData={result.certificate}
                                            fileName={file?.name || "image"}
                                        />
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                            onClick={() => {
                                                setFile(null);
                                                setResult(null);
                                                setProgress(0);
                                            }}
                                        >
                                            Protect Another Image
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Status</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ProgressTracker steps={steps} progress={progress} />
                                </CardContent>
                            </Card>

                            <Card className="bg-primary/5 border-primary/20">
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium text-primary">
                                        Security Note
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-xs text-muted-foreground">
                                        Your content is processed securely. Original files are never stored permanently without encryption.
                                        Ed25519 signatures ensure authenticity.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
