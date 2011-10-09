/*
   JPath 1.0.5 - json equivalent to xpath
   Copyright (C) 2009-2011  Bryan English <bryan at bluelinecity dot com>

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.

   Usage:      
      var jpath = new JPath( myjsonobj );

      var somevalue = jpath.$('book/title').json;  //results in title
         //or
      var somevalue = jpath.query('book/title');   //results in title

   Supported XPath-like Syntax:
      /tagname
      //tagname
      tagname
      * wildcard
      [] predicates
      operators ( >=, ==, <= )
      array selection
      .. 	         
      *
      and, or
      nodename[0]
      nodename[last()]
      nodename[position()]
      nodename[last()-1]
      nodename[somenode > 3]/node
      nodename[count() > 3]/node

   Tested With:
      Firefox 2-3, IE 6-7
   
   Update Log:
      1.0.1 - Bugfix for zero-based element selection
      1.0.2 - Bugfix for IE not handling eval() and returning a function
      1.0.3 - Bugfix added support for underscore and dash in query() function
                  Bugfix improper use of Array.concat which was flattening arrays
                  Added support for single equal sign in query() function
                  Added support for count() xpath function
                  Added support for and, or boolean expression in predicate blocks
                  Added support for global selector $$ and //
                  Added support for wildcard (*) selector support 
	  1.0.4 - Changed to MIT license
	  1.0.5 - Bugfix for greedy regexp
*/

function JPath( json, parent )
{ 
    this.json = json; 
    this._parent = parent; 
}

