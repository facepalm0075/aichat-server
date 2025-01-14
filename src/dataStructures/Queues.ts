import { Stack } from "./Stack";
export class ArrayQueue<QT> {
	private queue: QT[] = [];
	private front: number = 0;
	private rear: number = 0;
	private queueSize: number;
	private count: number = 0;

	constructor(queue_size: number = 5) {
		this.queueSize = queue_size;
	}

	enqueue(item: QT): void | false {
		if (!this.isFull()) {
			this.queue[this.rear] = item;
			this.rear = (this.rear + 1) % this.queueSize;
			this.count++;
		}
		return false;
	}

	dequeue(): QT | false {
		if (!this.isEmpty()) {
			const temp = this.queue[this.front];
			this.queue[this.front] = null;
			this.front = (this.front + 1) % this.queueSize;
			this.count--;
			return temp;
		}
		return false;
	}

	peek(): QT | null {
		if (!this.isEmpty()) {
			const temp = this.queue[this.front];
			return temp;
		}
		return null;
	}

	isEmpty(): boolean {
		return this.count === 0;
	}

	isFull(): boolean {
		return this.count === this.queueSize;
	}

	print() {
		console.log(this.queue);
	}
}

export type StackQueueType<T> = {
	enqueue: (item: T) => void | false;
	dequeue: () => T | false;
	peek: () => T | null;
	isEmpty: () => boolean;
	isFull: () => boolean;
	size: () => number;
};

export class StackQueue<QT> {
	private s1 = new Stack<QT>();
	private s2 = new Stack<QT>();
	private queueSize: number;
	private count: number = 0;

	constructor(queue_size: number = 5) {
		this.queueSize = queue_size;
	}

	enqueue(item: QT): void | false {
		if (!this.isFull()) {
			this.s1.push(item);
			this.count++;
		}
	}

	dequeue(): QT | false {
		if (!this.isEmpty()) {
			if (!this.s2.peek()) {
				const c = this.count;
				for (let i = 0; i < c; i++) {
					if (this.s1.peek()) {
						this.s2.push(this.s1.pop());
					}
				}
			}
			this.count--;
			return this.s2.pop();
		}
		return false;
	}

	peek(): QT | null {
		if (!this.isEmpty()) {
			if (!this.s2.peek()) {
				const c = this.count;
				for (let i = 0; i < c; i++) {
					if (this.s1.peek()) {
						this.s2.push(this.s1.pop());
					}
				}
			}
			return this.s2.peek();
		}
		return null;
	}

	isEmpty(): boolean {
		return this.count === 0;
	}

	size() {
		return this.count;
	}

	isFull(): boolean {
		return this.count === this.queueSize;
	}
}
