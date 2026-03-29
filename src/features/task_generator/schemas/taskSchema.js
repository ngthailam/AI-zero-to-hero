import { z } from "zod";

export const taskSchema = z.object({
  epicTitle: z.string(),
  epicDescription: z.string(),
  userStories: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      tasks: z.array(
        z.object({
          title: z.string(),
          description: z.string(),
        })
      ),
      acceptanceCriteria: z.array(z.string()),
    })
  ),
});