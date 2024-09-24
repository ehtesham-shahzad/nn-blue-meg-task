import { AsyncQueue } from './async-queue';
import { doTask } from './tasks';

function main(): void {
  const numberOfTasks = 200;
  const concurrencyMax = 10;
  const taskList = [...Array(numberOfTasks)].map(() =>
    [...Array(~~(Math.random() * 10 + 3))]
      .map(() => String.fromCharCode(Math.random() * (123 - 97) + 97))
      .join(''),
  );
  console.log('[init] Concurrency Algo Testing...');
  console.log('[init] Tasks to process: ', taskList.length);
  console.log('[init] Task list: ' + taskList);
  console.log('[init] Maximum Concurrency: ', concurrencyMax, '\n');

  manageConcurrency(taskList, concurrencyMax);
  return;
}

function manageConcurrency(taskList: string[], concurrencyMax: number) {
  // Initializng an async queue
  const asyncQueue = new AsyncQueue(concurrencyMax);
  for (let i = 0; i < taskList.length; i++) {
    /**
     * Passing the following properties to the queue
     * 1. A callback function (task)
     * 2. Task name
     * 3. Task number
     * 4. Total number of tasks
     */
    asyncQueue.enqueueTasks(
      () => doTask(taskList[i]),
      taskList[i],
      i + 1,
      taskList.length,
    );
  }
}

main();
