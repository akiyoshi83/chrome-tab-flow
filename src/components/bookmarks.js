import m from 'mithril'
import * as u from '../utils/util'
import Bookmark from '../models/bookmark'
import Header from './header'

let vm = {
  init() {
    vm.keyword = m.prop("");
    vm.list = m.prop([]);
    Bookmark.fetch().then((data) => {
      vm.list = data;
      m.redraw();
    });

    vm.filter = () => {
      return Bookmark.filter(vm.list(), vm.keyword());
    }
  }
};

let Bookmarks = {
  controller() {
    vm.init();
    this.updateKeyword = (ev) => {
      vm.keyword(ev.currentTarget.value);
      vm.filter();
    }
    this.keydown = (ev) => {
      let kc = ev.keyCode;
      let target = ev.currentTarget;
      // Enter
      if (kc === 13) {
        let bookmark = vm.list().find((t) => t.id() == target.dataset.bookmarkId);
        bookmark.open();
      }
      // UP, K
      else if (kc === 38 || kc === 75) {
        target.previousSibling.focus();
      }
      // DOWN, J
      else if (kc === 40 || kc === 74) {
        target.nextSibling.focus();
      }
      // S (focus search input)
      else if (kc === 83) {
        document.getElementById('bookmark_search_box').focus();
        ev.preventDefault();
      }
    }
  },

  view(ctrl) {
    return m('.bookmarks', [
      m.component(Header),
      m('.input_area', [
        m('input[type="text"]#bookmark_search_box.search', {
          placeholder: u.m('placeholderSearch'),
          value: vm.keyword(),
          onkeyup: ctrl.updateKeyword,
          config: (elem, isInitialized, context) => {
            if (!isInitialized) elem.focus();
          }
        })
      ]),

      m('.output_area', [
        m('ul.bookmarks', vm.filter().map((bookmark) => {
          return m('li.bookmark', {
            tabIndex: 0, // form要素以外にfocusを当てるために
            'data-bookmark-id': bookmark.id(),
            onkeydown: ctrl.keydown
          }, [
            m('.name', bookmark.title()),
            m('.url', bookmark.url()),
          ]);
        }))
      ])
    ]);
  }
};

export default Bookmarks;

