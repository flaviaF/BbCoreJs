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
 * Tests
 *
 * @category    NightWatch
 * @subcategory Tests
 * @copyright   Lp digital system
 * @author      flavia.fodor@lp-digital.fr
 */

var testClass = 'testClass';
///*global jQuery*/

var deleteUser = function (client, self, login) {
    'use strict';

    var deleteNotif = self.userObject.elements.deleteNotif.selector;
    client
        .pause(client.globals.loadTime.defaultWait)
        .click(self.userObject.elements.listUsers.selector + ' ' + self.userObject.elements.openDrpDownUser.selector)
        .pause(client.globals.loadTime.defaultWait)
        .click(self.userObject.elements.listUsers.selector + ' ' + self.userObject.elements.userDropDownData.selector + ' ' + self.userObject.elements.deleteBtn.selector)
        .pause(client.globals.loadTime.defaultWait)
        .click(self.userObject.elements.deletePopin.selector + ' ' + self.userObject.elements.validateBtn.selector)
        .waitForElementPresent(self.userObject.elements.boxWrapper.selector + self.userObject.elements.notifSuccess.selector, client.globals.loadTime.longWait, function (res) {
            client
                .elementIdText(res.value[0].ELEMENT, function (result) {
                    client
                        .assert.equal(result.value, deleteNotif.replace('%s', login));
                });
        });
};

var checkStatus = function (client, self, status) {
    'use strict';

    client
        .waitForElementPresent(self.userObject.elements.listUsers.selector + ':last-child ' + self.userObject.elements.openDrpDownUser.selector, client.globals.loadTime.longWait)
        .click(self.userObject.elements.listUsers.selector + ':last-child ' + self.userObject.elements.openDrpDownUser.selector)
        .pause(client.globals.loadTime.mediumWait)
        .getText(self.userObject.elements.listUsers.selector + ':last-child ' + self.userObject.elements.userDropDownData.selector + ' ' + self.userObject.elements.userStatus.selector, function (result) {
            client
                .assert.equal(result.value, status);
        });
};

var checkNotif = function (client, self, firstName, lastName, status) {
    'use strict';

    client
        .waitForElementPresent(self.userObject.elements.boxWrapper.selector + self.userObject.elements.notifSuccess.selector, client.globals.loadTime.longWait, function (res) {
            client
                 .elementIdText(res.value[0].ELEMENT, function (result) {
                    client
                        .assert.equal(result.value, self.userObject.elements.userSavedNotif.selector);
                });
        })
        .waitForElementPresent(self.userObject.elements.boxWrapper.selector + self.userObject.elements.notifWarning.selector, client.globals.loadTime.longWait, function (res) {
            client
                 .elementIdText(res.value[0].ELEMENT, function (result) {
                    client
                        .assert.equal(result.value, self.userObject.elements.dragAndDropNotif.selector);
                });
        })
        .pause(client.globals.loadTime.longWait)
        .getText(self.userObject.elements.listUsers.selector + ':last-child ' + self.userObject.elements.fristnameListUsers.selector, function (result) {
            client
                .assert.equal(result.value, firstName);

        })
        .getText(self.userObject.elements.listUsers.selector + ':last-child ' + self.userObject.elements.lastnameListUsers.selector, function (result) {
            client
                .assert.equal(result.value, lastName);
        })
        .pause(client.globals.loadTime.longWait);
    checkStatus(client, self, status);
};

var checkListOfUsers = function (client, self, firstName, lastName) {
    'use strict';

    client
        .elements('css selector', self.userObject.elements.listUsers.selector, function (result) {
            client
                // check if there is only one value
                .assert.equal(result.value.length, 1);
            client
                .elementIdText(result.value[0].ELEMENT, function (res) {
                    client
                        .assert.equal(lastName + '\n' + firstName, res.value);
                });
        });
};

var checkNotFound = function (client, self) {
    'use strict';

    client
        .elements('css selector', self.userObject.elements.listUlUsers.selector, function (result) {

            client
                .elementIdText(result.value[0].ELEMENT, function (res) {
                    client
                        .assert.equal('No user found', res.value);
                });
        });
};

