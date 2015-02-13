var http = require('http');
var fs = require('fs');
var path = require('path');


var server = http.createServer( function (req, res) {

    var url = require('url').parse(req.url);

    // ********* GET requests *********
    if ( req.method === "GET" ) {

        var root = __dirname;
        var fileName = '';
        var conType = '';

        if ( req.url === '/' ) {
            fileName = 'edi-table-blur-w.html';
            conType = 'text/html';
        }
        else
            fileName = url.pathname;

        if ( !fileName ) {
            console.log("GET request: No file name was sent");
            res.writeHead(404);
            res.end('File not found');
            return;
        }

        if ( path.extname( fileName ) === '.css')   conType = 'text/css';
        if ( path.extname( fileName ) === '.js')        conType = 'text/javascript';
        if ( path.extname( fileName ) === '.json')  conType = 'application/json';
        if ( path.extname( fileName ) === '.png')   conType = 'image/png';
        if ( path.extname( fileName ) === '.gif')       conType = 'image/gif';
        if ( path.extname( fileName ) === '.ico')       conType = 'image/x-icon';

        fileName = path.join( root, fileName );

        fs.stat( fileName, function(err, stat) {
            if (err) {
                if ( err.code === 'ENOENT' ) {
                    res.statusCode = 404;
                    res.end('ENOENT - File Not Found');
                }
                else {
                    res.statusCode = 500;
                    res.end('Internal Server Error');
                }
                return;
            }

            fs.readFile( fileName, function (err, data) {
                if (err) {
                    console.log('File ' + fileName + ' is not found or cannot be read');
                    res.writeHead(404, 'Cannot read the file');
                    res.end('Ошибка при чтении файла на сервере: файл отсутствует или поврежден');
                    return;
                }

                res.writeHead( 200, { 'content-type': conType, 'content-length': stat.size} );
                res.write( data );
                res.end();
//console.log('Full fileName: ' + fileName);
//console.log('conType: ' + conType + '. Size: ' + stat.size);
            });

        });

    }

    // ********* DELETE requests *********
    if ( req.method === "DELETE" ) {

        if ( req.url !== '/db' )
            return;

        var conType = 'application/json';
        var deletedRows = '';
        req.setEncoding('utf8');

        req.on('data', function (chunk) {
            deletedRows += chunk;
        });

        req.on('error', function (err) {
            console.log('DELETE request: Error when transferring user data: ' + err.message);
            res.writeHead(404);
            res.end('DELETE request: Error when transferring user data: ' + err.message);
            return;
        });

        req.on('end', function () {
            if ( deletedRows ) {
                fs.writeFile( 'db/deleted.row', deletedRows, function (err) {
                    if (err) {
                        console.log('DELETE request: Error when writing data into the file: ' + err.message);
                        res.writeHead(404, 'Cannot write data into a file');
                        res.end('Cannot write data into a file');
                        return;
                    }

                    console.log('DELETE file was saved successfully');
                    res.writeHead( 200, { 'content-type': conType} );
                    res.end( deletedRows );
                });
            }
            else
                console.log('DELETE request: User data are empty, the data file was not rewritten');
        });
    }


    // ********* POST requests *********
    if ( req.method === 'POST' ) {

        if ( req.url !== '/db' )
            return;

        var newRows = '';
        req.setEncoding('utf8');

        req.on('data', function (chunk) {
            newRows += chunk;
        });

        req.on('error', function (err) {
            console.log('POST request: Error when transferring new rows: ' + err.message);
            res.writeHead(404);
            res.end();
            return;
        });

        req.on('end', function () {
            if ( newRows ) {
                fs.writeFile( 'db/new.row', newRows, function (err) {
                    if (err) {
                        console.log('POST request: Error when writing new rows into a file: ' + err.message);
                        res.writeHead(404, 'Cannot write new rows into a file');
                        res.end();
                        return;
                    }

                    var newRowsArray = JSON.parse( newRows );
                    var postRes = [];
                    var _tempID = '', _dbID = '';

                    for ( var i=0, len=newRowsArray.length; i<len; i++ ) {
                        _tempID = newRowsArray[i].id;
                        _dbID = 'RID0' + (i+15) + 'db';
                        postRes.push( { tempID: _tempID, dbID : _dbID } );
                    }

                    console.log('POST: New rows were saved successfully');

                    // setTimeout( function() {
                    res.writeHead( 200, { 'content-type': 'application/json'} );
                    res.end( JSON.stringify( postRes ) );
                    // }, 5000 );

                });
            }
            else
                console.log('POST request: New rows are empty, the data file was not rewritten');
        });

    }


    // ********* PUT requests *********
    if ( req.method === 'PUT' ) {

        if ( req.url !== '/db' )
            return;

        var updatedRows = '';
        req.setEncoding('utf8');

        req.on('data', function (chunk) {
            updatedRows += chunk;
        });

        req.on('error', function (err) {
            console.log('PUT request: Error when transferring rows: ' + err.message);
            res.writeHead(404);
            res.end();
            return;
        });

        req.on('end', function () {
            if ( updatedRows ) {
                fs.writeFile( 'db/updated.row', updatedRows, function (err) {
                    if (err) {
                        console.log('PUT request: Error when writing rows into a file: ' + err.message);
                        res.writeHead(404, 'Cannot write updated rows into a file');
                        res.end();
                        return;
                    }

                    var updatedRowsArray = JSON.parse( updatedRows );
                    var postRes = [];
                    var _ID = '';

                    for ( var i=0, len=updatedRowsArray.length; i<len; i++ ) {
                        _ID = updatedRowsArray[i].id;
                        postRes.push( _ID );
                    }

                    console.log('PUT: Rows were updated successfully');

                     setTimeout( function() {
                    res.writeHead( 200, { 'content-type': 'application/json'} );
                    res.end( JSON.stringify( postRes ) );
                     }, 5000 );

                });
            }
            else
                console.log('PUT request: Rows are empty, the data file was not rewritten');
        });
    }



});

server.listen(8000);



