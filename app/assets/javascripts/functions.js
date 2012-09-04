/**
*
* Global variable container
*
*/
var ac_web = {
    browser: {
        ie_6: typeof document.body.style.maxHeight === 'undefined',
        ie_7: typeof document.body.style.maxHeight !== 'undefined' && typeof document.querySelector === 'undefined',
        ie_8: typeof document.querySelector !== 'undefined' && typeof document.getElementsByClassName === 'undefined'
    },
	min_device_width: {
		tablet: 790,
		desktop: 990
	},
	z_index_counter: 1,
	browser_width: $('body').width()
}


ac_web.ToolTip = Backbone.Model.extend ({
	defaults: {
		title: 'this is a tool tip',
		containerHeight: 0,
		container: null
	}
});

window.onresize = function() {
	//Functions to take place on Window Resize

	//Stop transitions
    if($('.pagination').length) {
	    $('.pagination').removeClass('active');
    }
    BrowserResizeComplete(function() {	
		$('.slider').each(function() {
			//Reset all sliders
			ShowSliderBanner($(this).parent().parent('.slider_container'), 0);
		});
		$('.pagination').addClass('active');
		//Dropdown - remove current state in move from devie view to desktop view
		if ($('body').width() >= ac_web.min_device_width.desktop) {
			$('li', '.dropdown').removeClass('current');
		}
        // Cache the browser width
        ac_web.browser_width = $('body').width();
        
        //Drop down check dropdown not open in desktop view
        if($('.dropdown li.current').length) {
	        $('.dropdown li.current').removeClass('current');
        }
        
    }, 500, "some unique string");
}


var BrowserResizeComplete = (function() {
    var timers = {};
    return function(callback, ms, uniqueId) {
        if (!uniqueId) {
            uniqueId = "Don't call this twice without a uniqueId";
        }
        if (timers[uniqueId]) {
            clearTimeout(timers[uniqueId]);
        }
        timers[uniqueId] = setTimeout(callback, ms);
    };
})();

/**
*
* Inits the page
*
*/
function Init() {

	$(window).load(function() {

	    InitDOMChanges();
	
	    InitQuickLink();
	    
	    InitToolTip();
	
	    InitSlider();
	
	    InitAnchorScroll();
	
	    InitDatePicker();
	
	    InitTab();
	    
	    InitCaption();
	    
	    InitAccordion();
	    
	    InitDropdown();
	    
	    InitValidation();
    
    });

}

/**
*
*
* Any DOM manipulation to happen on page load happens here
*
*/

function InitDOMChanges() {

	// Karl Swedberg's js class technique
    var $body = $('body');
    $body.removeClass('no_js').addClass('js');
    
	// Add extra markup for booking steps
    var $steps_li = $('li', 'ol.steps');
    $steps_li.each(function() {
        $this = $(this);
        $this.prepend('<span /><em />');
    });

}

/**
*
* Sets up redirects for links within a SELECT
*
*/
function InitQuickLink() {
    var $quick_links = $('select.quick_links')
    ,   quick_link_url;

    if ($quick_links.length) {
        $quick_links.change(function() {
            quick_link_url = $(this).val();

            if (quick_link_url.length) {
                if (quick_link_url.substr(0, 1) === '/') {
                    quick_link_url = 'http://' + window.location.hostname + quick_link_url;
                }

                window.location = quick_link_url;
            }
        });
    }
}