var checkListWithStatus = function (client, self, firstName, lastName) {
    'use strict';

    var userAppears = 0;
    client
        .elements('css selector', self.userObject.elements.listUsers.selector, function (result) {
            result.value.forEach(function (element) {
                client
                    .elementIdText(element.ELEMENT, function (res) {
                        if (res.value === lastName + '\n' + firstName) {
                            userAppears = 1;
                            client
                                .assert.equal(userAppears, 1);
                        }
                    });
            });
        });
};

var searchNotFound = function (client, self, searchField) {
    'use strict';

    var randomName = 'nightwatch random ' + Math.random().toString(36).replace(/[0-9]+/g, '').substring(2, 5);
    client
        .pause(client.globals.loadTime.mediumWait);
    self.userObject
        .click('@resetBtn')
        .setValue(searchField, randomName)
        // set status
        .api.pause(client.globals.loadTime.defaultWait)
        .click(self.userObject.elements.searchBtn.selector)
        .pause(client.globals.loadTime.mediumWait);

    checkNotFound(client, self);
};

var searchByName = function (client, self, firstname, lastname, login) {
        'use strict';

        client
            .pause(client.globals.loadTime.mediumWait);
        self.userObject
            .click('@resetBtn')
            .setValue('@nameSearch', firstname)
            .click('@searchBtn')
            .api.pause(client.globals.loadTime.mediumWait);
        checkListOfUsers(client, self, firstname, lastname);
        deleteUser(client, self, login);
    };

