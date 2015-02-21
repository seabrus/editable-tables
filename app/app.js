var app = angular.module('ediTables73', []);

app.controller('TableController', [ 'DataService', function( DataService ) {
	var self = this;

	self.rows = DataService.get();

	self.sortBy = '';
	self.rowsOnPage = 5;
	self.pageNumber = 1;
    self.maxPage = '10';

	self.calcMaxPage = function() {
		self.maxPage = '' + Math.ceil( self.rows.length / self.rowsOnPage );
	}
	self.calcMaxPage();

	self.paginate = function( row, index ) {
		return  index > ( (self.pageNumber-1) * self.rowsOnPage - 1 );
	}

	self.checkKey = function( event, isReadonly ) {
		if ( isReadonly && event.which === 13 )   return false;
		if ( isReadonly )   return true;
		if ( event.which === 13 || event.which === 27 )   return true;

		return false;
	}


//===============================================
//     Add / Delete rows
//===============================================
	var newRowIDBase = 1424390400000;   // Date.UTC(2015,1,20);

	self.addRow = function( rowID ) {
		for ( var i=0, len=self.rows.length; i<len; i++ ) {
			if ( rowID === self.rows[ i ].id ) break;
		}
		if ( i < len ) {
			var buf = { id : "", tdArray: [ {id:"id", text:"0"}, {id:"name", text:"company"}, {id:"regeon", text:"region"},{id:"start_date", text:"01-01-2015"}, {id:"responsible", text:"name"}, {id:"status", text:"new"} ] };
			
			var uniqueID = (new Date()).getTime() - newRowIDBase;
			buf.id = 'new-row-' + uniqueID;

			self.rows.splice( i+1, 0, buf );
		}
	}

	self.deleteRow = function( rowID ) {
		for ( var i=0, len=self.rows.length; i<len; i++ )
			if ( rowID === self.rows[ i ].id ) break;

		if ( i < len )
			self.rows.splice( i, 1 );
	}


}]);


