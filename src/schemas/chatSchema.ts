import { z } from "zod";

export const getChatsQueriesSchema = z.object({
	roomId: z.string(),
	skip: z.number(),
	take: z.number(),
});
