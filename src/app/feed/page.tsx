
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { AppHeader } from "@/components/app-header";
import { PostCard } from "@/components/post-card";
import { CreatePost } from "@/components/create-post";
import { getPostsAction } from "@/app/actions";
import type { PostWithAuthor } from "@/lib/firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

function PostFeedSkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-card p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/4" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <Skeleton className="mt-4 aspect-video w-full rounded-lg" />
        </div>
      ))}
    </div>
  )
}

export default function FeedPage() {
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function getPostsData() {
      try {
        const fetchedPosts = await getPostsAction();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    }
    getPostsData();
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader />
      <main className="flex-1 bg-secondary p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-2xl space-y-6">
          <CreatePost />
          {loading ? (
            <PostFeedSkeleton />
          ) : (
            posts.map((post) => (
              <PostCard key={post.id} {...post} />
            ))
          )}
        </div>
      </main>
    </div>
  );
}
