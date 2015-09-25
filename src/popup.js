import m from 'mithril';
import Tabs from './components/tabs';
import Bookmarks from './components/bookmarks';

let main = document.getElementById('main');

m.route(main, '/tabs', {
  '/tabs': Tabs,
  '/bookmarks': Bookmarks
});

