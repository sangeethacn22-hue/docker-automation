/*
 * zap-install.js
 * Downloads the OWASP ZAP Docker image and starts ZAP's browser interface.
 * Nothing is deleted.
 *
 * Run:   node zap-install.js
 * Open:  http://localhost:8080/zap   (wait 1-2 minutes after it starts)
 *
 * Needs: Docker running, and Node.js installed.
 * Only scan websites you own or have permission to test.
 */
const { execSync } = require("child_process");

const IMAGE = "zaproxy/zap-stable";
const CONTAINER = "zap-test";

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

  // Step 2: start ZAP (re-use the container if it already exists)
  console.log(`\n--- STEP 2: Starting ZAP ---`);
  if (containerExists()) {
    console.log(`Container '${CONTAINER}' already exists, starting it.`);
    run(`docker start ${CONTAINER}`);
  } else {
    run(
      `docker run -d --name ${CONTAINER} -u zap -p 8080:8080 -p 8090:8090 ${IMAGE} zap-webswing.sh`,
    );
  }

  console.log(`\nSUCCESS: ZAP is starting.`);
  console.log(`Wait 1-2 minutes, then open http://localhost:8080/zap`);
  console.log(`To check it: docker logs --tail 10 ${CONTAINER}`);
} catch (error) {
  console.error("An error occurred:", error.message);
  process.exit(1);
}
