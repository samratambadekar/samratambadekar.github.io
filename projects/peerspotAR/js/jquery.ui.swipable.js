/*
 * $.ui.swipable
 *
 * http://code.google.com/p/jquery-ui-swipable/
 * version 0.1.1 (2010/09/08)
 * Copyright (c) 2010 Takeshi Takatsudo (takazudo[at]gmail.com)
 * MIT license
 *
=============================================================================
 depends on
-----------------------------------------------------------------------------
 * jQuery 1.4.2
 * jQuery UI 1.8.2
 * jQuery UI Widget 1.8.2
 *
=============================================================================
 how to use
-----------------------------------------------------------------------------
 * // setup
 * 
 * $('#someUl').swipable();
 * 
 * // you can can bind iPhone,iPad swipe evnets
 * 
 * $('#someUl').bind('swipe.right', fn);
 * $('#someUl').bind('swipe.left', fn);
 * $('#someUl').bind('swipe.top', fn);
 * $('#someUl').bind('swipe.bottom', fn);
 * 
 */
(function($){ // start $=jQuery encapsulation
	
	$.widget('ui.swipable', {
		options: {
			preventDefault: true,
			distance: 150 // px distance to occur esw
		},
		_sleeping: false,
		_startX: null,
		_startY: null,
		_currentX: null,
		_currentY: null,
		_create: function(){
			if(!('ontouchstart' in document.documentElement)){
				return this;
			}
			this.widgetEventPrefix = 'swipe.';
			this._eventify();
			return this;
		},
		_eventify: function(){
			var e = this.element.get(0);
			e.addEventListener('touchstart',  $.proxy(this._touchStartHandler, this), false);
			e.addEventListener('touchmove',   $.proxy(this._touchMoveHandler, this), false);
			e.addEventListener('touchend',    $.proxy(this._touchEndHandler, this), false);
			e.addEventListener('touchcancel', $.proxy(this._touchCancelHandler, this), false);
			return this;
		},
		_evalSwipes: function(){
			var x = this._currentX;
			var y = this._currentY;
			var startX = this._startX;
			var startY = this._startY;
			var d = this.options.distance;
			((x-startX)>d) && this._swipeRight();
			((startX-x)>d) && this._swipeLeft();
			((y-startY)>d) && this._swipeBottom();
			((startY-y)>d) && this._swipeTop();
		},
		_awake: function(){
			this._sleeping = false;
			return this;
		},
		_sleep: function(){
			this._sleeping = true;
			return this;
		},
		_swipeTop: function(){
			this._sleep();
			this._trigger('top')
			return this;
		},
		_swipeRight: function(){
			this._sleep();
			this._trigger('right')
			return this;
		},
		_swipeBottom: function(){
			this._sleep();
			this._trigger('bottom')
			return this;
		},
		_swipeLeft: function(){
			this._sleep();
			this._trigger('left')
			return this;
		},
		_setStartTouch: function(touch){
			this._startX = touch.pageX;
			this._startY = touch.pageY;
			return this;
		},
		_setCurrentTouch: function(touch){
			this._currentX = touch.pageX;
			this._currentY = touch.pageY;
		},
		_touchStartHandler: function(event){
			var touches = event.touches;
			if(touches.length>1){
				return;
			}
			var touch = touches[0];
			this._setStartTouch(touch);
		},
		_touchMoveHandler: function(event){
			var touch = event.touches[0];
			this._setCurrentTouch(touch);
			!this._sleeping && this._evalSwipes();
			this.options.preventDefault && event.preventDefault();
		},
		_touchEndHandler: function(event){
			this._awake();
		},
		_touchCancelHandler: function(event){
			this._awake();
		}
	});

})(jQuery); // end $=jQuery encapsulation
