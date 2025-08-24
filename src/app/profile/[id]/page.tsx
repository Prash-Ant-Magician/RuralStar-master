
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { ProfileHeader } from "@/components/profile/profile-header";
import { AboutCard } from "@/components/profile/about-card";
import { AchievementsCard } from "@/components/profile/achievements-card";
import { SkillsCard } from "@/components/profile/skills-card";
import { VideosCard } from "@/components/profile/videos-card";
import { ProfileEnhancementCard } from "@/components/profile/profile-enhancement-card";
import { ProfilePostsCard } from "@/components/profile/profile-posts-card";
import { getUser, getUserPosts, UserProfile, PostWithAuthor } from "@/lib/firebase/firestore";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";

const fallbackProfileData = {
    skills: ["3-Point Shooting", "Defense", "Playmaking", "Ball Handling", "Team Leadership", "High Basketball IQ"],
    achievements: [
        { id: 1, title: "State Championship MVP", year: "2023", icon: "Trophy" as const },
        { id: 2, title: "All-Conference First Team", year: "2023", icon: "Star" as const },
        { id: 3, title: "Community Service Award", year: "2022", icon: "Heart" as const },
        { id: 4, title: "Academic All-State", year: "2022", icon: "FileText" as const },
    ],
    videos: [
        { id: 1, title: "2023 Season Highlights", thumbnailUrl: "https://placehold.co/600x400.png", dataAiHint: "basketball highlights" },
        { id: 2, title: "Defensive Showcase", thumbnailUrl: "https://placehold.co/600x400.png", dataAiHint: "basketball defense" },
        { id: 3, title: "Three-Point Practice", thumbnailUrl: "https://placehold.co/600x400.png", dataAiHint: "basketball shooting" },
        { id: 4, title: "Workout Routine", thumbnailUrl: "https://placehold.co/600x400.png", dataAiHint: "gym workout" },
    ],
    aiCardData: {
        profileDescription: "Dedicated and passionate basketball player with a strong work ethic. My goal is to play at the collegiate level.",
        videoQuality: "Good",
        informationPresentation: "My profile has most sections filled out, but I'm not sure if it's what scouts look for.",
    },
};

function ProfileSkeleton() {
    return (
        <div className="flex min-h-screen w-full flex-col">
            <AppHeader />
            <main className="flex-1 bg-secondary p-4 sm:p-6 md:p-8">
                <div className="container mx-auto max-w-7xl">
                    <div className="w-full overflow-hidden rounded-lg bg-card p-6 shadow-md sm:p-8">
                        <div className="flex flex-col items-center gap-6 sm:flex-row">
                            <Skeleton className="h-24 w-24 rounded-full sm:h-32 sm:w-32" />
                            <div className="flex-1 space-y-2 text-center sm:text-left">
                                <Skeleton className="h-10 w-3/4" />
                                <Skeleton className="h-6 w-1/2" />
                                <Skeleton className="h-5 w-1/3" />
                            </div>
                        </div>
                    </div>
                     <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
                        <div className="lg:col-span-2 space-y-8">
                            <Skeleton className="h-48 w-full" />
                            <Skeleton className="h-64 w-full" />
                        </div>
                        <div className="lg:col-span-1">
                            <Skeleton className="h-96 w-full" />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default function AthleteProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const { user: authUser, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getProfileData(userId: string) {
        try {
            setLoading(true);
            const user = await getUser(userId);
            const posts = await getUserPosts(userId);
            setProfile(user);
            setPosts(posts);
        } catch (error) {
            console.error("Error fetching profile data", error);
            setProfile(null);
        } finally {
            setLoading(false);
        }
    }
    if (id) {
        getProfileData(id);
    }
  }, [id]);

  const isLoading = authLoading || loading;

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen w-full flex-col">
        <AppHeader />
        <main className="flex-1 bg-secondary p-4 sm:p-6 md:p-8">
          <div className="container mx-auto max-w-7xl text-center">
            <h2 className="text-2xl font-bold">Profile not found</h2>
            <p className="text-muted-foreground">Could not find a profile for the user ID: {id}</p>
          </div>
        </main>
      </div>
    );
  }
  
  const isOwnProfile = authUser?.uid === profile.uid;
  const showOnboarding = isOwnProfile && !profile.sport;

  const profileData = {
      ...profile,
      skills: profile.skills || fallbackProfileData.skills,
      achievements: profile.achievements || fallbackProfileData.achievements,
      videos: profile.videos || fallbackProfileData.videos,
      aiCardData: profile.aiCardData || fallbackProfileData.aiCardData,
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader />
      <main className="flex-1 bg-secondary p-4 sm:p-6 md:p-8">
        <div className="container mx-auto max-w-7xl">
            <ProfileHeader 
                profile={profileData}
                isOwnProfile={isOwnProfile}
                showOnboarding={showOnboarding}
            />
            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-8">
                    <AboutCard bio={profileData.bio || 'No bio yet.'} />
                    <ProfilePostsCard posts={posts} author={profileData} isOwnProfile={isOwnProfile} />
                    <SkillsCard skills={profileData.skills} isOwnProfile={isOwnProfile} profileId={profileData.uid} />
                    <AchievementsCard achievements={profileData.achievements} isOwnProfile={isOwnProfile} profileId={profileData.uid} />
                    <VideosCard videos={profileData.videos} isOwnProfile={isOwnProfile} profileId={profileData.uid} />
                </div>
                <div className="lg:col-span-1">
                    <ProfileEnhancementCard profileData={profileData.aiCardData} />
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
