$(document).ready(function() {
    solveDay4('input.txt');
});


function solveDay4(filePath) {

    $.get(filePath, function(data) {

        var guardsInfoList = getRecordsAsObjectsList(data);
        var guardWithMostMinutesAsleep = findGuardWithMostMinutesAsleep(guardsInfoList);
        console.log(guardWithMostMinutesAsleep.id);
        // generateHtmlView(matrix, overlappingInches, intactClaim);
    });
}


function findGuardById(guardsList, id) {
    return guardsList.find(function(guard) {
        return guard.id === id;
    });
}


function findDateInGuardInfo(stats, date) {
    if(!stats) {
        return false
    }
    else {
        return stats.find(function(stat) {
            return stat.date === date;
        });
    }
}

function getRecordsAsObjectsList(data) {

    var guardsInfoList = [];
    var lines = data.split("\n").sort();
    var currentId;

    for(var i = 0; i < lines.length; i++) {

        var line = lines[i];
        var guardInfo;

        var date = line.match(/(\d{4}(-\d{2}){2})/g).toString();
        var time = line.match(/(\d{2}):(\d{2})/g).toString().split(":");
        var guardId = function() {
            if(line.match(/(#\d*)/g)) {
                return line.match(/(#\d*)/g).toString().replace("#", "");
            }
        };
        var fallsAsleep = !!line.match(/(falls asleep)/g);
        var wakesUp = !!line.match(/(wakes up)/g);

        /*------------------------------------------------------*/

        var stat;


        if(guardId()) {
            if (!findGuardById(guardsInfoList, guardId())) {
                guardInfo = {
                    id: guardId(),
                    sleepingStats: [],
                    totalTimeAsleep: 0
                };

                guardsInfoList.push(guardInfo);
                currentId = guardId();
            }
            else {
                guardInfo = findGuardById(guardsInfoList, guardId());
            }
        }

        if(time[0] === "00") {
            if(!findDateInGuardInfo(guardInfo.sleepingStats, date)) {
                stat = {
                    date: date,
                    ranges: []
                };

                guardInfo.sleepingStats.push(stat);
            }
            else {
                stat = findDateInGuardInfo(guardInfo.sleepingStats, date);
            }

            var rangeInfo;

            if(fallsAsleep) {
                rangeInfo = {
                    start: parseInt(time[1])
                };

                stat.ranges.push(rangeInfo);
            }
            else if(wakesUp){
                rangeInfo = stat.ranges[stat.ranges.length - 1];
                rangeInfo.end = parseInt(time[1]) - 1;
                guardInfo.totalTimeAsleep += rangeInfo.end - rangeInfo.start;
            }
        }
    }

    console.log(guardsInfoList);
    return guardsInfoList;
}


function findGuardWithMostMinutesAsleep(guardsList) {

    console.log(guardsList.map(function(guard) {
        return guard.totalTimeAsleep;
    }));

    var max = Math.max.apply(null,guardsList.map(function(guard) {
        return guard.totalTimeAsleep;
    }));

    return guardsList.find(function(guard) {
        return guard.totalTimeAsleep === max;
    });
}