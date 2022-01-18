class TaskPool extends Array {
  constructor(limit = 10) {
    super();
    this.limit = limit;
    this.running = {};
    this.runningNum = 0;
  }
  async push(...items) {
    for (let i = 0; i < items.length; i++) {
      const n = items[i];
      const length = this.length;
      super.push(n);
      this.running[length] = n.then(() => length);
      this.runningNum++;
      if (this.runningNum >= this.limit) {
        const r = await Promise.race(Object.values(this.running));
        delete this.running[r];
        this.runningNum--;
      }
    }
    return this.length;
  }
}

module.exports = TaskPool;