app.factory('DataService', [ function() {

	var rows = [
		{ id : "RID002p", tdArray: [ {id:"id", text:"01"}, {id:"name", text:"Cosmos"}, {id:"regeon", text:"Canada"},{id:"start_date", text:"20-11-2015"}, {id:"responsible", text:"Camel H."}, {id:"status", text:"moved"} ] },

		{ id : "RID001p", tdArray: [ {id:"id", text:"02"}, {id:"name", text:"Caravan"}, {id:"regeon", text:"Barbados"},{id:"start_date", text:"01-12-2015"}, {id:"responsible", text:"Dodo H."}, {id:"status", text:"accepted"} ] },

		{ id : "RID003p", tdArray: [ {id:"id", text:"03"}, {id:"name", text:"Aqua"}, {id:"regeon", text:"BFG"},{id:"start_date", text:"11-03-2015"}, {id:"responsible", text:"Smith T."}, {id:"status", text:"deleted"} ] },

		{ id : "RID004p", tdArray: [ {id:"id", text:"04"}, {id:"name", text:"Cosmos"}, {id:"regeon", text:"Canada"},{id:"start_date", text:"20-11-2015"}, {id:"responsible", text:"Camel H."}, {id:"status", text:"moved"} ] },

		{ id : "RID005p", tdArray: [ {id:"id", text:"05"}, {id:"name", text:"Caravan"}, {id:"regeon", text:"Barbados"},{id:"start_date", text:"01-12-2015"}, {id:"responsible", text:"Dodo H."}, {id:"status", text:"accepted"} ] },

		{ id : "RID006p", tdArray: [ {id:"id", text:"06"}, {id:"name", text:"Aqua"}, {id:"regeon", text:"BFG"},{id:"start_date", text:"11-03-2015"}, {id:"responsible", text:"Smith T."}, {id:"status", text:"deleted"} ] },

		{ id : "RID007p", tdArray: [ {id:"id", text:"07"}, {id:"name", text:"Cosmos"}, {id:"regeon", text:"Canada"},{id:"start_date", text:"20-11-2015"}, {id:"responsible", text:"Camel H."}, {id:"status", text:"moved"} ] },

		{ id : "RID008p", tdArray: [ {id:"id", text:"08"}, {id:"name", text:"Caravan"}, {id:"regeon", text:"Barbados"},{id:"start_date", text:"01-12-2015"}, {id:"responsible", text:"Dodo H."}, {id:"status", text:"accepted"} ] },

		{ id : "RID009p", tdArray: [ {id:"id", text:"09"}, {id:"name", text:"Aqua"}, {id:"regeon", text:"BFG"},{id:"start_date", text:"11-03-2015"}, {id:"responsible", text:"Smith T."}, {id:"status", text:"deleted"} ] },

		{ id : "RID010p", tdArray: [ {id:"id", text:"10"}, {id:"name", text:"Cosmos"}, {id:"regeon", text:"Canada"},{id:"start_date", text:"20-11-2015"}, {id:"responsible", text:"Camel H."}, {id:"status", text:"moved"} ] },

		{ id : "RID011p", tdArray: [ {id:"id", text:"11"}, {id:"name", text:"Caravan"}, {id:"regeon", text:"Barbados"},{id:"start_date", text:"01-12-2015"}, {id:"responsible", text:"Dodo H."}, {id:"status", text:"accepted"} ] },

		{ id : "RID012p", tdArray: [ {id:"id", text:"12"}, {id:"name", text:"Aqua"}, {id:"regeon", text:"BFG"},{id:"start_date", text:"11-03-2015"}, {id:"responsible", text:"Smith T."}, {id:"status", text:"deleted"} ] },

		{ id : "RID013p", tdArray: [ {id:"id", text:"13"}, {id:"name", text:"Cosmos"}, {id:"regeon", text:"Canada"},{id:"start_date", text:"20-11-2015"}, {id:"responsible", text:"Camel H."}, {id:"status", text:"moved"} ] },

		{ id : "RID014p", tdArray: [ {id:"id", text:"14"}, {id:"name", text:"Caravan"}, {id:"regeon", text:"Barbados"},{id:"start_date", text:"01-12-2015"}, {id:"responsible", text:"Dodo H."}, {id:"status", text:"accepted"} ] },

		{ id : "RID015p", tdArray: [ {id:"id", text:"15"}, {id:"name", text:"Aqua"}, {id:"regeon", text:"BFG"},{id:"start_date", text:"11-03-2015"}, {id:"responsible", text:"Smith T."}, {id:"status", text:"deleted"} ] },

		{ id : "RID016p", tdArray: [ {id:"id", text:"16"}, {id:"name", text:"Cosmos"}, {id:"regeon", text:"Canada"},{id:"start_date", text:"20-11-2015"}, {id:"responsible", text:"Camel H."}, {id:"status", text:"moved"} ] },

		{ id : "RID017p", tdArray: [ {id:"id", text:"17"}, {id:"name", text:"Caravan"}, {id:"regeon", text:"Barbados"},{id:"start_date", text:"01-12-2015"}, {id:"responsible", text:"Dodo H."}, {id:"status", text:"accepted"} ] },

		{ id : "RID018p", tdArray: [ {id:"id", text:"18"}, {id:"name", text:"Aqua"}, {id:"regeon", text:"BFG"},{id:"start_date", text:"11-03-2015"}, {id:"responsible", text:"Smith T."}, {id:"status", text:"deleted"} ] },

		{ id : "RID019p", tdArray: [ {id:"id", text:"19"}, {id:"name", text:"Cosmos"}, {id:"regeon", text:"Canada"},{id:"start_date", text:"20-11-2015"}, {id:"responsible", text:"Camel H."}, {id:"status", text:"moved"} ] },

		{ id : "RID020p", tdArray: [ {id:"id", text:"20"}, {id:"name", text:"Caravan"}, {id:"regeon", text:"Barbados"},{id:"start_date", text:"01-12-2015"}, {id:"responsible", text:"Dodo H."}, {id:"status", text:"accepted"} ] },

		{ id : "RID021p", tdArray: [ {id:"id", text:"21"}, {id:"name", text:"Aqua"}, {id:"regeon", text:"BFG"},{id:"start_date", text:"11-03-2015"}, {id:"responsible", text:"Smith T."}, {id:"status", text:"deleted"} ] },

		{ id : "RID022p", tdArray: [ {id:"id", text:"22"}, {id:"name", text:"Cosmos"}, {id:"regeon", text:"Canada"},{id:"start_date", text:"20-11-2015"}, {id:"responsible", text:"Camel H."}, {id:"status", text:"moved"} ] },

		{ id : "RID023p", tdArray: [ {id:"id", text:"23"}, {id:"name", text:"Caravan"}, {id:"regeon", text:"Barbados"},{id:"start_date", text:"01-12-2015"}, {id:"responsible", text:"Dodo H."}, {id:"status", text:"accepted"} ] },

		{ id : "RID024p", tdArray: [ {id:"id", text:"24"}, {id:"name", text:"Aqua"}, {id:"regeon", text:"BFG"},{id:"start_date", text:"11-03-2015"}, {id:"responsible", text:"Smith T."}, {id:"status", text:"deleted"} ] },

		{ id : "RID025p", tdArray: [ {id:"id", text:"25"}, {id:"name", text:"BLOB"}, {id:"regeon", text:"Cuba"},{id:"start_date", text:"01-12-2015"}, {id:"responsible", text:"Dodo H."}, {id:"status", text:"accepted"} ] },

		{ id : "RID026p", tdArray: [ {id:"id", text:"26"}, {id:"name", text:"Bonk"}, {id:"regeon", text:"Koko"},{id:"start_date", text:"11-03-2015"}, {id:"responsible", text:"Smith T."}, {id:"status", text:"deleted"} ] },

		{ id : "RID027p", tdArray: [ {id:"id", text:"27"}, {id:"name", text:"Galaxy"}, {id:"regeon", text:"Ozzy"},{id:"start_date", text:"20-11-2015"}, {id:"responsible", text:"Camel H."}, {id:"status", text:"moved"} ] },

		{ id : "RID028p", tdArray: [ {id:"id", text:"28"}, {id:"name", text:"Fine food"}, {id:"regeon", text:"China"},{id:"start_date", text:"01-12-2015"}, {id:"responsible", text:"Dodo H."}, {id:"status", text:"accepted"} ] },

		{ id : "RID029p", tdArray: [ {id:"id", text:"29"}, {id:"name", text:"Mira"}, {id:"regeon", text:"Klass"},{id:"start_date", text:"11-03-2015"}, {id:"responsible", text:"Smith T."}, {id:"status", text:"deleted"} ] },
	];

	return   { get: function() { return rows; } }

}]);



