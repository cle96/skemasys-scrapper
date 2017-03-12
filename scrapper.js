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
}
