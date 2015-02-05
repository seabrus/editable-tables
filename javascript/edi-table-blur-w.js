/*
 * Edi-Table
 * Excel-like UI for table-based web documents 
 * 
 * Widget - BLUR
 * v. 0.1.0
 */

(function($) {

    $.fn.ediTable = function( settings ) {
//      this.each( function() {
//          var $element = $(this);
//      }

// =============================================================
//     Settings and callbacks
// =============================================================
        var defaults = {
            beforeMakeEditable : function( $editableTD ) { },
            afterCancelEditable :  function( $editableTD ) { } 
        };
        var sts = $.extend( defaults, settings );
        
        
// =============================================================
//     Event handlers
// =============================================================
        // Make a table cell editable on double click
        $('tbody').on('dblclick', 'td.editable-td', function(event) {
            event.preventDefault();
            makeEditable( $(this) );
        });
        
        // Stop editing on blur
        $('tbody').on('blur', '.editable-cell-77', function(event) {
            event.preventDefault();
            var self = $(this).parent();
            cancelEditable( self );
        }); 


        // Keyboard events: 
        // -- Stop editing on "Enter" and "Esc"
        // -- Move to a next or previous cell on "Tab" and "Shift-Tab"
        $('tbody').on('keydown', '.editable-cell-77', function(event) {
            var self = $(this).parent();
    
            if (event.which === 13 || event.which === 27) {    // "Enter" or "Esc" is pressed
                event.preventDefault();
                cancelEditable( self );
            }
            else if (event.which === 9   &&   event.shiftKey ) {    // "Shift-Tab" is pressed
                event.preventDefault();
                cancelEditable( self );
    
                var prevAllEdiTD = self.prevAll('.editable-td');
                var prevTD = prevAllEdiTD.eq(0);
                if ( prevAllEdiTD.length === 0 ) {
                    var prevTR = self.parent('tr').prev('tr');
                    if ( prevTR.length === 0 ) {
                        return;
                    }
                    prevTD = prevTR.children('.editable-td').eq(-1);
                }
    
                makeEditable( prevTD );
            }
            else if (event.which === 9 ) {    // "Tab" is pressed
                event.preventDefault();
                cancelEditable( self );
    
//                var nextTD = self.next('td');
                var nextAllEdiTD = self.nextAll('.editable-td');
                var nextTD = nextAllEdiTD.eq(0);
//              if ( nextTD.length === 0 ) {
//              if ( self.nextAll('td').length === 1 ) {
//                if ( nextTD.length === 0  ||  nextTD.hasClass('add-new-row') ) {
                if ( nextAllEdiTD.length === 0 ) {
                    var nextTR = self.parent('tr').next('tr');
                    if ( nextTR.length === 0 ) {
                        return;
                    }
//                    nextTD = nextTR.children('td').eq(0);
                    nextTD = nextTR.children('.editable-td').eq(0);
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
            sts.beforeMakeEditable( target );

            var editableHTML = '<span contenteditable="true" class="editable-cell-77">' + target.text() + '</span>';
            target.html( editableHTML );
            clearSelection();
            target.children().eq(0).focus();
        }
        
        // Cancel the editable mode for a table cell
        function cancelEditable( target ) {
            target.html( target.text() );
            clearSelection();
            $( window ).focus();
            
            sts.afterCancelEditable( target );
        }


        return this;
    };

})(jQuery);
