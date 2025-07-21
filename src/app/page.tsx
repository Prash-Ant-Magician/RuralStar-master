
import { AppHeader } from "@/components/app-header";
import { PostCard } from "@/components/post-card";
import { CreatePost } from "@/components/create-post";
import { getPosts, PostWithAuthor } from "@/lib/firebase/firestore";
import { auth } from "@/lib/firebase/config";
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

async function getPostsData(): Promise<PostWithAuthor[]> {
  try {
    const posts = await getPosts();
    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

export default async function Home() {
  const posts = await getPostsData();

  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader />
      <main className="flex-1 bg-secondary p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-2xl space-y-6">
          <CreatePost />
          {posts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>
      </main>
    </div>
  );
}
