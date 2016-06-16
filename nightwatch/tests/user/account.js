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

var verifyNotif = function (client, self, msj) {
    'use strict';

    client
        .waitForElementPresent(self.accountObject.elements.boxWrapper.selector + ' ' + self.accountObject.elements.notifSuccess.selector, client.globals.loadTime.longWait, function (res) {
            client
                .elementIdText(res.value[0].ELEMENT, function (result) {
                    client
                        .assert.equal(result.value, msj);
                });
        })
        .waitForElementNotPresent(self.accountObject.elements.userPopin.selector, client.globals.loadTime.mediumWait);
};

var verifyNoNotif = function (client, self) {
    'use strict';

    client
        .waitForElementPresent(self.accountObject.elements.boxWrapper.selector, client.globals.loadTime.longWait, function (res) {
            client
                .elementIdText(res.value[0].ELEMENT, function (result) {
                    client
                        .assert.equal(result.value, '');
                });
        });
};

var openEditPassword = function (client, self) {
    'use strict';

    client
        .openUserDropDown()
        .waitForElementPresent(self.userSettingsSection.elements.changePasswordBtn.selector, client.globals.loadTime.mediumWait)
        .click(self.userSettingsSection.elements.changePasswordBtn.selector)
        .pause(client.globals.loadTime.defaultWait);
};

var openEditNames = function (client, self) {
    'use strict';

    client
        .openUserDropDown()
        .waitForElementPresent(self.userSettingsSection.elements.editBtn.selector, client.globals.loadTime.mediumWait)
        .click(self.userSettingsSection.elements.editBtn.selector)
        .waitForElementPresent(self.accountObject.elements.userPopin.selector, client.globals.loadTime.mediumWait);
};

var setPassword = function (client, self, oldPassword, currentPassword, confirmPassword) {
    'use strict';

    openEditPassword(client, self);
    client
        .clearValue(self.accountObject.elements.userPopin.selector + ' ' + self.accountObject.elements.oldPasswordElement.selector + ' ' + self.accountObject.elements.inputOldPassword.selector)
        .pause(client.globals.loadTime.defaultWait)
        .setValue(self.accountObject.elements.userPopin.selector + ' ' + self.accountObject.elements.oldPasswordElement.selector + ' ' + self.accountObject.elements.inputOldPassword.selector, oldPassword)
        .pause(client.globals.loadTime.defaultWait)
        .clearValue(self.accountObject.elements.userPopin.selector + ' ' + self.accountObject.elements.passwordElement.selector + ' ' + self.accountObject.elements.inputPassword.selector)
        .pause(client.globals.loadTime.defaultWait)
        .setValue(self.accountObject.elements.userPopin.selector + ' ' + self.accountObject.elements.passwordElement.selector + ' ' + self.accountObject.elements.inputPassword.selector, currentPassword)
        .pause(client.globals.loadTime.defaultWait)
        .setValue(self.accountObject.elements.userPopin.selector + ' ' + self.accountObject.elements.confirmPasswordElement.selector + ' ' + self.accountObject.elements.inputConfirmPassword.selector, confirmPassword)
        .pause(client.globals.loadTime.defaultWait)
        .click(self.accountObject.elements.userPopin.selector + ' ' + self.accountObject.elements.saveBtn.selector)
        .pause(client.globals.loadTime.mediumWait);
};

var setFirstname = function (client, self, firstname) {
    'use strict';

    client
        .clearValue(self.accountObject.elements.userPopin.selector + ' ' + self.accountObject.elements.firstNameElement.selector + ' ' + self.accountObject.elements.inputFirstname.selector)
        .pause(client.globals.loadTime.defaultWait)
        .setValue(self.accountObject.elements.userPopin.selector + ' ' + self.accountObject.elements.firstNameElement.selector + ' ' + self.accountObject.elements.inputFirstname.selector, firstname)
        .pause(client.globals.loadTime.defaultWait);

};

