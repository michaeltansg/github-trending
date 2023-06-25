import {scheduler, setGlobalOptions} from "firebase-functions/v2";
import {Scraper} from "./scraper/index.js";
import {BigQueryWriter} from "./bigquery-writer/index.js";
import {ErrorHandler} from "./error-handler/index.js";

setGlobalOptions({region: "asia-southeast1", memory: "256MiB", timeoutSeconds: 60});

const scraper = new Scraper();
const bigQueryWriter = new BigQueryWriter();
const errorHandler = new ErrorHandler();

export const getTrendingRepositories = scheduler.onSchedule("0 * * * *", async () => {
  try {
    const data = await scraper.scrape();
    await bigQueryWriter.write(data);
  } catch (error) {
    errorHandler.handle(error);
  }
});
