/*
 * Copyright (c) 2011-2013 Lp digital system
 *
 * This file is part of BackBuilder5.
 *
 * BackBuilder5 is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * BackBuilder5 is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with BackBuilder5. If not, see <http://www.gnu.org/licenses/>.
 */
define(['component!formbuilder', 'component!translator'], function (formbuilder, translator) {
    'use strict';

    var configure = function (view) {

        return {
            elements: {
                firstname: {
                    type: 'text',
                    label: translator.translate('first_name'),
                    value: view.user.getObject().firstname
                },
                lastname: {
                    type: 'text',
                    label: translator.translate('last_name'),
                    value: view.user.getObject().lastname
                },
                email: {
                    type: 'text',
                    label: translator.translate('email'),
                    value: view.user.getObject().email
                }
            },

            onSubmit: function (data) {
                view.user.populate(data);
                view.dfd.resolve(view.user);
            },

            onValidate: function (form, data) {
                var userObject = view.user.getObject();

                if (!data.hasOwnProperty('email') || data.email.trim().length === 0) {
                    form.addError('email', translator.translate('email_is_required'));
                } else {
                    if (!/^[aA-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,6}$/i.test(data.email.trim())) {
                        form.addError('email', translator.translate('email_is_invalid'));
                    }
                }
                if (!data.hasOwnProperty('firstname') || data.firstname.trim().length === 0) {
                    form.addError('firstname', translator.translate('firstname_is_required'));
                }
                if (!data.hasOwnProperty('lastname') || data.lastname.trim().length === 0) {
                    form.addError('lastname', translator.translate('lastname_is_required'));
                }
                if (userObject.firstname === data.firstname.trim() && userObject.lastname === data.lastname.trim() && userObject.email === data.email.trim()) {
                    form.addError('noCompletion', 'noCompletion');
                    view.destroy();
                }
            }
        };
    };

    return {
        construct: function (view, errors) {
            var config = configure(view),
                form,
                key;

            if (undefined !== errors) {
                for (key in errors) {
                    if (errors.hasOwnProperty(key) &&
                            config.elements.hasOwnProperty(key)) {
                        config.elements[key].error = errors[key];
                    }
                }
            }

            form = formbuilder.renderForm(config);

            form.done(function (tpl) {
                view.popin.setContent(tpl);
            });
        }
    };
});
