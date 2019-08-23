$(document).ready(function() {
    solveDay5('input.txt');
});


function solveDay5(filePath) {

    $.get(filePath, function(data) {

        var finalPolymerSize = scanPolymer(data.split(""));

        generateHtmlView(finalPolymerSize);

    });
}


function scanPolymer(polymer) {

    var polymerLength = polymer.length;

    var i = 1;

    while(i < polymerLength) {
        if(areUnitsReacting(polymer[i - 1], polymer[i])) {
            polymer.splice((i - 1), 2);
            polymerLength -= 2;
            if(i > 1) {
                i--;
            }
        }
        else {
            i++
        }
    }

    return polymer.length;
}


function areUnitsReacting(unitA, unitB) {

    var result = false;

    if(unitA === unitB) {
        return result
    }
    else {
        if((unitA === unitA.toUpperCase() && unitA === unitB.toUpperCase()) || (unitA === unitA.toLowerCase() && unitA === unitB.toLowerCase())) {
            console.log("found pair : " + unitA + unitB);
            result = true;
        }
    }

    return result
}


function generateHtmlView(finalPolymerSize) {

    var resultDiv = $('#result');

    resultDiv.find($('.text-result')).append(finalPolymerSize);
}