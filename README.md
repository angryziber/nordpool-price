# NordPool Curent Price

Fetches electricity prices from NordPool exchange and displays the current price for the Baltic countries in their correct time zone.

[Deployed here](https://nordpoolprice.codeborne.com/)

Useful if your electricity bill is tied to the exchange spot price, so you can decide when to charge your electric car, etc.

Source of data:
https://www.nordpoolgroup.com/Market-data1/Dayahead/Area-Prices/EE/Hourly/

## Development

Server-side runs using node (to fetch and transform the data).

Client side does not require any build steps:
* ES modules used directly in the browser
* Web Components (using lightweight [lit-element](https://www.skypack.dev/view/lit-element))
* Dependencies loaded using [Skypack](https://skypack.dev)

Use `npm start` to run locally.

## TODO

* Show days of week
* Offer to install to home screen as an app
