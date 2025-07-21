
"use client"

import Link from "next/link";
import { useState } from "react";
import { AppHeader } from "@/components/app-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserPlus, MessageCircle, Newspaper, CheckCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";


const initialNotifications = {
    all: [
        { id: 1, type: "follow" as const, user: "Samantha Vee", avatarUrl: "https://placehold.co/128x128.png", dataAiHint: "female athlete", time: "2h ago", read: false, link: "/profile/user1" },
        { id: 2, type: "message" as const, user: "Coach Mike", avatarUrl: "https://placehold.co/128x128.png", dataAiHint: "coach portrait", message: "Hey, I saw your highlight reel. Impressive stuff. Let's connect.", time: "5h ago", read: false, link: "/messages?id=convo1" },
        { id: 3, type: "post" as const, user: "Alex Doe", avatarUrl: "https://placehold.co/128x128.png", dataAiHint: "athlete portrait", postTitle: "New Training PR!", time: "1d ago", read: true, link: "/post/post1" },
        { id: 4, type: "message" as const, user: "ScoutPro Agency", avatarUrl: "https://placehold.co/128x128.png", dataAiHint: "office building", message: "We have an opportunity we'd like to discuss.", time: "2d ago", read: true, link: "/messages?id=convo2" },
        { id: 5, type: "follow" as const, user: "Mike Chen", avatarUrl: "https://placehold.co/128x128.png", dataAiHint: "runner athlete", time: "3d ago", read: true, link: "/profile/user2" },
        { id: 6, type: "post" as const, user: "Emily White", avatarUrl: "https://placehold.co/128x128.png", dataAiHint: "soccer player", postTitle: "Committed to State University!", time: "4d ago", read: true, link: "/post/post2" },
    ],
}

const notificationIcons = {
    follow: <UserPlus className="h-6 w-6 text-blue-500" />,
    message: <MessageCircle className="h-6 w-6 text-green-500" />,
    post: <Newspaper className="h-6 w-6 text-purple-500" />
}

function getNotificationMessage(notification: any) {
    switch (notification.type) {
        case 'follow':
            return <><b>{notification.user}</b> started following you.</>;
        case 'message':
            return <><b>{notification.user}</b>: <i>"{notification.message}"</i></>;
        case 'post':
            return <><b>{notification.user}</b> created a new post: <i>"{notification.postTitle}"</i></>;
        default:
            return "";
    }
}


export default function NotificationsPage() {
    const [notifications, setNotifications] = useState(initialNotifications.all);
    const { toast } = useToast();

    const unreadNotifications = notifications.filter(n => !n.read);

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({...n, read: true})));
        toast({
            title: "Notifications Updated",
            description: "All notifications have been marked as read.",
        })
    }

    const NotificationItem = ({ notification }: { notification: (typeof notifications)[0] }) => (
         <Link href={notification.link} passHref>
            <div className={cn(
                "flex items-start gap-4 p-4 border-b transition-colors hover:bg-secondary/50 cursor-pointer", 
                !notification.read && "bg-primary/5"
            )}>
                <div className="relative shrink-0">
                        <Avatar className="h-12 w-12 border">
                        <AvatarImage src={notification.avatarUrl} alt={notification.user} data-ai-hint={notification.dataAiHint} />
                        <AvatarFallback>{notification.user.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 rounded-full bg-card p-1">
                        {notificationIcons[notification.type]}
                    </div>
                </div>
                <div className="flex-1">
                    <p className="text-sm leading-relaxed">{getNotificationMessage(notification)}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                </div>
                {!notification.read && (
                    <div className="h-2.5 w-2.5 rounded-full bg-primary mt-1.5 shrink-0" title="Unread"/>
                )}
            </div>
        </Link>
    )

    return (
        <div className="flex h-screen w-full flex-col bg-background">
            <AppHeader />
            <main className="flex-1 bg-secondary/40 p-4 sm:p-6 md:p-8">
                <div className="mx-auto max-w-3xl">
                    <Card>
                        <CardHeader className="p-6 border-b flex flex-row items-center justify-between">
                             <h1 className="text-2xl font-bold">Notifications</h1>
                             {unreadNotifications.length > 0 && (
                                <Button variant="ghost" onClick={markAllAsRead}>
                                    <CheckCheck className="mr-2 h-4 w-4" />
                                    Mark all as read
                                </Button>
                             )}
                        </CardHeader>
                        <CardContent className="p-0">
                            <Tabs defaultValue="all" className="w-full">
                                <TabsList className="w-full grid grid-cols-2 rounded-none bg-transparent border-b px-6">
                                    <TabsTrigger value="all">All</TabsTrigger>
                                    <TabsTrigger value="unread">
                                        Unread
                                        {unreadNotifications.length > 0 && (
                                            <span className="ml-2 h-5 w-5 flex items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                                                {unreadNotifications.length}
                                            </span>
                                        )}
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value="all" className="m-0">
                                    <div className="space-y-0">
                                        {notifications.map(notification => (
                                            <NotificationItem key={notification.id} notification={notification} />
                                        ))}
                                    </div>
                                </TabsContent>
                                <TabsContent value="unread" className="m-0">
                                    <div className="space-y-0">
                                        {unreadNotifications.length > 0 ? (
                                            unreadNotifications.map(notification => (
                                                <NotificationItem key={notification.id} notification={notification} />
                                            ))
                                        ) : (
                                            <p className="text-center text-muted-foreground p-8">You have no unread notifications.</p>
                                        )}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}
