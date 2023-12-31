// NOTICE!! THIS IS REQUIRED TO MAKE YOUR Maropost Commerce Cloud SHOPPING CART WORK
// DO NOT REMOVE UNLESS YOU REALLY KNOW WHAT YOU ARE DOING

var nCustom = {
	vars : {
		focused : $('body'),
		lastFocused : $('body')
	},
	funcs : {
		initPageFuncs: function() {
			// Ajax Wish List
			$.addToWishList({
				'class': 'wishlist_toggle',
				'textclass': 'wishlist_text',
				'htmlon': '<i class="fas fa-star" aria-hidden="true"></i>',
				'htmloff': '<i class="far fa-star" aria-hidden="true"></i> Wishlist',
				'tooltip_css': 'whltooltips',
				'imageon': '',
				'imageoff': ''
			});
			// Ajax Add To Cart
			$.addToCartInit({
				'cart_id' :  'cartcontents',
				'target_id': 'cartcontentsheader',
				'image_rel': 'itmimg'
			});
			// Renders the instant search results - edit design of ajax results here
			$.initSearchField({
				'result_header'		: '<ul class="nav nav-list">',
				'result_body'		: '<li><a href="##url##" search-keyword="##keyword##"><img border="0" src="##thumb##" width="36" height="36"/><span class="title">##model##</span></a></li>',
				'result_footer'		: '</ul>',
				'category_header'	: '<ul class="nav nav-list">',
				'category_body'		: '<li><a href="##url##"><span class="thumb"><img border="0" src="##thumb##" width="36" height="36"/></span><span class="title">##fullname##</span> <span class="label label-default">##typename##</span></a></li>',
				'category_footer'	: '</ul>'
			});
		},
		// For child product multi-add to cart function
		checkValidQty: function() {
			var found = 0;
			$('#multiitemadd :input').each(function() {
				if ($(this).attr('id').match(/^qty/)) {
					if ($(this).val() > 0) {
						found = 1;
					}
				}
			});
			if (found == 0) {
				$.nPopupBox('Please specify a quantity before adding to cart');
				return false;
			}
			return true;
		},
		// Capture the last item focused
		updateFocused: function(){
			nCustom.vars.lastFocused = nCustom.vars.focused;
		},
		// Place focus on popup
		popupFocus: function(){
			var popUp = document.getElementById('npopupDesc');
			// Configures the observer
			var config = {childList: true};
			// Create an observer instance
			var popUpObserver = new MutationObserver(function(mutations) {
				mutations.forEach(function(mutation) {
					// Initial observer
					if(mutation.addedNodes["0"]){
						nCustom.funcs.updateFocused();
						// focus on the popup
						$(popUp).attr('tabindex', '-1').trigger('focus');
					}else{
						$(popUp).attr('tabindex', '').trigger('focus');
						// Observer closing popup
						$(nCustom.vars.lastFocused).trigger('focus');
					}
				});
			});
			// Pass in the target node, as well as the observer options
			if(popUp){ popUpObserver.observe(popUp, config);}
		},
		buttonLoading: function(){
			var loadingText = $(this).attr('data-loading-text');
			var originalText = $(this).html();
			$(this).html(loadingText).addClass('disabled').prop('disabled', true);
			var pendingButton = this;
			setTimeout(function(){
				$(pendingButton).html(originalText).removeClass('disabled').prop('disabled', false);
			}, 3000);
		},
		windowPopup: function(url, width, height) {
			// Calculate the position of the popup so it’s centered on the screen.
			var left = (screen.width / 2) - (width / 2),
				top = (screen.height / 2) - (height / 2);
			window.open(url,'','menubar=no,toolbar=no,resizable=yes,scrollbars=yes,width=' + width + ',height=' + height + ',top=' + top + ',left=' + left);
		},
		// Will remove/add class from element
		classToggle: function (element, css, type){
			if(type){
				type == 'add'
					? $(element).addClass(css)
					: $(element).removeClass(css)
			}
		}
	}
}

$(document).ready(function() {
	// Maropost Commerce Cloud functionalty
	nCustom.funcs.initPageFuncs();
	nCustom.funcs.popupFocus();
	// Jquery Ui Date Picker
	$('.datepicker').datepicker({ dateFormat: 'dd/mm/yy' });
	// Carousel
	$('.carousel').carousel();
	// Tooltip
	$('[data-toggle="tooltip"]').tooltip();
});
// Capture the current element the user focused in
$(document).on('focusin', function(){
	nCustom.vars.focused = document.activeElement;
});
// Btn loading state
$(document).on('click', '.btn-loads', nCustom.funcs.buttonLoading);
// Social media share
$('.js-social-share').on('click', function(e) {
	e.preventDefault();
	nCustom.funcs.windowPopup($(this).attr("href"), 500, 300);
});
// Mobile menu
$('.nToggleMenu').on('click', function(){
	var toggleTarget = $(this).attr('data-target')
	$(toggleTarget).slideToggle();
});
// Invoice page
$('#cart_items').on('click', '[data-body-add]', function(e){
	e.preventDefault();
	nCustom.funcs.classToggle('body', $(this).attr('data-body-add'), 'add');
});
$('#cart_items').on('click', '[data-body-remove]', function(e){
	e.preventDefault();
	nCustom.funcs.classToggle('body', $(this).attr('data-body-remove'), 'remove');
});
$('#_jstl__buying_options').on('click', '.js-notifymodal-in-stock', function(e){
	e.preventDefault();
	// Get values
	var sku = $(this).attr('data-sku');
	var $wrapper = $('#notifymodal .checkbox');
	var $terms = $('#notifymodal .terms_box');
	var $helpText = $('#notifymodal .checkbox .help-block');
	// Validate form
	if(!$.isChecked($terms)){
		$wrapper.addClass('has-error');
		$helpText.removeClass('hidden');
		return false;
	}else{
		$wrapper.removeClass('has-error');
		$helpText.addClass('hidden');
		// Dismiss modal
		$('#notifymodal').modal('hide');
		// Send information
		$.addNotifyBackInStock(sku, '');
		$terms.attr('checked', false);
		return true;
	}
});
// Multi add child products
$('.multi-add').on('click', function(){
    if (nCustom.funcs.checkValidQty()) { 
        $.addMultipleCartItems('multiitemadd'); 
        return false; 
    }
});

