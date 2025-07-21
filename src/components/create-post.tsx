
"use client"

import { useState, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Image as ImageIcon, Video, Award, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { createPost } from "@/app/actions"
import { Loader2 } from "lucide-react"
import Image from "next/image"

type PostType = "update" | "achievement" | "photo" | "video";

export function CreatePost() {
  const { user } = useAuth();
  const { toast } = useToast()
  const [open, setOpen] = useState(false);
  const [postType, setPostType] = useState<PostType>("update");
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);


  const handleCreatePost = async (formData: FormData) => {
    if (!user) {
        toast({ variant: "destructive", title: "Not logged in", description: "You must be logged in to create a post." });
        return;
    }
    setIsLoading(true);
    formData.set("authorId", user.uid);
    formData.set("postType", postType);
    
    try {
      await createPost(formData);
      toast({
        title: "Post Created!",
        description: "Your new post has been shared with the community.",
      });
      setOpen(false);
      formRef.current?.reset();
      setMediaPreview(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error creating post",
        description: (error as Error).message,
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  const handleMediaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearMedia = () => {
    setMediaPreview(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }
  
  const handleTriggerClick = (type: PostType) => {
    setPostType(type);
    setOpen(true);
  }

  if (!user) {
    return null; // Or a login prompt
  }
  
  const getAvatarFallback = (name: string | null | undefined) => {
    if (!name) return "";
    const parts = name.split(" ");
    if (parts.length > 1) {
      return `${parts[0][0]}${parts[1][0]}`;
    }
    return name.charAt(0);
  }
  
  const getDialogContent = () => {
      let title = "Create a new post";
      let description = "Share your latest achievement or update with the community.";

      switch(postType) {
          case "photo":
            title = "Upload a Photo";
            description = "Share a photo with your followers.";
            break;
          case "video":
            title = "Upload a Video";
            description = "Share a video with your followers.";
            break;
          case "achievement":
            title = "Share an Achievement";
            description = "Let everyone know about your latest accomplishment.";
            break;
      }
      
      const isMediaPost = postType === 'photo' || postType === 'video';

      return (
          <>
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <form action={handleCreatePost} ref={formRef} className="grid gap-4 py-4">
                <Input name="title" placeholder="Post Title" required />
                {!isMediaPost && (
                    <Textarea name="content" placeholder={`What's on your mind, ${user.displayName}?`} required/>
                )}
                
                {mediaPreview && (
                    <div className="relative">
                        <Image src={mediaPreview} alt="Media preview" width={500} height={300} className="rounded-md object-cover" />
                        <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={clearMedia}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                )}
                
                <Input type="file" name="media" accept={postType === 'photo' ? 'image/*' : (postType === 'video' ? 'video/*' : 'image/*,video/*')} className="hidden" ref={fileInputRef} onChange={handleMediaChange} required={isMediaPost}/>

                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <ImageIcon className="mr-2 h-5 w-5"/>
                    {mediaPreview ? "Change Media" : "Upload Media"}
                </Button>

                <Button type="submit" className="w-full" variant="accent" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Post
                </Button>
            </form>
          </>
      )
  }

  return (
    <Card>
      <CardContent className="p-4">
        <Dialog open={open} onOpenChange={(isOpen) => {
            if(!isOpen) {
                clearMedia();
            }
            setOpen(isOpen);
        }}>
            <div className="flex items-start gap-4">
              <Avatar className="h-12 w-12 border">
                <AvatarImage src={user.photoURL || "https://placehold.co/128x128.png"} alt={user.displayName || "user"} data-ai-hint="user avatar" />
                <AvatarFallback>{getAvatarFallback(user.displayName)}</AvatarFallback>
              </Avatar>
                <DialogTrigger asChild>
                  <button onClick={() => handleTriggerClick('update')} className="w-full text-left bg-secondary hover:bg-muted-foreground/20 text-muted-foreground rounded-full px-4 py-3 cursor-pointer">
                    What's on your mind, {user.displayName?.split(' ')[0]}?
                  </button>
                </DialogTrigger>
            </div>
            <div className="mt-4 flex justify-around border-t pt-2">
                <Button variant="ghost" className="w-full" onClick={() => handleTriggerClick('photo')}>
                    <ImageIcon className="mr-2 h-5 w-5 text-green-500" />
                    Photo
                </Button>
                 <Button variant="ghost" className="w-full" onClick={() => handleTriggerClick('video')}>
                    <Video className="mr-2 h-5 w-5 text-blue-500" />
                    Video
                </Button>
                 <Button variant="ghost" className="w-full" onClick={() => handleTriggerClick('achievement')}>
                    <Award className="mr-2 h-5 w-5 text-yellow-500" />
                    Achievement
                </Button>
            </div>

            <DialogContent>
              {getDialogContent()}
            </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
