(function() {
  'use strict';

  /**
   * AngularJS 1.x Cacheable Tree View directive. Most suitable for tree-like menus.
   *
   * Featuers and limitations:
   *  - Fast DOM genereation, it tooks about 15 ms to genereate list of 1185 items on my MacBook Pro late 2013,
   *    it is about 100-times faster compared to Angular Tree View directive which is implemented with ng-repeate.
   *  - It is possible to cache the resulted DOM by adding the 'rememberMe' flag to the first node in the model.
   *  - Watches only for model instance changes, which means it doesn't update the DOM if changes are inside the tree model.
   *  - Handles node selection by setting scope[treeModel].currentNode and adding 'selected' class to the selected element.
   *
   * Input attributes:
   * @treeId - unique tree-id to store currentNode in the current $scope
   * @treeModel - array of nodes, the tree model on $scope.
   *
   * Usage:
   *
   * <pre>
   *  <code>
   *   &lt div data-cacheable-treeview
   *           data-tree-id="tree"
   *           data-tree-model="roleList"
   *     &lt/div>
   *  </code>
   * </pre>
   *
   * Pre requirements:
   * - depends on lodash
   * - every node object should contain fields: int id, String name and children array;
   *
   */

  angular.module('cacheableTreeview', [])
    .directive('treeModel', angularTreeviewDirective);

  function angularTreeviewDirective($compile, $sce) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var treeId      = attrs.treeId;
        var treeModel   = attrs.treeModel
        var rememberDOM = _.memoize(printDOM, hashcodeTreeIds)
        var selectedElement;

        scope[treeId] = scope[treeId] || {};

        scope.$watch(treeModel, buildTree);

        function buildTree(tree) {
          //console.time('buildTree')
          selectedElement = void 0;
          if (!_.isEmpty(tree)) {
            element.html('').append(tree[0].rememberMe ? rememberDOM(tree) : printDOM(tree));
            element.on('click', onTreeClick);
          }
          selectCurrentNode();
          //console.timeEnd('buildTree')
        }

        function selectCurrentNode() {
          if (scope[treeId].currentNode && scope[treeId].currentNode.id) {
            element.find('[data-id=' + scope[treeId].currentNode.id + ']').addClass('selected');
          }
        }

        function printDOM(tree) {
          if (!_.isEmpty(tree)) {
            return '<ul>' + _.reduce(tree, printDOMReducer, '') + '</ul>';
          } else {
            return '';
          }
        }

        function printDOMReducer(result, node) {
          return [result, '<li><span data-id="' + node.id + '">', node.name, '</span>', printDOM(node.children), '</li>'].join('');
        }

        /**
         * Instead of creating separate click-handler on each node, which is much slower,
         * and due to the tree DOM lost all events handlers when it moved out of page, so we can't simply restore it from cache,
         * we are listenning for the whole tree and filter out events we are not interested in.
         */
        function onTreeClick(e) {
          if (e.target.tagName === "SPAN") { // we are interested only on node clicks
            if (selectedElement) {
              selectedElement.className = '';
            } else if(scope[treeId].currentNode) {
              element.find('span').removeClass('selected');
            }
            selectedElement                = e.target;
            selectedElement.className      = 'selected';
            scope[treeId].currentNode      = {};
            scope[treeId].currentNode.id   = parseInt(e.target.getAttribute('data-id'));
            scope[treeId].currentNode.name = angular.element(e.target).text();
            scope.$digest();
          }
        }

        function hashcodeTreeIds(tree) {
          if (_.isEmpty(tree)) {
            return 0
          } else {
            return _.reduce(tree, function(result, node) {
              return ((( node.id * 31 + result) % 7177) * 31 + hashcodeTreeIds(node.children)) % 7177
            }, 0);
          }
        }

      }
      
    };
  }

})();
