$(document).ready(function() {
    getDataAsMap('input.txt');
});

function getDataAsMap(filePath) {

    $.get(filePath, function(data) {

        var resultMap = [];

        var lines = data.split("\n");

        for(var i = 0; i < lines.length; i++) {

            var line = lines[i];

            var claim = {
                id: null,
                inchesFromLeft: null,
                inchesFromTop: null,
                width: null,
                height: null
            };

            var lineData = line.split(" ");

            claim.id = lineData[0].substr(line.indexOf('#') + 1);
            claim.inchesFromLeft = lineData[2].substr(0, lineData[2].indexOf(','));
            claim.inchesFromTop = lineData[2].substr((lineData[2].indexOf(',') + 1), ((lineData[2].indexOf(':') - (lineData[2].indexOf(',') + 1))));
            claim.width = lineData[3].substr(0, lineData[3].indexOf('x'));
            claim.height = lineData[3].substr(lineData[3].indexOf('x') + 1);

            resultMap[i] = claim;

        }

        console.log(resultMap);
        return resultMap;
    });
}