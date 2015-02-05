;(function() {
  "use strict";

  function _m(key) {
    return chrome.i18n.getMessage(key);
  }

  function getTabs(opt) {
    opt = opt || {};
    return new Promise(function(resolve) {
      chrome.tabs.query(opt, function(tabs) {
        tabs = tabs.map(function(tab) {
          return {
            id: tab.id,
            windowId: tab.windowId,
            name: tab.title,
            url:  tab.url,
            selected: false,
          }
        });
        resolve(tabs);
      });
    });
  }

  function activateTab(tab) {
    return new Promise(function(resolve, reject) {
      if (typeof tab.id === 'undefined'
      || typeof tab.windowId === 'undefined') {
        reject(new Error('argument 1: tab is required'));
      }
      var windowId = tab.windowId;
      var tabId = tab.id;
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

  function init($scope) {
    $scope.filter().then(function() {
      // to keep popup width
      var $body = angular.element('body');
      $body.width($body.width());
    });
  }

  function bindFilter($scope) {
    return function filter() {
      return getTabs().then(function(tabs) {
        var keyword = $scope.keyword || '';
        if (keyword) {
          tabs = tabs.filter(function(tab) {
            return (
              tab.name.indexOf(keyword) !== -1
              || tab.url.indexOf(keyword) !== -1
            );
          });
        }
        $scope.tabs = tabs;
        $scope.$apply();
      });
    };
  }

  function bindFocusTab($scope) {
    return function focusTab($event, tab) {
      tab.selected = true;
    };
  }

  function bindBlurTab($scope) {
    return function blurTab($event, tab) {
      tab.selected = false;
    };
  }

  function bindKeydownOnTab($scope) {
    return function keydownOnTab($event) {
      var kc = $event.keyCode;
      var $target = $($event.target);
      // Enter
      if (kc === 13) {
        activateTab($scope.tabs[$scope.selectedIndex]);
      }
      // UP, K
      else if (kc === 38 || kc === 75) {
        $target.prev().focus();
      }
      // DOWN, J
      else if (kc === 40 || kc === 74) {
        $target.next().focus();
      }
      // S (focus search input)
      else if (kc === 83) {
        $('[name="search"]').focus();
      }
    };
  }

  var myApp = angular.module('TabFlow',[]);

  myApp.controller('MainCtrl', ['$scope', function($scope) {
    $scope.ph_search = _m('placeholderSearch')
    $scope.tabs = []
    $scope.keyword = '';
    $scope.selectedIndex = 0;
    $scope.filter = bindFilter($scope);
    $scope.focusTab = bindFocusTab($scope);
    $scope.blurTab = bindBlurTab($scope);
    $scope.keydownOnTab = bindKeydownOnTab($scope);

    init($scope);
  }]);
}());
