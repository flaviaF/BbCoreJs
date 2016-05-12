/*
 * Copyright (c) 2011-2016 Lp digital system
 *
 * This file is part of BackBee.
 *
 * BackBee is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * BackBee is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with BackBee. If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Tests for creating a new page
 *
 * @category    NightWatch
 * @subcategory Tests
 * @copyright   Lp digital system
 * @author      flavia.fodor@lp-digital.fr
 */

var testClass = 'testClass';

var deletePage = function (client, self, pageName) {
    'use strict';

    self
        .newPageObject
        .browseToPage(pageName)
        .api.pause(client.globals.loadTime.longWait)
        .deleteCurrentPage()
        .pause(client.globals.loadTime.longWait);
};

module.exports = {
    /**
     * Login in BackBee
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    before : function (client) {
        'use strict';

        // login in BackBee
        client.login();

        // instantiate the necessary page objects
        this.newPageObject = client.page.newPage();
        this.pageTreeObject = client.page.tree();

        this.pageName1 = client.globals.pageTree.createNewPage + Math.random().toString(36).replace(/[0-9]+/g, '').substring(2, 5);
        this.pageName2 = client.globals.pageTree.createNewPage + Math.random().toString(36).replace(/[0-9]+/g, '').substring(2, 5);
        this.pageTarget = client.globals.pageTree.createNewPage + Math.random().toString(36).replace(/[0-9]+/g, '').substring(2, 5);
        this.layouts = [];
        this.target = ['_self', '_blank'];

        client.pause(client.globals.loadTime.longWait);

    },

    /**
     * Click on " New Page" ---> Displays the " Create a page" form
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Click on new page' : function (client) {
        'use strict';

        this.newPageObject
            .openPopin()
            .waitForElementVisible('@formCreatePage', client.globals.loadTime.longWait)
            .api.pause(client.globals.loadTime.longWait);
        client.pause(client.globals.loadTime.longWait);
    },

    /**
     * Re click " New Page" ---> Nothing happens focus on the already open form
     *
     * @param {Object} client
     * @returns {undefined}
     */
    'Click again on new page' : function (client) {
        'use strict';

        this.newPageObject
            .waitForElementVisible('@formCreatePage', client.globals.loadTime.longWait)
            .windowSetClassOnElement('@formCreatePage', testClass)
            .expect.element('@formCreatePage').to.have.attribute('class').which.contains(testClass);
        this.newPageObject
            .openPopin();

        client
            .pause(5000);
        // the old opened form remains
        this.newPageObject
            .expect.element('@formCreatePage').to.have.attribute('class').which.contains(testClass);

    },

    /**
     * Click somewhere else on page with the " New page" form open ---> Nothing happens focus on the already open form
     * 
     * @returns {undefined}
     */
    'Click somewhere else on page with the new page form open' : function () {
        'use strict';

        this.newPageObject
            .click('@navBarBrand')
            .assert.visible('@formCreatePage');

    },

    /**
     *  Validate "New page" form without giving a title and selecting a layout ---> error message "give title" "select a layout"
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Validate new page form without giving a title and selecting a layout' : function (client) {
        'use strict';

        this.newPageObject
            .waitForElementVisible('@formCreatePage', client.globals.loadTime.mediumWait)
            .click('@saveCreatePage')
            .api.pause(2000);

        client
            .assert.visible(this.newPageObject.elements.titleElement.selector + ' ' + this.newPageObject.elements.errorMsg.selector)
            .assert.visible(this.newPageObject.elements.layoutElement.selector + ' ' + this.newPageObject.elements.errorMsg.selector);

        client
            .assert.cssClassNotPresent(this.newPageObject.elements.titleElement.selector + ' ' + this.newPageObject.elements.errorMsg.selector, 'hidden');
        client
            .assert.cssClassNotPresent(this.newPageObject.elements.layoutElement.selector + ' ' + this.newPageObject.elements.errorMsg.selector, 'hidden');

    },

    /**
     *  Close popin without filling the form ----> popin is closed, user is on the toolbar edition section again
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Close popin without filling the form' : function (client) {
        'use strict';

        client
            // see if the overlay is present
            .pause(client.globals.loadTime.mediumWait)
            .waitForElementVisible(this.newPageObject.elements.overlayPage.selector, client.globals.loadTime.mediumWait)
            .pause(client.globals.loadTime.mediumWait)
            .click(this.newPageObject.elements.formCreatePage.selector + ' ' + this.newPageObject.elements.closePage.selector)
            .pause(client.globals.loadTime.mediumWait)
            // check if the form closed
            .getCssProperty(this.newPageObject.elements.formCreatePage.selector, 'display', function (attrResult) {
                client.assert.ok(attrResult.value === 'none', 'Check if the form was closed');
            })
            // see if the overlay dissapeared
            .assert.elementNotPresent(this.newPageObject.elements.overlayPage.selector);

    },

    'Get layouts selectors' : function (client) {
        'use strict';

        var self = this;

        this.newPageObject
            .openPopin()
            .waitForElementVisible('@formCreatePage', client.globals.loadTime.mediumWait);

        client.elements('css selector', this.newPageObject.elements.layoutElement.selector + ' ' + this.newPageObject.elements.select.selector + ' option', function (result) {
            result.value.forEach(function (element) {
                client
                    .pause(2000)
                    .elementIdValue(element.ELEMENT, function (elText) {
                        if (elText.value !== '') {
                            self.layouts.push(elText.value);
                        }
                    });
            });
        });
    },

    /**
     *  Click on drop down for target selection ---> choice between self and blank
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Click on drop down for target selection' : function (client) {
        'use strict';

        this.newPageObject
            .openPopin()
            .waitForElementVisible('@formCreatePage', client.globals.loadTime.mediumWait);

        var self = this;
        client.elements('css selector', this.newPageObject.elements.targetElement.selector + ' ' + this.newPageObject.elements.select.selector + ' option', function (result) {
            result.value.forEach(function (element) {
                client
                    .pause(2000)
                    .elementIdValue(element.ELEMENT, function (elText) {
                        client
                            .assert.ok(self.target.indexOf(elText.value) >= 0, elText.value + ' is one of the choices');
                    });
            });
        });
    },

     /**
      * Close popin without fiiling all the form -----> popin is closed, if user reopen, filled feilds are still available
      * 
      * @param {type} client
      * @returns {undefined}
      */
    'Close popin and reopen, fields are still available' : function (client) {
        'use strict';

        var self = this;
        this.newPageObject
            .fillForm(this.pageName1, this.layouts[this.layouts.length - 1], this.target[1], null)
            .api.pause(client.globals.loadTime.longWait)
            .click(this.newPageObject.elements.formCreatePage.selector + ' ' + this.newPageObject.elements.closePage.selector)
            .pause(client.globals.loadTime.mediumWait);

        this.newPageObject
            .getValue(this.newPageObject.elements.titleElement.selector + ' ' + this.newPageObject.elements.titleField.selector, function (result) {
                client
                    .assert.equal(result.value, self.pageName1);
            })
            .getValue(this.newPageObject.elements.layoutElement.selector + ' ' + this.newPageObject.elements.select.selector, function (result) {
                client
                    .assert.equal(result.value, self.layouts[self.layouts.length - 1]);
            })
            .getValue(this.newPageObject.elements.targetElement.selector + ' ' + this.newPageObject.elements.select.selector, function (result) {
                client
                    .assert.equal(result.value, self.target[1]);
            });

    },

    /**
     *  Form validation "New page" form filling all fields correctly ---> the popin disappears, page is created, is loaded and is displayed to user
     *  
     * @param {Object} client
     * @returns {undefined}
     */
    'New page form validation, filling all fields correctly' : function (client) {
        'use strict';

        //set a new class to the page body
        client
            .windowSetClassOnElement('', testClass);

        this.newPageObject
            .openPopin()
            .click('@saveCreatePage')
            .api.pause(client.globals.loadTime.longWait)
            .expect.element('body').not.to.have.attribute('class').which.contains(testClass);

        client
            .assert.urlContains(this.pageName1.replace(/ /g, '-'))
            .pause(client.globals.loadTime.longWait);

    },

    /**
     * Click on "Select" to choose the location of the page on the site ---> tree popin is opened next to the new page form
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Tree popin is opened next to the new page form' : function (client) {
        'use strict';

        this.newPageObject
            .fillForm(this.pageName2, this.layouts[this.layouts.length - 1], this.target[0], this.pageName1)
            .click('@saveCreatePage')
            .api.pause(client.globals.loadTime.longWait);

    },

    'Create page target' : function (client) {
        'use strict';

        client
            .click(this.newPageObject.elements.pageTreePopin.selector)
            .pause(client.globals.loadTime.mediumWait)
            .waitForElementVisible(this.pageTreeObject.elements.firstChildNode.selector, client.globals.loadTime.mediumWait)
            .moveToElement(this.pageTreeObject.elements.firstChildNode.selector, 0, 0)
            .doubleClick()
            .pause(client.globals.loadTime.mediumWait);
        this.newPageObject
            .openPopin()
            .fillForm(this.pageTarget, this.layouts[this.layouts.length - 1], this.target[0], null)
            .click('@saveCreatePage')
            .api.pause(client.globals.loadTime.longWait);
    },

    /**
     * Click on a page in tree to place the page ---> page is created in the selected location in tree
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Check if page is created in the selected location in tree' : function (client) {
        'use strict';

        var self = this;

        client
            .click(this.newPageObject.elements.pageTreePopin.selector)
            .pause(client.globals.loadTime.mediumWait);
        this.newPageObject
            .searchPage(this.newPageObject.elements.pageTree.selector, this.pageName1)
            .api.click(this.newPageObject.elements.pageTree.selector + ' ' + this.newPageObject.elements.searchPageUl.selector + ' ' + this.newPageObject.elements.searchPageA.selector)
            .pause(client.globals.loadTime.defaultWait)
            .getText(this.newPageObject.elements.pageTree.selector + ' ' + this.newPageObject.elements.searchPageUl.selector + ' ' + this.newPageObject.elements.pageChildUl.selector + ' ' + this.newPageObject.elements.pageChildSpan.selector, function (result) {
                client
                    .assert.ok(result.value === self.pageName2, 'Page was created in the selected location in tree');
            });
        client.pause(client.globals.loadTime.longWait);
    },

    /**
     *  Put page online and add it to the menu
     *  
     * @param {Object} client
     * @returns {undefined}
     */
    'Put page online and add it to the menu' : function (client) {
        'use strict';

        this.newPageObject
            .putPageInMenuAndOnline();

        this.newPageObject
            .browseToPage(this.pageName1)
            .api.pause(client.globals.loadTime.longWait);
        this.newPageObject
            .click('@closePopinButton')
            .api.pause(client.globals.loadTime.longWait);
        this.newPageObject
            .putPageInMenuAndOnline();

    },

    /**
     *  Choose blank as target ----> page gets opened in another tab
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Check if page opens in another tab' : function (client) {
        'use strict';

        var page1 = this.pageName1.replace(/ /g, '-');
        client
            .pause(client.globals.loadTime.longWait)
            .click('a[href*="' + page1 + '"]')
            .pause(client.globals.loadTime.longWait)
            .windowHandles(function (windows) {
                client.assert.equal(windows.value.length, 2, 'There should be two windows open.');
                var windowHandle = windows.value[1];
                client
                    .switchWindow(windowHandle)
                    .assert.urlContains(page1)
                    .pause(client.globals.loadTime.defaultWait)
                    .closeWindow(windowHandle);
            });

        client
            .windowHandles(function (result) {
                client.assert.equal(result.value.length, 1, 'There should be only one window open.');
                client.switchWindow(result.value[0]);
            });
    },

    /**
     *  Choose self as target ----> page gets opened in the same tab
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Check if page opens in the same tab' : function (client) {
        'use strict';

        var pageTarget = this.pageTarget.replace(/ /g, '-');
        client
            .pause(client.globals.loadTime.longWait)
            .click('a[href*="' + pageTarget + '"]')
            .pause(client.globals.loadTime.longWait)
            .windowHandles(function (result) {
                client.assert.equal(result.value.length, 1, 'There should be only one window open.');
                var windowHandle = result.value;
                client
                    .switchWindow(windowHandle)
                    .assert.urlContains(pageTarget);
            });
    },

    /**
     * Move, close and reopen the form " New Page" form ---> The form opens in the middle always
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Move, close and reopen the New Page form' : function (client) {
        'use strict';

        var self = this;
        client
            .pause(client.globals.loadTime.mediumWait);
        this.newPageObject
            .openPopin();

        client
            .pause(client.globals.loadTime.mediumWait)
            .waitForElementVisible(self.newPageObject.elements.formCreatePage.selector, client.globals.loadTime.mediumWait)
            .moveToElement('.create-new-page-popin.ui-draggable', 10, 10)
            .mouseButtonDown(0)
            .pause(client.globals.loadTime.defaultWait)
            .moveToElement('body', 200, 300)
            .pause(client.globals.loadTime.longWait)
            .mouseButtonUp(0);

        this.newPageObject
            .getLocation('@formCreatePage', function (result) {
                self.newPageObject
                    .closePopin()
                    .openPopin()
                    .getLocation('@formCreatePage', function (res) {
                        client.assert.equal(res.value.x, result.value.x);
                        client.assert.equal(res.value.y, result.value.y);
                    });
            });
        this.newPageObject
            .closePopin();
        client
            .click(self.newPageObject.elements.closePage.selector)
            .pause(client.globals.loadTime.mediumWait);

    },

    /**
     *  Delete current page
     *  
     * @param {Object} client
     * @returns {undefined}
     */
    'Delete pages created' : function (client) {
        'use strict';

        deletePage(client, this, this.pageName2);
        deletePage(client, this, this.pageName1);
        deletePage(client, this, this.pageTarget);
    },

   /**
     * After all tests are ran end the client
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    after : function (client) {
        'use strict';

        client
            .end();
    }
};