const argv = require('argv');
const scrapper = require('./scrapper');

const classes = {cSharp:'https://skemasys.akademiaarhus.dk/index.php?educationId=1&menuId=1&account=timetable_subject&subjectId=12426',algorithms:'https://skemasys.akademiaarhus.dk/index.php?educationId=1&menuId=1&account=timetable_subject&subjectId=12433',databases:'https://skemasys.akademiaarhus.dk/index.php?educationId=1&menuId=1&account=timetable_subject&subjectId=12430'};
const urls = [];
argv.info( 'Skemasys scrapper' );

argv.type('getCalendarForSubjects',(value)=>  {
    if(value!='all'){
        //filters invalid urls in case of invalid arguments
        this.urls = value.split(",").map((name)=>{return classes[name]}).filter((element)=>{return element!= undefined});}
    else{
        this.urls = ['https://skemasys.akademiaarhus.dk/index.php?educationId=1&menuId=1&account=timetable_subject&subjectId=12426','https://skemasys.akademiaarhus.dk/index.php?educationId=1&menuId=1&account=timetable_subject&subjectId=12433','https://skemasys.akademiaarhus.dk/index.php?educationId=1&menuId=1&account=timetable_subject&subjectId=12430'];
    }
});


argv.option({
    name: 'subjects',
    short: 's',
    type: 'getCalendarForSubjects',
    description: 'Add arguments to fetch the calendar for specific classes. Supported arguments : cSharp, algorithms, databases, all',
    example:'node app.js -s cSharp, algorithms, database =OR= node app.js -s cSharp, algorithms =OR= node app.js -s all'
});

argv.type('getCalendarForSpecificTime',(value)=>{
    if(['today','tomorrow','this_week','next_week','this_month'].indexOf(value) == -1){
        console.log('This period is not yet available');
        return;}
    var from ='',to='';
    switch (value) {
        case'today':
            from = new Date();
            to = new Date();
            break;
        case'tomorrow':
            from = new Date();
            from.setDate(from.getDate() + 1);
            to = from;
            break;
        case'this_week':
            from = new Date();
            to = new Date();
            if(from.getDay() <=5 && from.getDay()>0 )
                to.setDate((5-to.getDay())+to.getDate());//Always default to friday
            break;
        case'next_week':
            from = new Date();
            to = new Date();
            if (from.getDay() <= 5 && from.getDay() > 0) {
                from.setDate(7 + from.getDay());
                to.setDate((5-from.getDay())+from.getDate());
            } else if(from.getDay()==1) {
                //case of saturday
                from.setDate(2+from.getDate());
                to.setDate(from.getDate()+4);
            }else{
                //case of sunday
                from.setDate(1+from.getDate());
                to.setDate(from.getDate()+4);
            }
            break;
        case'this_month':
            from = new Date();
            to= new Date();
            to.setDate(new Date(to.getYear(), to.getMonth()+1, 0).getDate());
            break;
        default:
            console.log('lel');
            break;
    }
    from = from.getUTCFullYear()+'-'+(from.getUTCMonth()+1)+'-'+(from.getUTCDate());
    if(to)
        to = to.getUTCFullYear()+'-'+(to.getUTCMonth()+1)+'-'+(to.getUTCDate()) + ' 23:59';

    scrapper.getDataFromUrls(this.urls)
        .then((data)=>{
            scrapper.printToConsole(data,from,to);
        });
});

argv.option({
    name: 'time',
    short:'t',
    type: 'getCalendarForSpecificTime',
    description:'Will return a calendar filled with classes for specific days',
    example:'node app.js -s cSharp, algorithms, database -t today OR tomorrow OR this_week OR next_week OR this_month'
});

argv.type('getCalendarForSpecificPeriod',(value)=>{
    const periods = value.split("_to_").sort((t1,t2)=>{return scrapper.getDateWithParsing(t1,'')>scrapper.getDateWithParsing(t2,'')?1:-1;});
    var from = scrapper.getDateWithParsing(periods[0],''),to = scrapper.getDateWithParsing(periods[1],'');

    from = from.getUTCFullYear()+'-'+(from.getUTCMonth()+1)+'-'+(from.getUTCDate()+1);
    if(to)
        to = to.getUTCFullYear()+'-'+(to.getUTCMonth()+1)+'-'+(to.getUTCDate()+1);

    scrapper.getDataFromUrls(this.urls)
        .then((data)=>{
            scrapper.printToConsole(data,from,to);
        });

});

argv.option({
    name: 'period',
    short: 'p',
    type: 'getCalendarForSpecificPeriod',
    description: 'Will return a calendar filled with classes for a specific period',
    example: 'node app.js -s cSharp, algorithms, database -p 12-03-2017_to_16-03-2017'
});

argv.run();