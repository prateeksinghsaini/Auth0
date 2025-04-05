// Simple script to check if .env variables are being loaded
const fs = require("fs");

try {
  const envContent = fs.readFileSync("./.env", "utf8");
  console.log("Environment file content:");
  console.log(envContent);
} catch (error) {
  console.error("Error reading .env file:", error);
}

console.log("\nEnvironment variables accessible to Node:");
console.log("VITE_AUTH0_DOMAIN:", process.env.VITE_AUTH0_DOMAIN);
console.log("VITE_AUTH0_CLIENT_ID:", process.env.VITE_AUTH0_CLIENT_ID);
console.log("VITE_AUTH0_AUDIENCE:", process.env.VITE_AUTH0_AUDIENCE);
