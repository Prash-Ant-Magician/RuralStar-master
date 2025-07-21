
"use server";

import { improveProfile, ImproveProfileInput, ImproveProfileOutput } from "@/ai/flows/profile-improvement-tool";
import { createPost as createPostInDb, updateUserProfile, getConversationsForUser, getMessagesForConversation, sendMessage as sendMessageToDb, markConversationAsRead, getOrCreateConversation as getOrCreateConversationInDb, getPosts as getPostsFromDb, PostWithAuthor } from "@/lib/firebase/firestore";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ImproveProfileInputSchema = z.object({
  profileDescription: z.string(),
  videoQuality: z.string(),
  informationPresentation: z.string(),
});

export async function getProfileSuggestions(
  input: ImproveProfileInput
): Promise<ImproveProfileOutput> {
  const validatedInput = ImproveProfileInputSchema.safeParse(input);

  if (!validatedInput.success) {
    throw new Error("Invalid input");
  }

  try {
    const suggestions = await improveProfile(validatedInput.data);
    return suggestions;
  } catch (error) {
    console.error("Error getting profile suggestions:", error);
    throw new Error("Failed to get suggestions from the AI model.");
  }
}

const CreatePostInputSchema = z.object({
    authorId: z.string(),
    title: z.string().min(1, "Title is required."),
    content: z.string().optional(),
    postType: z.enum(["achievement", "update", "photo", "video"]),
    mediaUrl: z.string().optional(),
    mediaAiHint: z.string().optional(),
});

export async function createPost(formData: FormData) {
    const rawData: Record<string, any> = {
        authorId: formData.get('authorId'),
        title: formData.get('title'),
        content: formData.get('content') || "",
        postType: formData.get('postType'),
    };
    
    const mediaFile = formData.get('media') as File;

    if (mediaFile && mediaFile.size > 0) {
      // Convert file to data URI
      const arrayBuffer = await mediaFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const dataURI = `data:${mediaFile.type};base64,${buffer.toString('base64')}`;
      rawData.mediaUrl = dataURI;
      rawData.mediaAiHint = 'user uploaded content';
    }


    const validatedFields = CreatePostInputSchema.safeParse(rawData);

    if (!validatedFields.success) {
        console.error(validatedFields.error.flatten().fieldErrors);
        throw new Error("Invalid post data");
    }

    try {
        await createPostInDb(validatedFields.data as any);
        revalidatePath("/");
        revalidatePath(`/profile/${validatedFields.data.authorId}`);
    } catch (error) {
        console.error("Error creating post:", error);
        throw new Error("Failed to create post.");
    }
}

const UpdateProfileInputSchema = z.object({
    uid: z.string(),
    displayName: z.string().min(2, "Name must be at least 2 characters.").optional(),
    sport: z.string().min(2, "Sport must be at least 2 characters.").optional(),
    location: z.string().min(2, "Location must be at least 2 characters.").optional(),
    bio: z.string().optional(),
    skills: z.array(z.string()).optional(),
    achievements: z.array(z.object({
        id: z.number(),
        title: z.string(),
        year: z.string(),
        icon: z.enum(["Trophy", "Star", "Heart", "FileText"]),
    })).optional(),
    videos: z.array(z.object({
        id: z.number(),
        title: z.string(),
        thumbnailUrl: z.string().url(),
        dataAiHint: z.string(),
    })).optional(),
})

export async function updateProfile(formData: FormData) {
    const rawData: Record<string, any> = {
        uid: formData.get('uid'),
    }

    // This is a bit more complex now since different forms submit different data
    if (formData.has('displayName')) rawData.displayName = formData.get('displayName');
    if (formData.has('sport')) rawData.sport = formData.get('sport');
    if (formData.has('location')) rawData.location = formData.get('location');
    if (formData.has('bio')) rawData.bio = formData.get('bio');
    if (formData.has('skills')) rawData.skills = JSON.parse(formData.get('skills') as string);
    if (formData.has('achievements')) rawData.achievements = JSON.parse(formData.get('achievements') as string);
    if (formData.has('videos')) rawData.videos = JSON.parse(formData.get('videos') as string);
    
    const validatedFields = UpdateProfileInputSchema.safeParse(rawData);
    
    if (!validatedFields.success) {
        console.error(validatedFields.error.flatten().fieldErrors);
        throw new Error("Invalid profile data");
    }

    try {
        await updateUserProfile(validatedFields.data.uid, validatedFields.data);
        revalidatePath(`/profile/${validatedFields.data.uid}`);
        revalidatePath('/messages');
    } catch (error) {
        console.error("Error updating profile:", error);
        throw new Error("Failed to update profile.");
    }
}

// Actions for messaging
export async function getConversations(userId: string) {
    return getConversationsForUser(userId);
}

const SendMessageSchema = z.object({
    conversationId: z.string(),
    senderId: z.string(),
    text: z.string().min(1),
});

export async function sendMessage(formData: FormData) {
    const validatedFields = SendMessageSchema.safeParse({
        conversationId: formData.get('conversationId'),
        senderId: formData.get('senderId'),
        text: formData.get('text'),
    });

    if (!validatedFields.success) {
        throw new Error("Invalid message data");
    }

    try {
        await sendMessageToDb(validatedFields.data.conversationId, validatedFields.data.senderId, validatedFields.data.text);
        revalidatePath(`/messages`); // Revalidate to update last message
    } catch (error) {
        console.error("Error sending message:", error);
        throw new Error("Failed to send message.");
    }
}

export async function markAsRead(conversationId: string, userId: string) {
    try {
        await markConversationAsRead(conversationId, userId);
        revalidatePath('/messages');
    } catch (error) {
        console.error("Error marking conversation as read", error);
    }
}


const GetOrCreateConversationSchema = z.object({
    currentUserId: z.string(),
    otherUserId: z.string(),
});

export async function getOrCreateConversation(currentUserId: string, otherUserId: string): Promise<{ conversationId: string }> {
    const validatedInput = GetOrCreateConversationSchema.safeParse({ currentUserId, otherUserId });

    if (!validatedInput.success) {
        throw new Error("Invalid user IDs");
    }

    try {
        const conversationId = await getOrCreateConversationInDb(currentUserId, otherUserId);
        return { conversationId };
    } catch (error) {
        console.error("Error getting or creating conversation:", error);
        throw new Error("Failed to get or create conversation.");
    }
}

export async function getPostsAction(): Promise<PostWithAuthor[]> {
    try {
        const posts = await getPostsFromDb();
        return posts;
    } catch (error) {
        console.error("Error fetching posts:", error);
        return [];
    }
}
