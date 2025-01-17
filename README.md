# AI Chatbot Backend

### Short Description

This is the backend for an AI chatbot that receives user prompts, manages concurrent requests using a queue system, and sequentially sends the prompts to the AI model while streaming the responses back to the user.

Frontend Code: [aichat-platform](https://github.com/facepalm0075/aichat-platform)

## Live Test: [aichat.pouya](https://aichat.pouyaprogramming.ir/)

## Features

- **Configurable Concurrent Users:** Adjust the maximum number of simultaneous users via `/src/routes/queueRoute.ts` AIModelQueue object parameters:

first one is the number of concurrent requests, second one is the queue size

- **Adjustable Queue Size:** Customize the size of the request queue.
- **Task Termination:** Automatically cancels tasks when a user's connection is interrupted.

---

## Tech Stack

- **Node.js**
- **Express**
- **Server-Sent Events (SSE)** for streaming responses.
- **Double Stack Queue** for efficient request management.
- **AI Engine:** Ollama (Llama 3.2)

---

## Prerequisites

- **Node.js**
- **npm**
- **Ollama** running on its default port with at least one LLM installed.

---

## How to Run

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the server:

   ```bash
   npm run start
   ```

3. The server will run on `http://localhost:3002`.

### How It Works

When you send a POST request to the `/queue` endpoint with the following format:

```json
{
	"p": "string"
}
```

- The request is added to the double stack queue.
- If the maximum number of concurrent users has not been reached, the server starts processing the prompt by sending it to the LLM.
- If the maximum number of concurrent users has been reached, returns error: queue is full!
- The text response is streamed back to the user via **Server-Sent Events (SSE)**.
- Once the process is complete, the server moves on to the next item in the queue.
- If the user ends the connection mid-process, the server terminates the connection with Ollama, and Ollama automatically stops generating the response.

### Stream Response Format

The response format of the stream is as follows:

```json
{
	"userId": "string",
	"status": "number",
	"message": "string"
}
```

- **userId**: Not important; can be ignored.
- **status**: Represents the current state:
  - `500`: Queue is full.
  - `201`: You are in the queue.
  - `202`: Your task has started.
  - `203`: Generated data is provided in the `message` field of the response.
  - `200`: Stream ended successfully.

---

### Author

This project was developed by **Pouya Bahmanyar**.
