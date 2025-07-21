
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ThumbsUp, MessageCircle, Share2, MoreHorizontal, Heart, Laugh, Smile, Frown, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAuth } from "@/hooks/use-auth";
import type { PostWithAuthor } from "@/lib/firebase/firestore";

export type PostProps = PostWithAuthor;

const reactions = [
    { name: 'Like', icon: <ThumbsUp className="h-6 w-6 text-blue-500" /> },
    { name: 'Love', icon: <Heart className="h-6 w-6 text-red-500 fill-red-500" /> },
    { name: 'Haha', icon: <Laugh className="h-6 w-6 text-yellow-500" /> },
    { name: 'Wow', icon: <Smile className="h-6 w-6 text-yellow-400" /> },
    { name: 'Sad', icon: <Frown className="h-6 w-6 text-orange-400" /> },
];


export function PostCard({ id, athlete, title, content, timestamp, mediaUrl, mediaAiHint, comments, likes }: PostProps) {
  const { user: loggedInUser } = useAuth();
  const { toast } = useToast();
  const [selectedReaction, setSelectedReaction] = useState(reactions[0]);
  const [isReacted, setIsReacted] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleReaction = (reaction: typeof reactions[0]) => {
    if (isReacted && selectedReaction.name === reaction.name) {
      // Un-react
      setIsReacted(false);
      setLikeCount(likeCount - 1);
      setSelectedReaction(reactions[0]); // Reset to default like
    } else if (isReacted) {
       // Change reaction
      setSelectedReaction(reaction);
    } else {
      // New reaction
      setIsReacted(true);
      setLikeCount(likeCount + 1);
      setSelectedReaction(reaction);
    }
    setPopoverOpen(false);
  };

  const handleComment = () => {
    toast({ title: "Comment", description: "This would open a comment section." });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/post/${id}`);
    toast({ title: "Link Copied", description: "Post link copied to clipboard." });
  };

  const handleDoubleClick = () => {
    // Only "like" the post if it's not already liked to avoid unliking on double tap.
    if (!isReacted) {
      handleReaction(reactions[0]); // reactions[0] is 'Like'
    }
  };
  
  const ReactionButtonIcon = isReacted ? selectedReaction.icon : <ThumbsUp className="h-5 w-5" />;
  const isOwnPost = loggedInUser?.uid === athlete.id;

  return (
    <Card 
      onDoubleClick={handleDoubleClick}
      className="overflow-hidden shadow-sm transition-shadow hover:shadow-md bg-card cursor-pointer"
    >
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 p-4">
        <Link href={`/profile/${athlete.id}`}>
          <Avatar className="h-12 w-12 border-2 border-background">
            <AvatarImage src={athlete.avatarUrl} alt={athlete.name} data-ai-hint={athlete.dataAiHint} />
            <AvatarFallback>{athlete.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-1">
            <div className="flex items-center gap-2">
                <Link href={`/profile/${athlete.id}`} className="font-semibold text-foreground hover:underline">
                    {athlete.name}
                </Link>
                {!isOwnPost && (
                    <>
                        <span className="text-muted-foreground">&middot;</span>
                        <Button variant="link" size="sm" className="p-0 h-auto text-sm" onClick={(e) => { e.stopPropagation(); toast({title: `Followed ${athlete.name}`})}}>
                            <UserPlus className="mr-1 h-3 w-3" /> Follow
                        </Button>
                    </>
                )}
            </div>
          <p className="text-sm text-muted-foreground">{athlete.sport} • {timestamp}</p>
        </div>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <h3 className="mb-2 text-xl font-bold">{title}</h3>
        {content && <p className="mb-4 text-foreground/90">{content}</p>}
        {mediaUrl && (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                <Image
                    src={mediaUrl}
                    alt={title}
                    fill
                    className="object-cover"
                    data-ai-hint={mediaAiHint}
                />
            </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t p-2 px-4">
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
                 <Button variant="ghost" className={cn("text-muted-foreground hover:text-primary", isReacted && "text-primary")} onClick={() => handleReaction(reactions[0])} onMouseEnter={() => setPopoverOpen(true)} onMouseLeave={() => setPopoverOpen(false)}>
                    <div className="mr-2 h-5 w-5">{ReactionButtonIcon}</div>
                    {isReacted ? selectedReaction.name : 'Like'} ({likeCount})
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-1" onMouseEnter={() => setPopoverOpen(true)} onMouseLeave={() => setPopoverOpen(false)}>
                <div className="flex gap-1">
                    {reactions.map(reaction => (
                        <Button
                            key={reaction.name}
                            variant="ghost"
                            size="icon"
                            className="rounded-full hover:scale-125 transition-transform"
                            onClick={() => handleReaction(reaction)}
                        >
                            {reaction.icon}
                        </Button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
        <Button variant="ghost" className="text-muted-foreground hover:text-primary" onClick={handleComment}>
          <MessageCircle className="mr-2 h-5 w-5" />
          {comments} Comments
        </Button>
        <Button variant="ghost" className="text-muted-foreground hover:text-primary" onClick={handleShare}>
          <Share2 className="mr-2 h-5 w-5" />
          Share
        </Button>
      </CardFooter>
    </Card>
  );
}
