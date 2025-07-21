
import { 
    db 
} from './config';
import {
    collection,
    addDoc,
    serverTimestamp,
    query,
    orderBy,
    getDocs,
    doc,
    getDoc,
    where,
    updateDoc,
    onSnapshot,
    Timestamp,
    increment,
    writeBatch,
} from "firebase/firestore";

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  sport?: string;
  location?: string;
  followers?: number;
  following?: number;
  bio?: string;
  skills?: string[];
  achievements?: any[];
  videos?: any[];
  aiCardData?: any;
}

export interface Post {
    id: string;
    authorId: string;
    title: string;
    content: string;
    postType: "achievement" | "update" | "photo" | "video";
    mediaUrl?: string;
    mediaAiHint?: string;
    timestamp: any;
    likes: number;
    comments: number;
}

export interface PostWithAuthor extends Omit<Post, 'authorId' | 'timestamp'> {
  athlete: {
    id: string;
    name: string;
    sport: string;
    avatarUrl: string;
    dataAiHint?: string;
  };
  timestamp: string; // Convert server timestamp to string for client
}

export interface Message {
    id: string;
    senderId: string;
    text: string;
    timestamp: Timestamp;
}

export interface Conversation {
    id: string;
    participants: UserProfile[];
    lastMessage: string;
    lastMessageTimestamp: Timestamp;
    unreadCounts: { [key: string]: number };
}


export async function createPost(postData: {
    authorId: string,
    title: string,
    content: string,
    postType: "achievement" | "update" | "photo" | "video";
}) {
    try {
        const postsCollection = collection(db, "posts");
        await addDoc(postsCollection, {
            ...postData,
            timestamp: serverTimestamp(),
            likes: 0,
            comments: 0
        });
    } catch (error) {
        console.error("Error creating post:", error);
        throw error;
    }
}

export async function getUser(uid: string): Promise<UserProfile | null> {
    try {
        const userDocRef = doc(db, "users", uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            return { uid: userDoc.id, ...userDoc.data() } as UserProfile;
        } else {
            console.log("No such user!");
            return null;
        }
    } catch (error) {
        console.error("Error getting user:", error);
        throw error;
    }
}


