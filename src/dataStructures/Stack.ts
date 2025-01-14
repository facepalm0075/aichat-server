import { LinkedList } from "./LinkedList";

export class Stack<ST> {
	private list = new LinkedList<ST>();
	push(item: ST) {
		this.list.push(item);
	}
	pop() {
		return this.list.pop();
	}
	peek() {
		return this.list.peek();
	}
	print() {
		this.list.print();
	}
}
