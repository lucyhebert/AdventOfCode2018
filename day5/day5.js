$(document).ready(function() {
    solveDay5('input.txt');
});


function solveDay5(filePath) {

    $.get(filePath, function(data) {

        var polymer = data.split("")

        var finalPolymerSize = scanPolymer(polymer);

        var minPolymerSize = findMinPolymerLength(polymer);

        generateHtmlView(finalPolymerSize, minPolymerSize);

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
    else if((unitA === unitA.toUpperCase() && unitA === unitB.toUpperCase()) || (unitA === unitA.toLowerCase() && unitA === unitB.toLowerCase())) {
        result = true;
    }

    return result
}


function findMinPolymerLength(polymer) {

    var charArray = findProblematicType(polymer);

    return Math.min.apply(null, charArray.map(function(char) {
        return char.polymerLength;
    }));
}


function findProblematicType(polymer) {

    var alphabet = [], i = 'a'.charCodeAt(0), j = 'z'.charCodeAt(0);
    for (; i <= j; ++i) {
        alphabet.push(String.fromCharCode(i));
    }

    var newPolymer;
    var newPolymerLength;
    var charArray = [];

    $(alphabet).each(function(index, char) {
        newPolymer = removeType(polymer, char);
        newPolymerLength = scanPolymer(newPolymer);
        charArray.push({
            char: char,
            polymerLength: newPolymerLength
        });
    });

    return charArray;
}


function removeType(polymer, type) {
    return polymer.filter(function(index) {
        return index !== type && index !== type.toUpperCase();
    });
}


function generateHtmlView(finalPolymerSize, minPolymerSize) {

    var resultDiv = $('#result');

    resultDiv.find($('#final-polymer-size')).append(finalPolymerSize);
    resultDiv.find($('#min-polymer-size')).append(minPolymerSize);
}