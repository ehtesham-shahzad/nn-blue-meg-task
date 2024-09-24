## Solution

I used an async queue to solve this. This approach is especially helpful if we want to scrape data from an API (by passing it multiple query parameters), and that API has a rate limiter.

### Alternative solutions and their limitations:

We can move in a syncronous manner by awaiting each call.

```Typescript
  for(let i = 0; i< taskList.length; i++){
    await doTask(taskList[i])
  }
```

But this would take a lot of time as the next task will only be executed when the previous task has been completed. And we can only execute one task at a time. This also doesn't fulfil our requrement of executing multiple tasks at once.

We could use `Promise.all()`, and pass in a set number of tasks. The drawback is if anyone of those calls is taking a significant time, it blocks the completed tasks from being released and replaced with new calls.

In the async queue approach, we first load up all tasks in the queue (and can run a few tasks beforehand). And each task is responsible for calling the next task to start executing as soon as it has completed its execution. We can take input from user if they want to increase or decrease number of concurrent tasks, and adjust the number of tasks accordingly.
