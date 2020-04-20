# covid19-compiled

![last updated badge](https://img.shields.io/github/last-commit/jerilMJ/covid19-compiled?label=last%20updated&style=flat-square)

Provides latest (only) country-wise data from CSSEGISandData/COVID-19 all compiled into a JSON file.
Heavily inspired by [this project.](https://github.com/pomber/covid19)

The data is available at `https://jerilmj.github.io/covid19-compiled/reports.json`
For the list of available countries, check: `https://jerilmj.github.io/covid19-compiled/countries.json`

## Sample json response:

```js
"JPN": {
  "name": "Japan",
  "date": "2020-04-19",
  "confirmed": 10797,
  "confirmed_diff": 501,
  "recovered": 1159,
  "recovered_diff": 90,
  "deaths": 236,
  "deaths_diff": 14,
  "fatality_rate": 0.0219,
  "coordinates": {
    "lat": 36,
    "long": 138
},
```

> <b>NOTE:</b> Area is in km²

## Example Usage

##### JS

```js
fetch("https://jerilmj.github.io/covid19-compiled/reports.json")
  .then((response) => response.json())
  .then((reports) => {
    console.log(reports.JPN);
  });
```

##### Dart

```dart
http.get("https://jerilmj.github.io/covid19-compiled/reports.json")
  .then((response) {
    if (response.statusCode == 200) {
      print(json.decode(response.body)['JPN']);
    }
  });
```

## Projects using this dataset ([+ add yours](#user-content-adding-your-project-to-the-list))

Click on a row to expand the content and read the description of a project.

### Adding your project to the list

Pull requests adding more projects to this list are welcome, just a few rules:

- Add only open source projects
- Make sure the project cites this repo as a data source (with a link)
- Try not to add extra blank lines, it breaks the formatting
- Follow the same order as the rest of the list

```
<details>
  <summary><a href=<project_link>>Someone's Project</a> <a href="repo_link">(repo)</a></summary>

Project description goes here (some styling is allowed but keep it minimal)
</details>
```

[Pull Request Template](https://github.com/jerilMJ/covid19-compiled/blob/master/.github/PULL_REQUEST_TEMPLATE.md)
➕ [Add a new project to the list](https://github.com/jerilMJ/covid19-compiled/edit/master/README.md)

- Make the necessary edits and issue a pull request. I'll assess it and merge it.

## License

The code from this repo is MIT licensed.  
The data is under [CSSEGISandData/COVID-19](https://github.com/CSSEGISandData/COVID-19/) terms of use.