/**
*
* Creates any sliders on the page
*
*/
function InitSlider() {

	// Cache the sliders
	var $sliders = $('ul.slider')
	,   $slider
	,	slider_html
	,   slider_array = []
	,	image_height = 0
	
	if ($sliders.length) {
	    $sliders.each(function(j) {
	        $slider = $(this);
	        slider_html = $slider.html();

	        slider_array.push($slider);

	        var $images = $('li', $slider)
	        , 	images_len = $images.length
	        , 	pagination_markup = ''
	        , 	$slider_container = null
	        
	        //Append containers
	        $slider.wrap('<div class="slider_container" />');
	        $slider_container = slider_array[j].parent('.slider_container');
	        $slider.wrap('<div class="slider_wrapper" />');

	        if ($images.length > 1) {

	            pagination_markup += '<ul class="pagination active">';

	            // Add the prev arrow
	            pagination_markup += '<li class="slider_prev"><a href="#" title="Previous Banner">Prev Banner</a></li>';

	            $images.each(function(i) {
	                if (i === 0) {
	                    if ($slider.hasClass('pagination_off')) {
	                        pagination_markup += '<li class="slider_nav_elem current" style="visibility:hidden;"><a rel="' + i + '" href="#" title="Go to banner ' + (i + 1) + '">Go to banner ' + (i + 1) + '</a></li>';
	                    } else {
	                        pagination_markup += '<li class="slider_nav_elem current"><a rel="' + i + '" href="#" title="Go to banner ' + (i + 1) + '">Go to banner ' + (i + 1) + '</a></li>';
	                    }
	                } else {
	                    if ($slider.hasClass('pagination_off')) {
	                        pagination_markup += '<li class="slider_nav_elem" style="visibility:hidden;"><a rel="' + i + '" href="#" title="Go to banner ' + (i + 1) + '">Go to banner ' + (i + 1) + '</a></li>';
	                    } else {
	                        pagination_markup += '<li class="slider_nav_elem"><a rel="' + i + '" href="#" title="Go to banner ' + (i + 1) + '">Go to banner ' + (i + 1) + '</a></li>';
	                    }
	                }
	            });

	            // Add the next arrow
	            pagination_markup += '<li class="slider_next"><a href="#" title="Next Banner">Next Banner</a></li>';

	            // Close the markup
	            pagination_markup += '</ul>';

	            $slider.attr('data-current', '0');

	            $slider.html(slider_html).closest('.slider_container').append(pagination_markup);
	            
	            //Dots
	            $('.pagination .slider_nav_elem a', $slider_container).on({
	                click: function() {
	                    if ($('.pagination', $slider_container).hasClass('active')) {
	                        var $anchor = $(this);

	                        // Show the selected banner
	                        ShowSliderBanner($slider_container, parseInt($anchor.attr('rel')));
	                    }

	                    return false;
	                }
	            });
	            
	            //Previous slide
	            $('.pagination .slider_prev a', $slider_container).on({
	                click: function() {
	                    if ($('.pagination', $slider_container).hasClass('active')) {
	                        var current_banner = parseInt(slider_array[j].attr('data-current'))
				        	, selected_banner = (current_banner - 1) < 0 ? (images_len - 1) : current_banner - 1;

	                        // Show the selected banner
	                        ShowSliderBanner($slider_container, selected_banner);
	                    }

	                    return false;
	                }
	            });
	            
	            //Next slide
	            $('.pagination .slider_next a', $slider_container).on({
	                click: function() {
	                    if ($('.pagination', $slider_container).hasClass('active')) {
	                        var current_banner = parseInt(slider_array[j].attr('data-current'))
				        	, selected_banner = (current_banner + 1) > (images_len - 1) ? 0 : current_banner + 1;

	                        // Show the selected banner
	                        ShowSliderBanner($slider_container, selected_banner);
	                    }

	                    return false;
	                }
	            });

	            // Set the initial auto scroll interval
	            if (!$slider.hasClass('auto_off')) {
	                var slider_interval = setInterval(function() {
						
	                    // Click the next arrow
	                    $('.pagination .slider_next a', $slider_container).trigger('click');
	                }, 3000);
	            }

	            $slider_container.on({
	                mouseenter: function() {
	                
	                    if (!slider_array[j].hasClass('auto_off')) {

	                        // Clear the auto scroll interval
	                        clearInterval(slider_interval);
	                    }

	                    if (!slider_array[j].hasClass('arrows_off') && $('body').width() >= ac_web.min_device_width.desktop) {

	                        // Show the prev/next arrows
	                        $('.slider_prev, .slider_next', $slider_container).stop(true, true).fadeIn('fast');
	                    }
	                },
	                mouseleave: function() {
	                	
	                    if (!slider_array[j].hasClass('arrows_off') && $('body').width() >= ac_web.min_device_width.desktop) {

	                        // Hide the prev/next arrows
	                        $('.slider_prev, .slider_next', $slider_container).stop(true, true).fadeOut('slow');
	                    }

	                    if (!slider_array[j].hasClass('auto_off')) {
	                        // Clear the auto scroll interval
	                        clearInterval(slider_interval);

	                        // Set the auto scroll interval
	                        slider_interval = setInterval(function() {
	                            $('.pagination .slider_next a', $slider_container).trigger('click');
	                        }, 5000);
	                    }
	                }
	            });
	        }
	    });
	}
}

