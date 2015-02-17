/*
 * Edi-Table
 * Excel-like UI for table-based web documents
 *
 * Widget - BLUR - Saving
 * v. 0.1.0
 */


$( document ).ready( function() {

// ==========================
//   The edi-Table settings
// ==========================
    var ediTableSettings = {
        beforeMakeEditable : fnBeforeMakeEditable,
        afterCancelEditable :  fnAfterCancelEditable
    }
// =========================================
//   Instantiation of the edi-Table package
// =========================================
    $('tbody').ediTable( ediTableSettings );



// =====================
//   Saving options
// =====================
    var saving = {
        url : '/db',                     // Address that is used to save data
        COL_ID : 'col_id_',     // Prefix before a column ID in a TD class. It's used to find the column ID (such as "name", "status", etc)

        rowIsChangedAttr : 'data-is-changed',       // data- attribute indicating a row in which some data were changed

        newRowIdPrefix : 'new-row-',       // Prefix of a new row ID string:  <tr id = "newRowIdPrefix..."  ...>
        newRowIdMax : 0,                       // To build unique IDs for new rows we add unique numbers at the end of IDs

        deletedRows : [],                          //  Buffer for info about deleted rows (if a row is deleted we cannot find it in the document any more)

        enqueue : fnEnqueueSaving,      // Enqueue saving when changed / new / deleted data appear

        timer : null,                                   // timer = setTimeout()
        saveData :  fnSaveData,              // Main function to save new, deleted and changed rows
        interval : 5000,                             // setTimeout( ..., interval )

        processesCounter : 0,                  // Counter to manage parallel async saving processes

        image : 'img.saving-in-progress',   // Selector to find the animated image "Saving in Progress"
    }



// ========================================
//   ediTable_settings methods
// ========================================
    function fnBeforeMakeEditable( $td ) {
        //$td.text( 'BEFORE' );

        // Save the initial text in the cell - to compare with text after editing afterwards
        $td.data( 'before', $td.text() );

    }

    function fnAfterCancelEditable( $td ) {
        //$td.text( 'AFTER' );

        // Is text in the cell changed?
        if ( $td.data('before') !== $td.text() ) {
            var parentTR = $td.parent('tr');
            parentTR.attr( saving.rowIsChangedAttr, 'true' );
            saving.enqueue();

            $td.text( 'changed' );
        }
        $td.removeData('before');

    }


// ====================
//   Add a new row
// ====================
    $('tbody').on('click', '.add-new-row', function() {
        var parentTR = $(this).parent('tr');
        var newRow = parentTR.clone();
        newRow.attr('id', '' + saving.newRowIdPrefix + (saving.newRowIdMax++) );
        newRow.insertAfter( parentTR );

        saving.enqueue();
    });

// ====================
//   Delete a row
// ====================
    $('tbody').on('click', '.delete-row', function() {
        var parentTR = $(this).parent('tr');
        var yes = confirm("Строка будет безвозвратно удалена.\nПродолжить?");
        if ( yes ) {
            if ( parentTR.attr('id').indexOf( saving.newRowIdPrefix ) === -1 ) {       // New rows are absent in the DB - no need to delete
                saving.deletedRows.push( parentTR.attr('id') );
                saving.enqueue();
            }
            parentTR.remove();
        }
    });

// ======================
//   Enqueue next saving
// ======================
    function fnEnqueueSaving() {
        if ( !saving.timer ) {
            saving.timer = setTimeout( saving.saveData, saving.interval );
        }
    }

// =============================================
//   Save new / updated / deleted data
// =============================================
    function fnSaveData() {
        $( saving.image ).show( 500 );
        saving.timer = null;

   // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   //   DELETE: Remove the deleted rows from DB
   // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        if ( saving.deletedRows.length > 0 ) {
            saving.processesCounter++;

            $.ajax( {
                url: saving.url,
                type: 'DELETE',
                contentType: 'application/json',
                data: JSON.stringify( saving.deletedRows ),
                success:   function( confirmedRows ) {
                        //alert("Удаленные строки удалены из БД на сервере успешно");
                        for ( var i=0, len = confirmedRows.length || 0; i < len; i++ ) {
                            saving.deletedRows = $.grep( saving.deletedRows, function( str ) {     // http://api.jquery.com/jquery.grep/
                                return ( str !== confirmedRows[ i ] );
                            });
                        }
                },
                error:   function() {
                        //alert("Удалить строки из БД на сервере не удалось, операция будет повторена позже");
                        saving.enqueue();
                }
            })
            .always( function() {
                saving.processesCounter--;
                hideLoading();
            });
        }


   // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   //   POST: New rows saving
   // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        var newRows = $( '[id^=' + saving.newRowIdPrefix + ']' );

        if ( newRows.length > 0 ) {
          // Data preparation
            var rowsDataArray = [];
            extractRowsData( newRows, rowsDataArray );

          // AJAX
            saving.processesCounter++;

            $.ajax( {
                url: saving.url,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify( rowsDataArray ),

                success:   function( savedRows ) {
                        //alert("Новые строки добавлены в БД на сервере успешно");
                        var newRow = null;
                        for ( var i=0, len = savedRows.length || 0; i<len; i++ ) {
                            newRow = $( '#' + savedRows[ i ].tempID );
                            if ( newRow.length !== 0 ) {
                                newRow.attr( 'id', savedRows[ i ].dbID );
                            }
                            else {
                                saving.deletedRows.push( savedRows[ i ].dbID );
                                saving.enqueue();
                            }
                        }
                        // ELSE above: if a server returns dbID for a new row but the row has already been deleted  - then enqueue it for deletion
                },
                error:   function() {
                        //alert("Добавить новые строки в БД на сервере не удалось, операция будет повторена позже");
                        saving.enqueue();
                }
            })
            .always( function() {
                saving.processesCounter--;
                hideLoading();
            });

            rowsDataArray = [];   // To unbind this array and local rowData's
        }

        // Function to extract data for selected rows -- row ID and info about children's columns with a specified marker
        function extractRowsData( $selectedRows, dataArray ) {
            $selectedRows.each( function() {
                var $row = $(this);

                var rowData = { id: '', tdArray: [] };
                var tdData = { id: '', text: '' };

                rowData.id = $row.attr( 'id' );

                var rowTDs = $row.children( '[class*=' + saving.COL_ID + ']' );
                var tdClass = '';
                for ( var i=0, len=rowTDs.length; i < len; i++ ) {
                    tdClass = rowTDs.eq(i).attr('class');
                    tdData.id = getTDId( tdClass );
                    tdData.text = rowTDs.eq(i).text();
                    rowData.tdArray[ i ] = { 'id': tdData.id, 'text': tdData.text };
                }

                dataArray.push( rowData );
            });
        }

        // Function to extract a column ID from a class name
        function getTDId( tdClass ) {       // tdClass  -- it's a string and include prefix + TD's ID   (sorry for naming mess)
            var buf = tdClass.split(' ') || [];

            for (var i=0, len=buf.length; i<len; i++) {
                if( buf[i].indexOf( saving.COL_ID ) !== -1) break;
            }

            return buf[i].slice( saving.COL_ID.length );
        }


   // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   //   PUT: Changed rows saving
   // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        var changedRows = $( '[' + saving.rowIsChangedAttr + '="true"' + ']' ).not( '[id^=' + saving.newRowIdPrefix + ']' );

        if ( changedRows.length > 0 ) {
          // Change the rows status
            changedRows.attr( saving.rowIsChangedAttr, 'on-saving' );

          // Data preparation:
            //    rowsIDs:   Array of rows IDs (it's used in the ajax handlers on the client side)
            //   rowsDataArray:   Array of rows data (ID + data from children's tds) for saving on the server
            var rowsIDs = [];
            changedRows.each( function() {
                rowsIDs.push( $(this).attr( 'id' ) );
            });
            var rowsDataArray = [];
            extractRowsData( changedRows, rowsDataArray );


          // AJAX
            saving.processesCounter++;

            $.ajax( {
                url: saving.url,
                type: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify( rowsDataArray ),

                success:   function() {
                        //alert("Строки обновлены в БД на сервере успешно");
                        var modifiedRow = null;
                        for ( var i=0, len = rowsIDs.length || 0; i<len; i++ ) {
                            modifiedRow = $( '#' + rowsIDs[ i ] );
                            if ( modifiedRow.attr( saving.rowIsChangedAttr ) === 'on-saving' ) {
                                modifiedRow.attr( saving.rowIsChangedAttr, 'mmm' );
                                modifiedRow.removeAttr( saving.rowIsChangedAttr );
                            }
                        }
                },
                error:   function() {
                        //alert("Обновить строки в БД на сервере не удалось, операция будет повторена позже");
                        var unmodifiedRow = null;
                        for ( var i=0, len = rowsIDs.length || 0; i<len; i++ ) {
                            unmodifiedRow = $( '#' + rowsIDs[ i ] );
                            if ( unmodifiedRow.attr( saving.rowIsChangedAttr ) === 'on-saving' ) {
                                unmodifiedRow.attr( saving.rowIsChangedAttr, 'true' );
                            }
                        }

                        saving.enqueue();
                }
            })
            .always( function() {
                saving.processesCounter--;
                hideLoading();
            });

            rowsDataArray = [];   // To unbind this array and local rowData's
        }



        hideLoading();

        function hideLoading() {
            if ( saving.processesCounter === 0 )
                $( saving.image ).hide( 1500 );
        }
    }


// ===========================================================
//     If the user is about to quit the page with unsaved data
// ===========================================================
    $( window ).on('beforeunload', function() {
        if ( saving.timer )
            return 'Данные, которые были изменены и/или добавлены, пока не сохранены. Нужно подождать 5 сек. \nХотите продолжить?';
    });

});
