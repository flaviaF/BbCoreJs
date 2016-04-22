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
 * Search media object
 *
 * @category    NightWatch
 * @subcategory PageObjects
 * @copyright   Lp digital system
 * @author      flavia.fodor@lp-digital.fr
 */

/*global jQuery*/

var createMediaCommands = {
    createMedia: function (mediaName) {
        'use strict';

        var mediaFolderSection = this,
            selectorBtn = this.elements.createMediaBtn.selector;

        this.api
            .waitForElementVisible(mediaFolderSection.selector, 5000)
            .moveToElement(mediaFolderSection.selector, 0, 0)
            .mouseButtonClick('right')
            .pause(3000);
        this.api.execute(function (selectorBtn) {
            jQuery(selectorBtn).click();
            return true;
        }, [selectorBtn])
            .pause(5000);

        this.setFormValues(mediaName, mediaName);

        return this;
    },
    setFormValues: function (mediaTitle, mediaDesc) {
        'use strict';

        var mediaObject = this.api.page.searchMedia(),
            formCreateMediaSection = mediaObject.section.formCreateMediaSection,
            selectorTitle = formCreateMediaSection.selector + ' ' + formCreateMediaSection.elements.titleElement.selector,
            selectorDesc = formCreateMediaSection.selector + ' ' + formCreateMediaSection.elements.descriptionElement.selector,
            saveButton = formCreateMediaSection.selector + ' ' + formCreateMediaSection.elements.saveBtn.selector;
        this.click(formCreateMediaSection.selector);

        this.api.execute(
            function (selectorTitle, selectorDesc, mediaTitle, mediaDesc, saveButton) {

                jQuery(selectorTitle).val(mediaTitle);
                jQuery(selectorDesc).val(mediaDesc);

                setTimeout(function () {
                    jQuery(saveButton).click();
                }, 3000);
            },
            [selectorTitle, selectorDesc, mediaTitle, mediaDesc, saveButton]
        );

        return this;
    }
};

var deleteMediaCommands = {

    deleteMedia: function (textToDelete, callback) {
        'use strict';

        var self = this,
            mediaObject = this.api.page.searchMedia(),
            mediasSection = mediaObject.section.mediasSection,
            selector = mediasSection.selector + ' ' + mediasSection.elements.mediaElementGrid.selector + ' ' + mediasSection.elements.elementPicture.selector + '[title="' + textToDelete + '"]',
            selectorIdFirstPart = mediasSection.elements.selectMedia.selector + '[data-uid="',
            selectorIdSecondPart = '"] > ' + mediasSection.elements.deleteMediaBtn.selector,
            selectorDeleteMedia = mediasSection.elements.deleteMediaOkBtn.selector;

        this.api
            .execute(
                function (selector, selectorIdFirstPart, selectorIdSecondPart, selectorDeleteMedia) {

                    var id = jQuery(selector).parent().parent().attr('data-uid');

                    jQuery(selectorIdFirstPart + id + selectorIdSecondPart).click();

                    setTimeout(function () {
                        jQuery(selectorDeleteMedia + ':first').click();
                    }, 2000);
                },

                [selector, selectorIdFirstPart, selectorIdSecondPart, selectorDeleteMedia],

                function (result) {
                    if (typeof callback === 'function') {
                        callback.call(self, result);
                    }
                }
            )
            .pause(5000);

        return this;
    }
};

