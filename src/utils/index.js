const req = {
  get(key, cb = () => {}) {
    const item = localStorage.getItem(key);
    cb();
    return item;
  },
  post(key, val, cb) {
    localStorage.setItem(req.magicLetter + String(key), val);
    cb();
  },
  entries: Object.keys(localStorage).filter((i) => i.length < 5),
  values: () => req.entries.forEach((key) => {
    let comp = 0;
    let nonComp = 0;
    const isCompleted = JSON.parse(localStorage[key]).hasOwnProperty(
      'is_completed',
    );

    isCompleted ? comp++ : nonComp++;
    req.countTrue = comp;
    req.countFalse = nonComp;
  }),
  count: Object.keys(localStorage).filter((i) => i.length < 5).length,
  countTrue: 0,
  countFalse: 0,
  magicLetter: 'b',
};

export { req as fakeAxios };
