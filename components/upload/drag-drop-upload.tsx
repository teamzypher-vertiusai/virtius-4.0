"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X, FileType } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface DragDropUploadProps {
    onFileSelect: (file: File) => void;
}

export function DragDropUpload({ onFileSelect }: DragDropUploadProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            setError(null);
            const file = acceptedFiles[0];

            if (!file) return;

            if (!file.type.startsWith("image/")) {
                setError("Please upload an image file (JPEG, PNG, WebP)");
                return;
            }

            if (file.size > 10 * 1024 * 1024) {
                setError("File size must be less than 10MB");
                return;
            }

            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
            onFileSelect(file);
        },
        [onFileSelect]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".jpeg", ".jpg", ".png", ".webp"],
        },
        maxFiles: 1,
    });

    const clearFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreview(null);
        setError(null);
    };

    return (
        <div className="w-full">
            <div
                {...getRootProps()}
                className={`
          relative border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer
          ${isDragActive
                        ? "border-primary bg-primary/5"
                        : "border-muted-foreground/25 hover:border-primary/50"
                    }
          ${error ? "border-destructive/50 bg-destructive/5" : ""}
        `}
            >
                <input {...getInputProps()} />

                {preview ? (
                    <div className="relative flex flex-col items-center">
                        <img
                            src={preview}
                            alt="Preview"
                            className="max-h-64 rounded-lg shadow-md object-contain"
                        />
                        <Button
                            variant="destructive"
                            size="icon"
                            className="absolute -top-4 -right-4 rounded-full"
                            onClick={clearFile}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                        <p className="mt-4 text-sm text-muted-foreground">
                            Click or drag to replace
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center space-y-4">
                        <div className="p-4 bg-primary/10 rounded-full">
                            <UploadCloud className="h-10 w-10 text-primary" />
                        </div>
                        <div>
                            <p className="text-lg font-medium">
                                {isDragActive ? "Drop image here" : "Drag & drop image here"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                or click to browse
                            </p>
                        </div>
                        <div className="flex gap-2 text-xs text-muted-foreground">
                            <span className="flex items-center">
                                <FileType className="h-3 w-3 mr-1" /> JPG, PNG, WebP
                            </span>
                            <span>•</span>
                            <span>Max 10MB</span>
                        </div>
                    </div>
                )}
            </div>
            {error && (
                <p className="mt-2 text-sm text-destructive text-center">{error}</p>
            )}
        </div>
    );
}