var setLastname = function (client, self, lastname) {
    'use strict';

    client
        .clearValue(self.accountObject.elements.userPopin.selector + ' ' + self.accountObject.elements.lastnameElement.selector + ' ' + self.accountObject.elements.inputLastname.selector)
        .pause(client.globals.loadTime.defaultWait)
        .setValue(self.accountObject.elements.userPopin.selector + ' ' + self.accountObject.elements.lastnameElement.selector + ' ' + self.accountObject.elements.inputLastname.selector, lastname)
        .pause(client.globals.loadTime.defaultWait);

};

var setEmail = function (client, self, email) {
    'use strict';

    client
        .clearValue(self.accountObject.elements.userPopin.selector + ' ' + self.accountObject.elements.emailElement.selector + ' ' + self.accountObject.elements.inputEmail.selector)
        .pause(client.globals.loadTime.defaultWait)
        .setValue(self.accountObject.elements.userPopin.selector + ' ' + self.accountObject.elements.emailElement.selector + ' ' + self.accountObject.elements.inputEmail.selector, email)
        .pause(client.globals.loadTime.defaultWait);

};

var setNamesEmail = function (client, self, firstname, lastname, email) {
    'use strict';

    openEditNames(client, self);
    if (firstname !== '') {
        setFirstname(client, self, firstname);
    }
    if (lastname !== '') {
        setLastname(client, self, lastname);
    }
    if (email !== '') {
        setEmail(client, self, email);
    }
    client
        .pause(client.globals.loadTime.defaultWait)
        .click(self.accountObject.elements.userPopin.selector + ' ' + self.accountObject.elements.saveBtn.selector);
     //verifyNotif(client, self, self.accountObject.elements.notifMsj.selector);
};

