const argv = require( 'argv' );
const scrapper = require('./scrapper');

const classes = {cSharp:'https://skemasys.akademiaarhus.dk/index.php?educationId=1&menuId=1&account=timetable_subject&subjectId=12426',algorithms:'https://skemasys.akademiaarhus.dk/index.php?educationId=1&menuId=1&account=timetable_subject&subjectId=12433',databases:'https://skemasys.akademiaarhus.dk/index.php?educationId=1&menuId=1&account=timetable_subject&subjectId=12430'};

argv.info( 'Skemasys scrapper' );

argv.type( 'getCalendarForSubjects', function(value)  {
    //filters invalid urls in case of invalid arguments
    const urls = value.split(",").map((name)=>{return classes[name]}).filter((element)=>{return element!= undefined});

    scrapper.getDataFromUrls(urls)
        .then((data)=>{
            console.log(data);
        });
});

argv.option({
    name: 'subjects',
    short: 's',
    type: 'getCalendarForSubjects',
    description: 'Add arguments to fetch the calendar for specific classes. Supported arguments : cSharp, algorithms, databases',
    example:'node app.js -s cSharp, algorithms, database =OR= node app.js -s cSharp, algorithms'
});

argv.run();