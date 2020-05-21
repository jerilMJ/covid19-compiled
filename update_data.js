const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
const parse = require("csv-parse/lib/sync");
const countries = require("./docs/countries.json");
const worldwide = require("./docs/worldwide.json");

const FILENAME_CONFIRMED = "time_series_covid19_confirmed_global.csv";
const FILENAME_RECOVERED = "time_series_covid19_recovered_global.csv";
const FILENAME_DEATHS = "time_series_covid19_deaths_global.csv";
const WORLDWIDE_URL = "https://covid-api.com/api/reports/total/";

class Report {
  constructor(iso, count) {
    this.iso = iso;
    this.count = count;
  }
}

class Coordinates {
  constructor(lat, long) {
    this.lat = lat;
    this.long = long;
  }
}

function extractNumbersFromCsv(path) {
  const csv = fs.readFileSync(path);
  const [headers, ...rows] = parse(csv);
  const [province, country, lat, long, ...dates] = headers;

  const countriesMap = JSON.parse(JSON.stringify(countries));

  let data = {};
  rows.forEach(([province, country, lat, long, ...cases]) => {
    if (countriesMap[country] != null) {
      const iso = countriesMap[country]["iso3"];

      data[iso] = data[iso] || {};

      data[iso]["count"] = data[iso]["count"] || 0;
      data[iso]["prev"] = data[iso]["prev"] || 0;

      data[iso]["count"] += parseInt(cases.slice(-1)[0]);
      data[iso]["prev"] += parseInt(cases.slice(-2, -1)[0]);
    }
  });

  return data;
}

function extractDateFromCsv(path) {
  const csv = fs.readFileSync(path);
  const [headers, ...rows] = parse(csv);
  const [province, country, lat, long, ...dates] = headers;

  const badDate = dates.slice(-1)[0];
  const goodDate = prettifyDate(badDate);

  return goodDate;
}

function prettifyDate(badDate) {
  const [month, day, year] = badDate.split("/");
  const formattedMonth = parseInt(month) / 10 < 1 ? `0${month}` : month;
  const formattedDay = parseInt(day) / 10 < 1 ? `0${day}` : day;
  const formattedYear = `20${year}`;
  const goodDate = `${formattedYear}-${formattedMonth}-${formattedDay}`;
  return goodDate;
}

function extractAndSortDataFromCsv(path) {
  const csv = fs.readFileSync(path);
  const [headers, ...rows] = parse(csv);
  const [province, country, lat, long, ...dates] = headers;

  const countriesMap = JSON.parse(JSON.stringify(countries));

  let datedCases = {};
  let datedReports = {};

  rows.forEach(([province, country, lat, long, ...cases]) => {
    if (countriesMap[country] != null) {
      const iso = countriesMap[country]["iso3"];

      cases.forEach((_, index) => {
        datedCases[dates[index]] = datedCases[dates[index]] || {};
        datedCases[dates[index]][iso] = datedCases[dates[index]][iso] || 0;
        datedCases[dates[index]][iso] += parseInt(cases[index]);
      });
    }
  });

  for (var date in datedCases) {
    for (var iso in datedCases[date]) {
      datedReports[date] = datedReports[date] || [];
      datedReports[date].push(new Report(iso, datedCases[date][iso]));
    }
    datedReports[date].sort((rep1, rep2) => rep2.count - rep1.count);
  }

  return datedReports;
}

async function fetchWorldwide(outputPath, errorsPath) {
  let isUpdated = false;
  const sortedDates = Object.keys(worldwide)
    .slice()
    .sort((dateA, dateB) => {
      return new Date(dateB) - new Date(dateA);
    });
  const initialDate = new Date(sortedDates[0] || "2020-01-22"); // String

  initialDate.setDate(initialDate.getDate() + 1);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const reports = {};
  let date = new Date(initialDate);

  while (dateToString(date) !== dateToString(tomorrow)) {
    let dateString = dateToString(date);
    let response = await fetch(`${WORLDWIDE_URL}?date=${dateString}`);
    if (response.ok) {
      let data = (await response.json()).data;

      if (Array.isArray(data)) {
        break;
      }

      reports[dateString] = data;
      isUpdated = true;
    } else {
      fs.appendFileSync(
        outputPath,
        `\n\n- Error fetching worldwide report for date: ${dateString}.. So aborting.`
      );
      break;
    }

    date.setDate(date.getDate() + 1);
  }

  if (isUpdated) {
    fs.writeFileSync(errorsPath, JSON.stringify(reports, null, 2));
  }
}

function dateToString(date) {
  const [year, month, day] = [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
  ];
  const formattedMonth = parseInt(month) / 10 < 1 ? `0${month}` : month;
  const formattedDay = parseInt(day) / 10 < 1 ? `0${day}` : day;

  return `${year}-${formattedMonth}-${formattedDay}`;
}

function updateData(
  dataDirPath,
  errorsPath,
  reportsOutputPath,
  datedOrderedReportsOutputPath,
  worldwideReportsOutputPath
) {
  const confirmed = extractNumbersFromCsv(
    path.resolve(dataDirPath, FILENAME_CONFIRMED)
  );

  const recovered = extractNumbersFromCsv(
    path.resolve(dataDirPath, FILENAME_RECOVERED)
  );

  const deaths = extractNumbersFromCsv(
    path.resolve(dataDirPath, FILENAME_DEATHS)
  );

  const ordered = extractAndSortDataFromCsv(
    path.resolve(dataDirPath, FILENAME_CONFIRMED)
  );

  const countriesData = new Map(
    Object.entries(JSON.parse(JSON.stringify(countries)))
  );

  const latestDate = extractDateFromCsv(
    path.resolve(dataDirPath, FILENAME_CONFIRMED)
  );

  let reports = {};
  countriesData.forEach((data, name) => {
    const cnf = confirmed[data.iso3];
    const rec = recovered[data.iso3];
    const dth = deaths[data.iso3];

    reports[data.iso3] = {
      name: name,
      date: latestDate,
      confirmed: cnf["count"],
      confirmed_diff: cnf["count"] - cnf["prev"],
      recovered: rec["count"],
      recovered_diff: rec["count"] - rec["prev"],
      deaths: dth["count"],
      deaths_diff: dth["count"] - dth["prev"],
      fatality_rate: parseFloat((dth["count"] / cnf["count"]).toFixed(4)),
      coordinates: new Coordinates(data.coordinates.lat, data.coordinates.long),
      area: data.area,
    };
  });

  let datedOrderedReports = {};
  Object.keys(ordered).forEach((badDate, _) => {
    const date = prettifyDate(badDate);

    datedOrderedReports[date] = [];
    for (var report of ordered[badDate]) {
      datedOrderedReports[date].push({
        iso: report.iso,
        confirmed: report.count,
      });
    }
  });

  fs.writeFileSync(reportsOutputPath, JSON.stringify(reports, null, 2));
  fs.writeFileSync(
    datedOrderedReportsOutputPath,
    JSON.stringify(datedOrderedReports, null, 2)
  );
  fetchWorldwide(worldwideReportsOutputPath, errorsPath);
}

module.exports = updateData;
