console.log(`'Allo 'Allo! Event Page`)

browser.contextMenus.removeAll().then(() => {
  let gettingBangsArray = browser.storage.local.get('faves')
  gettingBangsArray.then(item => {
    if (item.faves && item.faves.length > 0) {
      item.faves.forEach(fave => {
        browser.contextMenus.create({
          id: fave.bang,
          title: fave.name,
          contexts: ['selection']
        })
      })
    }
  })
})

browser.runtime.onInstalled.addListener((details) => {
  console.log('previousVersion', details.previousVersion)
  browser.runtime.openOptionsPage()
})

browser.storage.onChanged.addListener(deets => {
  browser.contextMenus.removeAll().then(() => {
    deets.faves.newValue.forEach(item => {
      browser.contextMenus.create({
        id: item.bang,
        title: item.name,
        contexts: ['selection']
      })
    })
  })
})

browser.contextMenus.onClicked.addListener(data => {
  browser.search.search({
    query: `${data.menuItemId} ${data.selectionText.trim()}`,
    engine: 'DuckDuckGo'
  })
})