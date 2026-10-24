/*const { execSync } = require("child_process");

// Helper function to create a delay (timer)
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Wait time in seconds, taken from the command line. Default is 60.
// Example: node docker-task.js 1      -> 1 second
//          node docker-task.js 3600   -> 60 minutes
const waitSeconds = parseInt(process.argv[2], 10) || 60;

async function automateDocker() {
  console.log("Running on machine:", require("os").hostname());
  console.log(
    `Wait time set to: ${waitSeconds} seconds (${waitSeconds / 60} minutes)`,
  );

  const imageName = "alpine";

  try {
    console.log(
      `\n--- STEP 1: Pulling/Creating Docker image '${imageName}' ---`,
    );
    execSync(`docker pull ${imageName}`, { stdio: "inherit" });
    console.log(`\nSUCCESS: Image '${imageName}' has been created/downloaded!`);

    // Step 2: Wait with a countdown
    console.log(`\n--- STEP 2: Waiting for ${waitSeconds} seconds ---`);
    for (let i = waitSeconds; i > 0; i--) {
      process.stdout.write(`Time remaining: ${i} seconds...   \r`);
      await sleep(1000); // Wait 1 second
    }
    console.log("\nDelay completed!                    ");

    // Step 3: Delete the image
    console.log(`\n--- STEP 3: Deleting Docker image '${imageName}' ---`);
    execSync(`docker rmi ${imageName}`, { stdio: "inherit" });
    console.log(
      `SUCCESS: Image '${imageName}' has been successfully deleted from Docker!`,
    );
  } catch (error) {
    console.error("An error occurred:", error.message);
  }
}

automateDocker();*/
const { execSync } = require("child_process");

// Helper function to create a delay (timer)
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Usage: node docker-task.js <waitSeconds> <imageName>
// Examples:
//   node docker-task.js 60 n8nio/n8n
//   node docker-task.js 3600 zaproxy/zap-stable
//   node docker-task.js 60            (uses alpine)
const waitSeconds = parseInt(process.argv[2], 10) || 60;
const imageName = process.argv[3] || "alpine";

async function automateDocker() {
  console.log("Running on machine:", require("os").hostname());
  console.log(`Image: ${imageName}`);
  console.log(
    `Wait time set to: ${waitSeconds} seconds (${waitSeconds / 60} minutes)`,
  );

  try {
    console.log(
      `\n--- STEP 1: Pulling/Creating Docker image '${imageName}' ---`,
    );
    execSync(`docker pull ${imageName}`, { stdio: "inherit" });
    console.log(`\nSUCCESS: Image '${imageName}' has been created/downloaded!`);

    // Step 2: Wait with a countdown
    console.log(`\n--- STEP 2: Waiting for ${waitSeconds} seconds ---`);
    for (let i = waitSeconds; i > 0; i--) {
      process.stdout.write(`Time remaining: ${i} seconds...   \r`);
      await sleep(1000);
    }
    console.log("\nDelay completed!                    ");

    // Step 3: Remove any containers made from this image, then delete the image
    console.log(`\n--- STEP 3: Deleting Docker image '${imageName}' ---`);
    const ids = execSync(`docker ps -aq --filter ancestor=${imageName}`)
      .toString()
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    if (ids.length > 0) {
      console.log(`Removing ${ids.length} container(s) that use this image...`);
      execSync(`docker rm -f ${ids.join(" ")}`, { stdio: "inherit" });
    }
    execSync(`docker rmi ${imageName}`, { stdio: "inherit" });
    console.log(
      `SUCCESS: Image '${imageName}' has been successfully deleted from Docker!`,
    );
  } catch (error) {
    console.error("An error occurred:", error.message);
  }
}

automateDocker();
