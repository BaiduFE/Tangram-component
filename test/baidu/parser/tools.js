(function() {
	function mySetup() {
			te.arrayCompare = function(data, result){
				if(data.length != result.length)
					return false;
				for(var i = 0; i < data.length ; i++){
					if(data[i] != result[i])
						return false;
				}
				return true;
			};
			 te.isEmpty = function(obj)
			    {
			        for (var name in obj)
			        {
			            return false;
			        }
			        return true;
			    };
	}
	var s = QUnit.testStart;
	QUnit.testStart = function() {
		s.apply(this, arguments);;
		mySetup();
	}
})();