JPath.prototype = {

   /*
      Property: json
      Copy of current json segment to operate on
   */
   json: null,
   
   /*
      Property: parent
      Parent json object, null if root.
   */
   parent: null,

   /*
      Method: $
      Performs a find query on the current jpath object.

      Parameters:
        str - mixed, find query to perform. Can consist of a nodename or nodename path or function object or integer.

      Return:
        jpath - Returns the resulting jpath object after performing find query.

   */
   '$': function ( str )
   {
      var result = null;
      var working = this;
      
      if ( this.json && str !== null )
      {
         switch ( typeof(str) )
         {
            case 'function':
               result = this.f(str).json;
            break;

            case 'number':
               result = this.json[str] || null;
            break;

            case 'string':
               var names = str.split('/');     

               //foreach slash delimited node name//
               for ( var i=0; i<names.length ; i++ )
               {
                  var name = new RegExp('^' + names[i].replace(/\*/g,'.*') + '$');                  
                  var isArray = (working.json instanceof Array);
                  var a = new Array();
                  
                  //foreach working node property//
                  for ( var p in working.json )
                  {
                     if ( typeof( working.json[p] ) != 'function' )
                     {
                        if ( isArray && (arguments.callee.caller != this.$$) )
                        {
                           a = a.concat( this.findAllByRegExp( name, working.json[p] ) );
                        }
                        else if ( name.test(p) )
                        {                        
                           a.push( working.json[p] );
                        }
                     }                  
                  }

                  working = new JPath( ( a.length==0 ? null : ( ( a.length == 1) ? a[0] : a ) ), working );
               }

               return working;
            break;
         }   
      }
      
      return new JPath( result, this );
   },

   /*
      Method: $$
      Performs a global, recursive find query on the current jpath object.

      Parameters:
        str - mixed, find query to perform. Can consist of a nodename or nodename path or function object or integer.

      Return:
        jpath - Returns the resulting jpath object after performing find query.

   */   
   '$$': function( str )
   {   
      var r = this.$(str,true).json;
      var arr = new Array();
      
      if ( r instanceof Array ) 
         arr = arr.concat(r); 
      else if ( r !== null )
         arr.push(r);
         
      for ( var p in this.json )
      {
         if ( typeof( this.json[p] ) == 'object' )
         {
            arr = arr.concat( new JPath( this.json[p], this ).$$(str).json );
         }
      }
      
      return new JPath( arr, this );
   },
   
   /*
      Method: findAllByRegExp
      Looks through a list of an object properties using a regular expression

      Parameters:
         re - regular expression, to use to search with
         obj - object, the object to search through

      Returns:
         array - resulting properties
   */
   findAllByRegExp: function( re, obj )
   {
      var a = new Array();
   
      for ( var p in obj )
      {
         if ( obj instanceof Array )
         {
            a = a.concat( this.findAllByRegExp( re, obj[p] ) );
         }
         else if ( typeof( obj[p] ) != 'function' && re.test(p) )
         {
            a.push( obj[p] );
         }
      }

      return a;
   },

   /*
      Method: query (beta)
      Performs a find query on the current jpath object using a single string similar to xpath. This method
      is currently expirimental.

      Parameters:
        str - string, full xpath-like query to perform on the current object.

      Return:
        mixed - Returns the resulting json value after performing find query.

   */
   query: function( str )
   {
      var re = {
         " and ":" && ",
         " or ":" || ",
         "([\\#\\*\\@a-z\\_][\\*a-z0-9_\\-]*)(?=(?:\\s|$|\\[|\\]|\\/))" : "\$('$1').",
         "\\[([0-9])+\\]" : "\$($1).",
         "\\.\\." : "parent().",
         "\/\/" : "$",
         "(^|\\[|\\s)\\/" : "$1root().",
         "\\/" : '',
         "([^\\=\\>\\<\\!])\\=([^\\=])" : '$1==$2',
         "\\[" : "$(function(j){ with(j){return(",
         "\\]" : ");}}).",
         "\\(\\.":'(',
         "(\\.|\\])(?!\\$|\\p)":"$1json",
         "count\\(([^\\)]+)\\)":"count('$1')"
      };

      //save quoted strings//
      var quotes = /(\'|\")([^\1]*?)\1/;
      var saves = new Array();
      while ( quotes.test(str) )
      {
         saves.push( str.match(quotes)[2] ); 
         str = str.replace(quotes,'%'+ (saves.length-1) +'%');
      }

      for ( var e in re )
      {
         str = str.replace( new RegExp(e,'ig'), re[e] );
      }
      //alert('this.' + str.replace(/\%(\d+)\%/g,'saves[$1]') + ";");
      return eval('this.' + str.replace(/\%(\d+)\%/g,'saves[$1]') + ";");
   },

   /*
      Method: f
      Performs the equivilant to an xpath predicate eval on the current nodeset.

      Parameters:
        f - function, an iterator function that is executed for every json node and is expected to return a boolean
        value which determines if that particular node is selected. Alternativly you can submit a string which will be
        inserted into a prepared function.

      Return:
        jpath - Returns the resulting jpath object after performing find query.

   */
   f: function ( iterator )
   {
      var a = new Array();

      if ( typeof(iterator) == 'string' )
      {
         eval('iterator = function(j){with(j){return('+ iterator +');}}');
      }

      for ( var p in this.json )
      {
         var j = new JPath(this.json[p], this);
         j.index = p;
         if ( iterator( j ) )
         {
            a.push( this.json[p] );
         }
      }

      return new JPath( a, this );
   },

   /*
      Method: parent
      Returns the parent jpath object or itself if its the root node

      Return:
        jpath - Returns the parent jpath object or itself if its the root node

   */
   parent: function()
   {
      return ( (this._parent) ? this._parent : this );
   },

   /*
      Method: position
      Returns the index position of the current node. Only valid within a function or predicate

      Return:
        int - array index position of this json object.
   */
   position: function()
   {
      return this.index;
   },

   /*
      Method: last
      Returns true if this is the last node in the nodeset. Only valid within a function or predicate

      Return:
        booean - Returns true if this is the last node in the nodeset
   */
   last: function()
   {
      return (this.index == (this._parent.json.length-1));
   },

   /*
      Method: count
      Returns the count of child nodes in the current node

      Parameters:
         string - optional node name to count, defaults to all
      
      Return:
        booean - Returns number of child nodes found
   */
   count: function(n)
   {
      var found = this.$( n || '*').json;         
      return ( found ? ( found instanceof Array ? found.length : 1 ) : 0 );
   },

   /*
      Method: root
      Returns the root jpath object.

      Return:
        jpath - The top level, root jpath object.
   */
   root: function ()
   {
      return ( this._parent ? this._parent.root() : this );
   }

};