export async function getPosts(): Promise<PostWithAuthor[]> {
    try {
        const postsCollection = collection(db, "posts");
        const q = query(postsCollection, orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        
        const posts: PostWithAuthor[] = [];

        for (const doc of querySnapshot.docs) {
            const postData = doc.data() as Omit<Post, 'id' | 'timestamp'> & { timestamp: any };
            const author = await getUser(postData.authorId);

            if (author) {
                 posts.push({
                    id: doc.id,
                    title: postData.title,
                    content: postData.content,
                    postType: postData.postType,
                    mediaUrl: postData.mediaUrl,
                    mediaAiHint: postData.mediaAiHint,
                    comments: postData.comments,
                    likes: postData.likes,
                    timestamp: postData.timestamp?.toDate().toLocaleDateString() || new Date().toLocaleDateString(),
                    athlete: {
                        id: author.uid,
                        name: author.displayName,
                        sport: author.sport || 'Unknown Sport',
                        avatarUrl: author.photoURL || "https://placehold.co/128x128.png",
                        dataAiHint: "athlete portrait",
                    },
                });
            }
        }
        return posts;
    } catch (error) {
        console.error("Error getting posts:", error);
        throw error;
    }
}

export async function getUserPosts(uid: string): Promise<PostWithAuthor[]> {
    try {
        const postsCollection = collection(db, "posts");
        const q = query(postsCollection, where("authorId", "==", uid), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);

        const posts: PostWithAuthor[] = [];
        const author = await getUser(uid);

        if (!author) {
            return [];
        }

        for (const doc of querySnapshot.docs) {
             const postData = doc.data() as Omit<Post, 'id' | 'timestamp'> & { timestamp: any };
             posts.push({
                id: doc.id,
                title: postData.title,
                content: postData.content,
                postType: postData.postType,
                mediaUrl: postData.mediaUrl,
                mediaAiHint: postData.mediaAiHint,
                comments: postData.comments,
                likes: postData.likes,
                timestamp: postData.timestamp?.toDate().toLocaleDateString() || new Date().toLocaleDateString(),
                athlete: {
                    id: author.uid,
                    name: author.displayName,
                    sport: author.sport || 'Unknown Sport',
                    avatarUrl: author.photoURL || "https://placehold.co/128x128.png",
                    dataAiHint: "user avatar",
                },
            });
        }
        return posts;
    } catch (error) {
        console.error("Error getting user posts:", error);
        throw error;
    }
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>) {
    try {
        const userDocRef = doc(db, "users", uid);
        await updateDoc(userDocRef, data);
    } catch (error) {
        console.error("Error updating user profile:", error);
        throw error;
    }
}


// --- Messaging Functions ---

export async function getConversationsForUser(userId: string): Promise<Conversation[]> {
    const conversationsCol = collection(db, 'conversations');
    const q = query(conversationsCol, where('participantIds', 'array-contains', userId), orderBy('lastMessageTimestamp', 'desc'));
    
    const snapshot = await getDocs(q);
    const conversations: Conversation[] = [];

    for (const doc of snapshot.docs) {
        const data = doc.data();
        const participantIds = data.participantIds as string[];

        const participants: UserProfile[] = [];
        for (const id of participantIds) {
            const user = await getUser(id);
            if (user) {
                participants.push(user);
            }
        }

        conversations.push({
            id: doc.id,
            participants,
            lastMessage: data.lastMessage,
            lastMessageTimestamp: data.lastMessageTimestamp,
            unreadCounts: data.unreadCounts || {}
        });
    }

    return conversations;
}

export function getMessagesForConversation(conversationId: string, onMessagesUpdate: (messages: Message[]) => void): () => void {
    const messagesCol = collection(db, 'conversations', conversationId, 'messages');
    const q = query(messagesCol, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const messages: Message[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
        onMessagesUpdate(messages);
    });

    return unsubscribe;
}

export async function sendMessage(conversationId: string, senderId: string, text: string) {
    const batch = writeBatch(db);

    // 1. Add new message to the messages subcollection
    const messagesCol = collection(db, 'conversations', conversationId, 'messages');
    const newMessageRef = doc(messagesCol);
    batch.set(newMessageRef, {
        senderId,
        text,
        timestamp: serverTimestamp(),
    });

    // 2. Update the parent conversation document
    const conversationRef = doc(db, 'conversations', conversationId);
    const convoDoc = await getDoc(conversationRef);
    if (!convoDoc.exists()) {
        throw new Error("Conversation not found!");
    }
    const conversationData = convoDoc.data();
    const otherParticipantId = conversationData.participantIds.find((id: string) => id !== senderId);

    const updateData: { [key: string]: any } = {
        lastMessage: text,
        lastMessageTimestamp: serverTimestamp(),
        [`unreadCounts.${otherParticipantId}`]: increment(1),
    };

    batch.update(conversationRef, updateData);

    await batch.commit();
}


export async function markConversationAsRead(conversationId: string, userId: string) {
    const conversationRef = doc(db, 'conversations', conversationId);
    await updateDoc(conversationRef, {
        [`unreadCounts.${userId}`]: 0
    });
}

export async function getOrCreateConversation(currentUserId: string, otherUserId: string): Promise<string> {
    const conversationsCol = collection(db, 'conversations');
    
    // Check for an existing conversation
    const q = query(
        conversationsCol,
        where('participantIds', 'array-contains', currentUserId)
    );
    const snapshot = await getDocs(q);
    
    for (const doc of snapshot.docs) {
        const data = doc.data();
        if (data.participantIds.includes(otherUserId)) {
            // Found existing conversation
            return doc.id;
        }
    }

    // No existing conversation, so create a new one
    const newConversationData = {
        participantIds: [currentUserId, otherUserId],
        lastMessage: "Conversation started",
        lastMessageTimestamp: serverTimestamp(),
        unreadCounts: {
            [currentUserId]: 0,
            [otherUserId]: 0,
        },
    };

    const newConversationRef = await addDoc(conversationsCol, newConversationData);
    return newConversationRef.id;
}
