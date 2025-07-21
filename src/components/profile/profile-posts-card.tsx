
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper } from "lucide-react";
import { PostCard } from "@/components/post-card";
import { CreatePost } from "../create-post";
import type { PostWithAuthor, UserProfile } from "@/lib/firebase/firestore";

type ProfilePostsCardProps = {
  posts: PostWithAuthor[];
  author: UserProfile;
  isOwnProfile: boolean;
};

export function ProfilePostsCard({ posts, author, isOwnProfile }: ProfilePostsCardProps) {
  const postsWithCorrectAuthor = posts.map(post => ({
    ...post,
    athlete: {
      id: author.uid,
      name: author.displayName,
      sport: author.sport || 'N/A',
      avatarUrl: author.photoURL || 'https://placehold.co/128x128.png',
      dataAiHint: 'user avatar'
    }
  }))

  return (
    <Card className="overflow-hidden shadow-sm transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-center gap-3 space-y-0 bg-card/80">
        <Newspaper className="h-6 w-6 text-primary" />
        <CardTitle className="font-headline text-2xl">Posts</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {isOwnProfile && <CreatePost />}
        {postsWithCorrectAuthor && postsWithCorrectAuthor.length > 0 ? (
            postsWithCorrectAuthor.map((post) => (
                <PostCard key={post.id} {...post} />
            ))
        ) : (
            <p className="text-muted-foreground text-center py-8">No posts yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
