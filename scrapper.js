const express = require("express");
const cheerio = require("cheerio");
const request = require("request");

function Timetable(title, date, time) {
    this.title = title;
    this.date = date;
    this.time = time;
}

function isNotFri(timeTable) {
    return timeTable.title !== 'Fri' && timeTable.title;
}

function getDataFromUrl(url) {
    "use strict";
    return new Promise((resolve, reject) => {
            request(url, (error, response, html) => {
                if (error) {
                    console.log("Error trying to access this subject");
                    reject();
                }

                const $ = cheerio.load(html);

                const table = $('.calendar');
                const dates = table.find(".date");
                const classesFromThisUrl = [];

                dates.each((index, element) => {
                    const line = $(element).text().trim();
                    if (line.length > 0) {
                        const raw = $(element).attr("id").split("_");
                        const date = raw[1];
                        const time = $(element).parent().find(".leftHeader").text().trim();
                        const title = $(element).text().trim();

                        const timetable = new Timetable(title, date, time);
                        if (isNotFri(timetable)) {
                            classesFromThisUrl.push(timetable);
                        }
                    }
                });
                resolve(classesFromThisUrl);
            });
        });
}

exports.getDataFromUrls = (urls)=>{
    const promises = urls.map((url)=> {return getDataFromUrl(url)});
    return Promise.all(promises);
};

exports.printToConsole = (data,from,to)=>{
    var calendar = [];
    for(var i =0;i<data.length;i++){
        calendar = calendar.concat(data[i]);
    }
    
    calendar.sort((t1,t2)=>{
        const date1 = this.getDateWithParsing(t1.date,t1.time);
        const date2 = this.getDateWithParsing(t2.date,t2.time);

        return date1 > date2?1:-1;
    });

    calendar = calendar.filter((t1) => {
        //filter by date
        var date1 = this.getDateWithParsing(t1.date,t1.time);

        from = new Date(from);
        to = new Date(to);

        return date1 >= from && date1 <= to;
    }).map((t1) => {
        return t1.title + " " + t1.date + " " + t1.time
    });

    [...new Set(calendar)].forEach((t1)=>console.log(t1));
};

exports.getDateWithParsing = (date, time) => {
    var dt1 = parseInt(date.substring(0, 2));
    var mon1 = parseInt(date.substring(3, 5));
    var yr1 = parseInt(date.substring(6, 10));
    return new Date(yr1 + '-' + mon1 + '-' + dt1 + ' ' + time);
}
