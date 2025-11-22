"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, CheckCircle, XCircle } from "lucide-react";

export function VerificationPortal() {
    const [hash, setHash] = useState("");
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleVerify = async () => {
        if (!hash) return;
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8000/verify/${hash}`);
            if (response.ok) {
                const data = await response.json();
                setResult({ status: "success", data });
            } else {
                setResult({ status: "error", message: "Hash not found or invalid" });
            }
        } catch (error) {
            setResult({ status: "error", message: "Verification failed" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Content Verification</CardTitle>
                <CardDescription>
                    Verify the authenticity of any protected content using its unique hash
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex space-x-2">
                    <Input
                        placeholder="Enter content hash..."
                        value={hash}
                        onChange={(e) => setHash(e.target.value)}
                    />
                    <Button onClick={handleVerify} disabled={loading}>
                        {loading ? "Verifying..." : <Search className="h-4 w-4" />}
                    </Button>
                </div>

                {result && (
                    <div className={`p-4 rounded-lg border ${result.status === "success" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                        }`}>
                        <div className="flex items-start space-x-3">
                            {result.status === "success" ? (
                                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                            ) : (
                                <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                            )}
                            <div>
                                <h4 className={`font-medium ${result.status === "success" ? "text-green-900" : "text-red-900"
                                    }`}>
                                    {result.status === "success" ? "Verification Successful" : "Verification Failed"}
                                </h4>
                                {result.status === "success" && (
                                    <div className="mt-2 text-sm text-green-800 space-y-1">
                                        <p>Creator: {result.data.creator}</p>
                                        <p>Timestamp: {new Date(result.data.timestamp).toLocaleString()}</p>
                                        <p>Protection Level: {result.data.protection_level}</p>
                                        <p className="font-mono text-xs mt-2">{result.data.content_id}</p>
                                    </div>
                                )}
                                {result.status === "error" && (
                                    <p className="mt-1 text-sm text-red-800">{result.message}</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
