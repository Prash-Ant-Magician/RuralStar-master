'use server';

/**
 * @fileOverview AI-powered profile improvement tool for athletes.
 *
 * - improveProfile - A function that provides suggestions on how to improve an athlete's profile.
 * - ImproveProfileInput - The input type for the improveProfile function.
 * - ImproveProfileOutput - The return type for the improveProfile function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImproveProfileInputSchema = z.object({
  profileDescription: z
    .string()
    .describe("The athlete's current profile description."),
  videoQuality: z
    .string()
    .describe("The quality of the athlete's uploaded videos (e.g., resolution, clarity)."),
  informationPresentation: z
    .string()
    .describe(
      'How the athlete presents information on their profile (e.g., organization, completeness).' +
        ' Include any available information about other successful athlete profiles.'
    ),
});
export type ImproveProfileInput = z.infer<typeof ImproveProfileInputSchema>;

const ImproveProfileOutputSchema = z.object({
  descriptionSuggestions: z
    .string()
    .describe('Suggestions for improving the profile description.'),
  videoSuggestions: z
    .string()
    .describe('Suggestions for improving the video quality.'),
  presentationSuggestions: z
    .string()
    .describe(
      'Suggestions for improving the information presentation on the profile.'
    ),
});
export type ImproveProfileOutput = z.infer<typeof ImproveProfileOutputSchema>;

export async function improveProfile(
  input: ImproveProfileInput
): Promise<ImproveProfileOutput> {
  return improveProfileFlow(input);
}

const prompt = ai.definePrompt({
  name: 'improveProfilePrompt',
  input: {schema: ImproveProfileInputSchema},
  output: {schema: ImproveProfileOutputSchema},
  prompt: `You are an AI-powered profile improvement tool designed to help athletes maximize their impact on potential scouts and sponsors.

  Provide specific and actionable suggestions for improving the following aspects of the athlete's profile:

  1.  Profile Description: {{{profileDescription}}}
  2.  Video Quality: {{{videoQuality}}}
  3.  Information Presentation: {{{informationPresentation}}}

  Consider what successful athletes include on their profiles and suggest improvements based on those best practices.

  Provide the suggestions in the following format:

  Description Suggestions: [suggestions for improving the profile description]
  Video Suggestions: [suggestions for improving the video quality]
  Presentation Suggestions: [suggestions for improving the information presentation]`,
});

const improveProfileFlow = ai.defineFlow(
  {
    name: 'improveProfileFlow',
    inputSchema: ImproveProfileInputSchema,
    outputSchema: ImproveProfileOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
