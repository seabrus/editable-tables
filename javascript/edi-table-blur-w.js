/*
 * Editable Tables
 * Excel-like UI for table-based web documents 
 * 
 * Widget - BLUR
 * v. 0.1.0
 */

(function($) {

	$.fn.ediTable = function( options ) {
//		this.each( function() {
//			var $element = $(this);
//		}

// =============================================================
//     Parameters and callbacks
// =============================================================
		var defaults = {
			beforeEdit : function( $editableTD ) {},
			endEdit :     function( $editableTD ) {},
		};
		var opts = $.extend(defaults, options);
		
		
// =============================================================
//     Event handlers
// =============================================================
	    // Make a table cell editable on double click
	    $('tbody').on('dblclick', 'td', function(event) {
	        event.preventDefault();
	        opts.beforeEdit( $(this) );
	        makeEditable( $(this) );
	    });
	    
	    // Stop editing on blur
		$('tbody').on('blur', '.editable-cell-77', function() {
			var self = $(this).parent();
			cancelEditable( self );
			opts.endEdit( self );
	        $( window ).focus();
		});	


	    // Keyboard events: 
	    // -- Stop editing on "Enter" and "Esc"
	    // -- Move to next or previous cell on "Tab" and "Shift-Tab"
	    $('tbody').on('keydown', '.editable-cell-77', function(event) {
	        var self = $(this).parent();
	
	        if (event.which === 13 || event.which === 27) {    // "Enter" or "Esc" is pressed
	            event.preventDefault();
	            cancelEditable( self );
	            $( window ).focus();
	        }
	        else if (event.which === 9   &&   event.shiftKey ) {    // "Shift-Tab" is pressed
	            event.preventDefault();
	            cancelEditable( self );
	
	            var prevTD = self.prev('td');
	            if ( prevTD.length === 0 ) {
	                var prevTR = self.parent('tr').prev('tr');
	                if ( prevTR.length === 0 ) {
	                    $( window ).focus();
	                    return;
	                }
	                prevTD = prevTR.children('td').eq( prevTR.children('td').length - 1 );
				}
	
	            makeEditable( prevTD );
	        }
	        else if (event.which === 9 ) {    // "Tab" is pressed
	            event.preventDefault();
	            cancelEditable( self );
	
	            var nextTD = self.next('td');
	            if ( nextTD.length === 0 ) {
	                var nextTR = self.parent('tr').next('tr');
	                if ( nextTR.length === 0 ) {
	                    $( window ).focus();
	                    return;
	                }
	                nextTD = nextTR.children('td').eq(0);		
	            }
		
	            makeEditable( nextTD );
	        }
	    });

	    // The same as the previous function - for Opera
	    $('tbody').on('keyup', '.editable-cell-77', function(event) {
	        var self = $(this).parent();
	
	        if (event.which === 13 || event.which === 27) {    // "Enter" or "Esc" is pressed --- Opera
	            event.preventDefault();
	            cancelEditable( self );
	            $( window ).focus();
	        }
	    });


// =============================================================
//     Basic functions
// =============================================================
		// Clear selection that appears when the user double clicks text
	    function clearSelection() {
	        if (document.selection   &&   document.selection.empty) {
	            document.selection.empty();
	        } 
	        else if (window.getSelection) {
	            var sel = window.getSelection();
	            sel.removeAllRanges();
	        }
	    }
	    
		// Make a table cell editable
	    function makeEditable( target ) {
	        var editableHTML = '<span contenteditable="true" class="editable-cell-77">' + target.text() + '</span>';
	        target.html( editableHTML );
	        clearSelection();
	        target.children().eq(0).focus();
	    }
	    
		// Cancel the editable mode for a table cell
	    function cancelEditable( target ) {
	        target.html( target.text() );
	    }


		return this;
	};

})(jQuery);
