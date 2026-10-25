const { execSync } = require("child_process");

// Helper function to create a delay (timer)
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Usage: node docker-task.js <mode> <imageName>
//
//   node docker-task.js pull   n8nio/n8n   -> pull the image and KEEP it (no wait)
//   node docker-task.js delete n8nio/n8n   -> delete the image (and its containers) when YOU want
//   node docker-task.js 60     n8nio/n8n   -> pull, wait 60 seconds, then delete (the task version)
//
// If you leave out the image name, it uses alpine.
const mode = process.argv[2] || "60";
const imageName = process.argv[3] || "alpine";

function pullImage() {
  console.log(`\n--- Pulling Docker image '${imageName}' ---`);
  execSync(`docker pull ${imageName}`, { stdio: "inherit" });
  console.log(`\nSUCCESS: Image '${imageName}' has been created/downloaded!`);
}

function deleteImage() {
  console.log(`\n--- Deleting Docker image '${imageName}' ---`);
  // Remove any containers made from this image first, or Docker refuses to delete it
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
}

async function waitWithCountdown(seconds) {
  console.log(`\n--- Waiting for ${seconds} seconds ---`);
  for (let i = seconds; i > 0; i--) {
    process.stdout.write(`Time remaining: ${i} seconds...   \r`);
    await sleep(1000);
  }
  console.log("\nDelay completed!                    ");
}

async function main() {
  console.log("Running on machine:", require("os").hostname());
  console.log(`Image: ${imageName}`);

  try {
    if (mode === "pull") {
      pullImage();
      console.log("The image is kept. Use 'delete' mode when you want to remove it.");
    } else if (mode === "delete") {
      deleteImage();
    } else {
      const seconds = parseInt(mode, 10);
      if (!seconds) {
        console.error("Unknown mode. Use: pull, delete, or a number of seconds.");
        return;
      }
      console.log(`Wait time set to: ${seconds} seconds (${seconds / 60} minutes)`);
      pullImage();
      await waitWithCountdown(seconds);
      deleteImage();
    }
  } catch (error) {
    console.error("An error occurred:", error.message);
  }
}

main();
