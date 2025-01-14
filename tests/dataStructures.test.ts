import { LinkedList } from "../src/dataStructures/LinkedList";
import { Stack } from "../src/dataStructures/Stack";
import { ArrayQueue, StackQueue } from "../src/dataStructures/Queues";

describe("Data Structures", () => {
	it("Stack", () => {
		const stack = new Stack<number>();
		stack.push(1);
		stack.push(2);
		stack.push(3);
		expect(stack.pop()).toBe(3);
		expect(stack.peek()).toBe(2);
	});

	it("Linked List", () => {
		const list = new LinkedList<number>();
		list.push(1);
		list.push(2);
		list.push(3);
		expect(list.pop()).toBe(3);
		expect(list.peek()).toBe(2);
	});

	it("Array Queue", () => {
		const queue = new ArrayQueue<number>(3);
		queue.enqueue(10);
		queue.enqueue(20);
		queue.enqueue(30);
		queue.enqueue(40);
		expect(queue.dequeue()).toBe(10);
		expect(queue.peek()).toBe(20);
	});

	it("Double-Stack Queue", () => {
		const queue = new StackQueue<number>(3);
		queue.enqueue(10);
		queue.enqueue(20);
		queue.enqueue(30);
		queue.enqueue(40);
		expect(queue.dequeue()).toBe(10);
		expect(queue.peek()).toBe(20);
	});
});
