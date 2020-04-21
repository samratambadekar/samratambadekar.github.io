/**
 *
 * This file is auto-generated. Do not modify.
 *
 * olive-angular.js
 * @version 16.17.0
 * @built Tue Apr 26 2016 20:44:13 GMT+0000 (UTC)
 * @copyright DocuSign Inc
 *
 */
/**
 * Olive UI component library, core utility
 */

(function (Olive, $) {

    'use strict';

    /**
     *  @property {bool} closePopoverOnEsc  - Set to true and pressing Escape will close a popover
     *  @property {bool} closePopoverOnClickAnywhere  - Set to true and clicking anywhere will close a popover
     *  @property {bool} debug              - Set to true to output debug statements to the console.
     *  @property {bool} isAutoInitEnabled  - Set to true to enable auto initialize of components. Useful if using another JavaScript framework like Angular.
     *  @property {bool} isSiteFitPolyfillEnabled - Set to true to enable auto running the polyfill in the document.ready event. Disable if you are going to manually call it after views/HTML have rendered.
     */
    Olive.config = {
        closePopoverOnEsc: true,
        closePopoverOnClickAnywhere: true,
        debug: false,
        isAutoInitEnabled: true,
        isSiteFitPolyfillEnabled: true
    };



    /**
        Olive.KEYS - set of key codes to be used by Olive components
     */
    Olive.KEYS = {
        tab: 9,
        esc: 27,
        left: 37,
        up: 38,
        right: 39,
        down: 40
    };



    // Olive.init - stores an array of Olive UI initialization functions
    // maintains list of functions to re-run in case DOM changes
    Olive.init = (function (Olive) {
        var
            initList = [],
            initObj = {};

        /**
         * Olive.init.add - adds a function to the list of UI initialization functions
         * @delayedFunction {function} the function to be pushed to the initList
         */
        initObj.add = function (delayedFunction) {

            initList.push(delayedFunction);
            return initObj;
        };

        /**
         * Olive.init.run - runs each function in the initList
         */
        initObj.run = function () {
            var i;
            for (i = 0; i < initList.length; i++) {
                (initList[i])();
            }
            return initObj;
        };

        return initObj;

    }(window.Olive = window.Olive || {}));



    // Auto initialize components (if enabled) when the document loads.
    $(document).ready(function () {
        if (Olive.config.isAutoInitEnabled) {
            Olive.init.run();
        }

        if (Olive.config.isSiteFitPolyfillEnabled) {
            Olive.util.polyfillSiteFitLayout();
        }

        /* The global messages container must already have the necessary ARIA
         *  attribtues on it before adding a new message, so we must create
         *  the container immediately on page load so screen readers behave as
         *  expected
         */
        if (Olive.message) {
            Olive.message.createContainer();
        }
    });

    return;

}(window.Olive = window.Olive || {}, window.jQuery));

/**
 * Olive Popover utility
 *
 * superclass of positioned utilities like menus, tooltips, etc
 */
(function (Olive, $) {

    'use strict';

    var
        popoverObj = {},
        locationClasses = {
            'above': 'above',
            'below': 'below',
            'before': 'before',
            'after': 'after',
            'left': 'left',
            'center': 'center',
            'right': 'right',
            'top': 'top',
            'middle': 'middle',
            'bottom': 'bottom'
        },
        // keeps track of open popovers so we can skip costly operations
        // when no popovers are open
        numOpenPopovers = 0;


    /**
        lastTabbedElement - keep track of the last tabbed element within the popover
            so we can use it to figure out its parent popover
     */
    var lastTabbedElement;

    /**
     *  Handler for the keydown event on the document object. Saves the target
     *      element the first time the Tab key is pressed down.
     *
     *  @param {string} key - the pressed key, usually gathered from the event's "which" property
     *  @param {Object} target - the target element, usually gathered from the event's "target" property
     */
    function handleDocumentKeydown(key, target) {
        if (key === Olive.KEYS.tab) {

            /*
                If the lastTabbedElement is not null, the user is holding down
                the tab key, so we don't want to overwrite the saved element.
            */
            if (numOpenPopovers > 0 && !lastTabbedElement) {
                lastTabbedElement = target;
            }
        }
    }


    /**
     *  Handler for the keyup event on the document object. Closes an open
     *      popover if a user tabs out of it.
     *
     *  @param {string} key - the pressed key, usually gathered from the event's "which" property
     *  @param {Object} target - the target element, usually gathered from the event's "target" property
     */
    function handleDocumentKeyup(key, target) {
        if (numOpenPopovers > 0
                && lastTabbedElement
                && key === Olive.KEYS.tab) {

            var popover = popoverObj.findAssociatedPopover(lastTabbedElement);

            if (popover && !popover.content.find(target).length) {
                popover.close();
            }

            lastTabbedElement = null;
        }
    }


    popoverObj.instances = {};
    popoverObj.attributeList = {};
    popoverObj.cssClasses = {};
    popoverObj.defaults = {
        'location': 'below center',
        'events': 'click',
        'tip': 0,
        'attrSet': popoverObj.attributeList['olive-popover']
    };

    popoverObj.states = {
        'hiding': {
            'name': 'hiding',
            'baseState': 'hiding'
        },
        'delayingShow': {
            'name': 'delayingShow',
            'baseState': 'hiding'
        },
        'animatingShow': {
            'name': 'animatingShow',
            'baseState': 'hiding'
        },
        'showing': {
            'name': 'showing',
            'baseState': 'showing'
        },
        'delayingHide': {
            'name': 'delayingHide',
            'baseState': 'showing'
        },
        'animatingHide': {
            'name': 'animatingHide',
            'baseState': 'showing'
        }
    };

    // this object contains references to each set of instances, grouped
    //     by popover type. new popover types are added after each
    //     utility's instance object is initialized
    popoverObj.popoverInstanceGroups = {
        'popover': popoverObj.instances
    };


    /**
     * getMaxHeightSetting - verifies the correct maxHeight setting value
     * @param {string} maxHeightSetting - can be either 'window' or 'body'
     */
    function getMaxHeightSetting(maxHeightSetting) {

        if (maxHeightSetting === 'window' || maxHeightSetting === 'body') {
            return maxHeightSetting;
        }

        return null;
    }

    /**
     * Olive.popover.initialize - initializes popover behavior for a variety of popovers
     *     usually called by one of its subclasses, like menu or tooltip
     * @param {object} protoInstance - an initial instance object, created by Olive.menu or Olive.tooltip
     * @param {object} configObject - configuration options for initializing the instance
     * @prop {jQuery object} configObject.trigger - the trigger for this popover
     * @prop {string} configObject.contentId - the id of the HTML element for this popover's content
     * @prop {string} configObject.location - indicates the position of the popover relative to its trigger
     * @prop {integer} configObject.delay - in milliseconds, the delay before the element shows or hides (on hover only)
     * @prop {Boolean} configObject.fade - defines whether or not the content element fades in and out
     * @prop {string} configObject.events - defines which DOM event(s) trigger the appearance of the popover
     * @prop {integer} configObject.tip - size, in pixels, of the content element's triangular tip
     * @prop {integer} configObject.minWidth - used by menus, defines an absolute minimum width for the popover
     * @prop {string} configObject.maxHeight - defines the method for calculating max height of the popover, either 'window' or 'body'

     * @prop {jQuery object || string} configObject.positionTo - optionally, position the content with
     *     respect to this element or event instead of its trigger
     */
    popoverObj.initialize = function (protoInstance, configObject) {

        var
            instance = protoInstance || popoverObj.generateInstance(configObject.trigger);

        if (!instance) {
            return false;
        }

        if (instance.content === undefined) {
            if ($('#' + configObject.contentId).length) {
                instance.content = $('#' + configObject.contentId);
            } else {
                return false;
            }
        }

        /**
         * instance.setName - if the chosen name already exists within Olive.popover.instances,
         *     programmatically choose another name for this instance
         */
        instance.setName = function (initialName) {
            var
                i = 0,
                presenceIndicator = 0,
                testName = initialName;

            if (Object.keys(popoverObj.instances).indexOf(testName) >= 0) {
                while (presenceIndicator >= 0) {
                    testName = String(initialName + i);
                    presenceIndicator = Object.keys(popoverObj.instances).indexOf(testName);
                    i++;
                }
            }

            if (!(instance.attrSet.popoverName in popoverObj.attributeList)) {
                popoverObj.attributeList[instance.attrSet.popoverName] = instance.attrSet;
            }
            instance.popoverName = testName;
            instance.trigger.attr(instance.attrSet.popoverName, testName);
            instance.trigger.attr(instance.attrSet.trigger, testName);
            popoverObj.instances[testName] = instance;

            return instance;
        };

        instance.setName(configObject.contentId);
        instance.options = {};
        instance.options.location = configObject.location.toLowerCase() || popoverObj.defaults.location;
        instance.options.events = configObject.events.toLowerCase() || popoverObj.defaults.events;
        instance.options.tip = configObject.tip || popoverObj.defaults.tip;
        instance.options.minWidth = configObject.minWidth || 0;
        instance.options.positionTo = configObject.positionTo || instance.trigger;
        instance.options.delay = configObject.delay || 0;
        instance.options.fade = configObject.fade || false;
        instance.options.animationModel = configObject.animationModel || "default";
        instance.options.maxHeight = getMaxHeightSetting(configObject.maxHeight);

        instance.popoverType = configObject.popoverType;
        instance.currentState = popoverObj.states.hiding;
        instance.delayObject = null;
        instance.popChildren = [];
        instance.popParents = [];

        if (!instance.content.length) {
            return false;
        }

        /**
         * instance.open - displays the popover element. as part of opening, closes
         *     other popovers of the same type (except parents of this instance)
         * @param {jQuery event} event - the event that triggered the open; this is needed
         *     if we are positioning based on event location
         */
        instance.open = function (event) {

            // switch statement: defines behavior based on current state
            // necessary to handle fade-related behavior, which can be complex
            switch (instance.currentState) {
                case popoverObj.states.hiding:
                    instance.closeOthers();
                    instance.beforeOpen();
                    if (instance.options.fade) {
                        instance.fadeOpen(event);
                    } else {
                        instance.simpleOpen(event);
                    }
                    break;
                case popoverObj.states.delayingShow:
                    instance.closeOthers();
                    instance.beforeOpen();
                    instance.cancelPendingDelay();
                    if (instance.options.fade) {
                        instance.fadeOpen(event);
                    } else {
                        instance.simpleOpen(event);
                    }
                    break;
                case popoverObj.states.animatingShow:
                    return;
                    break;
                case popoverObj.states.showing:
                    return;
                    break;
                case popoverObj.states.delayingHide:
                    instance.cancelPendingDelay();
                    instance.currentState = popoverObj.states.showing;
                    return;
                    break;
                case popoverObj.states.animatingHide:
                    instance.content.stop();
                    instance.simpleOpen(event);
                    break;
            }

            return instance;
        };

        /**
         * instance.close - hides the popover element
         */
        instance.close = function () {

            // switch statement: defines behavior based on current state
            // necessary to handle fade-related behavior, which can be complex
            switch (instance.currentState) {
                case popoverObj.states.hiding:
                    return;
                    break;
                case popoverObj.states.delayingShow:
                    instance.cancelPendingDelay();
                    instance.currentState = popoverObj.states.hiding;
                    return;
                    break;
                case popoverObj.states.animatingShow:
                    instance.content.stop();
                    instance.simpleClose();
                    break;
                case popoverObj.states.showing:
                    if (instance.options.fade) {
                        instance.fadeClose();
                    } else {
                        instance.simpleClose();
                    }
                    break;
                case popoverObj.states.delayingHide:
                    instance.cancelPendingDelay();
                    if (instance.options.fade) {
                        instance.fadeClose();
                    } else {
                        instance.simpleClose();
                    }
                    break;
                case popoverObj.states.animatingHide:
                    return;
                    break;
            }

            if (instance.popChildren.length) {
                for (var i=0; i<instance.popChildren.length; i++) {
                    instance.popChildren[i].close();
                }
            }

            return instance;
        };

        /**
         * instance.simpleOpen - displays the popover element with no animation; cleans up
         * @param {jQuery event} event - the event that triggered the open; this is needed
         *     if we are positioning based on event location
         */
        instance.simpleOpen = function (event) {

            // only increment the counter if the popover was not considered "open" already
            if (instance.currentState.baseState === "hiding") {
                numOpenPopovers++;
            }

            instance.currentState = popoverObj.states.showing;

            instance.content.removeClass(popoverObj.cssClasses[instance.popoverType].contentHidden).css({'opacity': 1});
            instance.trigger.addClass(popoverObj.cssClasses[instance.popoverType].activeTrigger);
            instance.reposition(event);

            // if the content is positioned to an element, reposition it appropriately when the window gets resized
            // also bind to the position.sticky event so we can update the popover positions when sticky mode gets turned on/off
            if (instance.options.positionTo !== "event") {
                $(window).on({
                    'resize': instance.reposition,
                    'position.sticky': instance.reposition
                });
            }

            // if a piece of content is used for more than one popover instance,
            // this tells us which instance is currently open
            instance.content.attr(instance.attrSet.contentFor, instance.popoverName);

            //only bind once to the document
            if (numOpenPopovers === 1) {
                $(document).on({
                    'keydown.popover.olive': function (e) {
                        handleDocumentKeydown(e.which, e.target);
                    },
                    'keyup.popover.olive': function (e) {
                        handleDocumentKeyup(e.which, e.target);
                    }
                });
            }

            if (Olive.scrollShadow && instance.content.hasClass('popover-isScrollable')) {
                instance.content.attr('olive-scroll-shadow', instance.popoverName + '-scrollShadow');
                instance.scrollShadow = Olive.scrollShadow.initialize(instance.content);
            }

            instance.afterOpen();

            return instance;
        };

        /**
         * instance.fadeOpen - animates the reveal of the popover
         * @param {jQuery event} event - the event that triggered the open; this is needed
         *     if we are positioning based on event location
         */
        instance.fadeOpen = function (event) {
            var
                fadeParams = Olive.animation.getFadeIn(instance.options.animationModel);

            instance.content.removeClass(popoverObj.cssClasses[instance.popoverType].contentHidden);
            instance.reposition(event);
            instance.currentState = popoverObj.states.animatingShow;

            instance.content.animate(
                {'opacity' : 1},
                fadeParams.duration,
                fadeParams.timingFunction,
                function () {
                    instance.simpleOpen(event);
                }
            );
            return instance;
        };


        /**
         * instance.simpleClose - hides the popover element with no animation; cleans up
         */
        instance.simpleClose = function () {

            // only decrement the counter if the popover was not considered "closed" already
            if (instance.currentState.baseState === "showing" && numOpenPopovers > 0) {
                numOpenPopovers--;
            }

            instance.currentState = popoverObj.states.hiding;

            instance.content.addClass(popoverObj.cssClasses[instance.popoverType].contentHidden).css({'opacity': 0});
            instance.trigger.removeClass(popoverObj.cssClasses[instance.popoverType].activeTrigger);
            instance.removeLocationClasses();

            // remove the window resize listener for performance
            if (instance.options.positionTo !== "event") {
                $(window).off({
                    'resize': instance.reposition,
                    'position.sticky': instance.reposition
                });
            }

            // no more popovers open so remove the document listeners for performance
            if (numOpenPopovers === 0) {
                $(document)
                    .off('keydown.popover.olive')
                    .off('keyup.popover.olive');
            }

            instance.afterClose();

            return instance;
        };

        /**
         * instance.fadeClose - hides the popover element with a fade animation
         */
        instance.fadeClose = function () {

            var
                fadeParams = Olive.animation.getFadeOut(instance.options.animationModel);

            instance.currentState = popoverObj.states.animatingHide;
            instance.content.animate(
                {'opacity' : 0},
                fadeParams.duration,
                fadeParams.timingFunction,
                function () {
                    instance.simpleClose();
                }
            );

            return instance;
        };

        /**
         * instance.cancelPendingDelay - prevents a delayed show or hide of the popover element;
         *     used if the user stops hovering before a tooltip appears, for example
         */
        instance.cancelPendingDelay = function () {
            clearTimeout(instance.delayObject);
            instance.delayObject = null;
            if (instance.currentState === popoverObj.states.delayingHide) {
                instance.currentState = popoverObj.states.showing;
            } else if (instance.currentState === popoverObj.states.delayingShow) {
                instance.currentState = popoverObj.states.hiding;
            }
            return instance;
        };

        /**
         * instance.beforeOpen - a dummy function that executes before instance.open
         *     intended to be overridden by subclasses
         */
        instance.beforeOpen = function () {
            return instance;
        };

        /**
         * instance.afterOpen - a dummy function that executes after instance.open
         *     intended to be overridden by subclasses
         */
        instance.afterOpen = function () {
            return instance;
        };

        /**
         * instance.afterClose - a dummy function that executes after instance.close
         *     intended to be overridden by subclasses
         */
        instance.afterClose = function () {
            return instance;
        };

        /**
         * instance.toggle - opens or closes the popover, based on its current state
         * @param {jQuery event} event - the event that triggered the toggle; this is needed
         *     if we are positioning based on event location
         */
        instance.toggle = function (event) {
            if (instance.currentState === popoverObj.states.showing) {
                instance.close();
            } else {
                instance.open(event);
            }
            return instance;
        };

        /**
         * instance.closeOthers - closes all other popovers, often used before
         * this popover opens. This method can be overridden by subclasses if
         * necessary.
         */
        instance.closeOthers = function () {
            popoverObj.closeAllOfType(instance);
            return instance;
        };

        /**
         * instance.reposition - positions the content element based on the location string
         * @param {jQuery event} event - the event that triggered the open; this is needed
         *     if we are positioning based on event location
         */
        instance.reposition = function (event) {

            var
                finalLocation,
                positionOrigin = (instance.options.positionTo === "event") ? event : $(instance.options.positionTo);

            instance.removeLocationClasses();

            var positionOptions = {
                location: instance.options.location,
                maxHeight: instance.options.maxHeight,
                tip: instance.options.tip
            }

            finalLocation = (Olive.position.move(positionOrigin, instance.content, positionOptions)).location;

            instance.addLocationClasses(finalLocation);

            return instance;
        };

        /**
         * instance.initializePosition - sets an initial absolute position to prevent page jumping
         */
        instance.initializePosition = function () {

            instance.content.css({
                'top': 0,
                'left': 0
            });

            return instance;
        };

        /**
         * instance.addLocationClasses - adds the classes associated with
         *     the popover's positioned location.
         * @param {string} finalLocation - the final location as determined by Olive.position;
         *     necessary in case original intended position was blocked
         */
        instance.addLocationClasses = function (finalLocation) {
            var
                className;
            for (className in locationClasses) {
                if (finalLocation.indexOf(locationClasses[className]) > -1) {
                    instance.content.addClass(locationClasses[className]);
                }
            }
            return instance;
        };

        /**
         * instance.removeLocationClasses - removes all location classes,
         *     usually used when the popover closes
         */
        instance.removeLocationClasses = function () {
            var
                className;
            for (className in locationClasses) {
                instance.content.removeClass(locationClasses[className]);
            }
            return instance;
        };

        /**
         * instance.addChild - designates another popover instance as a child
         *     useful for nested menus or tooltips in menus, etc
         * @param {object} childInstance - the instance of the child popover
         */
        instance.addChild = function (childInstance) {
            if (instance.popChildren.indexOf(childInstance) === -1) {
                instance.popChildren.push(childInstance);
            }
            return instance;
        };

        /**
         * instance.addParent - designates another popover instance as a parent
         *     useful for nested menus or tooltips in menus, etc
         * @param {object} parentInstance - the instance of the parent popover
         */
        instance.addParent = function (parentInstance) {
            if (instance.popParents.indexOf(parentInstance) === -1) {
                instance.popParents.push(parentInstance);
            }
            return instance;
        };

        /** instance.bindEvents - binds behavior for all events in instance.options.events
         *      if valid events are provided, falls back to click
         */
        instance.bindEvents = function () {
            var
                foundValidEvent = false,
                eventType,
                validEvents = {
                    'click': instance.bindClick,
                    'hover': instance.bindHover
                };

            for (eventType in validEvents) {
                if (instance.options.events.indexOf(eventType) > -1) {
                    validEvents[eventType]();
                    foundValidEvent = true;
                }
            }

            if (!foundValidEvent) {
                instance.options.events = "click";
                instance.bindClick();
            }

            return instance;
        };

        /**
         * instance.bindClick - binds default click behaviors if the
         *     popover should react to click events
         */
        instance.bindClick = function () {

            if (instance.options.events.indexOf("hover") > -1) {
                instance.trigger.on({
                    "click": function () {
                        instance.trigger.removeClass(popoverObj.cssClasses[instance.popoverType].activeTrigger);
                        instance.close();
                    }
                });
            } else {
                instance.trigger.on({
                    "click": function (e) {
                        if (instance.currentState === popoverObj.states.showing) {
                            instance.trigger.removeClass(popoverObj.cssClasses[instance.popoverType].activeTrigger);
                            instance.close();
                        } else {
                            instance.trigger.addClass(popoverObj.cssClasses[instance.popoverType].activeTrigger);
                            instance.open(e);
                        }
                    }
                });
            }

            return instance;
        };

        /**
         * instance.bindHover - binds default hover behaviors if the
         *    popover should react to hover events
         */
        instance.bindHover = function () {

            instance.trigger.on({
                "mouseenter" : function (e) {
                    // switch statement: defines behavior based on current state
                    // necessary to handle fade-related behavior, which can be complex
                    switch (instance.currentState) {
                        case popoverObj.states.hiding:
                            if (instance.options.delay) {
                                instance.currentState = popoverObj.states.delayingShow;
                                instance.delayObject = setTimeout(function () {
                                    instance.open(e);
                                }, instance.options.delay);
                            } else {
                                instance.open();
                            }
                            break;
                        case popoverObj.states.delayingShow:
                            return;
                            break;
                        case popoverObj.states.animatingShow:
                            instance.content.stop();
                            instance.simpleClose();
                            return;
                            break;
                        case popoverObj.states.showing:
                            return;
                            break;
                        case popoverObj.states.delayingHide:
                            instance.cancelPendingDelay();
                            break;
                        case popoverObj.states.animatingHide:
                            instance.content.stop();
                            instance.simpleOpen();
                            break;
                    }
                },
                "mouseleave" : function() {
                    switch (instance.currentState) {
                        case popoverObj.states.hiding:
                            return;
                            break;
                        case popoverObj.states.delayingShow:
                            instance.cancelPendingDelay();
                            break;
                        case popoverObj.states.animatingShow:
                            instance.content.stop();
                            instance.simpleClose();
                            break;
                        case popoverObj.states.showing:
                            if (instance.options.delay) {
                                instance.currentState = popoverObj.states.delayingHide;
                                instance.delayObject = setTimeout(function () {
                                    instance.close();
                                }, instance.options.delay);
                            } else {
                                instance.close();
                            }
                            break;
                        case popoverObj.states.delayingHide:
                            return;
                            break;
                        case popoverObj.states.animatingHide:
                            return;
                            break;
                    }
                }
            });

            return instance;
        };

        /**
         * instance.destroy - wrapper for Olive.popover.destroyInstance
         *     - destroys children, if applicable
         *     - removes the instance from memory
         *     - removes 'initialized' state from trigger
         *     - destroys scroll shadow
         */
        instance.destroy = function() {

            if (instance.scrollShadow) {
                instance.scrollShadow.destroy();
            }

            popoverObj.destroyInstance(instance);

            return;
        };

        // bind behaviors to the appropriate events
        instance.bindEvents();

        // check to see if this instance has any parents, and if so, link them
        if (instance.trigger.attr(instance.attrSet.childTo) != undefined) {
            var
                parentArray = instance.trigger.attr(instance.attrSet.childTo).split(" ");

            for (var i=0; i<parentArray.length; i++) {
                if (Object.keys(popoverObj.instances).indexOf(parentArray[i]) > -1) {
                    instance.popParents.push(popoverObj.instances[parentArray[i]]);
                    popoverObj.instances[parentArray[i]].popChildren.push(instance);
                }
            }
        };
        // now check to see if anyone out there has this instance as a parent
        for (var item in popoverObj.instances) {
            var
                foreignTrigger = popoverObj.instances[item].trigger;

            if (foreignTrigger.attr(instance.attrSet.childTo) != undefined) {
                var
                    foreignParentArray = foreignTrigger.attr(instance.attrSet.childTo).split(" ");
                for (var j=0; j<foreignParentArray.length; j++) {
                    if (foreignParentArray[j] == instance.popoverName) {
                        instance.popChildren.push(popoverObj.instances[item]);
                        popoverObj.instances[item].popParents.push(instance);
                    }
                }
            }
        }

        // add class for triangular tip if necessary, used in tooltips
        if (instance.options.tip > 0) {
            instance.content.addClass(popoverObj.cssClasses[instance.popoverType].contentHasTip);
        }

        // initializes opacity, visibility, and position
        instance.content.addClass(popoverObj.cssClasses[instance.popoverType].contentHidden);
        instance.content.css({'opacity':0});
        instance.initializePosition();

        // add the instance to the set of popover instances
        // this should happen after the parent/child checks above
        popoverObj.instances[instance.popoverName] = instance;

        // set an "initialized" attribute to prevent re-initialization
        instance.trigger.attr(instance.attrSet.initialized, "true");

        return instance;
    };

    /**
     * Olive.popover.closeAll - closes all popovers. if this is triggered by the
     *     opening of a popover, that popover and its parents are exempt
     * @param {object} preservedInstance - optional. instance of the popover to keep open.
     *     Most often this is an instance that is about to open and is triggering
     *     closure of the others.
     */
    popoverObj.closeAll = function(preservedInstance) {

        // bypass closeAll if no popovers are open
        if (numOpenPopovers < 1) {
            return;
        }

        popoverObj.closeAllOfType(preservedInstance, true);

        return;
    };

    /**
     * Olive.popover.closeAllOfType - closes all popovers of the same type as
     *      the passed instance. keeps the passed instance and its parents open
     * @param {object} preservedInstance - instance of the popover to keep open.
     *     Most often this is an instance that is about to open and is triggering
     *     closure of the others.
     * @param {Boolean} closeAllTypes - close popovers of all types, not just one
     */
    popoverObj.closeAllOfType = function(preservedInstance, closeAllTypes) {

        // bypass closeAll if no popovers are open
        if (numOpenPopovers < 1) {
            return;
        }

        var
            item,
            closingGroup,
            checkLineage = Boolean(preservedInstance),
            closeAllPopovers = Boolean(closeAllTypes) || false;

        // close all popovers vs. close all of type
        if (closeAllPopovers) {
            closingGroup = popoverObj.popoverInstanceGroups['popover'];
        } else {
            closingGroup = popoverObj.popoverInstanceGroups[preservedInstance.popoverType];
        }

        // if no preserved instance, just close them all
        if (!(checkLineage)) {
            for (item in closingGroup) {
                if (closingGroup[item].currentState === popoverObj.states.showing) {
                    closingGroup[item].close();
                }
            }
        // close all in the group that are not the passed instance or
        //     its parent instances
        } else {
            for (item in closingGroup) {
                if ((closingGroup[item] == preservedInstance) ||
                    (preservedInstance.popParents.indexOf(closingGroup[item]) > -1)) {
                    continue;
                }
                if (closingGroup[item].currentState === popoverObj.states.showing) {
                    closingGroup[item].close();
                }
            }
        }

        return;
    };


    /**
     * Olive.popover.generateInstance - generates a basic popover instance
     *     to be returned to the initialization function. Used when no instance
     *     has been passed to Olive.popover.initialize
     * @param {Jquery object or HTML element} trigger - the trigger element
     */
    popoverObj.generateInstance = function(trigger) {

        var
            instance = {};

        instance.trigger = $(trigger);

        // determine if we are using the current attribute set or a legacy set
        instance.attrSet = Olive.util.determineAttributeSet(instance.trigger, popoverObj.attributeList);

        // exit early if the correct attribute is not available
        if (!instance.attrSet) {
            return false;
        }

        return instance;
    };

    /**
     * Olive.popover.destroyInstance - destroys the reference to a given instance,
     *     and removes its content if appropriate
     * @param {object} instance - the instance to be destroyed
     */

    popoverObj.destroyInstance = function(instance) {
        var
            i,
            instanceType = instance.popoverType,
            instanceName = String(instance.popoverName);

        if ((instanceType == "tooltip") && (instance.isMini)) {
            instance.content.remove();
        }

        for (i=0; i<instance.popChildren.length; i++) {
            popoverObj.destroyInstance(instance.popChildren[i]);
        }

        instance.trigger.removeAttr(instance.attrSet.initialized);
        delete popoverObj.popoverInstanceGroups[instanceType][instanceName];
        delete popoverObj.popoverInstanceGroups['popover'][instanceName];

        return;
    };


    /**
     * Olive.popover.findNoCloseInstance - checks to see if a clicked element has a
     *     parent that would prevent closure of a given popover
     * @param {jQuery object or HTML element} element - the element to test
     */
    popoverObj.findNoCloseInstance = function(element) {
        var
            attrSet,
            correctAttrSet,
            noCloseElement = null,
            noCloseInstance = null,
            instanceName,
            jqEle = $(element);

        // determine if the chosen element has a parent that would prevent a popover
        // from being closed. this would be because it is (or has a parent) with the
        // noClose attribute or it's a trigger element
        for (attrSet in popoverObj.attributeList) {
            var noCloseAttribute = popoverObj.attributeList[attrSet].noclose;

            // search for this attribute set's no close attribute
            if (jqEle.closest('[' + noCloseAttribute + ']').length) {
                correctAttrSet = popoverObj.attributeList[attrSet];
                noCloseElement = jqEle.closest('[' + noCloseAttribute + ']');

                // if the attribute is a string, it's the name of a popover
                // that popover is the instance not to close
                if (noCloseElement.attr(noCloseAttribute) != "") {
                    noCloseInstance = popoverObj.instances[noCloseElement.attr(noCloseAttribute)];
                    break;
                // if that attribute is empty, then we need to find the
                // content block in the DOM and its associated popover instance
                } else {
                    noCloseInstance = popoverObj.findAssociatedPopover(element, correctAttrSet);
                    break;
                }
            }
        }

        // if we haven't found an instance yet, check to see if the element or one of its
        // parents has the deprecated no-close class...
        if ((!noCloseInstance) && (jqEle.closest('.no-close').length)) {
            noCloseElement = jqEle.closest('.no-close');
            noCloseInstance = popoverObj.findAssociatedPopover(noCloseElement);
        }

        // finally, return the instance. if we haven't found one, this will be null
        return noCloseInstance;
    };

    /**
     * Olive.popover.findAssociatedPopover - finds the popover that is associated
     *     the given element.
     * @param {jQuery object or HTML element} element - the element to test
     * @param {object} correctAttrSet - the correct attribute set to use for this element's popover
     */
    popoverObj.findAssociatedPopover = function(element, correctAttrSet) {
        var
            instanceName,
            jqEle = $(element);

        // if we know what the attribute set is, use it
        if (correctAttrSet != undefined) {
            return popoverObj.instances[jqEle.closest('[' + correctAttrSet.contentFor + ']').attr(correctAttrSet.contentFor)];
        // otherwise, this is messy. for every possible attribute set...
        } else {
            for (var attrSet in popoverObj.attributeList) {
                // look for a popover content attribute...
                if (jqEle.closest('[' + popoverObj.attributeList[attrSet].contentFor + ']').length) {
                    // ...and return that instance if you find one
                    return popoverObj.instances[jqEle.closest('[' + popoverObj.attributeList[attrSet].contentFor + ']').attr(popoverObj.attributeList[attrSet].contentFor)];
                }
            }
        }

        // if we get here, we haven't found an instance
        return null;
    };

    /**
     * Olive.popover.findTriggerParent - Determine if the given element has a popover trigger parent
     * @param {jQuery object or HTML element} element - the element to test
     */
    popoverObj.findTriggerParent = function(element) {
        var
            jqEle = $(element);

        // look for an initialized trigger element...
        for (var attrSet in popoverObj.attributeList) {

            var trigger = jqEle.closest('[' + popoverObj.attributeList[attrSet].trigger + ']');

            if (trigger.length) {
                return trigger;
            }
        }
        return false;
    };


    /**
     * Olive.popover.initializeDocumentListeners - adds event listener(s) to
     *     close all popovers when appropriate
     */
    popoverObj.initializeDocumentListeners = function() {
        $(document).on({
            'click': function (e) {
                if (!Olive.config.closePopoverOnClickAnywhere) {
                    return;
                }
                // if no popovers are open, don't bother trying to close them
                // finding noclose parents is costly, performance-wise
                if (numOpenPopovers < 1) {
                    return;
                }

                if (popoverObj.findTriggerParent(e.target)) {
                    return;
                }

                var noCloseInstance = popoverObj.findNoCloseInstance(e.target);
                if (noCloseInstance) {
                    popoverObj.closeAll(noCloseInstance);
                } else {
                    popoverObj.closeAll();
                }
            },
            "keydown": function (e) {
                if (!Olive.config.closePopoverOnEsc) {
                    return;
                }

                // TODO: carrying this over from old ds.app.events.js
                // not sure if we actually want to keep it -TQ
                if (e.which === Olive.KEYS.esc) {
                    popoverObj.closeAll();

                    //refocus on the trigger only if on escape
                    var popover = popoverObj.findAssociatedPopover(e.target);
                    if (popover) {
                        popover.trigger.focus();
                    }
                }
            }
        });

        return;
    };


    popoverObj.initializeDocumentListeners();

    Olive.popover = popoverObj;

    return;

})(window.Olive = window.Olive || {}, jQuery);

/**
 * Olive Accessibility utilities
 */
(function (Olive, $) {

    'use strict';

    var accessibility = {
        settings: {}
    };

    var lastFocusedElements = [];

    accessibility.settings.focusableElements = [
        'a[href]',
        'area[href]',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        'button:not([disabled])',
        'iframe',
        'object',
        'embed',
        '*[tabindex]',
        '*[contenteditable]'
    ];



    /**
     *  getFocusableElements - gets a jQuery object of all the focusable elements within the wrapper
     *  @param {Object} wrapper - jQuery object of the wrapper element
     */
    accessibility.getFocusableElements = function (wrapper) {
        var focusableElementsSelector = accessibility.settings.focusableElements.join(',');
        return wrapper.find(focusableElementsSelector).filter(':visible');
    };



    /**
     *  setAutoFocus - finds the first enabled, visible, tabbable element and sets focus
     *  @param {Object} wrapper - jQuery object of the wrapper element
     */
    accessibility.setAutoFocus = function (wrapper) {
        var focusableElements = accessibility.getFocusableElements(wrapper);
        focusableElements.first().focus();
    };



    /**
     *  trapFocus - traps tab focus to within the wrapper
     *  @param {Object} wrapper - jQuery object of the wrapper element
     *  @param {Boolean} enable - whether to enable this or turn off the keydown event
     */
    accessibility.trapTabFocus = function (wrapper, enable) {

        if (!enable) {
            wrapper.off('.oliveTrapFocus');
            return;
        }

        wrapper.on('keydown.oliveTrapFocus', function (e) {

            if (e.which === Olive.KEYS.tab) {

                // get the focusable elements every time in case something new had become visible
                var focusableElements = accessibility.getFocusableElements(wrapper),
                    first = focusableElements.first(),
                    last = focusableElements.last();

                if (e.shiftKey) {

                    if (first.is(e.target)) {
                        e.stopPropagation();
                        e.preventDefault();
                        last.focus();
                    }

                } else {

                    if (last.is(e.target)) {
                        e.stopPropagation();
                        e.preventDefault();
                        first.focus();
                    }

                }

            }
        });

    };



    /**
     *  saveLastFocusedElement - save the last focused element. To be used later when the child closes.
     */
    accessibility.saveLastFocusedElement = function () {
        //TODO: firefox is returning the BODY tag for document.activeElement :(
        var lastFocusedElement = document.activeElement;
        lastFocusedElements.push(lastFocusedElement);
    };



    /**
     *  restoreLastFocusedElement - restores focus to the last element that had focus before the child opened
     */
    accessibility.restoreLastFocusedElement = function () {

        if (lastFocusedElements.length === 0) {
            return;
        }

        var lastFocusedElement = lastFocusedElements.pop();
        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
    };



    /**
     *  toggleAriaHiddenOnMain - sets the aria-hidden attribute on the main content
                                that does not house the wrapper element, so screen readers
                                don't accidentally read anything.
     *  @param {Boolean} enable - whether to enable this or turn off the keydown event
     *
     *  TODO: this is not working properly. Still needs to be fixed for Firefox.
     */
    accessibility.toggleAriaHiddenOnMain = function (enable) {

        function getMainContent(element) {
            var main = element;
            while (main && main.parentElement !== document.body) {
                main = main.parentElement;
            }
            return main;
        }

        var lastFocusedElement = lastFocusedElements[lastFocusedElements.length - 1];

        var main = getMainContent(lastFocusedElement);

        if (main && main !== document.body) {
            main.setAttribute('aria-hidden', enable);
        }

    };

    Olive.accessibility = accessibility;

    return;

}(window.Olive = window.Olive || {}, window.jQuery));

/**
 * Olive Accordion utility
 *
 * The accordion is a helper utility that works with a drawer. The "accordion"
 * element acts as the drawer's trigger. An accordion will not initialize if 
 * its associated drawer is invalid.
 */

(function(Olive, $, undefined) {

    'use strict';

    var accordionObj = {};

    accordionObj.cssClasses = {
        "openState" : "open",
        "closedState" : "closed"
    };

    // attribute sets: supports backwards compatibility
    accordionObj.attributeList = {
        "olive-accordion": {
            "drawer":"olive-accordion",
            "initialized":"olive-accordion-initialized",
            "deprecated": false
        }
    };

    accordionObj.instances = {};

    /**
     * Olive.accordion.initialize - initializes a single accordion
     * @triggerElement {HTML element or jQuery object} the trigger element for this accordion
     */
    accordionObj.initialize = function(triggerElement) {

        var
            instance = {};

        instance.trigger = $(triggerElement);
        instance.options = {};

        // determine if we are using the current attribute set or a legacy set
        instance.options.attrSet = Olive.util.determineAttributeSet(instance.trigger, accordionObj.attributeList);
    
        // exit early if the correct attribute is not available
        if (!instance.options.attrSet) {
            return false;
        }
        
        // exit early if the correct attribute set is not available, or if the element has already been initialized
        if (!instance.options.attrSet) {
            return false;
        } else if (instance.trigger.attr(instance.options.attrSet.initialized)) {
            return false;
        }

        instance.accordionName = instance.trigger.attr(instance.options.attrSet["drawer"]);

        // get the associated drawer instance
        if (Object.keys(Olive.drawer.instances).indexOf(instance.accordionName) == -1) {

            instance.drawer = null;
            var newDrawer;

            for (var attrSet in Olive.drawer.defaults.attributeList) {
                newDrawer = $('[' + attrSet + '=' + instance.accordionName +']');
                if (newDrawer.length) {
                    instance.drawer = Olive.drawer.initialize(newDrawer);
                    break;
                }
            }
            if (!instance.drawer) {
                return false;
            }
        } else {
            instance.drawer = Olive.drawer.instances[instance.accordionName];
        }

        /**
         * instance.setOpen - sets the state of the accordion to its open state
         */
        instance.setOpen = function() {
            instance.trigger.removeClass(accordionObj.cssClasses.closedState).addClass(accordionObj.cssClasses.openState);
            return instance;
        };

        /**
         * instance.setClosed - sets just the accordion to its closed state
         */
        instance.setClosed = function() {
            instance.trigger.removeClass(accordionObj.cssClasses.openState).addClass(accordionObj.cssClasses.closedState);
            return instance;
        };

        /**
         * instance.reconcile - sets the state of the accordion to match its drawer
         */
        instance.reconcile = function() {
            if (instance.drawer.currentState == Olive.drawer.states.closed) {
                instance.setClosed();
            } else {
                instance.setOpen();
            }
            return instance;
        };

        /**
         * instance.toggle - toggles the open/closed state of the accordion and its drawer
         */
        instance.toggle = function() {

            if (instance.drawer.isCurrentlyMoving) {
                return;
            }

            if (instance.drawer.currentState == Olive.drawer.states.closed) {
                instance.drawer.show();
                instance.setOpen();
            } else {
                instance.drawer.hide();
                instance.setClosed();
            }

            return instance;
        };

        /**
         * instance.destroy - removes the accordion instance from memory
         *     - destroys the drawer, if it exists
         *     - removes trigger's initialized state and listener
         *     - removes the accordion object from JS memory
         */
            instance.destroy = function() {

                if (instance.drawer) {
                    instance.drawer.destroy();
                }

                if (instance.trigger && instance.trigger.length) {
                    instance.trigger.off({
                        "click": instance.toggle
                    });
                    instance.trigger.removeAttr(instance.options.attrSet["initialized"]);
                }

                delete accordionObj.instances[instance.accordionName];

            return;
        };

        instance.trigger.on({
            "click": instance.toggle
        });

        instance.reconcile();

        accordionObj.instances[instance.accordionName] = instance;

        // set an "initialized" attribute to prevent re-initialization
        instance.trigger.attr(instance.options.attrSet.initialized, true);

        return instance;
    };

    /** 
     * Olive.accordion.initializeAll - auto-initializes all uninitialized accordions on the page
     */
    accordionObj.initializeAll = function() {

        for (var attrSet in accordionObj.attributeList) {
            $('[' + attrSet + ']').each(function() {
                if (!($(this).attr(accordionObj.attributeList[attrSet].initialized))) {
                    accordionObj.initialize(this);
                }
            });
        };

        return;
    };

    window.Olive.accordion = accordionObj;

    return;

})(window.Olive = window.Olive || {}, jQuery);

Olive.init.add(Olive.accordion.initializeAll);

/**
 * Olive Animation helpers
 */

(function (Olive, $) {

    'use strict';
    var
        animObj = {};

    // transition models: allows for heavy objects, light objects,
    // or differences between appearing and disappearing
    animObj.transitionModels = {
        "default": {
            "enter": {
                "pixelsPerSecond": 1000,
                "fadeTime": 200,
                "algorithm": "swing"
            },
            "exit": {
                "pixelsPerSecond": 1000,
                "fadeTime": 100,
                "algorithm": "swing"
            }
        },
        "fade": {
            "enter": {
                "pixelsPerSecond": 200,
                "fadeTime": 250,
                "algorithm": "swing"
            },
            "exit": {
                "pixelsPerSecond": 200,
                "fadeTime": 250,
                "algorithm": "swing"
            }
        }
    };


    /**
     * Olive.animation.getTransitionModel - returns the specified transition model
     *     returns the default model if the specified model does not exist
     * @param {string} transitionModelName - the transition model requested
     */
    animObj.getTransitionModel = function (transitionModelName, direction) {

        var
            requestedName,
            requestedDirection,
            transitionModel,
            validDirections = ['enter', 'exit'];

        if (typeof transitionModelName !== "string") {
            requestedName = "default";
        } else if (Object.keys(animObj.transitionModels).indexOf(transitionModelName) === -1) {
            requestedName = "default";
        } else {
            requestedName = transitionModelName;
        }

        if (typeof direction !== "string") {
            requestedDirection = "enter";
        } else if (validDirections.indexOf(direction) === -1) {
            requestedDirection = "enter";
        } else {
            requestedDirection = direction;
        }

        return animObj.transitionModels[requestedName][requestedDirection];
    };


    /**
     * Olive.animation.getAnimation - finds how much time a given animation
     *     should take, given that it will use the corresponding animation model, above
     * @param {number} distance - the distance in pixels
     * @param {string} transitionModelName - the transition model to be used
     * @param {string} direction - enter or exit, because often exit speeds are faster
     */
    animObj.getAnimation = function (distance, transitionModelName, direction) {

        var
            animation = {},
            pps,
            transitionModel = animObj.getTransitionModel(transitionModelName, direction);

        pps = transitionModel.pixelsPerSecond;

        animation['duration'] = parseInt((distance / pps) * 1000);
        animation['timingFunction'] = transitionModel.algorithm;

        return animation;
    };


    /**
     * Olive.animation.getEnter - helper wrapper for getAnimation, used for elements
     *     that are entering the screen
     * @param {number} distance - the distance in pixels
     * @param {string} transitionModelName - the transition model to be used
     */
    animObj.getEnter = function (distance, transitionModelName) {
        return animObj.getAnimation(distance, transitionModelName, "enter");
    };


    /**
     * Olive.animation.getExit - helper wrapper for getAnimation, used for elements
     *     that are leaving the screen
     * @param {number} distance - the distance in pixels
     * @param {string} transitionModelName - the transition model to be used
     */
    animObj.getExit = function (distance, transitionModelName) {
        return animObj.getAnimation(distance, transitionModelName, "exit");
    };


    /**
     * Olive.animation.getFadeIn - returns the fade in time and algorithm for a
     *     given transition model
     * @param {number} distance - the distance in pixels
     * @param {string} transitionModelName - the transition model to be used
     */
    animObj.getFadeIn = function (transitionModelName) {
        var transitionModel = animObj.getTransitionModel(transitionModelName, "enter");
        return {
            'duration': transitionModel.fadeTime,
            'timingFunction': transitionModel.algorithm
        };
    };


    /**
     * Olive.animation.getFadeOut - returns the fade out time and algorithm for a
     *     given transition model
     * @param {number} distance - the distance in pixels
     * @param {string} transitionModelName - the transition model to be used
     */
    animObj.getFadeOut = function (transitionModelName) {
        var transitionModel = animObj.getTransitionModel(transitionModelName, "exit");
        return {
            'duration': transitionModel.fadeTime,
            'timingFunction': transitionModel.algorithm
        };
    };


    /**
     * Olive.animation.start - animates CSS on a set of elements
     *     1.) calculates parameters based on transitionModel
     *     2.) sets initCss, if provided
     *     3.) animates to targetCss
     *     4.) cleans up, sets finalClass and finalCss, if provided
     * @param {HTML element or jQuery object} - the elements to animate
     * @param {object} options - key value pairs to configure the animation
     *     initCss - css object to initialize parameters before animation
     *     targetCss - css object to transition to
     *     finalCss - css object to jump to after animation
     *     removeCss - Boolean: remove animated css parameters after animation finishes
     *     distance - Number: distance, in pixels, that the animated element will move
     *     transitionModel - String: the animation model to use
     *     direction - String: whether to use the enter or exit version of the
     *         transitionModel
     *     finalClass - String: classname to add or remove after the animation finishes
     *     finalFunction - Function: executes after animation finishes
     *
     *  @returns {jQuery promise}
     */
    animObj.start = function (element, options) {

        var
            jqEle = $(element),
            direction = options.direction || 'enter',
            animParams,
            animFunctions = {
                'enter': animObj.getEnter,
                'exit': animObj.getExit
            },
            fadeFunctions = {
                'enter': animObj.getFadeIn,
                'exit': animObj.getFadeOut
            },
            distance,
            transitionModel = options.transitionModel || "default";

        if (options.distance == undefined) {
            distance = null;
        } else {
            distance = parseFloat(options.distance);
        }


        // choose between distance-based or fade-based calculation
        if (distance) {
            animParams = animFunctions[direction](distance, transitionModel);
        } else {
            animParams = fadeFunctions[direction](transitionModel);
        }

        // if given, initialize with initCss
        if (options.initCss != undefined) {
            jqEle.css(options.initCss);
        }

        if ((options.prepFunction != undefined) && (typeof options.prepFunction == "function")) {
            options.prepFunction();
        }

        // finally, animate the transition to the targetCss
        var animate = jqEle.animate(
            options.targetCss,
            animParams.duration,
            animParams.timingFunction,
            function () {
                var resetObj = {};

                // add or remove the finalClass if provided
                if ((direction == "enter") && (options.finalClass != undefined)) {
                    jqEle.addClass(options.finalClass);
                } else if ((direction == "exit") && (options.finalClass !== undefined)) {
                    jqEle.removeClass(options.finalClass);
                }
                // if given, set final css attributes after transition
                if (options.finalCss) {
                    jqEle.css(options.finalCss);
                }
                // if specified, remove all of the animated css attributes
                if (options.removeCss) {
                    var key;
                    for (key in options.targetCss) {
                        resetObj[key] = '';
                    }
                    jqEle.css(resetObj);
                }
                // if a final function was given, run it
                if (options.finalFunction) {
                    options.finalFunction();
                }
            }
        );

        return animate.promise();
    };


    window.Olive.animation = animObj;

    return;

}(window.Olive = window.Olive || {}, window.jQuery));

/**
 * Olive Cheshire element
 */

(function (Olive, $, undefined) {

    'use strict';
    
    var obj = {
        instances: {},
        name: 'cheshire'
    };

    // add the instances object to the global popover reference for instance types
    Olive.popover.popoverInstanceGroups['cheshire'] = obj.instances;

    // attribute sets: supports backwards compatibility
    obj.attributeList = {
        'olive-cheshire': {
            'cheshire': 'olive-cheshire',
            'popoverName': 'olive-cheshire',
            'trigger': 'olive-cheshire-trigger',
            'placeholder': 'olive-cheshire-placeholder',
            'visibleSection': 'olive-cheshire-visible',
            'close': 'olive-cheshire-close',
            'events':'olive-cheshire-events',
            'noclose':'olive-cheshire-noclose',
            'childTo':'olive-child-to',
            'delay':'olive-cheshire-delay',
            'fade':'olive-cheshire-fade',
            'animationModel':'olive-cheshire-animation-model',
            'initialized': 'olive-cheshire-initialized',
            'contentFor':'olive-cheshire-content-for',
            'deprecated':false
        }
    };
    
    /**
     * @defaults
     */
    obj.defaults = {
        cssClasses: {
            'contentHidden':'cheshire-off',
            'activeTrigger':'cheshire_trigger-active',
            'activeVisible':'cheshire_visible-active',
            'placeholder':'cheshire_placeholder'
        },
        attributes: obj.attributeList['olive-cheshire']
    };

    Olive.popover.cssClasses['cheshire'] = obj.defaults.cssClasses;

    /**
     * Olive.cheshire.init: wrapper function that initializes the cheshire panel
     *     as a popover, then adds cheshire-specific functionality
     * @param {HTML element or jQuery object} element - the cheshire panel element
     */
    obj.init = function (element) {
        
        // create a new instance of the cheshire object
        var instance = {
            content: $(element),
            settings: $.extend({}, obj.defaults)
        };

        // determine if we are using the current attribute set or a legacy set
        instance.attrSet = Olive.util.determineAttributeSet(instance.content, obj.attributeList);
        
        // exit early if the correct attribute is not available, or if the element has already been initialized
        if (!instance.attrSet) {
            return false;
        } else if (instance.content.attr(instance.attrSet.initialized)) {
            return false;
        }
        
        instance.popoverName = instance.content.attr(obj.defaults.attributes.cheshire);
        instance.trigger = $("[" + instance.attrSet.trigger + "='" + instance.popoverName + "']");
        instance.visibleSection = $("[" + instance.attrSet.visibleSection + "='" + instance.popoverName + "']").eq(0);

        // hide cheshire by default
        instance.content.addClass(instance.settings.cssClasses.contentHidden);

        // initialize this as a popover
        instance = obj.initializePopover(instance);

        // clicks on panel or its visible section don't close the cheshire
        instance.visibleSection.attr(instance.attrSet.noclose, instance.popoverName);
        instance.content.attr(instance.attrSet.noclose, instance.popoverName);

        // extend popover open function to add a class on the visible section(s)
        //     and remove the class again after the popover closes
        var 
            openFunc = instance.open,
            afterCloseFunc = instance.afterClose;

        instance.open = function() {
            instance.visibleSection.addClass(instance.settings.cssClasses['activeVisible']);
            openFunc();
            return instance;
        };

        instance.afterClose = function() {
            afterCloseFunc();
            instance.visibleSection.removeClass(instance.settings.cssClasses['activeVisible']);
            return instance;
        };

        /**
         * instance.reposition: positions the cheshire panel so that it appears correctly
         *     relative to the visible content section. uses a placeholder to mimic the
         *     size and placement of the visible content
         */
        instance.reposition = function() {

            var
                placeholder,
                visibleWidth,
                visibleHeight,
                visibleOffset,
                placeholderOffset,
                containerPosition,
                differenceTop,
                differenceLeft,
                targetTop,
                targetLeft;

            if (!(instance.placeholder)) {
                if (instance.content.find("[" + instance.attrSet['placeholder'] + "]").length) {
                    instance.placeholder = instance.content.find("[" + instance.attrSet['placeholder'] + "]").eq(0);
                    instance.placeholder.addClass(instance.settings.cssClasses['placeholder']);
                } else {
                    placeholder = document.createElement('div');
                    placeholder.className = Olive.popover.cssClasses.cheshire.placeholder;
                    instance.content.prepend(placeholder);
                    instance.placeholder = $(placeholder);
                    instance.placeholder.attr(instance.attrSet['placeholder'], "");
                }
            }

            // find the height and width of the visible section
            visibleWidth = instance.visibleSection.outerWidth();
            visibleHeight = instance.visibleSection.outerHeight();

            // resize the placeholder to be the same size as the visible section
            instance.placeholder.css({
                'width': visibleWidth,
                'height': visibleHeight
            });

            // calculate the difference between the placeholder and the visible section,
            //     then adjust the position of the cheshire panel
            visibleOffset = instance.visibleSection.offset();
            placeholderOffset = instance.placeholder.offset();
            containerPosition = instance.content.position();

            differenceTop = placeholderOffset.top - visibleOffset.top;
            differenceLeft = placeholderOffset.left - visibleOffset.left;

            targetTop = containerPosition.top - differenceTop;
            targetLeft = containerPosition.left - differenceLeft;

            instance.content.css({
                'top': targetTop,
                'left': targetLeft
            });
            
            return instance;
        };

        //add listener for elements with the close attribute
        instance.content.on('click', '[' + instance.attrSet.close + ']', instance.close);

        // almost there... set the initialized attribute to prevent re-initialization
        instance.content.attr(obj.defaults.attributes.initialized, true);
        
        // ...and add this instance to the cheshire object
        obj.instances[instance.popoverName] = instance;

        return instance;
    };

    /**
     * Olive.cheshire.initializePopover: popover is the superclass for cheshires, so we
     *     add that functionality once the trigger and content have been identified
     * @param {object} instance - the instance as it exists so far
     */
    obj.initializePopover = function(instance) {
        var
            newInstance,
            defaultDelay,
            configObject = {};

        configObject['trigger'] = instance.trigger;
        configObject['contentId'] = instance.content.attr('id') || 'cheshire';
        configObject['popoverType'] = "cheshire";
        configObject['location'] = "";
        configObject['events'] = instance.content.attr(instance.attrSet.events) || "click";
        configObject.fade = (instance.trigger.attr(instance.attrSet.fade) == "false") ? false : true;
        configObject['tip'] = 0;
        configObject['positionTo'] = instance.trigger;
        configObject.delay = instance.content.attr(instance.attrSet.delay) || 0;

        newInstance = Olive.popover.initialize(instance, configObject);
        return newInstance;
    };

    obj.initAll = function () {
        
        for (var attrSetName in obj.attributeList) {
            var attrSet = obj.attributeList[attrSetName];
            $('[' + attrSet.cheshire + ']').each(function (i, v) {
                if (!($(this).attr(attrSet.initialized))) {
                    obj.init(this);
                }
            });
        };

        return;
    };
    
    window.Olive.cheshire = obj;

    return;

})(window.Olive = window.Olive || {}, jQuery);

Olive.init.add(Olive.cheshire.initAll);

/**
 * Olive Dev utilities
 * these methods are not available in production environments
 */

(function (Olive, $) {

    'use strict';

    var devObj = {};



    /**
     * Olive.dev.logEvent()
     *
     * @param {jQuery object} el
     * @param {string} eventName
     */
    devObj.logEvent = function (el, eventName) {

        el.on(eventName, function (e, data) {

            var oLog = {
                'date': new Date(e.timeStamp).toLocaleString(),
                'name': e.type + '.' + e.namespace,
                'data': data
            };

            devObj.log(oLog);
        });
    };



    /**
     * Olive.dev.log()
     * @param {string, object} message
     */
    devObj.log = function (message) {
        if (Olive.config.debug && window.console) {
            window.console.log(message);
        }
    };

    window.Olive.dev = devObj;

    return;

}(window.Olive = window.Olive || {}, window.jQuery));

/**
 * Olive Drag and Drop utility
 */

(function(Olive, $, undefined) {

    var dragObj = {};

    dragObj.cssClasses = {
        "draggable": "draggable",
        "currentlyDragging" : "dragging"
    };

    dragObj.instances = {};
    dragObj.attrList = {
        'olive-draggable': {
            'draggable':'olive-draggable',
            'droptarget':'olive-drop-target',
            'initialized':'olive-drag-initialized'
        }
    };

    dragObj.currentlyDragging = false;
    dragObj.currentTarget = null;

    /**
     * Olive.dragdrop.initialize: initializes dragging behavior for a single element
     * @dragElement {HTML element or jQuery object} the ul.tabs for this tabset
     */
    dragObj.initialize = function(dragElement) {

        var
            instance = {};

        instance.element = $(dragElement);
        instance.attrSet = dragObj.attrList['olive-draggable'];
        instance.initialMousedownEvent = null;
        instance.dragThreshold = 10;
        instance.previousMousePosition = {
            'x': 0,
            'y': 0
        };

        // exit early if the correct attribute is not available
        if (!(instance.element[0].hasAttribute(instance.attrSet.draggable))) {
            return false;
        }

        instance.considerBeginningDrag = function(event) {
            instance.initialMousedownEvent = event;
            $('body').on({
                'mousemove':instance.evaluateDragDistance,
                'mouseup':instance.clearEvaluateOnMove                
            });

            return instance;
        };

        instance.evaluateDragDistance = function(event) {
            var
                firstX = instance.initialMousedownEvent.pageX,
                firstY = instance.initialMousedownEvent.pageY,
                thisX = event.pageX,
                thisY = event.pageY,
                dragDistance;

            dragDistance = Math.sqrt(Math.pow((firstX - thisX), 2) + Math.pow((firstY - thisY), 2));
            if (dragDistance > instance.dragThreshold) {
                instance.clearEvaluateOnMove();
                instance.beginDrag(instance.initialMousedownEvent);
            }

            return instance;
        };

        instance.clearEvaluateOnMove = function() {
            $('body').off({
                'mousemove':instance.evaluateDragDistance,
                'mouseup':instance.clearEvaluateOnMove
            });
        };

        instance.beginDrag = function(event) {

            event.preventDefault();

            dragObj.currentlyDragging = instance;

            instance.previousMousePosition.x = event.pageX;
            instance.previousMousePosition.y = event.pageY;

            instance.element.addClass(dragObj.cssClasses.currentlyDragging);

            $('body').on({
                'mousemove': instance.reposition,
                'mouseup': instance.endDrag
            });

            return instance;
        };

        instance.endDrag = function() {
            $('body').off({
                'mousemove': instance.reposition,
                'mouseup': instance.endDrag
            });

            instance.element.removeClass(dragObj.cssClasses.currentlyDragging);
            dragObj.currentTarget.onDrop();

            instance.afterDrag();

            return instance;
        };
        
        instance.afterDrag = function() {
            dragObj.currentlyDragging = false;
            return instance;
        };

        instance.calibratePosition = function() {
            var
                parentPosition = instance.element.position();

            instance.element.css({
                'position': 'absolute',
                'top': parentPosition.top,
                'left': parentPosition.left
            });

            return instance;
        };

        instance.reposition = function(event) {
            var
                newCssX,
                newCssY,
                eventX = event.pageX,
                eventY = event.pageY,
                pagePosition = instance.element.offset(),
                parentPosition = instance.element.position(),
                scrollX = instance.element.offsetParent().scrollLeft(),
                scrollY = instance.element.offsetParent().scrollTop(),
                mouseOffsetX = instance.previousMousePosition.x - pagePosition.left,
                mouseOffsetY = instance.previousMousePosition.y - pagePosition.top;

            event.preventDefault();

            newCssX = eventX - (pagePosition.left - parentPosition.left) - mouseOffsetX + scrollX;
            newCssY = eventY - (pagePosition.top - parentPosition.top) - mouseOffsetY + scrollY;

            instance.element.css({
                'top': newCssY,
                'left': newCssX
            });

            instance.previousMousePosition.x = event.pageX;
            instance.previousMousePosition.y = event.pageY;
            return instance;
        };

        instance.element.on({
            'mousedown':instance.considerBeginningDrag
        });

        instance.calibratePosition();

        instance.element.attr(instance.attrSet.initialized, true);

        return instance;
    };

    dragObj.initializeTarget = function(dropTarget) {
        var
            instance = {};

        instance.element = $(dropTarget);
        instance.attrSet = dragObj.attrList['olive-draggable'];

        instance.onDrop = function() {
            if (dragObj.currentlyDragging) {
                var
                    childOffset = dragObj.currentlyDragging.element.offset(),
                    newParentOffset = instance.element.offset(),
                    scrollX = instance.element.scrollLeft(),
                    scrollY = instance.element.scrollTop();

                dragObj.currentlyDragging.element.css({
                    'top': childOffset.top - newParentOffset.top + scrollY,
                    'left': childOffset.left - newParentOffset.left + scrollX
                });
                instance.element.append(dragObj.currentlyDragging.element);
            }
            return instance;
        };

        // temporary hack
        dragObj.currentTarget = instance;

        instance.element.attr(instance.attrSet.initialized, true);

        return instance;
    };

    /** 
     * Olive.dragdrop.initializeAll: auto-initializes all draggable elements on the page
     */
    dragObj.initializeAll = function() {

        $('[olive-draggable]').each(function() {
            if (!($(this).attr('olive-drag-initialized'))) {
                dragObj.initialize(this);
            }
        });

        $('[olive-drop-target]').each(function() {
            if (!($(this).attr('olive-drag-initialized'))) {
                dragObj.initializeTarget(this);
            }
        });

        return;
    };

    window.Olive.dragdrop = dragObj;

    return;

})(window.Olive = window.Olive || {}, jQuery);

Olive.init.add(Olive.dragdrop.initializeAll);

/**
 * Olive Drawer utility
 *
 * utility for an animated drawer that can open to various states.
 *     valid target states are: "full", "content", "summary", and "closed"
 *
 * instance.show(targetState); // call this function to show the drawer at the target state
 *   - instance.moveToState(); // does calculations then animates transition to target state
 *       - instance.calculateCurrentSize(); // calculates the current size of the drawer (used for animation)
 *       - instance.calculateTargetSize(); // temporarily jumps drawer to target state to calculate new size, then sets it back
 *       - Olive.animation.getEnter(); // calculates animation duration and easing function
 *       - instance.initiateMovement(); // pre-animation, includes setting a flag to block other animation request and CSS positioning
 *       - jQuery.animate(); // animates the transition
 *           - instance.finishMovement(); // unsets the animation-blocking flag and CSS positioning
 *               - instance.jumpToState(); // jumps to the requested state without animation, to reconcile
 *
 * if animation has been disabled via the noAnimation attribute:
 *
 *  instance.show(targetState);
 *    - instance.jumpToState(); jumps to the requested state without animation
 */

(function(Olive, $, undefined) {

    'use strict';

    var
        drawerObj = {},
        orientationDimensions = {
            "left" : "width",
            "right" : "width",
            "down" : "height",
            "up" : "height"
        };

    drawerObj.cssClasses = {
        "drawerOpen" : "open",
        "drawerMoving" : "moving",
        "visible" : "showing"
    };

    drawerObj.states = {
        'closed':'closed',   // completely closed
        'full':'full',       // show everything in the drawer
        'content':'content', // only show the content no summary
        'summary':'summary'  // only show the summary
    };

    drawerObj.defaults = {
        'animationModel':'default',
        'allowAnimation':true
    };

    // attribute sets: supports backwards compatibility
    drawerObj.defaults.attributeList = {
        "olive-drawer-name": {
            "name":"olive-drawer-name",
            "direction":"olive-drawer-direction",
            "noAnimation":"olive-no-animation",
            "animationModel":"olive-animation-model",
            "content":"olive-drawer-content",
            "summary":"olive-drawer-summary",
            "firstState":"olive-drawer-initial-state",
            "initialized":"olive-drawer-initialized",
            "deprecated": false
        }
    };

    drawerObj.eventNames = {
        activate: 'activate.drawer'
    };

    drawerObj.instances = {};

    /**
     * Olive.drawer.initialize: initializes sliding behavior for a single drawer
     * @param {HTML element or jQuery object} drawerElement - the drawer container div for this drawer
     */
    drawerObj.initialize = function(drawerElement) {

        var
            instance = {};

        instance.element = $(drawerElement).eq(0);
        instance.options = {};

        // determine if we are using the current attribute set or a legacy set
        instance.options.attrSet = Olive.util.determineAttributeSet(instance.element, drawerObj.defaults.attributeList);

        // exit early if the correct attribute is not available
        if (!instance.options.attrSet) {
            return false;
        } else if (instance.element.attr(instance.options.attrSet["initialized"])) {
            return false;
        }



        instance.drawerName = instance.element.attr(instance.options.attrSet["name"]);
        instance.direction = instance.element.attr(instance.options.attrSet["direction"]).toLowerCase();
        instance.dimension = orientationDimensions[instance.direction];
        instance.contentBox = instance.element.find('[' + instance.options.attrSet["content"] + ']');
        instance.summaryBox = instance.element.find('[' + instance.options.attrSet["summary"] + ']');
        instance.hasSummary = Boolean(instance.summaryBox.length);
        instance.isCurrentlyMoving = false;
        instance.currentSize = 0;
        instance.targetSize = 0;
        instance.currentState = instance.element.attr(instance.options.attrSet["firstState"]) || drawerObj.states['closed'];
        instance.allBoxes = instance.contentBox.add(instance.summaryBox);

        // this could probably be done more simply -TQ
        instance.options.animationModel = instance.element.attr(instance.options.attrSet["animationModel"]) || drawerObj.defaults.animationModel;
        instance.options.allowAnimation = !(Boolean(instance.element.filter('[' + instance.options.attrSet["noAnimation"] + ']').length));

        instance.targetStates = {
            "full": [instance.summaryBox, instance.contentBox],
            "summary": [instance.summaryBox],
            "content": [instance.contentBox],
            "closed": []
        };

        drawerObj.instances[instance.drawerName] = instance;


        /**
         * instance.show - shows the requested state of the drawer. uses animation unless
         *     instance.options.allowAnimation is false.
         * @param {string} targetString - the requested state. Defaults to "full". Possible values
         *     "full", "content", "summary", "closed"
         */
        instance.show = function(targetString) {

            var
                targetState = targetString || drawerObj.states['full'];

            targetState = targetState.toLowerCase();

            if (instance.options.allowAnimation) {
                instance.moveToState(targetState);
            } else {
                instance.jumpToState(targetState);
            }
            return instance;
        };


        /**
         * instance.close - identical to instance.show('closed'); closes the drawer.
         */
        instance.hide = function() {
            if (instance.options.allowAnimation) {
                instance.moveToState(drawerObj.states['closed']);
            } else {
                instance.jumpToState(drawerObj.states['closed']);
            }
            return instance;
        };


        /**
         * instance.calculateCurrentSize - calculates the current size and sets instance.currentSize;
         *     needed as a starting point for animation.
         */
        instance.calculateCurrentSize = function() {
            if (instance.dimension == "height") {
                instance.currentSize = instance.element.outerHeight();
            } else {
                instance.currentSize = instance.element.outerWidth();
            }

            return instance;
        };

        /**
         * instance.calculateTargetSize - determines the drawer's size in a requested new state
         *     by temporarily setting that state and then measuring the drawer. necessary
         *     because many drawers have dynamic content of variable size
         * @param {string} targetState - the requested state: "full", "content", "summary", "closed"
         */
        instance.calculateTargetSize = function(targetState) {

            if (Object.keys(instance.targetStates).indexOf(targetState) == -1) {
                targetState = drawerObj.states['closed'];
            }

            if (targetState == drawerObj.states['closed']) {
                instance.targetSize = 0;
                return instance;
            }

            // first, temporarily jump to the desired state
            instance.jumpToState(targetState, true);

            // next, calculate the size of this thing
            if (instance.dimension == "height") {
                instance.targetSize = instance.element.outerHeight();
            } else {
                instance.targetSize = instance.element.outerWidth();
            }

            // now, go back to the current state
            instance.element.removeClass(targetState);
            instance.jumpToState(instance.currentState, true);

            return instance;
        };

        /**
         * instance.initiateMovement - sets a flag to block other attempts at animation
         *     then prepares the drawer for animation
         * @param {string} targetState - the requested state: "full", "content", "summary", "closed"
         */
        instance.initiateMovement = function(targetState) {
            instance.isCurrentlyMoving = true;
            instance.element.css(instance.dimension, instance.currentSize).addClass(drawerObj.cssClasses["drawerMoving"]);

            if (instance.targetSize > instance.currentSize) {
                instance.revealStateBoxes(targetState);
            }

            return instance;
        };

        /**
         * instance.finishMovement - removes the flag that blocks other attempts at animation
         *     then calls instance.jumpToState to ensure correct layout behaviors
         * @param {string} targetState - the requested state: "full", "content", "summary", "closed"
         */
        instance.finishMovement = function(targetState) {
            var
                correctSize = (targetState == drawerObj.states['closed']) ? 0 : "auto";

            instance.isCurrentlyMoving = false;
            instance.element.css(instance.dimension, correctSize).removeClass(drawerObj.cssClasses["drawerMoving"]);
            instance.jumpToState(targetState);
            return instance;
        };

        /**
         * instance.moveToState - animates the drawer's transition to the requested state
         * @param {string} targetState - the requested state: "full", "content", "summary", "closed"
         */
        instance.moveToState = function(targetState) {

            if (instance.isCurrentlyMoving) {
                return instance;
            } else if (targetState == instance.currentState) {
                return instance;
            }

            var
                cssObj,
                distance,
                movementParams;

            targetState = targetState.toLowerCase();

            instance.calculateCurrentSize();
            instance.calculateTargetSize(targetState);
            distance = Math.abs(instance.targetSize - instance.currentSize);
            cssObj = (instance.dimension == "height") ? {"height" : instance.targetSize} : {"width" : instance.targetSize};

            if (targetState == drawerObj.states['closed']) {
                movementParams = Olive.animation.getExit(distance, instance.options.animationModel);
            } else {
                movementParams = Olive.animation.getEnter(distance, instance.options.animationModel);
            }

            instance.initiateMovement(targetState);
            instance.element.animate(cssObj,
                movementParams.duration,
                movementParams.timingFunction,
                function(){
                    instance.finishMovement(targetState);
                }
            );

            return instance;
        };

        /**
         * instance.revealStateBoxes - shows and hides the content and summary boxes as
         *     appropriate for the requested state
         * @param {string} targetState - the requested state: "full", "content", "summary", "closed"
         */
        instance.revealStateBoxes = function(targetState) {

            var i,
                boxSet;

            if (Object.keys(instance.targetStates).indexOf(targetState) == -1) {
                targetState = drawerObj.states['closed'];
            }

            boxSet = instance.targetStates[targetState];
            instance.allBoxes.removeClass(drawerObj.cssClasses.visible);

            if (!(targetState == drawerObj.states['closed'])) {
                for (i=0; i<boxSet.length; i++) {
                    boxSet[i].addClass(drawerObj.cssClasses.visible);
                }
            }

            return instance;
        };

        /**
         * instance.jumpToState - puts the drawer in the requested state immediately
         *     without animation
         * @param {string} targetState - the requested state: "full", "content", "summary", "closed"
         * @param {Boolean} isTemporary - indicates that this is a temporary state, used when
         *     measuring the drawer's size in a target state before beginning animation
         */
        instance.jumpToState = function(targetState, isTemporary) {

            var
                permanent = !(Boolean(isTemporary)),
                correctSize;

            targetState = targetState.toLowerCase();

            correctSize = (targetState == drawerObj.states['closed']) ? 0 : "auto";
            instance.element.css(instance.dimension, correctSize);

            instance.revealStateBoxes(targetState);

            instance.element.removeClass(instance.currentState).addClass(targetState);

            if (targetState == drawerObj.states['closed']) {
                instance.element.removeClass(drawerObj.cssClasses.drawerOpen);
            } else {
                instance.element.addClass(drawerObj.cssClasses.drawerOpen);
            }

            if (permanent) {
                instance.currentState = targetState;
                $(window).trigger(drawerObj.eventNames.activate, {
                    'drawer' : instance.drawerName,
                    'state'  : targetState
                });
                instance.afterFinish(targetState);
            }

            return instance;
        };

        /**
         * instance.afterFinish - designed to be overridden for individual instances,
         *     this function is executed after the drawer arrives in a permanent state
         *
         *  @param {string} state - the current state of the drawer,
         *      can be one of the values in drawerObj.states
         */
        instance.afterFinish = function(state) {
            return instance;
        };

        /**
         * instance.destroy - removes the drawer instance from memory
         *     also removes initialized state if appropriate
         */
            instance.destroy = function() {

                if (instance.element && instance.element.length) {
                    instance.element.removeAttr(instance.options.attrSet["initialized"]);
                }

                delete drawerObj.instances[instance.drawerName];

            return;
        };

        // remove empty text nodes that can disrupt with inline-block layout
        if (instance.direction == "left" || instance.direction == "right") {
            Olive.util.removeTextNodes(instance.element.find('.drawer-wrapper'));
        }

        // do some minimal normalization
        instance.element.addClass(instance.direction);
        instance.jumpToState(instance.currentState);

        instance.element.attr(instance.options.attrSet["initialized"], true);

        return instance;
    };

    /**
     * Olive.drawer.initializeAll: auto-initializes all uninitialized drawers on the page
     */
    drawerObj.initializeAll = function() {

        for (var attrSet in drawerObj.defaults.attributeList) {
            $('[' + attrSet + ']').each(function() {
                if (!($(this).attr(drawerObj.defaults.attributeList[attrSet].initialized))) {
                    drawerObj.initialize(this);
                }
            });
        };

        return;
    };

    window.Olive.drawer = drawerObj;

    return;

})(window.Olive = window.Olive || {}, jQuery);

Olive.init.add(Olive.drawer.initializeAll);

(function(Olive, $){
  Events = {

    // Bind an event to a `callback` function. Passing `"all"` will bind
    // the callback to all events fired.
    on: function(name, callback, context) {
      if (!eventsApi(this, 'on', name, [callback, context]) || !callback) return this;
      this._events || (this._events = {});
      var events = this._events[name] || (this._events[name] = []);
      events.push({callback: callback, context: context, ctx: context || this});
      return this;
    },

    // Bind an event to only be triggered a single time. After the first time
    // the callback is invoked, it will be removed.
    once: function(name, callback, context) {
      if (!eventsApi(this, 'once', name, [callback, context]) || !callback) return this;
      var self = this;
      var once = function() {
        self.off(name, once);
        callback.apply(this, arguments);
      };
      once._callback = callback;
      return this.on(name, once, context);
    },

    // Remove one or many callbacks. If `context` is null, removes all
    // callbacks with that function. If `callback` is null, removes all
    // callbacks for the event. If `name` is null, removes all bound
    // callbacks for all events.
    off: function(name, callback, context) {
      var retain, ev, events, names, i, l, j, k;
      if (!this._events || !eventsApi(this, 'off', name, [callback, context])) return this;
      if (!name && !callback && !context) {
        this._events = void 0;
        return this;
      }
      names = name ? [name] : Object.keys(this._events);
      for (i = 0, l = names.length; i < l; i++) {
        name = names[i];
        if (events = this._events[name]) {
          this._events[name] = retain = [];
          if (callback || context) {
            for (j = 0, k = events.length; j < k; j++) {
              ev = events[j];
              if ((callback && callback !== ev.callback && callback !== ev.callback._callback) ||
                  (context && context !== ev.context)) {
                retain.push(ev);
              }
            }
          }
          if (!retain.length) delete this._events[name];
        }
      }

      return this;
    },

    // Trigger one or many events, firing all bound callbacks. Callbacks are
    // passed the same arguments as `trigger` is, apart from the event name
    // (unless you're listening on `"all"`, which will cause your callback to
    // receive the true name of the event as the first argument).
    trigger: function(name) {
      if (!this._events) return this;
      var args = Array.prototype.slice.call(arguments, 1);
      if (!eventsApi(this, 'trigger', name, args)) return this;
      var events = this._events[name];
      var allEvents = this._events.all;
      if (events) triggerEvents(events, args);
      if (allEvents) triggerEvents(allEvents, arguments);
      return this;
    },

    // Tell this object to stop listening to either specific events ... or
    // to every object it's currently listening to.
    stopListening: function(obj, name, callback) {
      var listeningTo = this._listeningTo;
      if (!listeningTo) return this;
      var remove = !name && !callback;
      if (!callback && typeof name === 'object') callback = this;
      if (obj) (listeningTo = {})[obj._listenId] = obj;
      for (var id in listeningTo) {
        obj = listeningTo[id];
        obj.off(name, callback, this);
        if (remove || !Object.keys(obj._events).length) delete this._listeningTo[id];
      }
      return this;
    }

  };

  // Regular expression used to split event strings.
  var eventSplitter = /\s+/;

  // Implement fancy features of the Events API such as multiple event
  // names `"change blur"` and jQuery-style event maps `{change: action}`
  // in terms of the existing API.
  var eventsApi = function(obj, action, name, rest) {
    if (!name) return true;

    // Handle event maps.
    if (typeof name === 'object') {
      for (var key in name) {
        obj[action].apply(obj, [key, name[key]].concat(rest));
      }
      return false;
    }

    // Handle space separated event names.
    if (eventSplitter.test(name)) {
      var names = name.split(eventSplitter);
      for (var i = 0, l = names.length; i < l; i++) {
        obj[action].apply(obj, [names[i]].concat(rest));
      }
      return false;
    }

    return true;
  };

  // A difficult-to-believe, but optimized internal dispatch function for
  // triggering events. Tries to keep the usual cases speedy.
  var triggerEvents = function(events, args) {
    var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
    switch (args.length) {
      case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
      case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
      case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
      case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
      default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args); return;
    }
  };

  var listenMethods = {listenTo: 'on', listenToOnce: 'once'};

  // Inversion-of-control versions of `on` and `once`. Tell *this* object to
  // listen to an event in another object ... keeping track of what it's
  // listening to.
  $.each(listenMethods, function(method, implementation) {
    Events[method] = function(obj, name, callback) {
      var listeningTo = this._listeningTo || (this._listeningTo = {});
      var id = obj._listenId || (obj._listenId = Olive.util.getUniqueId());
      listeningTo[id] = obj;
      if (!callback && typeof name === 'object') callback = this;
      obj[implementation](name, callback, this);
      return this;
    };
  });
  Olive.events = Events;
})(window.Olive = window.Olive || {}, jQuery);


/**
 * Olive Feature Walls component
 *
 * a very light component that honestly depends on other components in order to do the heavy work...
 * don't know if that is a good thing or not...
 *
 */
;(function (Olive, $, win, undefined) {

    'use strict';

    /*
        at no point should I be referring to any global objects that are not already in here...
        calling window or document within a closure... gotta redo all the other ones that do that...
    */
    var CONSTANTS = {
            'featureWallObj': {
                'attributeList': {
                    'olive-feature-wall': {
                        'DOMReferenceId': 'olive-feature-wall',
                        'featureWallType': 'olive-feature-wall-type',
                        'featureWallConditional': 'olive-feature-wall-conditional',
                        'tooltipPosition': 'olive-feature-wall-tooltip-position',
                        'modalSize': 'olive-feature-wall-modal-size',
                        'iconClassname': 'olive-feature-wall-icon-classname',
                        'displayAction': 'olive-feature-wall-display-action',
                        'initialized': 'olive-feature-wall-initialized'
                    }
                }
            },
            'classNames': {
                'btnFloatingIcon': 'btn-floatingIcon',
                'featureWallWrap': 'olive-feature-wall-wrap',
                'iconLockAndIsCallout': 'icon-lock icon-isCallout'
            },
            'click': 'click',
            'tooltip': 'tooltip',
            'modal': 'modal'
        },
        /* 
            So since people don't really ID elements as much as they should, if an element does not have 
            an ID we just use this counter as part of the unique ID of a certain feature wall within
            the DOM
        */
        noIdwrapNum = 0,

        /* 
            Moved these UTILS to be private... no need for it to be on the prototype in my opinion
        */
        UTILS = {
            /*
                this is a utility set that is used within this component...
            */

            /*
                very basic DOM related utilities
            */
            addEvent: function (elementToBind, DOMevent, functionToAdd, useCaptureBool) {

                var UTILS_self = this;

                if (elementToBind.addEventListener) {

                    // either use the nice W3C way
                    UTILS_self.addEvent = function (elementToBind, DOMevent, functionToAdd, useCaptureBool) {

                        return elementToBind.addEventListener(DOMevent, functionToAdd, useCaptureBool);

                    };

                } else {

                    // or go the old school IE way
                    UTILS_self.addEvent = function (elementToBind, DOMevent, functionToAttach) {

                        /* 
                            wow just forgot that old school IE doesnt capture... if this is an issue
                            then we would have to cycle around something to just have the function to attach
                            and just call it from here while going through the event object itself...
                        */
                        return elementToBind.attachEvent('on' + DOMevent, functionToAttach);

                    };

                }

                // now call it since you have been redefined...
                return UTILS_self.addEvent(elementToBind, DOMevent, functionToAdd, useCaptureBool);

            },
            addEventToEle: function (operatingDomElement, featureWallType, passedInOptionsObj) {

                return function (ev) {
                    var $referredToDomEle;

                    /*
                        This looks weird to me but the linter says its wrong so 'correcting'
                    */
                    switch (featureWallType) {
                    case 'modal':
                        if ($referredToDomEle = $('#' + passedInOptionsObj.DOMReferenceId)) {
                            Olive.modal.show({
                                'name': (operatingDomElement.id || noIdwrapNum) + '-olive-feature-wall-modal',
                                'content': $referredToDomEle[0].innerHTML,
                                'size': passedInOptionsObj.modalSize
                            });
                        } else {
                            // this wont happen
                        }

                        break;

                    case 'tooltip':
                    default:
                        Olive.tooltip.instances[operatingDomElement.getAttribute('olive-tooltip')].open();
                    }

                    ev.preventDefault();
                    ev.stopPropagation();
                    return false;

                };

            },
            fakeOriginalDOMInteraction: function (operatingDomElement, featureWallType, passedInOptionsObj) {

                var UTILS_self = this;

                if (operatingDomElement && 
                    operatingDomElement.featureWall && 
                    operatingDomElement.featureWall.wrap && 
                    operatingDomElement.featureWall.callback) {

                    if (featureWallType === 'tooltip') {

                        $(operatingDomElement.featureWall.wrap).attr({
                            'olive-tooltip': passedInOptionsObj.DOMReferenceId,
                            'olive-tooltip-position': passedInOptionsObj.tooltipPosition,
                            'olive-tooltip-events': passedInOptionsObj.displayAction
                        });

                        operatingDomElement.featureWall.tooltip = Olive.tooltip.initialize(operatingDomElement.featureWall.wrap.id);

                    }

                    UTILS_self.addEvent(
                        operatingDomElement.featureWall.wrap, 
                        passedInOptionsObj.displayAction, 
                        operatingDomElement.featureWall.callback, 
                        true
                    );

                }

                return operatingDomElement;

            },

            /*
                The wrapping/unwrapping functions
            */
            wrapElement: function (operatingDomElement) {

                var featureWallWrapper;

                if (operatingDomElement) {

                    featureWallWrapper = $('<span />', {
                        'id': (operatingDomElement.id || noIdwrapNum++) + '-olive-wrap',
                        'class': CONSTANTS.classNames.featureWallWrap
                    })[0];

                    operatingDomElement.featureWall.processedSelf = featureWallWrapper.appendChild(operatingDomElement.cloneNode(true)); 

                    $(operatingDomElement.featureWall.processedSelf).addClass(CONSTANTS.classNames.btnFloatingIcon);

                    operatingDomElement.parentNode.replaceChild(featureWallWrapper, operatingDomElement);

                }

                return featureWallWrapper;

            },
            unwrapElement: function (operatingDomElement) {

                var preProcessedSelf = operatingDomElement.featureWall.preProcessedSelf;

                operatingDomElement.featureWall.wrap.parentNode.replaceChild(preProcessedSelf, operatingDomElement.featureWall.wrap);

                return preProcessedSelf;
            
            },

            /*
                The binding/unbinding functions
            */
            bindElement: function (operatingDomElement, featureWallType, passedInOptionsObj) {

                var UTILS_self = this;

                return UTILS_self.addEventToEle(
                    operatingDomElement.featureWall.wrap,
                    featureWallType,
                    passedInOptionsObj
                );

            },

            lockElement: function (operatingDomElement) {

                var iconEle;

                if (operatingDomElement.featureWall && !operatingDomElement.featureWall.icon) {

                    iconEle = $('<span />', {
                        'class': CONSTANTS.classNames.iconLockAndIsCallout
                    })[0];

                    operatingDomElement.featureWall.processedSelf.appendChild(iconEle);

                    return iconEle;

                }

            },
            featureWallSetup: function (DOMElementToActOn, featureWallType, passedInOptionsObj) {

                /**
                 * This is more of a factory like function in which all of the main methods and in an effort 
                 * to be DRY this is what resulted...
                 *
                 */
                var UTILS_self = this,
                    operatingDomElement = DOMElementToActOn;

                if (operatingDomElement.featureWall === undefined) {

                    operatingDomElement.featureWall = {};
                    operatingDomElement.featureWall.preProcessedSelf = operatingDomElement;

                    // this will get added by the replaceChild 
                    operatingDomElement.featureWall.processedSelf = null;

                    operatingDomElement.featureWall.wrap = UTILS_self.wrapElement(operatingDomElement);
                    operatingDomElement.featureWall.icon = UTILS_self.lockElement(operatingDomElement);
                    operatingDomElement.featureWall.callback = UTILS_self.bindElement(operatingDomElement, featureWallType, passedInOptionsObj);

                    operatingDomElement.setAttribute(CONSTANTS.featureWallObj.attributeList['olive-feature-wall'].initialized,'true');

                    /**
                     *
                     * @return {Object} operatingDomElement - This is basically the DOM element in which is being modaled by the feature wall
                     * @return {Object} operatingDomElement.featureWall - A simple object that is a property on that said modaled element
                     * @return {Object} operatingDomElement.featureWall.wrap - This is the DOM element that is the actual wrap that is sitting on top of the modaled element... this wrap is technically what is being clicked and binded to for the different types of actions within the feature walls component
                     * @return {Object} operatingDomElement.featureWall.icon - This is just the icon that sits as a child of the wrap itself... its just an icon... an Olive icon... with a border... nothing special here...
                     *
                     */

                }

                return operatingDomElement;

            }

        };


    /**
     * This is the base constructor of the feature wall component
     *
     * @exports root.Olive.featureWalls
     * @constructor
     * @param {Object} initObj - Basically this is the object that can be passed in order to be established globally... now this object is basically a mirror of the per method object but is for all Bronx items within that specific instance... obviously each new instance of the Bronx library will have global properties that are exclusive to themselves.
     * @param {string} initObj.displayAction - This pertains to the specific user action that will need to happen in order for the feature wall to go up....
     * @param {string} initObj.DOMReferenceId - This is the id of the DOM element that we want to use as the content of the feature wall... From there we getElementById and get it.
     *
     * @return {Object} Bronx base instance
     */
    function featureWallsInstance(instanceInitObj) {

        /*
            fwi_self = featureWallsInstance
            I will use this same name throughout so get used to it...
        */
        var fwi_self = this,
            instanceInitObj = instanceInitObj || {};

        /** 
            basically we either set the instanceInitObj to what was passed in or just set it 
            with an empty object

            at one point I had an injectedDOM property but saw no need for this...
            * @param {string} initObj.injectedDOM - This is the straight HTML of the desired content that will populate the feature wall.
         */

        /*
            This basically is for the single instance's collection of featureWalls... but its more an object not an array
            which is mapped by the ID of the feature wall
        */
        fwi_self.instances = {};

        /*
            either assign default values or just assign values which would come when instantiate the 
            featureWall instance... all the way at the bottom of this file just incase you wanted to know
        */
        fwi_self.instanceInitObj = {
            'displayAction': instanceInitObj.displayAction || 'click',
            'DOMReferenceId': instanceInitObj.DOMReferenceId || '',
            'iconClassname': instanceInitObj.iconClassname || 'icon-lock',
          /*
            feature wall type specific properties
          */
            'tooltipPosition': instanceInitObj.tooltipPosition,
            'modalSize': instanceInitObj.modalSize
        };

        /**
            so the base instance is pretty bare... from here on in technically you are
            extending the base via prototype so all can enjoy...
         */
        return fwi_self;

    }

    featureWallsInstance.prototype.tooltip = function (DOMElementToTooltip, tooltipOptionsObj) {

        /*
            this is the specific feature wall method that creates a 'Standard Tooltip' 
            for the user to interact with... it's not terribly invasive
        */

        var fwi_self = this,
            tooltipOptionsObj = {
                'displayAction': tooltipOptionsObj.displayAction || fwi_self.instanceInitObj.displayAction,
                'DOMReferenceId': tooltipOptionsObj.DOMReferenceId || fwi_self.instanceInitObj.DOMReferenceId,
                'iconClassname': tooltipOptionsObj.iconClassname || fwi_self.instanceInitObj.iconClassname,

              /*
                feature wall type specific properties
              */
                'tooltipPosition': tooltipOptionsObj.tooltipPosition || fwi_self.instanceInitObj.tooltipPosition
            };

        /* 
            Since this is a tooltip and tooltips need to be initialized, we just take that wrap 
            element that is saved as a property of the actual element being 'actioned' on and
            initialized that single instance
        */
        Olive.tooltip.initialize(
            UTILS.fakeOriginalDOMInteraction(
                UTILS.featureWallSetup(DOMElementToTooltip, 'tooltip', tooltipOptionsObj), 
                'tooltip', 
                tooltipOptionsObj 
            ).featureWall.wrap
        );

        /*
            prior to being an Olive component, this was build so it can chain... returning something
            is always nice so keeping this here...
        */
        return fwi_self;

    };

    featureWallsInstance.prototype.modal = function (DOMElementToModal, modalOptionsObj) {

        /*
            this is the specific feature wall method that creates a 'Basic Modal' for the user
            to interact with... This is when we are like 'hey... read this before you do anything... but
            you dont ACTUALLY have to read it... just saying'
        */

        var fwi_self = this,
            modalOptionsObj = {
                'displayAction': modalOptionsObj.displayAction || fwi_self.instanceInitObj.displayAction,
                'DOMReferenceId': modalOptionsObj.DOMReferenceId || fwi_self.instanceInitObj.DOMReferenceId,
                'iconClassname': modalOptionsObj.iconClassname || fwi_self.instanceInitObj.iconClassname,
    
                  /*
                    feature wall type specific properties
                  */
                'modalSize': modalOptionsObj.modalSize || fwi_self.instanceInitObj.modalSize
            };

        UTILS.fakeOriginalDOMInteraction(
            UTILS.featureWallSetup(DOMElementToModal, 'modal', modalOptionsObj),
            'modal', 
            modalOptionsObj
        );

        return fwi_self;

    };


    /*
        Regarding the management of all the feature wall instances
    */

    featureWallsInstance.prototype.initialize = function (elementToFeatureWall) {

        if (elementToFeatureWall.getAttribute(CONSTANTS.featureWallObj.attributeList['olive-feature-wall'].initialized)) {

            //dont even go 

            return false;

        }

        var fwi_self = this,
            featureWallAttributes = Olive.util.determineAttributeSet($(elementToFeatureWall), CONSTANTS.featureWallObj.attributeList);
        
        fwi_self[elementToFeatureWall.getAttribute(featureWallAttributes.featureWallType)](elementToFeatureWall,{
            'DOMReferenceId': elementToFeatureWall.getAttribute(featureWallAttributes.DOMReferenceId),

            /*
                the icon classname is always icon-lock from the olive component
            */
            'iconClassname': elementToFeatureWall.getAttribute(featureWallAttributes.iconClassname),
            /* 
                the display action is always click from the olive component
            */
            'displayAction': elementToFeatureWall.getAttribute(featureWallAttributes.displayAction),

            /*
                feature wall type specific properties
            */
            'tooltipPosition': elementToFeatureWall.getAttribute(featureWallAttributes.tooltipPosition),
            'modalSize': elementToFeatureWall.getAttribute(featureWallAttributes.modalSize)
        });

        fwi_self.instances[elementToFeatureWall.featureWall.wrap.id] = elementToFeatureWall;

        return fwi_self;

    };

    featureWallsInstance.prototype.destroy = function (elementToDeFeatureWall) {

        var fwi_self = this,
            deFeatureWalledElement;

        if (elementToDeFeatureWall.getAttribute(CONSTANTS.featureWallObj.attributeList['olive-feature-wall'].initialized)) {

            delete Olive.featureWalls.instances[elementToDeFeatureWall.featureWall.wrap.id];

            deFeatureWalledElement = UTILS.unwrapElement(elementToDeFeatureWall);

            deFeatureWalledElement.removeAttribute(CONSTANTS.featureWallObj.attributeList['olive-feature-wall'].initialized);

            deFeatureWalledElement.featureWall = undefined;

        }

        return fwi_self;

    };


    /**
     * Olive.featureWalls.initializeAll: auto-builds the 
     */
    featureWallsInstance.prototype.initializeAll = function () {

        var fwi_self = this,
            attributeListInstance;

        for (var attributeSet in CONSTANTS.featureWallObj.attributeList) {
            attributeListInstance = CONSTANTS.featureWallObj.attributeList[attributeSet];

            $('[' + attributeSet + ']').each(function () {
                if (!($(this).attr(attributeListInstance.initialized))) {
                    fwi_self.initialize(this);
                }
            });
        };

        return;
    };



    /*
        This uses the constructor to then augment/add to the Olive namespace...
    */
    win.Olive.featureWalls = new featureWallsInstance();

    /*
        Followed the 'module' pattern that is common through all the other Olive
        components
    */
    return;


    /*
        Didnt want to add jQuery but for consistency its now in...
    */

})(window.Olive = window.Olive || {}, window.jQuery, window);

/**
 * Olive CSS Inspector
 */

(function (Olive, $, undefined) {

    'use strict';
    
    var obj = {};
    
    // attribute sets: supports backwards compatibility
    obj.attributeList = {
        'olive-inspector': {
            'inspector': 'olive-inspect',
            'initialized': 'olive-initialized',
            'tooltip':'olive-inspect-tooltip'
        }
    };
    
    var standardColors = {},
        standardUnits = {},
        standardButtonUnits = {},
        standardAttrGroups = {
            'colors': standardColors,
            'units': standardUnits,
            'buttonunits': standardButtonUnits
        };
    
    /*
        @complexAttrs
    */
    var complexAttrs = {
        'border': ['borderBottomWidth', 'borderBottomStyle', 'borderBottomColor'],
        'borderBottom': ['borderBottomWidth', 'borderBottomStyle', 'borderBottomColor'],
        'borderLeft': ['borderLeftWidth', 'borderLeftStyle', 'borderLeftColor'],
        'borderRight': ['borderRightWidth', 'borderRightStyle', 'borderRightColor'],
        'borderTop': ['borderTopWidth', 'borderTopStyle', 'borderTopColor'],
        'padding': ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'],
        'font': ['fontSize', 'fontWeight', 'fontFamily']
    };
    
    /*
        @fontWeights
    */
    var fontWeights = {
        400: 'normal',
        700: 'bold'
    };
    
    var rgbToHex = function (rgbString) {
        var
            startIndex,
            stringLength,
            simpleString,
            decimalArray,
            finalString;

        startIndex = rgbString.indexOf("(") + 1;
        stringLength = rgbString.indexOf(")") - startIndex;
        simpleString = rgbString.substr(startIndex, stringLength);

        decimalArray = simpleString.split(',');
        
        finalString = "#";

        for (var i = 0; i < decimalArray.length; i++) {
            var
                hexValue = parseInt(decimalArray[i]).toString(16);
            if (hexValue.length == 1) {
                hexValue = "0".concat(hexValue);
            }
            finalString = finalString.concat(hexValue);
        };

        return finalString;
    };
    
    obj.defaults = {
        attributes: obj.attributeList['olive-inspector'],
    };
    
    obj.init = function (element) {
        
        element = $(element);
        
        var id = element.attr('olive-inspect'),
            targetAttr = element.attr('olive-inspect-attr'),
            targetElement = $('[olive-inspect-target*="' + id + '"]'),
            attrGroup = null,
            valueArray = [],
            inspectedValue;

        if (Object.keys(complexAttrs).indexOf(targetAttr) > -1) {
            for (var i = 0; i < complexAttrs[targetAttr].length; i++) {
                valueArray.push(obj.inspectElement(targetElement[0], complexAttrs[targetAttr][i], attrGroup));
            }
            inspectedValue = valueArray.join(' ');
        } else {
            inspectedValue = obj.inspectElement(targetElement[0], targetAttr, attrGroup);
        }

        element.html(inspectedValue);
        return;
        
    };

    obj.initializeTooltip = function(domElement) {
        var
            tooltipInstance,
            attrGroup = obj.attributeList['olive-inspector'],
            property,
            tooltipString,
            element = $(domElement);

        property = element.attr(attrGroup['tooltip']);
        tooltipString = obj.inspectElement(domElement, property, attrGroup);

        element.attr({
            'olive-tooltip':'',
            'olive-tooltip-events':'click',
            'title':tooltipString
        });

        tooltipInstance = Olive.tooltip.initialize(element);
        tooltipInstance.content.attr('olive-tooltip-noclose','');
        element.attr(attrGroup.initialized, "true");

        return;
    };

    obj.inspectElement = function(domElement, property, attrGroup) {
        var
            finalValue,
            fontArray,
            styleObj = window.getComputedStyle(domElement);

        // if it's an rgb value, convert its format to hex
        if ((styleObj[property].indexOf("rgb(") == 0)) {
            finalValue = rgbToHex(styleObj[property]);
        // human-friendly font weights
        } else if (property == "fontWeight") {
            finalValue = styleObj[property];
            finalValue = fontWeights[finalValue] || finalValue;
        // give them a simpler font family
        } else if (property == "fontFamily") {
            finalValue = styleObj[property];
            fontArray = finalValue.split(",");
            finalValue = fontArray[0].trim().replace(/"/g, '').replace(/'/g, "");
        } else {
            finalValue = styleObj[property];
        }

        // if we're translating the value to a standardized label, do that
        if (attrGroup) {
            finalValue = obj.translateValue(finalValue, attrGroup);
        }

        return finalValue;
    };

    obj.translateValue = function(inspectedValue, attrGroup) {
        var
            translatedValue,
            groupObj;


        if (attrGroup) {
            groupObj = standardAttrGroups[attrGroup] || {};
            translatedValue = groupObj[inspectedValue] || inspectedValue;
            return translatedValue;
        }
        return inspectedValue;
    };

    obj.initAll = function () {
        $('[' + obj.defaults.attributes.inspector + ']').each(function (i, v) {
            if (!($(this).attr(obj.defaults.attributes.initialized))) {
                obj.init(this);
            }
        });
        $('[' + obj.defaults.attributes.tooltip + ']').each(function (i, v) {
            if (!($(this).attr(obj.defaults.attributes.initialized))) {
                obj.initializeTooltip(this);
            }
        });
        
        return;
    };

    window.Olive.inspector = obj;

    return;

})(window.Olive = window.Olive || {}, jQuery);

Olive.init.add(Olive.inspector.initAll);

/**
 * Olive Menu utility
 */

(function(Olive, $, undefined) {

    'use strict';

    var
        menuObj = {},
        cssClasses = {
            'activeTrigger':'menu_trigger-on',
            'contentHasTip':'tip',
            'contentHidden':'invisible'
        };

    Olive.popover.cssClasses['menu'] = cssClasses;

    // attribute sets: supports backwards compatibility
    menuObj.attributeList = {
        'olive-menu':{
            'menuName':'olive-menu',
            'popoverName':'olive-menu',
            'trigger':'olive-menu-trigger',
            'location':'olive-menu-position',
            'events':'olive-menu-events',
            'positionTo':'olive-menu-position-to',
            'noclose':'olive-menu-noclose',
            'childTo':'olive-child-to',
            'contentFor':'olive-menu-content-for',
            'delay':'olive-menu-delay',
            'fade':'olive-menu-fade',
            'minWidth':'olive-menu-min-width',
            'animationModel':'olive-menu-animation-model',
            'maxHeight': 'olive-menu-max-height',
            'initialized':'olive-menu-initialized',
            'deprecated':false
        }
    };

    menuObj.instances = {};

    // add the instances object to the global popover reference for instance types
    Olive.popover.popoverInstanceGroups['menu'] = menuObj.instances;

    /**
     * Olive.menu.initialize: wrapper function that initializes the menu
     *     as a popover, then adds menu-specific functionality
     * @param {HTML element or jQuery object} trigger - the trigger for this menu
     */
    menuObj.initialize = function(trigger) {

        var
            instance = {},
            configObj = {};

        instance.trigger = $(trigger);

        // determine if we are using the current attribute set or a legacy set
        instance.attrSet = Olive.util.determineAttributeSet(instance.trigger, menuObj.attributeList);

        // exit early if the correct attribute set is not available, or if the element has already been initialized
        if (!instance.attrSet) {
            return false;
        } else if (instance.trigger.attr(instance.attrSet.initialized)) {
            return false;
        }

        instance = menuObj.initializePopover(instance, configObj);

        if (!instance) {
            return false;
        }

        menuObj.instances[instance.popoverName] = instance;

        /**
         * instance.beforeOpen - popovers trigger this function before opening;
         *      here we recalculate the width of the menu to fix a bug where
         *      it is the incorrect width if it's trigger is hidden by default
         */
        instance.beforeOpen = function() {
            instance.reconcileTriggerWidth();

            return instance;
        };

        /**
         * instance.afterOpen - popovers trigger this function after
         *     opening; using it to fire an event for other JS libraries to use
         */
        instance.afterOpen = function() {
            $(window).trigger('activate.menu', {
                'menu' : instance.popoverName
            });

            Olive.accessibility.menus.onOpen(instance.trigger, instance.content);

            return instance;
        };

        /**
         * instance.afterClose - popovers trigger this function after
         *     closing; using it to fire an event for other JS libraries to use
         */
        instance.afterClose = function() {
            // fire an event that other JS libraries can hook into
            $(window).trigger('deactivate.menu', {
                'menu' : instance.popoverName
            });

            Olive.accessibility.menus.onClose(instance.trigger, instance.content);

            return instance;
        };

        /**
         * instance.reconcileTriggerWidth - ensures that a menu is not narrower
         *     than its trigger button
         */
        instance.reconcileTriggerWidth = function() {

            var
                newMinWidth,
                triggerWidth = instance.trigger.outerWidth();

            newMinWidth = (triggerWidth > instance.options.minWidth) ? triggerWidth : instance.options.minWidth;

            instance.content.css({
                "minWidth": newMinWidth
            });

            return instance;
        };

        if (instance.popParents.length == 0) {
            instance.reconcileTriggerWidth();
        }

        return instance;
    };

    /**
     * Olive.menu.initializePopover: popover is the superclass for menus, so we
     *     add that functionality first
     * @param {object} instance - the instance as it exists so far
     */
    menuObj.initializePopover = function(instance) {
        var
            newInstance,
            configObject = {};

        configObject['trigger'] = instance.trigger;
        configObject['contentId'] = instance.trigger.attr(instance.attrSet.menuName);
        configObject['location'] = instance.trigger.attr(instance.attrSet.location) || "below left";
        configObject['events'] = instance.trigger.attr(instance.attrSet.events) || "click";
        configObject['tip'] = 0;
        configObject['minWidth'] = instance.trigger.attr(instance.attrSet.minWidth) || 120;
        configObject['minWidth'] = parseInt(configObject['minWidth']);
        configObject['positionTo'] = instance.trigger.attr(instance.attrSet.positionTo) || instance.trigger;
        configObject['maxHeight'] = instance.trigger.attr(instance.attrSet.maxHeight)

        configObject.popoverType = 'menu';

        newInstance = Olive.popover.initialize(instance, configObject);

        Olive.accessibility.menus.initialize(instance.trigger, instance.content);

        return newInstance;
    };

    /**
     * Olive.menu.initializeAll: auto-initializes all uninitialized menus on the page
     */
    menuObj.initializeAll = function() {

        for (var attrSet in menuObj.attributeList) {
            $('[' + attrSet + ']').each(function() {
                if (($(this).attr(menuObj.attributeList[attrSet].initialized) == undefined) ||
                ($(this).attr(menuObj.attributeList[attrSet].initialized).indexOf('menu') < 0)) {
                    menuObj.initialize(this);
                }
            });
        };

        return;
    };

    window.Olive.menu = menuObj;

    return;

})(window.Olive = window.Olive || {}, jQuery);

Olive.init.add(Olive.menu.initializeAll);

/**
 * Olive Message utility
 */

(function(Olive, $, undefined) {

    'use strict';

    var
        messageObj = {};

    messageObj.cssClasses = {
        'info':'message-info',
        'error':'message-error',
        'warning':'message-warning',
        'success':'message-success',
        'icon':'icon message-icon',
        'icon-info':'icon-info',
        'icon-error':'icon-alert-triangle',
        'icon-warning':'icon-alert-triangle',
        'icon-success':'icon-check',
        'wrapper':'message',
        'hidden':'message-hidden',
        'content':'message_content',
        'close':'message_close icon icon-times',
        'hideClose':'message_close-hidden',
        'globalContainer':'global-messages'
    };

    messageObj.legacyTypes = {
        'info':'info',
        'warn':'warning',
        'warning':'warning',
        'alert':'error',
        'error':'error',
        'success':'success'
    }

    messageObj.supportDeprecatedUtil = false;

    // distance a notification travels, in pixels
    messageObj.animDistance = 50;

    // attribute sets: supports backwards compatibility
    messageObj.attributeList = {
        'olive-message':{
            'wrapper': 'olive-message',
            'content': 'olive-message-content',
            'close': 'olive-message-close',
            'deprecated':false
        }
    };

    messageObj.instances = {};

    messageObj.defaultOptions = {
        'animate': true,
        'animationModel': 'fade',
        'autoClose': false,
        'autoCloseTimeout': 5000,
        'hideClose': false,
        'persist': false
    };

    /**
     * Olive.message.show: initializes and shows a message
     * @param {string or DOM object} messageContent - the content of the message
     * @param {string} name - the unique identifier of this message. if new
     *     message comes in and has the same name, it will close the first one
     * @param {string} type - the type of message. ['info'||'error'||'warning'||'success']
     * @param {object} options - Optional. Used to override the default settings
     */
    messageObj.show = function(messageContent, name, type, options) {

        if ((!messageContent) || (!name)) {
            return false;
        }

        var 
            instance = {};

        instance.name = name;
        instance.type = messageObj.legacyTypes[type] || 'info';
        instance.messageContent = messageContent;
        instance.options = {};
        instance.currentlyClosing = false;
        instance.attrSet = messageObj.attributeList["olive-message"];

        for (var key in messageObj.defaultOptions) {
            instance.options[key] = messageObj.defaultOptions[key];
        }

        // for success messages only, automatically close by default
        if (instance.type == "success") {
            instance.options.autoClose = true;
        }

        if (options) {
            for (var key in options) {
                instance.options[key] = options[key];
            }
        }

        /**
         * instance.show: creates and shows the message
         * @param {function} chainFunction - a function to execute after the message opens
         */
        instance.show = function(chainFunction) {

            if (!(messageObj.container)) {
                messageObj.createContainer();
            }

            if (!(instance.content)) {
                messageObj.createElement(instance);
            }

            if (instance.options.animate) {
                instance.fadeIn(chainFunction);
            } else {
                instance.jumpIn(chainFunction);
            }

            return instance;
        };


        /**
         * instance.close: hides the message then removes it from memory
         * @param {function} chainFunction - a function to execute after the message closes
         */
        instance.close = function(chainFunction) {

            if (instance.currentlyClosing) {
                return;
            }
            instance.currentlyClosing = true;

            if (instance.options.animate) {
                instance.fadeOut(chainFunction);
            } else {
                instance.jumpOut(chainFunction);
            }
            return;
        };

        /**
         * instance.destroy: removes the content from the DOM, removes the instance
         *     from Olive.message.instances
         */
        instance.destroy = function() {
            instance.content.remove();
            delete messageObj.instances[instance.name];
            return;
        };

        /**
         * instance.fadeIn: animates the reveal of the message
         * @param {function} chainFunction - a function to execute after the message opens
         */
        instance.fadeIn = function(chainFunction) {

            var
                animParams = Olive.animation.getEnter(messageObj.animDistance, instance.options.animationModel);

            instance.content.css({
                'marginTop': (messageObj.animDistance * -1),
                'opacity': 0,
                'zIndex': ''
            });

            instance.content.animate({
                    'marginTop':0,
                    'opacity':1
                },
                animParams.duration,
                animParams.timingFunction,
                function() {
                    instance.jumpIn();
                    if (typeof chainFunction == "function") {
                        chainFunction();
                    }
                }
            );

            return instance;
        };

        /**
         * instance.fadeOut: animates the disappearance of the message
         * @param {function} chainFunction - a function to execute after the message closes
         */
        instance.fadeOut = function(chainFunction) {
            var
                moveDistance = instance.content.outerHeight() + 10,
                animParams = Olive.animation.getExit(moveDistance, instance.options.animationModel);

            instance.content.css({
                'marginTop': 0,
                'opacity':1,
                'zIndex':-1
            });

            instance.content.animate({
                    'marginTop': (moveDistance * -1),
                    'opacity':0
                },
                animParams.duration,
                animParams.timingFunction,
                function() {
                    instance.jumpOut();
                    if (typeof chainFunction == "function") {
                        chainFunction();
                    }
                }
            );

            return instance;
        };

        /**
         * instance.jumpIn: immediately jumps to the open state, no animation
         * @param {function} chainFunction - a function to execute after the message opens
         */
        instance.jumpIn = function(chainFunction) {
            instance.content.removeClass(messageObj.cssClasses.hidden);
            if (typeof chainFunction == "function") {
                chainFunction();
            }
            messageObj.instances[instance.name] = instance;

            if (instance.options.autoClose) {
                setTimeout(instance.close, instance.options.autoCloseTimeout);
            }

            return instance;
        };

        /**
         * instance.jumpOut: immediately jumps to the closed state, no animation
         * @param {function} chainFunction - a function to execute after the message closes
         */
        instance.jumpOut = function(chainFunction) {
            instance.content.addClass(messageObj.cssClasses.hidden);
            if (typeof chainFunction == "function") {
                chainFunction();
            }
            instance.destroy();

            return instance;
        };

        if (Object.keys(messageObj.instances).indexOf(instance.name) > -1) {
            Olive.message.instances[instance.name].close(instance.show);
        } else {
            instance.show();
        }

        return instance;
    };

    /**
     * Olive.message.createContainer: creates the global message container
     *     if it does not yet exist in the DOM
     */
    messageObj.createContainer = function() {

        // if a container already exists, use that instead
        if ($('body > .' + messageObj.cssClasses.globalContainer).length) {
            messageObj.container = $('body > .' + messageObj.cssClasses.globalContainer).eq(0);

        // temporarily: allow deprecated notification container to qualify as message container
        } else if (messageObj.supportDeprecatedUtil &&
            $('body > .' + messageObj.cssClasses.globalContainerDeprecated).length) {
            messageObj.container = $('body > .' + messageObj.cssClasses.globalContainerDeprecated).eq(0);
            messageObj.container.addClass(messageObj.cssClasses.globalContainer);
        } else {
            
            var container = $(document.createElement('div'));

            container.addClass(messageObj.cssClasses.globalContainer);
            // temporarily: add deprecated classname to share container with old notifications
            if (messageObj.supportDeprecatedUtil) {
                container.addClass(messageObj.cssClasses.globalContainerDeprecated);
            }
            $('body').append(container);
            messageObj.container = container;
        }
        
        Olive.accessibility.messages.setAriaAttributes(messageObj.container);
            
        return true;
    };

    /**
     * Olive.message.createElement: creates the HTML elements for a message
     */
    messageObj.createElement = function(instance) {
        var
            messageDiv = $(document.createElement('div')),
            iconSpan = $(document.createElement('span')),
            contentDiv = $(document.createElement('div')),
            closeButton = $(document.createElement('button'));

        messageDiv.addClass(messageObj.cssClasses["wrapper"]).addClass(messageObj.cssClasses[instance.type]);
        iconSpan.addClass(messageObj.cssClasses["icon"]).addClass(messageObj.cssClasses["icon-" + instance.type]);
        contentDiv.addClass(messageObj.cssClasses["content"]);
        closeButton.addClass(messageObj.cssClasses["close"]);

        messageDiv.attr(instance.attrSet.wrapper, "");
        contentDiv.attr(instance.attrSet.content, "");
        closeButton.attr(instance.attrSet.close, "");

        if (instance.options.hideClose) {
            closeButton.addClass(messageObj.cssClasses.hideClose);
        }

        if (typeof instance.messageContent == "object") {
            contentDiv.append(instance.messageContent);
        } else {
            contentDiv.text(instance.messageContent);
        }
        
        messageDiv.append(iconSpan);
        messageDiv.append(contentDiv);
        messageDiv.append(closeButton);

        messageObj.container.append(messageDiv);
        instance.content = messageDiv;

        closeButton.on({
            'click':instance.close
        });

        return instance;
    };

    /**
     * Olive.message.closeMessage: if a message exists with the given name, closes it
     * @param {string} name - unique identifier for the message you want to close
     */
    messageObj.closeMessage = function(name) {

        if (Object.keys(messageObj.instances).indexOf(name) > -1) {
            messageObj.instances[name].close();
            return true;
        }
        return;
    };

    /**
     * Olive.message.closeAll: closes all open messages, except those with the persist option
     * @param {string} type - Optional. close messages of this type only
     */
    messageObj.closeAll = function(type) {
        var
            key;

        if (type != undefined) {
            for (key in messageObj.instances) {
                if ((messageObj.instances[key].type == type) && (!messageObj.instances[key].options.persist)) {
                    messageObj.instances[key].close();
                }
            }
        } else {
            for (key in messageObj.instances) {
                if (!messageObj.instances[key].options.persist) {
                    messageObj.instances[key].close();
                }
            }
        }
        return;
    };

    window.Olive.message = messageObj;

    return;

})(window.Olive = window.Olive || {}, jQuery);

/**
 * Olive Modal utility
 */

(function (Olive, $) {

    'use strict';

    var
        modalObj = {};

    modalObj.openModals = [];
    modalObj.instances = {};

    modalObj.attributeList = {
        'oliveModal': {
            'header': 'olive-modal-header',
            'footer': 'olive-modal-footer',
            'content': 'olive-modal-content',
            'utilityHeader': 'olive-modal-utility-header',
            'messageSection': 'olive-modal-message-container',
            'messageName': 'olive-modal-message-name',
            'closeButton': 'olive-modal-close',
            'escape': 'olive-modal-escape',
            'complete': 'olive-modal-complete',
            'shroud': 'olive-modal-shroud',
            'miniShroud': 'olive-modal-mini-shroud',
            'deprecated': false
        }
    };

    modalObj.cssClasses = {
        'shroud': 'modal_shroud',
        'shroudShowing': 'modal_shroud-visible',
        'bodyShroudShowing': 'modal-open',
        'modal': 'modal',
        'modalNew': 'modal-new',
        'modalShowing': 'modal-visible',
        'header': 'modal_header',
        'footer': 'modal_footer',
        'content': 'modal_content',
        'utilityHeader': 'modal_utilityHeader',
        'closeButton': 'icon icon-times modal_close',
        'hideClose': 'modal_close-hidden',
        'messageSection': 'modal_messageContainer',
        'messageWrapper': 'modal_message',
        'messageIcon': 'modal_message_icon icon',
        'messageContent': 'modal_message_content',
        'error': 'modal_message-error',
        'success': 'modal_message-success',
        'info': 'modal_message-info',
        'warning': 'modal_message-warning',
        'messageIcon-info': 'icon-info',
        'messageIcon-error': 'icon-alert-triangle',
        'messageIcon-success': 'icon-check',
        'messageIcon-warning': 'icon-alert-triangle',
        'miniShroud': 'modal_miniShroud',
        'paused': 'modal-paused',
        'completeButton': 'btn btn-primary btn-lg',
        'escapeButton': 'btn btn-minor btn-lg',
        'disabled': 'disabled',
        'sm': 'modal-sm',
        'md': 'modal-md',
        'lg': 'modal-lg',
        'xl': 'modal-xl'
    };

    modalObj.defaultOptions = {
        'cssTopOffset': 36,
        'cssChildAddedOffset': 24,
        'showClose': true,
        'preventClose': false,
        'destroyOnClose': false,
        'useAnimation': true,
        'animationModel': 'fade',
        'onComplete': null,
        'onEscape': null,
        'onOpen': null
    };

    modalObj.sizes = [
        'sm',
        'md',
        'lg',
        'xl'
    ];

    modalObj.shroud = null;
    modalObj.shroudOpacity = null;
    modalObj.shroudShowing = false;



    var initializeCallbackQueues = function (instanceName) {
        Olive.queue.create('modal-complete-' + instanceName);
        Olive.queue.create('modal-escape-' + instanceName);
    };


    /**
     * Olive.modal.show: shows a specific modal. if given a config object,
     *     will initialize that modal if it does not already exist
     * @param {object} configObject: an object of config parameters
     *     to be passed to initializeModal()
     */
    modalObj.show = function (configObject) {

        var thisInstance;

        // if it's an object...
        if ((typeof configObject) === 'object') {

            // case: the object doesn't specify a name... malformed object
            if (Object.keys(configObject).indexOf('name') === -1) {
                return false;

            // case: if the object is for a modal but the instance already exists
            // try to destroy the existing modal...
            } else if (Object.keys(modalObj.instances).indexOf(configObject.name) > -1) {

                // don't destroy it if it's currently showing
                if (modalObj.instances[configObject.name].currentState === "showing") {
                    return false;
                }
                // if you're able to destroy the existing modal...
                var result = modalObj.instances[configObject.name].destroy();
                if (result) {
                    thisInstance = modalObj.initializeModal(configObject);
                    thisInstance.open();
                    return thisInstance;
                // otherwise...
                } else {
                    return false;
                }

            // otherwise: this is a config object for a new modal
            } else {

                thisInstance = modalObj.initializeModal(configObject);
                thisInstance.open();
                return thisInstance;
            }

        // otherwise: they passed us an invalid argument for options
        } else {
            return false;
        }
    };


    /**
     * Olive.modal.initializeModal: creates a modal instance
     * @param {object} configObject - contains a set of items
     *     used to configure the new modal instance
     */
    modalObj.initializeModal = function (configObject) {

        if (!configObject.name) {
            return false;
        }

        var key,
            instance = {};

        instance.name = configObject.name;
        instance.currentState = "hiding";
        instance.attrSet = modalObj.attributeList.oliveModal;

        instance.options = {};

        for (key in modalObj.defaultOptions) {
            instance.options[key] = modalObj.defaultOptions[key];
        }

        for (key in configObject) {
            instance.options[key] = configObject[key];
        }

        instance.size = instance.options.size || 'md';
        instance.size = instance.size.toLowerCase();

        if (modalObj.sizes.indexOf(instance.size) === -1) {
            instance.size = 'md';
        }

        instance.wrapper = null;
        instance.messageSection = null;
        instance.contentSection = null;
        instance.header = null;
        instance.footer = null;
        instance.closeButton = null;
        instance.miniShroud = null;
        instance.miniShroudOpacity = null;
        instance.paused = false;
        instance.hasUtilityHeader = false;

        initializeCallbackQueues(instance.name);


        /**
         * instance.generateWrapper - builds an HTML element to be this modal's wrapper
         */
        instance.generateWrapper = function () {
            var
                wrapper = $(document.createElement('div'));

            // TODO: remove modalNew class once migration is complete
            wrapper
                .addClass(modalObj.cssClasses.modal)
                .addClass(modalObj.cssClasses.modalNew)
                .attr('role', 'dialog')
                .appendTo('body');

            instance.wrapper = wrapper;
            return instance;
        };


        /**
         * instance.populateContent - populates the wrapper with the modal's content
         *     calls functions to create the message section, close button, and mini shroud
         */
        instance.populateContent = function () {

            var
                rawContent = instance.options.content,
                contentBlock;

            // if it's a string, convert it to DOM elements so we can continue
            if ((typeof rawContent) === "string") {
                var
                    contentWrapper = $(document.createElement('div'));
                contentBlock = contentWrapper.append(rawContent);
            // if it's an object, make sure it's a jQuery object
            } else {
                contentBlock = $(rawContent);
            }

            // if contentBlock has the modal class, it is the wrapper
            if (contentBlock.hasClass(modalObj.cssClasses.modal)) {
                instance.wrapper = contentBlock;
            // if contentBlock has a child with the modal class, then THAT is the wrapper
            } else if (contentBlock.find("." + modalObj.cssClasses.modal).length) {
                instance.wrapper = contentBlock.find("." + modalObj.cssClasses.modal).eq(0);
            // otherwise, contentBlock needs us to build the wrapper
            } else {
                instance.generateWrapper();
                instance.wrapper.append(contentBlock);
            }

            // if the wrapper is not yet part of the body, put it there
            if (!(instance.wrapper.closest('body')).length) {
                instance.wrapper.appendTo('body');
            }

            instance.wrapper.addClass(modalObj.cssClasses[instance.size]);

            // identify the content section
            instance.contentSection = instance.wrapper.find("[olive-modal-content]");

            if (!(instance.contentSection.length)) {
                instance.contentSection = instance.wrapper.find('.' + modalObj.cssClasses.content).eq(0);
            }

            // find the header and footer, then add the other sections
            instance.header = instance.wrapper.find('[' + instance.attrSet.header + ']');
            if (instance.header.length === 0) {
                instance.header = instance.wrapper.find('.' + modalObj.cssClasses.header);
                instance.header.attr(instance.attrSet.header, '');
            }
            instance.footer = instance.wrapper.find('[' + instance.attrSet.footer + ']');
            if (instance.footer.length === 0) {
                instance.footer = instance.wrapper.find('.' + modalObj.cssClasses.footer);
                instance.footer.attr(instance.attrSet.footer, '');
            }
            instance.utilityHeader = instance.wrapper.find('[' + instance.attrSet.utilityHeader + ']');
            if (instance.utilityHeader.length === 0) {
                instance.utilityHeader = instance.wrapper.find('.' + modalObj.cssClasses.utilityHeader);
                instance.utilityHeader.attr(instance.attrSet.utilityHeader, '');
            }

            instance.header.addClass(modalObj.cssClasses.header);
            instance.footer.addClass(modalObj.cssClasses.footer);
            instance.utilityHeader.addClass(modalObj.cssClasses.utilityHeader);

            instance.hasUtilityHeader = Boolean(instance.utilityHeader.length);

            instance.addMessageSection();
            instance.addClose();
            instance.addMiniShroud();

            return instance;
        };


        /**
         * instance.setDimensions - recalculates the max height of the content section
         *     and left offset of the wrapper
         */
        instance.setDimensions = function () {
            var
                spaceHeight,
                adjustmentFactor = 0,
                headerHeight = instance.header.outerHeight(),
                footerHeight = instance.footer.outerHeight(),
                messageHeight = instance.messageSection.outerHeight(),
                utilityHeaderHeight = 0,
                windowHeight = $(window).height(),
                windowWidth = $(window).width(),
                wrapperWidth = instance.wrapper.outerWidth(),
                offsetLeft,
                maxHeight;

            if (instance.hasUtilityHeader) {
                utilityHeaderHeight = instance.utilityHeader.outerHeight();
            }

            /*
             * Calculate the distance from the top: the standard offset for a single
             *     modal plus an additional offset based on how many parent
             *     modals are already open
             */
            if (modalObj.openModals.length) {
                var instanceIndex = $.inArray(instance, modalObj.openModals);
                if (instanceIndex > -1) {
                    /* this modal is already one of the open modals */
                    adjustmentFactor = (instanceIndex * modalObj.defaultOptions.cssChildAddedOffset);
                } else {
                    /* this modal is about to open for the first time */
                    adjustmentFactor = (modalObj.openModals.length * modalObj.defaultOptions.cssChildAddedOffset);
                }
            }

            spaceHeight = modalObj.defaultOptions.cssTopOffset + adjustmentFactor;
            windowHeight = $(window).height();

            maxHeight = windowHeight - headerHeight - footerHeight - messageHeight - utilityHeaderHeight - (2 * spaceHeight);
            offsetLeft = (windowWidth - wrapperWidth) / 2;

            instance.contentSection.css({
                'maxHeight': maxHeight
            });

            instance.wrapper.css({
                'left': offsetLeft
            });

            return instance;
        };


        /**
         * instance.addClose - creates DOM element for close button; adds it to the wrapper
         */
        instance.addClose = function () {
            var
                closeButton = $(document.createElement('button'));

            closeButton.addClass(modalObj.cssClasses.closeButton);

            // add close button and escape attributes
            closeButton.attr(instance.attrSet.closeButton, '').attr(instance.attrSet.escape, '');

            if (!(instance.options.showClose)) {
                closeButton.addClass(modalObj.cssClasses.hideClose);
            }

            instance.closeButton = closeButton;

            instance.wrapper.append(instance.closeButton);

            return instance;
        };


        /**
         * instance.addMessageSection - creates DOM element for message section; adds it to the wrapper
         */
        instance.addMessageSection = function () {
            var
                messageSection = $(document.createElement('div'));

            messageSection.addClass(modalObj.cssClasses.messageSection);

            Olive.accessibility.messages.setAriaAttributes(messageSection);

            instance.contentSection.before(messageSection);
            instance.messageSection = messageSection;

            return instance;
        };


        /**
         * instance.addMiniShroud - creates DOM element to shroud only this modal;
         *     used when child modal opens
         */
        instance.addMiniShroud = function () {
            var
                miniShroud = $(document.createElement('div'));

            miniShroud
                .addClass(modalObj.cssClasses.miniShroud)
                .attr(instance.attrSet.miniShroud, '');

            instance.wrapper.append(miniShroud);
            instance.miniShroud = miniShroud;

            instance.miniShroudOpacity = window.getComputedStyle(instance.miniShroud[0]).opacity;

            return instance;
        };



        /**
         * instance.open - opens this modal; selects correct animation function,
         *     updates Olive.modal.openModals, sets global shroud state, etc
         */
        instance.open = function () {

            if (instance.currentState !== "hiding") {
                return false;
            }

            if (!(instance.wrapper)) {
                instance.populateContent();
            }

            var animateInPromise,
                arrPausePromises = [];

            if (modalObj.openModals.length === 0) {
                animateInPromise = instance.animIn();
            } else {
                var i, l;
                for (i = 0, l = modalObj.openModals.length; i < l; i++) {
                    var pausePromise = modalObj.openModals[i].beginPause();
                    arrPausePromises.push(pausePromise);
                }
                animateInPromise = instance.animIn();
            }

            instance.currentState = "showing";
            modalObj.openModals.push(instance);

            var shroudPromise = modalObj.setShroudState();


            Olive.accessibility.saveLastFocusedElement();
            Olive.accessibility.toggleAriaHiddenOnMain(true);
            Olive.accessibility.trapTabFocus(instance.wrapper, true);
            Olive.accessibility.setAutoFocus(instance.wrapper);

            if (Olive.scrollShadow) {
                instance.contentSection.attr('olive-scroll-shadow', instance.name + '-scrollShadow');
                instance.scrollShadow = Olive.scrollShadow.initialize(instance.contentSection);
            }

            $(window).on({
                'resize': instance.setDimensions,
                'activate.tab': instance.setDimensions
            });


            // wait for all animations to complete before calling onOpen callback
            $.when(shroudPromise, animateInPromise, arrPausePromises).done(function () {

                if (instance.options.onOpen) {
                    instance.options.onOpen(instance);
                }

            });

            return instance;
        };


        /**
         * instance.close - closes this modal; selects correct animation function,
         *     updates Olive.modal.openModals, sets global shroud state, etc
         */
        instance.close = function () {

            var
                openModalIndex = modalObj.openModals.indexOf(instance);

            if (instance.paused) {
                return false;
            }

            if ((openModalIndex === -1) ||
                    (instance.currentState !== "showing")) {
                return true;
            }

            // question - what happens if this is not the top modal ???
            if ((modalObj.openModals.length === 1) && (openModalIndex === 0)) {
                instance.animOut(instance.options.destroyOnClose);
//                instance.globalOut();
            } else {
                instance.animOut(instance.options.destroyOnClose);
            }

            instance.currentState = "hiding";
            modalObj.openModals.splice(openModalIndex, 1);
            modalObj.setShroudState();

            if (modalObj.openModals.length > 0) {
                modalObj.openModals[modalObj.openModals.length - 1].endPause();
            }


            Olive.accessibility.trapTabFocus(instance.wrapper, false);
            Olive.accessibility.toggleAriaHiddenOnMain(false);
            Olive.accessibility.restoreLastFocusedElement();

            if (instance.scrollShadow) {
                instance.scrollShadow.destroy();
            }

            $(window).off({
                'resize': instance.setDimensions,
                'activate.tab': instance.setDimensions
            });

            return instance;
        };



        /**
         * instance.escape - closes this modal; indicates that the process was not completed
         */
        instance.escape = function (data) {

            if (instance.options.preventClose) {
                return instance;
            }

            instance.close();
            instance.onEscape(data);

            return instance;
        };


        /**
         * instance.complete - closes this modal; indicates that the process was completed successfully
         */
        instance.complete = function (data) {

            if (instance.options.preventClose) {
                return instance;
            }

            instance.close();
            instance.onComplete(data);

            return instance;
        };

        /**
         * instance.onEscape - runs all functions in the onEscapeQueue
         * @param {object} data - optional parameter to be passed to each function
         */
        instance.onEscape = function (data) {
            Olive.queue.run('modal-escape-' + instance.name, data);
            return instance;
        };

        /**
         * instance.addToEscapeQueue - adds another function to the
         *     instance's onEscape queue. The function will be run
         *     when the modal completes successfully
         * @param {function} function - the function to be added to the queue
         *     optionally, this function can accept a 'data' argument
         */
        instance.addToEscapeQueue = function (functionToAdd) {
            Olive.queue.add('modal-escape-' + instance.name, functionToAdd);
            return instance;
        };

        /**
         * instance.onComplete - runs all functions in the onCompleteQueue
         * @param {object} data - optional parameter to be passed to each function
         */
        instance.onComplete = function (data) {
            Olive.queue.run('modal-complete-' + instance.name, data);
            return instance;
        };

        /**
         * instance.addToCompleteQueue - adds another function to the
         *     instance's onComplete queue. The function will be run
         *     when the modal completes successfully
         * @param {function} function - the function to be added to the queue
         *     optionally, this function can accept a 'data' argument
         */
        instance.addToCompleteQueue = function (functionToAdd) {
            Olive.queue.add('modal-complete-' + instance.name, functionToAdd);
            return instance;
        };


        /**
         * instance.preventClose - puts the modal in a state that prevents closure
         *     should be used during a process that should not be interrupted: AJAX calls, etc
         */
        instance.preventClose = function () {

            var
                i,
                l,
                buttonAttributes = [
                    instance.attrSet.closeButton,
                    instance.attrSet.escape,
                    instance.attrSet.complete
                ];

            for (i = 0, l = buttonAttributes.length; i < l; i++) {
                instance.wrapper.find("[" + buttonAttributes[i] + "]").addClass(modalObj.cssClasses.disabled);
            }

            if (instance.options.showClose) {
                instance.wrapper.find("[" + instance.attrSet.closeButton + "]").addClass(modalObj.cssClasses.hideClose);
            }

            instance.options.preventClose = true;
            return instance;

        };


        /**
         * instance.allowClose - removes the "preventClose" state
         */
        instance.allowClose = function () {

            var
                i,
                l,
                buttonAttributes = [
                    instance.attrSet.closeButton,
                    instance.attrSet.escape,
                    instance.attrSet.complete
                ];

            for (i = 0, l = buttonAttributes.length; i < l; i++) {
                instance.wrapper
                    .find("[" + buttonAttributes[i] + "]")
                    .removeClass(modalObj.cssClasses.disabled);
            }

            if (instance.options.showClose) {
                instance.wrapper
                    .find("[" + instance.attrSet.closeButton + "]")
                    .removeClass(modalObj.cssClasses.hideClose);
            }

            instance.options.preventClose = false;

            return instance;
        };


        /**
         * instance.addMessage - adds a new message to the message section of the modal
         * @param {string, HTML, or HTML object} msgContent - content of the message itself
         * @param {string} msgName - a unique identifier for this message
         * @param {string} type - the message type. "info" || "warning" || "error" || "success"
         */
        instance.addMessage = function (msgContent, msgName, type) {

            if (instance.wrapper.find("[" + instance.attrSet.messageName + "='" + msgName + "']").length) {
                instance.removeMessage(msgName, true);
            }

            var
                jqMsg = instance.buildMessage(msgContent, msgName, type);

            if (!(jqMsg)) {
                return false;
            }

            instance.messageSection.append(jqMsg);

            var
                msgHeight = parseFloat(jqMsg.outerHeight()),
                msgMargin,
                contentOrigMaxHeight,
                contentNewMaxHeight,
                animOptions = {},
                contentAnimOptions = {};

            msgMargin = parseFloat(window.getComputedStyle(jqMsg[0]).marginTop);

            contentOrigMaxHeight = parseFloat(window.getComputedStyle(instance.contentSection[0]).maxHeight);
            contentNewMaxHeight = contentOrigMaxHeight - msgHeight - msgMargin;

            animOptions.initCss = {
                'opacity': 0,
                'marginTop': (-1 * msgHeight)
            };
            animOptions.targetCss = {
                'opacity': 1,
                'marginTop': msgMargin
            };
            animOptions.transitionModel = "fade";
            animOptions.direction = "enter";
            animOptions.distance = msgHeight + msgMargin;
            animOptions.removeCss = true;

            contentAnimOptions.targetCss = {
                'maxHeight': contentNewMaxHeight
            };

            contentAnimOptions.transitionModel = "fade";
            contentAnimOptions.direction = "enter";
            contentAnimOptions.distance = msgHeight + msgMargin;
            contentAnimOptions.removeCss = false;
            contentAnimOptions.finalFunction = instance.setDimensions;

            Olive.animation.start(jqMsg, animOptions);
            Olive.animation.start(instance.contentSection, contentAnimOptions);

            return instance;
        };


        /**
         * instance.buildMessage - builds the HTML structure for the message
         * @param {string, HTML, or HTML object} msgContent - content of the message itself
         * @param {string} msgName - a unique identifier for this message
         * @param {string} type - the message type. "info" || "warning" || "error" || "success"
         */
        instance.buildMessage = function (msgContent, msgName, type) {
            var
                newMsg = $(document.createElement('div')),
                msgType = String(type).toLowerCase(),
                msgIcon = $(document.createElement('span')),
                msgContentWrapper = $(document.createElement('div'));

            newMsg.addClass(modalObj.cssClasses.messageWrapper).addClass(modalObj.cssClasses[msgType]);
            msgIcon.addClass(modalObj.cssClasses.messageIcon).addClass(modalObj.cssClasses["messageIcon-" + msgType]);
            msgContentWrapper.addClass(modalObj.cssClasses.messageContent);

            newMsg.attr(instance.attrSet.messageName, msgName);

            if ((typeof msgContent) === "string") {
                msgContentWrapper.html(msgContent);
            } else if ((typeof msgContent) === "object") {
                msgContentWrapper.append(msgContent);
            } else {
                return false;
            }

            newMsg.append(msgIcon);
            newMsg.append(msgContentWrapper);

            return newMsg;
        };


        /**
         * instance.removeMessage - removes a specific message from the modal, if it is showing
         * @param {string} msgName - a unique identifier for this message
         * @param {Boolean} skipContentAnim - optional. If true, skips animating the
         *     max-height of the modal's contentSection. Used programmatically when
         *     animating multiple messages simultaneously
         */
        instance.removeMessage = function (msgName, skipContentAnim) {

            var
                jqMsg = instance.wrapper.find("[" + instance.attrSet.messageName + "='" + msgName + "']");

            if (!(jqMsg.length)) {
                return false;
            }

            var
                msgHeight = parseFloat(jqMsg.outerHeight()),
                msgMargin,
                contentOrigMaxHeight,
                contentNewMaxHeight,
                animOptions = {},
                contentAnimOptions = {},
                animateContentHeight = !(Boolean(skipContentAnim));

            msgMargin = parseFloat(window.getComputedStyle(jqMsg[0]).marginTop);

            contentOrigMaxHeight = parseFloat(window.getComputedStyle(instance.contentSection[0]).maxHeight);
            contentNewMaxHeight = contentOrigMaxHeight + msgHeight + msgMargin;

            animOptions.initCss = {
                'opacity': 1,
                'marginTop': msgMargin
            };
            animOptions.targetCss = {
                'opacity': 0,
                'marginTop': (-1 * msgHeight)
            };
            animOptions.transitionModel = "fade";
            animOptions.direction = "exit";
            animOptions.distance = msgHeight + msgMargin;
            animOptions.removeCss = false;
            animOptions.finalFunction = function () {
                jqMsg.remove();
            };

            contentAnimOptions.targetCss = {
                'maxHeight': contentNewMaxHeight
            };

            contentAnimOptions.transitionModel = "fade";
            contentAnimOptions.direction = "exit";
            contentAnimOptions.distance = msgHeight + msgMargin;
            contentAnimOptions.removeCss = false;
            contentAnimOptions.finalFunction = instance.setDimensions;

            Olive.animation.start(jqMsg, animOptions);
            if (animateContentHeight) {
                Olive.animation.start(instance.contentSection, contentAnimOptions);
            }

            return instance;
        };


        /**
         * instance.clearMessages - clears all messages from this modal
         */
        instance.clearMessages = function () {
            var i,
                l,
                jqMsgSet = instance.wrapper.find("[" + instance.attrSet.messageName + "]");

            for (i = 0, l = jqMsgSet.length; i < l; i++) {
                var msgName = jqMsgSet.eq(i).attr(instance.attrSet.messageName);
                if (i === (jqMsgSet.length - 1)) {
                    instance.removeMessage(msgName);
                } else {
                    instance.removeMessage(msgName, true);
                }
            }

            return instance;
        };


        /**
         * instance.destroy - removes this modal from the DOM and removes
         *     the reference to this instance
         */
        instance.destroy = function () {
            var
                result = instance.close;
            if (result) {
                instance.wrapper.remove();
                if (Object.keys(modalObj.instances).indexOf(instance.name) > -1) {
                    delete modalObj.instances[instance.name];
                }
                return true;
            } else {
                return false;
            }
        };


        /**
         * instance.animIn - animates showing the modal
         *
         *  @returns {jQuery promise} a promise from the animation
         */
        instance.animIn = function () {

            var
                animOptions = {},
                wrapperOffset,
                newZIndex,
                computedStyle = window.getComputedStyle(instance.wrapper[0]);

            $('body').addClass(modalObj.cssClasses.bodyShroudShowing);

            wrapperOffset = modalObj.defaultOptions.cssTopOffset +
                (modalObj.openModals.length * modalObj.defaultOptions.cssChildAddedOffset);
            newZIndex = computedStyle.zIndex + modalObj.openModals.length;

            animOptions.direction = "enter";
            animOptions.distance = 48;
            animOptions.finalClass = modalObj.cssClasses.modalShowing;
            animOptions.transitionModel = instance.options.animationModel;
            animOptions.initCss = {
                'display': 'block',
                'zindex': newZIndex,
                'top': wrapperOffset + animOptions.distance,
                'opacity': 0
            };
            animOptions.targetCss = {
                'top': wrapperOffset,
                'opacity': 1
            };
            animOptions.finalCss = {
                'opacity': ''
            };
            animOptions.prepFunction = instance.setDimensions;

            animOptions.finalFunction = function () {
                instance.setDimensions();

                $(window).trigger('open.modal', {
                    'name' : instance.name
                });
            };

            var animInPromise = Olive.animation.start(instance.wrapper, animOptions);

            return animInPromise;
        };


        /**
         * instance.animOut - animates hiding the modal
         */
        instance.animOut = function (thenDestroy) {

            if (thenDestroy === undefined) {
                thenDestroy = false;
            }

            var
                animOptions = {},
                wrapperOffset,
                computedStyle = window.getComputedStyle(instance.wrapper[0]);

            wrapperOffset = parseFloat(computedStyle.top);

            animOptions.direction = "exit";
            animOptions.distance = 48;
            animOptions.finalClass = modalObj.cssClasses.modalShowing;
            animOptions.transitionModel = instance.options.animationModel;
            animOptions.initCss = {
                'top': wrapperOffset,
                'opacity': 1
            };
            animOptions.targetCss = {
                'top': wrapperOffset + animOptions.distance,
                'opacity': 0
            };
            animOptions.finalCss = {
                'display': 'none',
                'opacity': ''
            };
            if (thenDestroy) {
                animOptions.finalFunction = instance.destroy;
            }

            var animOutPromise = Olive.animation.start(instance.wrapper, animOptions);

            return animOutPromise;
        };


        /**
         * instance.beginPause - pauses the current modal; used when this modal is open and
         *     a child modal appears over it
         */
        instance.beginPause = function () {

            if (instance.paused) {
                return instance;
            } else {
                instance.paused = true;
            }

            instance.wrapper.addClass(modalObj.cssClasses.paused);

            // initialize the animation parameters
            var
                animOptions = {};

            animOptions.direction = "enter";
            animOptions.transitionModel = instance.options.animationModel;
            animOptions.initCss = {
                'opacity': 0
            };
            animOptions.targetCss = {
                'opacity': instance.miniShroudOpacity
            };
            animOptions.removeCss = true;

            // now run the animation
            var beginPausePromise = Olive.animation.start(instance.miniShroud, animOptions);

            return beginPausePromise;
        };


        /**
         * instance.endPause - unpauses this modal; used when a child modal over
         *     this one closes and makes this modal the current one
         */
        instance.endPause = function () {

            if (!(instance.paused)) {
                return instance;
            } else {
                instance.paused = false;
            }

            // initialize the animation parameters
            var
                animOptions = {};

            animOptions.direction = "exit";
            animOptions.transitionModel = instance.options.animationModel;
            animOptions.initCss = {
                'opacity': instance.miniShroudOpacity
            };
            animOptions.targetCss = {
                'opacity': 0
            };
            animOptions.removeCss = true;
            animOptions.finalFunction = function () {
                instance.wrapper.removeClass(modalObj.cssClasses.paused);
            };

            var endPausePromise = Olive.animation.start(instance.miniShroud, animOptions);

            return endPausePromise;
        };

        instance.populateContent();

        if (instance.options.onComplete) {
            instance.addToCompleteQueue(instance.options.onComplete);
        }

        if (instance.options.onEscape) {
            instance.addToEscapeQueue(instance.options.onEscape);
        }

        modalObj.instances[instance.name] = instance;

        // on click, delegated to only elements with the escape attribute
        instance.wrapper.on(
            "click",
            "[" + instance.attrSet.escape + "]",
            instance.escape
        );

        // on click, delegated to only elements with the complete attribute
        instance.wrapper.on(
            "click",
            "[" + instance.attrSet.complete + "]",
            instance.complete
        );

        return instance;
    };


    /**
     * Olive.modal.createShroud: if the shroud element does
     *     not exist, creates one. returns the shroud.
     */
    modalObj.createShroud = function () {

        // exit early if the shroud already exists
        if (modalObj.shroud) {
            return modalObj.shroud;
        }

        var
            shroud = $(document.createElement('div'));

        shroud
            .addClass(modalObj.cssClasses.shroud)
            .attr(modalObj.attributeList.oliveModal.shroud, '')
            .appendTo('body');

        modalObj.shroud = shroud;
        modalObj.shroudOpacity = window.getComputedStyle(modalObj.shroud[0]).opacity;

        return modalObj.shroud;
    };


    /**
     * Olive.modal.setShroudState: show or hide the modal shroud, as appropriate
     *
     *  @returns {jQuery promise} a promise from the animation
     */
    modalObj.setShroudState = function () {

        if (!(modalObj.shroud)) {
            modalObj.createShroud();
        }

        // there are modals but the shroud is not showing
        if (modalObj.openModals.length && (!modalObj.shroudShowing)) {
            return modalObj.showShroud();
        // there are no modals but the shroud is showing
        } else if ((!modalObj.openModals.length) && modalObj.shroudShowing) {
            return modalObj.hideShroud();
        }

        return;
    };


    /**
     * Olive.modal.showShroud: shows the modal shroud, possibly animated
     *
     *  @returns {jQuery promise} a promise from the animation
     */
    modalObj.showShroud = function () {

        var
            animParams = Olive.animation.getFadeIn(modalObj.defaultOptions.animationModel);

        modalObj.shroud
            .css({ 'opacity': 0 })
            .addClass(modalObj.cssClasses.shroudShowing);

        $('body').addClass(modalObj.cssClasses.bodyShroudShowing);

        var shroud = modalObj.shroud.animate(
            {
                'opacity': modalObj.shroudOpacity
            },
            animParams.duration,
            animParams.timingFunction,
            function () {
                modalObj.shroud.css({
                    'opacity': ''
                });
                modalObj.shroudShowing = true;
            }
        );

        return shroud.promise();
    };


    /**
     * Olive.modal.hideShroud: hides the modal shroud, possibly animated
     *
     *  @returns {jQuery promise} a promise from the animation
     */
    modalObj.hideShroud = function () {

        var
            animParams = Olive.animation.getFadeOut(modalObj.defaultOptions.animationModel);

        modalObj.shroud.css({
            'opacity': modalObj.shroudOpacity
        });

        var shroud = modalObj.shroud.animate(
            {
                'opacity': 0
            },
            animParams.duration,
            animParams.timingFunction,
            function () {
                $('body').removeClass(modalObj.cssClasses.bodyShroudShowing);
                modalObj.shroud.removeClass(modalObj.cssClasses.shroudShowing);
                modalObj.shroud.css({
                    'opacity': ''
                });
                modalObj.shroudShowing = false;
            }
        );

        return shroud.promise();
    };


    /**
     * Olive.modal.confirm: helper function: creates a confirmation dialog
     * @param {object} options - contains a set of items
     *     used to configure the confirmation dialog
     *     text - String: confirmation message for the modal
     *     title - String: (optional) title of the modal
     *     completeLabel - String: label for the complete/continue button
     *     completeFunction - Function: (optional) function to be run on complete
     *     escapeLabel - String: (optional) label for the escape/cancel button
     *     escapeFunction - Function: (optional) function to be run on escape
     */
    modalObj.confirm = function (options) {

        if (!(options.text)) {
            return false;
        }

        if (!(options.completeLabel)) {
            return false;
        }

        var
            nameAssigned = false,
            nameIndex = 0,
            confirmName,
            wrapperDiv,
            headerDiv,
            contentDiv,
            footerDiv,
            completeBtn,
            escapeBtn,
            instance,
            modalOptions = {};

        // determine a name for this modal
        while (nameAssigned === false) {
            confirmName = "confirmation-dialog-" + String(nameIndex);
            if (Object.keys(modalObj.instances).indexOf(confirmName) === -1) {
                nameAssigned = true;
            } else {
                nameIndex++;
            }
        }

        wrapperDiv = $(document.createElement('div'));
        wrapperDiv
            .addClass(modalObj.cssClasses.modal)
            .addClass(modalObj.cssClasses.modalNew)
            .attr('role', 'dialog');

        if (options.title) {
            headerDiv = $(document.createElement('div'));
            headerDiv.addClass(modalObj.cssClasses.header);
            headerDiv.text(options.title);
            wrapperDiv.append(headerDiv);
        }

        contentDiv = $(document.createElement('div'));
        contentDiv.addClass(modalObj.cssClasses.content);
        contentDiv.text(options.text).attr(modalObj.attributeList.oliveModal.content, '');
        wrapperDiv.append(contentDiv);

        footerDiv = $(document.createElement('div'));
        footerDiv.addClass(modalObj.cssClasses.footer);

        completeBtn = $(document.createElement('button'));
        completeBtn.addClass(modalObj.cssClasses.completeButton);
        completeBtn.text(options.completeLabel).attr(modalObj.attributeList.oliveModal.complete, '');
        footerDiv.append(completeBtn);

        if (options.escapeLabel) {
            escapeBtn = $(document.createElement('button'));
            escapeBtn.addClass(modalObj.cssClasses.escapeButton);
            escapeBtn.text(options.escapeLabel).attr(modalObj.attributeList.oliveModal.escape, '');
            footerDiv.append(escapeBtn);
        }

        wrapperDiv.append(footerDiv);

        modalOptions.name = confirmName;
        modalOptions.size = "sm";
        modalOptions.content = wrapperDiv;
        modalOptions.showClose = false;
        modalOptions.destroyOnClose = true;

        instance = modalObj.show(modalOptions);

        if (options.completeFunction) {
            instance.onComplete = options.completeFunction;
        }

        if (options.escapeFunction) {
            instance.onEscape = options.escapeFunction;
        }

        return instance;
    };


    var closeTopModal = function (options) {
        if (modalObj.openModals.length === 0) {
            return;
        }

        var
            topModal = modalObj.openModals[modalObj.openModals.length - 1];

        if (options.isComplete) {
            return topModal.complete(options.data);
        } else if (options.isEscape) {
            return topModal.escape(options.data);
        }

        return topModal;
    };

    /**
     * Olive.modal.completeTopModal: completes top modal if one is open
     *  @param {Object} data - any data you would like to pass through to the onComplete handler
     */
    modalObj.completeTopModal = function (data) {
        return closeTopModal({isComplete: true, data: data});
    };


    /**
     * Olive.modal.escapeTopModal: escapes top modal if one is open
     *  @param {Object} data - any data you would like to pass through to the onEscape handler
     */
    modalObj.escapeTopModal = function (data) {
        return closeTopModal({isEscape: true, data: data});
    };


    /**
     * Olive.modal.closeAll: escapes all open modals
     */
    modalObj.closeAll = function () {
        if (modalObj.openModals.length === 0) {
            return;
        }

        var
            i,
            startingIndex = modalObj.openModals.length - 1;

        for (i = startingIndex; i >= 0; i--) {
            modalObj.openModals[i].escape();
        }

        return;
    };

    // if using the escape key is enabled, close the top modal
    //     when the escape key is pressed
    if (Olive.config.closePopoverOnEsc) {
        $(document).on({
            "keydown": function (e) {
                if (e.which === 27) {
                    modalObj.escapeTopModal();
                }
            }
        });
    }

    window.Olive.modal = modalObj;

    return;

}(window.Olive = window.Olive || {}, window.jQuery));

/**
 * Olive Position helper utility
 *
 * Olive.position.calc() will determine the coordinates used to absolutely
 * position a content element with respect to its trigger element or event, using
 * a requested relative "location" string as a starting point. Locations can be:
 *    [above || below] && [left || center || right] or
 *    [before || after] && [top || middle || bottom]
 */

(function (Olive, $) {

    'use strict';

    var
        testCollisionOnTop,
        testCollisionOnLeft,
        testCollisionOnRight,
        positionObj = {};


    var getTriggerProps = function (trigger) {

        var triggerProps = {
            offsetLeft: 0,
            offsetTop: 0,
            width: 0,
            height: 0
        };

        // case: trigger is an element (wrapped by jQuery)
        if (trigger instanceof $) {

            triggerProps.offsetLeft = trigger.offset().left;
            triggerProps.offsetTop = trigger.offset().top;
            triggerProps.width = trigger.outerWidth();
            triggerProps.height = trigger.outerHeight();

        // case: trigger is a jQuery event
        // allows us to position the element based on the location of a mouse click, for example
        } else if (trigger instanceof $.Event) {

            triggerProps.offsetLeft = trigger.pageX;
            triggerProps.offsetTop = trigger.pageY;
            triggerProps.width = 0;
            triggerProps.height = 0;
        }

        return triggerProps;
    };

    /**
     * testCollisionOnTop - private function that determines whether
     * the positioned content will overflow past the top edge of the screen
     */
    testCollisionOnTop = function (y) {
        return y < $(window).scrollTop();
    };

    /**
     * testCollisionOnLeft - private function that determines whether
     * the positioned content will overflow past the left edge of the screen
     */
    testCollisionOnLeft = function (x) {
        return x < $(window).scrollLeft();
    };

    /**
     * testCollisionOnRight - private function that determines whether
     * the positioned content will overflow past the right edge of the screen
     */
    testCollisionOnRight = function (x, contentWidth) {
        return x + contentWidth > ($(window).width() + $(window).scrollLeft());
    };

    /**
     * Olive.position.calc - determines the correct coordinates to absolutely position
     *     content with respect to its trigger
     * @triggerProps {object} - properties of the trigger - get them from the getTriggerProps function
     * @content {jQuery object} - the element to be positioned
     * @location {string} - a string that describes the content's position relative to its trigger
     *    includes two values separated by a space. possible values are:
     *    [above || below] && [left || center || right] or
     *    [before || after] && [top || middle || bottom]
     * @tip {integer} - optional. the size, in pixels, of the content's triangular "tip", if any
     */
    positionObj.calc = function (triggerProps, content, location, tip) {

        var
            attemptPosition,
            contentPosition,
            triggerOffsetHorizontalCenter = triggerProps.offsetLeft + (triggerProps.width / 2),
            triggerOffsetVerticalCenter = triggerProps.offsetTop + (triggerProps.height / 2),
            contentWidth = content.outerWidth(),
            contentHeight = content.outerHeight(),
            tipSize = tip || 0;

        /**
         * attemptPosition - private function that determines if placement is possible
         * at requested location and determines alternate positioning if necessary.
         * @coords {object} contains x, y, and location
         *     @location {string} requested placement position, see Olive.position.calc
         *     @x {number} x offset in pixels. should start at 0.
         *     @y {number} y offset in pixels. should start at 0.
         */
        attemptPosition = function (coords) {

            // case: [above || below] && [left || center || right]
            if (coords.location.indexOf('below') > -1 || coords.location.indexOf('above') > -1) {

                // case: above
                if (coords.location.indexOf('above') > -1) {
                    coords.y = triggerProps.offsetTop - contentHeight - tipSize;

                    // switch to below if collision on top
                    if (testCollisionOnTop(coords.y)) {
                        coords.location = coords.location.replace('above', 'below');
                        return attemptPosition(coords);
                    }

                // case: below
                } else {
                    coords.y = triggerProps.offsetTop + triggerProps.height + tipSize;
                }

                // case: center
                if (coords.location.indexOf('center') > -1) {
                    coords.x = triggerOffsetHorizontalCenter - (contentWidth / 2);

                    // switch to left if collision on left
                    if (testCollisionOnLeft(coords.x)) {
                        coords.location = coords.location.replace('center', 'left');
                        return attemptPosition(coords);
                    }

                    // switch to right if collision on right
                    if (testCollisionOnRight(coords.x, contentWidth)) {
                        coords.location = coords.location.replace('center', 'right');
                        return attemptPosition(coords);
                    }

                // case: left
                } else if (coords.location.indexOf('left') > -1) {
                    coords.x = triggerProps.offsetLeft;

                    // switch to right if collision on left
                    if (testCollisionOnLeft(coords.x)) {
                        coords.location = coords.location.replace('left', 'right');
                        return attemptPosition(coords);
                    }

                // case: right
                } else if (coords.location.indexOf('right') > -1) {
                    coords.x = triggerProps.offsetLeft + triggerProps.width - contentWidth;

                    // switch to left if collision on right
                    if (testCollisionOnRight(coords.x, contentWidth)) {
                        coords.location = coords.location.replace('right', 'left');
                        return attemptPosition(coords);
                    }
                }

            // case: [before || after] && [top || middle || bottom]
            } else if (coords.location.indexOf('after') > -1 || coords.location.indexOf('before') > -1) {

                // case: after
                if (coords.location.indexOf('after') > -1) {
                    coords.x = triggerProps.offsetLeft + triggerProps.width + tipSize;

                    // switch to below center if collision on right
                    if (testCollisionOnRight(coords.x, contentWidth)) {
                        coords.location = 'below center';
                        return attemptPosition(coords);
                    }

                // case: before
                } else if (coords.location.indexOf('before') > -1) {
                    coords.x = triggerProps.offsetLeft - contentWidth - tipSize;

                    // switch to below center if collision on left
                    if (testCollisionOnLeft(coords.x)) {
                        coords.location = 'below center';
                        return attemptPosition(coords);
                    }
                }

                // case: bottom
                if (coords.location.indexOf('bottom') > -1) {
                    coords.y = triggerProps.offsetTop + triggerProps.height - contentHeight;

                    // switch to middle if collision on top
                    if (testCollisionOnTop(coords.y)) {
                        coords.location = coords.location.replace('bottom', 'middle');
                        return attemptPosition(coords);
                    }

                // case: middle
                } else if (coords.location.indexOf('middle') > -1) {
                    coords.y = triggerOffsetVerticalCenter - (contentHeight / 2);

                    // switch to top if collision on top
                    if (testCollisionOnTop(coords.y)) {
                        coords.location = coords.location.replace('middle', 'top');
                        return attemptPosition(coords);
                    }

                // case: top
                } else if (coords.location.indexOf('top') > -1) {
                    coords.y = triggerProps.offsetTop;

                    // switch to below center if collision on top
                    if (testCollisionOnTop(coords.y)) {
                        coords.location = 'below center';
                        return attemptPosition(coords);
                    }
                }
            }

            return coords;

        };

        contentPosition = attemptPosition({ location: location, x: 0, y: 0 });
        return contentPosition;
    };



    positionObj.calcMaxHeight = function (triggerProps, content, options) {

        var finalMaxHeight,
            location = options.location,
            maxHeightAbove = 0,
            maxHeightBelow = 0,
            containerHeight = 0,
            containerScrollTop = 0,
            tipSize = options.tip;

        if (options.maxHeight === 'window') {

            containerHeight = $(window).height();
            containerScrollTop = $(window).scrollTop();

        } else if (options.maxHeight === 'body') {

            containerHeight = $('body').height();

        }

        if (options.maxHeight) {

            maxHeightAbove = triggerProps.offsetTop - containerScrollTop - tipSize;
            maxHeightBelow = containerHeight - triggerProps.offsetTop - triggerProps.height + containerScrollTop - tipSize;

            if (location.indexOf('below') > -1) {

                finalMaxHeight = maxHeightBelow;

                /* let's put the popover above if there is a lot more room */
                if (maxHeightAbove > maxHeightBelow * 1.5) {
                    location = location.replace('below', 'above');
                    finalMaxHeight = maxHeightAbove;
                }

            } else if (location.indexOf('above') > -1) {

                finalMaxHeight = maxHeightAbove;

                /* let's put the popover below if there is a lot more room */
                if (maxHeightBelow > maxHeightAbove * 1.5) {
                    location = location.replace('above', 'below');
                    finalMaxHeight = maxHeightBelow;
                }
            }
        }

        return {
            location: location,
            maxHeight: finalMaxHeight
        };

    };


    /**
     * Olive.position.move - absolutely positions an element to the coordinates as as determined by Olive.position.calc
     *
     * @param trigger {jQuery object || jQuery event} - element or event used as a starting point for positioning
     * @param content {jQuery object} - the element to be positioned
     *
     * @param {Object} options -
     * @param {string} options.location - a string that describes the content's position relative to its trigger
     *    includes two values separated by a space. possible values are:
     *    [above || below] && [left || center || right] or
     *    [before || after] && [top || middle || bottom]
     *
     * @param {integer} option.tip - optional. the size, in pixels, of the content's triangular "tip", if any
     * @param {string} options.maxHeight - how and if to calculate max height of the popover
     */
    positionObj.move = function (trigger, content, options) {

        var
            triggerProps = getTriggerProps(trigger),
            offsetFromParent = content.offsetParent().offset() || $('body').offset(),
            parentOffsetLeft = offsetFromParent.left,
            parentOffsetTop = offsetFromParent.top,
            offsetParentStyle = window.getComputedStyle(content.offsetParent()[0]),
            parentBorderTop = parseFloat(offsetParentStyle.borderTopWidth),
            parentBorderLeft = parseFloat(offsetParentStyle.borderLeftWidth),
            maxHeightCalc = positionObj.calcMaxHeight(triggerProps, content, options),
            edgePadding = 5;

        if (maxHeightCalc.maxHeight) {
            content
                .addClass('popover-isScrollable')
                .css({ 'maxHeight': maxHeightCalc.maxHeight - edgePadding });
        }

        /* call calc() after the maxHeight calculation, because we use the
            content height in figuring out the popover coordinates */
        var coords = positionObj.calc(triggerProps, content, maxHeightCalc.location, options.tip);

        /* check if coords has a value because positionObj.calc can return
            false if the trigger is not a jQuery object or jQuery event */
        if (coords) {
            content.css({
                'top' : parseInt(coords.y - parentOffsetTop - parentBorderTop),
                'left' : parseInt(coords.x - parentOffsetLeft - parentBorderLeft)
            });
        }

        return coords;
    };

    // assign positionObj a place in the Olive namespace
    Olive.position = positionObj;

    return;

}(window.Olive = window.Olive || {}, window.jQuery));

(function (Olive) {

    'use strict';

    var queue = {},
        sets = {};

    queue.create = function (setName) {

        sets[setName] = sets[setName] || {};
        sets[setName].functions = sets[setName].functions || [];

        return true;
    };

    queue.add = function (setName, functionToAdd) {

        if (typeof functionToAdd !== 'function') {
            Olive.dev.log('Not a function.');
            return false;
        }

        queue.create(setName);

        sets[setName].functions.push(functionToAdd);

        return true;
    };

    queue.run = function (setName, data) {

        data = data || {};

        if (!sets.hasOwnProperty(setName)) {
            Olive.dev.log('No set named "' + setName + '"');
            return false;
        }

        var functions = sets[setName].functions,
            i = 0,
            l = 0;

        for (i = 0, l = functions.length; i < l; i++) {
            functions[i](data);
        }

        //todo: possibly use a promise to run a callback after each one completes
        queue.clear(setName);

        return true;
    };

    queue.clear = function (setName) {

        if (!sets.hasOwnProperty(setName)) {
            Olive.dev.log('No set named "' + setName + '"');
            return false;
        }

        delete sets[setName];

        return true;
    };

    Olive.queue = queue;

}(window.Olive = window.Olive || {}));

/**
 *  Olive Scroll Shadow
 *      Adds an inset shadow on any side of a container when there is more content "beyond" the fold
 */
(function (Olive, $) {

    'use strict';



    /**
     *  @param {Boolean} defaults.enableHorizontal - whether to include shadows for horizontal scrolling
     *  @param {Boolean} defaults.enableVertical - whether to include shadows for vertical scrolling
     *  @param {Object} defaults.styles - the box shadow styles for each side of a container
     *  @param {string} defaults.styles.top - the box shadow style for the top of a container
     *  @param {string} defaults.styles.right - the box shadow style for the right of a container
     *  @param {string} defaults.styles.bottom - the box shadow style for the bottom of a container
     *  @param {string} defaults.styles.left - the box shadow style for the left of a container
     */
    var obj = {
        instances: {},
        name: 'scrollShadow.olive',
        defaults: {
            enableHorizontal: false,
            enableVertical: true,
            styles: {
                top: 'rgba(0, 0, 0, 0.18) 0 7px 7px -7px inset',
                right: 'rgba(0, 0, 0, 0.38) -7px 0 7px -7px inset',
                bottom: 'rgba(0, 0, 0, 0.18) 0 -7px 7px -7px inset',
                left: 'rgba(0, 0, 0, 0.38) 7px 0 7px -7px inset'
            }
        },
        attributeList: {
            'olive-scroll-shadow': {
                'scrollShadow': 'olive-scroll-shadow',
                'initialized': 'olive-scroll-shadow-initialized'
            }
        }
    };



    function bindEvents(instance) {

        instance.container.off('scroll' + instance.namespace);

        instance.container.on('scroll' + instance.namespace, function (evt) {
            obj.setScrollShadow(instance);
        });

        $(window).on('resize' + instance.namespace, {instance: instance}, function (evt) {
            obj.setScrollShadow(instance);
        });

        if (Olive.drawer) {
            //support drawers changing height of container

            $(window).on(Olive.drawer.eventNames.activate + instance.namespace, {instance: instance}, function (evt) {
                obj.setScrollShadow(instance);
            });
        }

        if (Olive.tabs) {
            //support tabs changing height of container

            $(window).on(Olive.tabs.eventNames.activate + instance.namespace, {instance: instance}, function (evt) {
                obj.setScrollShadow(instance);
            });
        }

        return;
    }



    /**
     *  Olive.scrollShadow.createScrollShadowCss - creates a string of CSS to be used as box shadow CSS
     *  @param {object} options - options object that includes anything from defaults, as well as...
     *  @param {Boolean} options.hasMoreAbove - if there is more content beyond the top side of the container
     *  @param {Boolean} options.hasMoreAfter - if there is more content beyond the right side of the container
     *  @param {Boolean} options.hasMoreBelow - if there is more content beyond the bottom side of the container
     *  @param {Boolean} options.hasMoreBefore - if there is more content beyond the left side of the container
     */
    obj.createScrollShadowCss = function (options) {
        var boxShadows = [],
            css = '';

        if (options.enableVertical) {

            if (options.hasMoreAbove) {
                boxShadows.push(options.styles.top);
            }

            if (options.hasMoreBelow) {
                boxShadows.push(options.styles.bottom);
            }
        }

        if (options.enableHorizontal) {

            if (options.hasMoreAfter) {
                boxShadows.push(options.styles.right);
            }

            if (options.hasMoreBefore) {
                boxShadows.push(options.styles.left);
            }
        }

        if (boxShadows.length) {
            css = boxShadows.join(', ');
        }

        return css;
    };



    /**
     *  Olive.scrollShadow.setScrollShadow - determines if there is more
     *      content beyond any side of the container, and applies the
     *      necessary scroll shadow classes
     *  @param {object} instance - the instance of the scrollShadow to set
     */
    obj.setScrollShadow = function (instance) {

        var hasMoreAbove = false,
            hasMoreBelow = false,
            hasMoreBefore = false,
            hasMoreAfter = false;

        if (instance.settings.enableVertical) {

            var containerHeight = instance.container.outerHeight(),
                containerScrollHeight = instance.container.prop('scrollHeight'),
                containerScrollTop = instance.container.scrollTop();

            hasMoreAbove = containerScrollTop > 0;
            hasMoreBelow = (containerScrollTop + containerHeight) < containerScrollHeight;
        }

        if (instance.settings.enableHorizontal) {

            var containerWidth = instance.container.outerWidth(),
                containerScrollWidth = instance.container.prop('scrollWidth'),
                containerScrollLeft = instance.container.scrollLeft();

            hasMoreBefore = containerScrollLeft > 0;
            hasMoreAfter = (containerScrollLeft + containerWidth) < containerScrollWidth;
        }

        var settings = $.extend({}, instance.settings, {
            hasMoreAbove: hasMoreAbove,
            hasMoreAfter: hasMoreAfter,
            hasMoreBelow: hasMoreBelow,
            hasMoreBefore: hasMoreBefore
        });

        var boxShadowCss = obj.createScrollShadowCss(settings);

        instance.container.css({
            'boxShadow': boxShadowCss
        });

        return;
    };



    /**
     *  Olive.scrollShadow.destroy - remove CSS classes, unbind events, and delete the instance
     *  @param {object} instance - the instance of the scrollShadow to destroy
     */
    obj.destroy = function (instance) {

        instance.container
            .css('boxShadow', '')
            .off(instance.namespace)
            .removeAttr(instance.attributes.initialized);

        if (Object.keys(obj.instances).indexOf(instance.name) > -1) {
            delete obj.instances[instance.name];
        }

        //unbind window events
        $(window).off(instance.namespace);

        return;
    };



    obj.initialize = function (element, settings) {

        // create a new instance of the object
        var instance = {
            container: $(element),
            settings: $.extend({}, obj.defaults, settings || {})
        };

        // determine if we are using the current attribute set or a legacy set
        instance.attributes = Olive.util.determineAttributeSet(instance.container, obj.attributeList);

        // exit early if the correct attribute set is not available
        if (!instance.attributes) {
            return false;
        }

        // exit early if already initialized
        if (instance.container.attr(instance.attributes.initialized)) {
            return false;
        }

        // get name from attribute or settings
        instance.name = instance.container.attr(instance.attributes.scrollShadow) || settings.name;

        // and set up namespace for events
        instance.namespace = '.' + instance.name + '.' + obj.name;

        /* Public Methods */

        instance.destroy = function () {
            obj.destroy(instance);
        };

        /* end Public Methods */

        // set initial state
        obj.setScrollShadow(instance);

        // bind the scroll/touch events
        bindEvents(instance);

        // almost there... set the initialized attribute to prevent re-initialization
        instance.container.attr(instance.attributes.initialized, true);

        // ...and add this instance to the
        obj.instances[instance.name] = instance;

        return instance;
    };



    obj.initializeAll = function () {
        $('[' + obj.attributeList['olive-scroll-shadow'].scrollShadow, + ']').each(function (i, v) {
            obj.initialize(v, {});
        });

        return;
    };

    Olive.scrollShadow = obj;

    Olive.init.add(Olive.scrollShadow.initializeAll);

    return;

}(window.Olive = window.Olive || {}, window.jQuery));

/**
 * Olive Sticky element
 */

(function (Olive, $) {

    'use strict';

    var obj = {
        instances: {},
        name: 'sticky'
    };


    /**
     * bindEvents: bind to scroll and touch events, which will set/unset sticky mode
     */
    function bindEvents(instance) {

        //initially bind the container to the scroll event
        instance.container.on('scroll.' + instance.name, function (e) {
            instance.setPosition();
        });

        //the user is on a touch device, so we don't need the scroll event
        //but we'll add it back in on touch end, in case the user is on a hybrid device that has a mouse / trackpad / touch screen
        instance.container.on('touchstart.' + instance.name, function (e) {
            instance.container.off('scroll.' + instance.name);
        });

        //this fires while the user is dragging the screen, or "scrolling"
        instance.container.on('touchmove.' + instance.name, function (e) {
            instance.setPosition();
        });

        //touchend - fires after touchmove - the user is done dragging the screen
        //touchcancel - fires if it was a tap - the user is done touching the screen
        //so now rebind the scroll event
        instance.container.on('touchend.' + instance.name + ' touchcancel.' + obj.name, function (e) {
            instance.container.on('scroll.' + instance.name, instance.setPosition);
        });
    }


    /**
     * bindWindowResize: Bind to the window resize event so we can recalculate
     *  the parentHeight and sticky offset. Namespace using the instance name
     *  so it's easier to destroy the event binding.
     */
    function bindWindowResize(instance) {
        $(window).on('resize.' + obj.name + '.' + instance.name, {instance: instance}, function (evt) {
            evt.data.instance.setParentHeight();
            evt.data.instance.setOffset();
        });
    }

    // attribute sets: supports backwards compatibility
    obj.attributeList = {
        'olive-sticky': {
            'sticky': 'olive-sticky',
            'location': 'olive-location',
            'container': 'olive-container',
            'onClass': 'olive-onClass',
            'initialized': 'olive-initialized'
        }
    };

    /**
     * @namespace
     * @property {string} [location="top"]      - Location of the sticky element. "top" || "bottom"
     * @property {string} [container="window"]  - container. Currently only works with "window"
     * @property {string} [stickClass]          - optional class to apply to the element when in "sticky" mode
     */
    obj.defaults = {
        attributes: obj.attributeList['olive-sticky'],
        location: 'top',
        container: 'window',
        onClass: null
    };

    obj.cssClasses = {
        'active': 'sticky',
        'locationTop': 'sticky--top',
        'locationBottom': 'sticky--bottom'
    };

    obj.init = function (element) {

        // create a new instance of the sticky object
        var instance = {
            sticky: $(element),
            settings: $.extend({}, obj.defaults)
        };

        if (instance.sticky.attr(instance.settings.attributes.initialized)) {
            return;
        }

        // determine if we are using the current attribute set or a legacy set
        instance.settings.attributes = Olive.util.determineAttributeSet(instance.sticky, obj.attributeList);

        // exit early if the correct attribute set is not available, or if the element has already been initialized
        if (!instance.settings.attributes) {
            return false;
        } else if (instance.sticky.attr(instance.settings.attributes.initialized)) {
            return false;
        }

        instance.name = instance.sticky.attr(obj.defaults.attributes.sticky);

        // get settings from attributes, or use defaults
        instance.settings.location = instance.sticky.attr(obj.defaults.attributes.location) || obj.defaults.location;

        instance.settings.onClass = instance.sticky.attr(obj.defaults.attributes.onClass) || obj.defaults.onClass;
        instance.currentlySticking = false;

        var containerSelector = instance.sticky.attr(obj.defaults.attributes.container)
            ? instance.sticky.attr(obj.defaults.attributes.container)
            : obj.defaults.container;

        instance.container = containerSelector === 'window'
            ? $(window)
            : $(containerSelector);


        /* Public Methods */


        /**
         * instance.setParentHeight: Calculate the height of the sticky and set it
         *  on the parent container so the content below doesn't jump
         */
        instance.setParentHeight = function () {

            //only apply a height if we're in sticky mode
            var height = instance.currentlySticking
                ? this.sticky.outerHeight()
                : '';

            this.sticky
                .parent()
                .css('height', height);

            return this;
        };


        /**
         * instance.setOffset: calculate the offset of the sticky
         *  so it maintains it's position on screen and container's width
         */
        instance.setOffset = function () {

            var width = '',
                offsetLeft = '';

            if (instance.currentlySticking) {
                width = this.sticky.parent().outerWidth();
                offsetLeft = this.sticky.parent().offset().left;
            }

            this.sticky.css({
                left: offsetLeft,
                width: width
            });
        };


        /**
         * instance.setPosition: Calculate if the sticky element is off screen,
         *  and will add/remove appropriate classes to make it sticky
         */
        instance.setPosition = function () {

            instance.counter++;

            var elementHeight = this.sticky.outerHeight(),
                elementOffsetTop = this.sticky.parent().offset().top,
                containerHeight = this.container.outerHeight(),
                containerScrollTop = this.container.scrollTop(),
                makeSticky = false,
                locationCss = null;

            // getting frameElement from the container will throw an exception if it is across domains
            try {
                if (this.container[0].frameElement) {
                    containerHeight = this.container[0].innerHeight;
                }
            } catch (err) {
                instance.destroy();
                Olive.log('Cannot get height of iframe because domains do not match. Disabling sticky for ' + instance.name);
                return;
            }

            if (this.settings.location === 'top') {

                locationCss = obj.cssClasses.locationTop;
                makeSticky = containerScrollTop > elementOffsetTop;

            } else if (this.settings.location === 'bottom') {

                locationCss = obj.cssClasses.locationBottom;
                makeSticky = (containerScrollTop + containerHeight) < (elementOffsetTop + elementHeight);
            }

            var classes = [
                obj.cssClasses.active,
                this.settings.onClass,
                locationCss
            ].join(' ');

            if (makeSticky && (!instance.currentlySticking)) {

                instance.currentlySticking = true;

                //must set parent height and offset before setting the "sticky" class
                instance.setParentHeight();
                instance.setOffset();

                this.sticky
                    .addClass(classes);

                $(window).trigger('position.sticky');

            } else if ((!makeSticky) && instance.currentlySticking) {

                instance.currentlySticking = false;

                instance.setParentHeight();
                instance.setOffset();

                this.sticky
                    .removeClass(classes);

                $(window).trigger('position.sticky');
            }

            return this;
        };


        /**
         * instance.destroy: destroy this instance of sticky
         */
        instance.destroy = function () {

            var classesToRemove = [
                obj.cssClasses.active,
                obj.cssClasses.locationBottom,
                obj.cssClasses.locationTop,
                this.settings.onClass
            ].join(' ');

            this.sticky
                .off('.' + this.name)
                .removeClass(classesToRemove)
                .removeAttr(instance.settings.attributes.initialized)
                .unwrap();

            //unbind scroll and touch events
            this.container.off('.' + this.name);

            if (Object.keys(obj.instances).indexOf(instance.name) > -1) {
                delete obj.instances[instance.name];
            }

            //unbind window resize event
            $(window).off('.' + instance.name);

            return this;
        };

        /* End Public Methods */


        // wrap sticky element in a div, which will get the height of the sticky element.
        instance.sticky.wrap(function () {
            return $('<div />');
        });

        // bind the scroll/touch events
        bindEvents(instance);

        // bind to window resize to reposition
        bindWindowResize(instance);

        // call this to intialize position
        instance.setPosition();

        // almost there... set the initialized attribute to prevent re-initialization
        instance.sticky.attr(obj.defaults.attributes.initialized, true);

        // ...and add this instance to the
        obj.instances[instance.name] = instance;

        return instance;
    };

    obj.initAll = function () {
        $('[' + obj.defaults.attributes.sticky + ']').each(function (i, v) {
            if (!($(this).attr(obj.defaults.attributes.initialized))) {
                obj.init(this);
            }
        });

        return;
    };

    Olive.sticky = obj;

    Olive.init.add(Olive.sticky.initAll);

    return;

}(window.Olive = window.Olive || {}, window.jQuery));

/**
 * Olive Tabs utility
 */

(function (Olive, $) {

    'use strict';

    var tabsObj = {};

    tabsObj.cssClasses = {
        "activeTab": "on"
    };

    // attribute sets: supports backwards compatibility
    tabsObj.attributeList = {
        "olive-tabset": {
            "tabset": "olive-tabset",
            "tabparent": "olive-tabset-parent",
            "tabid": "olive-tab-id",
            "initialized": "olive-tabs-initialized",
            "deprecated": false
        }
    };

    tabsObj.eventNames = {
        activate: 'activate.tab'
    };

    tabsObj.instances = {};

    /**
     * Olive.tabs.initialize: initializes tab behvior for a single tabset
     * @tabset {HTML element or jQuery object} the ul.tabs for this tabset
     */
    tabsObj.initialize = function (tabset) {

        var
            instance = {};

        instance.tabset = $(tabset);
        instance.currentTab = "";

        // determine if we are using the current attribute set or a legacy set
        instance.attrSet = Olive.util.determineAttributeSet(instance.tabset, tabsObj.attributeList);

        // exit early if the correct attribute set is not available, or if the element has already been initialized
        if (!instance.attrSet) {
            return false;
        } else if (instance.tabset.attr(instance.attrSet.initialized)) {
            return false;
        }

        instance.tabsetName = instance.tabset.attr(instance.attrSet.tabset);
        tabsObj.instances[instance.tabsetName] = instance;

        /**
         * instance.switchTo: makes a tab current and shows the associated content
         * @tabIdString {string} identifies the specific tab to switch to
         */
        instance.switchTo = function (tabIdString) {
            var
                tabId = String(tabIdString),
                allTabs,
                currentTab,
                allContent,
                currentContentSet;

            allTabs = instance.tabset.find('[' + instance.attrSet.tabid + ']');
            currentTab = allTabs.filter('[' + instance.attrSet.tabid + '="' + tabId + '"]');
            allContent = $('[' + instance.attrSet.tabparent + '="' + instance.tabsetName + '"]');
            currentContentSet = allContent.filter('[' + instance.attrSet.tabid + '="' + tabId + '"]');

            // if there are no tabs with the requested tab id, show the first one
            if (currentContentSet.length == 0) {
                currentTab = allTabs.eq(0);
                currentContentSet = allContent.eq(0);
                tabId = currentTab.attr(instance.attrSet.tabid);
            }

            instance.currentTab = tabId;
            allTabs.removeClass(tabsObj.cssClasses['activeTab']);
            currentTab.addClass(tabsObj.cssClasses['activeTab']);
            allContent.hide();
            currentContentSet.show();

            // fire an event that other JS libraries can hook into
            $(window).trigger(tabsObj.eventNames.activate, {
                'tabset': instance.tabsetName,
                'tabid': tabId
            });

            return instance;
        };

        // add delegated listener to the tabset
        instance.tabset.on('click', '[' + instance.attrSet.tabid + ']', function () {

            var tabId = $(this).attr(instance.attrSet.tabid);

            instance.switchTo(tabId);

            return instance;
        });

        // now that we are set up, make sure a tab is showing
        if (instance.tabset.find('.' + tabsObj.cssClasses['activeTab'] + '[' + instance.attrSet.tabid + ']').length) {
            instance.switchTo(instance.tabset.find('.' + tabsObj.cssClasses['activeTab'] + '[' + instance.attrSet.tabid + ']').eq(0).attr('' + instance.attrSet.tabid + ''));
        } else {
            instance.switchTo(instance.tabset.find('[' + instance.attrSet.tabid + ']').eq(0).attr('' + instance.attrSet.tabid + ''));
        }

        // set an "initialized" attribute to prevent re-initialization
        instance.tabset.attr(instance.attrSet.initialized, true);

        return instance;
    };

    /**
     * Olive.tabs.initializeAll: auto-initializes all uninitialized tabsets on the page
     */
    tabsObj.initializeAll = function () {

        var attrSet;
        for (attrSet in tabsObj.attributeList) {
            $('[' + attrSet + ']').each(function () {
                if (!($(this).attr(tabsObj.attributeList[attrSet].initialized))) {
                    tabsObj.initialize(this);
                }
            });
        }

        return;
    };

    Olive.tabs = tabsObj;

    Olive.init.add(Olive.tabs.initializeAll);

    return;

}(window.Olive = window.Olive || {}, window.jQuery));


/**
 * Olive Tooltip utility
 */

(function(Olive, $, undefined) {

    'use strict';

    var
        tooltipObj = {},
        cssClasses = {
                'activeTrigger':'tooltip_trigger-on',
                'contentHasTip':'tip',
                'contentHidden':'invisible'
        };

    Olive.popover.cssClasses['tooltip'] = cssClasses;

    // attribute sets: supports backwards compatibility
    tooltipObj.attributeList = {
        'olive-tooltip':{
            'tooltipName':'olive-tooltip',
            'popoverName':'olive-tooltip',
            'trigger':'olive-tooltip-trigger',
            'location':'olive-tooltip-position',
            'events':'olive-tooltip-events',
            'positionTo':'olive-tooltip-position-to',
            'noclose':'olive-tooltip-noclose',
            'childTo':'olive-child-to',
            'contentFor':'olive-tooltip-content-for',
            'delay':'olive-tooltip-delay',
            'fade':'olive-tooltip-fade',
            'animationModel':'olive-tooltip-animation-model',
            'initialized':'olive-tooltip-initialized',
            'deprecated':false
        }
    };

    tooltipObj.instances = {};

    // add the instances object to the global popover reference for instance types
    Olive.popover.popoverInstanceGroups['tooltip'] = tooltipObj.instances;

    /**
     * Olive.tooltip.initialize: wrapper function that initializes the tooltip
     *     as a popover, then adds tooltip-specific functionality
     * @param {HTML element or jQuery object} trigger - the trigger for this tooltip
     */
    tooltipObj.initialize = function(trigger) {

        var
            instance = {},
            configObj = {},
            openFunction;

        instance.trigger = $(trigger);

        // determine if we are using the current attribute set or a legacy set
        instance.attrSet = Olive.util.determineAttributeSet(instance.trigger, tooltipObj.attributeList);
    
        // exit early if the correct attribute set is not available, or if the element has already been initialized
        if (!instance.attrSet) {
            return false;
        } else if (instance.trigger.attr(instance.attrSet.initialized)) {
            return false;
        }

        // if no name is provided, use the title attribute to create a 'mini' style tooltip
        instance.isMini = !(Boolean(instance.trigger.attr(instance.attrSet.tooltipName)));
        if (instance.isMini) {
            tooltipObj.createMiniElement(instance.trigger, instance.attrSet);
        }

        instance = tooltipObj.initializePopover(instance);

        if (!instance) {
            return false;
        }

        tooltipObj.instances[instance.popoverName] = instance;

        // for mini tooltips, check to see if the title attribute has been updated
        // if so, recreate the content element
        if (instance.isMini) {
            openFunction = instance.open;

            instance.open = function(event) {
                var
                    newContentId;

                if (instance.trigger.attr('title') != undefined) {
                    instance.content.remove();
                    newContentId = (tooltipObj.createMiniElement(instance.trigger, instance.attrSet));
                    instance.content = $('#' + newContentId);
                }

                openFunction(event);

                return instance;
            };
        };

        /**
         * instance.afterOpen - popovers trigger this function after
         *     opening; using it to fire an event for other JS libraries to use
         */
        instance.afterOpen = function() {
            $(window).trigger('activate.tooltip', {
                'tooltip' : instance.popoverName
            });
            return instance;
        };

        /**
         * instance.afterClose - popovers trigger this function after
         *     closing; using it to fire an event for other JS libraries to use
         */
        instance.afterClose = function() {
            // fire an event that other JS libraries can hook into
            $(window).trigger('deactivate.tooltip', {
                'tooltip' : instance.popoverName
            });
            return instance;
        };

        return instance;
    };

    /**
     * Olive.tooltip.initializePopover: popover is the superclass for tooltips, so we
     *     add that functionality first
     * @param {object} instance - the instance as it exists so far
     */
    tooltipObj.initializePopover = function(instance) {
        var
            newInstance,
            defaultDelay,
            configObject = {};

        configObject['trigger'] = instance.trigger;
        configObject['contentId'] = instance.trigger.attr(instance.attrSet.tooltipName);
        configObject['popoverType'] = 'tooltip';
        configObject['location'] = instance.trigger.attr(instance.attrSet.location) || "above center";
        configObject['events'] = instance.trigger.attr(instance.attrSet.events) || "hover";
        configObject.fade = (instance.trigger.attr(instance.attrSet.fade) == "false") ? false : true;
        configObject['tip'] = (instance.isMini) ? 7 : 11;
        configObject['positionTo'] = instance.trigger.attr(instance.attrSet.positionTo) || instance.trigger;

        defaultDelay = (configObject['events'] == 'hover') ? 200 : 0;
        configObject.delay = instance.trigger.attr(instance.attrSet.delay) || defaultDelay;

        newInstance = Olive.popover.initialize(instance, configObject);

        return newInstance;
    };


    /**
     * Olive.tooltip.createMiniElement: creates a "mini" tooltip element if one is
     *     not available
     * @param {jQuery object} jqEle - the jQuery object containing the trigger element
     */
     tooltipObj.createMiniElement = function(jqEle, attrSet) {

         var
            i = 0,
            potentialId,
            presenceIndicator = 1,
            newDiv = document.createElement('div');

        while (presenceIndicator >= 0) {
            potentialId = String("miniTooltip" + i);
            presenceIndicator = Object.keys(Olive.popover.instances).indexOf(potentialId);
            i++;
        }

        newDiv.id = potentialId;
        newDiv.className = "invisible tooltip tooltip-mini tip";
        $(newDiv).text(jqEle.attr('title'));
        jqEle.attr(attrSet.tooltipName, potentialId);
        jqEle.removeAttr('title');

        document.body.appendChild(newDiv);

        return potentialId;

     };


    /** 
     * Olive.tooltip.initializeAll: auto-initializes all uninitialized tooltips on the page
     */
    tooltipObj.initializeAll = function() {

        for (var attrSet in tooltipObj.attributeList) {
            $('[' + attrSet + ']').each(function() {
                if (($(this).attr(tooltipObj.attributeList[attrSet].initialized) == undefined) ||
                ($(this).attr(tooltipObj.attributeList[attrSet].initialized).indexOf('tooltip') < 0)) {
                    tooltipObj.initialize(this);
                }
            });
        };

        return;
    };

    window.Olive.tooltip = tooltipObj;

    return;

})(window.Olive = window.Olive || {}, jQuery);

Olive.init.add(Olive.tooltip.initializeAll);

/**
 * Olive Tree element
 */

(function (Olive, $, undefined) {

    'use strict';
    
    var obj = {
        instances: {},
        name: 'tree'
    };
    
    
    /** 
     *  Attribute Sets: supports backwards compatibility
     *  @namespace
     *
     *  @property {string} tree         - Indicates the name of this tree. Set this on the root element of the component.
     *  @property {string} expandable   - Indicates this item can be expanded to reveal a nested list.
     *  @property {string} trigger      - Trigger to expand/collapse the node
     *  @property {string} initialized  - This attribute is automatically placed on the [olive-tree] element and indicates that it has already been initialized.
     */
    obj.attributeSets = {
        'olive-tree': {
            'tree': 'olive-tree',
            'expandable': 'olive-tree-expandable',
            'trigger': 'olive-tree-trigger',
            'initialized': 'olive-tree-initialized'
        }
    };



    /**
     *  Default settings.
     *  @namespace
     *
     *  @property {object} cssClasses
     *  @property {object} attributes
     */
    obj.defaults = {
        attributes: obj.attributeSets['olive-tree']
    };

    obj.cssClasses = {
        'item': 'tree_item',
        'isClosed': 'tree_item-isClosed',
        'isActive': 'tree_item-isActive',
        'trigger': 'tree_itemTrigger',
        'action': 'tree_itemAction',
        'triggerIconExpanded': 'icon-menu-triangle-down',
        'triggerIconCollapsed': 'icon-menu-triangle-right'
    },

    /**
     *  Initialize an element as a tree component
     *
     *  @param {object} element - DOM element to recieve initialization.
     */
    obj.init = function (element) {
        
        // create a new instance of the tree object
        var instance = {
            tree: $(element),
            settings: $.extend({}, obj.defaults)
        };
        
        // determine if we are using the current attribute set or a legacy set
        instance.settings.attributes = Olive.util.determineAttributeSet(instance.tree, obj.attributeSets);
        
        // exit early if the correct attribute set is not available, or if the element has already been initialized
        if (!instance.settings.attributes) {
            return false;
        } else if (instance.tree.attr(instance.settings.attributes.initialized)) {
            return false;
        }
        
        // set the name of this instance from the "olive-tree" attribute
        instance.name = instance.tree.attr(instance.settings.attributes.tree);
        
        
        
        /**
         *  Toggles the expanded/collapsed state of the node.
         *
         *  @param {object} jqNode - jQuery object of the node to be opened/closed
         */
        instance.toggleNode = function (jqNode) {
            var isClosed = jqNode.hasClass(obj.cssClasses.isClosed);
            
            if (isClosed) {
                instance.openNode(jqNode);
            } else {
                instance.closeNode(jqNode);
            }
        };
        
        
        
        /**
         *  Opens the node.
         *
         *  @param {object} jqNode - jQuery object of the node to be opened.
         */
        instance.openNode = function (jqNode) {
            
            jqNode.removeClass(obj.cssClasses.isClosed);
            
            jqNode.find('[' + instance.settings.attributes.trigger + ']')
                .removeClass(obj.cssClasses.triggerIconCollapsed)
                .addClass(obj.cssClasses.triggerIconExpanded);
            
            var jqParent = jqNode.closest('ul').siblings('[' + instance.settings.attributes.expandable + ']');
            if (jqParent.length) {
                instance.openNode(jqParent);
            }
        };
        
        
        
        /**
         *  Closes the node.
         *
         *  @param {object} jqNode - jQuery object of the node to be closed.
         */
        instance.closeNode = function (jqNode) {
            
            jqNode.addClass(obj.cssClasses.isClosed);
            
            jqNode.find('[' + instance.settings.attributes.trigger + ']')
                .removeClass(obj.cssClasses.triggerIconExpanded)
                .addClass(obj.cssClasses.triggerIconCollapsed);
        };
        
        instance.tree.on('click', '[' + instance.settings.attributes.trigger + ']', function (evt) {
            
            var jqTrigger = $(this);
            var jqNode = jqTrigger.closest('[' + instance.settings.attributes.expandable + ']');
            
            instance.toggleNode(jqNode);
            
            //TODO: emit open/close event
        });

        //select the item when clicked
        instance.tree.on('click', '.' + obj.cssClasses.item, function(evt) {
            //make sure it's not actually the trigger or action icon that was clicked
            var isItemClick = !$(evt.target).hasClass(obj.cssClasses.action)
                && !$(evt.target).hasClass(obj.cssClasses.trigger);

            if (isItemClick) {
                instance.tree.find('.' +obj.cssClasses.isActive).removeClass(obj.cssClasses.isActive);
                $(this).addClass(obj.cssClasses.isActive);

            }
        });

        // almost there... set the initialized attribute to prevent re-initialization
        instance.tree.attr(obj.defaults.attributes.initialized, true);

        // ...and add this instance to the 
        obj.instances[instance.name] = instance;

        return instance;
    };
    
    
    
    /**
     *  Auto-initializes all uninitialized tree elements on the page by targeting the "olive-tree" attribute.
     */
    obj.initializeAll = function () {
        
        for (var attrSetName in obj.attributeSets) {
            var attrSet = obj.attributeSets[attrSetName];
            $('[' + attrSet.tree + ']').each(function (i, v) {
                if (!($(this).attr(attrSet.initialized))) {
                    obj.init(this);
                }
            });
        };

        
        return;
    };
    
    window.Olive.tree = obj;

    return;

})(window.Olive = window.Olive || {}, jQuery);

Olive.init.add(Olive.tree.initializeAll);

/**
 * Olive Utility methods
 */

(function(Olive, $, undefined) {
    var uniqueId = 0;
    var utilObj = {};


    /**
     * Olive.util.determineAttributeSet - determines which set of possible groups
     *     of attributes should be used to initialize the current instance. used
     *     for backward compatibility with legacy attribute names
     * @jqElement {jQuery object} the element used to initialize the instance
     * @attributeSets {object} a set of key-value pairs where the key is the main
     *     attribute used for initialization and the value is an object with the full
     *     set of associated attributes
     */
    utilObj.determineAttributeSet = function (jqElement, attributeSets) {

        var
            setKey;

        for (setKey in attributeSets) {
            if (jqElement.attr(setKey) !== undefined) {
                if (attributeSets[setKey].deprecated) {
                    Olive.dev.log("Warning: using deprecated attribute - " + setKey);
                }
                return attributeSets[setKey];
            }
        }

        return false;
    };


    /**
     * Olive.util.removeTextNodes - removes all text nodes which are immediate children
     *     of the passed element. This can be useful to prevent whitespace from causing
     *     layout issues with inline-block elements that should be adjacent to one another,
     *     but needs to be used judiciously
     * @element {HTML element or jQuery object} the parent element to remove text nodes from
     */
    utilObj.removeTextNodes = function(element) {

        var
            htmlElement = $(element)[0],
            directChildren = htmlElement.childNodes;
        
        for (var i=(directChildren.length - 1); i>=0; i--) {
            if (directChildren[i].nodeType == 3) {
                htmlElement.removeChild(directChildren[i]);
            };
        }

        return;
    };

    utilObj.getUniqueId = function(){
        return uniqueId++;
    };
    
    
    
    /**
     *  Polyfill .site-fit Layout
     *
     *  The "site-fit" layout uses flexbox, which is not supported in older
     *  browsers (IE9 and below). This is a JS solution to apply appropriate
     *  heights to make sure the layout behaves correctly.
     */
    utilObj.polyfillSiteFitLayout = function () {
        
        var css = {
            siteFit: 'site-fit',
            header: 'site_header',
            toolbar: 'site_toolbar',
            footer: 'site_footer',
            sidebar: 'content_sidebar',
            main: 'content_main',
            scrollable: 'content-scrollable'
        };
        
        /*
         *  Exit early if...
         *  1. Modernizr not present
         *  2. The browser already supports flexbox
         *  3. There is no ".site-fit" element to adjust
         */
        if (!window.Modernizr
                || window.Modernizr.flexbox
                || !$('.' + css.siteFit).length) {
            return;
        }
        
        function adjustLayout() {
            
            var windowHeight = $(window).height(),
                headerHeight = $('.' + css.header).outerHeight(),
                toolbarHeight = $('.' + css.toolbar).outerHeight(),
                footerHeight = $('.' + css.footer).outerHeight(),
                contentHeight = windowHeight - headerHeight - toolbarHeight - footerHeight;
            
            // first set the window height on the .site-fit element
            $('.' + css.siteFit).height(windowHeight);
            
            // now set the content height on both the sidebar and main elements
            $('.' + css.siteFit).find('.' + css.sidebar + ' , .' + css.main).each(function (i, el) {
                
                var area = $(el);
                
                area.height(contentHeight);
                
                if (!area.children('.' + css.scrollable).length) {
                    
                    // create the inner element that will actually be the one to scroll
                    var wrap = $('<div />', {
                        'class': css.scrollable
                    });
                    
                    area.wrapInner(wrap);
                }
            });
        }

        $(window).on({
            'resize': adjustLayout,
            'show.siteMessage.olive': adjustLayout,
            'close.siteMessage.olive': adjustLayout
        });
        
        //wrap in a setTimeout so it runs at the end of the queue, ensuring all HTML has rendered
        setTimeout(adjustLayout);
    };
    

    window.Olive.util = utilObj;

    return;


})(window.Olive = window.Olive || {}, window.jQuery);

/**
 * Shane is a hard ass.
 */

(function(Olive, $){

  'use strict';

  var _Considerable = function(options){
    if (!options) {
      options = {};
    }
    this._id = Olive.util.getUniqueId();
    this._active = !(options.active === false);
    this._name = options.name || 'untitled';
  }
  $.extend(_Considerable.prototype, Olive.events)

  _Considerable.prototype._getId = function(){
    return this._id;
  };
  _Considerable.prototype.getName = function(){
    return this._name;
  };
  _Considerable.prototype.deactivate = function(){
    this._active = false;
  };
  _Considerable.prototype.activate = function(){
    this._active = true;
  }
  _Considerable.prototype.shouldConsider = function(){
    return this._active;
  };




  var Input = function(options){
    _Considerable.prototype.constructor.apply(this, arguments)

    if (!options) {
      options = {};
    }

    this._errorMessage = options.errorMessage || this.getName() + ' was invalid.';
    this._priority = options.priority || 1;
    this._fn = options.isValid;

    if (typeof this._fn !== 'function'){
      throw new Error('Input instance has nothing to validate itself with.')
    }

  }
  Input.prototype = Object.create(_Considerable.prototype)

  Input.prototype.getValidationError = function(){
    return new Error('Validation Error: ' + this.getName() + ' - ' + this.getErrorMessage());
  };
  Input.prototype.getErrorMessage = function (){
    return (typeof this._errorMessage === 'string') ? this._errorMessage : this._errorMessage();
  };
  Input.prototype.isValid = function(){
    return !this.shouldConsider() || !!this._fn();
  }
  Input.prototype.getPriority = function(){
    return this._priority;
  }



  var Form = function(options){
    _Considerable.prototype.constructor.apply(this, arguments)

    if (!options) {
      options = {};
    }

    this._forms = {};
    this._inputs = {};

  }
  Form.prototype = Object.create(_Considerable.prototype)

  Form.prototype.isValid = function(){
    return !this.getInvalids().length;
  }

  Form.prototype._queryChildInputs = function(filter){
    var foundInputs = [];
    var form, input, i;
    if (!this.shouldConsider()) {
      return foundInputs;
    }
    for (i in this._inputs){
      input = this._inputs[i];
      if (input.shouldConsider() && filter(input)){
        foundInputs.push(input);
      }
    }
    for (i in this._forms){
      form = this._forms[i];
      foundInputs = foundInputs.concat(form._queryChildInputs(filter));
    }
    return foundInputs;
  };

  Form.prototype.getValids = function(){
    return this._queryChildInputs(function(input){
      return input.isValid();
    });
  }
  Form.prototype.getInvalids = function(){
    return this._queryChildInputs(function(input){
      return !input.isValid();
    });
  }

  Form.prototype._considersForm = function(considerable){
    if (!(considerable instanceof Form)){
      throw new TypeError(considerable + ' is not an instance of Form.');
    }
    if (this._forms[considerable._getId()]) {
      return true;
    } else {
      var doesConsider = false
      for (var i in this._forms){
        var form = this._forms[i];
        doesConsider = doesConsider || form._considersForm(considerable);
      }
      return doesConsider;
    }
  }

  Form.prototype.consider = function(considerable){
    if (considerable instanceof Form) {
      if (considerable._considersForm(this)){
        throw new Error('Circular validation found.')
      } else {
        this._forms[considerable._getId()] = considerable;
      }
    } else if (considerable instanceof Input) {
      this._inputs[considerable._getId()] = considerable;
    } else {
      throw new TypeError(considerable + ' is not considerable.');
    }
  };

  Form.prototype.unconsider = function(considerable){
    if (considerable instanceof Input) {
      var hasInput = !!this._inputs[considerable._getId()];
      delete this._inputs[considerable._getId()];
      return hasInput;
    } else if (considerable instanceof Form) {
      var hasForm = !!this._forms[considerable._getId()];
      delete this._forms[considerable._getId()];
      return hasForm;
    } else {
      throw new TypeError(considerable.constructor.name + ' is not considerable.');
    }
  };

  Olive._Considerable = _Considerable;
  Olive.Form = Form;
  Olive.Input = Input;

})(window.Olive = window.Olive || {}, jQuery);

/**
 * Olive Accessibility utilities specific for menus
 */
(function (Olive, $) {

    'use strict';

    var menus = {};

    /**
        setAriaAttribtues - sets ARIA and role attributes on the trigger, menu,
            and menuItem elements, so screen readers will correctly announce
            when the context has switched to a menu
     */
    function setAriaAttributes(trigger, content) {

        trigger.attr('aria-haspopup', 'true');

        content
            .find('ul, .menu_list')
            .attr('role', 'menu')
            .attr('aria-labelledby', trigger.text());

        content.find('li, .menu_listItem').attr('role', 'menuitem');

    }



    /**
        Toggle the visibility of the menu

        If this menu is a child of a menubar/navigation, we don't want to set
        the aria-hidden attribute, because we want a screen reader to always
        be able to announce this menu because it is used for navigation.
     */
    function toggleAriaAttributes(trigger, content, isOpen) {
        trigger.attr('aria-expanded', isOpen);

        if (content.closest('[role="menubar"]').length) {
            content.attr('aria-hidden', !isOpen);
        }
    }



    /**
        initKeyboardNav - adds keyboard support and allows the user to
            navigate focusable elements within a wrapper with the up/down
            arrows
     */
    function initKeyboardNav(wrapper, enable) {

        //reset
        wrapper.off('.oliveKeyboardNav');

        if (!enable) {
            return;
        }

        wrapper.on('keydown.oliveKeyboardNav', function (e) {

            // get the focusable elements every time in case something new had become visible
            var focusableElements = Olive.accessibility.getFocusableElements(wrapper),
                first = focusableElements.first(),
                last = focusableElements.last();

            if (e.which === Olive.KEYS.down) {

                e.stopPropagation();
                e.preventDefault();

                if (last.is(e.target)) {
                    // if last item, go to first
                    first.focus();
                } else {
                    // else go to next
                    var nextIndex = focusableElements.index(e.target) + 1;
                    focusableElements.eq(nextIndex).focus();
                }

            } else if (e.which === Olive.KEYS.up) {

                e.stopPropagation();
                e.preventDefault();

                if (first.is(e.target)) {
                    // if first item, go to last
                    last.focus();
                } else {
                    // else go to previous
                    var prevIndex = focusableElements.index(e.target) - 1;
                    focusableElements.eq(prevIndex).focus();
                }

            }

        });

    }



    menus.initialize = function (trigger, content) {
        setAriaAttributes(trigger, content);
        toggleAriaAttributes(trigger, content, false);

        initKeyboardNav(content, true);
    };



    menus.onOpen = function (trigger, content) {
        toggleAriaAttributes(trigger, content, true);
        Olive.accessibility.setAutoFocus(content);
    };



    menus.onClose = function (trigger, content) {
        toggleAriaAttributes(trigger, content, false);
    };



    Olive.accessibility.menus = menus;

    return;

}(window.Olive = window.Olive || {}, window.jQuery));

/**
 * Olive Accessibility utilities specific for messages
 */
(function (Olive, $) {

    'use strict';

    var messages = {};

    /**
     *  setAriaAttributes - set appropriate attributes on the container element
     *      that will help a screen reader announce when new messages are added
     *  @param {Object} container - jQuery object of the container element
     */
    messages.setAriaAttributes = function (container) {
        container
            .attr('role', 'alert')
            .attr('aria-atomic', 'true');
    };

    Olive.accessibility.messages = messages;

    return;

}(window.Olive = window.Olive || {}, window.jQuery));

/**
 *
 * This file is auto-generated. Do not modify.
 *
 * olive.colors.js
 * @version 16.17.0
 * @built Tue Apr 26 2016 20:44:10 GMT+0000 (UTC)
 * @copyright DocuSign Inc
 *
 * Compiled from:
 * @template build/templates/olive.colors.js
 * @data ./build/data/extended-colors.json
 *
 */
(function (Olive) {
    
    'use strict';
    
    Olive.colors = [
    {
            name: 'ext0',
            order: '0',
            color: '#ffe084',
            border: '#dbc071'
        },{
            name: 'ext1',
            order: '1',
            color: '#c0dcec',
            border: '#a5bdcb'
        },{
            name: 'ext2',
            order: '2',
            color: '#f8cac1',
            border: '#d5ada6'
        },{
            name: 'ext3',
            order: '3',
            color: '#cbebb8',
            border: '#aeca9e'
        },{
            name: 'ext4',
            order: '4',
            color: '#ffba8c',
            border: '#dba078'
        },{
            name: 'ext5',
            order: '5',
            color: '#c4d1e9',
            border: '#a8b3c8'
        },{
            name: 'ext6',
            order: '6',
            color: '#ecddb6',
            border: '#cbbe9c'
        },{
            name: 'ext7',
            order: '7',
            color: '#ced9c9',
            border: '#b1baad'
        },{
            name: 'ext8',
            order: '8',
            color: '#c1e6e8',
            border: '#a6c6c7'
        },{
            name: 'ext9',
            order: '9',
            color: '#ffd99f',
            border: '#dbba89'
        },
    ];

})(window.Olive = window.Olive || {});
/**
 *
 * This file is auto-generated. Do not modify.
 *
 * olive.version.js
 * @version 16.17.0
 * @built Tue Apr 26 2016 20:44:10 GMT+0000 (UTC)
 * @copyright DocuSign Inc
 *
 * Compiled from:
 * @template build/templates/olive.version.js
 * @data ./package.json
 *
 */
(function (Olive, undefined) {
    
    Olive.version = '16.17.0';

})(window.Olive = window.Olive || {});
angular.module('ds.olive', []);

// Disable auto initialize of components and let the Angular directives handle it.
Olive.config.isAutoInitEnabled = false;

// Disable automatically running the site-fit polyfill. Instead call it in the $viewContentLoaded event.
Olive.config.isSiteFitPolyfillEnabled = false;

angular.module('ds.olive').factory('oliveInitComponent', function($timeout) {

    return function() {
        var initObj = {};

        initObj.numTries = 0;
        initObj.maxTries = 10;

        /**
         * initObj.oliveInitFunction - dummy function. for each individual linking
         *     function, will be overwritten with the specific Olive component's 
         *     initialization function. Ex: Olive.tooltip.initialize(element)
         * @param {HTML element} element - the DOM element that triggered initialization
         */
        initObj.oliveInitFunction = function(element) {
            return false;
        };


        /**
         * initObj.checkDependencies - dummy function. for each individual linking
         *     function, will be overwritten with a custom function that ensures all
         *     related elements are present in the DOM before trying to initialize
         *     the instance
         * @param {Angular scope} scope - scope, as passed in by the linking function
         * @param {HTML element} element - the DOM element that triggered initialization
         * @param {object} attr - the attribute object passed in by the linking function
         */
        initObj.checkDependencies = function(scope, element, attr) {
            return false;
        };


        /**
         * initObj.tryInitialize - checks to see if dependencies are met. If they
         *     are, runs the initialization function. Otherwise, queues another
         *     attempt for the next digest cycle. Used as part of the directive's
         *     linking function for initializing Olive components with Angular
         * @param {Angular scope} scope - scope, as passed in by the linking function
         * @param {HTML element} element - the DOM element that triggered initialization
         * @param {object} attr - the attribute object passed in by the linking function
         */
        initObj.tryInitialize = function(scope, element, attr) {

            if (initObj.checkDependencies(scope, element, attr)) {
                var thisInstance = initObj.oliveInitFunction(element);
                scope.$on('$destroy', function() {
                    if (thisInstance) {
                        thisInstance.destroy();
                    }
                });
            } else if (initObj.numTries < initObj.maxTries) {
                initObj.numTries++;
                $timeout(function(){
                    initObj.tryInitialize(scope, element, attr);
                });
            }
        };
    return initObj;
    };

});
angular.module('ds.olive').directive('oliveAccordion', function ($timeout, oliveInitComponent) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
        
            var
                accordionAttrSet = Olive.accordion.attributeList["olive-accordion"],
                init = oliveInitComponent();

            init.oliveInitFunction = Olive.accordion.initialize;

            init.checkDependencies = function() {

                var
                    drawerName = attr.oliveAccordion,
                    drawerElement = $("[olive-drawer-name='" + drawerName + "']");

                if (!(drawerElement.length)) {
                    return false;
                } else {
                    return Boolean(drawerElement.find(".drawer-wrapper"));
                }
            };
            
            $timeout(function() {
                init.tryInitialize(scope, element, attr);
            });

        }
    };
});

angular.module('ds.olive').directive('dsButtonLoading', [ function () {
  return {
    restrict: 'A',
    scope: {
      loading: '=dsButtonLoading',
      loadingText: '@',
      defaultText: '@'
    },
    link: function (scope, element, attributes) {
      var element = element[0],
          showLoading = scope.loading,
          loadingText = scope.loadingText,
          originalText = scope.defaultText;

      element.textContent = originalText;

      scope.$watch('loading', function(newLoading) {
        if (loadingText && showLoading != newLoading) {
          showLoading = newLoading
          if (newLoading) {
            element.textContent = loadingText;
            attributes.$set('disabled', 'disabled');
          } else {
            element.removeAttribute('disabled');
            element.textContent = originalText;
          }
        }
      });
    }
  };
}]);

angular.module('ds.olive').directive('dsCal', ['$parse', function ($parse) {
  return {
    restrict: 'A', // decorates <input ds-cal /> with new behavior
    link: function (scope, elm, attr) {
      var cur = -1, prv = -1;
      var isSingleDatepicker = (attr.dsType == "single");

      var $ds;
      var $dsRangeStart = $(elm).find('.ds-range-start');
      var $dsRangeEnd = $(elm).find('.ds-range-end');

      var $dsRangeStartIcon = $(elm).find("[ds-cal-start-date-icon]");
      var $dsRangeEndIcon = $(elm).find("[ds-cal-end-date-icon]");


      var $dsCalIcon = $(elm).find('.icon-field-date');

      var $dsInput = $(elm).find('.input');
      var datepickerSettings = {
        maxDate: moment().toDate(),
        showAnim: '',
        dayNamesMin: moment.weekdaysMin(),
        monthNames: $.map(moment.monthsShort(), function (month) {
          return month.toUpperCase();
        })
      };
      if(attr.dsFutureAllowed){
        datepickerSettings.maxDate = undefined;
      }
      if(attr.dsDisablePast){
        datepickerSettings.minDate = moment().add(1, 'days').toDate();
      }
      if(attr.dsMaxFutureDate){
        datepickerSettings.maxDate = moment(parseInt(attr.dsMaxFutureDate)).toDate();
      }

      // supports adding a noclose attribute, so that clicking on 
      // the calendar will not close a parent popover (ex: cheshire)
      if(attr.dsPopoverNoclose){
        $dsNocloseInstance = attr.dsPopoverNoclose;
        $dsNocloseAttr = "";
      } else {
        var foundInstance = Olive.popover.findAssociatedPopover(elm);
        if (foundInstance) {
          $dsNocloseInstance = foundInstance.popoverName;
          $(elm).attr('ds-popover-noclose', $dsNocloseInstance);
        } else {
          $dsNocloseInstance = false;
        }
      }

      $(elm).css({position:'relative'});

      $(elm).append('<div class="datepicker-wrapper ' + (isSingleDatepicker ? 'single' : 'range') + '"></div>');
      $ds = $(elm).find('.datepicker-wrapper');

      if (attr.dsType == "single") {
        updateSingle = function(date){
          $parse($dsInput.attr('ng-model')).assign(scope, date);
        };
        jQuery.extend(datepickerSettings, {
          setDate: null,
          onSelect: function(dateText) {
            var selectedDate = moment(dateText, 'L').toDate();

            updateSingle($.datepicker.formatDate('mm/dd/yy', selectedDate, {}));
            scope.$apply();
            $ds.datepicker().hide();

            // emit with string, "single date"
            scope.$emit("dateSingleFilterChange", selectedDate.toISOString());
            $(document).off('click', checkDatepickerDismiss);
          }
        });
      }
      else if (attr.dsType == "range") {
        updateRangeStart = function(date){
          $parse($dsRangeStart.attr('ng-model')).assign(scope, date);
        };

        updateRangeEnd = function(date){
          $parse($dsRangeEnd.attr('ng-model')).assign(scope, date);
        };

        jQuery.extend(datepickerSettings, {
          numberOfMonths: 2,
          // supports optionally adding a popover noclose attribute to the calendar.
          // .ui-corner-all elements get removed from the DOM, so this ensures that
          // they have the proper noclose attribute at the right time
          onChangeMonthYear: function() {
            if ($dsNocloseInstance && Olive.popover.instances[$dsNocloseInstance]) {
              var nocloseAttr = Olive.popover.instances[$dsNocloseInstance].attrSet.noclose;
              $ds.attr(nocloseAttr, $dsNocloseInstance)
              $ds.find('.ui-corner-all').attr(nocloseAttr, $dsNocloseInstance);
            }
          },
          beforeShow: function() {
            if ($dsNocloseInstance && Olive.popover.instances[$dsNocloseInstance]) {
              var nocloseAttr = Olive.popover.instances[$dsNocloseInstance].attrSet.noclose;
              $ds.attr(nocloseAttr, $dsNocloseInstance)
            }
          },
          beforeShowDay: function(date) {
            var rangeClass;
            var mDate = moment(date);
            var minDate = moment($dsRangeStart.val(), 'L').toDate();
            var maxDate = moment($dsRangeEnd.val(), 'L').toDate();

            rangeClass = mDate >= minDate && mDate <= maxDate ? 'date-range-selected' : '';
            rangeClass += mDate.diff(minDate, 'days') < 1 && mDate.diff(minDate, 'days') >= 0 ? ' date-range-start' : '';
            rangeClass += mDate.diff(maxDate, 'days') < 1 && mDate.diff(maxDate, 'days') >= 0 ? ' date-range-end' : '';
            return [true, rangeClass];
          },
          onSelect: function(dateText, inst) {
            prv = cur;
            cur = moment([inst.selectedYear,inst.selectedMonth,inst.selectedDay]).toDate();

            if (prv === -1 || prv === cur) {
              prv = cur;
              var formattedDateText = moment(dateText).format('L');
              updateRangeStart(formattedDateText);
              $ds.datepicker().addClass('pick-range-end');
              $dsRangeEnd.focus();
              scope.$apply()
            } else {
              rangeMin = moment(Math.min(prv, cur));
              rangeMax = moment(Math.max(prv, cur));
              // user is setting an explict range-end
              if($ds.datepicker().hasClass('pick-range-end')){
                rangeMin = moment($dsRangeStart.val(), 'L');
                rangeMax = moment(cur);
                if(rangeMax < rangeMin){
                  prv = cur;
                  updateRangeStart('');
                  updateRangeEnd(moment(rangeMax).format('L'));
                  scope.$apply();
                  $ds.datepicker().removeClass('pick-range-end');
                  $ds.datepicker().hide();
                  $(document).off('click', checkDatepickerDismiss);
                  $dsRangeStart.focus();
                  return;
                }
              }
              updateRangeStart(rangeMin.format('L'));
              updateRangeEnd(rangeMax.format('L'));
              // hide datepicker when range in place
              $ds.datepicker().removeClass('pick-range-end');
              $ds.datepicker().hide();
              // emit with array of size 2, [min,max] range
              scope.$emit("dateRangeFilterChange");
              $(document).off('click', checkDatepickerDismiss);

              // propogate changes back to angular
              scope.$apply()
            }
          }
        });
      }

      // jQuery UI range enhancement from: http://bseth99.github.io/projects/jquery-ui/4-jquery-ui-datepicker-range.html
      $ds.datepicker(datepickerSettings);

      var datepicker = $ds.datepicker();
      $ds.each(function (index) {
        var wrapper = $ds.eq(index);
        var overflow = wrapper.datepicker().offset().left + wrapper.datepicker().width() - $(window).width();
        if (overflow > 0) {
          wrapper.css({right: '0'});
        }
      });

      $ds.datepicker().hide();

      checkDatepickerDismiss = function(event){
        var isClickedElementChildOfPopup = $ds
          .find(event.target)
          .length > 0;

        // not clicking inside the datepicker or the 'from','to' input boxes or 'prev month','next month' month buttons
        if (!isClickedElementChildOfPopup
          && !$(event.target).is('.ds-range-start, .ds-range-end, .input, .icon-field-date')
          && !$(event.target.parentElement).is('.ui-datepicker-prev, .ui-datepicker-next')
          && !$(event.target).is('.ui-datepicker-prev, .ui-datepicker-next')
          )
        {
          $('.datepicker-wrapper').datepicker().hide();
          $(document).off('click', checkDatepickerDismiss);
        }
        return;
      };

      setupStartRange = function(e) {
        var startDate = moment(this.value);
        var endDate = moment($dsRangeEnd.val(), 'L');
        try {
          if (startDate.isValid()) {
            prv = startDate.toDate();
          }
          if (endDate.isValid()) {
            cur = endDate.toDate();
          }
        } catch (_error) {
          cur = prv = -1;
        }

        setupDatepicker();

        $(document).on("keydown", function(e) {
          if (e.which === 13 || e.which === 9) {
            curDate = moment($dsRangeStart.val(), 'L').toDate();
            if (curDate)
              cur = curDate;
              $dsRangeEnd.focus();
          }
        });
      };

      setupEndRange = function(e) {
          var startDate = moment($dsRangeStart.val(), 'L');
          var endDate = moment(this.value, 'L');
          try {
            if (endDate.isValid()) {
              cur = endDate.toDate();
            }
            if (startDate.isValid()) {
              prv = startDate.toDate();
            }
          } catch (_error) {
            cur = prv = -1;
          }

          setupDatepicker();
          $ds.datepicker().addClass('pick-range-end');

          $(document).on("keydown", function(e) {
            if (e.which === 13) {
              $ds.datepicker().hide()
            }
          });
        };

      setupDatepicker = function(){
        if (cur > -1) {
          $ds.datepicker('setDate', cur);
        }

        $ds.datepicker().removeClass('pick-range-end');
        $(".datepicker-wrapper").css({top: '27px'});

        $ds.datepicker('refresh').show(100,function(){
          $(document).off('click', checkDatepickerDismiss);
          $(document).on('click', checkDatepickerDismiss);
        });

      };
      setupSingleCal = function(e) {
        $(".datepicker-wrapper").css({top: '27px'});
        $ds.datepicker('refresh').show(100,function(){
          $(document).off('click', checkDatepickerDismiss);
          $(document).on('click', checkDatepickerDismiss);
        });
      };

      if (attr.dsType == "single") {
        $dsInput.on('focus', setupSingleCal);
        if($dsCalIcon.length > 0){
          $dsCalIcon.on('click', setupSingleCal);
        }
      }
      else if (attr.dsType == "range") {
        $dsRangeStart.on('focus', setupStartRange);
        $dsRangeEnd.on('focus', setupEndRange);
        if($dsRangeStartIcon.length > 0){
          $dsRangeStartIcon.on('click', function(){$dsRangeStart.focus();});
        }
        if($dsRangeEndIcon.length > 0){
          $dsRangeEndIcon.on('click', function(){$dsRangeEnd.focus();});
        }
      }

      scope.$on('$destroy', function() {
        $(document).off('click', checkDatepickerDismiss);
        $ds.datepicker('hide');
        $ds.datepicker('destroy');
      });
    }
  };
}]);


angular.module('ds.olive').directive('inputCb', [function () {
  return {
    restrict: 'C', // decorates <input class="input-cb"> with new behavior
    link: function (scope, elm, attr) {
      
        elm.on('click', function() {
            if (!elm.closest('th') && !elm.closest('thead')) {
                elm.closest('tr').toggleClass("selected row-selected");
            }
        });

      // when bound to angular model, trigger change event to update styling
      if (attr.ngModel) {
        scope.$watch(attr.ngModel, function () {
          elm.change();
        });
      }

      elm.change(function () {
        var isChecked = elm.is(':checked');
        elm.toggleClass('checked', isChecked);
      });
    }
  };
}]);
angular.module('ds.olive').directive('oliveCheshire', function ($timeout, oliveInitComponent) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {

            var init = oliveInitComponent();
            init.oliveInitFunction = Olive.cheshire.init;

            // for cheshire: dependencies met if there is a trigger for this instance
            init.checkDependencies = function(scope, element, attr) {
                var
                    cheshireName = $(element).attr('olive-cheshire');
                return Boolean($("[olive-cheshire-trigger='" + cheshireName + "']").length);
            };

            $timeout(function() {
                init.tryInitialize(scope, element, attr);
            });
        }
    };
});


angular.module('ds.olive').directive('dsDatatable', [function () {
    return {
        restrict: 'A',
        link: function (scope, elm, attr) {
            $(elm).on('click', '.sort', function() {
                var sortDir = $(this).find('.dir');

                if(!sortDir.length) {
                    var text = $(this).html();
                    sortDir = $('<span class="dir" />').html(text);
                    $(this).html(sortDir);
                }

                sortDir.toggleClass(function() {
                    if(!sortDir.hasClass('asc') && !sortDir.hasClass('desc')) {
                        return 'asc';
                    }
                    return 'asc desc';
                });
            });
        }
    };
}]);
angular.module('ds.olive').service('Debounce', function () {
  return function (timeMs, eventNameOrCb) {
    var timeout = null;
    return function () {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(function() {
        if (typeof eventNameOrCb === 'function ') {
          eventNameOrCb();
        }
        else if (typeof eventNameOrCb === 'string') {
          $(window).trigger(eventNameOrCb);
        }
        timeout = null;
      }, timeMs);
    };
  };
});

angular.module('ds.olive')
.directive('dsDrag', ['$rootScope', '$parse', '$compile', function ($rootScope, $parse, $compile) {
  return {
    restrict: 'A',

    link: function (scope, element, attrs) {
      var options = $parse(attrs.dsDragOptions || '')(scope) || {};
      var ctx = options.context;
      var type = options.type ? '.' + options.type : '';
      var args = {
        cursorAt: {
          top: 5,
          left: 5,
        },
        refreshPositions: true,
        revert: options.revert || false,
        zIndex: 10000,
        scroll: true,
        containment: 'body',
        start : function () {
          $rootScope.$broadcast('ds.drag.start' + type, ctx);
        },
        stop : function () {
          $rootScope.$broadcast('ds.drag.stop' + type, ctx);
        }
      };
      if (options.helper) {
        args.helper = options.helper;
      }
      else if (attrs.dsDrag && attrs.dsDrag.length) {
        args.helper = function () {
          var tooltipDom = $compile("<div class='drag-tooltip'><div ng-include=\"'" + attrs.dsDrag + "'\" ></div></div>")(scope);
          scope.$$phase || scope.$apply();
          return $(tooltipDom)
        }
      }
      element.draggable(args)
      if (options.disable) {
        element.draggable("disable");
      }
    }
  };
}])
.directive('dsDrop', ['$rootScope', '$parse', function ($rootScope, $parse) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var options = $parse(attrs.dsDropOptions)(scope) || {};
      var ctx = options.context;
      var type = options.type ? '.' + options.type : '';

      element.droppable({
        hoverClass : "dragHover",
        tolerance : "pointer",
        accept: options.accept || '*',
        drop : function( event ) {
          $rootScope.$broadcast('ds.drag.drop' + type, ctx)
          return
        },
        over : function( event ) {
          $rootScope.$broadcast('ds.drag.over' + type, ctx)
          return
        },
        out : function( event ) {
          $rootScope.$broadcast('ds.drag.out' + type, ctx)
          return
        }
      })
      if (options.disable) {
        element.droppable("disable");
      }
    }
  };
}])
.directive('dsSidebarHeight', ['$rootScope', function ($rootScope) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {

      $rootScope.$on("ds.drag.start", function (e) {
        var sidebarHeight = $('.site-content').outerHeight() + 'px'
        element.css('min-height', sidebarHeight )
      })
    }
  };
}])

angular.module('ds.olive').directive('oliveDrawerName', function ($timeout, oliveInitComponent) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {

            var
                drawerAttrSet = Olive.drawer.defaults.attributeList["olive-drawer-name"],
                init = oliveInitComponent();

            init.oliveInitFunction = Olive.drawer.initialize;

            // right now we don't have an attribute for the drawer wrapper,
            // but there's no guarantee that a given drawer will always have content;
            // it could be summary only
            init.checkDependencies = function() {
                return Boolean($(element).find(".drawer-wrapper"));
            };
            
            $timeout(function() {
                init.tryInitialize(scope, element, attr);
            });

        }
    };
});
angular.module('ds.olive')
.service('dsScroll', ['$rootScope', 'Debounce', function ($rootScope, debounceFn) {
  var _init = function (elm, evtId) {
    var previousScroll = 0;
    var pixelsAboveBottom = 200;
    var pixelsBeforeTop = 160;
    var onBottom = 0,
        almostBottom = 0,
        almostTop = 0,
        belowTop = 0,
        isWindow = elm[0] === window || elm[0] === document.body,
        elm = isWindow ? $(window) : elm,
        scrollFn = debounceFn(350, 'lzld-scroll')


    elm.scroll(function (xCord, yCord) {

      // message to lazy image loading
      scrollFn()

      // precompute current window scroll height
      var scrollHeight = isWindow ?
            window.innerHeight + window.pageYOffset :
            elm.scrollTop() + elm.innerHeight(),

          topOffset = isWindow ?
            window.pageYOffset :
            elm.scrollTop(),

          containerHeight = isWindow ?
            document.body.offsetHeight :
            elm[0].scrollHeight;

      // clear bottom status
      if (onBottom && scrollHeight < containerHeight - 10 && Date.now() - onBottom > 1000) {
        onBottom = 0;
      }

      if (almostBottom && scrollHeight < containerHeight - pixelsAboveBottom - 10 && Date.now() - almostBottom > 1000){
        almostBottom = 0;
      }

      var broadCastNow  = function(message) {
        var evt = {element: elm};
        if (evtId) evt.id = evtId;
        $rootScope.$broadcast(message,  evt);
      };

      // only allow once per 500ms and avoid repeat event firing when at bottom
      if (scrollHeight >= containerHeight && !onBottom) {
        onBottom = Date.now();
        broadCastNow('ds.scroll.bottom');
      }
      if (scrollHeight >= ( containerHeight - pixelsAboveBottom )  && !almostBottom) {
        almostBottom = Date.now();
        broadCastNow('ds.scroll.almostBottom');
      }

      // near top, not necessarily moving up
      if(topOffset < pixelsBeforeTop && !almostTop){
        belowTop = 0
        almostTop = Date.now();
        broadCastNow('ds.scroll.almostTop');
      }
      //anywhere below top
      if(topOffset > pixelsBeforeTop && !belowTop && !almostBottom && !onBottom){
        almostTop = 0
        belowTop = Date.now();
        broadCastNow('ds.scroll.belowTop');
      }

      previousScroll = scrollHeight;

    });

    // clear scroll watching when resize
    $rootScope.$on('ds.window.resize', function () {
      onBottom = 0;
    });
  }
  return {
    init: _init
  };
}])
.directive('dsEvents', ['$document', '$rootScope', 'dsScroll', function ($document, $rootScope, dsScroll) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {

      // set body class for has scrolled
      var scrollClass = 'has-scrolled',
          header = null,
          headerHeight = 0;
      window.onscroll = function (e) {
        if (header === null) {
          header = $('.site-header');
          headerHeight = header.height() || 0;
        }
        if (window.scrollY > headerHeight) {
          $(document.body).addClass(scrollClass);
        } else {
          $(document.body).removeClass(scrollClass);
        }
      };

      // listener for window resizing
      var resizeTimeout = null;
      window.onresize = function (e) {
        // clear header so has-scroll logic will recalc
        header = null;

        // debounce resize logic
        if (resizeTimeout) {
          clearTimeout(resizeTimeout);
        }
        resizeTimeout = setTimeout(function () {

          // fallback for media queries
          var w = Math.max(
            document.body.scrollWidth, document.documentElement.scrollWidth,
            document.body.offsetWidth, document.documentElement.offsetWidth,
            document.body.clientWidth, document.documentElement.clientWidth
          );
          var c = '';
          if (w <= 320)
            c += ' lte-320';
          if (w <= 768)
            c += ' lte-768';
          if (w < 960)
            c += ' lt-960';
          if (w < 1024)
            c += ' lt-1024';
          if (w > 1361)
            c += ' gt-1361';
          if (w > 1600)
            c += ' gt-1600';
          if (w > 1800)
            c += ' gt-1800';
          $(document.body)
            .removeClass('lte-320 lte-768 lt-960 lt-1024 gt-1361 gt-1600 gt-1800')
            .addClass(c)

          // broadcast to listeners
          $rootScope.$broadcast('ds.window.resize');
          resizeTimeout = null;
        }, 100);
      };
      // listener for window scroll
      dsScroll.init($(window), 'window');
    }
  };
}])
.directive('dsScroll', ['dsScroll', function (dsScroll) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      dsScroll.init(element, attrs.dsScroll);
    }
  };
}])
.directive('dsToTop', ['$rootScope', function ($rootScope) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      element.addClass('to-top');

      $rootScope.$on('ds.scroll.belowTop', function (e, arg) {
        element.addClass('is-visible');
      })
      $rootScope.$on('ds.scroll.almostTop', function (e, arg) {
        element.removeClass('is-visible');
      })

      element.bind('click', function (e) {
        if ($(e.currentTarget).attr('ds-to-top').length) {
          $($(e.currentTarget).attr('ds-to-top')).animate({scrollTop: 0}, 250);
        } else if($('body.modal-open').length) {
          $('div.modal').animate({scrollTop: 0}, 250);
        } else {
          $('html, body').animate({scrollTop: 0}, 250);
        }
      });
    }
  };
}])


;(function (angular, Olive, undefined) {

    'use strict';

    angular.module('ds.olive').directive('oliveFeatureWall', function () {

        return {
            restrict: 'A',
            scope: {
                oliveFeatureWallConditional: '='
            },
            link: function (linkScope, element, attrs) {

                linkScope.$watch(function () { 

                    if (linkScope.oliveFeatureWallConditional) {

                        /*
                        this is basically a filter for the directive itself to have a value which is needed
                        since its the ID that the specific feature wall is mapped to and if the type is a valid
                        method on the featureWalls object
                        */

                        if (attrs.oliveFeatureWall && 
                            Olive.featureWalls[attrs.oliveFeatureWallType] !== undefined && 
                            !attrs.oliveFeatureWallInitialized) {

                            Olive.featureWalls.initialize(element.context);

                        }

                    } else {

                        Olive.featureWalls.destroy(element.context);

                    }

                    return linkScope.oliveFeatureWallConditional; 

                });

            }
        };

    });

}(window.angular, window.Olive));



angular.module('ds.olive').directive('ngEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if(event.which === 13) {
                scope.$apply(function(){
                    scope.$eval(attrs.ngEnter, {'event': event});
                });

                event.preventDefault();
            }
        });
    };
});


angular.module('ds.olive').directive('dsForm', function(dsUtilities) {
  return {
    // Important scope creation here. Ensures only one form per scope namespace.
    scope: true,
    restrict: 'A',
    controllerAs: 'dsFormCtrl',
    compile: function(){
      return {
        // compile.pre done here because we'd like to append things onto the controller from the attrs
        // without generating an isolate scope. Angular 1.4 baby, I can't wait.
        pre: function(scope, element, attrs){
          // Things are on the scope for backward compatibility reasons. :(
          var form, invalids, scopeWithParentForm, formCtrl, options;
          formCtrl = scope.dsFormCtrl;
          scopeWithParentForm = dsUtilities.searchParentScopes(scope.$parent, 'dsFormCtrl');

          options = angular.extend({
            persistentForm: false,
            isolateForm: false
          },scope.$eval(attrs.dsFormOptions));

          form = scope.$eval(attrs.dsForm) || new Olive.Form();

          if (scopeWithParentForm && !options.isolateForm) {
            scopeWithParentForm._appendToForm(form);
          }

          scope.getReasons = formCtrl.getReasons = function(){
            var i, invalids, reasons;
            invalids = form.getInvalids();
            reasons = [];
            angular.forEach(invalids, function(invalid){
              reasons.push(invalid.getErrorMessage());
            })
            return reasons;
          };

          scope.formIsValid = formCtrl.formIsValid = function(){
            return form.isValid();
          }

          scope.showInvalid = formCtrl.showInvalid = function() {
            var i, validInputs, invalidInputs;
            validInputs = form.getValids();
            invalidInputs = form.getInvalids();

            angular.forEach(validInputs, function(input){
              input.trigger('valid')
            })
            angular.forEach(invalidInputs, function(input){
              input.trigger('invalid')
            })

            return invalidInputs.length === 0;
          };

          // Tack these on so child scopes have something to interact with.
          scope._hasForm = true
          scope._appendToForm = function(considerable){
            form.consider(considerable);
          }
          scope._removeFromForm = function(considerable){
            form.unconsider(considerable);
          }

          if (scopeWithParentForm && !options.persistentForm){
            scope.$on('$destroy', function(){
              scopeWithParentForm._removeFromForm(form);
            });
          }
        }
      }
    },
    // Frankly, having a named controller is great. Also, unlike frank, angular can be the pits sometimes.
    // The controller has to be instantiated to give the scope a named controller; an empty controller.
    controller: function(){
      return this;
    }
  };
});

angular.module('ds.olive').directive('dsValid', function(dsUtilities) {
  return {
    restrict: 'A',
    scope: false,
    link: function(scope, element, attrs) {
      var inputInstance, scopeWithParentForm, isValid, displayValidity;
      scopeWithParentForm = dsUtilities.searchParentScopes(scope, 'dsFormCtrl')
      if (!scopeWithParentForm) {
        throw new Error('dsValid inputs need to belong to a form.')
      }

      scope.$on('$destroy', function(){
        scopeWithParentForm._removeFromForm(inputInstance);
        inputInstance.off('invalid valid', displayValidity);
      });


      if (inputInstance = scope.$eval(attrs.dsValidInput)){
        scopeWithParentForm._appendToForm(inputInstance);
        return;
      }

      updateOptions = function(scope, attrs){
        var options = {};
        var params = [
          'dsValidFunction',
          'dsValidMin',
          'dsValidMax',
          'dsValidLength',
          'dsFormIgnore',
          'dsValidRegex',
          'dsValidRequired',
          'dsValidAlwaysShowValidity'
        ];
        for (var i = 0 ; i < params.length; i++){
          option = params[i];
          if (attrs[option] !== undefined){
            options[option] = scope.$eval(attrs[option]);
          }
        }
        return options;
      }

      isValid = function() {
        var inputType = attrs.dsValid;
        var options = updateOptions(scope, attrs);
        var userInput = scope.$eval(attrs.ngModel);

        if (options.dsFormIgnore) {
          return true;
        }

        // Explicitly test for empty values: undefined, null, and empty string.
        // If we have the value 0 (as a number), more relaxed comparisons will incorrectly report the value as empty.
        if (inputType !== 'function' && ((userInput === undefined) || (userInput === null) || (userInput.toString().length === 0))) {
          return !attrs.required && !options.dsValidRequired;
        }

        if (inputType === 'integer' || inputType === 'number') {
          if (inputType === 'integer' && !(/^\d+$/).test(userInput.toString())) {
            return false;
          }
          if (inputType === 'number' && !(/^[-+]?(\d*[.])?\d+$/).test(userInput.toString())) {
            return false;
          }
          if (typeof +options.dsValidMin === 'number' && +userInput < options.dsValidMin) {
            return false;
          }
          if (typeof +options.dsValidMax === 'number' && +userInput > options.dsValidMax) {
            return false;
          }
        }
        if (inputType === 'email') {
          return dsUtilities.isValidEmail(userInput);
        }
        if (inputType === 'regex') {
          return (new RegExp(options.dsValidRegex)).test(userInput.toString());
        }
        if (inputType === 'function' && options.dsValidFunction) {
          return options.dsValidFunction(userInput);
        }
        if (inputType === 'text') {
          if (!!userInput && typeof +options.dsValidLength === 'number' && +userInput.length !== options.dsValidLength) {
            return false;
          }
        }
        return true;
      };

      displayValidity = function(inputIsValid) {
        if (element.is('select') || element.is('input') || element.is('textarea')){
          var errorStyleElement = element.is('select') ? element.parent() : element;
          if (inputIsValid) {
            return errorStyleElement.removeClass('has-error');
          } else {
            return errorStyleElement.addClass('has-error');
          }
        }
      };

      if (scope.$eval(attrs.dsValidAlwaysShowValidity)){
        scope._isValid = isValid;
        scope.$watch('_isValid()', function(inputIsValid){
          displayValidity(inputIsValid);
        })
      }

      inputInstance = new Olive.Input({
        errorMessage: function(){
          return scope.$eval(attrs.dsValidReason);
        },
        isValid: isValid,
      });
      inputInstance.on('valid', function(){
        displayValidity(true)
      });
      inputInstance.on('invalid', function(){
        displayValidity(false)
      });
      scopeWithParentForm._appendToForm(inputInstance);

    }
  };
});


angular.module('ds.olive').directive('dsFormSubmit', function(dsUtilities) {
  return {
    restrict: 'A',
    scope: false,
    link: function(scope, element, attrs) {
      var formParentScope;

      formParentScope = dsUtilities.searchParentScopes(scope, 'dsFormCtrl');

      element.on('click', function() {
        formParentScope.$watch('showInvalid()', function(isValid, oldValidity){
          if (attrs.onValidityChange) {
            scope.$eval(attrs.onValidityChange)(isValid, oldValidity);
          }
          showInvalid(isValid);
        });

        if (formParentScope.$eval('formIsValid()')) {
          scope.$eval(attrs.dsFormSubmit);
        } else {
          formParentScope.showInvalid()
          showInvalid(false);
          scope.$eval(attrs.dsFormError);
          return false; // stop propagation
        }
        scope.$$phase || scope.$apply();
      });

      function showInvalid(isValid){
        (isValid) ? element.removeClass('disabled') : element.addClass('disabled');
      }

    }
  };
});



angular.module('ds.olive').directive('dsLazyLoad', ['Debounce', function (debounceFn) {

  // easier to just embed the image that muck with paths that don't work
  var errImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAKQWlDQ1BJQ0MgUHJvZmlsZQAASA2dlndUU9kWh8+9N73QEiIgJfQaegkg0jtIFQRRiUmAUAKGhCZ2RAVGFBEpVmRUwAFHhyJjRRQLg4Ji1wnyEFDGwVFEReXdjGsJ7601896a/cdZ39nnt9fZZ+9917oAUPyCBMJ0WAGANKFYFO7rwVwSE8vE9wIYEAEOWAHA4WZmBEf4RALU/L09mZmoSMaz9u4ugGS72yy/UCZz1v9/kSI3QyQGAApF1TY8fiYX5QKUU7PFGTL/BMr0lSkyhjEyFqEJoqwi48SvbPan5iu7yZiXJuShGlnOGbw0noy7UN6aJeGjjAShXJgl4GejfAdlvVRJmgDl9yjT0/icTAAwFJlfzOcmoWyJMkUUGe6J8gIACJTEObxyDov5OWieAHimZ+SKBIlJYqYR15hp5ejIZvrxs1P5YjErlMNN4Yh4TM/0tAyOMBeAr2+WRQElWW2ZaJHtrRzt7VnW5mj5v9nfHn5T/T3IevtV8Sbsz55BjJ5Z32zsrC+9FgD2JFqbHbO+lVUAtG0GQOXhrE/vIADyBQC03pzzHoZsXpLE4gwnC4vs7GxzAZ9rLivoN/ufgm/Kv4Y595nL7vtWO6YXP4EjSRUzZUXlpqemS0TMzAwOl89k/fcQ/+PAOWnNycMsnJ/AF/GF6FVR6JQJhIlou4U8gViQLmQKhH/V4X8YNicHGX6daxRodV8AfYU5ULhJB8hvPQBDIwMkbj96An3rWxAxCsi+vGitka9zjzJ6/uf6Hwtcim7hTEEiU+b2DI9kciWiLBmj34RswQISkAd0oAo0gS4wAixgDRyAM3AD3iAAhIBIEAOWAy5IAmlABLJBPtgACkEx2AF2g2pwANSBetAEToI2cAZcBFfADXALDIBHQAqGwUswAd6BaQiC8BAVokGqkBakD5lC1hAbWgh5Q0FQOBQDxUOJkBCSQPnQJqgYKoOqoUNQPfQjdBq6CF2D+qAH0CA0Bv0BfYQRmALTYQ3YALaA2bA7HAhHwsvgRHgVnAcXwNvhSrgWPg63whfhG/AALIVfwpMIQMgIA9FGWAgb8URCkFgkAREha5EipAKpRZqQDqQbuY1IkXHkAwaHoWGYGBbGGeOHWYzhYlZh1mJKMNWYY5hWTBfmNmYQM4H5gqVi1bGmWCesP3YJNhGbjS3EVmCPYFuwl7ED2GHsOxwOx8AZ4hxwfrgYXDJuNa4Etw/XjLuA68MN4SbxeLwq3hTvgg/Bc/BifCG+Cn8cfx7fjx/GvyeQCVoEa4IPIZYgJGwkVBAaCOcI/YQRwjRRgahPdCKGEHnEXGIpsY7YQbxJHCZOkxRJhiQXUiQpmbSBVElqIl0mPSa9IZPJOmRHchhZQF5PriSfIF8lD5I/UJQoJhRPShxFQtlOOUq5QHlAeUOlUg2obtRYqpi6nVpPvUR9Sn0vR5Mzl/OX48mtk6uRa5Xrl3slT5TXl3eXXy6fJ18hf0r+pvy4AlHBQMFTgaOwVqFG4bTCPYVJRZqilWKIYppiiWKD4jXFUSW8koGStxJPqUDpsNIlpSEaQtOledK4tE20Otpl2jAdRzek+9OT6cX0H+i99AllJWVb5SjlHOUa5bPKUgbCMGD4M1IZpYyTjLuMj/M05rnP48/bNq9pXv+8KZX5Km4qfJUilWaVAZWPqkxVb9UU1Z2qbapP1DBqJmphatlq+9Uuq43Pp893ns+dXzT/5PyH6rC6iXq4+mr1w+o96pMamhq+GhkaVRqXNMY1GZpumsma5ZrnNMe0aFoLtQRa5VrntV4wlZnuzFRmJbOLOaGtru2nLdE+pN2rPa1jqLNYZ6NOs84TXZIuWzdBt1y3U3dCT0svWC9fr1HvoT5Rn62fpL9Hv1t/ysDQINpgi0GbwaihiqG/YZ5ho+FjI6qRq9Eqo1qjO8Y4Y7ZxivE+41smsImdSZJJjclNU9jU3lRgus+0zwxr5mgmNKs1u8eisNxZWaxG1qA5wzzIfKN5m/krCz2LWIudFt0WXyztLFMt6ywfWSlZBVhttOqw+sPaxJprXWN9x4Zq42Ozzqbd5rWtqS3fdr/tfTuaXbDdFrtOu8/2DvYi+yb7MQc9h3iHvQ732HR2KLuEfdUR6+jhuM7xjOMHJ3snsdNJp9+dWc4pzg3OowsMF/AX1C0YctFx4bgccpEuZC6MX3hwodRV25XjWuv6zE3Xjed2xG3E3dg92f24+ysPSw+RR4vHlKeT5xrPC16Il69XkVevt5L3Yu9q76c+Oj6JPo0+E752vqt9L/hh/QL9dvrd89fw5/rX+08EOASsCegKpARGBFYHPgsyCRIFdQTDwQHBu4IfL9JfJFzUFgJC/EN2hTwJNQxdFfpzGC4sNKwm7Hm4VXh+eHcELWJFREPEu0iPyNLIR4uNFksWd0bJR8VF1UdNRXtFl0VLl1gsWbPkRoxajCCmPRYfGxV7JHZyqffS3UuH4+ziCuPuLjNclrPs2nK15anLz66QX8FZcSoeGx8d3xD/iRPCqeVMrvRfuXflBNeTu4f7kufGK+eN8V34ZfyRBJeEsoTRRJfEXYljSa5JFUnjAk9BteB1sl/ygeSplJCUoykzqdGpzWmEtPi000IlYYqwK10zPSe9L8M0ozBDuspp1e5VE6JA0ZFMKHNZZruYjv5M9UiMJJslg1kLs2qy3mdHZZ/KUcwR5vTkmuRuyx3J88n7fjVmNXd1Z752/ob8wTXuaw6thdauXNu5Tnddwbrh9b7rj20gbUjZ8MtGy41lG99uit7UUaBRsL5gaLPv5sZCuUJR4b0tzlsObMVsFWzt3WazrWrblyJe0fViy+KK4k8l3JLr31l9V/ndzPaE7b2l9qX7d+B2CHfc3em681iZYlle2dCu4F2t5czyovK3u1fsvlZhW3FgD2mPZI+0MqiyvUqvakfVp+qk6oEaj5rmvep7t+2d2sfb17/fbX/TAY0DxQc+HhQcvH/I91BrrUFtxWHc4azDz+ui6rq/Z39ff0TtSPGRz0eFR6XHwo911TvU1zeoN5Q2wo2SxrHjccdv/eD1Q3sTq+lQM6O5+AQ4ITnx4sf4H++eDDzZeYp9qukn/Z/2ttBailqh1tzWibakNml7THvf6YDTnR3OHS0/m/989Iz2mZqzymdLz5HOFZybOZ93fvJCxoXxi4kXhzpXdD66tOTSna6wrt7LgZevXvG5cqnbvfv8VZerZ645XTt9nX297Yb9jdYeu56WX+x+aem172296XCz/ZbjrY6+BX3n+l37L972un3ljv+dGwOLBvruLr57/17cPel93v3RB6kPXj/Mejj9aP1j7OOiJwpPKp6qP6391fjXZqm99Oyg12DPs4hnj4a4Qy//lfmvT8MFz6nPK0a0RupHrUfPjPmM3Xqx9MXwy4yX0+OFvyn+tveV0auffnf7vWdiycTwa9HrmT9K3qi+OfrW9m3nZOjk03dp76anit6rvj/2gf2h+2P0x5Hp7E/4T5WfjT93fAn88ngmbWbm3/eE8/syOll+AAAACXBIWXMAAAsTAAALEwEAmpwYAAACOWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIj4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5BZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpPC94bXA6Q3JlYXRvclRvb2w+CiAgICAgICAgIDx0aWZmOllSZXNvbHV0aW9uPjcyPC90aWZmOllSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpYUmVzb2x1dGlvbj43MjwvdGlmZjpYUmVzb2x1dGlvbj4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CuwVgk0AABbBSURBVHgB7Z0Ne9NGFkaVhJDvBUqgtF1o2f7/X7Td0lJgIUAghZDvZOcdZ7KO48TXtiTfqxz1cYPtsXR17uh4ZjSW5t5t75xVLBCAAAQCEJgPECMhQgACEMgEEBYVAQIQCEMAYYVJFYFCAAIIizoAAQiEIYCwwqSKQCEAAYRFHYAABMIQQFhhUkWgEIAAwqIOQAACYQggrDCpIlAIQABhUQcgAIEwBBBWmFQRKAQggLCoAxCAQBgCCCtMqggUAhBAWNQBCEAgDAGEFSZVBAoBCCAs6gAEIBCGAMIKkyoChQAEEBZ1AAIQCEMAYYVJFYFCAAIIizoAAQiEIYCwwqSKQCEAAYRFHYAABMIQQFhhUkWgEIAAwqIOQAACYQggrDCpIlAIQABhUQcgAIEwBBBWmFQRKAQggLCoAxCAQBgCCCtMqggUAhBAWNQBCEAgDAGEFSZVBAoBCCAs6gAEIBCGAMIKkyoChQAEEBZ1AAIQCEMAYYVJFYFCAAIIizoAAQiEIYCwwqSKQCEAAYRFHYAABMIQQFhhUkWgEIAAwqIOQAACYQggrDCpIlAIQABhUQcgAIEwBBBWmFQRKAQggLCoAxCAQBgCCCtMqggUAhBAWNQBCEAgDAGEFSZVBAoBCCAs6gAEIBCGAMIKkyoChQAEEBZ1AAIQCEMAYYVJFYFCAAIIizoAAQiEIYCwwqSKQCEAAYRFHYAABMIQQFhhUkWgEIAAwqIOQAACYQggrDCpIlAIQABhUQcgAIEwBBBWmFQRKAQggLCoAxCAQBgCCCtMqggUAhBAWNQBCEAgDAGEFSZVBAoBCCAs6gAEIBCGAMIKkyoChQAEEBZ1AAIQCEMAYYVJFYFCAAIIizoAAQiEIYCwwqSKQCEAAYRFHYAABMIQQFhhUkWgEIAAwqIOQAACYQggrDCpIlAIQABhUQcgAIEwBBBWmFQRKAQggLCoAxCAQBgCCCtMqggUAhBAWNQBCEAgDAGEFSZVBAoBCCAs6gAEIBCGAMIKkyoChQAEEBZ1AAIQCEMAYYVJFYFCAAIIizoAAQiEIYCwwqSKQCEAAYRFHYAABMIQQFhhUkWgEIAAwqIOQAACYQggrDCpIlAIQABhUQcgAIEwBBBWmFQRKAQggLCoAxCAQBgCCCtMqggUAhBAWNQBCEAgDAGEFSZVBAoBCCAs6gAEIBCGAMIKkyoChQAEEBZ1AAIQCEMAYYVJFYFCAAIIizoAAQiEIYCwwqSKQCEAAYRFHYAABMIQQFhhUkWgEIDAHRD4J3B2duY/yA5FODc316G96dauICyn+ZSkdODoMT+vA4iDqI1UiXt5CHnKQBubZRtGAgjLCKqtYulwyQfJnTt38oFzcnJS6cHSDgF9QYj9wsJCdZrkdXp6grTaQW/aCsIyYWqnkL7ZdaDo799//119/vy5+vbtW3V8dJRfayeK27yVucR/vrp792618Y+N6v79B9XdpaXqlC8MN5Vi7t32DgMkDtJRZHV4cFC9efOm2t7e7h0o591CByHemhCUi/QNUS2vrFQ//PBD9d3Dh3nf8+u3hoLPHUVYDvJSZLW3t1e9+P336uvXr9Xi4mIev3IQ3q0NQV3x09PT6seffqp+/PFHWrkOagJdwhknQbKan5+vjg4Pqz9evKh2d3erJXVD0oHCN/psk6PuuXLz5vXrNK61UH3//ZOcl9lGdbu3jrBmnP9yJvDtu3fV1y9fqsU0fiJZDS4qx9I8gf4vCf1b3CWu/77+b7W+vlGtra3lkyDko/lcDNsCwhpGpaXXdEDoYNDA+vbHj9VCOjs1uOjAULlhEhssy/PpCahFNSit3AJOJz4+fPiQhLVKV316zBOv4eoRMvGq+OC4BCQjPb6kltVh6hJq3Kr/YNH6ypSGPM0hTXlgaYBAwlq+GE6OT6r5dKZwcJG0vqQzt4cHKU9Ld6uz3Aqm1TvIqennCKtpwiPWr5aTBtsHF01Y1Byg5eXlPOirca1BmQ1+hufTE/iUzs5ubW1dakWJu4SlL5X9dBZ3KeXk+Ow0lZl+e6xhPAIIazxetZYu3+qaZzW4aAKpJi4+evy42tzcvGhpDZbjeX0EJCV9QegsrR5l8m7ZgsR1fHxcnvJ3BgQQ1gygX96k1DR8kdAWF+/k8SsdKHrO0hwBtXZ7zK92zZvbKmsehwDCGodWI2VvllDpBupAQliNJOBipeIr3oX5xRv8ww2Bq6OLbkIjkB6Bm4UGJQjcJgIIq6PZzi2FazqbtCA6mvRbsFt0CTuWZMlIXRvN7xrs4ui5Hlo0XlPGbDqGgN3pMAGE1aHkSlYSlZb9/f38M5/9NGXiKA3Yl/c0PWJtdbVaSQ+dBdM8r3JJmw6hYFc6SgBhdSixEtBemjW/9f59tZMuTXOQ5gwNdv/UvtKM+vX19Wrz0aN0CZX7+XpPtLY6VBE6vCsIqyPJ1Ryij+mnI69evcqi0vPSLRzcRclpZ2cnX3NL0vopXY2gtLZKl3HwMzyHgAcCCMtDFqaMQXLS7Oy/Xr7Ma9JPfLSodTXYwtLrKq+H3nv39m2+UsQvz39JguvN+UJaosTikQBnCT1mxRiTxp7Uivr86VOWlUSj59eJqqz24v1UXlfX1MUCX/31Kn8OWRVK/PVIAGF5zIohJklHrSSNU716/SpfIbO0mgwf7xU5b4FJWu/TuJfElYV3zXQI83opCIGGCCCshsA2vVq1hPSfxq32vu3lgXRJbNJlPq1P3Ur9wHd+jmoxKUc+1ywBamazfBtbu4R1lH40/enT59zSmmZDubWWupI6w6iLCI7dUptm43wWAmMQQFhjwPJStHQHNddqf3+vFsFIgLrG05d0lQKtf9ZjWZKmHqmv6wU7cTgggLAcJGHSECQsTVGobUnSOijrTP9ue9FJBC0S1fvUPdWtznTmcpqubtv7wPaaJYCwmuXb6NpPzq/NVFdrSIoqd4rRv4tAGt2JvpVrTE6y0ljaH3/8kW/KoauxDl6Xqu8j/POWEUBYtyzhHne3iDHLKt2M468//8yS0hjd7//5T76ENNLymLn2Y0JY7TOvbYvlphV1dZnUIdO0ht7YUbrOefqv+SWNl6llla6jviVZpcmvc6mVpVajYtFZS6TVfBaibAFhRcnUkDh1Od+FPDA95M1JXkqD7bpeuYRVlwRvCqPXsjqX1duerLTtsn3FoJbV0SEtrZs43qb3EFbAbKv1ocF2CWsp3U69jh8uSw5q2WykH0Vr/W0I62LM6kJW6ZI4A7JUHAvpJqa0tAJW1AZCRlgNQG1jlTqQ9ZvBBw/uT32mMAswXWZGl5xZ39ioRYA3MbgyZvXyr9yqmpsfLkrtq1paSOsmqrfjPYQVNM+lBfTw4Wa1mkSjM4YSz6SL7tDzfbpDj36mc5puYdXcMmzMKrW1BlpWg9tHWoNEbudzhBU075LTSbpvoS7Ip8vDJFuN3TLSOvRQy+VRuszMg+++y9Ma1FVrYhk1ZjVqm0VajGmNItXd9xFW4NxKLJo3df/Bg+rps2d53EnPi4iu27XyvgQgWX2XRPXPp0/z50p37brPTvO64tWA+tYNY1aj1q+YGdMaRam77yOsDuRWg+6PU3fu+fPneVxL85ckLi1FTv1/VV73OdTfJ0+eVL+kz2mMKA/eJ6nUvRQJZlnlqQs3j1mN2n5paTGmNYpU997nAn4dyalk8zDdIXp1bTXNFB99ieR79+7lbuC9dIlkLaVlVj+OvjGr85ZVnmc1YsxqVByD0vrXr79WG+mEATecHUUu9vsIK3b+LkWvg3V5eaV6lrqH+6nFtbu7W/XfhOJOmoipMS8N0l+5CUUay6p7UcsqdwM1KfSiG5gmhU4pqxJnkVYZ00JahUx3/yKsDuVW3b7SUtIcrZU0R0sHtR5aSrdQ/y7dwvxaA93AvL203qtjVsOnLqj8JIv2rX9MC2lNQjHOZxjDipMrU6QSkBaJ6/ikN05VpCVJ5ddTS0yvlbKmFY9RqO4xq1Gb1r4wT2sUpW68j7C6kccre3FTy6kpUfWC6OsGXvw2MHUMa+oGXtnR8xeQ1nVkuvU6wupWPme6N72W1fW/DWw6uCKtMqbFpWmaJt7++hFW+8w7u8U8wD7lPKtp4Uha/WNaSGtaor4+j7B85WMm0UzbRWx7zGoUpNLSYp7WKFLx3kdY8XJWa8SS1en57PjJVjybMatRsSKtUYRivo+wYuatlqh1gTzdi/Dfv/2Wbmax37snYepSWZdZj1mNirNIizGtUaTivI+w4uSq1kglq48fP1Yv0+WI//68k6+fvre3l6cH6EC3LB7GrEbFqX0ZNqY16nO875MAwvKZl0ajyi2rJKs/040edEAvLS9VX9PtvXQpYou0vI1ZjYI12NLS3Xg0oZUlHgGyFi9nU0VcZPXixYssKx24mlCqiwF+Sz/lGS0tn2NWo6AUaR0cHKRW5ct8lQqN3+l1ljgEEFacXE0dab+stDLJqhyw+YCWtNLdn6+Xlg7u2c2zmhaAWoZicJJ+AVB+wjTtOvl8uwQQVru8Z7Y1Hagas9L9/rT0yyq/kP5XWiH90tKdefR6rxs47LeB/5deWY/nv9oXtaymncrheR+7HBvC6nJ2z/ettKzKmNUwWRUMF9La7bW0dLUHff5igL2G61mVbfEXAuMSQFjjEgtWvsgqj1mdng1tWQ3uUpbW4p00pnUurTTlQT8ufvf27fl9A5O++rqTg5/nOQSaIsDlZZoi62C9/bJSOLpZqWRkWYq0dE0ttcx0Nx0JS6K6qYVmWTdlIDApAYQ1KTnnn5OsNGYl2WiZRDKSls4easqDfpOXu4acWcs8+d9sCCCs2XBvdKulZWUZsxoViKSV7y59LiprC23UenkfApMQQFiTUHP8mSIrjVmlU3tjdQOv263ciTR2Ja9bB69DoA4CDLrXQdHJOi7JKsU0zpiVk10gDAjcSIAW1o144rwpWU07ZhVnb4n0thKghdWBzJeWVR1jVh3AwS50mAAtrODJLbKqc8wqOBLC7zABWliBk6upCtv6uY0G2NPCmFXgZBK6iQDCMmHyVUhTCySrnZ3P+beB5TlTDnzliWjqJ4Cw6mfayhr1492vX3fzrdnn04A7smoFOxuZMQGENeMETLN5tbLyVQeYIzUNRj4biADCCpSsK6FKVHqk1hYLBG4DAYQVPsvIKnwK2QEzAYRlRkVBCEBg1gQQ1qwzwPYhAAEzAYRlRkVBCEBg1gQQ1qwzMO32GcKaliCfD0QAYQVKFqFC4LYT4LeEgWvAaZrScHx8nG4QkS99FXhP2gldc9Z0ey89mGjbDvO6t4Kw6ibawvp04Onmp/fv36/u3r1bzZ/Pw8oX2mth+1E3kcWeJK8Jt4vnty/LE2+j7tAtjBthBU26Wgira6vV+vp60D2Ybdi0smbLf9KtI6xJyTn43Fm6bdfx2bFuxswyJgHdZ5ElHgGEFS9nlyKmS3MJB086ToCzhO4TzMhUOykqnMvfdrbKVsYjQAtrPF6tl56bu/ydcqZb4bDUSkDdQ/2GXOdac4uVH5PXyrfOlSGsOmlOuK5ylq//472D6Kza+/atmnv4MN8qvv99/l0vAX0RzKcvh/39vepgfz+fSRy2Bbrgw6i09xrCao/1lS3pTF8+xZ6mJgwu+QBKp9+3trbyt//yynKeO8RQ8SCp6Z+rcZWnPKS/n7a3k7R6wro0V6vkKt0Jm1bu9MwnXQPCmpRcDZ9Txdc39trqav576QBJ69d7mm/15s3rXlelhm2yihsIqF+YmOvGHv2L8nCS8rCyvFwtLS1VOjtLS6ufUHv/Rljtsb66pXR8SFLrGxvVcjoYDg4O8sHSLy4dGIv6VtfBxNIogSKhYaxPT9JE3QcPci70JcIyGwKXR3RnE8Ot3Wrvm/sky+rx48e5NSUY5cApYIYdQOU9/tZHQJwHWWtcSz9/WlldqR6msUQtg2Xqi4A1jSKAsEYRavh9Da7rG3vz0aNqc3OzOjw8zFsclFbDYbD6IQSyrE6O8zjjP58+rZaWl1KuTq58oQz5KC81RIAuYUNgx1mthKXB96fPnuUxlA/v3+fnFzeZGGdllK2FgFpRh0eHuQv4888/599tqluYElTL+lnJZATm3m3vMDgyGbtaP6UDRILS348fPuSzg/t7++l5OkjSOBZLiwTSEbFwZ6H6x7171ZMnT6q19bWqJ6sWY2BTQwkgrKFYZvNinsqQ5DSXxHV4cJjuO/i12t3drY6Ojhg3aSklC4m9ToDoRMhqOnurLxEG2VuCb9gMwjJAmkURjWGVFheDvO1lQNz10JeHWlViz3hie/xHbYkxrFGEZvS+DpR8cb508LC0R0DcyxdEkVd7W2dLowggrFGEZvg+3+yzgQ/32XC3bJVpDRZKlIEABFwQQFgu0kAQEICAhQDCslCiDAQg4IIAwnKRBoKAAAQsBBCWhRJlIAABFwQQlos0EAQEIGAhgLAslCgDAQi4IICwXKSBICAAAQsBhGWhRBkIQMAFAYTlIg0EAQEIWAggLAslykAAAi4IICwXaSAICEDAQgBhWShRBgIQcEEAYblIA0FAAAIWAgjLQokyEICACwIIy0UaCAICELAQQFgWSpSBAARcEEBYLtJAEBCAgIUAwrJQogwEIOCCAMJykQaCgAAELAQQloUSZSAAARcEEJaLNBAEBCBgIYCwLJQoAwEIuCCAsFykgSAgAAELAYRloUQZCEDABQGE5SINBAEBCFgIICwLJcpAAAIuCCAsF2kgCAhAwEIAYVkoUQYCEHBBAGG5SANBQAACFgIIy0KJMhCAgAsCCMtFGggCAhCwEEBYFkqUgQAEXBBAWC7SQBAQgICFAMKyUKIMBCDgggDCcpEGgoAABCwEEJaFEmUgAAEXBBCWizQQBAQgYCGAsCyUKAMBCLgggLBcpIEgIAABCwGEZaFEGQhAwAUBhOUiDQQBAQhYCCAsCyXKQAACLgggLBdpIAgIQMBCAGFZKFEGAhBwQQBhuUgDQUAAAhYCCMtCiTIQgIALAgjLRRoIAgIQsBBAWBZKlIEABFwQQFgu0kAQEICAhQDCslCiDAQg4IIAwnKRBoKAAAQsBBCWhRJlIAABFwQQlos0EAQEIGAhgLAslCgDAQi4IICwXKSBICAAAQsBhGWhRBkIQMAFAYTlIg0EAQEIWAggLAslykAAAi4IICwXaSAICEDAQgBhWShRBgIQcEEAYblIA0FAAAIWAgjLQokyEICACwIIy0UaCAICELAQQFgWSpSBAARcEEBYLtJAEBCAgIUAwrJQogwEIOCCAMJykQaCgAAELAQQloUSZSAAARcEEJaLNBAEBCBgIYCwLJQoAwEIuCCAsFykgSAgAAELAYRloUQZCEDABQGE5SINBAEBCFgIICwLJcpAAAIuCCAsF2kgCAhAwEIAYVkoUQYCEHBBAGG5SANBQAACFgIIy0KJMhCAgAsCCMtFGggCAhCwEEBYFkqUgQAEXBBAWC7SQBAQgICFAMKyUKIMBCDgggDCcpEGgoAABCwEEJaFEmUgAAEXBBCWizQQBAQgYCGAsCyUKAMBCLgggLBcpIEgIAABCwGEZaFEGQhAwAUBhOUiDQQBAQhYCCAsCyXKQAACLgggLBdpIAgIQMBCAGFZKFEGAhBwQQBhuUgDQUAAAhYCCMtCiTIQgIALAgjLRRoIAgIQsBBAWBZKlIEABFwQQFgu0kAQEICAhQDCslCiDAQg4IIAwnKRBoKAAAQsBBCWhRJlIAABFwQQlos0EAQEIGAhgLAslCgDAQi4IICwXKSBICAAAQuB/wEtzFLbTRRAZAAAAABJRU5ErkJggg==";

  // global window listener to observe scrolling
  var debounceMs = 350;
  $(window).on('scroll', debounceFn(debounceMs, 'lzld-scroll'));
  $(window).resize(debounceFn(debounceMs, 'lzld-resize'));

  // map of resolved images to skip lazy loading wrapper and pull straight from cache (hopefully)
  var resolved = {};

  return {
    restrict: 'A',
    scope: {
      url: '@dsLazyLoad',
      height: '@dsLazyLoadHeight',
      dsOnVisibleFunction:'&',
      pageIndex: '@dsPageIndex',
      docUri: '@dsDocUri',
      docId: '@dsDocId',
      dpi: '@dsImageDpi',
      errImg: '@dsErrImg'
    },
    link: function (scope, elm, attr) {
      var wrapper,
        resizable = false,
        src = scope.url,
        onVisibleFunction = scope.dsOnVisibleFunction();

      scope.$on('$destroy', function(){
        _destroy();
      });

      scope.$watch('url', function(newUrl){
        if (src !== newUrl) {
          src = newUrl;
          if(onVisibleFunction){
            _visible();
          }else{
            _init();
          }
        }
      });

      function _resize () {
        elm.css('height', elm.width() * (scope.height ? scope.height : 1.25));
      }

      function _visible () {
        var wTop = $(window).scrollTop(),
            wHeight = $(window).height(),
            eTop = elm.offset().top,
            eHeight = elm.height();

        if(onVisibleFunction && src){
          if(src){
            elm.attr('src', src);
            _destroy();
          }
        }else{
          if (eTop > wTop && eTop < wTop + wHeight ||
              eTop + eHeight > wTop && eTop + eHeight < wTop + wHeight ||
              eTop < wTop && eTop + eHeight > wTop + wHeight) {

              if(onVisibleFunction){
                onVisibleFunction({start: scope.pageIndex, docId: scope.docId, uri: scope.docUri, dpi: scope.dpi})
              }else{
                elm
                  .on('load', _destroy)
                  .on('error', _error)
                  .attr('src', src)
              }

          }
        }
      }

      function _init () {

        // wrap element in
        wrapper = elm.wrap('<div class="lazy-load-wrapper"></div>').parent()
                     .append('<span class="spinner-circle"></span>');

        // keep img at consistent proportion
        if (!elm[0].style.height || attr.dsLazyLoadHeight) {
          resizable = true;
          $(window).on('lzld-resize', _resize);
          _resize();
        }

        // watch elment for visibility
        $(window).on('lzld-scroll', _visible);
        _visible();
      }

      function _destroy () {

        // remove auto sizing
        if (resizable) {
          elm.css('height', 'auto');
          $(window).off('lzld-resize', _resize);
        }

        // turn off error
        elm.off('load');
        elm.off('error');

        // turn off visiblity check
        $(window).off('lzld-scroll', _visible);

        // remove wrapper
        if (wrapper) {
          wrapper.find('.spinner-circle').remove();
          wrapper = null;
          elm.unwrap();
        }

        // mark successful load
        if (resolved[scope.url] === undefined) resolved[scope.url] = true;
      }

      function _error (e) {

        // set failed loading img
        elm.attr('src', scope.errImg ? scope.errImg : errImg);

        // mark failed load
        resolved[scope.url] = false
      }

      _init();
    }
  };
}]);

/**
 * svg directive
 * replace img tag with its svg content
 * adaptation from https://stackoverflow.com/questions/11978995/how-to-change-color-of-svg-image-using-css-jquery-svg-image-replacement
 */
angular.module('ds.olive').directive('inlineSvg', ['$http', function ($http) {
    return {
        restrict: 'A',
        priority: 0,
        link: function(scope, element, attrs) {
            var imgUrl = attrs.src || attrs.ngSrc;

            // Load svg content
            $http.get(imgUrl).success(function(data, status) {
                var svg = angular.element(data);
                for (var i = svg.length - 1; i >= 0; i--) {
                    if (svg[i].constructor.name == 'SVGSVGElement') {
                        svg = angular.element(svg[i]);
                        break;
                    }
                }

                angular.forEach(element[0].attributes, function(attr) {
                    svg.attr(attr.name, attr.value);
                });

                // Remove invalid attributes
                svg = svg.removeAttr('xmlns:a');
                element.replaceWith(svg);
            });
        }
    };
}]);

/*
 * angular-loading-bar
 *
 * intercepts XHR requests and creates a loading bar.
 * Based on the excellent nprogress work by rstacruz (more info in readme)
 *
 * (c) 2013 Wes Cruver
 * License: MIT
 */


/**
 * loadingBarInterceptor service
 *
 * Registers itself as an Angular interceptor and listens for XHR requests.
 */
angular.module('ds.olive').config(['$httpProvider', function ($httpProvider) {

    var interceptor = ['$q', '$cacheFactory', '$timeout', '$rootScope', 'loadingBar', function ($q, $cacheFactory, $timeout, $rootScope, loadingBar) {

      /**
       * The total number of requests made
       */
      var reqsTotal = 0;

      /**
       * The number of requests completed (either successfully or not)
       */
      var reqsCompleted = 0;

      /**
       * The amount of time spent fetching before showing the loading bar
       */
      var latencyThreshold = loadingBar.latencyThreshold;

      /**
       * $timeout handle for latencyThreshold
       */
      var startTimeout;


      /**
       * calls loadingBar.complete() which removes the
       * loading bar from the DOM.
       */
      function setComplete() {
        $timeout.cancel(startTimeout);
        loadingBar.complete();
        reqsCompleted = 0;
        reqsTotal = 0;
      }

      /**
       * Determine if the response has already been cached
       * @param  {Object}  config the config option from the request
       * @return {Boolean} retrns true if cached, otherwise false
       */
      function isCached(config) {
        var cache;
        var defaultCache = $cacheFactory.get('$http');
        var defaults = $httpProvider.defaults;

        // Choose the proper cache source. Borrowed from angular: $http service
        if ((config.cache || defaults.cache) && config.cache !== false &&
          (config.method === 'GET' || config.method === 'JSONP')) {
            cache = angular.isObject(config.cache) ? config.cache
              : angular.isObject(defaults.cache) ? defaults.cache
              : defaultCache;
        }

        var cached = cache !== undefined ?
          cache.get(config.url) !== undefined : false;

        if (config.cached !== undefined && cached !== config.cached) {
          return config.cached;
        }
        config.cached = cached;
        return cached;
      }


      return {
        'request': function(config) {
          // Check to make sure this request hasn't already been cached and that
          // the requester didn't explicitly ask us to ignore this request:
          if (config.includeLoadingBar && !isCached(config)) {
            $rootScope.$broadcast('ds.loading', {url: config.url});
            if (reqsTotal === 0) {
              startTimeout = $timeout(function() {
                loadingBar.start();
              }, latencyThreshold);
            }
            reqsTotal++;
            loadingBar.set(reqsCompleted / reqsTotal);
          }
          return config;
        },

        'response': function(response) {
          if (response.config && response.config.includeLoadingBar && !isCached(response.config)) {
            reqsCompleted++;
            $rootScope.$broadcast('ds.loaded', {url: response.config.url});
            if (reqsCompleted >= reqsTotal) {
              setComplete();
            } else {
              loadingBar.set(reqsCompleted / reqsTotal);
            }
          }
          return response;
        },

        'responseError': function(rejection) {
          if (rejection.config && rejection.config.includeLoadingBar && !isCached(rejection.config)) {
            reqsCompleted++;
            $rootScope.$broadcast('ds.loaded', {url: rejection.config.url});
            if (reqsCompleted >= reqsTotal) {
              setComplete();
            } else {
              loadingBar.set(reqsCompleted / reqsTotal);
            }
          }
          return $q.reject(rejection);
        }
      };
    }];

    $httpProvider.interceptors.push(interceptor);
  }]);


/**
 * Loading Bar
 *
 * This service handles adding and removing the actual element in the DOM.
 * Generally, best practices for DOM manipulation is to take place in a
 * directive, but because the element itself is injected in the DOM only upon
 * XHR requests, and it's likely needed on every view, the best option is to
 * use a service.
 */
angular.module('ds.olive').provider('loadingBar', function() {

    this.includeBar = true;
    this.latencyThreshold = 300;
    this.startSize = 0.02;
    this.parentSelector = '.site-header';
    this.loadingBarTemplate = '<div class="site-progress"><div class="bar"><div class="peg"></div></div></div>';

    this.$get = ['$injector', '$document', '$timeout', '$rootScope', function ($injector, $document, $timeout, $rootScope) {
      var $animate;
      var $parentSelector = this.parentSelector,
        loadingBarContainer = angular.element(this.loadingBarTemplate),
        loadingBar = loadingBarContainer.find('div').eq(0);

      var incTimeout,
        completeTimeout,
        started = false,
        status = 0;

      var includeBar = this.includeBar;
      var startSize = this.startSize;

      /**
       * Inserts the loading bar element into the dom, and sets it to 2%
       */
      function _start() {
        if (!$animate) {
          $animate = $injector.get('$animate');
        }

        var $parent = $document.find($parentSelector);
        $timeout.cancel(completeTimeout);

        // do not continually broadcast the started event:
        if (started) {
          return;
        }

        $rootScope.$broadcast('ds.loading.started');
        started = true;

        if (includeBar && $parent.length) {
          $animate.enter(loadingBarContainer, $parent);
        }

        _set(startSize);
      }

      /**
       * Set the loading bar's width to a certain percent.
       *
       * @param n any value between 0 and 1
       */
      function _set(n) {
        if (!started) {
          return;
        }
        var pct = (n * 100) + '%';
        loadingBar.css('width', pct);
        status = n;

        // increment loadingbar to give the illusion that there is always
        // progress but make sure to cancel the previous timeouts so we don't
        // have multiple incs running at the same time.
        $timeout.cancel(incTimeout);
        incTimeout = $timeout(function() {
          _inc();
        }, 250);
      }

      /**
       * Increments the loading bar by a random amount
       * but slows down as it progresses
       */
      function _inc() {
        if (_status() >= 1) {
          return;
        }

        var rnd = 0;

        // TODO: do this mathmatically instead of through conditions

        var stat = _status();
        if (stat >= 0 && stat < 0.25) {
          // Start out between 3 - 6% increments
          rnd = (Math.random() * (5 - 3 + 1) + 3) / 100;
        } else if (stat >= 0.25 && stat < 0.65) {
          // increment between 0 - 3%
          rnd = (Math.random() * 3) / 100;
        } else if (stat >= 0.65 && stat < 0.9) {
          // increment between 0 - 2%
          rnd = (Math.random() * 2) / 100;
        } else if (stat >= 0.9 && stat < 0.99) {
          // finally, increment it .5 %
          rnd = 0.005;
        } else {
          // after 99%, don't increment:
          rnd = 0;
        }

        var pct = _status() + rnd;
        _set(pct);
      }

      function _status() {
        return status;
      }

      function _completeAnimation() {
        status = 0;
        started = false;
      }

      function _complete() {
        if (!$animate) {
          $animate = $injector.get('$animate');
        }

        $rootScope.$broadcast('ds.loading.completed');
        _set(1);

        $timeout.cancel(completeTimeout);

        // Attempt to aggregate any start/complete calls within 500ms:
        completeTimeout = $timeout(function() {
          var promise = $animate.leave(loadingBarContainer, _completeAnimation);
          if (promise && promise.then) {
            promise.then(_completeAnimation);
          }
        }, 500);
      }

      return {
        start            : _start,
        set              : _set,
        status           : _status,
        inc              : _inc,
        complete         : _complete,
        latencyThreshold : this.latencyThreshold,
        parentSelector   : this.parentSelector,
        startSize        : this.startSize
      };
    }];
  });

/*
    Keep the "dsMenu" directive around for backwards compatibility
*/
angular.module('ds.olive').directive('dsMenu', function ($timeout, oliveInitComponent) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {

            var init = oliveInitComponent();

            init.oliveInitFunction = Olive.menu.initialize;

            // for menus: dependencies met if there is a menu div with the correct id
            init.checkDependencies = function(scope, element, attr) {
                var
                    menuName = $(element).attr('ds-menu');
                return Boolean($("#" + menuName + ".menu").length);
            };

            $timeout(function() {
                init.tryInitialize(scope, element, attr);
            });
        }
    };
});

angular.module('ds.olive').directive('oliveMenu', function ($timeout, oliveInitComponent) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            
            var init = oliveInitComponent();

            init.oliveInitFunction = Olive.menu.initialize;

            // for menus: dependencies met if there is a menu div with the correct id
            init.checkDependencies = function(scope, element, attr) {
                var
                    menuName = $(element).attr('olive-menu');

                return Boolean($("#" + menuName + ".menu").length);
            };

            $timeout(function() {
                init.tryInitialize(scope, element, attr);
            });
        }
    };
});
/**
 * oliveMessage: Angular wrapper for Olive message utility
 */
angular.module('ds.olive').factory('oliveMessage', ['$rootScope', '$compile', '$sanitize', function ($rootScope, $compile, $sanitize) {

    // when the user navigates to another page, close all messages
    //     except those with the persist option
    $rootScope.$on("$locationChangeSuccess", function() {
        Olive.message.closeAll();
    });

    var _settings = {
        'hideClose': false,  /* Boolean: hide the close X */
        'modal': null,       /* string: if set, the name of the modal that this message should appear in */
        'type': null,        /* string: type of message. options: 'info'||'warning'||'success'||'error' */
        'persist': false     /* Boolean: if true, causes the message to persist through closeAll() calls */
    };


    // items from the old angular options object that have a new name
    //     in addition, options.unsafe is no longer used.
    //     we just detect if there is a scope
    var _deprecatedSettings = {
        'sticky': 'persist'
    };

    /**
     * oliveMessage.closeBy: closes open messages by type or by instance name
     * @param {string} type - "name" || "type"
     *     note: "id" is deprecated but is the same as "name"
     * @param {string} value - the message name or message type to close
     */
    var _closeBy = function(type, value) {
        if ((type == 'name') || (type == 'id')) {
            if (Object.keys(Olive.message.instances).indexOf(value) > -1) {
                Olive.message.instances[value].close();
            }
        }
        if (type == "type") {
            Olive.message.closeAll(value);
        }
    };


    /**
     * oliveMessage.show: opens a new message
     * @param {DOM object or string} messageContent - the content of this message
     *     replaces deprecated options.msg
     * @param {string} name - the unique identifier for this notification
     *     replaces deprecated options.id
     * @param {string} type - the message type
     *     replaces deprecated options.type
     * @param {object} options - key-value pairs to set specific options
     * @param {angularJS scope} passedScope - optional scope for compiling messageContent
     *     replaces deprecated options.scope
     */
    var _show = function(messageContent, name, type, options, passedScope) {

        var
            msgConfigKeys,
            msgConfig = $.extend({}, _settings);

        msgConfig = $.extend(msgConfig, options);
        msgConfigKeys = Object.keys(msgConfig);

        // If the config object has deprecated keys and does not
        //     specify the non-deprecated version, give the
        //     non-deprecated key the value assigned to the deprecated key 
        for (var key in _deprecatedSettings) {
            if ((msgConfigKeys.indexOf(key) > -1) &&
                (msgConfigKeys.indexOf(_deprecatedSettings[key]) == -1)) {
                msgConfig[_deprecatedSettings[key]] = msgConfig[key];
            }
        };

        var
            uncompiledContent,
            jsInstance,
            jsMessageContent,
            jsName,
            jsType;

        // if parameters are missing, check for their deprecated counterparts
        if (messageContent == undefined) {
            uncompiledContent = msgConfig.msg || null;
        } else {
            uncompiledContent = messageContent;
        }

        // if there is no content, then don't bother with the rest
        if (!uncompiledContent) {
            return false;
        }

        if (name == undefined) {
            jsName = msgConfig.id || "oliveMessage" + String(Math.floor(1000 * Math.random()));
        } else {
            jsName = name;
        }

        if (type == undefined) {
            jsType = msgConfig.type || "info";
        } else {
            jsType = type;
        }

        if ((passedScope == undefined) && (msgConfig.scope != undefined)) {
            passedScope = msgConfig.scope;
        }

        msgConfig.autoClose = msgConfig.autoClose || Boolean(jsType == "success");

        // if this we have scope, then compile the content with the scope
        if (passedScope != undefined) {
            jsMessageContent = $compile(uncompiledContent)(passedScope);
        // otherwise, pass the content along to be handled by the js component
        } else {
            jsMessageContent = uncompiledContent;
        }

        var returnObj = {};

        // If we are in a modal and that modal is showing, show the message
        //     in the modal. Return the modal instance and a method to close
        //     our specific method.
        if (msgConfig.modal) {
            jsInstance = Olive.modal.instances[msgConfig.modal];

            if (jsInstance && (jsInstance.currentState == "showing")) {
                jsInstance.addMessage(jsMessageContent, jsName, jsType);
                returnObj.close = function() {
                    jsInstance.removeMessage(jsName);
                };
                returnObj.element = jsInstance.wrapper;
                returnObj.instance = jsInstance;
            } else {
                return false;
            }
        // Otherwise, show a global message. Return the global message instance
        //     and its close function.
        } else {
            jsInstance = Olive.message.show(jsMessageContent, jsName, jsType, msgConfig);
            returnObj.close = jsInstance.close;
            returnObj.element = jsInstance.content;
            returnObj.instance = jsInstance;
        }

        return returnObj;
    };


    return {
        show: _show,
        closeBy: _closeBy,
        closeAll: Olive.message.closeAll
    }
}]);


angular.module('ds.olive').directive('dsMobileMenu', ['$rootScope', function ($rootScope) {
  return {
    restrict: 'A',
    link: function (scope, elm, attrs) {

      if (!attrs.dsMobileMenu) throw new Error("Menu ID required!");

      var menuId = '#' + attrs.dsMobileMenu || '',
          menu = $(document.body).find(menuId),
          slide = attrs.dsMobileMenuSide || 'right';

      // add listener to show menu
      elm.click(_toggle);

      // create mask if doesn't exist
      if (!$(document.body).find('.osm-mask').length) {
        $('<div />', { 'class': 'osm-mask' }).appendTo('body').on('click', _hide);
      }


      // bind to angular events for when route rendering is finished.
      // add support for both built in router and ui-router
      $rootScope.$on('$routeChangeSuccess', _init);
      $rootScope.$on('$stateChangeSuccess', _init);
      //$rootScope.$on('$includeContentLoaded', _init);
      $rootScope.$on('$viewContentLoaded', _init);
      function _init () {

        // reset menu pointer.  if it doesn't exist, hide the trigger.  use
        // visibility because jquery show/hide toggled inline-block and made
        // the icon randomly appear
        menu = $(menuId);
        if (!menu.length) {
          elm.css("visibility", "hidden");
          return;
        } else {
          elm.css("visibility", "");
        }

        // remove lingering body events
        $('body').removeClass('osm-open osm-right-open osm-left-open');

        // reset menu classes
        menu.removeClass('osm-right osm-left');
        menu.addClass('osm').addClass(slide === 'right' ? 'osm-right' : 'osm-left');
      }

      // slide menu in
      function _toggle () {

        // menu already opened
        if ($('body').hasClass('osm-open')) {
          _hide();
        }
        // open menu
        else {
          _init()
          $('body').addClass('osm-open').addClass(slide === 'right' ? 'osm-right-open' : 'osm-left-open');
        }
      };

      // slide menu out
      function _hide() {
        $('body').removeClass('osm-open osm-right-open osm-left-open');
      }
    }
  }
}]);

// Generated by CoffeeScript 1.7.1
(function() {

    /**
     *  recalculateZIndex - As we transition from old modals to new modals, we need
     *      to support old modals being opened from a new modal. To do so, we can
     *      get the z-index of the new modal, and add one, so the old child modal
     *      appears above the new one.
     */
    function recalculateZIndex(element) {
        if (Olive.modal.openModals.length) {
              var modalWrap = element.parent('.modal-wrap'),
                  zIndex = +Olive.modal.openModals[0].wrapper.css('zIndex') + 1;

              modalWrap.css('zIndex', zIndex);
          }
    }



  angular.module('ds.olive').factory('dsModals', function($rootScope, $q) {
    var openedModals = [];
    function closeModal(resolve, data) {
      var modal = openedModals.pop();
      if (modal) {
        modal.scope.$emit('ds.close.modal');
        if (resolve) {
          modal.deference.resolve(data);
        } else {
          modal.deference.reject(data);
        }
      }
    }
    return {
      openedModals: openedModals,
      openModal: function(templateUrl, scope, size, cantEscape, hasCloseButton) {
        $(document.activeElement).blur()
        var deferred = $q.defer();
        var modal = {
          templateUrl: templateUrl,
          scope: scope.$new(),
          size: size,
          cantEscape: cantEscape,
          hasCloseButton: hasCloseButton,
          deference: deferred
        };
        openedModals.push(modal);

        // Close any open popover elements (menus, tooltips, etc) when a new modal opens.
        if (window.Olive && window.Olive.popover) {
            window.Olive.popover.closeAll();
        }

        // Emit to the world that a modal is opening
        modal.scope.$emit('ds.open.modal');
        return deferred.promise;
      },
      closeModal: closeModal,
      closeAllModals: function(){
        while (openedModals.length) {
          closeModal();
        }
      },
      escapeModal: function() {
        if (openedModals[openedModals.length - 1] && !openedModals[openedModals.length - 1].cantEscape) {
          closeModal();
        }
      }
    };
  });

  angular.module('ds.olive').directive('dsModal', function(dsModals) {
    return {
      scope: true,
      link: function(scope, element, attrs) {
        scope.closeModal = dsModals.closeModal;
        return element.on('click', function() {
          return scope.$apply(function() {
            return dsModals.openModal(attrs.dsModal, scope, attrs.dsSize, attrs.dsModalCantEscape, attrs.dsAddClose);
          });
        });
      }
    };
  });

  angular.module('ds.olive').directive('dsGlobalModal', function($rootScope, $document, $compile, dsModals) {
    return {
      template: '<div class="modal modal-wrap"modal-wrapper="true"ds-scroll ng-class="{\'transparent-background\': !$last}"ng-repeat="modal in openedModals"data-qa="modal-backdrop"ng-click="maybeCloseModal($event)"> <div class="modal-content"ng-class="modal.size"private-modal-child="modal"> </div> </div>',
      link: function(scope, element, attrs) {

        scope.maybeCloseModal = function(event) {
          if ($(event.target).attr('modal-wrapper')) {
            return dsModals.escapeModal();
          }
        };
        scope.closeModal = dsModals.closeModal;
        scope.closeAllModals = dsModals.closeAllModals;
        scope.openedModals = dsModals.openedModals;
        scope.$watchCollection('openedModals', function(openedModals) {
          newLength = openedModals.length;

          if (newLength) {

            if (Olive.migrate) {
                Olive.migrate.testAll();
            }

            return $('body').addClass('ds-modal-open');
          } else {
            return $('body').removeClass('ds-modal-open');
          }
        });
        return $document.bind('keydown', function(e) {
          return scope.$apply(function() {
            if (e.which === 27) {
              return dsModals.escapeModal();
            }
          });
        });
      }
    };
  });

  angular.module('ds.olive').directive('privateModalChild', function($compile, $parse) {
    return {
      template: '<button class="icon icon-times close-x" data-qa="modal-close-x" ng-click="closeModal()" ng-if="modalSettings.hasCloseButton"></button>',
      link: function(scope, element, attrs) {
        scope.$on('$destroy', function(){
          modalSettings.scope.$destroy();
        });
        var modalContent, modalSettings;
        scope.modalSettings = modalSettings = $parse(attrs.privateModalChild)(scope);
        scope.modal.element = element
        modalContent = $compile("<div ng-include=\"'" + modalSettings.templateUrl + "'\"></div>")(modalSettings.scope);
        element.append(modalContent);

        recalculateZIndex(element);

        return true;
      }
    };
  });

  angular.module('ds.olive').directive('dsCloseModal', function($rootScope, dsModals) {
    return {
      link: function(scope, element, attrs){
        element.on('click', function(){
          if (!attrs.disabled && !element.hasClass('disabled')) {
            dsModals.closeModal();
            $rootScope.$digest();
          }
        });
      }
    };
  });


}).call(this);

/*-----------------------------------------------------------------*\
    <a olive-modal-trigger="myModalTrigger"
       olive-modal-destroy-on-close="true"
       olive-modal-prevent-close="true"
       olive-modal-show-close="true"
       olive-modal-size="lg"
       olive-modal-template-id="myModalElement"
       olive-modal-template-url="//path/to/file.html">
        Click me to open modal with all these fun options
    </a>
\*-----------------------------------------------------------------*/
angular.module('ds.olive').directive('oliveModalTrigger', function (oliveModal) {
    
    'use strict';
    
    return {
        link: function (scope, element, attrs) {
            
            var namespace = 'modalTrigger';
            
            scope.$on('$destroy', function () {
                element.off('.' + namespace);
            });
            
            element.on('click.' + namespace, function () {
            
                var destroyOnClose = (attrs.oliveModalDestroyOnClose && attrs.oliveModalDestroyOnClose === 'true') || false,
                    name = attrs.oliveModalTrigger,
                    preventClose = (attrs.oliveModalPreventClose && attrs.oliveModalPreventClose === 'true') || false,
                    showClose = attrs.oliveModalShowClose ? attrs.oliveModalShowClose === 'true' : true,
                    size = attrs.oliveModalSize || '',
                    templateId = attrs.oliveModalTemplateId,
                    templateUrl = attrs.oliveModalTemplateUrl;

                oliveModal.openModal({
                    destroyOnClose: destroyOnClose,
                    name: name,
                    preventClose: preventClose,
                    scope: scope,
                    showClose: showClose,
                    size: size,
                    templateId: templateId,
                    templateUrl: templateUrl
                });
                
            });
            
            return true;
        }
    };
});

(function (angular, $, Olive) {

    'use strict';

    angular.module('ds.olive').factory('oliveModal', ['$rootScope', '$q', '$compile', '$templateRequest', '$timeout', function ($rootScope, $q, $compile, $templateRequest, $timeout) {

        var defaultModalOptions = {
            'showClose': true,
            'preventClose': false,
            'destroyOnClose': true,
            'useAnimation': true,
            'size': 'md',
            'animationModel': 'fade'
        };

        /*
            Generate content from one of the following:
                templateUrl - external file
                templateId - element on page
                template - raw HTML

            Reference the HTML in the "fnAfter" callback

            Example:
                getContent(options).then(function (html) {
                    // do stuff with your HTML
                });
         */
        var getContent = function (options) {

            // Represents the operation of getting the HTML content.
            var gotContent;

            if (options.templateUrl) {

                // What we return to the caller is the actual operation to get the HTML content.
                gotContent = $templateRequest(options.templateUrl);

            } else if (options.templateId) {

                // Find the element and fulfill with its HTML.
                var el = document.getElementById(options.templateId);
                if (el) {
                    gotContent = $q.when(el.innerHTML);
                } else {
                    gotContent = $q.reject('Element not found: ' + options.templateId);
                }

            } else if (options.template) {

                // We have raw HTML, so just fulfill with that.
                gotContent = $q.when(options.template);

            }

            // As a side operation, we output errors to the console.
            // This doesn't catch / suppress the error, just lets us respond to it.
            gotContent.catch(function (error) {
                window.console.error('[oliveModal] ' + error);
                return $q.reject(error);
            });

            //Return the operation.
            return gotContent;

        };

        return {

            openModals: function () {
                return Olive.modal.openModals;
            },

            /*
                openModal({
                    scope: $scope,
                    size: 'xl',
                    templateUrl: 'path/to/file.html',
                    onOpen: function (instance) {
                        // code you would like to run on open
                    },
                    onComplete: function () {
                        // code you would like to run on complete
                    },
                    onEscape: function () {
                        // code you would like to run on escape (pressing a cancel/escape button)
                    }
                }).then(function (instance) {
                    // Run some code after the template has compiled. Please note, this does not mean the modal has completed opening yet. Use the onOpen callback for that
                });
            */
            openModal: function (options) {

                var
                    nameCounter = 0,
                    nameAssigned = false,
                    configObj,
                    modalName,
                    instance,
                    deferred = $q.defer();

                // set up the config object with the defaults
                configObj = $.extend({}, defaultModalOptions);
                $.extend(configObj, options);

                // if no name is provided, create one programmatically
                if (!options.name) {
                    while (nameAssigned === false) {
                        modalName = "olive-modal-" + String(nameCounter);
                        if (Object.keys(window.Olive.modal.instances).indexOf(modalName) === -1) {
                            nameAssigned = true;
                        } else {
                            nameCounter++;
                        }
                    }
                    configObj.name = modalName;
                }

                return getContent(configObj).then(function (html) {
                    configObj.content = $compile(html)(configObj.scope);

                    return $timeout(function () {
                        return Olive.modal.show(configObj);
                    });

                });
            },

            completeTopModal: function (data) {
                return Olive.modal.completeTopModal(data);
            },

            escapeTopModal: function (data) {
                return Olive.modal.escapeTopModal(data);
            },

            getTopModal: function () {
                return Olive.modal.openModals[Olive.modal.openModals.length - 1];
            },

            /*
                confirmationModal({
                    title: "Optional Title",
                    text: "Are you sure you wish to proceed?",
                    completeLabel: "Continue",
                    completeFunction: function() {
                        // code you would like to run on complete
                    },
                    escapeLabel: "Cancel",
                    escapeFunction: function() {
                        // code you wish to run on escape
                    }
                });
             */
            confirmationModal: function (options) {
                return Olive.modal.confirm(options);
            },

            closeAllModals: function () {
                Olive.modal.closeAll();
                return;
            }
        };
    }]);
}(window.angular, window.jQuery, window.Olive));

/*
 * Usage:
 *    var notification = dsNotification.show({msg: 'A sample notification', type: 'info', hideClose: false});
 *    setTimeout(function () { notification.close(); }, 5000);
 */
angular.module('ds.olive').factory( 'dsNotification', ['$rootScope', '$compile', '$document', '$sanitize', 'dsModals', 'oliveMessage', function ($rootScope, $compile, $document, $sanitize, dsModals, oliveMessage) {
  $rootScope.$on("ds.modal.displayed", function(){
    _close.apply({element: $('.notification')});
  });

  $rootScope.$on("$locationChangeSuccess", function(){
    $('.notification').each(function (i, elm) {
      elm = $(elm);
      if (elm.attr('sticky') !== 'true') _close.apply({element: elm});
    });
  });

  //defaults
  var _settings = {
    'hideClose': false,
    'modal': false,         /* T || F, display the notificaiton inside a modal */
    'msg': null,            /* required, can't have a notification without a message! */
    'type': null,           /* 'info' || 'warn' || 'alert' || 'success' */
    'scope': null,
    'unsafe': false,
    'sticky': false,
  };

  //constants
  var _showNotificationClassName = 'notification-show';

  //methods

  var _closeBy = function(type, label) {
    if(type == 'id') {
     _close.apply({element: $('.notification#' + label)});
    }
    if(type == "type") {
      _close.apply({element: $('.notification.notification-' + label)});
    }
  }


  var _show = function(options) {
    var container;
    var setContainerToGlobal = function(){
      container =  $('.global-notifications');
      if (!container.length) {
        container = $('<div />', {'class': 'global-notifications'}).appendTo('body');
      }
    };
    var setContainerToElement = function(element){
        container = element.find('.modal-notifications');
        if (!container.length) {
          container = $('<div />', {'class': 'grid modal-notifications'});
          element.find('.header').after(container);
        }
        container.empty()
    };

    var settings = $.extend({}, _settings);
    var options = $.extend(settings, options);

    var properties = _getPropsFromType(options.type);

    var showMessageInModal = function(modalInstance) {

        options.modal = modalInstance.name;

        var typeDictionary = Olive.message.legacyTypes;

        var returnObject = oliveMessage.show(
            options.msg,
            options.name || undefined,
            typeDictionary[options.type],
            options,
            options.scope
        );
        return returnObject;
    };

    if (typeof options.modal === 'string' && dsModals.openedModals.length){
      var specificModalIsOpen = false;
      dsModals.openedModals.forEach(function(modal){
        if (modal.templateUrl === options.modal){
          specificModalIsOpen = true;
          setContainerToElement(modal.element);
        }
      });
      if (!specificModalIsOpen) {
        setContainerToGlobal();
      }
    } else if (typeof options.modal === 'string' && Olive.modal.openModals.length) {
        for (var i=0; i<Olive.modal.openModals.length; i++) {
            var instance = Olive.modal.openModals[i];
            if (instance.name == options.modal) {
                var ret = showMessageInModal(instance);
                return ret;
            }
        }
        setContainerToGlobal();
    } else if (options.modal && dsModals.openedModals.length) {
      var topModal = dsModals.openedModals[dsModals.openedModals.length - 1];
      setContainerToElement(topModal.element);
    } else if (options.modal && Olive.modal.openModals.length) {
        var instance = Olive.modal.openModals[Olive.modal.openModals.length - 1];
        var ret = showMessageInModal(instance);
        return ret;
    } else {
      setContainerToGlobal();
    }

    element = $('<div />', { 'class': 'notification ' + properties.className })
                  .on('click', '.notification-close', function(e) {
                    _close.apply({element: $(e.target).closest('.notification')});
                  })
                  .appendTo(container);
    if (options.sticky) {
      element.attr('sticky', 'true');
    }

    var icon = $('<span />', { 'class': 'notification-icon icon ' + properties.icon })
      .appendTo(element);

    var message;
    message = options.unsafe ?  $compile(options.msg)(options.scope) : $sanitize(options.msg);
    content = $('<div />', { 'class': 'content', 'data-qa': 'notification-content' })
                .html(message)
                .appendTo(element);

    if(!options.hideClose) {
      $('<span />', { 'class': 'notification-close icon icon-times', 'data-qa': 'notification-close' })
        .appendTo(element);
    }

    // Forces animation
    window.getComputedStyle(element[0]).margin;
    window.getComputedStyle(element[0]).maxHeight;
    window.getComputedStyle(element[0]).opacity;

    element.addClass(_showNotificationClassName);

    if (options.id) {
      element.prop('id', options.id)
    }
    // type success closes after 5 seconds
    var ret = {element: element, close: _close};
    if (options.type === 'success') {
      setTimeout(function () {
        ret.close();
        ret.element = null;
      }, options.timeout || 5000);
    }

    // temporarily -- trigger a test to show that this is deprecated
    if (Olive.migrate != undefined) {
        Olive.migrate.test('message');
    }

    return ret;
  };

  var _getPropsFromType = function(type) {

    var className = '',
        icon = '';

    if(type == 'info') {
      className = 'notification-info';
      icon = 'icon-alert-triangle';
    } else if(type == 'warn') {
      className = 'notification-warn';
      icon = 'icon-alert-triangle';
    } else if(type == 'alert') {
      className = 'notification-alert';
      icon = 'icon-alert-triangle';
    } else if(type == 'success') {
      className = 'notification-success';
      icon = 'icon-check';
    }

    return {
      'className': className,
      'icon': icon
    };
  };

  var _close = function() {
    // self closing notifications may not have an element after closing
    var element = this.element;
    if (!this.element) return;

    if (element.parent().hasClass('modal-notifications')) {
      element
        .removeClass(_showNotificationClassName).remove()
    } else {
      element.removeClass(_showNotificationClassName);
      setTimeout(
          function() {element.remove();},
          500
      );
    }

  };

  return {
    show: _show,
    closeBy: _closeBy,
    closeAll: function(){ $('.modal-notifications, .global-notifications').remove(); }
  }
}]);


angular.module('ds.olive').service('dsPopover', [function () {

  function _S4() {
      return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  }
    
  function _guid() {
      return (_S4() + _S4() + "-" + _S4() + "-4" + _S4().substr(0,3) + "-" + _S4() + "-" + _S4() + _S4() + _S4()).toLowerCase();
  }

  function _init(trigger, contentId, location, events, tip) {
      if (Olive == undefined) {
          return false;
      }
      $(trigger).attr('ds-popover', contentId.substr(1));
      var
        configObj = {};
      configObj.trigger = trigger;
      configObj.contentId = contentId.substr(1);
      configObj.location = location;
      configObj.events = events;
      configObj.tip = tip;

      var
        instance = Olive.popover.initialize(undefined, configObj);

  }

  return {
    'init': _init,
    'guid': _guid
  };
}]);
/*
  Positioning:
    [above | below] && [left | center | right]
    [before | after] && [top | middle | bottom]
  */

angular.module('ds.olive').service('dsPosition', [function() {

  function _position(trigger, content, location, tip) {
    return Olive.position.calc(trigger, content, location, tip);
  } //end _position

  return {
    'position': _position
  };
}]);
angular.module('ds.olive').directive('dsPreview', ['$compile', 'Debounce', function ($compile, debounceFn) {
  return {
    restrict: 'A',
    scope: {
        templateUrl: '@dsPreview'
    },
    link: function (scope, elm, attr) {
        elm.on('click', function() {
            if(!attr.dsPreview){
              return;
            }
            var src = attr.dsPreview;

            var _close = function(e) {
                // don't close preview screen when clicking on the content
                if ($(e.target).closest('.shroud-content').length) {
                    return;
                }
                wrap.remove();
                $('body').removeClass('shroud-open');
                childScope.$destroy();
            };

            var wrap = $('<div class="shroud-wrap" shroud-wrap />')
                            .on('click', _close)
                            .on('scroll', function(){$(window).trigger('scroll');});

            var close = $('<div class="shroud-close-x" />')
                            .append('<span class="icon icon-times" />')
                            .on('click', _close)
                            .appendTo(wrap);

            var content = $('<div class="shroud-content" />').appendTo(wrap);

            wrap.appendTo('body');

            var childScope = scope.$parent.$new();
            $compile('<div ng-include="\'' + scope.templateUrl + '\'"></div>')(childScope).appendTo(content);
            scope.$parent.$digest();

            $('body').addClass('shroud-open');
        });
    }
};
}]);

angular.module('ds.olive').directive('inputRb', [function () {
  return {
    restrict: 'C', // decorates <input class="input-rb"> with new behavior
    link: function (scope, elm, attr) {

      // when bound to angular model, trigger change event to update styling
      if (attr.ngModel) {
        scope.$watch(attr.ngModel, function () {
          elm.change();
        });
      }

      elm.change(function () {

        var name = elm.attr('name');
        var radios = $('[name="' + name + '"]').removeClass('checked');

        var isChecked = elm.is(':checked');
        elm.toggleClass('checked', isChecked);
      });
    }
  };
}]);
/**
 * @license AngularJS v1.3.0-build.3317+sha.a1648a7
 * (c) 2010-2014 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function(window, angular, undefined) {'use strict';

var $sanitizeMinErr = angular.$$minErr('$sanitize');

/**
 * @ngdoc module
 * @name ngSanitize
 * @description
 *
 * # ngSanitize
 *
 * The `ngSanitize` module provides functionality to sanitize HTML.
 *
 *
 * <div doc-module-components="ngSanitize"></div>
 *
 * See {@link ngSanitize.$sanitize `$sanitize`} for usage.
 */

/*
 * HTML Parser By Misko Hevery (misko@hevery.com)
 * based on:  HTML Parser By John Resig (ejohn.org)
 * Original code by Erik Arvidsson, Mozilla Public License
 * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
 *
 * // Use like so:
 * htmlParser(htmlString, {
 *     start: function(tag, attrs, unary) {},
 *     end: function(tag) {},
 *     chars: function(text) {},
 *     comment: function(text) {}
 * });
 *
 */


/**
 * @ngdoc service
 * @name $sanitize
 * @kind function
 *
 * @description
 *   The input is sanitized by parsing the html into tokens. All safe tokens (from a whitelist) are
 *   then serialized back to properly escaped html string. This means that no unsafe input can make
 *   it into the returned string, however, since our parser is more strict than a typical browser
 *   parser, it's possible that some obscure input, which would be recognized as valid HTML by a
 *   browser, won't make it through the sanitizer.
 *   The whitelist is configured using the functions `aHrefSanitizationWhitelist` and
 *   `imgSrcSanitizationWhitelist` of {@link ng.$compileProvider `$compileProvider`}.
 *
 * @param {string} html Html input.
 * @returns {string} Sanitized html.
 *
 * @example
   <example module="sanitizeExample" deps="angular-sanitize.js">
   <file name="index.html">
     <script>
         angular.module('sanitizeExample', ['ngSanitize'])
           .controller('ExampleController', ['$scope', '$sce', function($scope, $sce) {
             $scope.snippet =
               '<p style="color:blue">an html\n' +
               '<em onmouseover="this.textContent=\'PWN3D!\'">click here</em>\n' +
               'snippet</p>';
             $scope.deliberatelyTrustDangerousSnippet = function() {
               return $sce.trustAsHtml($scope.snippet);
             };
           }]);
     </script>
     <div ng-controller="ExampleController">
        Snippet: <textarea ng-model="snippet" cols="60" rows="3"></textarea>
       <table>
         <tr>
           <td>Directive</td>
           <td>How</td>
           <td>Source</td>
           <td>Rendered</td>
         </tr>
         <tr id="bind-html-with-sanitize">
           <td>ng-bind-html</td>
           <td>Automatically uses $sanitize</td>
           <td><pre>&lt;div ng-bind-html="snippet"&gt;<br/>&lt;/div&gt;</pre></td>
           <td><div ng-bind-html="snippet"></div></td>
         </tr>
         <tr id="bind-html-with-trust">
           <td>ng-bind-html</td>
           <td>Bypass $sanitize by explicitly trusting the dangerous value</td>
           <td>
           <pre>&lt;div ng-bind-html="deliberatelyTrustDangerousSnippet()"&gt;
&lt;/div&gt;</pre>
           </td>
           <td><div ng-bind-html="deliberatelyTrustDangerousSnippet()"></div></td>
         </tr>
         <tr id="bind-default">
           <td>ng-bind</td>
           <td>Automatically escapes</td>
           <td><pre>&lt;div ng-bind="snippet"&gt;<br/>&lt;/div&gt;</pre></td>
           <td><div ng-bind="snippet"></div></td>
         </tr>
       </table>
       </div>
   </file>
   <file name="protractor.js" type="protractor">
     it('should sanitize the html snippet by default', function() {
       expect(element(by.css('#bind-html-with-sanitize div')).getInnerHtml()).
         toBe('<p>an html\n<em>click here</em>\nsnippet</p>');
     });

     it('should inline raw snippet if bound to a trusted value', function() {
       expect(element(by.css('#bind-html-with-trust div')).getInnerHtml()).
         toBe("<p style=\"color:blue\">an html\n" +
              "<em onmouseover=\"this.textContent='PWN3D!'\">click here</em>\n" +
              "snippet</p>");
     });

     it('should escape snippet without any filter', function() {
       expect(element(by.css('#bind-default div')).getInnerHtml()).
         toBe("&lt;p style=\"color:blue\"&gt;an html\n" +
              "&lt;em onmouseover=\"this.textContent='PWN3D!'\"&gt;click here&lt;/em&gt;\n" +
              "snippet&lt;/p&gt;");
     });

     it('should update', function() {
       element(by.model('snippet')).clear();
       element(by.model('snippet')).sendKeys('new <b onclick="alert(1)">text</b>');
       expect(element(by.css('#bind-html-with-sanitize div')).getInnerHtml()).
         toBe('new <b>text</b>');
       expect(element(by.css('#bind-html-with-trust div')).getInnerHtml()).toBe(
         'new <b onclick="alert(1)">text</b>');
       expect(element(by.css('#bind-default div')).getInnerHtml()).toBe(
         "new &lt;b onclick=\"alert(1)\"&gt;text&lt;/b&gt;");
     });
   </file>
   </example>
 */
function $SanitizeProvider() {
  this.$get = ['$$sanitizeUri', function($$sanitizeUri) {
    return function(html) {
      var buf = [];
      htmlParser(html, htmlSanitizeWriter(buf, function(uri, isImage) {
        return !/^unsafe/.test($$sanitizeUri(uri, isImage));
      }));
      return buf.join('');
    };
  }];
}

function sanitizeText(chars) {
  var buf = [];
  var writer = htmlSanitizeWriter(buf, angular.noop);
  writer.chars(chars);
  return buf.join('');
}


// Regular Expressions for parsing tags and attributes
var START_TAG_REGEXP =
       /^<((?:[a-zA-Z])[\w:-]*)((?:\s+[\w:-]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)\s*(>?)/,
  END_TAG_REGEXP = /^<\/\s*([\w:-]+)[^>]*>/,
  ATTR_REGEXP = /([\w:-]+)(?:\s*=\s*(?:(?:"((?:[^"])*)")|(?:'((?:[^'])*)')|([^>\s]+)))?/g,
  BEGIN_TAG_REGEXP = /^</,
  BEGING_END_TAGE_REGEXP = /^<\//,
  COMMENT_REGEXP = /<!--(.*?)-->/g,
  DOCTYPE_REGEXP = /<!DOCTYPE([^>]*?)>/i,
  CDATA_REGEXP = /<!\[CDATA\[(.*?)]]>/g,
  SURROGATE_PAIR_REGEXP = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g,
  // Match everything outside of normal chars and " (quote character)
  NON_ALPHANUMERIC_REGEXP = /([^\#-~| |!])/g;


// Good source of info about elements and attributes
// http://dev.w3.org/html5/spec/Overview.html#semantics
// http://simon.html5.org/html-elements

// Safe Void Elements - HTML5
// http://dev.w3.org/html5/spec/Overview.html#void-elements
var voidElements = makeMap("area,br,col,hr,img,wbr");

// Elements that you can, intentionally, leave open (and which close themselves)
// http://dev.w3.org/html5/spec/Overview.html#optional-tags
var optionalEndTagBlockElements = makeMap("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr"),
    optionalEndTagInlineElements = makeMap("rp,rt"),
    optionalEndTagElements = angular.extend({},
                                            optionalEndTagInlineElements,
                                            optionalEndTagBlockElements);

// Safe Block Elements - HTML5
var blockElements = angular.extend({}, optionalEndTagBlockElements, makeMap("address,article," +
        "aside,blockquote,caption,center,del,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5," +
        "h6,header,hgroup,hr,ins,map,menu,nav,ol,pre,script,section,table,ul"));

// Inline Elements - HTML5
var inlineElements = angular.extend({}, optionalEndTagInlineElements, makeMap("a,abbr,acronym,b," +
        "bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,q,ruby,rp,rt,s," +
        "samp,small,span,strike,strong,sub,sup,time,tt,u,var"));


// Special Elements (can contain anything)
var specialElements = makeMap("script,style");

var validElements = angular.extend({},
                                   voidElements,
                                   blockElements,
                                   inlineElements,
                                   optionalEndTagElements);

//Attributes that have href and hence need to be sanitized
var uriAttrs = makeMap("background,cite,href,longdesc,src,usemap");
var validAttrs = angular.extend({}, uriAttrs, makeMap(
    'abbr,align,alt,axis,bgcolor,border,cellpadding,cellspacing,class,clear,'+
    'color,cols,colspan,compact,coords,dir,face,headers,height,hreflang,hspace,'+
    'ismap,lang,language,nohref,nowrap,rel,rev,rows,rowspan,rules,'+
    'scope,scrolling,shape,size,span,start,summary,target,title,type,'+
    'valign,value,vspace,width'));

function makeMap(str) {
  var obj = {}, items = str.split(','), i;
  for (i = 0; i < items.length; i++) obj[items[i]] = true;
  return obj;
}


/**
 * @example
 * htmlParser(htmlString, {
 *     start: function(tag, attrs, unary) {},
 *     end: function(tag) {},
 *     chars: function(text) {},
 *     comment: function(text) {}
 * });
 *
 * @param {string} html string
 * @param {object} handler
 */
function htmlParser( html, handler ) {
  if (typeof html !== 'string') {
    if (html === null || typeof html === 'undefined') {
      html = '';
    } else {
      html = '' + html;
    }
  }
  var index, chars, match, stack = [], last = html, text;
  stack.last = function() { return stack[ stack.length - 1 ]; };

  while ( html ) {
    text = '';
    chars = true;

    // Make sure we're not in a script or style element
    if ( !stack.last() || !specialElements[ stack.last() ] ) {

      // Comment
      if ( html.indexOf("<!--") === 0 ) {
        // comments containing -- are not allowed unless they terminate the comment
        index = html.indexOf("--", 4);

        if ( index >= 0 && html.lastIndexOf("-->", index) === index) {
          if (handler.comment) handler.comment( html.substring( 4, index ) );
          html = html.substring( index + 3 );
          chars = false;
        }
      // DOCTYPE
      } else if ( DOCTYPE_REGEXP.test(html) ) {
        match = html.match( DOCTYPE_REGEXP );

        if ( match ) {
          html = html.replace( match[0], '');
          chars = false;
        }
      // end tag
      } else if ( BEGING_END_TAGE_REGEXP.test(html) ) {
        match = html.match( END_TAG_REGEXP );

        if ( match ) {
          html = html.substring( match[0].length );
          match[0].replace( END_TAG_REGEXP, parseEndTag );
          chars = false;
        }

      // start tag
      } else if ( BEGIN_TAG_REGEXP.test(html) ) {
        match = html.match( START_TAG_REGEXP );

        if ( match ) {
          // We only have a valid start-tag if there is a '>'.
          if ( match[4] ) {
            html = html.substring( match[0].length );
            match[0].replace( START_TAG_REGEXP, parseStartTag );
          }
          chars = false;
        } else {
          // no ending tag found --- this piece should be encoded as an entity.
          text += '<';
          html = html.substring(1);
        }
      }

      if ( chars ) {
        index = html.indexOf("<");

        text += index < 0 ? html : html.substring( 0, index );
        html = index < 0 ? "" : html.substring( index );

        if (handler.chars) handler.chars( decodeEntities(text) );
      }

    } else {
      html = html.replace(new RegExp("(.*)<\\s*\\/\\s*" + stack.last() + "[^>]*>", 'i'),
        function(all, text){
          text = text.replace(COMMENT_REGEXP, "$1").replace(CDATA_REGEXP, "$1");

          if (handler.chars) handler.chars( decodeEntities(text) );

          return "";
      });

      parseEndTag( "", stack.last() );
    }

    if ( html == last ) {
      throw $sanitizeMinErr('badparse', "The sanitizer was unable to parse the following block " +
                                        "of html: {0}", html);
    }
    last = html;
  }

  // Clean up any remaining tags
  parseEndTag();

  function parseStartTag( tag, tagName, rest, unary ) {
    tagName = angular.lowercase(tagName);
    if ( blockElements[ tagName ] ) {
      while ( stack.last() && inlineElements[ stack.last() ] ) {
        parseEndTag( "", stack.last() );
      }
    }

    if ( optionalEndTagElements[ tagName ] && stack.last() == tagName ) {
      parseEndTag( "", tagName );
    }

    unary = voidElements[ tagName ] || !!unary;

    if ( !unary )
      stack.push( tagName );

    var attrs = {};

    rest.replace(ATTR_REGEXP,
      function(match, name, doubleQuotedValue, singleQuotedValue, unquotedValue) {
        var value = doubleQuotedValue
          || singleQuotedValue
          || unquotedValue
          || '';

        attrs[name] = decodeEntities(value);
    });
    if (handler.start) handler.start( tagName, attrs, unary );
  }

  function parseEndTag( tag, tagName ) {
    var pos = 0, i;
    tagName = angular.lowercase(tagName);
    if ( tagName )
      // Find the closest opened tag of the same type
      for ( pos = stack.length - 1; pos >= 0; pos-- )
        if ( stack[ pos ] == tagName )
          break;

    if ( pos >= 0 ) {
      // Close all the open elements, up the stack
      for ( i = stack.length - 1; i >= pos; i-- )
        if (handler.end) handler.end( stack[ i ] );

      // Remove the open elements from the stack
      stack.length = pos;
    }
  }
}

var hiddenPre=document.createElement("pre");
var spaceRe = /^(\s*)([\s\S]*?)(\s*)$/;
/**
 * decodes all entities into regular string
 * @param value
 * @returns {string} A string with decoded entities.
 */
function decodeEntities(value) {
  if (!value) { return ''; }

  // Note: IE8 does not preserve spaces at the start/end of innerHTML
  // so we must capture them and reattach them afterward
  var parts = spaceRe.exec(value);
  var spaceBefore = parts[1];
  var spaceAfter = parts[3];
  var content = parts[2];
  if (content) {
    hiddenPre.innerHTML=content.replace(/</g,"&lt;");
    // innerText depends on styling as it doesn't display hidden elements.
    // Therefore, it's better to use textContent not to cause unnecessary
    // reflows. However, IE<9 don't support textContent so the innerText
    // fallback is necessary.
    content = 'textContent' in hiddenPre ?
      hiddenPre.textContent : hiddenPre.innerText;
  }
  return spaceBefore + content + spaceAfter;
}

/**
 * Escapes all potentially dangerous characters, so that the
 * resulting string can be safely inserted into attribute or
 * element text.
 * @param value
 * @returns {string} escaped text
 */
function encodeEntities(value) {
  return value.
    replace(/&/g, '&amp;').
    replace(SURROGATE_PAIR_REGEXP, function (value) {
      var hi = value.charCodeAt(0);
      var low = value.charCodeAt(1);
      return '&#' + (((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000) + ';';
    }).
    replace(NON_ALPHANUMERIC_REGEXP, function(value){
      return '&#' + value.charCodeAt(0) + ';';
    }).
    replace(/</g, '&lt;').
    replace(/>/g, '&gt;');
}

/**
 * create an HTML/XML writer which writes to buffer
 * @param {Array} buf use buf.jain('') to get out sanitized html string
 * @returns {object} in the form of {
 *     start: function(tag, attrs, unary) {},
 *     end: function(tag) {},
 *     chars: function(text) {},
 *     comment: function(text) {}
 * }
 */
function htmlSanitizeWriter(buf, uriValidator){
  var ignore = false;
  var out = angular.bind(buf, buf.push);
  return {
    start: function(tag, attrs, unary){
      tag = angular.lowercase(tag);
      if (!ignore && specialElements[tag]) {
        ignore = tag;
      }
      if (!ignore && validElements[tag] === true) {
        out('<');
        out(tag);
        angular.forEach(attrs, function(value, key){
          var lkey=angular.lowercase(key);
          var isImage = (tag === 'img' && lkey === 'src') || (lkey === 'background');
          if (validAttrs[lkey] === true &&
            (uriAttrs[lkey] !== true || uriValidator(value, isImage))) {
            out(' ');
            out(key);
            out('="');
            out(encodeEntities(value));
            out('"');
          }
        });
        out(unary ? '/>' : '>');
      }
    },
    end: function(tag){
        tag = angular.lowercase(tag);
        if (!ignore && validElements[tag] === true) {
          out('</');
          out(tag);
          out('>');
        }
        if (tag == ignore) {
          ignore = false;
        }
      },
    chars: function(chars){
        if (!ignore) {
          out(encodeEntities(chars));
        }
      }
  };
}


// define ngSanitize module and register $sanitize service
angular.module('ds.olive').provider('$sanitize', $SanitizeProvider);

/* global sanitizeText: false */

/**
 * @ngdoc filter
 * @name linky
 * @kind function
 *
 * @description
 * Finds links in text input and turns them into html links. Supports http/https/ftp/mailto and
 * plain email address links.
 *
 * Requires the {@link ngSanitize `ngSanitize`} module to be installed.
 *
 * @param {string} text Input text.
 * @param {string} target Window (_blank|_self|_parent|_top) or named frame to open links in.
 * @returns {string} Html-linkified text.
 *
 * @usage
   <span ng-bind-html="linky_expression | linky"></span>
 *
 * @example
   <example module="linkyExample" deps="angular-sanitize.js">
     <file name="index.html">
       <script>
         angular.module('linkyExample', ['ngSanitize'])
           .controller('ExampleController', ['$scope', function($scope) {
             $scope.snippet =
               'Pretty text with some links:\n'+
               'http://angularjs.org/,\n'+
               'mailto:us@somewhere.org,\n'+
               'another@somewhere.org,\n'+
               'and one more: ftp://127.0.0.1/.';
             $scope.snippetWithTarget = 'http://angularjs.org/';
           }]);
       </script>
       <div ng-controller="ExampleController">
       Snippet: <textarea ng-model="snippet" cols="60" rows="3"></textarea>
       <table>
         <tr>
           <td>Filter</td>
           <td>Source</td>
           <td>Rendered</td>
         </tr>
         <tr id="linky-filter">
           <td>linky filter</td>
           <td>
             <pre>&lt;div ng-bind-html="snippet | linky"&gt;<br>&lt;/div&gt;</pre>
           </td>
           <td>
             <div ng-bind-html="snippet | linky"></div>
           </td>
         </tr>
         <tr id="linky-target">
          <td>linky target</td>
          <td>
            <pre>&lt;div ng-bind-html="snippetWithTarget | linky:'_blank'"&gt;<br>&lt;/div&gt;</pre>
          </td>
          <td>
            <div ng-bind-html="snippetWithTarget | linky:'_blank'"></div>
          </td>
         </tr>
         <tr id="escaped-html">
           <td>no filter</td>
           <td><pre>&lt;div ng-bind="snippet"&gt;<br>&lt;/div&gt;</pre></td>
           <td><div ng-bind="snippet"></div></td>
         </tr>
       </table>
     </file>
     <file name="protractor.js" type="protractor">
       it('should linkify the snippet with urls', function() {
         expect(element(by.id('linky-filter')).element(by.binding('snippet | linky')).getText()).
             toBe('Pretty text with some links: http://angularjs.org/, us@somewhere.org, ' +
                  'another@somewhere.org, and one more: ftp://127.0.0.1/.');
         expect(element.all(by.css('#linky-filter a')).count()).toEqual(4);
       });

       it('should not linkify snippet without the linky filter', function() {
         expect(element(by.id('escaped-html')).element(by.binding('snippet')).getText()).
             toBe('Pretty text with some links: http://angularjs.org/, mailto:us@somewhere.org, ' +
                  'another@somewhere.org, and one more: ftp://127.0.0.1/.');
         expect(element.all(by.css('#escaped-html a')).count()).toEqual(0);
       });

       it('should update', function() {
         element(by.model('snippet')).clear();
         element(by.model('snippet')).sendKeys('new http://link.');
         expect(element(by.id('linky-filter')).element(by.binding('snippet | linky')).getText()).
             toBe('new http://link.');
         expect(element.all(by.css('#linky-filter a')).count()).toEqual(1);
         expect(element(by.id('escaped-html')).element(by.binding('snippet')).getText())
             .toBe('new http://link.');
       });

       it('should work with the target property', function() {
        expect(element(by.id('linky-target')).
            element(by.binding("snippetWithTarget | linky:'_blank'")).getText()).
            toBe('http://angularjs.org/');
        expect(element(by.css('#linky-target a')).getAttribute('target')).toEqual('_blank');
       });
     </file>
   </example>
 */
angular.module('ds.olive').filter('linky', ['$sanitize', function($sanitize) {
  var LINKY_URL_REGEXP =
        /((ftp|https?):\/\/|(mailto:)?[A-Za-z0-9._%+-]+@)\S*[^\s.;,(){}<>"]/,
      MAILTO_REGEXP = /^mailto:/;

  return function(text, target) {
    if (!text) return text;
    var match;
    var raw = text;
    var html = [];
    var url;
    var i;
    while ((match = raw.match(LINKY_URL_REGEXP))) {
      // We can not end in these as they are sometimes found at the end of the sentence
      url = match[0];
      // if we did not match ftp/http/mailto then assume mailto
      if (match[2] == match[3]) url = 'mailto:' + url;
      i = match.index;
      addText(raw.substr(0, i));
      addLink(url, match[0].replace(MAILTO_REGEXP, ''));
      raw = raw.substring(i + match[0].length);
    }
    addText(raw);
    return $sanitize(html.join(''));

    function addText(text) {
      if (!text) {
        return;
      }
      html.push(sanitizeText(text));
    }

    function addLink(url, text) {
      html.push('<a ');
      if (angular.isDefined(target)) {
        html.push('target="');
        html.push(target);
        html.push('" ');
      }
      html.push('href="');
      html.push(url);
      html.push('">');
      addText(text);
      html.push('</a>');
    }
  };
}]);


})(window, window.angular);
(function (angular, Olive) {

    'use strict';

    angular.module('ds.olive').directive('oliveScrollShadow', function ($timeout, oliveInitComponent) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {

                var init = oliveInitComponent();

                init.oliveInitFunction = Olive.scrollShadow.initialize;

                init.checkDependencies = function (scope, element, attr) {
                    // no dependencies, just return true
                    return true;
                };

                $timeout(function () {
                    init.tryInitialize(scope, element, attr);
                });
            }
        };
    });

}(window.angular, window.Olive));

angular.module('ds.olive').directive('inputSelect', [function () {

  var _update = function(elm) {
    // Propagate the selected item text to the data-title of the parent to display it properly.
    var text = $(elm).find('option:selected').text();
    elm.parent().attr('data-title', text);
  };

  var _focus = function(elm, hasFocus) {
    elm.parent().toggleClass('focused', hasFocus);
  };

  return {
    restrict: 'C',
    link: function (scope, elm, attr) {

      if (attr.ngModel) {
        // Add a watcher to the data model, updating the display whenever the model indicates a change.
        scope.$watch(attr.ngModel, function() {
          _update(elm);
        });
      } else {
        //else if no angular model, bind to the change/click/update/keyup events on the element
        $(elm).on('change click update keyup', function() {
          _update(elm);
        }).trigger('change');
      }

      elm.on('focus', function() {
        _focus(elm, true);
      });

      elm.on('blur', function() {
        _focus(elm, false);
      });
    }
  };
}]);
angular.module('ds.olive').directive('dsSelect2', ['$rootScope', function ($rootScope) {
  return {
    restrict: 'A',
    link: function (scope, elm, attrs) {
        var options = {};
        options.maximumSelectionLength = attrs.max;

        $(elm).select2(options);
    }
  };
}]);

/*
 * Usage:
 *    var sitemessage = dsSiteMessage.show({msg: 'A sample notification', type: 'info', hideClose: false});
 *    setTimeout(function () { sitemessage.close(); }, 5000);
 *
 *    var sitemessage = dsSiteMessage.show({template: '/views/special-template.html', scope: $scope, type: 'info', hideClose: false});
 *    setTimeout(function () { sitemessage.close(); }, 5000);
 */
angular.module('ds.olive').factory( 'dsSiteMessage', ['$rootScope', '$compile', function ($rootScope, $compile) {

  // holds the site message
  var container;

  //defaults
  var _settings = {
    'msg': null,
    'type': null,         /* 'warn' || 'alert' */
    'hideClose': false
  };

  //constants
  var _siteMessageContainerId = 'site-message';

  //methods
  var _show = function(options) {
    settings = $.extend({}, _settings);
    options = $.extend(settings, options);
    container = $('#' + _siteMessageContainerId);

    // search for container.  if none exists, create
    var className = _getClassNameFromType(options.type);
    if (!container.length) {
      container = $('<div />', { 'id': _siteMessageContainerId,
                                 'class': 'site-msg ' + className })
                    .on('click', '.site-msg-close', function(e) {
                      _close();
                    })
                    .insertAfter('.site-header')
                    .append($('<div />', { 'class': 'site-container'}));
    }
    // otherwise clear previous template and add appropriate class
    else {
      container
        .removeClass('site-msg-warn site-msg-alert site-msg-attention')
        .addClass(className)
        .find('.site-container')
        .children()
        .remove();
    }
    container.show();

    if (options.blueButterBar) {
      container.addClass('blue-butter-bar');
    }

    if (options.msg) {
      container
        .find('.site-container')
        .html(options.msg);
    }
    else if (options.template && options.scope) {
      container
        .find('.site-container')
        .html($compile(
          '<div ng-include="\'' + options.template + '\'"></div>'
        )(options.scope));

      options.scope.$$phase || options.scope.$apply();
    }

    if(!options.hideClose) {
      $('<span />', { 'class': 'site-msg-close icon-times' })
        .appendTo(container);
    }
      
      $(window).trigger('show.siteMessage.olive');
      
  };

  var _getClassNameFromType = function(type) {

    var className = '';

    if(type == 'warn') {
      className = 'site-msg-warn';
    } else if(type == 'alert') {
      className = 'site-msg-alert';
    } else if(type == 'attention') {
      className = 'site-msg-attention';
    }

    return className;
  };

  var _close = function() {
    if (container && container.length) {
        container.hide();
        $(window).trigger('close.siteMessage.olive');
    }
  };

  return { show: _show, close: _close };
}]);


(function (angular, Olive) {

    'use strict';

    angular.module('ds.olive').directive('oliveSticky', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                $timeout(function () {
                    Olive.sticky.init(element);
                });
            }
        };
    });

}(window.angular, window.Olive));

(function (angular, Olive, $) {

    'use strict';

    angular.module('ds.olive').directive('oliveTabset', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {

                $timeout(function () {
                    Olive.tabs.initialize(element);
                });

                $(window).on(Olive.tabs.eventNames.activate, function (e, params) {
                    scope.$emit('olive.activate.tab', params);
                });
            }
        };
    });

}(window.angular, window.Olive, window.jQuery));

/*
    Keep the "dsTooltip" directive around for backwards compatibility
*/
angular.module('ds.olive').directive('dsTooltip', function ($timeout, oliveInitComponent) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {

            var init = oliveInitComponent();

            init.oliveInitFunction = Olive.tooltip.initialize;

            // for tooltips: dependencies met if there is a tooltip div with the correct id
            // or if the tooltip trigger has a title attribute (to create a mini tooltip)
            init.checkDependencies = function(scope, element, attr) {
                var
                    tooltipName = $(element).attr('ds-tooltip');

                if (tooltipName) {
                    return Boolean($("#" + tooltipName + ".tooltip").length);
                } else {
                    return Boolean(!($(element).attr('title') == undefined));
                }
            };

            $timeout(function() {
                init.tryInitialize(scope, element, attr);
            });
        }
    };
});

angular.module('ds.olive').directive('oliveTooltip', function ($timeout, oliveInitComponent) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {

            var init = oliveInitComponent();

            init.oliveInitFunction = Olive.tooltip.initialize;

            // for tooltips: dependencies met if there is a tooltip div with the correct id
            // or if the tooltip trigger has a title attribute (to create a mini tooltip)
            init.checkDependencies = function(scope, element, attr) {
                var
                    tooltipName = $(element).attr('olive-tooltip');

                if (tooltipName) {
                    return Boolean($("#" + tooltipName + ".tooltip").length);
                } else {
                    return Boolean(!($(element).attr('title') == undefined));
                }
            };

            $timeout(function() {
                init.tryInitialize(scope, element, attr);
            });
        }
    };
});
angular.module('ds.olive').directive('oliveTree', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            $timeout(function () {
                Olive.tree.init(element);
            });
        }
    }
});

angular.module('ds.olive').factory('dsUtilities', function(){
  var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return {
    // traverses up @param <scope> tree.
    // returns first scope found with @param <lookup> or null if not found.
    searchParentScopes: function(scope, lookup) {
      while (scope){
        if (scope[lookup]){
          return scope;
        }
        else {
          scope = scope.$parent;
        }
      }
      return null;
    },
    isValidEmail: function(email) {
      return emailRegex.test(email);
    }
  };
});

(function() { if (window.define) { var define = window.define; } if (window.require) { var require = window.require; } if (window.jQuery && jQuery.fn && jQuery.fn.select2 && jQuery.fn.select2.amd) { var define = jQuery.fn.select2.amd.define; var require = jQuery.fn.select2.amd.require; }/**
 * @license almond 0.2.9 Copyright (c) 2011-2014, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*jslint sloppy: true */
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice,
        jsSuffixRegExp = /\.js$/;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap, lastIndex,
            foundI, foundStarMap, starI, i, j, part,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name && name.charAt(0) === ".") {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that "directory" and not name of the baseName's
                //module. For instance, baseName of "one/two/three", maps to
                //"one/two/three.js", but we want the directory, "one/two" for
                //this normalization.
                baseParts = baseParts.slice(0, baseParts.length - 1);
                name = name.split('/');
                lastIndex = name.length - 1;

                // Node .js allowance:
                if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                    name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
                }

                name = baseParts.concat(name);

                //start trimDots
                for (i = 0; i < name.length; i += 1) {
                    part = name[i];
                    if (part === ".") {
                        name.splice(i, 1);
                        i -= 1;
                    } else if (part === "..") {
                        if (i === 1 && (name[2] === '..' || name[0] === '..')) {
                            //End of the line. Keep at least one non-dot
                            //path segment at the front so it can be mapped
                            //correctly to disk. Otherwise, there is likely
                            //no path mapping for a path starting with '..'.
                            //This can still fail, but catches the most reasonable
                            //uses of ..
                            break;
                        } else if (i > 0) {
                            name.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
                //end trimDots

                name = name.join("/");
            } else if (name.indexOf('./') === 0) {
                // No baseName, so this is ID is resolved relative
                // to baseUrl, pull off the leading dot.
                name = name.substring(2);
            }
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            return req.apply(undef, aps.call(arguments, 0).concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relName) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i,
            args = [],
            callbackType = typeof callback,
            usingExports;

        //Use name if no relName
        relName = relName || name;

        //Call the callback to define the module, if necessary.
        if (callbackType === 'undefined' || callbackType === 'function') {
            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback ? callback.apply(defined[name], args) : undefined;

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (config.deps) {
                req(config.deps, config.callback);
            }
            if (!callback) {
                return;
            }

            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        return req(cfg);
    };

    /**
     * Expose module registry for debugging and tooling
     */
    requirejs._defined = defined;

    define = function (name, deps, callback) {

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());

define("almond", function(){});

define('jquery',[],function () {
  var _$ = jQuery || $;

  if (_$ == null && console && console.error) {
    console.error(
      'Select2: An instance of jQuery or a jQuery-compatible library was not ' +
      'found. Make sure that you are including jQuery before Select2 on your ' +
      'web page.'
    );
  }

  return _$;
});

define('select2/utils',[], function () {
  var Utils = {};

  Utils.Extend = function (ChildClass, SuperClass) {
    var __hasProp = {}.hasOwnProperty;

    function BaseConstructor () {
      this.constructor = ChildClass;
    }

    for (var key in SuperClass) {
      if (__hasProp.call(SuperClass, key)) {
        ChildClass[key] = SuperClass[key];
      }
    }

    BaseConstructor.prototype = SuperClass.prototype;
    ChildClass.prototype = new BaseConstructor();
    ChildClass.__super__ = SuperClass.prototype;

    return ChildClass;
  };

  function getMethods (theClass) {
    var proto = theClass.prototype;

    var methods = [];

    for (var methodName in proto) {
      var m = proto[methodName];

      if (typeof m !== 'function') {
        continue;
      }

      if (methodName === 'constructor') {
        continue;
      }

      methods.push(methodName);
    }

    return methods;
  }

  Utils.Decorate = function (SuperClass, DecoratorClass) {
    var decoratedMethods = getMethods(DecoratorClass);
    var superMethods = getMethods(SuperClass);

    function DecoratedClass () {
      var unshift = Array.prototype.unshift;

      var argCount = DecoratorClass.prototype.constructor.length;

      var calledConstructor = SuperClass.prototype.constructor;

      if (argCount > 0) {
        unshift.call(arguments, SuperClass.prototype.constructor);

        calledConstructor = DecoratorClass.prototype.constructor;
      }

      calledConstructor.apply(this, arguments);
    }

    DecoratorClass.displayName = SuperClass.displayName;

    function ctr () {
      this.constructor = DecoratedClass;
    }

    DecoratedClass.prototype = new ctr();

    for (var m = 0; m < superMethods.length; m++) {
        var superMethod = superMethods[m];

        DecoratedClass.prototype[superMethod] =
          SuperClass.prototype[superMethod];
    }

    var calledMethod = function (methodName) {
      // Stub out the original method if it's not decorating an actual method
      var originalMethod = function () {};

      if (methodName in DecoratedClass.prototype) {
        originalMethod = DecoratedClass.prototype[methodName];
      }

      var decoratedMethod = DecoratorClass.prototype[methodName];

      return function () {
        var unshift = Array.prototype.unshift;

        unshift.call(arguments, originalMethod);

        return decoratedMethod.apply(this, arguments);
      };
    };

    for (var d = 0; d < decoratedMethods.length; d++) {
      var decoratedMethod = decoratedMethods[d];

      DecoratedClass.prototype[decoratedMethod] = calledMethod(decoratedMethod);
    }

    return DecoratedClass;
  };

  var Observable = function () {
    this.listeners = {};
  };

  Observable.prototype.on = function (event, callback) {
    this.listeners = this.listeners || {};

    if (event in this.listeners) {
      this.listeners[event].push(callback);
    } else {
      this.listeners[event] = [callback];
    }
  };

  Observable.prototype.trigger = function (event) {
    var slice = Array.prototype.slice;

    this.listeners = this.listeners || {};

    if (event in this.listeners) {
      this.invoke(this.listeners[event], slice.call(arguments, 1));
    }

    if ('*' in this.listeners) {
      this.invoke(this.listeners['*'], arguments);
    }
  };

  Observable.prototype.invoke = function (listeners, params) {
    for (var i = 0, len = listeners.length; i < len; i++) {
      listeners[i].apply(this, params);
    }
  };

  Utils.Observable = Observable;

  Utils.generateChars = function (length) {
    var chars = '';

    for (var i = 0; i < length; i++) {
      var randomChar = Math.floor(Math.random() * 36);
      chars += randomChar.toString(36);
    }

    return chars;
  };

  Utils.bind = function (func, context) {
    return function () {
      func.apply(context, arguments);
    };
  };

  Utils._convertData = function (data) {
    for (var originalKey in data) {
      var keys = originalKey.split('-');

      var dataLevel = data;

      if (keys.length === 1) {
        continue;
      }

      for (var k = 0; k < keys.length; k++) {
        var key = keys[k];

        // Lowercase the first letter
        // By default, dash-separated becomes camelCase
        key = key.substring(0, 1).toLowerCase() + key.substring(1);

        if (!(key in dataLevel)) {
          dataLevel[key] = {};
        }

        if (k == keys.length - 1) {
          dataLevel[key] = data[originalKey];
        }

        dataLevel = dataLevel[key];
      }

      delete data[originalKey];
    }

    return data;
  };

  Utils.hasScroll = function (index, el) {
    // Adapted from the function created by @ShadowScripter
    // and adapted by @BillBarry on the Stack Exchange Code Review website.
    // The original code can be found at
    // http://codereview.stackexchange.com/q/13338
    // and was designed to be used with the Sizzle selector engine.

    var $el = $(el);
    var overflowX = el.style.overflowX;
    var overflowY = el.style.overflowY;

    //Check both x and y declarations
    if (overflowX === overflowY &&
        (overflowY === 'hidden' || overflowY === 'visible')) {
      return false;
    }

    if (overflowX === 'scroll' || overflowY === 'scroll') {
      return true;
    }

    return ($el.innerHeight() < el.scrollHeight ||
      $el.innerWidth() < el.scrollWidth);
  };

  return Utils;
});

define('select2/results',[
  'jquery',
  './utils'
], function ($, Utils) {
  function Results ($element, options, dataAdapter) {
    this.$element = $element;
    this.data = dataAdapter;
    this.options = options;

    Results.__super__.constructor.call(this);
  }

  Utils.Extend(Results, Utils.Observable);

  Results.prototype.render = function () {
    var $results = $(
      '<ul class="select2-results__options" role="tree"></ul>'
    );

    if (this.options.get('multiple')) {
      $results.attr('aria-multiselectable', 'true');
    }

    this.$results = $results;

    return $results;
  };

  Results.prototype.clear = function () {
    this.$results.empty();
  };

  Results.prototype.displayMessage = function (params) {
    this.clear();
    this.hideLoading();

    var $message = $(
      '<li role="treeitem" class="select2-results__option"></li>'
    );

    var message = this.options.get('translations').get(params.message);

    $message.text(message(params.args));

    this.$results.append($message);
  };

  Results.prototype.append = function (data) {
    this.hideLoading();

    var $options = [];

    if (data.results == null || data.results.length === 0) {
      if (this.$results.children().length === 0) {
        this.trigger('results:message', {
          message: 'noResults'
        });
      }

      return;
    }

    data.results = this.sort(data.results);

    for (var d = 0; d < data.results.length; d++) {
      var item = data.results[d];

      var $option = this.option(item);

      $options.push($option);
    }

    this.$results.append($options);
  };

  Results.prototype.position = function ($results, $dropdown) {
    var $resultsContainer = $dropdown.find('.select2-results');
    $resultsContainer.append($results);
  };

  Results.prototype.sort = function (data) {
    var sorter = this.options.get('sorter');

    return sorter(data);
  };

  Results.prototype.setClasses = function () {
    var self = this;

    this.data.current(function (selected) {
      var selectedIds = $.map(selected, function (s) {
        return s.id.toString();
      });

      var $options = self.$results
        .find('.select2-results__option[aria-selected]');

      $options.each(function () {
        var $option = $(this);

        var item = $.data(this, 'data');

        if (item.id != null && selectedIds.indexOf(item.id.toString()) > -1) {
          $option.attr('aria-selected', 'true');
        } else {
          $option.attr('aria-selected', 'false');
        }
      });

      var $selected = $options.filter('[aria-selected=true]');

      // Check if there are any selected options
      if ($selected.length > 0) {
        // If there are selected options, highlight the first
        $selected.first().trigger('mouseenter');
      } else {
        // If there are no selected options, highlight the first option
        // in the dropdown
        $options.first().trigger('mouseenter');
      }
    });
  };

  Results.prototype.showLoading = function (params) {
    this.hideLoading();

    var loadingMore = this.options.get('translations').get('searching');

    var loading = {
      disabled: true,
      loading: true,
      text: loadingMore(params)
    };
    var $loading = this.option(loading);
    $loading.className += ' loading-results';

    this.$results.prepend($loading);
  };

  Results.prototype.hideLoading = function () {
    this.$results.find('.loading-results').remove();
  };

  Results.prototype.option = function (data) {
    var option = document.createElement('li');
    option.className = 'select2-results__option';

    var attrs = {
      'role': 'treeitem',
      'aria-selected': 'false'
    };

    if (data.disabled) {
      delete attrs['aria-selected'];
      attrs['aria-disabled'] = 'true';
    }

    if (data.id == null) {
      delete attrs['aria-selected'];
    }

    if (data._resultId != null) {
      option.id = data._resultId;
    }

    if (data.children) {
      attrs.role = 'group';
      attrs['aria-label'] = data.text;
      delete attrs['aria-selected'];
    }

    for (var attr in attrs) {
      var val = attrs[attr];

      option.setAttribute(attr, val);
    }

    if (data.children) {
      var $option = $(option);

      var label = document.createElement('strong');
      label.className = 'select2-results__group';

      var $label = $(label);
      this.template(data, label);

      var $children = [];

      for (var c = 0; c < data.children.length; c++) {
        var child = data.children[c];

        var $child = this.option(child);

        $children.push($child);
      }

      var $childrenContainer = $('<ul></ul>', {
        'class': 'select2-results__options select2-results__options--nested'
      });

      $childrenContainer.append($children);

      $option.append(label);
      $option.append($childrenContainer);
    } else {
      this.template(data, option);
    }

    $.data(option, 'data', data);

    return option;
  };

  Results.prototype.bind = function (container, $container) {
    var self = this;

    var id = container.id + '-results';

    this.$results.attr('id', id);

    container.on('results:all', function (params) {
      self.clear();
      self.append(params.data);

      if (container.isOpen()) {
        self.setClasses();
      }
    });

    container.on('results:append', function (params) {
      self.append(params.data);

      if (container.isOpen()) {
        self.setClasses();
      }
    });

    container.on('query', function (params) {
      self.showLoading(params);
    });

    container.on('select', function () {
      if (!container.isOpen()) {
        return;
      }

      self.setClasses();
    });

    container.on('unselect', function () {
      if (!container.isOpen()) {
        return;
      }

      self.setClasses();
    });

    container.on('open', function () {
      // When the dropdown is open, aria-expended="true"
      self.$results.attr('aria-expanded', 'true');
      self.$results.attr('aria-hidden', 'false');

      self.setClasses();
      self.ensureHighlightVisible();
    });

    container.on('close', function () {
      // When the dropdown is closed, aria-expended="false"
      self.$results.attr('aria-expanded', 'false');
      self.$results.attr('aria-hidden', 'true');
      self.$results.removeAttr('aria-activedescendant');
    });

    container.on('results:select', function () {
      var $highlighted = self.getHighlightedResults();

      if ($highlighted.length === 0) {
        return;
      }

      var data = $highlighted.data('data');

      if ($highlighted.attr('aria-selected') == 'true') {
        if (self.options.get('multiple')) {
          self.trigger('unselect', {
            data: data
          });
        } else {
          self.trigger('close');
        }
      } else {
        self.trigger('select', {
          data: data
        });
      }
    });

    container.on('results:previous', function () {
      var $highlighted = self.getHighlightedResults();

      var $options = self.$results.find('[aria-selected]');

      var currentIndex = $options.index($highlighted);

      // If we are already at te top, don't move further
      if (currentIndex === 0) {
        return;
      }

      var nextIndex = currentIndex - 1;

      // If none are highlighted, highlight the first
      if ($highlighted.length === 0) {
        nextIndex = 0;
      }

      var $next = $options.eq(nextIndex);

      $next.trigger('mouseenter');

      var currentOffset = self.$results.offset().top;
      var nextTop = $next.offset().top;
      var nextOffset = self.$results.scrollTop() + (nextTop - currentOffset);

      if (nextIndex === 0) {
        self.$results.scrollTop(0);
      } else if (nextTop - currentOffset < 0) {
        self.$results.scrollTop(nextOffset);
      }
    });

    container.on('results:next', function () {
      var $highlighted = self.getHighlightedResults();

      var $options = self.$results.find('[aria-selected]');

      var currentIndex = $options.index($highlighted);

      var nextIndex = currentIndex + 1;

      // If we are at the last option, stay there
      if (nextIndex >= $options.length) {
        return;
      }

      var $next = $options.eq(nextIndex);

      $next.trigger('mouseenter');

      var currentOffset = self.$results.offset().top +
        self.$results.outerHeight(false);
      var nextBottom = $next.offset().top + $next.outerHeight(false);
      var nextOffset = self.$results.scrollTop() + nextBottom - currentOffset;

      if (nextIndex === 0) {
        self.$results.scrollTop(0);
      } else if (nextBottom > currentOffset) {
        self.$results.scrollTop(nextOffset);
      }
    });

    container.on('results:focus', function (params) {
      params.element.addClass('select2-results__option--highlighted');
    });

    container.on('results:message', function (params) {
      self.displayMessage(params);
    });

    if ($.fn.mousewheel) {
      this.$results.on('mousewheel', function (e) {
        var top = self.$results.scrollTop();

        var bottom = (
          self.$results.get(0).scrollHeight -
          self.$results.scrollTop() +
          e.deltaY
        );

        var isAtTop = e.deltaY > 0 && top - e.deltaY <= 0;
        var isAtBottom = e.deltaY < 0 && bottom <= self.$results.height();

        if (isAtTop) {
          self.$results.scrollTop(0);

          e.preventDefault();
          e.stopPropagation();
        } else if (isAtBottom) {
          self.$results.scrollTop(
            self.$results.get(0).scrollHeight - self.$results.height()
          );

          e.preventDefault();
          e.stopPropagation();
        }
      });
    }

    this.$results.on('mouseup', '.select2-results__option[aria-selected]',
      function (evt) {
      var $this = $(this);

      var data = $this.data('data');

      if ($this.attr('aria-selected') === 'true') {
        if (self.options.get('multiple')) {
          self.trigger('unselect', {
            originalEvent: evt,
            data: data
          });
        } else {
          self.trigger('close');
        }

        return;
      }

      self.trigger('select', {
        originalEvent: evt,
        data: data
      });
    });

    this.$results.on('mouseenter', '.select2-results__option[aria-selected]',
      function (evt) {
      var data = $(this).data('data');

      self.getHighlightedResults()
          .removeClass('select2-results__option--highlighted');

      self.trigger('results:focus', {
        data: data,
        element: $(this)
      });
    });
  };

  Results.prototype.getHighlightedResults = function () {
    var $highlighted = this.$results
    .find('.select2-results__option--highlighted');

    return $highlighted;
  };

  Results.prototype.destroy = function () {
    this.$results.remove();
  };

  Results.prototype.ensureHighlightVisible = function () {
    var $highlighted = this.getHighlightedResults();

    if ($highlighted.length === 0) {
      return;
    }

    var $options = this.$results.find('[aria-selected]');

    var currentIndex = $options.index($highlighted);

    var currentOffset = this.$results.offset().top;
    var nextTop = $highlighted.offset().top;
    var nextOffset = this.$results.scrollTop() + (nextTop - currentOffset);

    var offsetDelta = nextTop - currentOffset;
    nextOffset -= $highlighted.outerHeight(false) * 2;

    if (currentIndex <= 2) {
      this.$results.scrollTop(0);
    } else if (offsetDelta > this.$results.outerHeight() || offsetDelta < 0) {
      this.$results.scrollTop(nextOffset);
    }
  };

  Results.prototype.template = function (result, container) {
    var template = this.options.get('templateResult');

    var content = template(result);

    if (content == null) {
      container.style.display = 'none';
    } else {
      container.innerHTML = content;
    }
  };

  return Results;
});

define('select2/keys',[

], function () {
  var KEYS = {
    BACKSPACE: 8,
    TAB: 9,
    ENTER: 13,
    SHIFT: 16,
    CTRL: 17,
    ALT: 18,
    ESC: 27,
    SPACE: 32,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    END: 35,
    HOME: 36,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    DELETE: 46,

    isArrow: function (k) {
        k = k.which ? k.which : k;

        switch (k) {
        case KEY.LEFT:
        case KEY.RIGHT:
        case KEY.UP:
        case KEY.DOWN:
            return true;
        }

        return false;
    }
  };

  return KEYS;
});

define('select2/selection/base',[
  'jquery',
  '../utils',
  '../keys'
], function ($, Utils, KEYS) {
  function BaseSelection ($element, options) {
    this.$element = $element;
    this.options = options;

    BaseSelection.__super__.constructor.call(this);
  }

  Utils.Extend(BaseSelection, Utils.Observable);

  BaseSelection.prototype.render = function () {
    var $selection = $(
      '<span class="select2-selection" tabindex="0" role="combobox" ' +
      'aria-autocomplete="list" aria-haspopup="true" aria-expanded="false">' +
      '</span>'
    );

    $selection.attr('title', this.$element.attr('title'));

    this.$selection = $selection;

    return $selection;
  };

  BaseSelection.prototype.bind = function (container, $container) {
    var self = this;

    var id = container.id + '-container';
    var resultsId = container.id + '-results';

    this.container = container;

    this.$selection.attr('aria-owns', resultsId);

    this.$selection.on('keydown', function (evt) {
      self.trigger('keypress', evt);

      if (evt.which === KEYS.SPACE) {
        evt.preventDefault();
      }
    });

    container.on('results:focus', function (params) {
      self.$selection.attr('aria-activedescendant', params.data._resultId);
    });

    container.on('selection:update', function (params) {
      self.update(params.data);
    });

    container.on('open', function () {
      // When the dropdown is open, aria-expanded="true"
      self.$selection.attr('aria-expanded', 'true');

      self._attachCloseHandler(container);
    });

    container.on('close', function () {
      // When the dropdown is closed, aria-expanded="false"
      self.$selection.attr('aria-expanded', 'false');
      self.$selection.removeAttr('aria-activedescendant');

      self.$selection.focus();

      self._detachCloseHandler(container);
    });

    container.on('enable', function () {
      self.$selection.attr('tabindex', '0');
    });

    container.on('disable', function () {
      self.$selection.attr('tabindex', '-1');
    });
  };

  BaseSelection.prototype._attachCloseHandler = function (container) {
    var self = this;

    $(document.body).on('mousedown.select2.' + container.id, function (e) {
      var $target = $(e.target);

      var $select = $target.closest('.select2');

      var $all = $('.select2.select2-container--open');

      $all.each(function () {
        var $this = $(this);

        if (this == $select[0]) {
          return;
        }

        var $element = $this.data('element');

        $element.select2('close');
      });
    });
  };

  BaseSelection.prototype._detachCloseHandler = function (container) {
    $(document.body).off('mousedown.select2.' + container.id);
  };

  BaseSelection.prototype.position = function ($selection, $container) {
    var $selectionContainer = $container.find('.selection');
    $selectionContainer.append($selection);
  };

  BaseSelection.prototype.destroy = function () {
    this._detachCloseHandler(this.container);
  };

  BaseSelection.prototype.update = function (data) {
    throw new Error('The `update` method must be defined in child classes.');
  };

  return BaseSelection;
});

define('select2/selection/single',[
  'jquery',
  './base',
  '../utils',
  '../keys'
], function ($, BaseSelection, Utils, KEYS) {
  function SingleSelection () {
    SingleSelection.__super__.constructor.apply(this, arguments);
  }

  Utils.Extend(SingleSelection, BaseSelection);

  SingleSelection.prototype.render = function () {
    var $selection = SingleSelection.__super__.render.call(this);

    $selection.addClass('select2-selection--single');

    $selection.html(
      '<span class="select2-selection__rendered"></span>' +
      '<span class="select2-selection__arrow" role="presentation">' +
        '<b role="presentation"></b>' +
      '</span>'
    );

    return $selection;
  };

  SingleSelection.prototype.bind = function (container, $container) {
    var self = this;

    SingleSelection.__super__.bind.apply(this, arguments);

    var id = container.id + '-container';

    this.$selection.find('.select2-selection__rendered').attr('id', id);
    this.$selection.attr('aria-labelledby', id);

    this.$selection.on('mousedown', function (evt) {
      // Only respond to left clicks
      if (evt.which !== 1) {
        return;
      }

      self.trigger('toggle', {
        originalEvent: evt
      });
    });

    this.$selection.on('focus', function (evt) {
      // User focuses on the container
    });

    this.$selection.on('blur', function (evt) {
      // User exits the container
    });

    container.on('selection:update', function (params) {
      self.update(params.data);
    });
  };

  SingleSelection.prototype.clear = function () {
    this.$selection.find('.select2-selection__rendered').empty();
  };

  SingleSelection.prototype.display = function (data) {
    var template = this.options.get('templateSelection');

    return template(data);
  };

  SingleSelection.prototype.selectionContainer = function () {
    return $('<span></span>');
  };

  SingleSelection.prototype.update = function (data) {
    if (data.length === 0) {
      this.clear();
      return;
    }

    var selection = data[0];

    var formatted = this.display(selection);

    this.$selection.find('.select2-selection__rendered').html(formatted);
  };

  return SingleSelection;
});

define('select2/selection/multiple',[
  'jquery',
  './base',
  '../utils'
], function ($, BaseSelection, Utils) {
  function MultipleSelection ($element, options) {
    MultipleSelection.__super__.constructor.apply(this, arguments);
  }

  Utils.Extend(MultipleSelection, BaseSelection);

  MultipleSelection.prototype.render = function () {
    var $selection = MultipleSelection.__super__.render.call(this);

    $selection.addClass('select2-selection--multiple');

    $selection.html(
      '<ul class="select2-selection__rendered"></ul>'
    );

    return $selection;
  };

  MultipleSelection.prototype.bind = function (container, $container) {
    var self = this;

    MultipleSelection.__super__.bind.apply(this, arguments);

    this.$selection.on('click', function (evt) {
      self.trigger('toggle', {
        originalEvent: evt
      });
    });

    this.$selection.on('click', '.select2-selection__choice__remove',
      function (evt) {
      var $remove = $(this);
      var $selection = $remove.parent();

      var data = $selection.data('data');

      self.trigger('unselect', {
        originalEvent: evt,
        data: data
      });
    });
  };

  MultipleSelection.prototype.clear = function () {
    this.$selection.find('.select2-selection__rendered').empty();
  };

  MultipleSelection.prototype.display = function (data) {
    var template = this.options.get('templateSelection');

    return template(data);
  };

  MultipleSelection.prototype.selectionContainer = function () {
    var $container = $(
      '<li class="select2-selection__choice">' +
        '<span class="select2-selection__choice__remove" role="presentation">' +
          '&times;' +
        '</span>' +
      '</li>'
    );

    return $container;
  };

  MultipleSelection.prototype.update = function (data) {
    this.clear();

    if (data.length === 0) {
      return;
    }

    var $selections = [];

    for (var d = 0; d < data.length; d++) {
      var selection = data[d];

      var formatted = this.display(selection);
      var $selection = this.selectionContainer();

      $selection.append(formatted);
      $selection.data('data', selection);

      $selections.push($selection);
    }

    this.$selection.find('.select2-selection__rendered').append($selections);
  };

  return MultipleSelection;
});

define('select2/selection/placeholder',[
  '../utils'
], function (Utils) {
  function Placeholder (decorated, $element, options) {
    this.placeholder = this.normalizePlaceholder(options.get('placeholder'));

    decorated.call(this, $element, options);
  }

  Placeholder.prototype.normalizePlaceholder = function (_, placeholder) {
    if (typeof placeholder === 'string') {
      placeholder = {
        id: '',
        text: placeholder
      };
    }

    return placeholder;
  };

  Placeholder.prototype.createPlaceholder = function (decorated, placeholder) {
    var $placeholder = this.selectionContainer();

    $placeholder.html(this.display(placeholder));
    $placeholder.addClass('select2-selection__placeholder')
                .removeClass('select2-selection__choice');

    return $placeholder;
  };

  Placeholder.prototype.update = function (decorated, data) {
    var singlePlaceholder = (
      data.length == 1 && data[0].id != this.placeholder.id
    );
    var multipleSelections = data.length > 1;

    if (multipleSelections || singlePlaceholder) {
      return decorated.call(this, data);
    }

    this.clear();

    var $placeholder = this.createPlaceholder(this.placeholder);

    this.$selection.find('.select2-selection__rendered').append($placeholder);
  };

  return Placeholder;
});

define('select2/selection/allowClear',[
  'jquery'
], function ($) {
  function AllowClear () { }

  AllowClear.prototype.bind = function (decorated, container, $container) {
    var self = this;

    decorated.call(this, container, $container);

    this.$selection.on('mousedown', '.select2-selection__clear',
      function (evt) {
        // Ignore the event if it is disabled
        if (self.options.get('disabled')) {
          return;
        }

        evt.stopPropagation();

        var data = $(this).data('data');

        for (var d = 0; d < data.length; d++) {
          var unselectData = {
            data: data[d]
          };

          // Trigger the `unselect` event, so people can prevent it from being
          // cleared.
          self.trigger('unselect', unselectData);

          // If the event was prevented, don't clear it out.
          if (unselectData.prevented) {
            return;
          }
        }

        self.$element.val(self.placeholder.id).trigger('change');

        self.trigger('toggle');
    });
  };

  AllowClear.prototype.update = function (decorated, data) {
    decorated.call(this, data);

    if (this.$selection.find('.select2-selection__placeholder').length > 0 ||
        data.length === 0) {
      return;
    }

    var $remove = $(
      '<span class="select2-selection__clear">' +
        '&times;' +
      '</span>'
    );
    $remove.data('data', data);

    this.$selection.find('.select2-selection__rendered').append($remove);
  };

  return AllowClear;
});

define('select2/selection/search',[
  'jquery',
  '../utils',
  '../keys'
], function ($, Utils, KEYS) {
  function Search (decorated, $element, options) {
    decorated.call(this, $element, options);
  }

  Search.prototype.render = function (decorated) {
    var $search = $(
      '<li class="select2-search select2-search--inline">' +
        '<input class="select2-search__field" type="search" tabindex="-1"' +
          ' role="textbox" />' +
      '</li>'
    );

    this.$searchContainer = $search;
    this.$search = $search.find('input');

    var $rendered = decorated.call(this);

    return $rendered;
  };

  Search.prototype.bind = function (decorated, container, $container) {
    var self = this;

    decorated.call(this, container, $container);

    container.on('open', function () {
      self.$search.attr('tabindex', 0);

      self.$search.focus();
    });

    container.on('close', function () {
      self.$search.attr('tabindex', -1);

      self.$search.val('');
    });

    container.on('enable', function () {
      self.$search.prop('disabled', false);
    });

    container.on('disable', function () {
      self.$search.prop('disabled', true);
    });

    this.$selection.on('keydown', '.select2-search--inline', function (evt) {
      evt.stopPropagation();

      self.trigger('keypress', evt);

      self._keyUpPrevented = evt.isDefaultPrevented();

      var key = evt.which;

      if (key === KEYS.BACKSPACE && self.$search.val() === '') {
        var $previousChoice = self.$searchContainer
          .prev('.select2-selection__choice');

        if ($previousChoice.length > 0) {
          var item = $previousChoice.data('data');

          self.searchRemoveChoice(item);
        }
      }
    });

    this.$selection.on('keyup', '.select2-search--inline', function (evt) {
      self.handleSearch(evt);
    });
  };

  Search.prototype.createPlaceholder = function (decorated, placeholder) {
    this.$search.attr('placeholder', placeholder.text);
  };

  Search.prototype.update = function (decorated, data) {
    this.$search.attr('placeholder', '');

    decorated.call(this, data);

    this.$selection.find('.select2-selection__rendered')
                   .append(this.$searchContainer);

    this.resizeSearch();
  };

  Search.prototype.handleSearch = function () {
    this.resizeSearch();

    if (!this._keyUpPrevented) {
      var input = this.$search.val();

      this.trigger('query', {
        term: input
      });
    }

    this._keyUpPrevented = false;
  };

  Search.prototype.searchRemoveChoice = function (decorated, item) {
    this.trigger('unselect', {
      data: item
    });

    this.trigger('open');

    this.$search.val(item.text + ' ');
  };

  Search.prototype.resizeSearch = function () {
    this.$search.css('width', '25px');

    var width = '';

    if (this.$search.attr('placeholder') !== '') {
      width = this.$selection.find('.select2-selection__rendered').innerWidth();
    } else {
      var minimumWidth = this.$search.val().length + 1;

      width = (minimumWidth * 0.75) + 'em';
    }

    this.$search.css('width', width);
  };

  return Search;
});

define('select2/selection/eventRelay',[
  'jquery'
], function ($) {
  function EventRelay () { }

  EventRelay.prototype.bind = function (decorated, container, $container) {
    var self = this;
    var relayEvents = [
      'open', 'opening',
      'close', 'closing',
      'select', 'selecting',
      'unselect', 'unselecting'
    ];

    var preventableEvents = ['opening', 'closing', 'selecting', 'unselecting'];

    decorated.call(this, container, $container);

    container.on('*', function (name, params) {
      // Ignore events that should not be relayed
      if (relayEvents.indexOf(name) === -1) {
        return;
      }

      // The parameters should always be an object
      params = params || {};

      // Generate the jQuery event for the Select2 event
      var evt = $.Event('select2:' + name, {
        params: params
      });

      self.$element.trigger(evt);

      // Only handle preventable events if it was one
      if (preventableEvents.indexOf(name) === -1) {
        return;
      }

      params.prevented = evt.isDefaultPrevented();
    });
  };

  return EventRelay;
});

define('select2/translation',[
  'jquery'
], function ($) {
  function Translation (dict) {
    this.dict = dict || {};
  }

  Translation.prototype.all = function () {
    return this.dict;
  };

  Translation.prototype.get = function (key) {
    return this.dict[key];
  };

  Translation.prototype.extend = function (translation) {
    this.dict = $.extend({}, translation.all(), this.dict);
  };

  // Static functions

  Translation._cache = {};

  Translation.loadPath = function (path) {
    if (!(path in Translation._cache)) {
      var translations = require(path);

      Translation._cache[path] = translations;
    }

    return new Translation(Translation._cache[path]);
  };

  return Translation;
});

define('select2/diacritics',[

], function () {
  var diacritics = {
    '\u24B6': 'A',
    '\uFF21': 'A',
    '\u00C0': 'A',
    '\u00C1': 'A',
    '\u00C2': 'A',
    '\u1EA6': 'A',
    '\u1EA4': 'A',
    '\u1EAA': 'A',
    '\u1EA8': 'A',
    '\u00C3': 'A',
    '\u0100': 'A',
    '\u0102': 'A',
    '\u1EB0': 'A',
    '\u1EAE': 'A',
    '\u1EB4': 'A',
    '\u1EB2': 'A',
    '\u0226': 'A',
    '\u01E0': 'A',
    '\u00C4': 'A',
    '\u01DE': 'A',
    '\u1EA2': 'A',
    '\u00C5': 'A',
    '\u01FA': 'A',
    '\u01CD': 'A',
    '\u0200': 'A',
    '\u0202': 'A',
    '\u1EA0': 'A',
    '\u1EAC': 'A',
    '\u1EB6': 'A',
    '\u1E00': 'A',
    '\u0104': 'A',
    '\u023A': 'A',
    '\u2C6F': 'A',
    '\uA732': 'AA',
    '\u00C6': 'AE',
    '\u01FC': 'AE',
    '\u01E2': 'AE',
    '\uA734': 'AO',
    '\uA736': 'AU',
    '\uA738': 'AV',
    '\uA73A': 'AV',
    '\uA73C': 'AY',
    '\u24B7': 'B',
    '\uFF22': 'B',
    '\u1E02': 'B',
    '\u1E04': 'B',
    '\u1E06': 'B',
    '\u0243': 'B',
    '\u0182': 'B',
    '\u0181': 'B',
    '\u24B8': 'C',
    '\uFF23': 'C',
    '\u0106': 'C',
    '\u0108': 'C',
    '\u010A': 'C',
    '\u010C': 'C',
    '\u00C7': 'C',
    '\u1E08': 'C',
    '\u0187': 'C',
    '\u023B': 'C',
    '\uA73E': 'C',
    '\u24B9': 'D',
    '\uFF24': 'D',
    '\u1E0A': 'D',
    '\u010E': 'D',
    '\u1E0C': 'D',
    '\u1E10': 'D',
    '\u1E12': 'D',
    '\u1E0E': 'D',
    '\u0110': 'D',
    '\u018B': 'D',
    '\u018A': 'D',
    '\u0189': 'D',
    '\uA779': 'D',
    '\u01F1': 'DZ',
    '\u01C4': 'DZ',
    '\u01F2': 'Dz',
    '\u01C5': 'Dz',
    '\u24BA': 'E',
    '\uFF25': 'E',
    '\u00C8': 'E',
    '\u00C9': 'E',
    '\u00CA': 'E',
    '\u1EC0': 'E',
    '\u1EBE': 'E',
    '\u1EC4': 'E',
    '\u1EC2': 'E',
    '\u1EBC': 'E',
    '\u0112': 'E',
    '\u1E14': 'E',
    '\u1E16': 'E',
    '\u0114': 'E',
    '\u0116': 'E',
    '\u00CB': 'E',
    '\u1EBA': 'E',
    '\u011A': 'E',
    '\u0204': 'E',
    '\u0206': 'E',
    '\u1EB8': 'E',
    '\u1EC6': 'E',
    '\u0228': 'E',
    '\u1E1C': 'E',
    '\u0118': 'E',
    '\u1E18': 'E',
    '\u1E1A': 'E',
    '\u0190': 'E',
    '\u018E': 'E',
    '\u24BB': 'F',
    '\uFF26': 'F',
    '\u1E1E': 'F',
    '\u0191': 'F',
    '\uA77B': 'F',
    '\u24BC': 'G',
    '\uFF27': 'G',
    '\u01F4': 'G',
    '\u011C': 'G',
    '\u1E20': 'G',
    '\u011E': 'G',
    '\u0120': 'G',
    '\u01E6': 'G',
    '\u0122': 'G',
    '\u01E4': 'G',
    '\u0193': 'G',
    '\uA7A0': 'G',
    '\uA77D': 'G',
    '\uA77E': 'G',
    '\u24BD': 'H',
    '\uFF28': 'H',
    '\u0124': 'H',
    '\u1E22': 'H',
    '\u1E26': 'H',
    '\u021E': 'H',
    '\u1E24': 'H',
    '\u1E28': 'H',
    '\u1E2A': 'H',
    '\u0126': 'H',
    '\u2C67': 'H',
    '\u2C75': 'H',
    '\uA78D': 'H',
    '\u24BE': 'I',
    '\uFF29': 'I',
    '\u00CC': 'I',
    '\u00CD': 'I',
    '\u00CE': 'I',
    '\u0128': 'I',
    '\u012A': 'I',
    '\u012C': 'I',
    '\u0130': 'I',
    '\u00CF': 'I',
    '\u1E2E': 'I',
    '\u1EC8': 'I',
    '\u01CF': 'I',
    '\u0208': 'I',
    '\u020A': 'I',
    '\u1ECA': 'I',
    '\u012E': 'I',
    '\u1E2C': 'I',
    '\u0197': 'I',
    '\u24BF': 'J',
    '\uFF2A': 'J',
    '\u0134': 'J',
    '\u0248': 'J',
    '\u24C0': 'K',
    '\uFF2B': 'K',
    '\u1E30': 'K',
    '\u01E8': 'K',
    '\u1E32': 'K',
    '\u0136': 'K',
    '\u1E34': 'K',
    '\u0198': 'K',
    '\u2C69': 'K',
    '\uA740': 'K',
    '\uA742': 'K',
    '\uA744': 'K',
    '\uA7A2': 'K',
    '\u24C1': 'L',
    '\uFF2C': 'L',
    '\u013F': 'L',
    '\u0139': 'L',
    '\u013D': 'L',
    '\u1E36': 'L',
    '\u1E38': 'L',
    '\u013B': 'L',
    '\u1E3C': 'L',
    '\u1E3A': 'L',
    '\u0141': 'L',
    '\u023D': 'L',
    '\u2C62': 'L',
    '\u2C60': 'L',
    '\uA748': 'L',
    '\uA746': 'L',
    '\uA780': 'L',
    '\u01C7': 'LJ',
    '\u01C8': 'Lj',
    '\u24C2': 'M',
    '\uFF2D': 'M',
    '\u1E3E': 'M',
    '\u1E40': 'M',
    '\u1E42': 'M',
    '\u2C6E': 'M',
    '\u019C': 'M',
    '\u24C3': 'N',
    '\uFF2E': 'N',
    '\u01F8': 'N',
    '\u0143': 'N',
    '\u00D1': 'N',
    '\u1E44': 'N',
    '\u0147': 'N',
    '\u1E46': 'N',
    '\u0145': 'N',
    '\u1E4A': 'N',
    '\u1E48': 'N',
    '\u0220': 'N',
    '\u019D': 'N',
    '\uA790': 'N',
    '\uA7A4': 'N',
    '\u01CA': 'NJ',
    '\u01CB': 'Nj',
    '\u24C4': 'O',
    '\uFF2F': 'O',
    '\u00D2': 'O',
    '\u00D3': 'O',
    '\u00D4': 'O',
    '\u1ED2': 'O',
    '\u1ED0': 'O',
    '\u1ED6': 'O',
    '\u1ED4': 'O',
    '\u00D5': 'O',
    '\u1E4C': 'O',
    '\u022C': 'O',
    '\u1E4E': 'O',
    '\u014C': 'O',
    '\u1E50': 'O',
    '\u1E52': 'O',
    '\u014E': 'O',
    '\u022E': 'O',
    '\u0230': 'O',
    '\u00D6': 'O',
    '\u022A': 'O',
    '\u1ECE': 'O',
    '\u0150': 'O',
    '\u01D1': 'O',
    '\u020C': 'O',
    '\u020E': 'O',
    '\u01A0': 'O',
    '\u1EDC': 'O',
    '\u1EDA': 'O',
    '\u1EE0': 'O',
    '\u1EDE': 'O',
    '\u1EE2': 'O',
    '\u1ECC': 'O',
    '\u1ED8': 'O',
    '\u01EA': 'O',
    '\u01EC': 'O',
    '\u00D8': 'O',
    '\u01FE': 'O',
    '\u0186': 'O',
    '\u019F': 'O',
    '\uA74A': 'O',
    '\uA74C': 'O',
    '\u01A2': 'OI',
    '\uA74E': 'OO',
    '\u0222': 'OU',
    '\u24C5': 'P',
    '\uFF30': 'P',
    '\u1E54': 'P',
    '\u1E56': 'P',
    '\u01A4': 'P',
    '\u2C63': 'P',
    '\uA750': 'P',
    '\uA752': 'P',
    '\uA754': 'P',
    '\u24C6': 'Q',
    '\uFF31': 'Q',
    '\uA756': 'Q',
    '\uA758': 'Q',
    '\u024A': 'Q',
    '\u24C7': 'R',
    '\uFF32': 'R',
    '\u0154': 'R',
    '\u1E58': 'R',
    '\u0158': 'R',
    '\u0210': 'R',
    '\u0212': 'R',
    '\u1E5A': 'R',
    '\u1E5C': 'R',
    '\u0156': 'R',
    '\u1E5E': 'R',
    '\u024C': 'R',
    '\u2C64': 'R',
    '\uA75A': 'R',
    '\uA7A6': 'R',
    '\uA782': 'R',
    '\u24C8': 'S',
    '\uFF33': 'S',
    '\u1E9E': 'S',
    '\u015A': 'S',
    '\u1E64': 'S',
    '\u015C': 'S',
    '\u1E60': 'S',
    '\u0160': 'S',
    '\u1E66': 'S',
    '\u1E62': 'S',
    '\u1E68': 'S',
    '\u0218': 'S',
    '\u015E': 'S',
    '\u2C7E': 'S',
    '\uA7A8': 'S',
    '\uA784': 'S',
    '\u24C9': 'T',
    '\uFF34': 'T',
    '\u1E6A': 'T',
    '\u0164': 'T',
    '\u1E6C': 'T',
    '\u021A': 'T',
    '\u0162': 'T',
    '\u1E70': 'T',
    '\u1E6E': 'T',
    '\u0166': 'T',
    '\u01AC': 'T',
    '\u01AE': 'T',
    '\u023E': 'T',
    '\uA786': 'T',
    '\uA728': 'TZ',
    '\u24CA': 'U',
    '\uFF35': 'U',
    '\u00D9': 'U',
    '\u00DA': 'U',
    '\u00DB': 'U',
    '\u0168': 'U',
    '\u1E78': 'U',
    '\u016A': 'U',
    '\u1E7A': 'U',
    '\u016C': 'U',
    '\u00DC': 'U',
    '\u01DB': 'U',
    '\u01D7': 'U',
    '\u01D5': 'U',
    '\u01D9': 'U',
    '\u1EE6': 'U',
    '\u016E': 'U',
    '\u0170': 'U',
    '\u01D3': 'U',
    '\u0214': 'U',
    '\u0216': 'U',
    '\u01AF': 'U',
    '\u1EEA': 'U',
    '\u1EE8': 'U',
    '\u1EEE': 'U',
    '\u1EEC': 'U',
    '\u1EF0': 'U',
    '\u1EE4': 'U',
    '\u1E72': 'U',
    '\u0172': 'U',
    '\u1E76': 'U',
    '\u1E74': 'U',
    '\u0244': 'U',
    '\u24CB': 'V',
    '\uFF36': 'V',
    '\u1E7C': 'V',
    '\u1E7E': 'V',
    '\u01B2': 'V',
    '\uA75E': 'V',
    '\u0245': 'V',
    '\uA760': 'VY',
    '\u24CC': 'W',
    '\uFF37': 'W',
    '\u1E80': 'W',
    '\u1E82': 'W',
    '\u0174': 'W',
    '\u1E86': 'W',
    '\u1E84': 'W',
    '\u1E88': 'W',
    '\u2C72': 'W',
    '\u24CD': 'X',
    '\uFF38': 'X',
    '\u1E8A': 'X',
    '\u1E8C': 'X',
    '\u24CE': 'Y',
    '\uFF39': 'Y',
    '\u1EF2': 'Y',
    '\u00DD': 'Y',
    '\u0176': 'Y',
    '\u1EF8': 'Y',
    '\u0232': 'Y',
    '\u1E8E': 'Y',
    '\u0178': 'Y',
    '\u1EF6': 'Y',
    '\u1EF4': 'Y',
    '\u01B3': 'Y',
    '\u024E': 'Y',
    '\u1EFE': 'Y',
    '\u24CF': 'Z',
    '\uFF3A': 'Z',
    '\u0179': 'Z',
    '\u1E90': 'Z',
    '\u017B': 'Z',
    '\u017D': 'Z',
    '\u1E92': 'Z',
    '\u1E94': 'Z',
    '\u01B5': 'Z',
    '\u0224': 'Z',
    '\u2C7F': 'Z',
    '\u2C6B': 'Z',
    '\uA762': 'Z',
    '\u24D0': 'a',
    '\uFF41': 'a',
    '\u1E9A': 'a',
    '\u00E0': 'a',
    '\u00E1': 'a',
    '\u00E2': 'a',
    '\u1EA7': 'a',
    '\u1EA5': 'a',
    '\u1EAB': 'a',
    '\u1EA9': 'a',
    '\u00E3': 'a',
    '\u0101': 'a',
    '\u0103': 'a',
    '\u1EB1': 'a',
    '\u1EAF': 'a',
    '\u1EB5': 'a',
    '\u1EB3': 'a',
    '\u0227': 'a',
    '\u01E1': 'a',
    '\u00E4': 'a',
    '\u01DF': 'a',
    '\u1EA3': 'a',
    '\u00E5': 'a',
    '\u01FB': 'a',
    '\u01CE': 'a',
    '\u0201': 'a',
    '\u0203': 'a',
    '\u1EA1': 'a',
    '\u1EAD': 'a',
    '\u1EB7': 'a',
    '\u1E01': 'a',
    '\u0105': 'a',
    '\u2C65': 'a',
    '\u0250': 'a',
    '\uA733': 'aa',
    '\u00E6': 'ae',
    '\u01FD': 'ae',
    '\u01E3': 'ae',
    '\uA735': 'ao',
    '\uA737': 'au',
    '\uA739': 'av',
    '\uA73B': 'av',
    '\uA73D': 'ay',
    '\u24D1': 'b',
    '\uFF42': 'b',
    '\u1E03': 'b',
    '\u1E05': 'b',
    '\u1E07': 'b',
    '\u0180': 'b',
    '\u0183': 'b',
    '\u0253': 'b',
    '\u24D2': 'c',
    '\uFF43': 'c',
    '\u0107': 'c',
    '\u0109': 'c',
    '\u010B': 'c',
    '\u010D': 'c',
    '\u00E7': 'c',
    '\u1E09': 'c',
    '\u0188': 'c',
    '\u023C': 'c',
    '\uA73F': 'c',
    '\u2184': 'c',
    '\u24D3': 'd',
    '\uFF44': 'd',
    '\u1E0B': 'd',
    '\u010F': 'd',
    '\u1E0D': 'd',
    '\u1E11': 'd',
    '\u1E13': 'd',
    '\u1E0F': 'd',
    '\u0111': 'd',
    '\u018C': 'd',
    '\u0256': 'd',
    '\u0257': 'd',
    '\uA77A': 'd',
    '\u01F3': 'dz',
    '\u01C6': 'dz',
    '\u24D4': 'e',
    '\uFF45': 'e',
    '\u00E8': 'e',
    '\u00E9': 'e',
    '\u00EA': 'e',
    '\u1EC1': 'e',
    '\u1EBF': 'e',
    '\u1EC5': 'e',
    '\u1EC3': 'e',
    '\u1EBD': 'e',
    '\u0113': 'e',
    '\u1E15': 'e',
    '\u1E17': 'e',
    '\u0115': 'e',
    '\u0117': 'e',
    '\u00EB': 'e',
    '\u1EBB': 'e',
    '\u011B': 'e',
    '\u0205': 'e',
    '\u0207': 'e',
    '\u1EB9': 'e',
    '\u1EC7': 'e',
    '\u0229': 'e',
    '\u1E1D': 'e',
    '\u0119': 'e',
    '\u1E19': 'e',
    '\u1E1B': 'e',
    '\u0247': 'e',
    '\u025B': 'e',
    '\u01DD': 'e',
    '\u24D5': 'f',
    '\uFF46': 'f',
    '\u1E1F': 'f',
    '\u0192': 'f',
    '\uA77C': 'f',
    '\u24D6': 'g',
    '\uFF47': 'g',
    '\u01F5': 'g',
    '\u011D': 'g',
    '\u1E21': 'g',
    '\u011F': 'g',
    '\u0121': 'g',
    '\u01E7': 'g',
    '\u0123': 'g',
    '\u01E5': 'g',
    '\u0260': 'g',
    '\uA7A1': 'g',
    '\u1D79': 'g',
    '\uA77F': 'g',
    '\u24D7': 'h',
    '\uFF48': 'h',
    '\u0125': 'h',
    '\u1E23': 'h',
    '\u1E27': 'h',
    '\u021F': 'h',
    '\u1E25': 'h',
    '\u1E29': 'h',
    '\u1E2B': 'h',
    '\u1E96': 'h',
    '\u0127': 'h',
    '\u2C68': 'h',
    '\u2C76': 'h',
    '\u0265': 'h',
    '\u0195': 'hv',
    '\u24D8': 'i',
    '\uFF49': 'i',
    '\u00EC': 'i',
    '\u00ED': 'i',
    '\u00EE': 'i',
    '\u0129': 'i',
    '\u012B': 'i',
    '\u012D': 'i',
    '\u00EF': 'i',
    '\u1E2F': 'i',
    '\u1EC9': 'i',
    '\u01D0': 'i',
    '\u0209': 'i',
    '\u020B': 'i',
    '\u1ECB': 'i',
    '\u012F': 'i',
    '\u1E2D': 'i',
    '\u0268': 'i',
    '\u0131': 'i',
    '\u24D9': 'j',
    '\uFF4A': 'j',
    '\u0135': 'j',
    '\u01F0': 'j',
    '\u0249': 'j',
    '\u24DA': 'k',
    '\uFF4B': 'k',
    '\u1E31': 'k',
    '\u01E9': 'k',
    '\u1E33': 'k',
    '\u0137': 'k',
    '\u1E35': 'k',
    '\u0199': 'k',
    '\u2C6A': 'k',
    '\uA741': 'k',
    '\uA743': 'k',
    '\uA745': 'k',
    '\uA7A3': 'k',
    '\u24DB': 'l',
    '\uFF4C': 'l',
    '\u0140': 'l',
    '\u013A': 'l',
    '\u013E': 'l',
    '\u1E37': 'l',
    '\u1E39': 'l',
    '\u013C': 'l',
    '\u1E3D': 'l',
    '\u1E3B': 'l',
    '\u017F': 'l',
    '\u0142': 'l',
    '\u019A': 'l',
    '\u026B': 'l',
    '\u2C61': 'l',
    '\uA749': 'l',
    '\uA781': 'l',
    '\uA747': 'l',
    '\u01C9': 'lj',
    '\u24DC': 'm',
    '\uFF4D': 'm',
    '\u1E3F': 'm',
    '\u1E41': 'm',
    '\u1E43': 'm',
    '\u0271': 'm',
    '\u026F': 'm',
    '\u24DD': 'n',
    '\uFF4E': 'n',
    '\u01F9': 'n',
    '\u0144': 'n',
    '\u00F1': 'n',
    '\u1E45': 'n',
    '\u0148': 'n',
    '\u1E47': 'n',
    '\u0146': 'n',
    '\u1E4B': 'n',
    '\u1E49': 'n',
    '\u019E': 'n',
    '\u0272': 'n',
    '\u0149': 'n',
    '\uA791': 'n',
    '\uA7A5': 'n',
    '\u01CC': 'nj',
    '\u24DE': 'o',
    '\uFF4F': 'o',
    '\u00F2': 'o',
    '\u00F3': 'o',
    '\u00F4': 'o',
    '\u1ED3': 'o',
    '\u1ED1': 'o',
    '\u1ED7': 'o',
    '\u1ED5': 'o',
    '\u00F5': 'o',
    '\u1E4D': 'o',
    '\u022D': 'o',
    '\u1E4F': 'o',
    '\u014D': 'o',
    '\u1E51': 'o',
    '\u1E53': 'o',
    '\u014F': 'o',
    '\u022F': 'o',
    '\u0231': 'o',
    '\u00F6': 'o',
    '\u022B': 'o',
    '\u1ECF': 'o',
    '\u0151': 'o',
    '\u01D2': 'o',
    '\u020D': 'o',
    '\u020F': 'o',
    '\u01A1': 'o',
    '\u1EDD': 'o',
    '\u1EDB': 'o',
    '\u1EE1': 'o',
    '\u1EDF': 'o',
    '\u1EE3': 'o',
    '\u1ECD': 'o',
    '\u1ED9': 'o',
    '\u01EB': 'o',
    '\u01ED': 'o',
    '\u00F8': 'o',
    '\u01FF': 'o',
    '\u0254': 'o',
    '\uA74B': 'o',
    '\uA74D': 'o',
    '\u0275': 'o',
    '\u01A3': 'oi',
    '\u0223': 'ou',
    '\uA74F': 'oo',
    '\u24DF': 'p',
    '\uFF50': 'p',
    '\u1E55': 'p',
    '\u1E57': 'p',
    '\u01A5': 'p',
    '\u1D7D': 'p',
    '\uA751': 'p',
    '\uA753': 'p',
    '\uA755': 'p',
    '\u24E0': 'q',
    '\uFF51': 'q',
    '\u024B': 'q',
    '\uA757': 'q',
    '\uA759': 'q',
    '\u24E1': 'r',
    '\uFF52': 'r',
    '\u0155': 'r',
    '\u1E59': 'r',
    '\u0159': 'r',
    '\u0211': 'r',
    '\u0213': 'r',
    '\u1E5B': 'r',
    '\u1E5D': 'r',
    '\u0157': 'r',
    '\u1E5F': 'r',
    '\u024D': 'r',
    '\u027D': 'r',
    '\uA75B': 'r',
    '\uA7A7': 'r',
    '\uA783': 'r',
    '\u24E2': 's',
    '\uFF53': 's',
    '\u00DF': 's',
    '\u015B': 's',
    '\u1E65': 's',
    '\u015D': 's',
    '\u1E61': 's',
    '\u0161': 's',
    '\u1E67': 's',
    '\u1E63': 's',
    '\u1E69': 's',
    '\u0219': 's',
    '\u015F': 's',
    '\u023F': 's',
    '\uA7A9': 's',
    '\uA785': 's',
    '\u1E9B': 's',
    '\u24E3': 't',
    '\uFF54': 't',
    '\u1E6B': 't',
    '\u1E97': 't',
    '\u0165': 't',
    '\u1E6D': 't',
    '\u021B': 't',
    '\u0163': 't',
    '\u1E71': 't',
    '\u1E6F': 't',
    '\u0167': 't',
    '\u01AD': 't',
    '\u0288': 't',
    '\u2C66': 't',
    '\uA787': 't',
    '\uA729': 'tz',
    '\u24E4': 'u',
    '\uFF55': 'u',
    '\u00F9': 'u',
    '\u00FA': 'u',
    '\u00FB': 'u',
    '\u0169': 'u',
    '\u1E79': 'u',
    '\u016B': 'u',
    '\u1E7B': 'u',
    '\u016D': 'u',
    '\u00FC': 'u',
    '\u01DC': 'u',
    '\u01D8': 'u',
    '\u01D6': 'u',
    '\u01DA': 'u',
    '\u1EE7': 'u',
    '\u016F': 'u',
    '\u0171': 'u',
    '\u01D4': 'u',
    '\u0215': 'u',
    '\u0217': 'u',
    '\u01B0': 'u',
    '\u1EEB': 'u',
    '\u1EE9': 'u',
    '\u1EEF': 'u',
    '\u1EED': 'u',
    '\u1EF1': 'u',
    '\u1EE5': 'u',
    '\u1E73': 'u',
    '\u0173': 'u',
    '\u1E77': 'u',
    '\u1E75': 'u',
    '\u0289': 'u',
    '\u24E5': 'v',
    '\uFF56': 'v',
    '\u1E7D': 'v',
    '\u1E7F': 'v',
    '\u028B': 'v',
    '\uA75F': 'v',
    '\u028C': 'v',
    '\uA761': 'vy',
    '\u24E6': 'w',
    '\uFF57': 'w',
    '\u1E81': 'w',
    '\u1E83': 'w',
    '\u0175': 'w',
    '\u1E87': 'w',
    '\u1E85': 'w',
    '\u1E98': 'w',
    '\u1E89': 'w',
    '\u2C73': 'w',
    '\u24E7': 'x',
    '\uFF58': 'x',
    '\u1E8B': 'x',
    '\u1E8D': 'x',
    '\u24E8': 'y',
    '\uFF59': 'y',
    '\u1EF3': 'y',
    '\u00FD': 'y',
    '\u0177': 'y',
    '\u1EF9': 'y',
    '\u0233': 'y',
    '\u1E8F': 'y',
    '\u00FF': 'y',
    '\u1EF7': 'y',
    '\u1E99': 'y',
    '\u1EF5': 'y',
    '\u01B4': 'y',
    '\u024F': 'y',
    '\u1EFF': 'y',
    '\u24E9': 'z',
    '\uFF5A': 'z',
    '\u017A': 'z',
    '\u1E91': 'z',
    '\u017C': 'z',
    '\u017E': 'z',
    '\u1E93': 'z',
    '\u1E95': 'z',
    '\u01B6': 'z',
    '\u0225': 'z',
    '\u0240': 'z',
    '\u2C6C': 'z',
    '\uA763': 'z',
    '\u0386': '\u0391',
    '\u0388': '\u0395',
    '\u0389': '\u0397',
    '\u038A': '\u0399',
    '\u03AA': '\u0399',
    '\u038C': '\u039F',
    '\u038E': '\u03A5',
    '\u03AB': '\u03A5',
    '\u038F': '\u03A9',
    '\u03AC': '\u03B1',
    '\u03AD': '\u03B5',
    '\u03AE': '\u03B7',
    '\u03AF': '\u03B9',
    '\u03CA': '\u03B9',
    '\u0390': '\u03B9',
    '\u03CC': '\u03BF',
    '\u03CD': '\u03C5',
    '\u03CB': '\u03C5',
    '\u03B0': '\u03C5',
    '\u03C9': '\u03C9',
    '\u03C2': '\u03C3'
  };

  return diacritics;
});

define('select2/data/base',[
  '../utils'
], function (Utils) {
  function BaseAdapter ($element, options) {
    BaseAdapter.__super__.constructor.call(this);
  }

  Utils.Extend(BaseAdapter, Utils.Observable);

  BaseAdapter.prototype.current = function (callback) {
    throw new Error('The `current` method must be defined in child classes.');
  };

  BaseAdapter.prototype.query = function (params, callback) {
    throw new Error('The `query` method must be defined in child classes.');
  };

  BaseAdapter.prototype.bind = function (container, $container) {
    // Can be implemented in subclasses
  };

  BaseAdapter.prototype.destroy = function () {
    // Can be implemented in subclasses
  };

  BaseAdapter.prototype.generateResultId = function (container, data) {
    var id = container.id + '-result-';

    id += Utils.generateChars(4);

    if (data.id != null) {
      id += '-' + data.id.toString();
    } else {
      id += '-' + Utils.generateChars(4);
    }
    return id;
  };

  return BaseAdapter;
});

define('select2/data/select',[
  './base',
  '../utils',
  'jquery'
], function (BaseAdapter, Utils, $) {
  function SelectAdapter ($element, options) {
    this.$element = $element;
    this.options = options;

    SelectAdapter.__super__.constructor.call(this);
  }

  Utils.Extend(SelectAdapter, BaseAdapter);

  SelectAdapter.prototype.current = function (callback) {
    var data = [];
    var self = this;

    this.$element.find(':selected').each(function () {
      var $option = $(this);

      var option = self.item($option);

      data.push(option);
    });

    callback(data);
  };

  SelectAdapter.prototype.select = function (data) {
    var self = this;

    // If data.element is a DOM nose, use it instead
    if ($(data.element).is('option')) {
      data.element.selected = true;

      this.$element.trigger('change');

      return;
    }

    if (this.$element.prop('multiple')) {
      this.current(function (currentData) {
        var val = [];

        data = [data];
        data.push.apply(data, currentData);

        for (var d = 0; d < data.length; d++) {
          id = data[d].id;

          if (val.indexOf(id) === -1) {
            val.push(id);
          }
        }

        self.$element.val(val);
        self.$element.trigger('change');
      });
    } else {
      var val = data.id;

      this.$element.val(val);

      this.$element.trigger('change');
    }
  };

  SelectAdapter.prototype.unselect = function (data) {
    var self = this;

    if (!this.$element.prop('multiple')) {
      return;
    }

    if ($(data.element).is('option')) {
      data.element.selected = false;

      this.$element.trigger('change');

      return;
    }

    this.current(function (currentData) {
      var val = [];

      for (var d = 0; d < currentData.length; d++) {
        id = currentData[d].id;

        if (id !== data.id && val.indexOf(id) === -1) {
          val.push(id);
        }
      }

      self.$element.val(val);

      self.$element.trigger('change');
    });
  };

  SelectAdapter.prototype.bind = function (container, $container) {
    var self = this;

    this.container = container;

    container.on('select', function (params) {
      self.select(params.data);
    });

    container.on('unselect', function (params) {
      self.unselect(params.data);
    });
  };

  SelectAdapter.prototype.destroy = function () {
    // Remove anything added to child elements
    this.$element.find('*').each(function () {
      // Remove any custom data set by Select2
      $.removeData(this, 'data');
    });
  };

  SelectAdapter.prototype.query = function (params, callback) {
    var data = [];
    var self = this;

    var $options = this.$element.children();

    $options.each(function () {
      var $option = $(this);

      if (!$option.is('option') && !$option.is('optgroup')) {
        return;
      }

      var option = self.item($option);

      var matches = self.matches(params, option);

      if (matches !== null) {
        data.push(matches);
      }
    });

    callback({
      results: data
    });
  };

  SelectAdapter.prototype.option = function (data) {
    var option;

    if (data.children) {
      option = document.createElement('optgroup');
      option.label = data.text;
    } else {
      option = document.createElement('option');
      option.innerText = data.text;
    }

    if (data.id) {
      option.value = data.id;
    }

    if (data.disabled) {
      option.disabled = true;
    }

    if (data.selected) {
      option.selected = true;
    }

    var $option = $(option);

    var normalizedData = this._normalizeItem(data);
    normalizedData.element = option;

    // Override the option's data with the combined data
    $.data(option, 'data', normalizedData);

    return $option;
  };

  SelectAdapter.prototype.item = function ($option) {
    var data = {};

    data = $.data($option[0], 'data');

    if (data != null) {
      return data;
    }

    if ($option.is('option')) {
      data = {
        id: $option.val(),
        text: $option.html(),
        disabled: $option.prop('disabled'),
        selected: $option.prop('selected')
      };
    } else if ($option.is('optgroup')) {
      data = {
        text: $option.prop('label'),
        children: []
      };

      var $children = $option.children('option');
      var children = [];

      for (var c = 0; c < $children.length; c++) {
        var $child = $($children[c]);

        var child = this.item($child);

        children.push(child);
      }

      data.children = children;
    }

    data = this._normalizeItem(data);
    data.element = $option[0];

    $.data($option[0], 'data', data);

    return data;
  };

  SelectAdapter.prototype._normalizeItem = function (item) {
    if (!$.isPlainObject(item)) {
      item = {
        id: item,
        text: item
      };
    }

    item = $.extend({}, {
      text: ''
    }, item);

    var defaults = {
      selected: false,
      disabled: false
    };

    if (item.id != null) {
      item.id = item.id.toString();
    }

    if (item.text != null) {
      item.text = item.text.toString();
    }

    if (item._resultId == null && item.id && this.container != null) {
      item._resultId = this.generateResultId(this.container, item);
    }

    return $.extend({}, defaults, item);
  };

  SelectAdapter.prototype.matches = function (params, data) {
    var matcher = this.options.get('matcher');

    return matcher(params, data);
  };

  return SelectAdapter;
});

define('select2/data/array',[
  './select',
  '../utils',
  'jquery'
], function (SelectAdapter, Utils, $) {
  function ArrayAdapter ($element, options) {
    var data = options.get('data') || [];

    ArrayAdapter.__super__.constructor.call(this, $element, options);

    $element.append(this.convertToOptions(data));
  }

  Utils.Extend(ArrayAdapter, SelectAdapter);

  ArrayAdapter.prototype.select = function (data) {
    var $option = this.$element.find('option[value="' + data.id + '"]');

    if ($option.length === 0) {
      $option = this.option(data);

      this.$element.append($option);
    }

    ArrayAdapter.__super__.select.call(this, data);
  };

  ArrayAdapter.prototype.convertToOptions = function (data) {
    var self = this;

    var $existing = this.$element.find('option');
    var existingIds = $existing.map(function () {
      return self.item($(this)).id;
    }).get();

    var $options = [];

    // Filter out all items except for the one passed in the argument
    function onlyItem (item) {
      return function () {
        return $(this).val() == item.id;
      };
    }

    for (var d = 0; d < data.length; d++) {
      var item = this._normalizeItem(data[d]);

      // Skip items which were pre-loaded, only merge the data
      if (existingIds.indexOf(item.id) >= 0) {
        var $existingOption = $existing.filter(onlyItem(item));

        var existingData = this.item($existingOption);
        var newData = $.extend(true, {}, existingData, item);

        var $newOption = this.option(existingData);

        $existingOption.replaceWith($newOption);

        continue;
      }

      var $option = this.option(item);

      if (item.children) {
        var $children = this.convertToOptions(item.children);

        $option.append($children);
      }

      $options.push($option);
    }

    return $options;
  };

  return ArrayAdapter;
});

define('select2/data/ajax',[
  './array',
  '../utils',
  'jquery'
], function (ArrayAdapter, Utils, $) {
  function AjaxAdapter ($element, options) {
    this.ajaxOptions = options.get('ajax');

    if (this.ajaxOptions.processResults != null) {
      this.processResults = this.ajaxOptions.processResults;
    }

    ArrayAdapter.__super__.constructor.call(this, $element, options);
  }

  Utils.Extend(AjaxAdapter, ArrayAdapter);

  AjaxAdapter.prototype.processResults = function (results) {
    return results;
  };

  AjaxAdapter.prototype.query = function (params, callback) {
    var matches = [];
    var self = this;

    if (this._request) {
      this._request.abort();
      this._request = null;
    }

    var options = $.extend({
      type: 'GET'
    }, this.ajaxOptions);

    if (typeof options.url === 'function') {
      options.url = options.url(params);
    }

    if (typeof options.data === 'function') {
      options.data = options.data(params);
    }

    function request () {
      var $request = $.ajax(options);

      $request.success(function (data) {
        var results = self.processResults(data, params);

        if (console && console.error) {
          // Check to make sure that the response included a `results` key.
          if (!results || !results.results || !$.isArray(results.results)) {
            console.error(
              'Select2: The AJAX results did not return an array in the ' +
              '`results` key of the response.'
            );
          }
        }

        callback(results);
      });

      self._request = $request;
    }

    if (this.ajaxOptions.delay && params.term !== '') {
      if (this._queryTimeout) {
        window.clearTimeout(this._queryTimeout);
      }

      this._queryTimeout = window.setTimeout(request, this.ajaxOptions.delay);
    } else {
      request();
    }
  };

  return AjaxAdapter;
});

define('select2/data/tags',[
  'jquery'
], function ($) {
  function Tags (decorated, $element, options) {
    var tags = options.get('tags');

    var createTag = options.get('createTag');

    if (createTag !== undefined) {
      this.createTag = createTag;
    }

    decorated.call(this, $element, options);

    if ($.isArray(tags)) {
      for (var t = 0; t < tags.length; t++) {
        var tag = tags[t];
        var item = this._normalizeItem(tag);

        var $option = this.option(item);

        this.$element.append($option);
      }
    }
  }

  Tags.prototype.query = function (decorated, params, callback) {
    var self = this;

    this._removeOldTags();

    if (params.term == null || params.term === '' || params.page != null) {
      decorated.call(this, params, callback);
      return;
    }

    function wrapper (obj, child) {
      var data = obj.results;

      for (var i = 0; i < data.length; i++) {
        var option = data[i];

        var checkChildren = (
          option.children != null &&
          !wrapper({
            results: option.children
          }, true)
        );

        var checkText = option.text === params.term;

        if (checkText || checkChildren) {
          if (child) {
            return false;
          }

          obj.data = data;
          callback(obj);

          return;
        }
      }

      if (child) {
        return true;
      }

      var tag = self.createTag(params);

      if (tag != null) {
        var $option = self.option(tag);
        $option.attr('data-select2-tag', true);

        self.$element.append($option);

        self.insertTag(data, tag);
      }

      obj.results = data;

      callback(obj);
    }

    decorated.call(this, params, wrapper);
  };

  Tags.prototype.createTag = function (decorated, params) {
    return {
      id: params.term,
      text: params.term
    };
  };

  Tags.prototype.insertTag = function (_, data, tag) {
    data.unshift(tag);
  };

  Tags.prototype._removeOldTags = function (_) {
    var tag = this._lastTag;

    var $options = this.$element.find('option[data-select2-tag]');

    $options.each(function () {
      if (this.selected) {
        return;
      }

      $(this).remove();
    });
  };

  return Tags;
});

define('select2/data/tokenizer',[
  'jquery'
], function ($) {
  function Tokenizer (decorated, $element, options) {
    var tokenizer = options.get('tokenizer');

    if (tokenizer !== undefined) {
      this.tokenizer = tokenizer;
    }

    decorated.call(this, $element, options);
  }

  Tokenizer.prototype.bind = function (decorated, container, $container) {
    decorated.call(this, container, $container);

    this.$search =  container.dropdown.$search || container.selection.$search ||
      $container.find('.select2-search__field');
  };

  Tokenizer.prototype.query = function (decorated, params, callback) {
    var self = this;

    function select (data) {
      self.select(data);
    }

    params.term = params.term || '';

    var tokenData = this.tokenizer(params, this.options, select);

    if (tokenData.term !== params.term) {
      // Replace the search term if we have the search box
      if (this.$search.length) {
        this.$search.val(tokenData.term);
        this.$search.focus();
      }

      params.term = tokenData.term;
    }

    decorated.call(this, params, callback);
  };

  Tokenizer.prototype.tokenizer = function (_, params, options, callback) {
    var separators = options.get('tokenSeparators') || [];
    var term = params.term;
    var i = 0;

    var createTag = this.createTag || function (params) {
      return {
        id: params.term,
        text: params.term
      };
    };

    while (i < term.length) {
      var termChar = term[i];

      if (separators.indexOf(termChar) === -1) {
        i++;

        continue;
      }

      var part = term.substr(0, i);
      var partParams = $.extend({}, params, {
        term: part
      });

      var data = createTag(partParams);

      callback(data);

      // Reset the term to not include the tokenized portion
      term = term.substr(i + 1) || '';
      i = 0;
    }

    return {
      term: term
    };
  };

  return Tokenizer;
});

define('select2/data/minimumInputLength',[

], function () {
  function MinimumInputLength (decorated, $e, options) {
    this.minimumInputLength = options.get('minimumInputLength');

    decorated.call(this, $e, options);
  }

  MinimumInputLength.prototype.query = function (decorated, params, callback) {
    params.term = params.term || '';

    if (params.term.length < this.minimumInputLength) {
      this.trigger('results:message', {
        message: 'inputTooShort',
        args: {
          minimum: this.minimumInputLength,
          input: params.term,
          params: params
        }
      });

      return;
    }

    decorated.call(this, params, callback);
  };

  return MinimumInputLength;
});

define('select2/data/maximumInputLength',[

], function () {
  function MaximumInputLength (decorated, $e, options) {
    this.maximumInputLength = options.get('maximumInputLength');

    decorated.call(this, $e, options);
  }

  MaximumInputLength.prototype.query = function (decorated, params, callback) {
    params.term = params.term || '';

    if (this.maximumInputLength > 0 &&
        params.term.length > this.maximumInputLength) {
      this.trigger('results:message', {
        message: 'inputTooLong',
        args: {
          minimum: this.maximumInputLength,
          input: params.term,
          params: params
        }
      });

      return;
    }

    decorated.call(this, params, callback);
  };

  return MaximumInputLength;
});

define('select2/data/maximumSelectionLength',[

], function (){
  function MaximumSelectionLength (decorated, $e, options) {
    this.maximumSelectionLength = options.get('maximumSelectionLength');

    decorated.call(this, $e, options);
  }

  MaximumSelectionLength.prototype.query =
    function (decorated, params, callback) {
      var self = this;

      this.current(function (currentData) {
        var count = currentData != null ? currentData.length : 0;
        if (self.maximumSelectionLength > 0 &&
          count >= self.maximumSelectionLength) {
          self.trigger('results:message', {
            message: 'maximumSelected',
            args: {
              maximum: self.maximumSelectionLength
            }
          });
          return;
        }
        decorated.call(self, params, callback);
      });
  };

  return MaximumSelectionLength;
});

define('select2/dropdown',[
  'jquery',
  './utils'
], function ($, Utils) {
  function Dropdown ($element, options) {
    this.$element = $element;
    this.options = options;

    Dropdown.__super__.constructor.call(this);
  }

  Utils.Extend(Dropdown, Utils.Observable);

  Dropdown.prototype.render = function () {
    var $dropdown = $(
      '<span class="select2-dropdown">' +
        '<span class="select2-results"></span>' +
      '</span>'
    );

    $dropdown.attr('dir', this.options.get('dir'));

    this.$dropdown = $dropdown;

    return $dropdown;
  };

  Dropdown.prototype.position = function ($dropdown, $container) {
    // Should be implmented in subclasses
  };

  Dropdown.prototype.destroy = function () {
    // Remove the dropdown from the DOM
    this.$dropdown.remove();
  };

  Dropdown.prototype.bind = function (container, $container) {
    var self = this;

    container.on('select', function (params) {
      self._onSelect(params);
    });

    container.on('unselect', function (params) {
      self._onUnSelect(params);
    });
  };

  Dropdown.prototype._onSelect = function () {
    this.trigger('close');
  };

  Dropdown.prototype._onUnSelect = function () {
    this.trigger('close');
  };

  return Dropdown;
});

define('select2/dropdown/search',[
  'jquery',
  '../utils'
], function ($, Utils) {
  function Search () { }

  Search.prototype.render = function (decorated) {
    var $rendered = decorated.call(this);

    var $search = $(
      '<span class="select2-search select2-search--dropdown">' +
        '<input class="select2-search__field" type="search" tabindex="-1"' +
        ' role="textbox" />' +
      '</span>'
    );

    this.$searchContainer = $search;
    this.$search = $search.find('input');

    $rendered.prepend($search);

    return $rendered;
  };

  Search.prototype.bind = function (decorated, container, $container) {
    var self = this;

    decorated.call(this, container, $container);

    this.$search.on('keydown', function (evt) {
      self.trigger('keypress', evt);

      self._keyUpPrevented = evt.isDefaultPrevented();
    });

    this.$search.on('keyup', function (evt) {
      self.handleSearch(evt);
    });

    container.on('open', function () {
      self.$search.attr('tabindex', 0);

      self.$search.focus();

      window.setTimeout(function () {
        self.$search.focus();
      }, 0);
    });

    container.on('close', function () {
      self.$search.attr('tabindex', -1);

      self.$search.val('');
    });

    container.on('results:all', function (params) {
      if (params.query.term == null || params.query.term === '') {
        var showSearch = self.showSearch(params);

        if (showSearch) {
          self.$searchContainer.removeClass('select2-search--hide');
        } else {
          self.$searchContainer.addClass('select2-search--hide');
        }
      }
    });
  };

  Search.prototype.handleSearch = function (evt) {
    if (!this._keyUpPrevented) {
      var input = this.$search.val();

      this.trigger('query', {
        term: input
      });
    }

    this._keyUpPrevented = false;
  };

  Search.prototype.showSearch = function (_, params) {
    return true;
  };

  return Search;
});

define('select2/dropdown/hidePlaceholder',[

], function () {
  function HidePlaceholder (decorated, $element, options, dataAdapter) {
    this.placeholder = this.normalizePlaceholder(options.get('placeholder'));

    decorated.call(this, $element, options, dataAdapter);
  }

  HidePlaceholder.prototype.append = function (decorated, data) {
    data.results = this.removePlaceholder(data.results);

    decorated.call(this, data);
  };

  HidePlaceholder.prototype.normalizePlaceholder = function (_, placeholder) {
    if (typeof placeholder === 'string') {
      placeholder = {
        id: '',
        text: placeholder
      };
    }

    return placeholder;
  };

  HidePlaceholder.prototype.removePlaceholder = function (_, data) {
    var modifiedData = data.slice(0);

    for (var d = data.length - 1; d >= 0; d--) {
      var item = data[d];

      if (this.placeholder.id === item.id) {
        modifiedData.splice(d, 1);
      }
    }

    return modifiedData;
  };

  return HidePlaceholder;
});

define('select2/dropdown/infiniteScroll',[
  'jquery'
], function ($) {
  function InfiniteScroll (decorated, $element, options, dataAdapter) {
    this.lastParams = {};

    decorated.call(this, $element, options, dataAdapter);

    this.$loadingMore = this.createLoadingMore();
    this.loading = false;
  }

  InfiniteScroll.prototype.append = function (decorated, data) {
    this.$loadingMore.remove();
    this.loading = false;

    decorated.call(this, data);

    if (this.showLoadingMore(data)) {
      this.$results.append(this.$loadingMore);
    }
  };

  InfiniteScroll.prototype.bind = function (decorated, container, $container) {
    var self = this;

    decorated.call(this, container, $container);

    container.on('query', function (params) {
      self.lastParams = params;
      self.loading = true;
    });

    container.on('query:append', function (params) {
      self.lastParams = params;
      self.loading = true;
    });

    this.$results.on('scroll', function () {
      var isLoadMoreVisible = $.contains(
        document.documentElement,
        self.$loadingMore[0]
      );

      if (self.loading || !isLoadMoreVisible) {
        return;
      }

      var currentOffset = self.$results.offset().top +
        self.$results.outerHeight(false);
      var loadingMoreOffset = self.$loadingMore.offset().top +
        self.$loadingMore.outerHeight(false);

      if (currentOffset + 50 >= loadingMoreOffset) {
        self.loadMore();
      }
    });
  };

  InfiniteScroll.prototype.loadMore = function () {
    this.loading = true;

    var params = $.extend({}, {page: 1}, this.lastParams);

    params.page++;

    this.trigger('query:append', params);
  };

  InfiniteScroll.prototype.showLoadingMore = function (_, data) {
    return data.pagination && data.pagination.more;
  };

  InfiniteScroll.prototype.createLoadingMore = function () {
    var $option = $(
      '<li class="option load-more" role="treeitem"></li>'
    );

    var message = this.options.get('translations').get('loadingMore');

    $option.html(message(this.lastParams));

    return $option;
  };

  return InfiniteScroll;
});

define('select2/dropdown/attachBody',[
  'jquery',
  '../utils'
], function ($, Utils) {
  function AttachBody (decorated, $element, options) {
    this.$dropdownParent = options.get('dropdownParent') || document.body;

    decorated.call(this, $element, options);
  }

  AttachBody.prototype.bind = function (decorated, container, $container) {
    var self = this;

    var setupResultsEvents = false;

    decorated.call(this, container, $container);

    container.on('open', function () {
      self._showDropdown();
      self._attachPositioningHandler(container);

      if (!setupResultsEvents) {
        setupResultsEvents = true;

        container.on('results:all', function () {
          self._positionDropdown();
          self._resizeDropdown();
        });

        container.on('results:append', function () {
          self._positionDropdown();
          self._resizeDropdown();
        });
      }
    });

    container.on('close', function () {
      self._hideDropdown();
      self._detachPositioningHandler(container);
    });

    this.$dropdownContainer.on('mousedown', function (evt) {
      evt.stopPropagation();
    });
  };

  AttachBody.prototype.position = function (decorated, $dropdown, $container) {
    // Clone all of the container classes
    $dropdown.attr('class', $container.attr('class'));

    $dropdown.removeClass('select2');
    $dropdown.addClass('select2-container--open');

    $dropdown.css({
      position: 'absolute',
      top: -999999
    });

    this.$container = $container;
  };

  AttachBody.prototype.render = function (decorated) {
    var $container = $('<span></span>');

    var $dropdown = decorated.call(this);
    $container.append($dropdown);

    this.$dropdownContainer = $container;

    return $container;
  };

  AttachBody.prototype._hideDropdown = function (decorated) {
    this.$dropdownContainer.detach();
  };

  AttachBody.prototype._attachPositioningHandler = function (container) {
    var self = this;

    var scrollEvent = 'scroll.select2.' + container.id;
    var resizeEvent = 'resize.select2.' + container.id;
    var orientationEvent = 'orientationchange.select2.' + container.id;

    $watchers = this.$container.parents().filter(Utils.hasScroll);
    $watchers.each(function () {
      $(this).data('select2-scroll-position', {
        x: $(this).scrollLeft(),
        y: $(this).scrollTop()
      });
    });

    $watchers.on(scrollEvent, function (ev) {
      var position = $(this).data('select2-scroll-position');
      $(this).scrollTop(position.y);
    });

    $(window).on(scrollEvent + ' ' + resizeEvent + ' ' + orientationEvent,
      function (e) {
      self._positionDropdown();
      self._resizeDropdown();
    });
  };

  AttachBody.prototype._detachPositioningHandler = function (container) {
    var scrollEvent = 'scroll.select2.' + container.id;
    var resizeEvent = 'resize.select2.' + container.id;
    var orientationEvent = 'orientationchange.select2.' + container.id;

    $watchers = this.$container.parents().filter(Utils.hasScroll);
    $watchers.off(scrollEvent);

    $(window).off(scrollEvent + ' ' + resizeEvent + ' ' + orientationEvent);
  };

  AttachBody.prototype._positionDropdown = function () {
    var $window = $(window);

    var isCurrentlyAbove = this.$dropdown.hasClass('select2-dropdown--above');
    var isCurrentlyBelow = this.$dropdown.hasClass('select2-dropdown--below');

    var newDirection = null;

    var position = this.$container.position();
    var offset = this.$container.offset();

    offset.bottom = offset.top + this.$container.outerHeight(false);

    var container = {
      height: this.$container.outerHeight(false)
    };

    container.top = offset.top;
    container.bottom = offset.top + container.height;

    var dropdown = {
      height: this.$dropdown.outerHeight(false)
    };

    var viewport = {
      top: $window.scrollTop(),
      bottom: $window.scrollTop() + $window.height()
    };

    var enoughRoomAbove = viewport.top < (offset.top - dropdown.height);
    var enoughRoomBelow = viewport.bottom > (offset.bottom + dropdown.height);

    var css = {
      left: offset.left,
      top: container.bottom
    };

    if (!isCurrentlyAbove && !isCurrentlyBelow) {
      newDirection = 'below';
    }

    if (!enoughRoomBelow && enoughRoomAbove && !isCurrentlyAbove) {
      newDirection = 'above';
    } else if (!enoughRoomAbove && enoughRoomBelow && isCurrentlyAbove) {
      newDirection = 'below';
    }

    if (newDirection == 'above' ||
      (isCurrentlyAbove && newDirection !== 'below')) {
      css.top = container.top - dropdown.height;
    }

    if (newDirection != null) {
      this.$dropdown
        .removeClass('select2-dropdown--below select2-dropdown--above')
        .addClass('select2-dropdown--' + newDirection);
      this.$container
        .removeClass('select2-container--below select2-container--above')
        .addClass('select2-container--' + newDirection);
    }

    this.$dropdownContainer.css(css);
  };

  AttachBody.prototype._resizeDropdown = function () {
    this.$dropdownContainer.width();

    this.$dropdown.css({
      width: this.$container.outerWidth(false) + 'px'
    });
  };

  AttachBody.prototype._showDropdown = function (decorated) {
    this.$dropdownContainer.appendTo(this.$dropdownParent);

    this._positionDropdown();
    this._resizeDropdown();
  };

  return AttachBody;
});

define('select2/dropdown/minimumResultsForSearch',[

], function () {
  function countResults (data) {
    count = 0;

    for (var d = 0; d < data.length; d++) {
      var item = data[d];

      if (item.children) {
        count += countResults(item.children);
      } else {
        count++;
      }
    }

    return count;
  }

  function MinimumResultsForSearch (decorated, $element, options, dataAdapter) {
    this.minimumResultsForSearch = options.get('minimumResultsForSearch');

    decorated.call(this, $element, options, dataAdapter);
  }

  MinimumResultsForSearch.prototype.showSearch = function (decorated, params) {
    if (countResults(params.data.results) < this.minimumResultsForSearch) {
      return false;
    }

    return decorated.call(this, params);
  };

  return MinimumResultsForSearch;
});

define('select2/dropdown/selectOnClose',[

], function () {
  function SelectOnClose () { }

  SelectOnClose.prototype.bind = function (decorated, container, $container) {
    var self = this;

    decorated.call(this, container, $container);

    container.on('close', function () {
      self._handleSelectOnClose();
    });
  };

  SelectOnClose.prototype._handleSelectOnClose = function () {
    var $highlightedResults = this.getHighlightedResults();

    if ($highlightedResults.length < 1) {
      return;
    }

    $highlightedResults.trigger('mouseup');
  };

  return SelectOnClose;
});

define('select2/i18n/en',[],function () {
  // English
  return {
    errorLoading: function () {
      return 'The results could not be loaded.';
    },
    inputTooLong: function (args) {
      var overChars = args.input.length - args.maximum;

      var message = 'Please delete ' + overChars + ' character';

      if (overChars != 1) {
        message += 's';
      }

      return message;
    },
    inputTooShort: function (args) {
      var remainingChars = args.minimum - args.input.length;

      var message = 'Please enter ' + remainingChars + ' or more characters';

      return message;
    },
    loadingMore: function () {
      return 'Loading more results…';
    },
    maximumSelected: function (args) {
      var message = 'You can only select ' + args.maximum + ' item';

      if (args.maximum != 1) {
        message += 's';
      }

      return message;
    },
    noResults: function () {
      return 'No results found';
    },
    searching: function () {
      return 'Searching…';
    }
  };
});

define('select2/defaults',[
  'jquery',
  './results',

  './selection/single',
  './selection/multiple',
  './selection/placeholder',
  './selection/allowClear',
  './selection/search',
  './selection/eventRelay',

  './utils',
  './translation',
  './diacritics',

  './data/select',
  './data/array',
  './data/ajax',
  './data/tags',
  './data/tokenizer',
  './data/minimumInputLength',
  './data/maximumInputLength',
  './data/maximumSelectionLength',

  './dropdown',
  './dropdown/search',
  './dropdown/hidePlaceholder',
  './dropdown/infiniteScroll',
  './dropdown/attachBody',
  './dropdown/minimumResultsForSearch',
  './dropdown/selectOnClose',

  './i18n/en'
], function ($, ResultsList,

             SingleSelection, MultipleSelection, Placeholder, AllowClear,
             SelectionSearch, EventRelay,

             Utils, Translation, DIACRITICS,

             SelectData, ArrayData, AjaxData, Tags, Tokenizer,
             MinimumInputLength, MaximumInputLength, MaximumSelectionLength,

             Dropdown, DropdownSearch, HidePlaceholder, InfiniteScroll,
             AttachBody, MinimumResultsForSearch, SelectOnClose,

             EnglishTranslation) {
  function Defaults () {
    this.reset();
  }

  Defaults.prototype.apply = function (options) {
    options = $.extend({}, this.defaults, options);

    if (options.dataAdapter == null) {
      if (options.ajax != null) {
        options.dataAdapter = AjaxData;
      } else if (options.data != null) {
        options.dataAdapter = ArrayData;
      } else {
        options.dataAdapter = SelectData;
      }

      if (options.minimumInputLength > 0) {
        options.dataAdapter = Utils.Decorate(
          options.dataAdapter,
          MinimumInputLength
        );
      }

      if (options.maximumInputLength > 0) {
        options.dataAdapter = Utils.Decorate(
          options.dataAdapter,
          MaximumInputLength
        );
      }

      if (options.maximumSelectionLength > 0) {
        options.dataAdapter = Utils.Decorate(
          options.dataAdapter,
          MaximumSelectionLength
        );
      }

      if (options.tags != null) {
        options.dataAdapter = Utils.Decorate(options.dataAdapter, Tags);
      }

      if (options.tokenSeparators != null || options.tokenizer != null) {
        options.dataAdapter = Utils.Decorate(
          options.dataAdapter,
          Tokenizer
        );
      }

      if (options.query != null) {
        var Query = require(options.amdBase + 'compat/query');

        options.dataAdapter = Utils.Decorate(
          options.dataAdapter,
          Query
        );
      }

      if (options.initSelection != null) {
        var InitSelection = require(options.amdBase + 'compat/initSelection');

        options.dataAdapter = Utils.Decorate(
          options.dataAdapter,
          InitSelection
        );
      }
    }

    if (options.resultsAdapter == null) {
      options.resultsAdapter = ResultsList;

      if (options.ajax != null) {
        options.resultsAdapter = Utils.Decorate(
          options.resultsAdapter,
          InfiniteScroll
        );
      }

      if (options.placeholder != null) {
        options.resultsAdapter = Utils.Decorate(
          options.resultsAdapter,
          HidePlaceholder
        );
      }

      if (options.selectOnClose) {
        options.resultsAdapter = Utils.Decorate(
          options.resultsAdapter,
          SelectOnClose
        );
      }
    }

    if (options.dropdownAdapter == null) {
      if (options.multiple) {
        options.dropdownAdapter = Dropdown;
      } else {
        var SearchableDropdown = Utils.Decorate(Dropdown, DropdownSearch);

        options.dropdownAdapter = SearchableDropdown;
      }

      if (options.minimumResultsForSearch > 0) {
        options.dropdownAdapter = Utils.Decorate(
          options.dropdownAdapter,
          MinimumResultsForSearch
        );
      }

      options.dropdownAdapter = Utils.Decorate(
        options.dropdownAdapter,
        AttachBody
      );
    }

    if (options.selectionAdapter == null) {
      if (options.multiple) {
        options.selectionAdapter = MultipleSelection;
      } else {
        options.selectionAdapter = SingleSelection;
      }

      // Add the placeholder mixin if a placeholder was specified
      if (options.placeholder != null) {
        options.selectionAdapter = Utils.Decorate(
          options.selectionAdapter,
          Placeholder
        );

        if (options.allowClear) {
          options.selectionAdapter = Utils.Decorate(
            options.selectionAdapter,
            AllowClear
          );
        }
      }

      if (options.multiple) {
        options.selectionAdapter = Utils.Decorate(
          options.selectionAdapter,
          SelectionSearch
        );
      }

      options.selectionAdapter = Utils.Decorate(
        options.selectionAdapter,
        EventRelay
      );
    }

    if (typeof options.language === 'string') {
      // Check if the lanugage is specified with a region
      if (options.language.indexOf('-') > 0) {
        // Extract the region information if it is included
        var languageParts = options.language.split('-');
        var baseLanguage = languageParts[0];

        options.language = [options.language, baseLanguage];
      } else {
        options.language = [options.language];
      }
    }

    if ($.isArray(options.language)) {
      var languages = new Translation();
      options.language.push('en');

      var languageNames = options.language;

      for (var l = 0; l < languageNames.length; l++) {
        var name = languageNames[l];
        var language = {};

        try {
          // Try to load it with the original name
          language = Translation.loadPath(name);
        } catch (e) {
          try {
            // If we couldn't load it, check if it wasn't the full path
            name = this.defaults.amdLanguageBase + name;
            language = Translation.loadPath(name);
          } catch (ex) {
            // The translation could not be loaded at all. Sometimes this is
            // because of a configuration problem, other times this can be
            // because of how Select2 helps load all possible translation files.
            if (console && console.warn) {
              console.warn(
                'Select2: The lanugage file for "' + name + '" could not be ' +
                'automatically loaded. A fallback will be used instead.'
              );
            }

            continue;
          }
        }

        languages.extend(language);
      }

      options.translations = languages;
    } else {
      options.translations = new Translation(options.language);
    }

    return options;
  };

  Defaults.prototype.reset = function () {
    function stripDiacritics (text) {
      // Used 'uni range + named function' from http://jsperf.com/diacritics/18
      function match(a) {
        return DIACRITICS[a] || a;
      }

      return text.replace(/[^\u0000-\u007E]/g, match);
    }

    function matcher (params, data) {
      // Always return the object if there is nothing to compare
      if ($.trim(params.term) === '') {
        return data;
      }

      // Do a recursive check for options with children
      if (data.children && data.children.length > 0) {
        // Clone the data object if there are children
        // This is required as we modify the object to remove any non-matches
        var match = $.extend(true, {}, data);

        // Check each child of the option
        for (var c = data.children.length - 1; c >= 0; c--) {
          var child = data.children[c];

          var matches = matcher(params, child);

          // If there wasn't a match, remove the object in the array
          if (matches == null) {
            match.children.splice(c, 1);
          }
        }

        // If any children matched, return the new object
        if (match.children.length > 0) {
          return match;
        }

        // If there were no matching children, check just the plain object
        return matcher(params, match);
      }

      var original = stripDiacritics(data.text).toUpperCase();
      var term = stripDiacritics(params.term).toUpperCase();

      // Check if the text contains the term
      if (original.indexOf(term) > -1) {
        return data;
      }

      // If it doesn't contain the term, don't return anything
      return null;
    }

    this.defaults = {
      amdBase: 'select2/',
      amdLanguageBase: 'select2/i18n/',
      language: EnglishTranslation,
      matcher: matcher,
      minimumInputLength: 0,
      maximumInputLength: 0,
      maximumSelectionLength: 0,
      minimumResultsForSearch: 0,
      selectOnClose: false,
      sorter: function (data) {
        return data;
      },
      templateResult: function (result) {
        return result.text;
      },
      templateSelection: function (selection) {
        return selection.text;
      },
      theme: 'default',
      width: 'resolve'
    };
  };

  Defaults.prototype.set = function (key, value) {
    var camelKey = $.camelCase(key);

    var data = {};
    data[camelKey] = value;

    var convertedData = Utils._convertData(data);

    $.extend(this.defaults, convertedData);
  };

  var defaults = new Defaults();

  return defaults;
});

define('select2/options',[
  'jquery',
  './defaults',
  './utils'
], function ($, Defaults, Utils) {
  function Options (options, $element) {
    this.options = options;

    if ($element != null) {
      this.fromElement($element);
    }

    this.options = Defaults.apply(this.options);
  }

  Options.prototype.fromElement = function ($e) {
    var excludedData = ['select2'];

    if (this.options.multiple == null) {
      this.options.multiple = $e.prop('multiple');
    }

    if (this.options.disabled == null) {
      this.options.disabled = $e.prop('disabled');
    }

    if (this.options.language == null) {
      if ($e.prop('lang')) {
        this.options.language = $e.prop('lang').toLowerCase();
      } else if ($e.closest('[lang]').prop('lang')) {
        this.options.language = $e.closest('[lang]').prop('lang');
      }
    }

    if (this.options.dir == null) {
      if ($e.prop('dir')) {
        this.options.dir = $e.prop('dir');
      } else if ($e.closest('[dir]').prop('dir')) {
        this.options.dir = $e.closest('[dir]').prop('dir');
      } else {
        this.options.dir = 'ltr';
      }
    }

    $e.prop('disabled', this.options.disabled);
    $e.prop('multiple', this.options.multiple);

    if ($e.data('select2-tags')) {
      if (console && console.warn) {
        console.warn(
          'Select2: The `data-select2-tags` attribute has been changed to ' +
          'use the `data-data` and `data-tags="true"` attributes and will be ' +
          'removed in future versions of Select2.'
        );
      }

      $e.data('data', $e.data('select2-tags'));
      $e.data('tags', true);
    }

    if ($e.data('ajax-url')) {
      if (console && console.warn) {
        console.warn(
          'Select2: The `data-ajax-url` attribute has been changed to ' +
          '`data-ajax--url` and support for the old attribute will be removed' +
          ' in future versions of Select2.'
        );
      }

      $e.data('ajax--url', $e.data('ajax-url'));
    }

    var data = $e.data();

    data = Utils._convertData(data);

    for (var key in data) {
      if (excludedData.indexOf(key) > -1) {
        continue;
      }

      if ($.isPlainObject(this.options[key])) {
        $.extend(this.options[key], data[key]);
      } else {
        this.options[key] = data[key];
      }
    }

    return this;
  };

  Options.prototype.get = function (key) {
    return this.options[key];
  };

  Options.prototype.set = function (key, val) {
    this.options[key] = val;
  };

  return Options;
});

define('select2/core',[
  'jquery',
  './options',
  './utils',
  './keys'
], function ($, Options, Utils, KEYS) {
  var Select2 = function ($element, options) {
    if ($element.data('select2') != null) {
      $element.data('select2').destroy();
    }

    this.$element = $element;

    this.id = this._generateId($element);

    options = options || {};

    this.options = new Options(options, $element);

    Select2.__super__.constructor.call(this);

    // Set up containers and adapters

    var DataAdapter = this.options.get('dataAdapter');
    this.data = new DataAdapter($element, this.options);

    var $container = this.render();

    this._placeContainer($container);

    var SelectionAdapter = this.options.get('selectionAdapter');
    this.selection = new SelectionAdapter($element, this.options);
    this.$selection = this.selection.render();

    this.selection.position(this.$selection, $container);

    var DropdownAdapter = this.options.get('dropdownAdapter');
    this.dropdown = new DropdownAdapter($element, this.options);
    this.$dropdown = this.dropdown.render();

    this.dropdown.position(this.$dropdown, $container);

    var ResultsAdapter = this.options.get('resultsAdapter');
    this.results = new ResultsAdapter($element, this.options, this.data);
    this.$results = this.results.render();

    this.results.position(this.$results, this.$dropdown);

    // Bind events

    var self = this;

    // Bind the container to all of the adapters
    this._bindAdapters();

    // Register any DOM event handlers
    this._registerDomEvents();

    // Register any internal event handlers
    this._registerDataEvents();
    this._registerSelectionEvents();
    this._registerDropdownEvents();
    this._registerResultsEvents();
    this._registerEvents();

    // Set the initial state
    this.data.current(function (initialData) {
      self.trigger('selection:update', {
        data: initialData
      });
    });

    // Hide the original select
    $element.hide();

    // Synchronize any monitored attributes
    this._syncAttributes();

    this._tabindex = $element.attr('tabindex') || 0;

    $element.attr('tabindex', '-1');

    $element.data('select2', this);
  };

  Utils.Extend(Select2, Utils.Observable);

  Select2.prototype._generateId = function ($element) {
    var id = '';

    if ($element.attr('id') != null) {
      id = $element.attr('id');
    } else if ($element.attr('name') != null) {
      id = $element.attr('name') + '-' + Utils.generateChars(2);
    } else {
      id = Utils.generateChars(4);
    }

    id = 'select2-' + id;

    return id;
  };

  Select2.prototype._placeContainer = function ($container) {
    $container.insertAfter(this.$element);

    var width = this._resolveWidth(this.$element, this.options.get('width'));

    if (width != null) {
      $container.css('width', width);
    }
  };

  Select2.prototype._resolveWidth = function ($element, method) {
    var WIDTH = /^width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i;

    if (method == 'resolve') {
      var styleWidth = this._resolveWidth($element, 'style');

      if (styleWidth != null) {
        return styleWidth;
      }

      return this._resolveWidth($element, 'element');
    }

    if (method == 'element') {
      var elementWidth = $element.outerWidth(false);

      if (elementWidth <= 0) {
        return 'auto';
      }

      return elementWidth + 'px';
    }

    if (method == 'style') {
      var style = $element.attr('style');

      if (typeof(style) !== 'string') {
        return null;
      }

      var attrs = style.split(';');

      for (i = 0, l = attrs.length; i < l; i = i + 1) {
        attr = attrs[i].replace(/\s/g, '');
        var matches = attr.match(WIDTH);

        if (matches !== null && matches.length >= 1) {
          return matches[1];
        }
      }

      return null;
    }

    return method;
  };

  Select2.prototype._bindAdapters = function () {
    this.data.bind(this, this.$container);
    this.selection.bind(this, this.$container);

    this.dropdown.bind(this, this.$container);
    this.results.bind(this, this.$container);
  };

  Select2.prototype._registerDomEvents = function () {
    var self = this;

    this.$element.on('change.select2', function () {
      self.data.current(function (data) {
        self.trigger('selection:update', {
          data: data
        });
      });
    });

    this._sync = Utils.bind(this._syncAttributes, this);

    if (this.$element[0].attachEvent) {
      this.$element[0].attachEvent('onpropertychange', this._sync);
    }

    var observer = window.MutationObserver ||
      window.WebKitMutationObserver ||
      window.MozMutationObserver
    ;

    if (observer != null) {
      this._observer = new observer(function (mutations) {
        $.each(mutations, self._sync);
      });
      this._observer.observe(this.$element[0], {
        attributes: true,
        subtree: false
      });
    }
  };

  Select2.prototype._registerDataEvents = function () {
    var self = this;

    this.data.on('*', function (name, params) {
      self.trigger(name, params);
    });
  };

  Select2.prototype._registerSelectionEvents = function () {
    var self = this;
    var nonRelayEvents = ['toggle'];

    this.selection.on('toggle', function () {
      self.toggleDropdown();
    });

    this.selection.on('*', function (name, params) {
      if (nonRelayEvents.indexOf(name) !== -1) {
        return;
      }

      self.trigger(name, params);
    });
  };

  Select2.prototype._registerDropdownEvents = function () {
    var self = this;

    this.dropdown.on('*', function (name, params) {
      self.trigger(name, params);
    });
  };

  Select2.prototype._registerResultsEvents = function () {
    var self = this;

    this.results.on('*', function (name, params) {
      self.trigger(name, params);
    });
  };

  Select2.prototype._registerEvents = function () {
    var self = this;

    this.on('open', function () {
      self.$container.addClass('select2-container--open');
    });

    this.on('close', function () {
      self.$container.removeClass('select2-container--open');
    });

    this.on('enable', function () {
      self.$container.removeClass('select2-container--disabled');
    });

    this.on('disable', function () {
      self.$container.addClass('select2-container--disabled');
    });

    this.on('query', function (params) {
      this.data.query(params, function (data) {
        self.trigger('results:all', {
          data: data,
          query: params
        });
      });
    });

    this.on('query:append', function (params) {
      this.data.query(params, function (data) {
        self.trigger('results:append', {
          data: data,
          query: params
        });
      });
    });

    this.on('keypress', function (evt) {
      var key = evt.which;

      if (self.isOpen()) {
        if (key === KEYS.ENTER) {
          self.trigger('results:select');

          evt.preventDefault();
        } else if (key === KEYS.UP) {
          self.trigger('results:previous');

          evt.preventDefault();
        } else if (key === KEYS.DOWN) {
          self.trigger('results:next');

          evt.preventDefault();
        } else if (key === KEYS.ESC || key === KEYS.TAB) {
          self.close();

          evt.preventDefault();
        }
      } else {
        if (key === KEYS.ENTER || key === KEYS.SPACE ||
            ((key === KEYS.DOWN || key === KEYS.UP) && evt.altKey)) {
          self.open();

          evt.preventDefault();
        }
      }
    });
  };

  Select2.prototype._syncAttributes = function () {
    this.options.set('disabled', this.$element.prop('disabled'));

    if (this.options.get('disabled')) {
      if (this.isOpen()) {
        this.close();
      }

      this.trigger('disable');
    } else {
      this.trigger('enable');
    }
  };

  /**
   * Override the trigger method to automatically trigger pre-events when
   * there are events that can be prevented.
   */
  Select2.prototype.trigger = function (name, args) {
    var actualTrigger = Select2.__super__.trigger;
    var preTriggerMap = {
      'open': 'opening',
      'close': 'closing',
      'select': 'selecting',
      'unselect': 'unselecting'
    };

    if (name in preTriggerMap) {
      var preTriggerName = preTriggerMap[name];
      var preTriggerArgs = {
        prevented: false,
        name: name,
        args: args
      };

      actualTrigger.call(this, preTriggerName, preTriggerArgs);

      if (preTriggerArgs.prevented) {
        args.prevented = true;

        return;
      }
    }

    actualTrigger.call(this, name, args);
  };

  Select2.prototype.toggleDropdown = function () {
    if (this.options.get('disabled')) {
      return;
    }

    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  };

  Select2.prototype.open = function () {
    if (this.isOpen()) {
      return;
    }

    this.trigger('query', {});

    this.trigger('open');
  };

  Select2.prototype.close = function () {
    if (!this.isOpen()) {
      return;
    }

    this.trigger('close');
  };

  Select2.prototype.isOpen = function () {
    return this.$container.hasClass('select2-container--open');
  };

  Select2.prototype.enable = function (args) {
    if (console && console.warn) {
      console.warn(
        'Select2: The `select2("enable")` method has been deprecated and will' +
        ' be removed in later Select2 versions. Use $element.prop("disabled")' +
        ' instead.'
      );
    }

    if (args.length === 0) {
      args = [true];
    }

    var disabled = !args[0];

    this.$element.prop('disabled', disabled);
  };

  Select2.prototype.val = function (args) {
    if (console && console.warn) {
      console.warn(
        'Select2: The `select2("val")` method has been deprecated and will be' +
        ' removed in later Select2 versions. Use $element.val() instead.'
      );
    }

    if (args.length === 0) {
      return this.$element.val();
    }

    var newVal = args[0];

    if ($.isArray(newVal)) {
      newVal = $.map(newVal, function (obj) {
        return obj.toString();
      });
    }

    this.$element.val(newVal).trigger('change');
  };

  Select2.prototype.destroy = function () {
    this.$container.remove();

    if (this.$element[0].detachEvent) {
      this.$element[0].detachEvent('onpropertychange', this._sync);
    }

    if (this._observer != null) {
      this._observer.disconnect();
      this._observer = null;
    }

    this._sync = null;

    this.$element.off('.select2');
    this.$element.attr('tabindex', this._tabindex);

    this.$element.show();
    this.$element.removeData('select2');

    this.data.destroy();
    this.selection.destroy();
    this.dropdown.destroy();
    this.results.destroy();

    this.data = null;
    this.selection = null;
    this.dropdown = null;
    this.results = null;
  };

  Select2.prototype.render = function () {
    var $container = $(
      '<span class="select2 select2-container">' +
        '<span class="selection"></span>' +
        '<span class="dropdown-wrapper" aria-hidden="true"></span>' +
      '</span>'
    );

    $container.attr('dir', this.options.get('dir'));

    this.$container = $container;

    this.$container.addClass('select2-container--' + this.options.get('theme'));

    $container.data('element', this.$element);

    return $container;
  };

  return Select2;
});

define('jquery.select2',[
  'jquery',
  './select2/core',
  './select2/defaults'
], function ($, Select2, Defaults) {
  // Force jQuery.mousewheel to be loaded if it hasn't already
  try {
    require('jquery.mousewheel');
  } catch (Exception) { }

  if ($.fn.select2 == null) {
    $.fn.select2 = function (options) {
      options = options || {};

      if (typeof options === 'object') {
        this.each(function () {
          var instanceOptions = $.extend({}, options, true);

          var instance = new Select2($(this), instanceOptions);
        });

        return this;
      } else if (typeof options === 'string') {
        var instance = this.data('select2');
        var args = Array.prototype.slice.call(arguments, 1);

        return instance[options](args);
      } else {
        throw new Error('Invalid arguments for Select2: ' + options);
      }
    };
  }

  if ($.fn.select2.defaults == null) {
    $.fn.select2.defaults = Defaults;
  }

  return Select2;
});

require('jquery.select2'); jQuery.fn.select2.amd = { define: define, require: require }; }());