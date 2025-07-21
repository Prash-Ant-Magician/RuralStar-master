
"use client"

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MapPin, Mail, MessageSquare, Edit, UserPlus, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { updateProfile, getOrCreateConversation } from "@/app/actions";
import { useAuth } from "@/hooks/use-auth";
import type { UserProfile } from "@/lib/firebase/firestore";

type ProfileHeaderProps = {
  profile: UserProfile;
  isOwnProfile: boolean;
  showOnboarding: boolean;
};

export function ProfileHeader({ profile, isOwnProfile, showOnboarding }: ProfileHeaderProps) {
    const [isSheetOpen, setIsSheetOpen] = useState(showOnboarding);
    const [isDialogOpen, setIsDialogOpen] = useState(showOnboarding);
    const [isLoading, setIsLoading] = useState(false);
    const [isMessaging, setIsMessaging] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const isMobile = useIsMobile();
    const { toast } = useToast();
    const { user: authUser } = useAuth();
    const router = useRouter();


    useEffect(() => {
        if (showOnboarding) {
            if (isMobile) setIsSheetOpen(true);
            else setIsDialogOpen(true);
        }
    }, [showOnboarding, isMobile]);


    const handleFormSubmit = async (formData: FormData) => {
        if (!isOwnProfile) return;
        
        setIsLoading(true);
        formData.set('uid', profile.uid);

        try {
            await updateProfile(formData);
            toast({
                title: "Profile Updated",
                description: "Your changes have been saved successfully.",
            });
            if(isMobile) setIsSheetOpen(false);
            else setIsDialogOpen(false);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Update Failed",
                description: (error as Error).message,
            });
        } finally {
            setIsLoading(false);
        }
    }

    const handleMessageClick = async () => {
        if (!authUser) {
            router.push('/login');
            return;
        }
        setIsMessaging(true);
        try {
            const { conversationId } = await getOrCreateConversation(authUser.uid, profile.uid);
            router.push(`/messages?id=${conversationId}`);
        } catch (error) {
             toast({
                variant: "destructive",
                title: "Error",
                description: "Could not start a conversation. Please try again later.",
            });
        } finally {
            setIsMessaging(false);
        }
    }

    const EditProfileForm = (
        <form action={handleFormSubmit} ref={formRef} className="grid gap-4 py-4">
            <Input name="displayName" defaultValue={profile.displayName} placeholder="Your full name" required/>
            <Input name="sport" defaultValue={profile.sport} placeholder="Your primary sport" required/>
            <Input name="location" defaultValue={profile.location} placeholder="Your city and state" required/>
            <Textarea name="bio" defaultValue={profile.bio} placeholder="Tell us about yourself..." />
            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
            </Button>
        </form>
    );

    const EditProfileDialog = (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{showOnboarding ? 'Welcome! Complete Your Profile' : 'Edit Profile'}</DialogTitle>
                    <DialogDescription>
                         {showOnboarding ? 'Tell everyone a bit about yourself to get started.' : "Make changes to your profile here. Click save when you're done."}
                    </DialogDescription>
                </DialogHeader>
                {EditProfileForm}
            </DialogContent>
        </Dialog>
    );

    const EditProfileSheet = (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
             <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>{showOnboarding ? 'Welcome! Complete Your Profile' : 'Edit Profile'}</SheetTitle>
                    <SheetDescription>
                        {showOnboarding ? 'Tell everyone a bit about yourself to get started.' : "Make changes to your profile here. Click save when you're done."}
                    </SheetDescription>
                </SheetHeader>
                {EditProfileForm}
            </SheetContent>
        </Sheet>
    )

  return (
    <div className="w-full overflow-hidden rounded-lg">
      <div className="bg-card p-6 shadow-md sm:p-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <Avatar className="h-24 w-24 border-4 border-background shadow-lg sm:h-32 sm:w-32">
            <AvatarImage src={profile.photoURL} alt={profile.displayName} data-ai-hint="athlete portrait" />
            <AvatarFallback>{profile.displayName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {profile.displayName}
            </h2>
            <p className="mt-1 text-lg font-semibold text-primary">{profile.sport || 'Sport not set'}</p>
            <div className="mt-2 flex items-center justify-center gap-2 text-muted-foreground sm:justify-start">
              <MapPin className="h-4 w-4" />
              <span>{profile.location || 'Location not set'}</span>
            </div>
            <div className="mt-4 flex justify-center gap-6 sm:justify-start">
                <div>
                    <span className="font-bold text-foreground">{(profile.followers || 0).toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground"> Followers</span>
                </div>
                <div>
                    <span className="font-bold text-foreground">{(profile.following || 0).toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground"> Following</span>
                </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            {isOwnProfile ? (
                 <>
                    <Button size="lg" variant="default" onClick={() => isMobile ? setIsSheetOpen(true) : setIsDialogOpen(true)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                    {isMobile ? EditProfileSheet : EditProfileDialog}
                </>
            ) : (
                <>
                    <Button size="lg" variant="default">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Follow
                    </Button>
                    <Button size="lg" variant="outline" onClick={handleMessageClick} disabled={isMessaging}>
                         {isMessaging ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                         ) : (
                            <MessageSquare className="mr-2 h-4 w-4" />
                         )}
                        Message
                    </Button>
                </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
