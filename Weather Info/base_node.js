const http = require("http");
const fs = require("fs");
var requests = require("requests");

const homeFile = fs.readFileSync("base.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempVal%}", orgVal.main.temp);
    temperature = temperature.replace("{%tempMin%}", orgVal.main.temp_min);
    temperature = temperature.replace("{%tempMax%}", orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempSta%}", orgVal.weather[0].main);
    return temperature;
};

const server = http.createServer((req, res) => {
    if(req.url == "/"){
        requests(
            "https://api.openweathermap.org/data/2.5/weather?q=Lucknow&units=metric&appid=86da13eb6db5c91fead3d94cafc6ca7c"
        )
            .on("data", (chunk) => {
                const objData = JSON.parse(chunk);
                const arrData = [objData];
                const realTimeData = arrData
                    .map((val) => replaceVal(homeFile, val))
                    .join("");
                res.write(realTimeData);
                // console.log(realTimeData);
            })
            .on("end", (err) => {
                if (err) return console.log('connection closed due to errors', err);
                res.end();
            }); 
    } else{
        res.end("File not found");
    }
});

server.listen(8005, "127.0.0.1");