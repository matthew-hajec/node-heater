import cluster from "cluster";
import { cpus } from "os";
import process from "process";

const numCPUs = cpus().length; // You can subtract a number from here to free up CPUs

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    // Don't retry to avoid an infinite loop
    console.log(`worker ${worker.process.pid} died`);
  });

  const messageHandler = (msg) => {
    console.log(msg);
  };

  for (const id in cluster.workers) {
    cluster.workers[id].on("message", messageHandler);
  }
} else {
  console.log(`Worker ${process.pid} started`);

  let decimalPlace = 1;

  let i = 1;
  while (true) {
    i++;
    if (i % decimalPlace === 0) {
      decimalPlace *= 10;
      process.send(`${process.pid} has reached ${i}`);
    }
  }
}
