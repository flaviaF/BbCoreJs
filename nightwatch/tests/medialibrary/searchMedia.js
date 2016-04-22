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
 * Search media
 *
 * @category    NightWatch
 * @subcategory Tests
 * @copyright   Lp digital system
 * @author      flavia.fodor@lp-digital.fr
 */

/*global jQuery*/

// variable used to test if the content reloads
var testRefreshClass = 'testRefreshClass';

var clickSearchButton = function (client, self) {
    'use strict';

    self.searchSection
        .click('@searchBtn');
    client.pause(10000);
};

// set the title on search and click the search button
var setSearchValue = function (client, self, valueToSet) {
    'use strict';

    client
        .waitForElementVisible(self.searchSection.elements.searchInput.selector, 3000)
        .click(self.searchSection.selector + ' ' + self.searchSection.elements.searchInput.selector)
        .setValue(self.searchSection.selector + ' ' + self.searchSection.elements.searchInput.selector, valueToSet)
        .pause(3000)
        .click(self.searchSection.elements.searchBtn.selector)
        .pause(10000);
        //.pause();

};

// clear all the search fields
var emptySearchFields = function (client, self) {
    'use strict';

    client
        .clearValue(self.searchSection.selector + ' ' + self.searchSection.elements.searchInput.selector)
        .clearValue(self.searchSection.selector + ' ' + self.searchSection.elements.createdBeforeInput.selector)
        .clearValue(self.searchSection.selector + ' ' + self.searchSection.elements.createdAfterInput.selector);
};

var numberOfElementsOnGrid = function (client, self) {
    'use strict';

    client
        .pause(3000)
        .elements('css selector', self.mediasSection.elements.mediaElementGrid.selector, function (result) {
            // sum the number of elements in the grid
            self.numberElements = self.numberElements + result.value.length;
        });
};

var childSelectorNumberItems = function (client, self, selector) {
    'use strict';

    client
        .click(self.mediasSection.elements.selectNumberOfMedias.selector)
        .pause(client.globals.loadTime.defaultWait)
        .click(self.mediasSection.elements.selectMediaOption.selector + ':' + selector)
        .pause(5000)
        .keys(['\uE006'])
        .pause(client.globals.loadTime.mediumWait);
};

var calculateNumberOfItems = function (client, self) {
    // document.getElementsByClassName 
    'use strict';

    childSelectorNumberItems(client, self, 'last-child');

    // see if the 'next page arrow' is displayed
    client
        .getCssProperty(self.mediasSection.elements.nextArrow.selector, 'display', function (attrResult) {
            client.pause(3000);
            if (attrResult.value !== 'none') {
                // calculate number of media elements
                numberOfElementsOnGrid(client, self);
                // click on the 'next page arrow'         
                client
                    .pause(7000)
                    .click(self.mediasSection.elements.nextArrow.selector, function (clickRes) {
                        client.pause(3000);
                        if (clickRes.state === 'success') {
                            client.pause(3000);
                            calculateNumberOfItems(client, self);
                        }
                    });
            } else {
                numberOfElementsOnGrid(client, self);
            }
        });
};

//go back to the first page if there exists a left arrow
var goForward = function (client, self) {
    'use strict';

    client
        .element('css selector', self.mediasSection.elements.forwardArrow.selector, function (attrResult) {
            if (attrResult.value !== 'none') {
                // click on the 'forward page arrow'
                client
                    .pause(7000)
                    .click(self.mediasSection.elements.forwardArrow.selector);
            } else {
                goForward(client, self);
            }
        });
    childSelectorNumberItems(client, self, 'first-child');
};

var openMediaLibrary = function (client, self) {
    'use strict';

    client
        .pause(7000)
        .click(self.mediasSection.elements.mediaLibraryButton.selector)
        .pause(9000);
};

var closeMediaLibrary = function (client, self) {
    'use strict';

    client.click(self.searchSection.elements.closeModule.selector);
};

