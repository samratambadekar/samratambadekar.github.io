/**
 *
 * This file is auto-generated. Do not modify.
 *
 * olive.js
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