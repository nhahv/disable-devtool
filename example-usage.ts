/*
 * @Description: Example usage of DisableDevtool class
 */
import DisableDevtoolClass from "./src/index";

// Example 1: Basic usage
const devtoolProtection = new DisableDevtoolClass();
const result = devtoolProtection.init({
  md5: "your-md5-hash",
  url: "https://your-redirect-url.com",
  interval: 500,
  disableMenu: true,
  disableSelect: true,
  disableCopy: true,
});

console.log("Initialization result:", result);

// Example 2: Multiple instances for different configurations
const strictProtection = new DisableDevtoolClass();
strictProtection.init({
  interval: 100, // Very fast detection
  disableMenu: true,
  disableSelect: true,
  disableCopy: true,
  disablePaste: true,
});

const relaxedProtection = new DisableDevtoolClass();
relaxedProtection.init({
  interval: 1000, // Slower detection
  disableMenu: false,
  disableSelect: false,
});

// Example 3: Control the protection
setTimeout(() => {
  // Temporarily suspend protection
  devtoolProtection.suspend();
  console.log("Protection suspended");

  setTimeout(() => {
    // Resume protection
    devtoolProtection.resume();
    console.log("Protection resumed");
  }, 5000);
}, 10000);

// Example 4: Check status
console.log("Is running:", devtoolProtection.isRunning);
console.log("Is suspended:", devtoolProtection.isSuspend);
console.log("Version:", devtoolProtection.version);
console.log("Is devtool opened:", devtoolProtection.isDevToolOpened());

// Example 5: Stop protection when needed
setTimeout(() => {
  devtoolProtection.stop();
  console.log("Protection stopped");
}, 30000);

// Example 6: Using static methods
console.log("MD5 hash:", DisableDevtoolClass.md5("test"));
console.log("Version:", DisableDevtoolClass.version);
console.log("Detector types:", DisableDevtoolClass.DetectorType);
console.log("Is devtool opened (static):", DisableDevtoolClass.isDevToolOpened());