var calculatingPresentMedias = function (client, self) {
    'use strict';

    client
        .elements('css selector', self.mediasSection.selector + ' > ' + self.mediasSection.elements.mediaElementGrid.selector + ' > ' + self.mediasSection.elements.elementTitle.selector, function (result) {

            result.value.forEach(function (element) {
                client
                    .elementIdText(element.ELEMENT, function (res) {
                        if (self.newMedias.indexOf(res.value) >= 0) {
                            self.nbElemSearch = self.nbElemSearch + 1;
                        }
                    })
                    .pause(client.globals.loadTime.mediumWait);
            });
        });
};

var clickDatePicker = function (client, selector, positive) {
    'use strict';

    client
        .execute(
            function (selector, positive) {

                var today = new Date(),
                    otherDay = new Date();

                if (positive) {
                    otherDay.setDate(today.getDate() + 1);
                } else {
                    otherDay.setDate(today.getDate() - 1);
                }
                jQuery(selector + '[data-date="' + otherDay.getDate() + '"][data-month="' + otherDay.getMonth() + '"][data-year="' + otherDay.getFullYear() + '"]').click();
                return true;
            },
            [selector, positive]
        );

};


module.exports = {

   /**
    * Before doing the tests
    * 
    */
    before : function (client) {
        'use strict';

        client.login();

        this.mediaObject = client.page.searchMedia();
        this.searchSection = this.mediaObject.section.searchSection;
        this.mediasSection = this.mediaObject.section.mediasSection;
        this.mediaFolderSection = this.mediaObject.section.mediaFolderSection;
        this.numberElements = 0;
        this.nbNewMedias = 3;
        this.newMedias = [];
        this.nbElemSearch = 0;

        this.totalNumberOfElements = 0;
        openMediaLibrary(client, this);

    },

    'Create new media': function () {
        'use strict';

        var mediaName, i;

        for (i = 0; i < this.nbNewMedias; i += 1) {
            mediaName = 'nightwatch' + Math.random().toString(36).replace(/[0-9]+/g, '').substring(2, 5);
            this.newMedias.push(mediaName);
            this.mediaFolderSection
                .createMedia(mediaName)
                .api.pause(7000);
        }
    },

    'Compute total number of items': function (client) {
        'use strict';

        var self = this;

        client
            .executeAsync(calculateNumberOfItems(client, this),
                [], function () {
                    self.totalNumberOfElements = self.numberElements;
                    closeMediaLibrary(client, self);
                });

        openMediaLibrary(client, this);

    },

    /**
     * Search for a media title with result ---> the corresponding media 
     * (to all or part of the search) are displayed in the area where medias are loaded 
     * 
     */
    'Search for a media title with result': function (client) {
        'use strict';

        var self = this,
            valueToSet = self.newMedias[1];

        emptySearchFields(client, self);
        setSearchValue(client, this, valueToSet);

        client
            .assert.containsText(self.mediasSection.elements.elementTitle.selector, valueToSet);

    },

    /**
     * Search for a media with no fields filled (title + date) --- > Show all media from the media library
     *
     */
    'Search for a media with no fields filled (title + date)': function (client) {
        'use strict';

        var self = this,
            nbElements = this.totalNumberOfElements;

        emptySearchFields(client, self);
        clickSearchButton(client, self);

        self.numberElements = 0;

        client
            .execute(calculateNumberOfItems(client, self),
                [nbElements], function () {
                    this.assert.equal(self.numberElements, self.totalNumberOfElements);
                    goForward(client, self);
                });
    },

    /**
     * Search for a media title with no result ---> no result is displayed , a message appears: " No media found "
     * 
     */
    'Search for a media title with no result' : function (client) {
        'use strict';

        var self = this,
            randName = Math.random().toString(36).replace(/[0-9]+/g, '').substring(2, 5);

        emptySearchFields(client, self);

        setSearchValue(client, self, 'nightwatch' + randName);

        client
            .pause(3000)
            .assert.containsText(self.mediasSection.elements.notFoundMedia.selector, 'No media found');

    },

    /**
     * 
     * Search media with both date fields filled 
     * 
     */
    'Show medias with both date fields filled': function (client) {
        'use strict';

        var self = this,
            selectorFirst = self.searchSection.elements.datePickerElement.selector + ':first ' + self.searchSection.elements.datePickerTable.selector,
            selectorLast = self.searchSection.elements.datePickerElement.selector + ':last ' + self.searchSection.elements.datePickerTable.selector;
        emptySearchFields(client, self);

        clickDatePicker(client, selectorLast, false);

        clickDatePicker(client, selectorFirst, true);

        clickSearchButton(client, self);

        calculatingPresentMedias(client, self);

    },

    /**
     * 
     * Search media with both date fields filled ---> Displays media created in the selected period
     * 
     */
    'Search media with both date fields filled': function (client) {
        'use strict';

        client
            .assert.equal(this.nbElemSearch, this.nbNewMedias);

    },

    /**
     * 
     * Search media with all the filled fields (title + date) ---> Shows the corresponding media
     * 
     */
    'Show media with both date fields filled (title + date)': function (client) {
        'use strict';

        setSearchValue(client, this, this.newMedias[1]);

        this.nbElemSearch = 0;
        calculatingPresentMedias(client, this);

    },

    /**
     * 
     * Search media with all the filled fields (title + date) ---> Shows the corresponding media
     * 
     */
    'Search media with both date fields filled (title + date)': function (client) {
        'use strict';

        client
            .assert.equal(this.nbElemSearch, 1);
    },

    'Show for a media with the field created after filled only': function (client) {
        'use strict';

        var self = this,
            selectorLast = self.searchSection.elements.datePickerElement.selector + ':last ' + self.searchSection.elements.datePickerTable.selector;
        emptySearchFields(client, self);

        clickDatePicker(client, selectorLast, false);
        clickSearchButton(client, self);

        this.nbElemSearch = 0;
        calculatingPresentMedias(client, self);

    },

    /**
     * Search for a media with the field " created after " filled only ---> Displays all media created after the selected date
     *
     */

    'Search for a media with the field created after filled only': function (client) {
        'use strict';

        client
            .assert.equal(this.nbElemSearch, 3);

    },

    /**
     * Search for a media with the field " created before " filled only ---> Displays all media created before the selected date
     * 
     */
    'Show for a media with the field created before filled only': function (client) {
        'use strict';

        var self = this,
            selector = self.searchSection.elements.datePickerElement.selector + ':first ' + self.searchSection.elements.datePickerTable.selector;
        emptySearchFields(client, self);

        clickDatePicker(client, selector, true);

        clickSearchButton(client, self);

        this.nbElemSearch = 0;
        calculatingPresentMedias(client, self);

    },

    /**
     * Search for a media with the field " created before " filled only ---> Displays all media created before the selected date
     * 
     */
    'Search for a media with the field created before filled only': function (client) {
        'use strict';

        client
            .assert.equal(this.nbElemSearch, 3);
    },

    /**
     * Click on the arrow " next result page " --- > Load the second page of results. The number of items displayed corresponds to the selected pagination (10, 20, 50 elements )
     *
     */
    'Click on the arrow next result page': function (client) {
        'use strict';

        var self = this;

        closeMediaLibrary(client, self);
        openMediaLibrary(client, this);

        client
            .pause(9000)
            .waitForElementVisible(self.mediasSection.elements.selectNumberOfMedias.selector, client.globals.loadTime.defaultWait)
            .getValue(self.mediasSection.elements.selectNumberOfMedias.selector + ' option.page', function (result) {
                client
                    .windowSetClassOnElement(self.mediasSection.elements.mediaElements.selector, testRefreshClass)
                    .expect.element(self.mediasSection.elements.mediaElements.selector).to.have.attribute('class').which.contains('data-wrapper '.testRefreshClass);
                client
                    .waitForElementVisible(self.mediasSection.elements.nextArrow.selector, client.globals.loadTime.defaultWait, false)
                    .click(self.mediasSection.elements.nextArrow.selector)
                    .pause(3000)
                    .expect.element(self.mediasSection.elements.mediaElements.selector).not.to.have.attribute('class').which.contains(testRefreshClass);
                client
                    .waitForElementVisible(self.mediasSection.elements.mediaElementGrid.selector, client.globals.loadTime.defaultWait)
                    .elements('css selector', self.mediasSection.elements.mediaElementGrid.selector, function (res) {
                        client
                            .assert.ok(res.value.length <= result.value, 'The number of items displayed corresponds to the selected pagination');
                    });
            });
    },


    /**
     *  Choosing a different number of items to display ---> Reloads the result space of the media library and displays the number of required elements
     * 
     */
    'Choosing a different number of items to display': function (client) {
        'use strict';

        var self = this,
            resultsNumber,
            cssSelector = self.mediasSection.elements.mediaElementGrid.selector;

        client.elements('css selector', self.mediasSection.elements.selectNumberOfMedias.selector + ' option.page', function (result) {
            result.value.forEach(function (element) {
                client.elementIdSelected(element.ELEMENT, function (res) {
                    if (res.value === false) {
                        this
                            .windowSetClassOnElement(self.mediasSection.elements.mediaElements.selector, testRefreshClass)
                            .expect.element(self.mediasSection.elements.mediaElements.selector).to.have.attribute('class').which.contains('data-wrapper '.testRefreshClass);
                    }
                });
                client
                    .click(self.mediasSection.elements.selectNumberOfMedias.selector)
                    .pause(client.globals.loadTime.defaultWait)
                    .elementIdClick(element.ELEMENT)
                    .pause(5000)
                    .keys(['\uE006'])
                    .pause(client.globals.loadTime.mediumWait)
                    .expect.element(self.mediasSection.elements.mediaElements.selector).not.to.have.attribute('class').which.contains(testRefreshClass);
                client
                    .pause(client.globals.loadTime.mediumWait)
                    .elementIdValue(element.ELEMENT, function (result) {
                        resultsNumber = result.value;
                        client.execute(
                            function (cssSelector) {
                                return jQuery(cssSelector).length;
                            },
                            [cssSelector],
                            function (result) {
                                client.assert.ok(result.value <= resultsNumber, 'The number of items displayed corresponds to the selected pagination');
                            }
                        );
                    });
            });
        });
    },

    /**
     * Click the 2 different modes to display medias ---> Change the rendering mode visible on the media page
     * 
     */
    'Click the 2 different modes to display medias': function (client) {
        'use strict';

        var self = this;
        emptySearchFields(client, self);

        client
            .click(self.searchSection.selector + ' ' + self.searchSection.elements.searchBtn.selector)
            .pause(10000)
            .waitForElementPresent(self.mediasSection.elements.mediaElementGrid.selector, client.globals.loadTime.defaultWait)
            .click(self.mediasSection.elements.btnDisplayMediaList.selector)
            .waitForElementPresent(self.mediasSection.elements.mediaElementList.selector, client.globals.loadTime.defaultWait)
            .click(self.mediasSection.elements.btnDisplayMediaGrid.selector)
            .pause(client.globals.loadTime.mediumWait);

    },

    /**
     * Delete created medias
     * 
     */
    'Delete media': function () {
        'use strict';

        var self = this;
        this.newMedias.forEach(function (element) {
            self.mediasSection
                  .deleteMedia(element)
                  .api.pause(7000);
        });

    },

    /**
    * After doing the tests
    * 
    */
    after : function (client) {
        'use strict';

        client.end();
    }
};



