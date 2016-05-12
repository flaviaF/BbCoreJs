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
 * New page object
 *
 * @category    NightWatch
 * @subcategory PageObjects
 * @copyright   Lp digital system
 * @author      flavia.fodor@lp-digital.fr
 */

/*global jQuery*/
var commands = {

    openPopin: function () {
        'use strict';

        this
            .waitForElementVisible('@newPageBtn', this.api.globals.loadTime.longWait)
            .click('@newPageBtn')
            .api.pause(this.api.globals.loadTime.longWait);

        return this;
    },

    closePopin: function () {
        'use strict';

        this
            .click(this.elements.formCreatePage.selector + ' ' + this.elements.closePage.selector)
            .api.pause(this.api.globals.loadTime.mediumWait);
        return this;
    },

    chooseTarget: function (selector, option) {
        'use strict';

        this.api
            .moveToElement(selector, 0, 0)
            .click(selector)
            .click(selector + ' option[value="' + option + '"]')
            .pause(this.api.globals.loadTime.mediumWait)
            .keys(['\uE006'])
            .pause(this.api.globals.loadTime.mediumWait);

        return this;
    },

    fillForm: function (pageName, layoutSelector, targetSelector, selectPage) {
        'use strict';

        var self = this,
            selector = '';
        this
            .openPopin()
            .waitForElementVisible('@formCreatePage', this.api.globals.loadTime.mediumWait)
            .waitForElementVisible('@titleElement', this.api.globals.loadTime.mediumWait)
            .setValue(this.elements.titleElement.selector + ' ' + this.elements.titleField.selector, pageName)
            .chooseTarget(this.elements.targetElement.selector + ' ' + this.elements.select.selector, targetSelector)
            .chooseTarget(this.elements.layoutElement.selector + ' ' + this.elements.select.selector, layoutSelector)
            .api.pause(this.api.globals.loadTime.mediumWait);

        if (selectPage !== null) {
            this.api
                // click on "select" button
                .click(this.elements.moveToElement.selector + ' ' + this.elements.selectBtn.selector)
                .pause(this.api.globals.loadTime.mediumWait)
                // tree popin is opened
                .assert.visible(this.elements.popinDiv.selector)
                .pause(this.api.globals.loadTime.mediumWait)
                .element('css selector', this.elements.popinDiv.selector, function (result) {
                    self.api
                        .elementIdAttribute(result.value.ELEMENT, 'id', function (res) {
                            selector = 'div#' + res.value + ' ';
                            if (res.value !== null && res.value.indexOf(self.elements.selectTreePopin.selector) > -1) {
                                self
                                    .searchPage(selector, selectPage)
                                    .api.moveTo(selector + self.elements.searchPageUl.selector + ' ' + self.elements.searchPageSpan.selector, 0, 0)
                                    .click(selector + self.elements.searchPageUl.selector + ' ' + self.elements.searchPageSpan.selector)
                                    .doubleClick();
                            }
                        })
                        .pause(2000);
                });
        }

        return this;
    },

    searchPage: function (selectorClass, pageName) {
        'use strict';

        var self = this;
        this.api
            .assert.visible(selectorClass)
            .setValue(selectorClass + ' ' + this.elements.searchInTree.selector, pageName)
            .pause(this.api.globals.loadTime.mediumWait)
            .click(selectorClass + ' ' + this.elements.searchTreeBtn.selector)
            .pause(this.api.globals.loadTime.longWait)
            //check if this.pageName1 is found 
            .getText(selectorClass + ' ' + this.elements.searchPageUl.selector + ' ' + this.elements.searchPageSpan.selector, function (result) {
                self.api
                    .assert.ok(result.value === pageName, 'Searched page is found');
            });

        return this;
    },

    browseToPage: function (pageName) {
        'use strict';

        this.api
            .pause(this.api.globals.loadTime.longWait)
            .click(this.elements.pageTreePopin.selector)
            .pause(this.api.globals.loadTime.mediumWait);
        this
            .searchPage(this.elements.pageTree.selector, pageName)
            .api.moveTo(this.elements.pageTree.selector + ' ' + this.elements.searchPageUl.selector + ' ' + this.elements.searchPageSpan.selector, 0, 0)
            .click(this.elements.pageTree.selector + ' ' + this.elements.searchPageUl.selector + ' ' + this.elements.searchPageSpan.selector)
            .pause(this.api.globals.loadTime.defaultWait)
            .mouseButtonClick('right')
            .pause(this.api.globals.loadTime.defaultWait)
            .click(this.elements.browseToButton.selector);
        return this;
    },

    putPageInMenuAndOnline: function () {
        'use strict';

        var selector = this.elements.pageContribution.selector + ' ' + this.elements.availableInMenu.selector;
        this
            .waitForElementVisible('@tabPage', this.api.globals.loadTime.longWait)
            .click('@tabPage')
            .waitForElementVisible('@pageContribution', this.api.globals.loadTime.longWait)
            .api.pause(this.api.globals.loadTime.longWait)
            //put the page in menu
            .execute(function (selector) {
                jQuery(selector).click();
                return true;
            }, [selector]);
         //put the page online
        this
            .chooseTarget(this.elements.pageStatus.selector, 1)
            // click yes in the validation dialog
            .api.pause(this.api.globals.loadTime.mediumWait)
            .click(this.elements.pageContribution.selector + ' ' + this.elements.saveStatus.selector)
            .pause(this.api.globals.loadTime.longWait)
            .click(this.elements.dialog.selector + ' ' + this.elements.validateBtn.selector);
    }
};

