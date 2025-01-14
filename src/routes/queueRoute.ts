import express, { NextFunction, Request, Response } from "express";
import { StackQueue } from "../dataStructures/Queues";
import http from "http";

type QT = {
	userId: string;
	prompt: string;
	notify: (message: string, status: number, endConnection?: boolean) => void;
	res: Response;
};

class AIModelQueue extends StackQueue<QT> {
	currentUsers: number;
	maxConcurrentUsers: number;

	constructor(maxConcurrentUsers: number, maxQueueSize: number) {
		super(maxQueueSize);
		this.currentUsers = 0;
		this.maxConcurrentUsers = maxConcurrentUsers;
	}

	addUser({ userId, prompt, notify, res }: QT) {
		if (this.isFull()) {
			notify("Queue is full, try later...", 500, true);
			console.log(`User ${userId} removed from queue due its full.`);
		} else {
			this.enqueue({ userId, prompt, notify, res });
			console.log(`User ${userId} added to the queue.`);
			notify("you are in queue. please wait", 201);
			this.processQueue();
		}
	}

	async processQueue() {
		if (this.isEmpty()) {
			return;
		}
		if (this.currentUsers >= this.maxConcurrentUsers) {
			return;
		}

		const { userId, prompt, notify, res } = this.dequeue() || {};
		this.currentUsers++;
		console.log(`User ${userId} is using the AI model. Current users: ${this.currentUsers}`);
		notify("your task is pending...", 202);

		try {
			await generateAIText(userId, prompt, notify, res);
			console.log(`User ${userId} finished using the AI model.`);
		} catch (error) {
			console.error(`Error for user ${userId}:`, error);
			notify(`An error occurred while processing your task: ${error.message}`, 500, true);
		} finally {
			this.currentUsers--;
			this.processQueue();
		}
	}
}

const generateAIText = async (
	userId: string,
	prompt: string,
	notify: (message: string, status: number, endConnection?: boolean) => void,
	res: Response
): Promise<string> => {
	const options = {
		hostname: "localhost",
		port: 11434,
		path: "/api/generate",
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
	};
	const payload = JSON.stringify({
		model: "llama3.2:3b",
		prompt: prompt,
	});

	let ollamaRes: null | http.IncomingMessage = null;

	res.on("close", () => {
		if (ollamaRes) {
			ollamaRes.destroy();
			console.log(userId + " closed the response");
		}
	});

	let buffer = "";
	return new Promise((resolve) => {
		const ollamaRequest = http.request(options, (ollamaResponse) => {
			ollamaRes = ollamaResponse;
			ollamaResponse.on("data", (chunk) => {
				buffer += chunk.toString();
				try {
					const parsedData = JSON.parse(buffer);
					notify(parsedData.response, 203);
					buffer = "";
				} catch (err) {
					console.log("parse error");
				}
			});

			ollamaResponse.on("end", () => {
				notify("stream ended succsessfully", 200, true);
				console.log(userId + "`s stream ended succsessfully");
			});
			ollamaResponse.on("close", () => {
				console.log(userId + "`s ai response closed");
				resolve("");
			});
		});

		ollamaRequest.on("error", (err) => {
			console.error("Error communicating with Ollama:", err);
			notify("Error communicating with Ollama", 500);
			resolve("");
		});

		ollamaRequest.write(payload);
		ollamaRequest.end();
	});
};

type bodyType = {
	p: string;
};

type customReq = {
	prompt: string;
	userId: string;
} & Request<{}, {}, bodyType, {}>;

const router = express.Router();
router.use(express.json());
router.use((req: customReq, res: Response, next: NextFunction) => {
	const { p } = req.body;
	if (!p)
		return res
			.status(400)
			.json({ error: "bad input", message: "body item 'p' not found!" }) as unknown as void;
	req.prompt = p;
	req.userId = `User-${JSON.stringify(Date.now())}`;
	next();
});

const aiQueue = new AIModelQueue(1, 1);

router.post("/", (req: customReq, res: Response) => {
	res.setHeader("Content-Type", "text/event-stream");
	res.setHeader("Cache-Control", "no-cache");
	res.setHeader("Connection", "keep-alive");

	const userId = req.userId;
	const prompt = req.prompt;

	const notify = (message: string, status: number, endConnection = false) => {
		const data = JSON.stringify({ userId, status, message });
		res.write(data + "||n||");
		if (endConnection) {
			res.end();
		}
	};

	try {
		aiQueue.addUser({ userId, prompt, notify, res });
	} catch (error) {
		notify(`An error occurred: ${error.message}`, 500, true);
	}
});
export { router as queueRouter };
