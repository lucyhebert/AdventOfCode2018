$(document).ready(function() {
    solveDay3('input.txt');
});


function solveDay3(filePath) {

    $.get(filePath, function(data) {

        var claims = getClaimsAsObjectsList(data);
        var result = getOverlappingPoints(claims);
        var matrix = result[0];
        var overlappingInches = result[1];
        var intactClaim = getIntactClaim(claims);

        generateHtmlView(matrix, overlappingInches, intactClaim);
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
            startX: parseInt(lineData[2].substr(0, lineData[2].indexOf(','))) + 1,
            startY: parseInt(lineData[2].substr((lineData[2].indexOf(',') + 1), ((lineData[2].indexOf(':') - (lineData[2].indexOf(',') + 1))))) + 1,
            width: parseInt(lineData[3].substr(0, lineData[3].indexOf('x'))),
            height: parseInt(lineData[3].substr(lineData[3].indexOf('x') + 1)),
            endX: function() {
                return (this.startX + this.width);
            },
            endY: function() {
                return (this.startY + this.height);
            },
            overlapped: false
        };

        claimsList[i] = claim;
    }

    return claimsList;
}


function getOverlappingPoints(claims) {

    var fabric = [];
    var overlappingPoints = 0;

    claims.forEach(function(claim) {

        var overlap = false;

        for(var i = claim.startX; i < claim.endX(); i++) {

            for(var j = claim.startY; j < claim.endY(); j++) {

                if(!fabric[i]) {
                   fabric[i] = []
                }

                if(!fabric[i][j]) {
                   fabric[i][j] = claim.id;
                }
                else {
                    if(fabric[i][j] !== 'X') {
                       (claims[fabric[i][j] - 1]).overlapped = true;
                        overlappingPoints++;
                    }

                    fabric[i][j] = 'X';
                    overlap = true;
                }
            }
        }

        if(overlap) {
            claim.overlapped = true;
        }
    });

    return [fabric, overlappingPoints];
}


function getIntactClaim(claims) {

    var result =  claims.filter(function (claim) {
       return claim.overlapped === false;
    });

    if(result.length > 1) {
        return 'ERROR : multiple claims found !'
    }
    else {
        return result[0].id;
    }
}


function generateHtmlView(fabricResult, overlappingResult, intactClaimResult) {

    var resultDiv = $('#result');
    var table = "<table>";
    var pointColor;

    for(var i=0; i<fabricResult.length; i++) {

        table += "<tr>";

        if(!fabricResult[i]) {
            fabricResult[i] = [0];
        }

        for(var j=0; j<fabricResult[i].length; j++){

            if(!fabricResult[i][j]) {
                fabricResult[i][j] = " ";
            }

            if(fabricResult[i][j] === 'X') {
                pointColor = "red";
            }
            else {
                pointColor = "blue";
            }

            table += "<td class=" + pointColor + ">" + fabricResult[i][j] + "</td>";
        }

        table += "</tr>";
    }

    table += "</table>";

    resultDiv.find($('#overlapping-result')).append(overlappingResult);
    resultDiv.find($('#intact-claim-result')).append(intactClaimResult);
    resultDiv.find($('#table-result')).append(table);
}