console.log('From Options');
// browser.storage.local.clear()
let faveBangsArray = []
let gettingBangsArray = browser.storage.local.get('faves').then(function (arrs) {
    faveBangsArray = arrs.faves ? arrs.faves : []
})

function loadJSON(callback) {
    const jsonUrl = 'https://raw.githubusercontent.com/dandansoysauce/duckduckgo-cbang/master/app/resources/bangs.json'
    fetch(jsonUrl)
        .then(response => {
            return response.json()
        })
        .then(result => {
            callback(result)
        })
}

function appendFaves(faveObj) {
    var ulBangs = document.getElementById('fave-bangs')
    let newLi = document.createElement('li')
    let newLabel = document.createElement('label')
    let span = document.createElement('span')

    newLi.id = faveObj.id
    span.textContent = faveObj.name
    newLabel.appendChild(span)
    newLi.appendChild(newLabel)
    ulBangs.appendChild(newLi)
}

function removeFave(faveObjId) {
    document.getElementById(faveObjId).remove()
}

function appendList(bangsData) {
    var ulBangs = document.getElementById('availables')
    while (ulBangs.firstChild) {
        ulBangs.removeChild(ulBangs.firstChild);
    }
    bangsData.forEach(element => {
        let newLi = document.createElement('li')
        let newLabel = document.createElement('label')
        let checkbox = document.createElement('input')
        let span = document.createElement('span')

        let isChecked = faveBangsArray.filter(x => x.bang === element.bang)[0]

        span.textContent = element.name
        checkbox.id = element.bang
        checkbox.dataset.bangname = element.name
        checkbox.type = 'checkbox'
        checkbox.checked = isChecked ? isChecked.selected : false
        checkbox.onchange = function (e) {
            const objFave = {
                name: e.target.dataset.bangname,
                bang: e.target.id,
                selected: e.target.checked,
                id: e.target.dataset.bangname.replace(' ', '')
            }
            
            if (e.target.checked) {
                appendFaves(objFave)
                faveBangsArray.push(objFave)
            } else {
                removeFave(objFave.id)
                faveBangsArray = faveBangsArray.filter(x => x.bang !== e.target.id)
            }

            browser.storage.local.set({
                faves: faveBangsArray
            })
        }

        newLabel.appendChild(checkbox)
        newLabel.appendChild(span)
        newLi.appendChild(newLabel)
        ulBangs.appendChild(newLi)
    });
}

function restoreOptions () {
    loadJSON(function(bangs) {
        var bangsData = bangs.data;
        appendList(bangsData)        

        faveBangsArray.forEach(element => {
            appendFaves(element)
        })

        var search = document.getElementById('search-input')
        search.oninput = function (e) {
            var filteredBangs = bangsData.filter(x => x.name.toLowerCase().includes(e.target.value.toLowerCase()))
            setTimeout(appendList(filteredBangs), 1000)
        }
    });
}

document.addEventListener("DOMContentLoaded", restoreOptions);