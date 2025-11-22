"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ShieldCheck } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ContentItem {
    id: string;
    title: string;
    thumbnail: string;
    date: string;
    protectionScore: number;
    status: "protected" | "processing" | "failed";
}

interface ContentHistoryProps {
    items: ContentItem[];
}

export function ContentHistory({ items }: ContentHistoryProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Protected Content</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="h-12 w-12 rounded-md overflow-hidden bg-muted">
                                    <img
                                        src={item.thumbnail}
                                        alt={item.title}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div>
                                    <p className="font-medium">{item.title}</p>
                                    <p className="text-sm text-muted-foreground">{item.date}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="text-right hidden md:block">
                                    <div className="flex items-center space-x-1 text-green-500">
                                        <ShieldCheck className="h-3 w-3" />
                                        <span className="text-sm font-medium">
                                            {item.protectionScore}% Secure
                                        </span>
                                    </div>
                                    <Badge variant="outline" className="mt-1">
                                        {item.status}
                                    </Badge>
                                </div>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>View Details</DropdownMenuItem>
                                        <DropdownMenuItem>Download Certificate</DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive">
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