/**
 *
 * Shows a slider image
 *
 */
function ShowSliderBanner($slider_container, selected_banner) {
    if ($slider_container && selected_banner > -1) {
		
        var $slider_image = $('li', $slider_container)
        ,	$slider = $slider_container.find('.slider')
		,	slide_timer = $('body').width() >= ac_web.min_device_width.desktop ? 500 : 0;

        if (!$slider_image.eq(selected_banner).hasClass('current')) {
			
	        //Deactivate pagination
	        $('.pagination', $slider_container).removeClass('active');
	        
	        //Change current slide flag
	        $slider.attr('data-current', selected_banner);
	        
	        if ($slider.hasClass('transition_slide')) {
					
				// Slide the image in
				$('.slider', $slider_container).animate({
					left: $slider_image.eq(selected_banner).position().left * -1
				}, slide_timer, function() {
					$slider_image.eq(selected_banner).addClass('current').siblings('.current').removeClass('current');
					$('.pagination', $slider_container).addClass('active');
				});
	        } else {
				
				if ($('body').width() >= ac_web.min_device_width.desktop) {
					// Fade the image in
					$slider_image.eq(selected_banner).addClass('next');
					$('.slider .current', $slider_container).fadeOut(slide_timer, function() {
						$('.next', $slider_container).removeClass('next').addClass('current');
						$(this).removeClass('current').css('display', 'block');
						$('.pagination', $slider_container).addClass('active');
					});
				} else {
					$slider_image.eq(selected_banner).addClass('current').siblings('.current').removeClass('current');
	        		$('.pagination', $slider_container).addClass('active');
				}
			}

            // Toggle the pagination dot
            $('.pagination', $slider_container).children('li').eq(selected_banner + 1).addClass('current').siblings('li.current').removeClass('current');
        };
    }
}

/**
*
* Inits any tool tips
*
*/
function InitToolTip() {
	var $toolTip = $('.tool_tip_container')
	,	$tool_tip
	,	ToolTipCollection
	,	tool_tip_collection
	,	ToolTipView
	,	tool_tip_view;
	
	if ($toolTip.length) {
		
		ToolTipCollection = Backbone.Collection.extend ({
			model: ac_web.ToolTip
		});

		tool_tip_collection = new ToolTipCollection();

		$toolTip.each(function(i) {
		    $tool_tip = $(this);
		    if ($tool_tip.attr('title')) {
		        tool_tip_collection.add({ title: $tool_tip.attr('title'), height: $tool_tip.outerHeight(), container: $tool_tip });
		    }
		});

		ToolTipView = Backbone.View.extend({
		    el: $('body'),
		    initialize: function() {
		        this.collection = tool_tip_collection;
		        this.render();
		    },
		    render: function() {
		        this.collection.each(function(item) {
		            this.renderItem(item);
		        }, this);
		    },
		    renderItem: function(item) {
		        item.get('container').append('<span class="tool_tip">' + item.get('title') + '<span /></span>');

		        var container = item.get('container')
				, $tool_tip = $('.tool_tip', container)
				, total_tool_tip_height = $tool_tip.outerHeight()
				, css = {
				    'top': total_tool_tip_height * -1,
				    'left': ($tool_tip.outerWidth() - container.outerWidth()) / -2,
				    'opacity': 0
				};

		        $tool_tip.css(css);

		        $(container).on({
		            mouseenter: function() {
		                $(this).children('.tool_tip').stop(true, true).animate({ opacity: 1, top: '-=9' }, 'fast');
		            },
		            mouseleave: function() {
		                $(this).children('.tool_tip').stop(true, true).animate({ opacity: 0, top: '+=9' }, 'fast');
		            }
		        });

		        container.removeAttr('title');
		    }
		});
		
		tool_tip_view = new ToolTipView;
	}
}

