import m from 'mithril'

class Bookmark {
  constructor(data) {
    this.id = m.prop(data.id);
    this.title = m.prop(data.title);
    this.url = m.prop(data.url);
    this.categories = m.prop(data.categories);
  }

  static fetch() {
    return new Promise(function(resolve) {
      chrome.bookmarks.getTree(function(tree) {
        let results = [];
        let categories = [];
        extract(results, categories, tree[0]);
        resolve(m.prop(results));
      });
    });
  }

  static filter(bookmarks, keyword) {
    if (!keyword) {
      return bookmarks;
    }
    let _k = keyword.toLowerCase();
    return bookmarks.filter((bookmark) => {
      let title = bookmark.title().toLowerCase();
      let url = bookmark.url().toLowerCase();
      let categories = bookmark.categories().toLowerCase();
      return title.indexOf(_k) !== -1 || url.indexOf(_k) !== -1 || categories.indexOf(_k) !== -1;
    });
  }

  open() {
    return new Promise((resolve, reject) => {
      if (typeof this.url() === 'undefined') {
        reject(new Error('argument 1: bookmark is required'));
      }
      var url = this.url();
      chrome.tabs.create({ url: url });
    });
  }
}

function extract(results, categories, node) {
  if (node.children) {
    if (node.title) categories.push(node.title);
    node.children.forEach((child) => {
      extract(results, categories, child);
    });
    if (node.title) categories.pop();
  } else {
    results.push(new Bookmark({
      id: node.id,
      title: node.title,
      url: node.url,
      categories: categories.join('/')
    }));
  }
}

export default Bookmark;

