import { ArraySchema } from '@colyseus/schema';

export class QueueSchema<
  T extends { queueOrder: number; sessionId: string },
> extends ArraySchema<T> {
  enqueue(player: T) {
    player.queueOrder = this.length;
    this.push(player);
  }

  dequeue() {
    if (this.isEmpty()) {
      return;
    }
    const item = this.shift();
    this.updateQueueOrder();
    return item;
  }

  peek() {
    const tmpCopy = Array.from(this);
    return tmpCopy.sort((a, b) => a.queueOrder - b.queueOrder)[0];
  }

  isEmpty() {
    return this.length === 0;
  }

  printQueue() {
    return this.join(' ');
  }

  // method to decrease the queue order of all players
  // and the first player will be the last one
  // just playing with the queue order, not the actual order
  decreaseQueueOrder() {
    this.forEach((player) => {
      console.log('before', {
        sessionId: player.sessionId,
        queueOrder: player.queueOrder,
      });

      if (player.queueOrder === 0) {
        player.queueOrder = this.length - 1;
        console.log('after1', {
          sessionId: player.sessionId,
          queueOrder: player.queueOrder,
        });
      } else {
        player.queueOrder -= 1;
        console.log('after2', {
          sessionId: player.sessionId,
          queueOrder: player.queueOrder,
        });
      }
    });
  }

  moveToEnd(sessionId: string) {
    const player = this.find((p) => p.sessionId === sessionId);

    if (player) {
      player.queueOrder = this.length;
    }
  }
  //
  // decreaseQueueOrder(sessionId: string) {
  //   const index = this.findIndex((p) => p.sessionId === sessionId);
  //   if (index !== -1 && index > 0) {
  //     const temp = this[index - 1];
  //     this[index - 1] = this[index];
  //     this[index] = temp;
  //     this.updateQueueOrder();
  //   }
  // }

  private updateQueueOrder() {
    this.forEach((item, index) => {
      item.queueOrder = index;
    });
  }
}
