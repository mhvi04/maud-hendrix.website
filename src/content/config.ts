import { defineCollection, z } from "astro:content";

const articles = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    date: z.string(),
    tag: z.string(),
    world: z.enum(["pro", "prive"]),
    draft: z.boolean().optional().default(false),
  }),
});

export const collections = { articles };
