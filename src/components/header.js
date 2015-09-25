import m from 'mithril'

let Header = {
  controller() {
    this.showTabs = (ev) => {
      m.route('/tabs');
    }
    this.showBookmarks = (ev) => {
      m.route('/bookmarks');
    }
  },
  view(ctrl) {
    return m('.header', [
      m('a.tabs', {
        class: m.route() === '/tabs' ? 'selected' : '',
        onclick: ctrl.showTabs
      }, 'TAB'),
      m('a.bookmarks', {
        class: m.route() === '/bookmarks' ? 'selected' : '',
        onclick: ctrl.showBookmarks
      }, 'BOOKMARK')
    ]);
  }
};

let keydown = (ev) => {
  let kc = ev.keyCode;
  let ctrl = ev.ctrlKey;
  let target = ev.currentTarget;
  if (ctrl) {
    // Ctrl + J
    if (kc == 74) {
      m.route('/tabs');
    }
    // Ctrl + K
    else if (kc === 75) {
      m.route('/bookmarks');
    }
  }
}
document.addEventListener('keydown', keydown);

export default Header;

