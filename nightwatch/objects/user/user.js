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
 * User object
 *
 * @category    NightWatch
 * @subcategory UserObjects
 * @copyright   Lp digital system
 * @author      flavia.fodor@lp-digital.fr
 */

var commands = {

    fillForm: function (firstName, lastName, email, login) {
        'use strict';

        this.api
            .setValue(this.elements.createUserForm.selector + ' ' + this.elements.elementFirstName.selector + ' ' + this.elements.firstName.selector, firstName)
            .pause(this.api.globals.loadTime.defaultWait)
            .setValue(this.elements.createUserForm.selector + ' ' + this.elements.elementLastName.selector + ' ' + this.elements.lastName.selector, lastName)
            .pause(this.api.globals.loadTime.defaultWait)
            .setValue(this.elements.createUserForm.selector + ' ' + this.elements.elementEmail.selector + ' ' + this.elements.email.selector, email)
            .pause(this.api.globals.loadTime.defaultWait)
            .setValue(this.elements.createUserForm.selector + ' ' + this.elements.elementLogin.selector + ' ' + this.elements.login.selector, login)
            .pause(this.api.globals.loadTime.defaultWait);

        return this;
    }

};

module.exports = {
    commands: [commands],
    elements: {
        userManagement: {
            selector: 'a#User-menu'
        },
        toolbar: {
            selector: 'div#bb5-ui nav#bb5-navbar-primary ul#bb5-maintabs'
        },
        userToolbar: {
            selector: 'div#bb-user-app.active'
        },
        activeTab: {
            selector: 'li.active'
        },
        createUser: {
            selector: 'button#toolbar-new-user-action'
        },
        createUserForm: {
            selector: 'div[aria-describedby="new-user-subpopin"]'
        },
        firstName: {
            selector: 'input[name="firstname"]'
        },
        lastName: {
            selector: 'input[name="lastname"]'
        },
        email: {
            selector: 'input[name="email"]'
        },
        login: {
            selector: 'input[name="login"]'
        },
        saveBtn: {
            selector: 'button.bb-submit-form'
        },
        elementFirstName: {
            selector: 'div.element_firstname'
        },
        elementLastName: {
            selector: 'div.element_lastname'
        },
        elementEmail: {
            selector: 'div.element_email'
        },
        elementLogin: {
            selector: 'div.element_login'
        },
        elementActivated: {
            selector: 'div.element_activated'
        },
        activatedAccount: {
            selector: 'input[value="activated"]'
        },
        elementRemoteAccess: {
            selector: 'div.element_api_key_enabled'
        },
        remoteAccessAccount: {
            selector: 'input[value="api_key_enabled"]'
        },
        errorMsg: {
            selector: 'span.form_error.help-block'
        },
        closePopin: {
            selector: 'button.ui-dialog-titlebar-close'
        },
        listUsers: {
            selector: 'div#user-popin-picker div#user-list ul.bb5-list-data.bb5-list-users li.bb5-list-data-item.bb5-list-users-item'
        },
        boxWrapper: {
            selector: 'section#bb-box-wrapper div.bb-box-notify'
        },
        notifSuccess: {
            selector: '.success p'
        },
        notifWarning: {
            selector: '.warning p'
        },
        notifError: {
            selector: '.error p'
        },
        userSavedNotif: {
            selector: 'User save succeeded'
        },
        dragAndDropNotif: {
            selector: 'To assign a user rights, remember to drag and drop the user into a group'
        },
        fristnameListUsers: {
            selector: 'p.user-name'
        },
        lastnameListUsers: {
            selector: 'p.user-firstname'
        },
        btnRemove: {
            selector: 'button.btn-remove'
        },
        toggleUserData: {
            selector: 'a.bb5-data-toggle-trigger'
        },
        openDrpDownUser: {
            selector: 'div.bb5-data-toggle.bb5-manage-user'
        },
        userDropDownData: {
            selector: 'div.bb5-data-drpdown'
        },
        userStatus: {
            selector: 'span.bb5-button-selector span.bb5-button-selector-status.bb-toggle-status'
        },
        userDesactivated: {
            selector: 'Desactivated'
        },
        userActivated: {
            selector: 'Active'
        },
        deleteBtn: {
            selector: 'button.btn.btn-delete'
        },
        deletePopin: {
            selector: 'div#bb5-dialog-container div:last-child'
        },
        validateBtn: {
            selector: 'button#bb-user-validate'
        },
        deleteNotif: {
            selector: 'User %s has been deleted'
        },
        groupList: {
            selector: 'div#group-list ul.bb5-list-data.bb5-list-users li.bb5-list-data-item div#toolbar-group-1'
        },
//        groupList: {
//            selector: "//div[@id='toolbar-group-2']" 
//        },
        groupName: {
            selector: 'div.bb5-manage-group-header p.bb5-group-name'
        },
        usersBtn: {
            selector: 'button.btn-action[data-action="showUsers"]'
        },
        groupUsers: {
            selector: 'div[aria-describedby="list-display-users"] div#list-display-users'
        },
        groupUsersList: {
            selector: 'ul.bb5-list-data.bb5-list-users li'
        },
        hoverEl: {
            selector: 'div#ui-state-hover'
        },
        userRemovedNotif: {
            selector: 'User removed from this group'
        },
        userAddedToGroupNotif: {
            selector: 'User added to the group'
        },
        nameSearch: {
            selector: 'input#bb-user-name'
        },
        loginSearch: {
            selector: 'input#bb-user-login'
        },
        emailSearch: {
            selector: 'input#bb-user-email'
        },
        statusSearch: {
            selector: 'select#bb-user-status'
        },
        resetBtn: {
            selector: 'button#bb-toolbar-user-reset-search-form'
        },
        searchBtn: {
            selector: 'p.row.form-group button[type="submit"]'
        },
        listUlUsers: {
            selector: 'div#user-popin-picker div#user-list ul.bb5-list-data.bb5-list-users'
        }
    }
};