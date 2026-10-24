const { execSync } = require("child_process");

// Helper function to create a delay (timer)
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function automateDocker() {
  console.log("Running on machine:", require("os").hostname());

  // Using 'alpine' which we know pulls and runs successfully
  const imageName = "alpine";

  try {
    console.log(`--- STEP 1: Pulling/Creating Docker image '${imageName}' ---`);
    execSync(`docker pull ${imageName}`, { stdio: "inherit" });
    console.log(`\nSUCCESS: Image '${imageName}' has been created/downloaded!`);

    // Step 2: Wait for 1 minute (60 seconds) with a countdown
    console.log("\n--- STEP 2: Waiting for 1 minute (60-second delay) ---");
    for (let i = 60; i > 0; i--) {
      process.stdout.write(`Time remaining: ${i} seconds...\r`);
      await sleep(1000); // Wait 1 second
    }
    console.log("\n1-minute delay completed!           ");

    // Step 3: Delete/Remove the image from Docker
    console.log(`\n--- STEP 3: Deleting Docker image '${imageName}' ---`);
    execSync(`docker rmi ${imageName}`, { stdio: "inherit" });
    console.log(
      `SUCCESS: Image '${imageName}' has been successfully deleted from Docker!`,
    );
  } catch (error) {
    console.error("An error occurred:", error.message);
  }
}

automateDocker();
