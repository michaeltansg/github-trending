import {load} from "cheerio";
import axios from "axios";

export class Scraper {
  async scrape() {
    const response = await axios.get("https://github.com/trending");
    const $ = load(response.data);
    const repositories = $("article.Box-row");

    const data = repositories.map((_index, element) => {
      const $element = $(element);
      const $userName = $element.find("h2 > a > span");
      const $repositoryName = $element.find("h2 > a");
      const $description = $element.find("p.my-1");
      const $language = $element.find("span[itemprop=\"programmingLanguage\"]");
      const $starsTotal = $element.find("a.mr-3");
      const $starsToday = $element.find("span.d-inline-block.float-sm-right");

      const userName = $userName.text().replace(" /", "").trim();
      const match = $repositoryName.text().match(/\/\s*(\S+)/);
      const repositoryName = (match && match[1]) ? match[1].trim() : "";
      const url = `https://github.com${$repositoryName.attr("href")}`;
      const description = $description.text().trim();
      const language = $language.text().trim();
      const starsTotal = parseInt($starsTotal.text().replace(",", ""));
      const starsToday = parseInt($starsToday.text().replace(",", ""));

      return {
        userName,
        repositoryName,
        url,
        description,
        language,
        starsToday,
        starsTotal,
      };
    }).get();

    return data;
  }
}
