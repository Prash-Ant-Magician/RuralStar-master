
"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash, Loader2, PlusCircle } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { updateProfile } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import type { VideoData } from "./videos-card";

type EditVideosFormProps = {
  currentVideos: VideoData[];
  profileId: string;
  onSuccess: () => void;
};

const videoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  thumbnailUrl: z.string().url("Must be a valid URL"),
});

const formSchema = z.object({
  videos: z.array(videoSchema),
});

export function EditVideosForm({ currentVideos, profileId, onSuccess }: EditVideosFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      videos: currentVideos.map(v => ({title: v.title, thumbnailUrl: v.thumbnailUrl})),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "videos",
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    // We need to add back id and dataAiHint
    const videosToSave = data.videos.map((video, index) => ({
      id: Date.now() + index,
      title: video.title,
      thumbnailUrl: video.thumbnailUrl,
      dataAiHint: "video", // Generic hint for now
    }));

    const formData = new FormData();
    formData.append("uid", profileId);
    formData.append("videos", JSON.stringify(videosToSave));

    try {
      await updateProfile(formData);
      toast({
        title: "Success!",
        description: "Your videos have been updated.",
      });
      onSuccess();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update videos.",
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
                  name={`videos.${index}.title`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Video Title</FormLabel>
                      <FormControl><Input placeholder="e.g., Season Highlights" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`videos.${index}.thumbnailUrl`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thumbnail URL</FormLabel>
                      <FormControl><Input placeholder="https://placehold.co/600x400.png" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
          onClick={() => append({ title: "", thumbnailUrl: "" })}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Video
        </Button>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Videos"}
        </Button>
      </form>
    </Form>
  );
}
