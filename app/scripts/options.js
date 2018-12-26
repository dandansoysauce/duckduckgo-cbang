console.log('From Options');
function loadJSON(callback) {
    var bangsText = browser.extension.getURL('resources/bangs.json');
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', bangsText, true);
    // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function() {
        console.log(xobj)
        if (xobj.readyState === 4 && xobj.status === "200") {
            // Required use of an anonymous callback 
            // as .open() will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

function restoreOptions () {
    loadJSON(function(response) {
        // Parse JSON string into object
        var actual_JSON = JSON.parse(response);
        console.log(actual_JSON)
    });
}

document.addEventListener("DOMContentLoaded", restoreOptions);