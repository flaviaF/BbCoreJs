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
 * Account object
 *
 * @category    NightWatch
 * @subcategory AccountObject
 * @copyright   Lp digital system
 * @author      flavia.fodor@lp-digital.fr
 */

var commands = {

};

module.exports = {
    commands: [commands],
    elements: {
        userPopin: {
            selector: 'div#current-user-popin'
        },
        firstNameElement: {
            selector: 'div.element_firstname'
        },
        lastnameElement: {
            selector: 'div.element_lastname'
        },
        emailElement: {
            selector: 'div.element_email'
        },
        saveBtn: {
            selector: 'button.bb-submit-form'
        },
        inputFirstname: {
            selector: 'input[name="firstname"]'
        },
        inputLastname: {
            selector: 'input[name="lastname"]'
        },
        inputEmail: {
            selector: 'input[name="email"]'
        },
        boxWrapper: {
            selector: 'section#bb-box-wrapper'
        },
        notifSuccess: {
            selector: 'div.bb-box-notify.success p'
        },
        notifMsj: {
            selector: 'User account modifications saved'
        },
        errorMsg: {
            selector: 'span.form_error.help-block'
        },
        oldPasswordElement: {
            selector: 'div.element_old_password'
        },
        passwordElement: {
            selector: 'div.element_password'
        },
        confirmPasswordElement: {
            selector: 'div.element_confirm_password'
        },
        closePopin: {
            selector: 'button.ui-dialog-titlebar-close'
        },
        currentPopin: {
            selector: 'div[aria-describedby="current-user-popin"]'
        },
        inputOldPassword: {
            selector: 'input[name="old_password"]'
        },
        inputPassword: {
            selector: 'input[name="password"]'
        },
        inputConfirmPassword: {
            selector: 'input[name="confirm_password"]'
        },
        msgDiffrentPass: {
            selector: 'New password and Confirm password are different'
        },
        msgSavedPassword: {
            selector: 'password_updated'
        },
        msgPasswordRequired: {
            selector: 'password is required'
        },
        msgNewPasswordRequired: {
            selector: 'New password is required'
        },
        msgConfirmPasswordRequired: {
            selector: 'Confirm password is required'
        },
        msgWrongEmail: {
            selector: 'Email is not valid'
        },
        fieldRequiredMsg: {
            selector: 'Field required'
        }
    }
};