// const taskList = [
//   'A',
//   'B',
//   'C',
//   'D',
//   'E',
//   'F',
//   'G',
//   'H',
//   'I',
//   'J',
//   'K',
//   'L',
//   'M',
//   'N',
//   'O',
//   'P',
//   'Q',
//   'R',
//   'S',
//   'T ',
//   'U',
//   'V',
//   'W',
//   'X',
//   'Y',
//   'Z',
// ];

export var doTask = <T, R>(taskName: T): Promise<R> => {
  var begin = Date.now();
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      var end = Date.now();
      var timeSpent = end - begin + 'ms';
      console.log(
        '\x1b[36m',
        '[TASK] FINISHED: ' + taskName + ' in ' + timeSpent,
        '\x1b[0m',
      );
      resolve(true as R);
    }, Math.random() * 2000);
  });
};
