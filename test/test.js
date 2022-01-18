const assert = require("assert");
const TaskPool = require("../index");
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function test(sleepTime, limit, count, copies = 1) {
  const wt = new TaskPool(limit);
  const t1 = Date.now();
  for (let i = 0; i < count; i++) {
    const n = [];
    for (let j = 0; j < copies; j++) n.push(sleep(sleepTime).then(() => i));
    await wt.push(...n);
  }
  for (let i = 0; i < wt.length; i++) {
    await wt[i];
  }
  // await Promise.all(wt);
  const cost_time = Date.now() - t1;
  const expect_time_min = Math.floor((sleepTime * count * copies) / limit);
  const expect_time_max =
    expect_time_min + (count * (copies > 1 ? 3 + copies / 10 : 2)) / 10;
  assert(
    cost_time >= expect_time_min,
    `Faster than expected, cost: ${cost_time}ms expect: ${expect_time_min}`
  );
  assert(
    cost_time < expect_time_max,
    `Slower than expected, cost: ${cost_time}ms expect: ${expect_time_max}`
  );
  console.log(
    `cost: ${cost_time}ms expect: ${expect_time_min}~${expect_time_max}ms`
  );
}

sleep(100)
  .then(async () => {
    await test(10, 5, 100);
    await test(10, 6, 100, 2);
    await test(10, 10, 100);
    await test(10, 20, 200, 10);
    await test(10, 40, 200, 20);
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
