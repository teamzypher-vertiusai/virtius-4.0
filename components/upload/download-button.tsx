"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Download, FileJson } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DownloadButtonProps {
    imageUrl: string;
    certificateData: any;
    fileName: string;
}

export function DownloadButton({
    imageUrl,
    certificateData,
    fileName,
}: DownloadButtonProps) {
    const handleDownloadImage = () => {
        const link = document.createElement("a");
        link.href = imageUrl;
        link.download = `protected_${fileName}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDownloadCertificate = () => {
        const dataStr =
            "data:text/json;charset=utf-8," +
            encodeURIComponent(JSON.stringify(certificateData, null, 2));
        const link = document.createElement("a");
        link.href = dataStr;
        link.download = `certificate_${fileName}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="flex gap-2">
            <Button onClick={handleDownloadImage} className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Download Protected Image
            </Button>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                        <FileJson className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleDownloadCertificate}>
                        Download Certificate (JSON)
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
