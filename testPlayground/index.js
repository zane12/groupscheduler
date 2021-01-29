const moment = require('moment');

const gran = 'hour'

const testDates = [
    [
        '2021-01-22T00:00:00.000Z',
        '2021-01-24T03:00:00.000Z',
        '2021-01-24T18:00:00.000Z',
        '2021-01-25T23:00:00.000Z',
        '2021-01-25T00:00:00.000Z'
    ],
    [
        '2021-01-23T18:00:00.000Z',
        '2021-01-25T02:00:00.000Z',
        '2021-01-26T21:00:00.000Z',
        '2021-01-25T01:00:00.000Z'
    ],
    [
        '2021-01-21T18:19:41.846Z',
        '2021-01-23T00:00:00.000Z',
        '2021-01-25T01:00:00.000Z'
    ]
];

function finalMatch(dateMatch) {
    dateMatch.sort();

    let count = 0;
    let current = null;
    let goodDates = [];

    dateMatch.forEach((date) => {
        if(current != date){
            current = date,
            count = 1;

        }   else {
            count++
        }
        if(count === testDates.length-1) {
            goodDates.push(current);
        }
    })

    return goodDates;
}


testDates.forEach((d) => d.sort());

let dateMatch = [];



testDates[0].forEach((date) => {   
    //creates an array of matches according to the granularity (defaults to an hour).
    for(i = 1; i < testDates.length; i++){
        testDates[i].forEach((date2) => {
            if(moment(date).isSame(moment(date2), gran)) dateMatch.push(date);
        })
    }      
})



let goodDates = finalMatch(dateMatch);

if(goodDates.length === 0) {

    testDates[0].forEach((date) => {   
        //creates an array of matches using a wider window of equivalence.
        for(i = 1; i < testDates.length; i++){
            testDates[i].forEach((date2) => {
                if(moment(date).isBetween(moment(date2).subtract(2, 'hour'), moment(date2).add(2, 'hour'), '[]')) dateMatch.push(date);
            })
        }      
    })

    goodDates = finalMatch(dateMatch);
}

console.log(goodDates);













