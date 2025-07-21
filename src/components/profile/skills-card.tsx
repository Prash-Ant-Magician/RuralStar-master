
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Star, Edit } from "lucide-react";
import { EditSkillsForm } from "./edit-skills-form";

type SkillsCardProps = {
  skills: string[];
  isOwnProfile: boolean;
  profileId: string;
};

export function SkillsCard({ skills, isOwnProfile, profileId }: SkillsCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  return (
    <Card className="overflow-hidden shadow-sm transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0 bg-card/80">
        <div className="flex items-center gap-3">
          <Star className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline text-2xl">Skills</CardTitle>
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
                <DialogTitle>Edit Skills</DialogTitle>
              </DialogHeader>
              <EditSkillsForm 
                currentSkills={skills} 
                profileId={profileId} 
                onSuccess={() => setIsEditDialogOpen(false)} 
              />
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent className="p-6">
        {skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="px-3 py-1 text-sm font-medium border border-primary/20 text-primary bg-primary/10 hover:bg-primary/20">
                {skill}
              </Badge>
            ))}
          </div>
        ) : (
            <p className="text-muted-foreground text-center py-4">No skills listed yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
