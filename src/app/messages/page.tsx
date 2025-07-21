
import { Suspense } from "react";
import { AppHeader } from "@/components/app-header";
// Update the import path below to the correct relative path based on your project structure.
// For example, if page-content.tsx is in the same folder:
import MessagesPageContent, { ConversationListSkeleton, ChatSkeleton } from "./page-content";
// Or if it's in a parent folder, use "../page-content"
// import MessagesPageContent, { ConversationListSkeleton, ChatSkeleton } from "../page-content";

function MessagesPageSkeleton() {
    return (
        <div className="flex h-screen w-full flex-col bg-background">
            <AppHeader />
            <main className="flex flex-1 overflow-hidden">
                <div className="hidden h-full w-full max-w-xs flex-col border-r bg-card md:flex">
                    <div className="p-4"><h2 className="text-2xl font-bold">Messages</h2></div>
                    <ConversationListSkeleton />
                </div>
                <ChatSkeleton />
            </main>
        </div>
    )
}

export default function MessagesPage() {
    return (
        <div className="flex h-screen w-full flex-col bg-background">
            <AppHeader />
            <main className="flex flex-1 overflow-hidden">
                <Suspense fallback={<MessagesPageSkeleton />}>
                    <MessagesPageContent />
                </Suspense>
            </main>
        </div>
    )
}
