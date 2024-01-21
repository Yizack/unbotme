import { setUncaughtExceptionCaptureCallback } from "node:process";
setUncaughtExceptionCaptureCallback(console.info);
