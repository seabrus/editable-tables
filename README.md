# excel-ui-for-web-tables-
Execl-like UI for Table-based Web Documents

To some extent this project is a training one. Its aim is to simulate some of the most popular MS Excel UI hot keys in table-based web documents which are used in accounting, science, etc. 

To be exact, these javascript functions allow the user:
 - Turn on the edit mode in a table cell by Double Click;
 - Move to the next or previous cell by "Tab" or "Shift-Tab" with preserving the editing mode in the active cell; 
 - Stop editing by "Esc", "Enter" or a mouse click. 
 
These functions are designed as independent event handlers, so you can easy add them to other packages which enhance table fuctionality such as DTable or many others.

The package is developed on a basis of jQuery 1.11.1. It's assumed that there are no other tables except those which should be affected by this package. 

Javascript code is provided in two versions: with a blur handler and without it. The first version is more sensitive to user's actions such as changing tabs in the browser and easier lose the focus and the editable mode (at least in some main browsers). In the second version a table cell loses focus after only a given set of events, not after the general blur event.
