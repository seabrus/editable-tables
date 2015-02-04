$( document ).ready( function() {

// ========================================
//   The edi-table settings
// ========================================
    var settings = {
        beforeMakeEditable : fnBeforeMakeEditable,
        afterCancelEditable :  fnAfterCancelEditable,
        
        maxIdOfNewRow : 0   // To build IDs for new rows
    }


// ========================================
//   Initiation of the edi-table package
// ========================================
    $('tbody').ediTable( settings );


// ========================================
//   Setting functions
// ========================================
	function fnBeforeMakeEditable( $editableTD ) {
		//$editableTD.text( 'BEFORE' );
	
		// Save the initial text in the cell - to compare with text after editing afterwards
		$editableTD.data('before', $editableTD.text());
        
    } 

	function fnAfterCancelEditable( $editableTD ) {
		//$editableTD.text( 'AFTER' );
		
		// Is text in the cell changed?
		if ( $editableTD.data('before') !== $editableTD.text() ) {
			$editableTD.data( 'is-changed', 'true' );
			$editableTD.text( 'Changed !!!' );
		}
		$editableTD.removeData('before'); 
	
	}


// ========================================
//   Add a new row
// ========================================
	$('tbody').on('click', '.add-new-row', function() {
		var parentTR = $(this).parent('tr');
		var newRow = parentTR.clone( false, true );
		newRow.attr('id', 'new-row-' + (settings.maxIdOfNewRow++) );
		
		newRow.insertAfter( parentTR );
	});





});


/*
	//DELETE a record in the table
	$('#records-table').on( 'click', '.td6',  function() { 
		var yes = confirm("Удалить запись?");
		if ( yes ) { 
			$(this).parent().remove();
			$('#records-table').attr( {'data-modified': 'true'} );
		}
	});

*/




