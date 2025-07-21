
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trophy, Star, Heart, FileText, Edit } from "lucide-react";
import { EditAchievementsForm } from "./edit-achievements-form";

export type Achievement = {
  id: number;
  title: string;
  year: string;
  icon: "Trophy" | "Star" | "Heart" | "FileText";
};

type AchievementsCardProps = {
  achievements: Achievement[];
  isOwnProfile: boolean;
  profileId: string;
};

const iconMap = {
  Trophy: <Trophy className="h-8 w-8 text-accent" />,
  Star: <Star className="h-8 w-8 text-accent" />,
  Heart: <Heart className="h-8 w-8 text-accent" />,
  FileText: <FileText className="h-8 w-8 text-accent" />,
};

export function AchievementsCard({ achievements, isOwnProfile, profileId }: AchievementsCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  return (
    <Card className="overflow-hidden shadow-sm transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0 bg-card/80">
        <div className="flex items-center gap-3">
          <Trophy className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline text-2xl">Achievements & Certifications</CardTitle>
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
                <DialogTitle>Edit Achievements</DialogTitle>
              </DialogHeader>
              <EditAchievementsForm 
                currentAchievements={achievements}
                profileId={profileId} 
                onSuccess={() => setIsEditDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent className="p-6">
        {achievements.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10">
                  {iconMap[achievement.icon]}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{achievement.title}</h3>
                  <p className="text-sm text-muted-foreground">{achievement.year}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-4">No achievements listed yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
