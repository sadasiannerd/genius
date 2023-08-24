"use client"


import axios from "axios";
import { Badge } from "./ui/badge";
import { ArrowRight, Check, Code, Image, MessageSquare, Music, Video, Zap } from 'lucide-react'
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogDescription, DialogFooter } from "./ui/dialog"
import { useProModal } from "@/hooks/use-pro-modal";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useState } from "react";


const tools = [{
    label: "Conversation",
    icon: MessageSquare,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
},
{
    label: "Music Generation",
    icon: Music,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
},
{
    label: "Image Generation",
    icon: Image,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
},
{
    label: "Video Generation",
    icon: Video,
    color: "text-orange-700",
    bgColor: "bg-orange-700/10",
},
{
    label: "Code Generation",
    icon: Code,
    color: "text-green-700",
    bgColor: "bg-green-700/10",
}
]

export const ProModal = () => {
    const proModal = useProModal();
    const [loading, setLoading] = useState(false)

    const onSubscribe = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/api/stripe")
            window.location.href = response.data.url
        } catch (error){
            console.log(error, "STRIPE_CLIENT_ERROR")
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-center gap-x-2 font-bold py-1">
                        Upgrade to Genius
                        <Badge className="uppercase text-sm py-1" variant="premium">
                            Pro
                        </Badge>
                    </DialogTitle>
                    <DialogDescription className="text-center pt-2 space-y-2 text-zinc-900 font-medium">
                        {
                            tools.map((tool, index) => (
                                <Card
                                    key={index}
                                    className="p-3 border-black/5 flex items-center justify-between">
                                <div className="flex items-center gap-x-4">
                                    <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                                        <tool.icon className={cn("w-10 h-10", tool.color)} />
                                    </div>
                                    <div className="font-semibold text-sm">
                                        {tool.label}
                                    </div>
                                    
                                </div>
                                <Check />   
                                </Card>
                                
                            ))
                        }
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button disabled={loading} onClick={onSubscribe} size="lg" variant="premium" className="w-full">
                       Upgrade
                       <Zap className="w-4 h-4 ml-2 fill-white"/> 
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}