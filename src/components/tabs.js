import m from 'mithril'
import * as u from '../utils/util'
import Tab from '../models/tab'
import Header from './header'

let TabsVm = {
  init() {
    TabsVm.keyword = m.prop("");

    TabsVm.list = m.prop([]);
    Tab.fetch().then((data) => {
      TabsVm.list = data;
      m.redraw()
    });

    TabsVm.filter = () => {
      return Tab.filter(TabsVm.list(), TabsVm.keyword());
    }
  }
};

let Tabs = {
  controller() {
    TabsVm.init();
    this.updateKeyword = (ev) => {
      TabsVm.keyword(ev.currentTarget.value);
      TabsVm.filter();
    }
    this.keydown = (ev) => {
      let kc = ev.keyCode;
      let target = ev.currentTarget;
      // Enter
      if (kc === 13) {
        Tab.activate(TabsVm.list().find((t) => t.id() == target.dataset.tabId));
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
        document.getElementById('tab_search_box').focus();
        ev.preventDefault();
      }
    }
    this.focus = (ev) => {
      ev.currentTarget.classList.add('selected');
    }
    this.blur = (ev) => {
      ev.currentTarget.classList.remove('selected');
    }
  },

  view(ctrl) {
    return m('.tabs', [
      m.component(Header),
      m('.input_area', [
        m('input[type="text"]#tab_search_box.search', {
          placeholder: u.m('placeholderSearch'),
          value: TabsVm.keyword(),
          onkeyup: ctrl.updateKeyword,
          config: (elem, isInitialized, context) => {
            if (!isInitialized) elem.focus();
          }
        })
      ]),

      m('.output_area', [
        m('ul.tabs', TabsVm.filter().map((tab) => {
          return m('li.tab', {
            tabIndex: 0, // form要素以外にfocusを当てるために
            'data-tab-id': tab.id(),
            onkeydown: ctrl.keydown,
            onfocus: ctrl.focus,
            onblur: ctrl.blur
          }, [
            m('.name', tab.title()),
            m('.url', tab.url()),
          ]);
        }))
      ])
    ]);
  }
};

export default Tabs;