module.exports = {
    commands: [commands],
    elements: {
        newPageBtn: {
            selector: 'button#new-page'
        },
        formCreatePage: {
            selector: 'div.create-new-page-popin'
        },
        navBarBrand: {
            selector: 'span.navbar-brand img'
        },
        select: {
            selector: 'span.select.select-block select'
        },
        closePage: {
            selector: 'button.ui-button-icon-only.ui-dialog-titlebar-close'
        },
        overlayPage: {
            selector: 'div.ui-widget-overlay.ui-front'
        },
        saveCreatePage: {
            selector: 'div#bb-new-page button.bb-submit-form'
        },
        titleField: {
            selector: 'input[name="title"]'
        },
        layoutField: {
            selector: 'select[name="layout_uid"]'
        },
        titleElement: {
            selector: 'div.element_title'
        },
        layoutElement: {
            selector: 'div.element_layout_uid'
        },
        targetElement: {
            selector: 'div.element_target'
        },
        moveToElement: {
            selector: 'div.element_move_to'
        },
        selectBtn: {
            selector: 'button.btn-sm.add_node'
        },
        errorMsg: {
            selector: 'span.form_error.help-block'
        },
        tabPage: {
            selector: 'ul#edit-tab li#edit-tab-page a'
        },
        deletePageBtn: {
            selector: 'button#contribution-delete-page'
        },
        formDeletePage: {
            selector: 'div.delete-page-popin'
        },
        formDeletePageBtn: {
            selector: 'button.bb-delete-page-validate'
        },
        selectPageTree: {
            selector: 'div.site-selector'
        },
        searchInTree: {
            selector: 'input.input-xs.searchWord'
        },
        searchTreeBtn: {
            selector: 'button.searchButton'
        },
        selectTreePopin: {
            selector: 'popin_form'
        },
        popinDiv: {
            selector: 'div#bb5-dialog-container div[id^="popin_form"]'
        },
        searchPageUl: {
            selector: 'ul.jqtree_common.jqtree-tree li.jqtree_common'
        },
        searchPageSpan: {
            selector: 'span.jqtree-title.jqtree_common'
        },
        searchPageA: {
            selector: 'a.jqtree_common.jqtree-toggler'
        },
        pageChildUl: {
            selector: 'ul.jqtree_common li.jqtree_common'
        },
        pageChildSpan: {
            selector: 'span.jqtree-title.jqtree_common'
           //div.bb5-treeview ul.jqtree_common.jqtree-tree li.jqtree_common.jqtree-folder  div.jqtree-element.jqtree_common span.jqtree-title.jqtree_common
        },
        pageTreePopin: {
            selector: 'button#bundle-toolbar-tree'
        },
        pageTree: {
            selector: 'div#bb-page-tree'
        },
        browseToButton: {
            selector: 'button.bb5-context-menu-flyto'
        },
        pageContribution: {
            selector: 'div#page-contrib-tab div.row'
        },
        availableInMenu: {
            selector: 'div.col-bb5-52.col-bb5-pad-x2 input#page-visibility-input'
        },
        saveStatus: {
            selector: 'button.bundle-toolbar-global-validate'
        },
        dialog: {
            selector: 'div#bb5-dialog-container div'
        },
        validateBtn: {
            selector: 'div.ui-dialog-buttonset button.ui-button.ui-widget'
        },
        pageStatus: {
            selector: 'select#page-state-select'
        },
        mainMenu: {
            selector: 'li.nav-selected a'
        },
        closePopinButton: {
            selector: '[aria-describedby="bb-page-tree"] > div.ui-draggable-handle button.ui-dialog-titlebar-close'
        },
        deleteLocationSelector: {
            selector: 'ul.nodeselector_list.list-unstyled li button.fa-trash.trash'
        }
    }
};