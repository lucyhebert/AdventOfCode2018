$(document).ready(function() {
    resolveDay3Part1('input.txt');
});

function resolveDay3Part1(filePath) {

    $.get(filePath, function(data) {

        var claims = getClaimsAsObjectsList(data);
        var result = getOverlappingPoints(claims);
        var matrix = result[0];
        var overlappingInches = result[1];

        generateHtmlTable(matrix, overlappingInches);
    });
}

function getClaimsAsObjectsList(data) {

        var claimsList = [];
        var lines = data.split("\n");

        for(var i = 0; i < lines.length; i++) {

            var line = lines[i];
            var lineData = line.split(" ");
            var claim;

            claim = {
                id: parseInt(lineData[0].substr(line.indexOf('#') + 1)),
                inchesFromLeft: parseInt(lineData[2].substr(0, lineData[2].indexOf(','))),
                inchesFromTop: parseInt(lineData[2].substr((lineData[2].indexOf(',') + 1), ((lineData[2].indexOf(':') - (lineData[2].indexOf(',') + 1))))),
                width: parseInt(lineData[3].substr(0, lineData[3].indexOf('x'))),
                height: parseInt(lineData[3].substr(lineData[3].indexOf('x') + 1))
            };

            claimsList[i] = claim;

        }

        return claimsList;
}

function getOverlappingPoints(claims) {

    var fabric = [];
    var overlappingPoints = 0;

    claims.forEach(function(claim) {

        var startX = claim.inchesFromLeft + 1 ;
        var endX = startX + claim.width;
        var startY = claim.inchesFromTop + 1;
        var endY = startY + claim.height;

       for(var i = startX; i < endX; i++) {

           for(var j = startY; j < endY; j++) {

               if(!fabric[i]) {
                   fabric[i] = []
               }

               if(!fabric[i][j]) {
                   fabric[i][j] = '0';
               }
               else if(fabric[i][j] !== 'X') {
                   fabric[i][j] = 'X';
                   overlappingPoints++;
               }
           }
       }
    });

    return [fabric, overlappingPoints];
}

function generateHtmlTable(resultArray, result) {

    var resultDiv = $('#result');
    var table = "<table>";
    var pointColor;

    for(var i=0; i<resultArray.length; i++) {

        table += "<tr>";

        if(!resultArray[i]) {
            resultArray[i] = [0];
        }

        for(var j=0; j<resultArray[i].length; j++){

            if(!resultArray[i][j]) {
                resultArray[i][j] = " ";
            }

            if(resultArray[i][j] === 'X') {
                pointColor = "red";
            }
            else {
                pointColor = "blue";
            }

            table += "<td class=" + pointColor + ">" + resultArray[i][j] + "</td>";


        }
        table += "</tr>";
    }

    table += "</table>";

    resultDiv.find($('#overlapping-result')).append(result);
    resultDiv.find($('#table-result')).append(table);
}