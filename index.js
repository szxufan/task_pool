class TaskPool extends Array {
  constructor(limit = 10) {
    super();
    this.limit = limit;
    this.running = {};
    this.runningNum = 0;
  }
  async push(n) {
    const i = this.length;
    super.push(n);
    this.running[i] = n.then(() => i);
    this.runningNum++;
    if (this.runningNum >= this.limit) {
      const r = await Promise.race(Object.values(this.running));
      delete this.running[r];
      this.runningNum--;
    }
  }
}

module.exports = TaskPool;
