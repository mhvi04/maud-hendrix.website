import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const articles = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/articles" }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    date: z.string(),
    tag: z.string(),
    draft: z.boolean().optional().default(false),
    faq: z
      .array(z.object({ question: z.string(), answer: z.string() }))
      .optional(),
    // Alleen gezet wanneer dit artikel dezelfde kernthematiek/data behandelt
    // als een ander artikel op de site — voorkomt keyword-kannibalisatie door
    // de canonical naar de hoofdversie te laten wijzen.
    canonicalPath: z.string().optional(),
  }),
});

const resellerGidsen = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/reseller-gidsen" }),
  schema: z.object({
    // Expliciete slug: de glob-loader gebruikt dit veld letterlijk als entry.id
    // (zie generateIdDefault in astro/content/loaders/glob.js), zonder te
    // slugifiëren. Laat de bestandsnaam afwijken van de uiteindelijke route.
    slug: z.string(),
    title: z.string(),
    excerpt: z.string(),
    date: z.string(),
    author: z.string().default("Maud Hendrix"),
    tag: z.string().default("VintieBulk"),
    draft: z.boolean().optional().default(false),
    // Alleen gezet wanneer deze gids dezelfde content is als een bestaand
    // artikel elders op de site — voorkomt duplicate content door de
    // canonical naar de hoofdversie te laten wijzen.
    canonicalPath: z.string().optional(),
  }),
});

export const collections = { articles, resellerGidsen };
