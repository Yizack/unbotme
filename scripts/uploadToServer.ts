import { default as SSH } from "ssh2";
import { readdirSync } from "fs";
import * as dotenv from "dotenv";

dotenv.config();

const ssh = new SSH.Client();
const localFolderPath = "./build";
const remoteFolderPath = "unbotme/build";

ssh.on("ready", () => {
  ssh.sftp((err, sftp) => {
    if (err) throw err;
    sftp.mkdir(remoteFolderPath, () => {
      const files = readdirSync(localFolderPath);
      for (const file of files) {
        const localFilePath = `${localFolderPath}/${file}`;
        const remoteFilePath = `${remoteFolderPath}/${file}`;
        sftp.fastPut(localFilePath, remoteFilePath, (err) => {
          if (err) throw err;
          console.info(`File uploaded: ${file}`);
          if (file === files[files.length - 1]) {
            ssh.exec("pm2 restart 1", (err, stream) => {
              if (err) throw err;
              stream.on("data", (data: string) => {
                console.info(`STDOUT: ${data}`);
              }).on("exit", () => {
                console.info("Stream exited");
                ssh.end();
              }).stderr.on("data", (data: string) => {
                console.warn("STDERR: " + data);
              });
            });
          }
        });
      }
      console.info("Folder upload complete");
    });
  });
}).connect({
  host: process.env.SSH_HOST,
  port: 22,
  username: process.env.SSH_USERNAME,
  password: process.env.SSH_PASSWORD
});
