const express = require("express");
const cheerio = require("cheerio");
const request = require("request");

const cSharpUrl = "https://skemasys.akademiaarhus.dk/index.php?educationId=1&menuId=1&account=timetable_subject&subjectId=12433";

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

function getDataFromUrls(urls) {
    const allClasses = [];
    const promises = urls.map((url)=> {return getDataFromUrl(url)});
    Promise.all(promises).then((data) => {
                allClasses.push(data);
                console.log(allClasses);
        });
    }

getDataFromUrls([cSharpUrl]);