/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module ui/list/listview
 */

import View from '../view';
import Template from '../template';
import FocusTracker from '@ckeditor/ckeditor5-utils/src/focustracker';
import FocusCycler from '../focuscycler';
import KeystrokeHandler from '@ckeditor/ckeditor5-utils/src/keystrokehandler';

/**
 * The list view class.
 *
 * @extends module:ui/view~View
 */
export default class ListView extends View {
	/**
	 * @inheritDoc
	 */
	constructor() {
		super();

		/**
		 * Collection of the child list views.
		 *
		 * @readonly
		 * @member {module:ui/viewcollection~ViewCollection}
		 */
		this.items = this.createCollection();

		/**
		 * Tracks information about DOM focus in the list.
		 *
		 * @readonly
		 * @member {module:utils/focustracker~FocusTracker}
		 */
		this.focusTracker = new FocusTracker();

		/**
		 * Instance of the {@link module:core/keystrokehandler~KeystrokeHandler}.
		 *
		 * @readonly
		 * @member {module:core/keystrokehandler~KeystrokeHandler}
		 */
		this.keystrokes = new KeystrokeHandler();

		/**
		 * Helps cycling over focusable {@link #items} in the list.
		 *
		 * @readonly
		 * @protected
		 * @member {module:ui/focuscycler~FocusCycler}
		 */
		this._focusCycler = new FocusCycler( {
			focusables: this.items,
			focusTracker: this.focusTracker,
			keystrokeHandler: this.keystrokes,
			actions: {
				// Navigate list items backwards using the arrowup key.
				focusPrevious: 'arrowup',

				// Navigate toolbar items forwards using the arrowdown key.
				focusNext: 'arrowdown',
			}
		} );

		this.template = new Template( {
			tag: 'ul',

			attributes: {
				class: [
					'ck-reset',
					'ck-list'
				]
			},

			children: this.items
		} );

		this.items.on( 'add', ( evt, item ) => {
			this.focusTracker.add( item.element );
		} );

		this.items.on( 'remove', ( evt, item ) => {
			this.focusTracker.remove( item.element );
		} );
	}

	/**
	 * @inheritDoc
	 */
	init() {
		// Start listening for the keystrokes coming from #element.
		this.keystrokes.listenTo( this.element );

		return super.init();
	}

	/**
	 * Focuses the first focusable in {@link #items}.
	 */
	focus() {
		this._focusCycler.focusFirst();
	}

	/**
	 * Focuses the last focusable in {@link #items}.
	 */
	focusLast() {
		this._focusCycler.focusLast();
	}
}