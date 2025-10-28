import { Liveblocks } from "@liveblocks/node";
console.log(process.env.LIVEBLOCKS_SECRET);

export const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET,
});