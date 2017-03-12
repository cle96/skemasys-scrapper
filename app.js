const argv = require( 'argv' );
const scrapper = require('./scrapper');

const classes = {cSharp:'https://skemasys.akademiaarhus.dk/index.php?educationId=1&menuId=1&account=timetable_subject&subjectId=12426',algorithms:'https://skemasys.akademiaarhus.dk/index.php?educationId=1&menuId=1&account=timetable_subject&subjectId=12433',databases:'https://skemasys.akademiaarhus.dk/index.php?educationId=1&menuId=1&account=timetable_subject&subjectId=12430'};
const urls = [];
argv.info( 'Skemasys scrapper' );

argv.type('getCalendarForSubjects',(value)=>  {
    //filters invalid urls in case of invalid arguments
    this.urls = value.split(",").map((name)=>{return classes[name]}).filter((element)=>{return element!= undefined});
});


argv.option({
    name: 'subjects',
    short: 's',
    type: 'getCalendarForSubjects',
    description: 'Add arguments to fetch the calendar for specific classes. Supported arguments : cSharp, algorithms, databases',
    example:'node app.js -s cSharp, algorithms, database =OR= node app.js -s cSharp, algorithms'
});

argv.type('getCalendarForSpecificTime',(value)=>{
    if(['today','tomorrow','this_week','next_week','this_month'].indexOf(value) == -1){
        console.log('This period is not yet available');
        return;}
    var from ='',to='';
    switch (value) {
        case'today':
            from = new Date();
            break;
        case'tomorrow':
            from = new Date();
            from.setDate(from.getDate() + 1);
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
    from = from.getUTCFullYear()+'-'+(from.getUTCMonth()+1)+'-'+from.getUTCDate();
    if(to)
        to = to.getUTCFullYear()+'-'+(to.getUTCMonth()+1)+'-'+to.getUTCDate();

    // scrapper.getDataFromUrls(urls)
    //     .then((data)=>{
    //         scrapper.printToConsole(data);
    //     });
});

argv.option({
    name: 'time',
    short:'t',
    type: 'getCalendarForSpecificTime',
    description:'Will return a calendar filled with classes for specific days or periods',
    example:''
});

argv.run();