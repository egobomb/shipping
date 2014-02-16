//main control interface
var SW = (function(){

	
	var lastID = 0, 
		productAttrs = ['productName', 'productDesc', 'productWidth', 'productLength', 'productHeight', 'productWeight', 'productValue'];
	
	//Basic Product Model
	var productModel = Backbone.Model.extend({
		
		initialize : function(){

			if (this.get('productID')){ //if productID already exists, make id = productID
				this.set('id', this.get('productID'));
											
				if (this.get('productID') > lastID){ //make sure lastID is set to the highest value
					lastID = this.get('productID');
				}	
			}
			else{
				this.set('id', ++lastID); //set id and increment counter
			}
		}
	});
	
	//Basic collection of products
	var productCatalog = Backbone.Collection.extend({
		model: productModel,
		
		destroy: function(id){
			this.remove(id);
		}
	});
	
	//view for single product in inventory
	var productView = Backbone.View.extend({

		//render product from template
		render: function(product){
					
			var template = $("#template-inventory").html(), //grab template
			output = Mustache.render(template, product.toJSON()); //render html for new product

			//update html if it exists, otherwise append to inventory
			if ($("#inv-"+product.get('id')).length > 0){
				$("#inv-"+product.get('id')).html(output);
			}
			else{	
				$("#inventory").append(output);
			}
		}
		
	});
	
	
	//!PUBLIC INTERFACE
	return {
		catalog: new productCatalog(),
		view: new productView(),
		
		//add a new product or edit it if it exists already
		addProduct: function(product){
			
			//edit an existing product
			if (product.productID){
			
				productInCat = this.catalog.get(product.productID);
				
				//update product in our collection
				if (productInCat){
					_.each(productAttrs, function(key){
						productInCat.set(key, product[key]);
					});
					
					this.view.render(this.catalog.get(product.productID));
					var productExists = true;
				}
			}
			
			//create a new product
			if (!productExists){
						
				this.catalog.add(product);
				this.view.render(this.catalog.get(lastID));
				this.catalog.get(lastID).set('initialized', true);
				
				if (!product.productID){
					product.productID = lastID;
				}
			}	
			
			//save to local storage				
			localStorage.setItem(product.productID, JSON.stringify(product));
			
			//clear the form for new input
			this.clearForm();
			$("#editing").html('New Product');

		},
		
		//load products from local storage
		loadFromStorage: function(){
		
			for(var i in window.localStorage){
			   var product = localStorage.getItem(i); 
			   product = JSON.parse(product);
			   if (product.productName){
				   this.addProduct(product);
			   }
			}
		},
		
		//empty local storage
		clearLocalStorage: function(){
			localStorage.clear();
		},

		
		//add product info to form fields for editing
		edit: function(id){
			product = this.catalog.get(id);
			
			if (product){
				_.each(product.attributes, function(val, key){
					$("#productInputs #"+key).val(val);
					product.set(key, val);
				});
				
				$("#productInputs #productID").val(product.get('id'));
				$("#editing").html('Editing Product #'+id);
			}
		}, 
		
		//delete a product
		del: function(id){
			this.catalog.remove(id);
			$("#inv-"+id).remove();	
			localStorage.removeItem(id);
		}, 
		
		//clear the input form
		clearForm: function(){
			$(".newProduct input").val("");
			$("#productInputs textarea").val("");
		}
	};
	

})();



//prevent normal behavior for the input form
$("#editForm").submit(function(event) {
	event.preventDefault();
});

//once page is ready...
$(document).ready(function(){

	//form validator settings
	$.validator.addMethod('number', function (value) { 
    	return Number(value) > 0;
    	},'Enter a positive number.'
    );
    
	$("#editForm").validate({
		submitHandler: function(){
			var formData = $('#editForm').serializeObject();
			SW.addProduct(formData);
		},
	    rules: {
         	name: {
            	required: true
            }
        },
        messages: {
        	name: "Required Field"
        }
        
     });
     
     //load any existing product info from storage
     SW.loadFromStorage();
});


