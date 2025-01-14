type node<NT> = {
	value: NT;
	next: node<NT> | null;
};
export class LinkedList<LT> {
	private head: node<LT> = null;

	push = (item: LT) => {
		const newNode: node<LT> = { value: item, next: this.head };
		this.head = newNode;
	};

	pop = (): LT | null => {
		if (this.head !== null) {
			let current = this.head;
			let temp = current;
			this.head = current.next;
			return temp.value;
		}

		return null;
	};

	peek = (): LT | null => {
		return this.head !== null ? this.head.value : null;
	};

	print = () => {
		if (this.head) {
			let current = this.head;
			let strOut = "[";
			while (current !== null) {
				strOut += current.value + ", ";
				current = current.next;
			}
			strOut = strOut.slice(0, -2) + "]";
			console.log(strOut);
		} else {
			console.log("[]");
		}
	};
}
