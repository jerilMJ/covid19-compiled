# covid19-compiled

![last updated badge](https://img.shields.io/github/last-commit/jerilMJ/covid19-compiled?label=last%20updated&style=flat-square)

Provides latest (only) country-wise data from CSSEGISandData/COVID-19 all compiled into a JSON file.
Inspired by [this project.](https://github.com/pomber/covid19)

## Sample json response:

```js
  "JPN": {
    "name": "Japan",
    "date": "2020-04-13",
    "confirmed": 7370,
    "confirmed_diff": 622,
    "recovered": 784,
    "recovered_diff": 22,
    "deaths": 123,
    "deaths_diff": 15,
    "fatality_rate": 0.0167
  },
```

## Example Usage

```js
fetch("https://pomber.github.io/covid19/timeseries.json")
  .then((response) => response.json())
  .then((reports) => {
    console.log(reports["JPN"]);
  });
```

```dart
http.get("")
```

## Projects using this dataset ([+ add yours](#user-content-adding-your-project-to-the-list)

### Adding your project to the list

Pull requests adding more projects to this list are welcome, just a few rules:

- Add only open source projects
- Make sure the project cite this repo as a data source (with a link)
- Follow the same order as the rest of the list `- [project-name](your-project-url) ([repo](repo-url)): description`
- Try not to add extra blank lines, it breaks the formatting

➕ [add a new project to the list](https://github.com/pomber/covid19/edit/master/readme.md)

## License

The code from this repo is MIT licensed.  
The data is under [CSSEGISandData/COVID-19](https://github.com/CSSEGISandData/COVID-19/) terms of use.
