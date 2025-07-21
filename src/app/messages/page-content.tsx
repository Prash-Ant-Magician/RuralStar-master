"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Search, Send, File, Video, ArrowLeft, MessageSquare, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { getConversations, sendMessage, markAsRead } from "@/app/actions";
import { getMessagesForConversation, Conversation, Message } from "@/lib/firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

export function ConversationListSkeleton() {
    return (
        <div className="space-y-1 p-2">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg p-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    )
}

export function ChatSkeleton() {
    return (
        <div className="flex flex-1 flex-col">
            <div className="flex items-center gap-4 border-b p-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-3 w-16" />
                </div>
            </div>
            <div className="flex-1 p-4 space-y-6">
                <div className="flex items-end gap-2 justify-start">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-12 w-48 rounded-xl" />
                </div>
                <div className="flex items-end gap-2 justify-end">
                    <Skeleton className="h-12 w-64 rounded-xl" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                </div>
                <div className="flex items-end gap-2 justify-start">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-16 w-56 rounded-xl" />
                </div>
            </div>
            <div className="border-t bg-card p-4">
                <Skeleton className="h-10 w-full rounded-md" />
            </div>
        </div>
    )
}

export default function MessagesPageContent() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    
    const conversationId = searchParams.get("id");
    const selectedConversation = conversations.find(c => c.id === conversationId);

    // Fetch conversations
    useEffect(() => {
        if (user) {
            setLoading(true);
            getConversations(user.uid)
                .then(setConversations)
                .finally(() => setLoading(false));
        }
    }, [user]);
    
    // Subscribe to messages for the selected conversation
    useEffect(() => {
        if (conversationId && user) {
            setMessages([]); // Clear previous messages
            const unsubscribe = getMessagesForConversation(conversationId, (newMessages) => {
                setMessages(newMessages);
            });
            
            markAsRead(conversationId, user.uid);

            return () => unsubscribe();
        }
    }, [conversationId, user]);
    
     // Scroll to bottom when new messages arrive
    useEffect(() => {
        if (scrollAreaRef.current) {
            const scrollableView = scrollAreaRef.current.children[0] as HTMLElement;
            if(scrollableView) {
                 scrollableView.scrollTop = scrollableView.scrollHeight;
            }
        }
    }, [messages]);


    const handleSendMessage = async (formData: FormData) => {
        if (!conversationId || !user) return;
        formData.append("conversationId", conversationId);
        formData.append("senderId", user.uid);
        
        formRef.current?.reset(); // Reset form immediately for better UX
        await sendMessage(formData);
    }
    
    const otherParticipant = selectedConversation && user
        ? selectedConversation.participants.find(p => p.uid !== user.uid)
        : null;

    if (authLoading) {
        return (
            <div className="flex h-full w-full">
                <div className="hidden h-full w-full max-w-xs flex-col border-r bg-card md:flex">
                    <div className="p-4"><h2 className="text-2xl font-bold">Messages</h2></div>
                    <ConversationListSkeleton />
                </div>
                <div className="flex flex-1 flex-col justify-center items-center">
                    <p className="text-muted-foreground">Loading conversations...</p>
                </div>
            </div>
        )
    }

    if (!user) {
        router.push('/login');
        return null;
    }
    
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    return (
        <div className="flex h-full w-full">
            {/* Conversations List */}
            <div className={cn(
                "h-full w-full max-w-xs flex-col border-r bg-card md:flex",
                isMobile && conversationId ? "hidden" : "flex"
            )}>
                <div className="border-b p-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">Messages</h2>
                        <Button variant="ghost" size="icon">
                            <PlusCircle className="h-6 w-6" />
                        </Button>
                    </div>
                    <div className="relative mt-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input placeholder="Search messages..." className="pl-10" />
                    </div>
                </div>
                <ScrollArea className="flex-1">
                    {loading ? <ConversationListSkeleton /> : (
                        <div className="space-y-1 p-2">
                            {conversations.map((convo) => {
                                const other = convo.participants.find(p => p.uid !== user.uid);
                                const unreadCount = convo.unreadCounts?.[user.uid] || 0;
                                if (!other) return null;

                                return (
                                    <Link href={`/messages?id=${convo.id}`} key={convo.id} passHref>
                                        <div className={cn("flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-secondary", selectedConversation?.id === convo.id && 'bg-secondary')}>
                                            <Avatar className="h-12 w-12 border">
                                                <AvatarImage src={other.photoURL} alt={other.displayName} />
                                                <AvatarFallback>{other.displayName.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 truncate">
                                                <div className="flex items-baseline justify-between">
                                                    <p className="font-semibold">{other.displayName}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {convo.lastMessageTimestamp ? formatDistanceToNow(convo.lastMessageTimestamp.toDate(), { addSuffix: true }) : ''}
                                                    </p>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <p className={cn("truncate text-sm", unreadCount > 0 ? "font-bold text-foreground" : "text-muted-foreground")}>{convo.lastMessage}</p>
                                                    {unreadCount > 0 && (
                                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                                                            {unreadCount}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    )}
                </ScrollArea>
            </div>

            {/* Chat Window */}
            <div className={cn(
                "flex flex-1 flex-col",
                isMobile && !conversationId ? "hidden" : "flex"
            )}>
                {conversationId ? (
                        selectedConversation && otherParticipant ? (
                        <>
                            <div className="flex items-center gap-4 border-b p-4">
                                {isMobile && <Button variant="ghost" size="icon" onClick={() => router.push('/messages')}><ArrowLeft /></Button>}
                                <Avatar className="h-12 w-12 border">
                                    <AvatarImage src={otherParticipant.photoURL} alt={otherParticipant.displayName} />
                                    <AvatarFallback>{otherParticipant.displayName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-lg font-semibold">{otherParticipant.displayName}</h3>
                                    <p className="text-sm text-muted-foreground">{otherParticipant.sport || 'Athlete'}</p>
                                </div>
                            </div>
                            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                                <div className="space-y-6">
                                    {messages.map((message, index) => {
                                        const sender = selectedConversation.participants.find(p => p.uid === message.senderId);
                                        const isCurrentUser = sender?.uid === user.uid;
                                        return (
                                            <div key={message.id || index} className={cn("flex items-end gap-2", isCurrentUser ? 'justify-end' : 'justify-start')}>
                                                {!isCurrentUser && (
                                                    <Avatar className="h-8 w-8 border">
                                                        <AvatarImage src={sender?.photoURL} alt={sender?.displayName} />
                                                        <AvatarFallback>{sender?.displayName.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                )}
                                                <div className={cn("max-w-md rounded-xl px-4 py-3", isCurrentUser ? 'rounded-br-none bg-primary text-primary-foreground' : 'rounded-bl-none bg-card border')}>
                                                    <p>{message.text}</p>
                                                    <p className={cn("text-xs mt-1", isCurrentUser ? 'text-primary-foreground/70' : 'text-muted-foreground')}>
                                                        {message.timestamp ? formatDistanceToNow(message.timestamp.toDate(), { addSuffix: true }) : 'sending...'}
                                                    </p>
                                                </div>
                                                {isCurrentUser && (
                                                    <Avatar className="h-8 w-8 border">
                                                        <AvatarImage src={user.photoURL || undefined} alt={user.displayName || ""} />
                                                        <AvatarFallback>{user.displayName?.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </ScrollArea>
                            <div className="border-t bg-card p-4">
                                <form ref={formRef} action={handleSendMessage} className="relative">
                                    <Input name="text" placeholder="Type a message..." className="pr-32" autoComplete="off" />
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
                                        <Button type="button" variant="ghost" size="icon"><File className="h-5 w-5 text-muted-foreground"/></Button>
                                        <Button type="button" variant="ghost" size="icon"><Video className="h-5 w-5 text-muted-foreground"/></Button>
                                        <Button type="submit" variant="default" size="icon"><Send className="h-5 w-5" /></Button>
                                    </div>
                                </form>
                            </div>
                        </>
                        ) : <ChatSkeleton />
                ) : (
                    <div className="hidden md:flex flex-1 flex-col items-center justify-center text-center">
                        <MessageSquare className="h-16 w-16 text-muted-foreground/50"/>
                        <h3 className="mt-4 text-xl font-semibold">Select a conversation</h3>
                        <p className="text-muted-foreground">Choose one of your existing conversations to start chatting.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