module.exports = {

   /**
    * Before doing the tests, login into the backend
    * 
    */
    before : function (client) {
        'use strict';

        client.login();

        this.accountObject = client.page.account();
        this.toolbarObject = client.page.toolbar();
        this.toolbarSection = this.toolbarObject.section.toolbar;
        this.userSettingsSection = this.toolbarSection.section.userSettings;

        this.firstName = 'nightwatch firstname' + Math.random().toString(36).replace(/[0-9]+/g, '').substring(2, 5);
        this.lastName = 'nightwatch lastname' + Math.random().toString(36).replace(/[0-9]+/g, '').substring(2, 5);
        this.email = 'nightwatch_email' + Math.random().toString(36).replace(/[0-9]+/g, '').substring(2, 5) + '@yahoo.com';
        this.password = 'nightwatch+password' + Math.random().toString(36).replace(/[0-9]+/g, '').substring(2, 5);
        console.log('password =');
        console.log(this.password);

    },

    /**
     * Click on the account dropdown---> Deployment of the dropdown list showing options : Edit , Change password, bo languages ​​, Logout
     * 
     */
    'Click on the account dropdown': function (client) {
        'use strict';

        client
            .openUserDropDown();
    },

    /**
     * Re click the my account dropdown---> The dropdown list is reduced
     * 
     */
    'Re click the my account dropdown': function (client) {
        'use strict';

        this.userSettingsSection
            .assert.elementPresent('@topMostLogin')
            .click('@topMostLogin');
        client
            .pause(5000);
        this.userSettingsSection
            .assert.elementNotPresent('@dropDownOpen');
    },

    /**
     * Click next to the drop down once deployed---> The dropdown list is reduced
     * 
     */
    'Click next to the drop down once deployed': function (client) {
        'use strict';

        client
            .openUserDropDown()
            .waitForElementPresent(this.userSettingsSection.elements.dropDownOpen.selector, client.globals.loadTime.mediumWait)
            .pause(client.globals.loadTime.mediumWait)
            .moveToElement(this.toolbarSection.selector, 0, 0)
            .mouseButtonClick('left')
            .waitForElementNotPresent(this.userSettingsSection.elements.dropDownOpen.selector, client.globals.loadTime.mediumWait);

    },

    /**
     * Click on " edit "---> Popin appears with " edit account" : name fields , name, email, Save button
     * 
     */
    'Click on edit': function (client) {
        'use strict';

        openEditNames(client, this);
        client
            .waitForElementPresent(this.accountObject.elements.userPopin.selector + ' ' + this.accountObject.elements.firstNameElement.selector, client.globals.loadTime.mediumWait)
            .waitForElementPresent(this.accountObject.elements.userPopin.selector + ' ' + this.accountObject.elements.lastnameElement.selector, client.globals.loadTime.mediumWait)
            .waitForElementPresent(this.accountObject.elements.userPopin.selector + ' ' + this.accountObject.elements.emailElement.selector, client.globals.loadTime.mediumWait);

    },

    /**
     * Validation of my account form with all the fields unchanged---> popin is closed, no notifications
     * 
     */
    'Validation of my account form with all the fields unchanged': function (client) {
        'use strict';

        client
            .click(this.accountObject.elements.userPopin.selector + ' ' + this.accountObject.elements.saveBtn.selector)
            .waitForElementNotPresent(this.accountObject.elements.userPopin.selector, client.globals.loadTime.mediumWait);
        verifyNoNotif(client, this);

    },
    /**
     * Validation of my account after editing form name and surname ---> Notification "modified saved " and popin closure
     * 
     */
    'Validation of my account after editing form name and surname': function (client) {
        'use strict';

        var self = this;
        setNamesEmail(client, self, this.firstName, this.lastName, '');
        verifyNotif(client, self, self.accountObject.elements.notifMsj.selector);

    },

    /**
     * Validation of my account form after editing the email---> when format incorrect display erroro, email format, if not, display notification of saved changes and closing the popin
     * 
     */
    'Validation of my account form after editing the email': function (client) {
        'use strict';

        var self = this;
        setNamesEmail(client, self, '', '', this.email + Math.random().toString(36).substring(2, 5));

        client
            .pause(client.globals.loadTime.mediumWait)
            .assert.elementPresent(this.accountObject.elements.userPopin.selector)
            .assert.visible(this.accountObject.elements.emailElement.selector + ' ' + this.accountObject.elements.errorMsg.selector)
            .assert.cssClassNotPresent(this.accountObject.elements.emailElement.selector + ' ' + this.accountObject.elements.errorMsg.selector, 'hidden')
            .getText(this.accountObject.elements.emailElement.selector + ' ' + this.accountObject.elements.errorMsg.selector, function (res) {
                client
                    .assert.equal(res.value, self.accountObject.elements.msgWrongEmail.selector);
            });

        setNamesEmail(client, self, '', '', this.email);
        verifyNotif(client, self, self.accountObject.elements.notifMsj.selector);

    },

    /**
     * Form validation of my account with missing fields---> error message indicating that a field is not filled , the popin remains opened
     * 
     */
    'Form validation of my account with missing fields': function (client) {
        'use strict';

        var self = this;
        openEditNames(client, this);
        client
            .clearValue(this.accountObject.elements.userPopin.selector + ' ' + this.accountObject.elements.firstNameElement.selector + ' ' + this.accountObject.elements.inputFirstname.selector)
            .pause(client.globals.loadTime.defaultWait)
            .click(this.accountObject.elements.userPopin.selector + ' ' + this.accountObject.elements.saveBtn.selector)
            .pause(client.globals.loadTime.defaultWait)
            .assert.visible(this.accountObject.elements.firstNameElement.selector + ' ' + this.accountObject.elements.errorMsg.selector)
            .getText(this.accountObject.elements.firstNameElement.selector + ' ' + this.accountObject.elements.errorMsg.selector, function (res) {
                client
                    .assert.equal(res.value, self.accountObject.elements.fieldRequiredMsg.selector);
            });
        client
            .assert.cssClassNotPresent(this.accountObject.elements.firstNameElement.selector + ' ' + this.accountObject.elements.errorMsg.selector, 'hidden')
            .assert.elementPresent(this.accountObject.elements.userPopin.selector);
    },

    /**
     * Click on " change password" ---> popin brings up the " edit password " fields with pass , pass new , confirm pass
     * 
     */
    'Click on change password': function (client) {
        'use strict';

        openEditPassword(client, this);
        this.accountObject
            .assert.elementPresent('@oldPasswordElement')
            .assert.elementPresent('@passwordElement')
            .assert.elementPresent('@confirmPasswordElement');
    },

    /**
     * Click on " validate " without changing anything---> error message new pass is required , confirm pass is required
     * 
     */
    'Click on validate without changing anything': function (client) {
        'use strict';

        var self = this;
        openEditPassword(client, this);
        client
            .click(this.accountObject.elements.currentPopin.selector + ' ' + this.accountObject.elements.saveBtn.selector)
            .pause(client.globals.loadTime.mediumWait);

        this.accountObject
            .assert.visible(this.accountObject.elements.oldPasswordElement.selector + ' ' + this.accountObject.elements.errorMsg.selector)
            .getText(this.accountObject.elements.oldPasswordElement.selector + ' ' + this.accountObject.elements.errorMsg.selector, function (res) {
                client
                    .assert.equal(res.value, self.accountObject.elements.msgPasswordRequired.selector);
            })
            .assert.visible(this.accountObject.elements.passwordElement.selector + ' ' + this.accountObject.elements.errorMsg.selector)
            .getText(this.accountObject.elements.passwordElement.selector + ' ' + this.accountObject.elements.errorMsg.selector, function (res) {
                client
                    .assert.equal(res.value, self.accountObject.elements.msgNewPasswordRequired.selector);
            })
            .assert.visible(this.accountObject.elements.confirmPasswordElement.selector + ' ' + this.accountObject.elements.errorMsg.selector)
            .getText(this.accountObject.elements.confirmPasswordElement.selector + ' ' + this.accountObject.elements.errorMsg.selector, function (res) {
                client
                    .assert.equal(res.value, self.accountObject.elements.msgConfirmPasswordRequired.selector);
            });

    },

    /**
     * Close popin without changing anything---> Back on the toolbar in the section EDITION
     * 
     */
    'Close popin without changing anything': function (client) {
        'use strict';

        openEditPassword(client, this);
        client
            .pause(client.globals.loadTime.mediumWait)
            .click(this.accountObject.elements.currentPopin.selector + ' ' + this.accountObject.elements.closePopin.selector)
            .pause(client.globals.loadTime.longWait)
            .getCssProperty(this.accountObject.elements.currentPopin.selector, 'display', function (attrResult) {
                client
                    .pause(client.globals.loadTime.mediumWait)
                    .assert.equal(attrResult.value, 'none');
            });
    },

    /**
     * Edit the field " password" without filling out the fields " New Password " and "save ---> error message new pass is required , confirm pass is required
     * 
     */
    'Edit the field password without filling out the fields New Password and save': function (client) {
        'use strict';

        var self = this;
        openEditPassword(client, this);
        client
            .clearValue(this.accountObject.elements.userPopin.selector + ' ' + this.accountObject.elements.oldPasswordElement.selector + ' ' + this.accountObject.elements.inputOldPassword.selector)
            .pause(client.globals.loadTime.defaultWait)
            .setValue(this.accountObject.elements.userPopin.selector + ' ' + this.accountObject.elements.oldPasswordElement.selector + ' ' + this.accountObject.elements.inputOldPassword.selector, client.globals.login.realUser.password)
            .pause(client.globals.loadTime.defaultWait)
            .click(this.accountObject.elements.currentPopin.selector + ' ' + this.accountObject.elements.saveBtn.selector)
            .pause(client.globals.loadTime.mediumWait);
        this.accountObject
            .assert.visible(this.accountObject.elements.passwordElement.selector + ' ' + this.accountObject.elements.errorMsg.selector)
            .getText(this.accountObject.elements.passwordElement.selector + ' ' + this.accountObject.elements.errorMsg.selector, function (res) {
                client
                    .assert.equal(res.value, self.accountObject.elements.msgNewPasswordRequired.selector);
            })
            .assert.visible(this.accountObject.elements.confirmPasswordElement.selector + ' ' + this.accountObject.elements.errorMsg.selector)
            .getText(this.accountObject.elements.confirmPasswordElement.selector + ' ' + this.accountObject.elements.errorMsg.selector, function (res) {
                client
                    .assert.equal(res.value, self.accountObject.elements.msgConfirmPasswordRequired.selector);
            });

    },

    /**
     * Fill the new password fields and do not complete the confirmation field then "save "---> Error message confirm pass is required
     * 
     */
    'Fill the new password fields and do not complete the confirmation field then save': function (client) {
        'use strict';

        var self = this;
        openEditPassword(client, this);
        client
            .clearValue(this.accountObject.elements.userPopin.selector + ' ' + this.accountObject.elements.oldPasswordElement.selector + ' ' + this.accountObject.elements.inputOldPassword.selector)
            .pause(client.globals.loadTime.defaultWait)
            .setValue(this.accountObject.elements.userPopin.selector + ' ' + this.accountObject.elements.oldPasswordElement.selector + ' ' + this.accountObject.elements.inputOldPassword.selector, client.globals.login.realUser.password)
            .pause(client.globals.loadTime.defaultWait)
            .clearValue(this.accountObject.elements.userPopin.selector + ' ' + this.accountObject.elements.passwordElement.selector + ' ' + this.accountObject.elements.inputPassword.selector)
            .pause(client.globals.loadTime.defaultWait)
            .setValue(this.accountObject.elements.userPopin.selector + ' ' + this.accountObject.elements.passwordElement.selector + ' ' + this.accountObject.elements.inputPassword.selector, this.password)
            .pause(client.globals.loadTime.defaultWait)
            .click(this.accountObject.elements.currentPopin.selector + ' ' + this.accountObject.elements.saveBtn.selector)
            .pause(client.globals.loadTime.mediumWait);
        this.accountObject
            .assert.visible(this.accountObject.elements.confirmPasswordElement.selector + ' ' + this.accountObject.elements.errorMsg.selector)
            .getText(this.accountObject.elements.confirmPasswordElement.selector + ' ' + this.accountObject.elements.errorMsg.selector, function (res) {
                client
                    .assert.equal(res.value, self.accountObject.elements.msgConfirmPasswordRequired.selector);
            });

    },

    /**
     * Complete the fields new password and complete the confirmation field with a different pass then "save "---> error message and confirm new pass are different pass
     * 
     */
    'Complete the fields new password and complete the confirmation field with a different pass then save': function (client) {
        'use strict';

        var self = this;
        openEditPassword(client, this);
        setPassword(client, this, client.globals.login.realUser.password, this.password, this.password + Math.random().toString(36).replace(/[0-9]+/g, '').substring(2, 5));
        this.accountObject
            .assert.visible(this.accountObject.elements.passwordElement.selector + ' ' + this.accountObject.elements.errorMsg.selector)
            .getText(this.accountObject.elements.passwordElement.selector + ' ' + this.accountObject.elements.errorMsg.selector, function (res) {
                client
                    .assert.equal(res.value, self.accountObject.elements.msgDiffrentPass.selector);
            });

    },

    /**
     * Fill the new password fields and complete the confirmation field correctly then "save "---> Notification " New password saved " then close the pop in. When login in again to the Bo, the new pass words is required
     * 
     */
    'Fill the new password fields and complete the confirmation field correctly': function (client) {
        'use strict';

        setPassword(client, this, client.globals.login.realUser.password, this.password, this.password);

    },

    /**
     * Check login with the new password
     */
    'Check login with the new password': function (client) {
        'use strict';

        client
            .logout()
            .pause(client.globals.loadTime.mediumWait)
            .login(client.globals.login.realUser.username, this.password);
    },

    /**
     * Set the old password and names
     */
    'Set the old password and names': function (client) {
        'use strict';

        setPassword(client, this, this.password, client.globals.login.realUser.password, client.globals.login.realUser.password);
        setNamesEmail(client, this, client.globals.login.realUser.firstname, client.globals.login.realUser.lastname, client.globals.login.realUser.email);
    }

};