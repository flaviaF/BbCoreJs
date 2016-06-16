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
 * Toolbar object
 *
 * @category    NightWatch
 * @subcategory ToolbarObjects
 * @copyright   Lp digital system
 * @author      
 */

module.exports = {
    sections: {
        toolbar: {
            selector: '#bb5-ui',
            sections: {
                userSettings: {
                    selector: '#bb-current-user',
                    elements: {
                        topMostLogin: {
                            selector: '#bb5-topmost-login'
                        },
                        language: {
                            selector: 'div#bb-current-user ul li.list-lang a'
                        },
                        languageNotActive: {
                            selector: 'div#bb-current-user ul li.list-lang a:not(.active)'
                        },
                        languageActive: {
                            selector: 'div#bb-current-user ul li.list-lang a.active'
                        },
                        languageOpen: {
                            selector: '#bb-current-user > div.dropdown.open'
                        },
                        dropDown: {
                            selector: '.dropdown'
                        },
                        dropDownOpen: {
                            selector: 'div.dropdown.open'
                        },
                        editBtn: {
                            selector: 'a.bb-service[data-service="editCurrent"]'
                        },
                        changePasswordBtn: {
                            selector: 'a.bb-service[data-service="changePassword"]'
                        },
                        logout: {
                            selector: 'a.bb-service[data-service="logout"]'
                        }
                    }
                }
            }
        }
    }
};