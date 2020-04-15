const path = require("path");
const update = require("./update_data");

const WORKSPACE = process.env.GITHUB_WORKSPACE;
const DATA_REPO = "data";
const MAIN_REPO = "main";

const dataRepoPath = path.join(
  WORKSPACE,
  DATA_REPO,
  "csse_covid_19_data",
  "csse_covid_19_time_series"
);

const outputPath = path.join(WORKSPACE, MAIN_REPO, "docs", "reports.json");

update(dataRepoPath, outputPath);
