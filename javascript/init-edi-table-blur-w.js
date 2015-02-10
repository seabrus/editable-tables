/*
 * Edi-Table
 * Excel-like UI for table-based web documents 
 * 
 * Widget - BLUR - Saving 
 * v. 0.1.0
 */


$( document ).ready( function() {

// =====================
//   The edi-Table settings
// =====================
    var ediTableSettings = {
        beforeMakeEditable : fnBeforeMakeEditable,
        afterCancelEditable :  fnAfterCancelEditable
    }
// ========================================
//   Instantiation of the edi-Table package
// ========================================
    $('tbody').ediTable( ediTableSettings );


    
// =====================
//   Saving options
// =====================
    var savingOpts = {
        changedRowDataAttr : 'is-changed',       // this data- attribute for a changed row is equal to 'true'

        newRowIdPrefix : 'new-row-',       // The prefix of a new row ID string
        maxIdOfNewRow : 0,                   // To build unique IDs for new rows we add unique numbers at the end of IDs
        
        deletedRows : [],
        
        enqueueSaving : fnEnqueueSaving,

        timer : null,
        saveData :  fnSaveData,
        interval : 1000,
        
        url : '/',
        
        processCounter : 0,
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
            parentTR.data( savingOpts.changedRowDataAttr, 'true' );
            savingOpts.enqueueSaving();
            
            $td.text( 'changed' );
        }
        $td.removeData('before'); 
    
    }


// =================
//   Add a new row
// =================
    $('tbody').on('click', '.add-new-row', function() {
        var parentTR = $(this).parent('tr');
        var newRow = parentTR.clone();
        newRow.attr('id', '' + savingOpts.newRowIdPrefix + (savingOpts.maxIdOfNewRow++) );
        newRow.insertAfter( parentTR );
        
        savingOpts.enqueueSaving();
    });

// =================
//   Delete a row
// =================
    $('tbody').on('click', '.delete-row', function() {
        var parentTR = $(this).parent('tr');
        var yes = confirm("Строка будет безвозвратно удалена.\nПродолжить?");
        if ( yes ) {
            if ( parentTR.attr('id').indexOf( savingOpts.newRowIdPrefix ) === -1 ) {       // New rows are absent in the DB - no need to delete
                savingOpts.deletedRows.push( parentTR.attr('id') );
                savingOpts.enqueueSaving();
            }
            parentTR.remove();
        }
    });

// =================
//   Initiate saving
// =================
    function fnEnqueueSaving() {
        if ( !savingOpts.timer ) {
            //savingOpts.timer = setTimeout( savingOpts.saveData, savingOpts.interval );
        }
    }

// =======================
//   Save new / updated data
// =======================
    function fnSaveData() {
        savingOpts.timer = null;
        $('img.loading').show( 1000 );
        
        // Delete the deleted rows from the DB
        if ( savingOpts.deletedRows.length > 0 ) {
            savingOpts.processCounter++;
            
            $.ajax( {
                url: savingOpts.url,
                type: 'DELETE',
                contentType: 'application/json',
                data: JSON.stringify( savingOpts.deletedRows ), 
                success:   function( data ) {
                        //alert("Удаленные строки удалены из БД на сервере успешно");
                        var confirmedRows = JSON.parse( data );
                        for ( var i=0, len = confirmedRows.length; i < len; i++ ) {
                            savingOpts.deletedRows = $.grep( savingOpts.deletedRows, function( str ) {     // http://api.jquery.com/jquery.grep/
                                return ( str !== confirmedRows[ i ] );
                            });
                        }
                },
                error:   function() {
                        //alert("Удалить строки из БД на сервере не удалось, повторите операцию позже");
                }
            })
            .always( function() {
                savingOpts.processCounter--;
                hideLoading();
            });
        }
        
        
        
        
        // New rows
        
        
        // Changed rows


        hideLoading();
        
        function hideLoading() {
            if ( savingOpts.processCounter === 0 )
                $('img.loading').hide();            
        }   
    }





/*
var COL_ID = 'col_id_';
var trData = { 
    id: '',
    tdArray: []
};
var tdData = { id: '', text: '' };

var parentTR = this.parent('tr');
trData.id = parentTR.attr('id'); 

var trCells = parentTR.children('td');
for (var i=0, len=trCells.length; i < len; i++) {
    tdClass = trCells.eq(i).attr('class');
    tdData.id = getTdId( tdClass );
    tdData.text = trCells.eq(i).text();
    trData.tdArray[i] = { id: tdData.id, text: tdData.text };
}

function getTdId( tdClass ) {        // tdClass  -- it's a string
    var buf = tdClass.split(' ') || [];
    for (var i=0, len=buf.length; i<len; i++) {
        if( buf[i].indexOf(COL_ID) !== -1) break;
    }

    return buf[i].slice(COL_ID.length -1);
}
*/







});


