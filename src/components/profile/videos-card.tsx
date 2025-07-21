
"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Video, Edit } from "lucide-react";
import { EditVideosForm } from "./edit-videos-form";

export type VideoData = {
  id: number;
  title: string;
  thumbnailUrl: string;
  dataAiHint: string;
};

type VideosCardProps = {
  videos: VideoData[];
  isOwnProfile: boolean;
  profileId: string;
};

export function VideosCard({ videos, isOwnProfile, profileId }: VideosCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  return (
    <Card className="overflow-hidden shadow-sm transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0 bg-card/80">
        <div className="flex items-center gap-3">
          <Video className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline text-2xl">Video Showcase</CardTitle>
        </div>
        {isOwnProfile && (
           <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Edit className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Video Showcase</DialogTitle>
              </DialogHeader>
              <EditVideosForm
                currentVideos={videos}
                profileId={profileId}
                onSuccess={() => setIsEditDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent className="p-6">
        {videos.length > 0 ? (
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full"
          >
            <CarouselContent>
              {videos.map((video) => (
                <CarouselItem key={video.id} className="md:basis-1/2">
                  <div className="group relative overflow-hidden rounded-lg">
                    <Image
                      src={video.thumbnailUrl}
                      alt={video.title}
                      width={600}
                      height={400}
                      className="aspect-video w-full object-cover transition-transform group-hover:scale-105"
                      data-ai-hint={video.dataAiHint}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-4">
                      <h3 className="font-semibold text-white">{video.title}</h3>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
            <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
          </Carousel>
        ) : (
           <p className="text-muted-foreground text-center py-4">No videos uploaded yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
