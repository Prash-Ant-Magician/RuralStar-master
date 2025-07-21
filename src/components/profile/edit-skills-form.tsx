
"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Loader2 } from "lucide-react";
import { updateProfile } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

type EditSkillsFormProps = {
  currentSkills: string[];
  profileId: string;
  onSuccess: () => void;
};

export function EditSkillsForm({ currentSkills, profileId, onSuccess }: EditSkillsFormProps) {
  const [skills, setSkills] = useState([...currentSkills]);
  const [newSkill, setNewSkill] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const handleAddSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("uid", profileId);
    formData.append("skills", JSON.stringify(skills));

    try {
      await updateProfile(formData);
      toast({
        title: "Success!",
        description: "Your skills have been updated.",
      });
      onSuccess();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update skills.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Skills</label>
        <div className="flex flex-wrap gap-2 rounded-md border p-2 min-h-[40px]">
          {skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="px-2 py-1 text-sm">
              {skill}
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="ml-2 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Input
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a new skill"
        />
        <Button type="button" onClick={handleAddSkill}>
          Add
        </Button>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Skills"}
      </Button>
    </form>
  );
}
