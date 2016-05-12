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
 * Custom command for deleting the current page
 *
 * @category    NightWatch
 * @subcategory CustomCommands
 * @copyright   Lp digital system
 * @author      flavia.fodor@lp-digital.fr
 */

module.exports.command = function () {
    'use strict';

    var newPageObject = this.page.newPage();

    newPageObject
        .waitForElementVisible('@tabPage', this.globals.loadTime.longWait)
        .click('@tabPage')
        .waitForElementVisible('@deletePageBtn', this.globals.loadTime.longWait)
        .click('@deletePageBtn')
        .waitForElementVisible('@formDeletePage', this.globals.loadTime.mediumWait)
        .click('@formDeletePageBtn');

    return this;
};