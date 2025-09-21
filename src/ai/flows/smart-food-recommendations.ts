'use server';

/**
 * @fileOverview AI-powered food recommendation flow based on the current cart contents.
 *
 * - getSmartFoodRecommendations - A function that returns complementary food recommendations based on items in the cart.
 * - SmartFoodRecommendationsInput - The input type for the getSmartFoodRecommendations function.
 * - SmartFoodRecommendationsOutput - The return type for the getSmartFoodRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartFoodRecommendationsInputSchema = z.object({
  cartItems: z
    .array(z.string())
    .describe('List of item names currently in the user\'s cart.'),
});
export type SmartFoodRecommendationsInput = z.infer<
  typeof SmartFoodRecommendationsInputSchema
>;

const SmartFoodRecommendationsOutputSchema = z.object({
  recommendations: z
    .array(z.string())
    .describe('List of recommended item names to add to the cart.'),
});
export type SmartFoodRecommendationsOutput = z.infer<
  typeof SmartFoodRecommendationsOutputSchema
>;

export async function getSmartFoodRecommendations(
  input: SmartFoodRecommendationsInput
): Promise<SmartFoodRecommendationsOutput> {
  return smartFoodRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartFoodRecommendationsPrompt',
  input: {schema: SmartFoodRecommendationsInputSchema},
  output: {schema: SmartFoodRecommendationsOutputSchema},
  prompt: `You are a food recommendation expert. Given the current items in the user's cart, suggest additional items that would complement their meal.

Cart Items: {{#each cartItems}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Recommendations:`,
});

const smartFoodRecommendationsFlow = ai.defineFlow(
  {
    name: 'smartFoodRecommendationsFlow',
    inputSchema: SmartFoodRecommendationsInputSchema,
    outputSchema: SmartFoodRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
