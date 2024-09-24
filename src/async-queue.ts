import readline from 'node:readline';

export class AsyncQueue {
  // Tasks in the queue waiting to be executed
  private queue: Array<(taskName: string) => Promise<void>>;

  // Total number of running tasks
  private runningTasks: number;

  // Maximum number of tasks that are allowed to execute
  private maxConcurrency: number;

  // Reading line
  private rl: readline.Interface;
  private userInput = '';

  /**
   * Setting values.
   * @param maxConcurrency Set the maximum number of concurrent tasks to execute
   */
  constructor(maxConcurrency: number) {
    this.queue = [];
    this.runningTasks = 0;
    this.maxConcurrency = maxConcurrency;
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    this.initUserInput();
  }

  /**
   * Initializing user input, to change number
   * of concurrent running tasks on the fly.
   */
  initUserInput() {
    const showResults = this.debounce(300);
    /**
     * Assuming user input is a number.
     * To make sure it is always a number, we can add validation like this:
     * https://github.com/micromatch/to-regex-range/pull/17/files
     */
    process.stdin.on('keypress', (c, k) => {
      this.userInput += k['sequence'];
      showResults();
    });
  }

  /**
   * Enqueue tasks that need to be executed
   * @param promiseFactory
   */
  enqueueTasks(
    promiseFactory: <T>() => Promise<T>,
    taskname: string,
    currentCount: number,
    maxCount: number,
  ) {
    const execute = async <T>(): Promise<T> => {
      // Incrementing number of concurrent running tasks
      this.runningTasks++;
      try {
        console.log(
          `[EXE] Concurrency: ${this.runningTasks} of ${this.maxConcurrency}`,
        );
        console.log(`[EXE] Task Count: ${currentCount} of ${maxCount}`);
        console.log('\x1b[31m', `[TASK] STARTING: ${taskname}`);

        // Executing the passed function and waiting for its completion
        return await promiseFactory();
      } catch (error) {
        console.log(error);
        throw error;
      } finally {
        /**
         * Once the task has been completed, decrementing the counter
         * to let the next task to execute
         */
        this.runningTasks--;

        // Executing the next task(s) in the queue
        this.executeTask();
      }
    };

    if (this.runningTasks < this.maxConcurrency) {
      // Executing a few function to fill up our concurrency limit
      return execute();
    } else {
      // Pushing functions to a queue
      this.queue.push(execute);
    }
  }

  /**
   * Dequeue/execute tasks waiting in the queue
   * @returns void
   */
  executeTask() {
    // The 'while' loop makes sure we are filling up our concurrency limit
    while (this.runningTasks < this.maxConcurrency) {
      if (this.queue.length === 0) {
        this.rl.close();
        console.log('All tasks successfully completed.');
        return;
      }

      // Dequeuing function from the array
      const execute = this.queue.shift() as () => Promise<void>;

      // Executing the dequeued function
      execute();
    }
  }

  /**
   * To get user input from command line (and make sure we got the entire input)
   * @param timeout
   * @returns
   */
  private debounce(timeout = 300) {
    let timer: NodeJS.Timeout;
    return () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        // Updating concurrency
        this.maxConcurrency = parseInt(this.userInput, 10);
        console.log(
          '\x1b[37m',
          `**** changing concurrency to ${this.userInput} ****`,
        );
        // Resetting user input
        this.userInput = '';
      }, timeout);
    };
  }
}
