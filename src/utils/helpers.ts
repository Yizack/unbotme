import * as dotenv from "dotenv";
dotenv.config();

export const options = {
  identity: {
    username: "unbotme",
    password: process.env.ACCESS_TOKEN
  },
  channels: ["unbotme"]
};

export const extractCommand = (message: string) => {
  return message.split(" ")[0].replace("!", "");
};

export function onConnected(address: string, port: number) {
  console.info(`Connected to ${address}:${port}`);
}
