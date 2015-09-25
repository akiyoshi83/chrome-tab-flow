import m from 'mithril'

class Tab {
  constructor(data) {
    this.id = m.prop(data.id);
    this.windowId = m.prop(data.windowId);
    this.title = m.prop(data.title);
    this.url = m.prop(data.url);
  }

  static fetch() {
    return new Promise(function(resolve) {
      chrome.tabs.query({}, function(tabs) {
        tabs = tabs.map(function(tab) {
          return new Tab({
            id: tab.id,
            windowId: tab.windowId,
            title: tab.title,
            url:  tab.url,
          })
        });
        resolve(m.prop(tabs));
      });
    });
  }

  static filter(tabs, keyword) {
    if (!keyword) {
      return tabs;
    }
    let _k = keyword.toLowerCase();
    return tabs.filter((tab) => {
      let title = tab.title().toLowerCase();
      let url = tab.url().toLowerCase();
      return title.indexOf(_k) !== -1 || url.indexOf(_k) !== -1;
    });
  }

  static activate(tab) {
    return new Promise(function(resolve, reject) {
      if (typeof tab.id() === 'undefined'
      || typeof tab.windowId() === 'undefined') {
        reject(new Error('argument 1: tab is required'));
      }
      var windowId = tab.windowId();
      var tabId = tab.id();
      // activate window
      chrome.windows.update(windowId, {
        focused: true,
      }, function(w) {
        // activate tab
        chrome.tabs.update(tabId, {
          active: true,
        }, function(tab) {
          resolve(tab);
        });
      });
    });
  }
}

export default Tab;

