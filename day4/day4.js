$(document).ready(function() {
    solveDay4('input.txt');
});


function solveDay4(filePath) {

    $.get(filePath, function(data) {

        var guardsInfoList = getRecordsAsObjectsList(data);

        var guardWithMostMinutesAsleep = findGuardWithMostMinutesAsleep(guardsInfoList);
        var minuteGuardWasMostAsleep = findMinuteGuardWasMostAsleep(guardWithMostMinutesAsleep).minute;
        var guardWithMaxMinuteMostAsleep = findGuardWithMaxMinuteMostAsleep(guardsInfoList);

        var strategy1result = guardWithMostMinutesAsleep.id * minuteGuardWasMostAsleep;
        var strategy2result = guardWithMaxMinuteMostAsleep.id * guardWithMaxMinuteMostAsleep.minuteMostAsleep.minute;

        generateHtmlView(strategy1result, strategy2result);
    });
}


function findGuardById(guardsList, id) {
    return guardsList.find(function(guard) {
        return guard.id === id;
    });
}


function findStatByDate(stats, date) {
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

        var stat;

        if(time[0] === "00") {
            if(!findStatByDate(guardInfo.sleepingStats, date) && fallsAsleep) {
                stat = {
                    date: date,
                    ranges: []
                };

                guardInfo.sleepingStats.push(stat);
            }

            var rangeInfo;

            if(fallsAsleep) {
                rangeInfo = {
                    start: parseInt(time[1])
                };

                stat.ranges.push(rangeInfo);
            }
            else if(wakesUp){

                stat = findStatByDate(guardInfo.sleepingStats, date);

                rangeInfo = stat.ranges[stat.ranges.length - 1];
                rangeInfo.end = parseInt(time[1]) - 1;
                guardInfo.totalTimeAsleep += rangeInfo.end - rangeInfo.start + 1;
            }
        }
    }

    return guardsInfoList;
}


function findGuardWithMostMinutesAsleep(guardsList) {

    var max = Math.max.apply(null,guardsList.map(function(guard) {
        return guard.totalTimeAsleep;
    }));

    return guardsList.find(function(guard) {
        return guard.totalTimeAsleep === max;
    });
}


function findMinuteGuardWasMostAsleep(guard) {

    var minutes = Array(60).fill(0);

    $(guard.sleepingStats).each(function(index, stat) {

        $(stat.ranges).each(function(index, rangeInfo) {
            for(var i = rangeInfo.start; i <= rangeInfo.end; i++) {
                minutes[i]++;
            }
        });
    });

    var max = Math.max.apply(null, minutes)

    return {
        minute: minutes.indexOf(max),
        nbTimes: max
    };
}


function setMinuteGuardWasMostAsleepForEachGuard(guardsList) {

    $(guardsList).each(function(index, guard) {
       guard.minuteMostAsleep =  findMinuteGuardWasMostAsleep(guard);
    });
}


function findGuardWithMaxMinuteMostAsleep(guardsList) {

    setMinuteGuardWasMostAsleepForEachGuard(guardsList);

    var max = Math.max.apply(null,guardsList.map(function(guard) {
        return guard.minuteMostAsleep.nbTimes;
    }));

    return guardsList.find(function(guard) {
        return guard.minuteMostAsleep.nbTimes === max;
    });
}


function generateHtmlView(strategy1result, strategy2result) {

    var resultDiv = $('#result');

    resultDiv.find($('#strategy-1-result')).append(strategy1result);
    resultDiv.find($('#strategy-2-result')).append(strategy2result);
}