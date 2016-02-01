AngularJS 1.x Cacheable Tree View directive. 
================

Most suitable for tree-like menus.

[![ScreenShot](https://github.com/nakolkin/angular-cacheable-treeview/raw/master/img/preview.png)]

## Featuers and limitations:
   - Fast DOM genereation, it tooks about 15 ms to genereate list of 1185 items on my MacBook Pro late 2013,
     it is about 100-times faster compared to Angular Tree View directive which is implemented with ng-repeate.
   - It is possible to cache the resulted DOM by adding the 'rememberMe' flag to the first node in the model.
   - Watches only for model instance changes, which means it doesn't update the DOM if changes are inside the tree model.
   - Handles node selection by setting scope[treeModel].currentNode and adding 'selected' class to the selected element.

## Installation

...

## Usage

Attributes of angular cacheable treeview are below.

- angular-treeview: the treeview directive.
- tree-id: unique tree-id to store currentNode in the current $scope
- tree-model: array of nodes, the tree model on $scope.

Here is a simple example.


```html
<div
    data-cacheable-treeview="true"
	data-tree-id="treeId"
	data-tree-model="treeModel"
 >
</div>
```

Example model:

```javascript
$scope.treeModel = 
[
	{ "name" : "User", "id" : 1, "children" : [
		{ "name" : "subUser1", "id" : 2, "children" : [] },
		{ "name" : "subUser2", "id" : 3, "children" : [
			{ "name" : "subUser2-1", "id" : 4, "children" : [
				{ "name" : "subUser2-1-1", "id" : 5, "children" : [] },
				{ "name" : "subUser2-1-2", "id" : 6, "children" : [] }
			]}
		]}
	]},
	{ "name" : "Admin", "id" : 7, "children" : [] },
	{ "name" : "Guest", "id" : 8, "children" : [] }
];	 
```

## Selection

If tree node is selected, then that selected tree node is saved to $scope."TREE ID".currentNode. By using $watch, the controller can recognize the tree selection.


```javascript
$scope.$watch( 'treeId.currentNode', function( newObj, oldObj ) {
     console.log( 'Node Selected!!' );
     console.log( $scope.treeId.currentNode );    }
});
```

## Examples


## License

The MIT License.

See [LICENSE](https://github.com/eu81273/angular.treeview/blob/master/LICENSE)
