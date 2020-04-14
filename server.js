var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request  = require('request');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}))

var city = 'Tangail';




app.get('/',function (req,res) {
    var url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=76c8fdc8db07e476c13e988cb7a5690d`;

    request(url , function (error , respone , body) {
     var  weather_json =   JSON.parse(body);
        var datetime = new Date().toDateString();

    // console.log(weather_json);

        var data = {
            city: city,
            temp: Math.round(weather_json.main.temp),
            icon: weather_json.weather[0].icon,
            des: weather_json.weather[0].description,
            humi: weather_json.main.humidity,
            country: weather_json.sys.country,
            wind: weather_json.wind.speed,
            temp_max: weather_json.main.temp_max,
            pressure: weather_json.main.pressure,
            date: datetime

        }
        var data = { data: data }
        res.render('weather.ejs', data);
    });
   
});


app.post('/weather', (req,res)=>{
    var city  = req.body.city2
    res.redirect('/weather2/'+city);
})

app.get('/weather2/:city', function (req, res) {
    var city  = req.params.city;
    var url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=76c8fdc8db07e476c13e988cb7a5690d`;

    request(url, function (error, respone, body) {
        var weather_json = JSON.parse(body);
        console.log(weather_json);
        var datetime = new Date().toDateString();
        
        if (!weather_json.message)
        {
                
            var data = {
                city: weather_json.name,
                temp: Math.round(weather_json.main.temp),
                icon: weather_json.weather[0].icon,
                des: weather_json.weather[0].description,
                humi: weather_json.main.humidity,
                country : weather_json.sys.country,
                wind: weather_json.wind.speed,
                temp_max: weather_json.main.temp_max,
                pressure: weather_json.main.pressure,
                date: datetime

            }
            var data = { data: data }
            res.render('weather2.ejs', data);
        }else{
            res.send('City not found');
        }


    });

});




app.listen(3000);
console.log('listining');
