/*
 * n8n-timed-delete.js
 * Downloads the n8n Docker image, starts n8n, waits 60 minutes, then
 * deletes the container and the image.
 *
 * Run:        node n8n-timed-delete.js
 * Open:       http://localhost:5678   (wait about 30-60 seconds after it starts)
 *
 * Keep this terminal open during the wait. Do not press Ctrl+C, or the
 * delete step will not run.
 *
 * Needs: Docker running, and Node.js installed.
 */
const { execSync } = require("child_process");

const IMAGE = "n8nio/n8n";
const CONTAINER = "n8n-test";
const PORT = 5678;
const WAIT_MINUTES = 60; // fixed: always wait exactly 60 minutes
const WAIT_SECONDS = WAIT_MINUTES * 60;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function run(command) {
  console.log(`\n$ ${command}`);
  execSync(command, { stdio: "inherit" });
}

function containerExists() {
  return (
    execSync(`docker ps -aq --filter name=^/${CONTAINER}$`).toString().trim()
      .length > 0
  );
}

async function main() {
  console.log("Running on machine:", require("os").hostname());
  console.log(`Wait time: ${WAIT_MINUTES} minutes (${WAIT_SECONDS} seconds)`);

  try {
    // Step 1: download (create) the image
    console.log(`\n--- STEP 1: Pulling Docker image '${IMAGE}' ---`);
    run(`docker pull ${IMAGE}`);
    console.log(`SUCCESS: Image '${IMAGE}' is ready.`);

    // Step 2: start n8n (remove any old container with the same name first)
    console.log(`\n--- STEP 2: Starting n8n ---`);
    if (containerExists()) {
      run(`docker rm -f ${CONTAINER}`);
    }
    run(`docker run -d --name ${CONTAINER} -p ${PORT}:5678 ${IMAGE}`);
    console.log(`SUCCESS: n8n is starting.`);
    console.log(`Wait 30-60 seconds, then open http://localhost:${PORT}`);

    // Step 3: wait with a countdown
    console.log(`\n--- STEP 3: Waiting ${WAIT_SECONDS} seconds ---`);
    for (let i = WAIT_SECONDS; i > 0; i--) {
      process.stdout.write(`Time remaining: ${i} seconds...   \r`);
      await sleep(1000);
    }
    console.log("\nDelay completed!                    ");

    // Step 4: delete the container, then the image
    console.log(`\n--- STEP 4: Deleting n8n ---`);
    if (containerExists()) {
      run(`docker rm -f ${CONTAINER}`);
    }
    run(`docker rmi ${IMAGE}`);
    console.log(`SUCCESS: Container and image '${IMAGE}' have been deleted.`);
  } catch (error) {
    console.error("An error occurred:", error.message);
    process.exit(1);
  }
}

main();
