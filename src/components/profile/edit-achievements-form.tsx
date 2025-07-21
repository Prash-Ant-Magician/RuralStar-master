
"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash, Loader2, PlusCircle } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { updateProfile } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import type { Achievement } from "./achievements-card";

type EditAchievementsFormProps = {
  currentAchievements: Achievement[];
  profileId: string;
  onSuccess: () => void;
};

const achievementSchema = z.object({
  title: z.string().min(1, "Title is required"),
  year: z.string().min(4, "Year is required"),
  icon: z.enum(["Trophy", "Star", "Heart", "FileText"]),
});

const formSchema = z.object({
  achievements: z.array(achievementSchema),
});

export function EditAchievementsForm({ currentAchievements, profileId, onSuccess }: EditAchievementsFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      achievements: currentAchievements,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "achievements",
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const achievementsWithId = data.achievements.map((ach, index) => ({ ...ach, id: Date.now() + index }))

    const formData = new FormData();
    formData.append("uid", profileId);
    formData.append("achievements", JSON.stringify(achievementsWithId));

    try {
      await updateProfile(formData);
      toast({
        title: "Success!",
        description: "Your achievements have been updated.",
      });
      onSuccess();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update achievements.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="max-h-[400px] overflow-y-auto space-y-4 pr-2">
          {fields.map((field, index) => (
            <div key={field.id} className="p-4 border rounded-md relative">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name={`achievements.${index}.title`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl><Input placeholder="e.g., State Championship MVP" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`achievements.${index}.year`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year</FormLabel>
                        <FormControl><Input placeholder="e.g., 2023" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`achievements.${index}.icon`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Icon</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select an icon" /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="Trophy">Trophy</SelectItem>
                                <SelectItem value="Star">Star</SelectItem>
                                <SelectItem value="Heart">Heart</SelectItem>
                                <SelectItem value="FileText">Certificate</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => remove(index)}>
                <Trash className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => append({ id: Date.now(), title: "", year: "", icon: "Trophy" })}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Achievement
        </Button>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Achievements"}
        </Button>
      </form>
    </Form>
  );
}
