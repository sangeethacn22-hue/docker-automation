/*
 * n8n-install.js
 * Downloads the n8n Docker image and starts n8n. Nothing is deleted.
 *
 * Run:   node n8n-install.js
 * Open:  http://localhost:5678   (wait about 30-60 seconds after it starts)
 *
 * Needs: Docker running, and Node.js installed.
 */
const { execSync } = require("child_process");

const IMAGE = "n8nio/n8n";
const CONTAINER = "n8n-test";
const VOLUME = "n8n_data"; // keeps your n8n account and workflows between runs
const PORT = 5678;

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

try {
  console.log("Running on machine:", require("os").hostname());

  // Step 1: download (create) the image
  console.log(`\n--- STEP 1: Pulling Docker image '${IMAGE}' ---`);
  run(`docker pull ${IMAGE}`);
  console.log(`SUCCESS: Image '${IMAGE}' is ready.`);

  // Step 2: start n8n (re-use the container if it already exists)
  console.log(`\n--- STEP 2: Starting n8n ---`);
  if (containerExists()) {
    console.log(`Container '${CONTAINER}' already exists, starting it.`);
    run(`docker start ${CONTAINER}`);
  } else {
    run(
      `docker run -d --name ${CONTAINER} -p ${PORT}:5678 -v ${VOLUME}:/home/node/.n8n ${IMAGE}`,
    );
  }

  console.log(`\nSUCCESS: n8n is starting.`);
  console.log(`Wait 30-60 seconds, then open http://localhost:${PORT}`);
  console.log(`To check it is ready: docker logs --tail 5 ${CONTAINER}`);
} catch (error) {
  console.error("An error occurred:", error.message);
  process.exit(1);
}