/**
*
* Inits a scroll effect on anchors
*
*/
function InitAnchorScroll() {
    $('a.anchor_scroll').on({
        click: function() {
            var anchor = $(this).attr('href')
            , $destination;

            if (anchor.substr(0, 1) === '#') {
                $destination = $($(this).attr('href'));

                if ($destination) {
                    $('html, body').animate({
                        scrollTop: $destination.offset().top
                    }, 'slow');

                    return false;
                }
            }
        }
    });

    $('a.anchor_scroll_top').on({
        click: function() {
            $("html, body").animate({ scrollTop: 0 }, "slow");

            return false;
        }
    });
}

/**
*
* Inits any date pickers
*
*/
function InitDatePicker() {
    var $date_pickers = $('.date_picker')
    ,   $date_picker
    ,   date_picker_options = {
        showOn: 'both',
        buttonImage: '../../assets/images/calendar.png',
        dayNamesMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        dateFormat: 'dd/mm/yy',
        firstDay: 1,
        changeMonth: false,
        changeYear: false,
        constrainInput: true
    };

    $date_pickers.each(function() {
        $date_picker = $(this);

        if ($date_picker.hasClass('start_today')) {
        
            // Disable dates before today
            date_picker_options['minDate'] = 0;
        } else if ($date_picker.hasClass('start_tomorrow')) {

            // Disable dates before tomorrow
            date_picker_options['minDate'] = 1;
        } else {
        
            // Allow all dates to be selected
            delete date_picker_options['minDate'];
        }
        
        // Create the datepicker
        $date_picker.datepicker(date_picker_options);
    });
}

/**
*
* Inits tabs on the page
*
*/
function InitTab() {
    var $tab_containers = $('.tab_container')
    ,   $tab_container
    ,   $tabs
    ,   $tab
    ,   tab_menu_markup
    ,   tab_container_array = [];
    
    if ($tab_containers.length) {
        $tab_containers.each(function(i) {
            $tab_container = $(this);
            $tabs = $('.tab', $tab_container);
            tab_container_array.push($tab_container);

            if ($tabs.length) {
                tab_menu_markup = '<ul class="nav nav_tabs">';

                $tabs.each(function(j) {
                    $tab = $(this);
                    $tab.addClass('tab-' + j);

                    if (j === 0) {
                        $tab.addClass('current');

                        tab_menu_markup += '<li class="current"><a href="#" rel="tab-' + j + '">' + $tab.find('.tab_heading').text() + '</a></li>';
                    } else {
                        tab_menu_markup += '<li><a href="#" rel="tab-' + j + '">' + $tab.find('.tab_heading').text() + '</a></li>';
                    }
                    
                    // Remove the tab heading
                    $('.tab_heading', $tab).append('<span />').attr('rel', 'tab-' + j);
/*                     $('.tab_heading', $tab).remove(); */
                });

                $tab_container.prepend(tab_menu_markup);
            }

            $('.nav_tabs a', tab_container_array[i]).on({
                click: function() {
                    var $this = $(this);

                    // Check not current tab
                    if (!$this.closest('li').hasClass('current')) {
                        var thisContent = $this.attr('rel');
                        thisContent = '.' + thisContent;
                        
                        // Highlight the current tab
                        $this.closest('li').addClass('current').siblings().removeClass('current');
                        
                        // Highlight the current tab content
                        $(thisContent, tab_container_array[i]).addClass('current').siblings().removeClass('current');
                    }
                    
                    return false;
                }
            });

            $('.tab_heading', tab_container_array[i]).on({
                click: function() {
                
                	// Cache selectors
                    var $this = $(this)
                    ,	$this_tab = $this.parent()
                    ,	rel = $this.attr('rel')
                    ,	$nav_tab = $this_tab.closest('.tab_container').children('.nav_tabs').find('a[rel="' + rel + '"]').parent();
                    
                    if ($this_tab.hasClass('current')) {
                    
                    // Close this tab
                    } else {
                    
                        // Open this tab and close the currently open tab
                        $($this_tab, tab_container_array[i]).addClass('current').siblings().removeClass('current');
                        
                        $nav_tab.addClass('current').siblings().removeClass('current');
                    }

                    return false;
                }
            });
        });
    }
}

