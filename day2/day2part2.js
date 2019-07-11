$(document).ready(function() {
    getUniqueId('input.txt');
});

function getUniqueId(filePath) {

    $.get(filePath, function(data) {
        var words = data.split("\n");

        var tabLength = words.length;
        var result = null;
        var word = null;
        var wordToTest = null;
        var charToTest = null;
        var charToTest2 = null;
        var countForWord = 0;
        var charToRemove = null;

        for (var i = 0; i < tabLength; i++) {
            word = words[i];

            console.log("word n° " + i + " : " + word);

            for (var j = i + 1; j < tabLength - 1; j++) {

                wordToTest = words[j];
                console.log("		confronting word n° " + j + " : " + wordToTest);

                for (var k = 0; k < word.length; k++) {

                    charToTest = word[k];
                    console.log("			char n° " + k + " : " + charToTest);
                    charToTest2 = wordToTest[k];
                    console.log("			confronting char n° " + k + " : " + charToTest2);

                    if (charToTest !== charToTest2) {
                        countForWord++;

                        console.log("				-> chars are different");

                        if (countForWord > 1) {
                            console.log("				more than one pair for word -> pass this confronting word");
                            break;
                        } else {
                            charToRemove = charToTest;
                            console.log("				char to remove from word = " + charToRemove);
                        }
                    }
                }

                if (countForWord === 1) {
                    console.log("	correct boxes found!");
                    result = word.replace(charToRemove, '');
                    break;
                }

                countForWord = 0;
                charToRemove = null;
            }

            if (result) {
                break;
            }
        }

        console.log("result : " + result);

        var resultDiv = $('#result');
        resultDiv.append('<p>' + result + '</p>');

        return result;

    });
}