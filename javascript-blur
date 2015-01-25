$( document ).ready( function() {

  function clearSelection() {
    if (document.selection   &&   document.selection.empty) {
      document.selection.empty();
    } 
    else if (window.getSelection) {
      var sel = window.getSelection();
      sel.removeAllRanges();
    }
  }
  
  function makeEditable( target ) {
    var editableHTML = '<span contenteditable="true" class="editable-cell-77">' + target.text() + '</span>';
    target.html( editableHTML );
    clearSelection();
    target.children().eq(0).focus();
  }
  
  function cancelEditable( target ) {
    target.html( target.text() );
  }

	
  $('tbody').on('dblclick', 'td', function(event) {
    event.preventDefault();
    makeEditable( $(this) );
  });

  $('tbody').on('blur', '.editable-cell-77', function() {
    var self = $(this).parent();
    cancelEditable( self );
    $('body').focus();
  });	
	
  $('tbody').on('keyup', '.editable-cell-77', function(event) {
    var self = $(this).parent();

    if (event.which === 13 || event.which === 27) {    // "Enter" or "Esc" is pressed --- Opera
      event.preventDefault();
      cancelEditable( self );
      $('body').focus();
    }
  });

  $('tbody').on('keydown', '.editable-cell-77', function(event) {
    var self = $(this).parent();

    if (event.which === 13 || event.which === 27) {    // "Enter" or "Esc" is pressed
      event.preventDefault();
      cancelEditable( self );
      $('body').focus();
    }
    else if (event.which === 9   &&   event.shiftKey ) {    // "Shift-Tab" is pressed
      event.preventDefault();
      cancelEditable( self );

      var prevTD = self.prev('td');
      if ( prevTD.length === 0 ) {
        var prevTR = self.parent('tr').prev('tr');
        if ( prevTR.length === 0 ) {
          $('body').focus();
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
          $('body').focus();
          return;
        }
        nextTD = nextTR.children('td').eq(0);		
      }
	
      makeEditable( nextTD );
    }
  });

});
