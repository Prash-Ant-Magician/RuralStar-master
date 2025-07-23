"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, PlusCircle, UserCircle, LogOut, Home, MessageSquare, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { signOutUser } from "@/lib/firebase/auth";

export function AppHeader() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
        await signOutUser();
        toast({
            title: "Logged Out",
            description: "You have been successfully logged out.",
        });
        router.push("/");
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Logout Failed",
            description: (error as Error).message,
        });
    }
  };
  
  const handleLogin = () => {
    router.push('/login');
  };

  const handleRegister = () => {
    router.push('/register');
  }

  const handleCreatePost = () => {
      toast({
        title: "Post Created!",
        description: "Your new post has been shared with the community.",
      });
  }
  
  const getAvatarFallback = (name: string | null | undefined) => {
    if (!name) return "";
    const parts = name.split(" ");
    if (parts.length > 1) {
      return `${parts[0][0]}${parts[1][0]}`;
    }
    return name.charAt(0);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 md:px-8">
        <div className="flex items-center gap-4">
            <Link href={user ? "/feed" : "/"} className="group flex items-center gap-2">
                <Logo />
                <h1 className="text-xl font-bold text-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:opacity-100">
                TalentTrack
                </h1>
            </Link>
        </div>
        
        <div className="flex flex-1 items-center justify-center px-4 sm:px-8 lg:px-16">
          <div className="w-full max-w-md">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                type="search"
                placeholder="Search athletes, posts, or skills..."
                className="w-full rounded-full bg-secondary pl-10"
                />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {loading ? null : user ? (
            <>
              <nav className="hidden items-center gap-2 md:flex">
                  <Button variant={pathname === '/feed' ? 'secondary' : 'ghost'} size="icon" onClick={() => router.push('/feed')}>
                      <Home className="h-5 w-5"/>
                      <span className="sr-only">Home</span>
                  </Button>
                   <Button variant={pathname === '/messages' ? 'secondary' : 'ghost'} size="icon" onClick={() => router.push('/messages')}>
                      <MessageSquare className="h-5 w-5"/>
                      <span className="sr-only">Messages</span>
                  </Button>
                   <Button variant={pathname === '/notifications' ? 'secondary' : 'ghost'} size="icon" onClick={() => router.push('/notifications')}>
                      <Bell className="h-5 w-5"/>
                      <span className="sr-only">Notifications</span>
                  </Button>
              </nav>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="hidden sm:flex" variant="default">
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Upload
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create a new post</DialogTitle>
                    <DialogDescription>
                      Share your latest achievement or update with the community.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <Textarea placeholder={`What's on your mind, ${user.displayName}?`}/>
                    <Button variant="outline">Upload Media</Button>
                  </div>
                  <DialogClose asChild>
                    <Button type="submit" className="w-full" onClick={handleCreatePost}>Post</Button>
                  </DialogClose>
                </DialogContent>
              </Dialog>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.photoURL || "https://placehold.co/128x128.png"} alt={user.displayName || "User"} data-ai-hint="user avatar" />
                      <AvatarFallback>{getAvatarFallback(user.displayName)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.displayName}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <UserCircle className="mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={handleLogin}>
                Log In
              </Button>
              <Button onClick={handleRegister}>
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