function InitCaption() {
	var $caption_containers = $('.caption_container')
	,	$caption_container
	,	$caption_wrapper
	,	caption_array = []
	,	caption_bottom_padding;
	
	$caption_containers.each(function(j) {
		
		caption_array.push($(this));
		
		caption_bottom_padding = parseInt($('.caption_wrapper', caption_array[j]).css('padding-bottom'));
		
		$('.caption_wrapper', caption_array[j]).css({
		'bottom' : parseInt($('.caption_content', caption_array[j]).outerHeight(true) + caption_bottom_padding) * -1
		});
		
		caption_array[j].on({
			mouseenter: function() {
				$('.caption_wrapper', caption_array[j]).stop().animate({
					'bottom': 0
				}, 150);

			},
			mouseleave: function() {
				$('.caption_wrapper', caption_array[j]).stop().animate({
					'bottom' : parseInt($('.caption_content', caption_array[j]).outerHeight(true) + caption_bottom_padding) * -1
				}, 150);
			}
		});
	});
}

function InitAccordion() {
	var $accordion_containers = $('.accordion_container')
	,	$accordion_container
	,	$accordion_heading
	,	$accordion_content;
	
	$accordion_containers.each(function(i) {
		$accordion_container = $(this);
		
		
	});
}

function InitDropdown() {
	var $dropdowns = $('.dropdown')
	,	$dropdown
	,	$dropdown_heading
	,	$menu_items
	,	$menu_item
	,	$sub_menu
	,	$sub_menu_items;
	
	$dropdowns.each(function() {
		
		// Cache the current dropdown UL
		$dropdown = $(this);
		
		// Cache the top-level LIs
		$menu_items = $($dropdown).children('li');
		
		$menu_items.each(function() {
			
			// Cache the current top-level LI
			$menu_item = $(this);
		
			// Cache the sub menu UL
			$sub_menu = $menu_item.children('ul');
			
			//Append arrow image to each menu if dropdown has class "arrow"
			if($menu_item.parent().hasClass('arrow')) {
				$sub_menu.before('<span class="dropdown_arrow" />');
			}
			
			if ($sub_menu.length) {
				//Cache dropdown headings
				$dropdown_heading = $menu_item.children('a');
				
				if ($dropdown_heading.attr('href') != '#') {
					$('<li class="dropdown_heading_item">' + GetElementMarkup($dropdown_heading) + '</li>').prependTo($sub_menu);
				}
				
				// Show arrow for expandable menu items if has class "arrow"
				$dropdown_heading.addClass('dropdown_heading');
				
				$sub_menu_items = $('li', $sub_menu);

				$sub_menu_items.eq($sub_menu_items.length - 1).addClass('last');
				
			}
	
		});
	});
	
	// Event handlers for menu items	
	$('.dropdown > li > .menu_item').on({
		click: function() {
			
			// Cache the element
			var $this = $(this);
			
			if ($('body').width() < ac_web.min_device_width.desktop && $this.siblings('ul').length) {
				$this.parent().toggleClass('current').siblings('.current').removeClass('current');
				
				return false;
			}
		},
		mouseenter: function() {
			if (ac_web.browser.ie_6 || ac_web.browser.ie_7) {
				
				// Display the sub menu
				$(this).parent().addClass('current').siblings('.current').removeClass('current');
			}
		}
	});
	
	// Event handlers for dropdown element
	$('.dropdown').on({
		mouseenter: function() {
			if (ac_web.browser.ie_6 || ac_web.browser.ie_7) {
				
				// Adjust z-index of content after the menu
				$(this).next().addClass('push_back');
			}
		},
		mouseleave: function() {
			if (ac_web.browser.ie_6 || ac_web.browser.ie_7) {
				
				// Adjust z-index of content after the menu
				$(this).find('.current').removeClass('current').end().next().removeClass('push_back');
			}
		}
	});
	
}