module.exports = {

   /**
    * Before doing the tests, login into the backend
    * 
    */
    before : function (client) {
        'use strict';

        client.login();

        this.userObject = client.page.user();
        this.email = 'nightwatch_email_' + Math.random().toString(36).replace(/[0-9]+/g, '').substring(2, 5) + '@yahoo.com';
        this.firstName = 'nightwatch firstname ' + Math.random().toString(36).replace(/[0-9]+/g, '').substring(2, 5);
        this.lastName = 'nightwatch lastname ' + Math.random().toString(36).replace(/[0-9]+/g, '').substring(2, 5);
        this.login = 'nightwatch_login_' + Math.random().toString(36).replace(/[0-9]+/g, '').substring(2, 5);
        this.email1 = 'nightwatch_email_' + Math.random().toString(36).replace(/[0-9]+/g, '').substring(2, 5) + '@yahoo.com';
        this.firstName1 = 'nightwatch firstname' + Math.random().toString(36).replace(/[0-9]+/g, '').substring(2, 5);
        this.lastName1 = 'nightwatch lastname' + Math.random().toString(36).replace(/[0-9]+/g, '').substring(2, 5);
        this.login1 = 'nightwatch login' + Math.random().toString(36).replace(/[0-9]+/g, '').substring(2, 5);

    },
    /**
     * Select the "user management" section ---> Loading the User Management section in the toolbar, 
     * orange state selected in the menu level 1
     * 
     */
    'Select the user management section': function (client) {
        'use strict';

        client
            .pause(client.globals.loadTime.longWait)
            .waitForElementPresent(this.userObject.elements.toolbar.selector + ' ' + this.userObject.elements.userManagement.selector, client.globals.loadTime.defaultWait)
            .moveToElement(this.userObject.elements.toolbar.selector + ' ' + this.userObject.elements.userManagement.selector, 0, 0)
            .mouseButtonClick(0)
            .pause(client.globals.loadTime.mediumWait)
            .waitForElementPresent(this.userObject.elements.userToolbar.selector, client.globals.loadTime.defaultWait)
            .waitForElementPresent(this.userObject.elements.activeTab.selector + ' ' + this.userObject.elements.userManagement.selector, client.globals.loadTime.defaultWait);

    },
    /**
     * Click on "Create user" ---> Display popin " Create User " fields with name, email , login, checkboxes, buttons save
     * 
     */
    'Click on create user form': function (client) {
        'use strict';

        client
            .pause(client.globals.loadTime.mediumWait)
            .click(this.userObject.elements.createUser.selector)
            .waitForElementPresent(this.userObject.elements.createUserForm.selector, client.globals.loadTime.longWait)
            .waitForElementPresent(this.userObject.elements.createUserForm.selector + ' ' + this.userObject.elements.firstName.selector, client.globals.loadTime.longWait)
            .waitForElementPresent(this.userObject.elements.createUserForm.selector + ' ' + this.userObject.elements.lastName.selector, client.globals.loadTime.longWait)
            .waitForElementPresent(this.userObject.elements.createUserForm.selector + ' ' + this.userObject.elements.email.selector, client.globals.loadTime.longWait)
            .waitForElementPresent(this.userObject.elements.createUserForm.selector + ' ' + this.userObject.elements.login.selector, client.globals.loadTime.longWait)
            .waitForElementPresent(this.userObject.elements.createUserForm.selector + ' ' + this.userObject.elements.saveBtn.selector, client.globals.loadTime.longWait);

    },
    /**
     * Re Click on "Create user" ---> Nothing happens
     * 
     */
    'Reclick on create user form': function (client) {
        'use strict';

        client
            .waitForElementVisible(this.userObject.elements.createUser.selector, client.globals.loadTime.longWait)
            .windowSetClassOnElement(this.userObject.elements.createUser.selector, testClass)
            .expect.element(this.userObject.elements.createUser.selector).to.have.attribute('class').which.contains(testClass);
        client
            .pause(client.globals.loadTime.defaultWait)
            .click(this.userObject.elements.createUser.selector)
            .pause(client.globals.loadTime.defaultWait)
            .expect.element(this.userObject.elements.createUser.selector).to.have.attribute('class').which.contains(testClass);
    },
    /**
     * Validation of a new user creation form with all the missing fields ---> Error message required Email Login compulsory , mandatory name, first name mandatory
     * 
     */
    'Validation of a new user creation form with all the missing fields': function (client) {
        'use strict';

        client
            .click(this.userObject.elements.createUserForm.selector + ' ' + this.userObject.elements.saveBtn.selector)
            .waitForElementVisible(this.userObject.elements.createUser.selector, client.globals.loadTime.longWait)
            .assert.visible(this.userObject.elements.elementFirstName.selector + ' ' + this.userObject.elements.errorMsg.selector)
            .assert.visible(this.userObject.elements.elementLastName.selector + ' ' + this.userObject.elements.errorMsg.selector)
            .assert.visible(this.userObject.elements.elementEmail.selector + ' ' + this.userObject.elements.errorMsg.selector)
            .assert.visible(this.userObject.elements.elementLogin.selector + ' ' + this.userObject.elements.errorMsg.selector);

        client
            .assert.cssClassNotPresent(this.userObject.elements.elementFirstName.selector + ' ' + this.userObject.elements.errorMsg.selector, 'hidden');
        client
            .assert.cssClassNotPresent(this.userObject.elements.elementLastName.selector + ' ' + this.userObject.elements.errorMsg.selector, 'hidden');
        client
            .assert.cssClassNotPresent(this.userObject.elements.elementEmail.selector + ' ' + this.userObject.elements.errorMsg.selector, 'hidden');
        client
            .assert.cssClassNotPresent(this.userObject.elements.elementLogin.selector + ' ' + this.userObject.elements.errorMsg.selector, 'hidden');

    },
    /**
     * Validation of a new user creation form with wrong email format ---> Error Message Invalid email
     * 
     */
    'Validation of a new user creation form with wrong email format': function (client) {
        'use strict';

        var email = 'nightwatch email ' + Math.random().toString(36).replace(/[0-9]+/g, '').substring(2, 5);

        client
            .setValue(this.userObject.elements.createUserForm.selector + ' ' + this.userObject.elements.elementEmail.selector + ' ' + this.userObject.elements.email.selector, email)
            .pause(client.globals.loadTime.defaultWait)
            .click(this.userObject.elements.createUserForm.selector + ' ' + this.userObject.elements.saveBtn.selector)
            .pause(client.globals.loadTime.longWait)
            .assert.visible(this.userObject.elements.elementEmail.selector + ' ' + this.userObject.elements.errorMsg.selector);
        client
            .assert.cssClassNotPresent(this.userObject.elements.elementEmail.selector + ' ' + this.userObject.elements.errorMsg.selector, 'hidden');

        client
            .getText(this.userObject.elements.elementEmail.selector + ' ' + this.userObject.elements.errorMsg.selector, function (result) {
                client
                    .assert.equal(result.value, 'email is invalid');
            });

    },
    /**
     * Closing the popin without creating the user ---> Back to the "User Management section
     * 
     */
    'Closing the popin without creating the user': function (client) {
        'use strict';

        client
            .click(this.userObject.elements.createUserForm.selector + ' ' + this.userObject.elements.closePopin.selector)
            .pause(client.globals.loadTime.mediumWait)
            .getCssProperty(this.userObject.elements.createUserForm.selector, 'display', function (attrResult) {
                client
                    .pause(3000)
                    .assert.equal(attrResult.value, 'none');
            })
            .waitForElementPresent(this.userObject.elements.toolbar.selector + ' ' + this.userObject.elements.userManagement.selector, client.globals.loadTime.defaultWait);

    },
    /**
     * Validation of a new user creation form with all the fields filled ---> 
     * Notification " user saved " + notification "to give rights to the user drag and drop into a group " 
     * + the user appears in the list of users of the Bo
     * 
     */
    'Validation of a new user creation form with all the fields filled': function (client) {
        'use strict';

        client
            .pause(client.globals.loadTime.mediumWait)
            .click(this.userObject.elements.createUser.selector)
            .waitForElementPresent(this.userObject.elements.createUserForm.selector, client.globals.loadTime.longWait);
        this.userObject
            .fillForm(this.firstName1, this.lastName1, this.email1, this.login1)
            .api.pause(client.globals.loadTime.mediumWait)
            .moveToElement(this.userObject.elements.createUserForm.selector + ' ' + this.userObject.elements.saveBtn.selector, 0, 0)
            .click(this.userObject.elements.createUserForm.selector + ' ' + this.userObject.elements.saveBtn.selector);

        checkNotif(client, this, this.firstName1, this.lastName1, this.userObject.elements.userActivated.selector);
        client.pause(client.globals.loadTime.mediumWait);

    },
    /**
     * Validation of the form to create a new user with the check box "enabled" unchecked 
     * ---> Notification " saved user " + notification "to give rights to the user drag and drop into a group " 
     * + the user appears in the user list Bo with its status "desactivated"
     * 
     */
    'Validation of a new user creation form with the status desactivated': function (client) {
        'use strict';

        var self = this;

        this.userObject
            .click(this.userObject.elements.createUser.selector)
            .waitForElementPresent(this.userObject.elements.createUserForm.selector, client.globals.loadTime.longWait)
            .fillForm(self.firstName, self.lastName, self.email, self.login)
            .api.pause(client.globals.loadTime.mediumWait)
            .click(this.userObject.elements.elementActivated.selector + ' ' + this.userObject.elements.activatedAccount.selector)
            .pause(client.globals.loadTime.defaultWait)
            .click(this.userObject.elements.elementRemoteAccess.selector + ' ' + this.userObject.elements.remoteAccessAccount.selector)
            .pause(client.globals.loadTime.longWait)
            .click(this.userObject.elements.createUserForm.selector + ' ' + this.userObject.elements.saveBtn.selector);

        checkNotif(client, this, self.firstName, self.lastName, this.userObject.elements.userDesactivated.selector);
        client.pause(client.globals.loadTime.longWait);

    },

    /**
     * Search by login
     * @param {type} client
     * @returns {undefined}
     */
    searchByLogin: function (client) {
        'use strict';

        var self = this;
        client
            .pause(client.globals.loadTime.mediumWait);
        this.userObject
            .click('@resetBtn')
            .setValue('@loginSearch', this.login)
            .click('@searchBtn')
            .api.pause(client.globals.loadTime.mediumWait);
        checkListOfUsers(client, self, this.firstName, this.lastName);

    },

    /**
     * Search by email
     * @param {type} client
     * @returns {undefined}
     */
    searchByEmail: function (client) {
        'use strict';

        var self = this;
        client
            .pause(client.globals.loadTime.mediumWait);
        this.userObject
            .click('@resetBtn')
            .setValue('@emailSearch', this.email)
            .click('@searchBtn')
            .api.pause(client.globals.loadTime.mediumWait);
        checkListOfUsers(client, self, this.firstName, this.lastName);

    },

    /**
     * Search those with inactive status
     * @param {type} client
     * @returns {undefined}
     */
    searchInactiveStatus: function (client) {
        'use strict';

        var self = this;
        client
            .pause(client.globals.loadTime.mediumWait)
            .click(this.userObject.elements.resetBtn.selector)
            .pause(client.globals.loadTime.defaultWait)
            .click(this.userObject.elements.statusSearch.selector)
            .pause(client.globals.loadTime.defaultWait)
            .click(this.userObject.elements.statusSearch.selector + ' option[value="0"]')
            .pause(client.globals.loadTime.defaultWait)
            .keys(['\uE006'])
            .click(this.userObject.elements.searchBtn.selector)
            .pause(client.globals.loadTime.mediumWait);
        checkListWithStatus(client, self, this.firstName, this.lastName);

    },

    /**
     * Search with all fields filled
     * @param {type} client
     * @returns {undefined}
     */
    searchAllFields: function (client) {
        'use strict';

        var self = this;
        client
            .pause(client.globals.loadTime.mediumWait);
        this.userObject
            .click('@resetBtn')
            // set login
            .setValue('@loginSearch', this.login)
            // set email
            .setValue('@emailSearch', this.email)
            // set name
            .setValue('@nameSearch', this.firstName)
            // set status
            .api.click(this.userObject.elements.statusSearch.selector)
            .pause(client.globals.loadTime.defaultWait)
            .click(this.userObject.elements.statusSearch.selector + ' option[value="0"]')
            .pause(client.globals.loadTime.defaultWait)
            .keys(['\uE006'])
            .click(this.userObject.elements.searchBtn.selector)
            .pause(client.globals.loadTime.mediumWait);

        checkListOfUsers(client, self, this.firstName, this.lastName);

    },

     /**
     * Search those with inactive status
     * @param {type} client
     * @returns {undefined}
     */
    searchActiveStatus: function (client) {
        'use strict';

        var self = this;
        client
            .pause(client.globals.loadTime.mediumWait)
            .click(this.userObject.elements.resetBtn.selector)
            .pause(client.globals.loadTime.defaultWait)
            .click(this.userObject.elements.statusSearch.selector)
            .pause(client.globals.loadTime.defaultWait)
            .click(this.userObject.elements.statusSearch.selector + ' option[value="' + 1 + '"]')
            .pause(client.globals.loadTime.defaultWait)
            .keys(['\uE006'])
            .click(this.userObject.elements.searchBtn.selector)
            .pause(client.globals.loadTime.mediumWait);
        checkListWithStatus(client, self, this.firstName1, this.lastName1);

    },

    /**
     * Search user with unknown name -> user not found
     * @param {type} client
     * @returns {undefined}
     */
    searchNotFoundUser: function (client) {
        'use strict';

        searchNotFound(client, this, '@nameSearch');
        checkNotFound(client, this);

        searchNotFound(client, this, '@emailSearch');
        checkNotFound(client, this);

        searchNotFound(client, this, '@loginSearch');
        checkNotFound(client, this);
        this.userObject
            .click('@resetBtn');

    },

    /**
     * Drag and drop user to administrator/ validator / contributor and check if it appears in the list of users
     * @param {type} client
     * @returns {undefined}
     */
//    'Drag and drop user to administrator': function (client) {
//        'use strict';
//
//        var self = this,
//            dragTarget = this.userObject.elements.listUsers.selector + ':last-child ' + 'div.bb5-data-toggle.bb5-manage-user',
//            dropTarget = this.userObject.elements.groupList.selector,
//            element = '',
//            droppableTarget = '',
//            dx = '',
//            dy = '',
//            droppableOffset = '',
//            draggableOffset = '';
//
//        client
//            .pause(client.globals.loadTime.mediumWait)
//            .waitForElementVisible(this.userObject.elements.listUsers.selector + ':last-child ' + 'div.bb5-data-toggle.bb5-manage-user', client.globals.loadTime.mediumWait, function () {
//                client
//                     .moveToElement(self.userObject.elements.listUsers.selector + ':last-child ' + 'div.bb5-data-toggle.bb5-manage-user', 70, 30);
//            })
//
//            .getLocation(dropTarget, function () {
//                client
//                    .execute(
//                        function (dragTarget, dropTarget, droppableOffset, draggableOffset, dx, dy) {
//                            jQuery("head").append('<script type="text/javascript" src="https://raw.githubusercontent.com/jquery/jquery-ui/master/external/jquery-simulate/jquery.simulate.js"></script>');
//                            setTimeout(function () {
//
//                                element = jQuery(dragTarget).draggable({
//                                    scroll: false,
//                                    drag: function () {
//                                        jQuery("div#user-list")
//                                            .css("overflow-y", 'hidden')
//                                            .css("overflow-x", 'hidden')
//                                            .scrollTop(0)
//                                            .scrollLeft(0);
//                                        jQuery(dragTarget)
//                                            .css("position", "absolute")
//                                            .css("z-index", "1");
//                                    }
//                                });
//
//                                droppableTarget = jQuery(dropTarget).droppable();
//
//                                droppableOffset = droppableTarget.offset();
//                                draggableOffset = element.offset();
//                                dx = droppableOffset.left - draggableOffset.left;
//                                dy = droppableOffset.top - draggableOffset.top;
//                                element.simulate("drag", {
//                                    handle: "center",
//                                    dx: dx + 20,
//                                    dy: dy + 20,
//                                    dropTarget: droppableTarget
//                                });
//                                droppableTarget.simulate('drop');
//
//                            }, 3000);
//                        },
//                        [dragTarget, dropTarget, droppableOffset, draggableOffset, dx, dy]
//                    );
//            });
//
//        checkNotif(client, this, self.firstName, self.lastName, this.userObject.elements.userAddedToGroupNotif.selector);
//    },

    /**
     * Check if the user appears in the list of users
     * @param {type} client
     * @returns {undefined}
     */
//    'Check if the user appears in the list of users': function (client) {
//        'use strict';
//
//        var self = this;
//        client
//            .click(this.userObject.elements.groupList.selector + ':last-child ' + this.userObject.elements.usersBtn.selector)
//            .pause(client.globals.loadTime.mediumWait)
//            .element('css selector', this.userObject.elements.groupUsers.selector + ' ' + this.userObject.elements.groupUsersList.selector + ':last-child ' + this.userObject.elements.fristnameListUsers.selector, function (result) {
//                client
//                    .elementIdText(result.value.ELEMENT, function (res) {
//                        client
//                            .assert.equal(res.value, self.firstName);
//                    });
//            })
//            .element('css selector', this.userObject.elements.groupUsers.selector + ' ' + this.userObject.elements.groupUsersList.selector + ':last-child ' + this.userObject.elements.lastnameListUsers.selector, function (result) {
//                client
//                    .elementIdText(result.value.ELEMENT, function (res) {
//                        client
//                            .assert.equal(res.value, self.lastName);
//                    });
//            })
//            // Remove user from a group
//            .element('css selector', this.userObject.elements.groupUsers.selector + ' ' + this.userObject.elements.groupUsersList.selector + ':last-child ' + this.userObject.elements.btnRemove.selector, function (result) {
//                client
//                    .elementIdClick(result.value.ELEMENT)
//                    .pause(client.globals.loadTime.mediumWait)
//                    .waitForElementPresent(self.userObject.elements.boxWrapper.selector + self.userObject.elements.notifSuccess.selector, client.globals.loadTime.longWait, function (res) {
//                        client
//                             .elementIdText(res.value[0].ELEMENT, function (result) {
//                                client
//                                    .assert.equal(result.value, self.userObject.elements.userRemovedNotif.selector);
//                            });
//                    });
//            });
//    },

    /**
     * Search by name
     * @param {type} client
     * @returns {undefined}
     */
    searchName: function (client) {
        'use strict';

        searchByName(client, this, this.firstName, this.lastName, this.login);
        searchByName(client, this, this.firstName1, this.lastName1, this.login1);
    },

    after: function (client) {
        'use strict';

        client.end();
    }
};