/*
О сохранении данных.

 При изменении 
    -- данных в ячейке;
    -- добавлении новой строки;
    -- удалении строки,
- запускается функция setTimeout() с временем, заданным в общих настройках ( settings ):
 
    var isChangedData = null;
    ...
    isChangedData = setTimeout( fnSaveChangedData, settings.intervalToSaveData );
 
 - т.е. если isChangedData != null , то появились данные для запоминания и запущен таймер (соответственно, второй таймер запускать пока не надо, если появляются еще измененные данные).
 
 Соответственно, по прошествии времени   settings.intervalToSaveData   запускается функция fnSaveChangedData().
 
 Предлагаю сохранять данные согласно RESTful архитектуре:
 http://en.wikipedia.org/wiki/Representational_state_transfer#Example
 
 Если используем RESTful, то
 
 0). isChangedData = null;
 
 1). Первой на сервер отправляются новые строки. 
 Согласно RESTful API такая строка отправляется на сервер по методу POST - новые данные.
 Она выбирается по селектору '[id^="new-row-"]'  - т.е. те строки, у которых id начинается с "new-row-" .
 На сервер отправляются текущий id этой строки и данные всех <td> данной строки.
 После этого для всех ее дочерних <td> удаляется аттрибут 'data-is-changed' ( removeData( 'is-changed') ), благодаря чему они переводятся в состав тех, которые не нужно обновлять на шаге 3 (см. ниже).
 Если все прошло хорошо, то сервер в ответ присылает ID, присвоенный в БД на сервере.
 Мы меняем id="new-row-11" на ID из БД, после чего строка не считается больше новой в дальнейших операциях обрабатывается, как все обычные строки. 
 Если за время отправки данных в новой строке появятся измененные данные, то они будут обработаны на след. запуске fnSaveChangedData() согласно шагу 3 (см. ниже).
 Если операция fail, то строка сохраняет свой статус и будет снова сохраняться как новая на следующем запуске fnSaveChangedData().
 * 
 
 2). Второй отправляется на сервер инфа по удаленным строкам - если ( deletedRows.length != 0 ) .
 Согласно RESTful API это отправляется на сервер по методу DELETE. 
 
 Сейчас обработчик удаления строки   .on('click', '.delete-row')   просто удаляет ее, но для связи с сервером стоит создать массив id удаленных строк, напр.:
 
    var deletedRows = [];
       и
    deletedRows.push( ' id удаленной строки ' );   -  при каждом удалении
 
 Если удаленная строка новая ( "new-row-..." ), то ее в массив добавлять не нужно. Т.е. добавляем только те, которые реально есть в БД на сервере. 
 
 Соответственно, на сервер уходит этот массив в любой удобной форме (JSON или как удобнее).
 Если операция прошла успешно, сервер возвращает полученный массив обратно, и он вычитается из текущего deletedRows на стороне клиента. Это позволяет не потерять данные о новых удаленных строках, пока проходила отправка данных.
 Если произошел сбой, то удаленные строки останутся в массиве deletedRows до след. запуска fnSaveChangedData().
 *
 
 3). Третьей на сервер уходит инфа по отдельным измененным ячейкам, строки которых уже есть на сервере. 
  Согласно RESTful API это отправляется на сервер по методу PUT. 
  Отбираем их по аттрибуту 'data-is-changed' === 'true'
 Тут видимо надо отправлять id строки и маркер столбца для каждой ячейки.
 Если все хорошо, сервер возвращает полученные данные назад, и для этих ячеек аттрибут 'data-is-changed' удаляется -- но только если он не стал опять 'data-is-changed' === 'true' (что означает, что пока мы сохраняли данные, юзер снова в них что-то поменял).
 Если операция сорвалась, то ничего не делаем, оставляя данные в состоянии 'data-is-changed' === 'true' до след. отправки данных на сервер.
 
 4). Если при отправке произошел сбой, то все три вида измененных данных сохранят свой статус измененных, и нам остается перезапустить 
      isChangedData = setTimeout( fnSaveChangedData, intervalToSaveData );
если он еще не был перезапущен новой порцией изменений.


>>> Что не учитывает данный алгоритм 

1). Полное прерывание связи или выключение компа. Для таких случаев можно использовать локальное запоминание изменений ( localStorage ), но для начала считал бы такой случай исключительным и пока не замарачивался или сделать потом.

2). Есть еще вопрос согласования порядка выполнения операций
А). Если юзер выходит из страницы (закрывает ее), а есть еще не сохраненные данные.
Это может быть решено выводом сообщения на onunload, что есть несохраненные данные. За время принятия решения вопрос вполне может уже и решится сам (данные сохраняться по таймеру) или запустить сохранение специально.

Б). Более сложный момент - есть несохраненные данные, а юзер меняет пагинацию в DTable или запускает сортировку. В этом случае первым должен быть выполнен процесс сохранения, что при асихронности обоих процессов означает, что эти процессы (сохранение и пагинация, сохранение и сортировка) должны быть поставлены в очередь и выполняться последовательно, а не параллельно.
Ну или как-то еще должен учитываться этот момент - иначе изменения будут потеряны, т.к. DTable перезагрузит с сервера устаревшую версию данных.

*/




