const TaskPool = require("../");
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function test() {
  const wt = new TaskPool(5);
  const t1 = Date.now();
  for (let i = 0; i < 100; i++) {
    await wt.push(sleep(100).then(() => i));
    console.log(Date.now() - t1);
  }
  console.log(await Promise.all(wt));
  console.log(Date.now() - t1);
}

test()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