/**
*
* Returns an element's outer and inner markup
*
*/
function GetElementMarkup($element) {
    if ($element) {
        return $element.clone().wrap('<div>').parent().html();
    }
}


/**
*
* Validates form
*
*/

function InitValidation() {
	var $form = $('form.validate'),
		$required_fields,
		$required_field_array = [];
	
	//add message wrapper
	$('li.required .message').wrap('<div class="message_container" />');
	
	$form.on({
		'submit': function(e) {
			e.preventDefault();
			$required_fields = $('li.required', $(this));
			$required_fields.each(function(i) {
				$required_field_array.push($(this));
				ValidateField($required_field_array[i]);
				$required_field_array[i].on({
					'focusout' : function() {
						ValidateField($required_field_array[i]);
					}
				});
			});
		}
	});
}

function ValidateField($field) {
	var error = false,
		$message_container,
		$text_input,
		$text_area,
		$select,
		$captcha;
		
	//Add correct class as default
	$field.addClass('correct');
	
	if($('.message_container', $field)) {
		$message_container = $('.message_container', $field);
	}
	
	//Find field type
	if ($('input[type="text"]', $field).length) {
	
		//Check text input valid email/phone/postcode or not blank string
		$text_input = $('input[type="text"]', $field);
		if ($field.hasClass('email')) {
			console.log(ValidateEmailAddress($text_input.val()));
			error = (ValidateEmailAddress($text_input.val())) ? false : true;
		} else
		if ($field.hasClass('phone')) {
			error = (ValidatePhoneNumber($text_input.val())) ? false : true;
		} else
		if ($field.hasClass('postcode')) {
			error = (ValidatePostcode($text_input.val())) ? false : true;
		} 
		else {
			error = ($text_input.val() == '') ? true : false;
		} 
	} else
	if ($('select', $field).length) {
	
		//Check select value not blank string
		$select = $('select', $field);
		error = ($select.val() == '') ? true : false;
	} else
	if ($('textarea', $field).length) {
	
		//Check textarea value not blank string
		$textarea = $('textarea', $field);
		error = ($textarea.val() == '') ? true : false;
	} else
	if ($('.captcha', $field).length) {
		console.log('captcha');
	}
	
	//Show or hide error
	if(error === true) {
		$field.addClass('error');
		if($field.hasClass('correct')) {
			$field.removeClass('correct');
			
			//Show error message
			$message_container.show('fast', function() {
				$('.message', $message_container).fadeIn('slow').css('display', 'block');
			});
		}
	} else {
		if($field.hasClass('error')) {
			//Hide error message
			$('.message', $message_container).fadeOut('fast', function() {
				$message_container.hide('slow');
					$field.removeClass('error');
			});
		}
	}
}

function ValidateEmailAddress(email_address) {
    if (email_address) {
        var reg_ex = (/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        
        return reg_ex.test(email_address);
    };
};

function ValidatePhoneNumber(phone_number) {
	var reg_ex = /^(((\+44\s?\d{4}|\(?0\d{4}\)?)\s?\d{3}\s?\d{3})|((\+44\s?\d{3}|\(?0\d{3}\)?)\s?\d{3}\s?\d{4})|((\+44\s?\d{2}|\(?0\d{2}\)?)\s?\d{4}\s?\d{4}))(\s?\#(\d{4}|\d{3}))?$/i;
	return reg_ex.test(phone_number);
};

function ValidatePostcode(postcode) {
	var reg_ex = /[A-Z]{1,2}[0-9]{1,2} ?[0-9][A-Z]{2}/i;
	return reg_ex.test(postcode);
};