$(document).ready(function() {
	$(".meganav-block-toggle").on("dblclick", (function() {
		var link = $(this).attr('href');
		var url = window.location.origin + link;
		window.location.href = url;
	}));
	
	$(".meganav-block-toggle").click(function() {
        var desiredContent = $(this).nextUntil('meganav-block');
        //var content3 = $(this).children('div.meganav-block').find("a").attr("href");

        $(".meganav-block").each(function(index) {
			var content2 = $(this);

			if (!content2.is(desiredContent)) {
				//content2.slideUp();
				content2.removeClass('active-block');
			} 
			else {
				//window.open(content3, "_self");
				desiredContent.addClass('active-block');
			}
        });

		$('.megagrid', desiredContent).masonry('layout');

		// Make my mega nav height equal the meganav block content height 1629
		var meganavHeight = $('.megagrid', desiredContent).height();
		
		meganavHeight += 64;
		
		if(meganavHeight < 800)
		meganavHeight = 800;
	
		meganavHeight += 64;

		$('.meganav').height(meganavHeight)
    });


});

// Mega Nav Masonry Grid

$(document).ready(function() {
	$('.megagrid').masonry({
		// options
		itemSelector: '.meganav-level-2',
		columnWidth: '.meganav-level-2',
		percentPosition: true,
		gutter: 32,
		transitionDuration: 0

	});
});

// ProductListing Calculated Heights
function equalizeProductHeights() {
    var maxHeight = 0;
    $(".product-clamp-height").each(function() {
        if ($(this).height() > maxHeight) {
            maxHeight = $(this).height();
        }
    });

	$(".product-clamp-height").each(function() {
        $(this).height(maxHeight + "px") 
    });

}

//$(document).ready(equalizeProductHeights);
//$(window).resize(equalizeProductHeights);  // To handle window resizing
$(window).on( "load", equalizeProductHeights) // Proper time to call the function; Fixed Thumb height bug
// Custom Mini Cart

$(document).ready(function() {
    $("#cartcontentsheader").click(ToggleMinicart);
    $("#toggle-minicart").click(ToggleMinicart);
});

function ToggleMinicart() {
	const minicart = $(".award-minicart");
	const openClass = "minicart-open";

	if(minicart.hasClass(openClass)){
		minicart.removeClass(openClass);
		minicart.animate({
			right: -350,
		}, 100)
	} else{
		minicart.addClass(openClass);
		minicart.animate({
			right: 0,
		}, 100)
	}
};

// Filters Filter

$(document).ready(function() {
	//Remove Small Un-Useful Filters
	
	$('.filter').each((i,el) => {
		var badgeValue = parseInt($(el).find('.badge').text(), 10);

		if (badgeValue < 3) {
			$(el).remove();
		}
	})

	// Order Filter Containers
	$('.filter-container').each((i,el) => {

		  // Step 1: Collect the elements into an array
		  var filters = $(el).find('.filter').toArray();

		  //console.log(filters);
  
		  // Step 2: Sort the array based on the badge value
		  filters.sort(function(a, b) {
			var badgeValueA = parseInt($(a).find('.badge').text(), 10);
			var badgeValueB = parseInt($(b).find('.badge').text(), 10);
			return badgeValueB - badgeValueA; // For descending order, swap A and B for ascending
		  });
		
		  // Step 3: Remove the existing elements from the DOM
		  $(el).find('.filter').remove();
		  
		  // Step 4: Re-insert the sorted elements
		  $(filters).each(function(index, element) {
			// Append each element back to its parent container
			// (Assuming that the parent container has a class .list-group)
			// Add Limit to Amount of Filters to reduce clutter
			if(index < 25)
				$(el).append(element);
		  });
	});
});

$(document).ready(function() {
  $('#cat-collapse').on('show.bs.collapse', function () {
    $('.cat-chev').css('transform', 'rotate(90deg)'); // Example animation
  });

  $('#cat-collapse').on('hide.bs.collapse', function () {
    $('.cat-chev').css('transform', 'rotate(0)'); // Example animation
  });

  $('#brand-collapse').on('show.bs.collapse', function () {
    $('.brand-chev').css('transform', 'rotate(90deg)'); // Example animation
  });

  $('#brand-collapse').on('hide.bs.collapse', function () {
    $('.brand-chev').css('transform', 'rotate(0)'); // Example animation
  });

});

