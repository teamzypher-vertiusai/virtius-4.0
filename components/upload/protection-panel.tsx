"use client";

import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Shield, Lock, EyeOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ProtectionState {
    crypto: boolean;
    binary: boolean;
    cloaking: boolean;
}

interface ProtectionPanelProps {
    state: ProtectionState;
    onChange: (key: keyof ProtectionState, value: boolean) => void;
    disabled?: boolean;
}

export function ProtectionPanel({
    state,
    onChange,
    disabled = false,
}: ProtectionPanelProps) {
    return (
        <div className="grid gap-4 md:grid-cols-3">
            {/* Crypto */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between space-x-4">
                        <div className="flex flex-col space-y-1">
                            <div className="flex items-center space-x-2">
                                <Lock className="h-4 w-4 text-blue-500" />
                                <Label htmlFor="crypto-mode" className="font-semibold">
                                    Cryptographic Signing
                                </Label>
                            </div>
                            <span className="text-xs text-muted-foreground">
                                Ed25519 Signing & Hashing
                            </span>
                        </div>
                        <Switch
                            id="crypto-mode"
                            checked={state.crypto}
                            onCheckedChange={(checked) => onChange("crypto", checked)}
                            disabled={disabled}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Binary */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between space-x-4">
                        <div className="flex flex-col space-y-1">
                            <div className="flex items-center space-x-2">
                                <Shield className="h-4 w-4 text-green-500" />
                                <Label htmlFor="binary-mode" className="font-semibold">
                                    Binary Shielding
                                </Label>
                            </div>
                            <span className="text-xs text-muted-foreground">
                                Zero-out & RGB Shift
                            </span>
                        </div>
                        <Switch
                            id="binary-mode"
                            checked={state.binary}
                            onCheckedChange={(checked) => onChange("binary", checked)}
                            disabled={disabled}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Cloaking */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between space-x-4">
                        <div className="flex flex-col space-y-1">
                            <div className="flex items-center space-x-2">
                                <EyeOff className="h-4 w-4 text-purple-500" />
                                <Label htmlFor="cloaking-mode" className="font-semibold">
                                    AI Cloaking
                                </Label>
                            </div>
                            <span className="text-xs text-muted-foreground">
                                Fawkes Anti-Recognition
                            </span>
                        </div>
                        <Switch
                            id="cloaking-mode"
                            checked={state.cloaking}
                            onCheckedChange={(checked) => onChange("cloaking", checked)}
                            disabled={disabled}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
