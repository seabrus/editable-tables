# EdiTable: Excel-like UI for Table-based Web Documents

The aim of this project is to simulate some of the most popular MS Excel UI hot keys in table-based web documents which are used in accounting, science, etc. 

These javascript functions allow the user:
 - Turn on the edit mode in a table cell by Double-Click;
 - Move to the next or previous cell by "Tab" or "Shift-Tab" with preserving the editing mode in the active cell; 
 - Stop editing by "Esc", "Enter" or a mouse click. 
 
These functions are designed as independent event handlers, so you can easy add them to other packages such as DTable which enhance web table fuctionality.

The package is developed on a basis of jQuery 1.11.1. It's assumed that there are no other tables on the page except those which should be affected by this package. 

Javascript code is present in two versions: with a blur handler and without it. The first version is more sensitive to user's actions such as changing tabs in the browser, so cells easier lose the focus and leave the editable mode (at least in some main browsers). In the second version a table cell loses focus after only a given set of events, not after the general blur event.

HTML and CSS files are developed just to give you idea how it works. Both files are given for the blur version. Don't forget to add the jQuery 1.11.1 library.

Try the demo [here](http://seabrus.github.io/editable-tables/).

## Take Note

If you cannot control the user input and there could be such users that write something like
```js
<script> **dangerous code** </script>
```
in the table cells, you should add text validation to your application.
