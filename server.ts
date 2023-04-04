import express, { Express, Request, Response } from "express";
const app: Express = express();
const port: number = 3001;

let totalVistor = 0;
app.get("/", (req: Request, res: Response) => {
  totalVistor++;
  const currentTime = new Date().toLocaleString();
  res
    .status(200)
    .send(`Current time:${currentTime}. Total Vistors: ${totalVistor}`);
});
app.listen(port, () => {
  try {
    console.log(`connecting to ${port}...`);
  } catch (err) {
    console.error(err);
  }
});
