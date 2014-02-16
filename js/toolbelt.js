window.onload = function(){
	
	//By augmenting Function.prototype with a method method, we no longer have to type the name of the prototype property. That bit of ugliness can now be hidden.
	Function.prototype.method = function (name, func) {
		if (!this.prototype[name]) {
	    	this.prototype[name] = func;
	    	return this;
	    }
	};
	
	//This method is used to create a new object with its prototype set to an object passed in.
	if (typeof Object.beget !== 'function') {
		Object.beget = function(o) {
	    	var F = function() {};
	        F.prototype = o;
	        return new F();
	    };
	}
	
	//Extracts just the integer part of a number
	Number.method('int', function (  ) {
	    return Math[this < 0 ? 'ceiling' : 'floor'](this);
	});
	
	//JavaScript lacks a method that removes spaces from the ends of a string.
	String.method('trim', function (  ) {
	    return this.replace(/^\s+|\s+$/g, '');
	});
	
	//serialize form into json data
	$.fn.serializeObject = function()
	{
	    var o = {};
	    var a = this.serializeArray();
	    $.each(a, function() {
	        if (o[this.name] !== undefined) {
	            if (!o[this.name].push) {
	                o[this.name] = [o[this.name]];
	            }
	            o[this.name].push(this.value || '');
	        } else {
	            o[this.name] = this.value || '';
	        }
	    });
	    return o;
	};

};