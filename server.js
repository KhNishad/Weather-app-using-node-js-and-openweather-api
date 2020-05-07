var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request  = require('request');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}))

// default city
var city = 'Dhaka';
app.use(bodyParser.json());


// rendering home page 

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

// post request from search input from weather.ejs 

app.post('/weather', (req,res)=>{
    var city  = req.body.city2;
    res.redirect('/weather2/'+city);
})


// post request from the celsius page 
app.post('/weather2', (req,res)=>{ 
    var city = req.body.city;
    res.redirect('/weather2/'+ city);
})


// finding data of the searched 

app.get('/weather2/:city', function (req, res) {
    var city  = req.params.city;
    
    
    var url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=76c8fdc8db07e476c13e988cb7a5690d`;

    request(url, function (error, respone, body) {
        var weather_json = JSON.parse(body);
        //console.log(weather_json);
        var datetime = new Date().toDateString();
        var cel = ((Math.round(weather_json.main.temp)- 32) * 5)/9;
        
        
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
            res.render('weather.ejs', data);
        }else{
            res.send('City not found');
        }


    });

});

// taking city name to convert into celsius

app.post('/cel', function (req, res) {
     var city = req.body.city;
     
     res.redirect('/cel/'+ city)    
     
});

// converting to celsius
app.get('/cel/:city', function (req, res) {
    var city = req.params.city;
    //console.log(city);
    
    var url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=76c8fdc8db07e476c13e988cb7a5690d`;

    request(url, function (error, respone, body) {
        var weather_json = JSON.parse(body);
        //console.log(weather_json);
        var datetime = new Date().toDateString();
        var cel = ((Math.round(weather_json.main.temp) - 32) * 5) / 9;
        var max = ((Math.round(weather_json.main.temp_max) - 32) * 5) / 9;
        var km = ((weather_json.wind.speed)*1.6093440)
      var kmp =  km.toFixed(3);



        if (!weather_json.message) {

            var data = {
                city: weather_json.name,
                temp: Math.round(cel),
                icon: weather_json.weather[0].icon,
                des: weather_json.weather[0].description,
                humi: weather_json.main.humidity,
                country: weather_json.sys.country,
                wind: kmp,
                temp_max: Math.round(max),
                pressure: weather_json.main.pressure,
                date: datetime

            }
            var data = { data: data }
            res.render('cel.ejs', data);
        } else {
            res.send('City not found');
        }


    });

});


// port to run 
app.listen(process.env.PORT || 3000);

