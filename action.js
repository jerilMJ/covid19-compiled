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

const output1Path = path.join(WORKSPACE, MAIN_REPO, "docs", "reports.json");
const output2Path = path.join(WORKSPACE, MAIN_REPO, "docs", "ordered.json");
const output3Path = path.join(WORKSPACE, MAIN_REPO, "docs", "worldwide.json");
const errorsPath = path.join(WORKSPACE, MAIN_REPO, "ERRORS.md");

update(dataRepoPath, errorsPath, output1Path, output2Path, output3Path);
