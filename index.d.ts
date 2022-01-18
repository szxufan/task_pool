declare class TaskPool<T> extends Array<Promise<T>> {
  limit: number;
  running: object;
  runningNum: number;
  constructor(limit: number);
  // @ts-ignore
  push(...items: Promise<T>[]): Promise<number>;
}
export default TaskPool;
