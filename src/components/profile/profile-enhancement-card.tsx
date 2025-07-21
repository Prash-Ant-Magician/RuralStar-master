"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getProfileSuggestions } from "@/app/actions";
import type { ImproveProfileOutput } from "@/ai/flows/profile-improvement-tool";
import { Loader2, Sparkles, FileText, Video, ThumbsUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  profileDescription: z.string().min(50, "Please provide a more detailed description (at least 50 characters)."),
  videoQuality: z.string().nonempty("Please select a video quality."),
  informationPresentation: z.string().min(20, "Please describe your information presentation (at least 20 characters)."),
});

type FormValues = z.infer<typeof formSchema>;

type ProfileEnhancementCardProps = {
    profileData: {
        profileDescription: string;
        videoQuality: string;
        informationPresentation: string;
    }
}

export function ProfileEnhancementCard({ profileData }: ProfileEnhancementCardProps) {
  const [suggestions, setSuggestions] = useState<ImproveProfileOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      profileDescription: profileData.profileDescription || "",
      videoQuality: profileData.videoQuality || "",
      informationPresentation: profileData.informationPresentation || "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setSuggestions(null);
    try {
      const result = await getProfileSuggestions(data);
      setSuggestions(result);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get AI suggestions. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="sticky top-24 shadow-lg transition-shadow hover:shadow-xl">
      <CardHeader>
        <div className="flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-primary" />
            <div>
                <CardTitle className="font-headline text-2xl">AI Profile Coach</CardTitle>
                <CardDescription>Get AI-powered tips to improve your profile.</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="profileDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Profile Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Passionate soccer player..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="videoQuality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video Quality</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select video quality" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Excellent">Excellent (4K, stable)</SelectItem>
                      <SelectItem value="Good">Good (1080p, mostly stable)</SelectItem>
                      <SelectItem value="Average">Average (720p, some issues)</SelectItem>
                      <SelectItem value="Poor">Poor (Low resolution, shaky)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="informationPresentation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Information Presentation</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., All sections are filled out..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <Button type="submit" className="w-full bg-accent hover:bg-accent/90" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Get Suggestions"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      {suggestions && (
        <CardFooter className="flex-col items-start gap-4">
           <Alert variant="default" className="bg-primary/5 border-primary/20">
              <ThumbsUp className="h-4 w-4 text-primary" />
              <AlertTitle className="font-bold text-primary">Here are your AI-powered suggestions!</AlertTitle>
              <AlertDescription>
                Use these tips to make your profile stand out.
              </AlertDescription>
            </Alert>

          <Accordion type="single" collapsible className="w-full" defaultValue="description">
            <AccordionItem value="description">
              <AccordionTrigger className="font-semibold"><FileText className="mr-2 h-4 w-4 text-primary"/>Description Suggestions</AccordionTrigger>
              <AccordionContent className="text-foreground/80">{suggestions.descriptionSuggestions}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="video">
              <AccordionTrigger className="font-semibold"><Video className="mr-2 h-4 w-4 text-primary"/>Video Suggestions</AccordionTrigger>
              <AccordionContent className="text-foreground/80">{suggestions.videoSuggestions}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="presentation">
              <AccordionTrigger className="font-semibold"><Sparkles className="mr-2 h-4 w-4 text-primary"/>Presentation Suggestions</AccordionTrigger>
              <AccordionContent className="text-foreground/80">{suggestions.presentationSuggestions}</AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardFooter>
      )}
    </Card>
  );
}
