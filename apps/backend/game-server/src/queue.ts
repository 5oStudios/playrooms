import { ArraySchema } from '@colyseus/schema';

export class QueueSchema<T> extends ArraySchema<T> {
  private readonly frontIndex: number;

  constructor() {
    super();
    this.frontIndex = 0;
  }

  enqueue(item: any) {
    this.push(item);
    return item;
  }

  dequeue() {
    if (this.isEmpty()) {
      return 'Underflow';
    }
    const item = this[this.frontIndex];
    this.splice(this.frontIndex, 1);
    return item;
  }

  peek() {
    return this[this.frontIndex];
  }

  isEmpty() {
    return this.length === 0;
  }

  printQueue() {
    return this.join(' ');
  }
}