module.exports = {
    sections: {
        mediaFolderSection: {
            commands: [createMediaCommands],
            selector: 'div#library-pane-wrapper div.bb5-windowpane-tree-inner div.bb5-windowpane-treewrapper div.bb5-windowpane-treewrapper-inner div.bb5-treeview.mediaFolder-tree div.treeview-ctn ul.jqtree_common.jqtree-tree li.jqtree_common.jqtree-folder div.jqtree-element.jqtree_common a.jqtree_common.jqtree-toggler',
            elements: {
                createMediaBtn: {
                    selector: 'div#bb5-ui div.bb5-context-menu:last ul li button.bb5-contextmenu-Media-Image'
                },
                newMediaDialog: {
                    selector: 'div.media-image-form.ui-dialog'
                }
            }
        },
        formCreateMediaSection: {
            selector: 'div#bb5-ui div#bb5-dialog-container div.media-image-form',
            elements: {
                formSelected: {
                    selector: 'form'
                },
                titleElement: {
                    selector: 'div.element_title textarea:visible'
                },
                descriptionElement: {
                    selector: 'div.element_description'
                },
                copyrightsElement: {
                    selector: 'div.element_copyrights'
                },
                imageElement: {
                    selector: 'div.element_image'
                },
                saveBtn: {
                    selector: 'button.btn-sm.bb-submit-form:visible'
                },
                closeForm: {
                    selector: 'button.ui-button.ui-widget.ui-state-default.ui-corner-all.ui-button-icon-only.ui-dialog-titlebar-close'
                }
            }
        },
        searchSection: {
            selector: 'div.bb5-form-wrapper.search-engine-ctn div.row.search-engine',
            elements: {
                searchInput: {
                    selector: 'input#form10.form-control.content-title'
                },
                searchBtn: {
                    selector: 'button.search-btn'
                },
                dialog: {
                    selector: 'div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front'
                },
                createdBeforeInput: {
                    selector: 'input.before-date.bb5-datepicker'
                },
                createdAfterInput: {
                    selector: 'input.after-date.bb5-datepicker'
                },
                closeModule: {
                    selector: 'div#bb5-dialog-container div.media-library button.ui-button.ui-widget.ui-state-default.ui-corner-all.ui-button-icon-only.ui-dialog-titlebar-close'
                },
                datePickerElement: {
                    selector: 'div.xdsoft_datetimepicker.xdsoft_noselect.xdsoft_'
                },
                datePickerTable: {
                    selector: 'div.xdsoft_datepicker.active div.xdsoft_calendar table tbody tr td'
                }
            }
        },
        mediasSection: {
            commands: [deleteMediaCommands],
            selector: 'div.main-wrapper.bb5-listContainer.data-view div.data-wrapper',
            elements: {
                mediaElementGrid: {
                    selector: 'ul.bb5-list-media.bb5-list-media-is-grid.clearfix li.bb5-selector-item.data-view-item'
                },
                mediaElementList: {
                    selector: 'ul.bb5-list-media.bb5-list-media-is-list.clearfix li.bb5-selector-item.data-view-item'
                },
                elementTitle: {
                    selector: 'p.item-ttl strong.txt-highlight'
                },
                elementPicture: {
                    selector: 'p.item-picture a'
                },
                mediaLibraryButton:  {
                    selector: '#btn-show-mediaLibrary'
                },
                mediaUl: {
                    selector: 'ul.bb5-list-media.bb5-list-media-is-grid.clearfix'
                },
                notFoundMedia: {
                    selector: 'div.data-wrapper'
                },
                btnDisplayMediaGrid: {
                    selector: 'button.bb5-sortasgrid'
                },
                btnDisplayMediaList: {
                    selector: 'button.bb5-sortaslist'
                },
                selectNumberOfMedias: {
                    selector: 'select.max-per-page-selector'
                },
                selectMediaOption: {
                    selector: 'option.page'
                },
                mediaElements: {
                    selector: 'ul.bb5-list-media.clearfix'
                },
                nextArrow: {
                    selector: 'ul.pagination a.page-link.next.bb5-pagination-btn.bb5-pagination-next'
                },
                forwardArrow: {
                    selector: 'ul.pagination a.prev.bb5-pagination-btn.bb5-pagination-prev'
                },
                selectMedia: {
                    selector: 'ul.bb5-list-media li.bb5-selector-item.data-view-item'
                },
                deleteMediaBtn: {
                    selector: 'div.item-action button.del-media-btn'
                },
                deleteMediaOkBtn: {
                    selector: 'div.delete-media div.ui-dialog-buttonset button span.ui-button-text'
                }
            }
        }
    }
};