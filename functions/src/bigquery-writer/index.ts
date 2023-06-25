import {BigQuery} from "@google-cloud/bigquery";

const bigquery = new BigQuery();

export class BigQueryWriter {
  private readonly datasetName = "github";
  private readonly tableName = "github_trending";

  async write(data: any[]) {
    const dataset = bigquery.dataset(this.datasetName);
    const table = dataset.table(this.tableName);
    const rows = data.map((item) => {
      return {
        timestamp: Date.now(),
        date_time: new Date().toISOString(),
        user_name: item.userName,
        repository_name: item.repositoryName,
        url: item.url,
        description: item.description,
        language: item.language,
        stars_today: item.starsToday,
        stars_total: item.starsTotal,
      };
    });
    // rows.forEach((row) => {
    //   console.log(`row: ${JSON.stringify(row)}`);
    // });

    try {
      await table.insert(rows, {ignoreUnknownValues: true});
    } catch (e) {
      console.log(`e: ${JSON.stringify(e)}`);
    }
  }
}
