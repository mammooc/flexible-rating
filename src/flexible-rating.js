
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

import '@polymer/polymer/lib/elements/dom-repeat.js';
import '@polymer/polymer/lib/elements/custom-style.js';
import { IronFormElementBehavior } from '@polymer/iron-form-element-behavior/iron-form-element-behavior.js';
import { IronValidatableBehavior } from '@polymer/iron-validatable-behavior/iron-validatable-behavior.js';
import { IronA11yKeysBehavior } from '@polymer/iron-a11y-keys-behavior/iron-a11y-keys-behavior.js';
import { IronControlState } from '@polymer/iron-behaviors/iron-control-state.js';
import '@polymer/iron-icons/iron-icons.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';

/**
An element providing a star rating that allows fractions.

Example 1:

<flexible-rating value="3.6" disabled="true">
</flexible-rating>

Example 2:

<flexible-rating value="4" icon="icons:favorite">
</flexible-rating>

### Styling

`<flexible-rating>` provides the following custom properties and mixins
for styling:

Custom property | Description | Default
----------------|-------------|----------
`--flexible-rating-filled-color` | Fill color of the selected rating shapes | #ffac33
`--flexible-rating-unfilled-color` | Fill color of remaining rating shapes | #ccd6dd
`--iron-icon-height` | height of one icon (e.g. star) |
`--iron-icon-width` | width of one icon (e.g. star) |

@demo demo/index.html
@element flexible-rating
*/
class FlexibleRating extends mixinBehaviors([
    IronFormElementBehavior,
    IronValidatableBehavior,
    IronA11yKeysBehavior,
    IronControlState
], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
              cursor: default;
              -webkit-touch-callout: none;
              -webkit-user-select: none;
              -khtml-user-select: none;
              -moz-user-select: none;
              -ms-user-select: none;
              user-select: none;
              display: inline-block;
            }

            :host(:focus) {
                outline-color: var(--flexible-rating-filled-color, #ffac33);
            }

            .star-wrapper {
                display: inline-block;
            }

            .star-wrapper > span {
              display: inline-block;
              position: relative;
              color: var(--flexible-rating-unfilled-color, #ccd6dd);
            }

            .star-wrapper > span > span {
              display: block;
              position: absolute;
              top: 0;
              bottom: 0;
              overflow: hidden;
              color: var(--flexible-rating-filled-color, #ffac33);
            }

            /* Select all stars up to the hovered one */

            :host(:not([disabled])) .star-wrapper:hover > span{
                cursor: pointer;
            }

            /* Show all stars */
            :host(:not([disabled])) .star-wrapper:hover span > span {
                width: 100% !important;
            }

            :host([invalid]) {
              outline: red auto 5px;
            }

            /* Hide all after the hovered one */
            :host(:not([disabled])) .star-wrapper:hover > span:hover ~ span > span {
                width: 0 !important;
            }

        </style>
        <!-- local DOM goes here -->
        <div class="star-wrapper">
            <template is="dom-repeat" items="{{_possibleValues}}"><!--
                --><span on-tap="_starClicked" data-star-id\$="{{index}}"><!--
                    --><iron-icon icon="{{icon}}"></iron-icon><!--
                    --><span style\$="width:[[_calculateWidth(index, value)]]"><!--
                        --><iron-icon icon="{{icon}}"></iron-icon><!--
                    --></span><!--
                --></span><!--
            --></template>
        </div>
`;
    }

    static get is() {
        return 'flexible-rating';
    }

    static get properties() {
        return {
          /**
           *   The maximum number of stars possible.
           *   @type {number}
           */
            max: {
                type: Number,
                value: 5,
                notify: true
            },

          /**
           *   The number of stars that are marked. Can be a float and can show partial stars.
           *   @type {number}
           */
            value: {
                type: Number,
                value: 0,
                notify: true,
                reflectToAttribute: true
            },

          /**
           *   The name of the iron icon element
           *   @type {string}
           **/
            icon: {
                type: String,
                value: 'icons:star'
            },

            _possibleValues: {
                type: Array,
                computed: '_computePossibleValues(max)'
            }
        };
    }

    static get observers() {
        return [
            '_updateAria(value, max)'
        ];
    }

    get keyBindings() {
        return {
            'left down pagedown home': '_decrementKey',
            'right up pageup end': '_incrementKey'
        };
    }

    _updateAria(value, max) {
        if (!(max === undefined || value === undefined)) {
            this.setAttribute('aria-valuemin', 1);
            this.setAttribute('aria-valuemax', max);
            this.setAttribute('aria-valuenow', value);
        }
    }

    _updateValue(value) {
        if (value < 1)
            value = 1;
        if (value > this.max)
            value = this.max;

        this.setAttribute('value', value);
    }

    _increment() {
        this._updateValue(Math.floor(this.value) + 1);
    }

    _decrement() {
        this._updateValue(Math.ceil(this.value) - 1);
    }

    _incrementKey(event) {
        if (!this.disabled) {
            event.detail.keyboardEvent.preventDefault();
            if (event.detail.key === 'end') {
                this._updateValue(this.max);
            } else {
                this._increment();
            }
        }
    }

    _decrementKey(event) {
        if (!this.disabled) {
            event.detail.keyboardEvent.preventDefault();
            if (event.detail.key === 'home') {
                this._updateValue(1);
            } else {
                this._decrement();
            }
        }
    }

    _getValidity() {
        return this.value !== 0;
    }

    ready() {
        this._ensureAttribute('role', 'slider');
        this._ensureAttribute('tabindex', 0);
        this._ensureAttribute('area-hidden', 'true');
        super.ready();
    }

    _computePossibleValues(max) {
        let values = [];
        for (let i = 1; i <= max; i++) {
            values.push(i);
        }
        return values;
    }

    _calculateWidth(star, value) {
        if (value >= star + 1) {
            return '100%';
        } else if (value - star >= 0) {
            return (value - star) * 100 + '%';
        } else return '0%';
    }

    _starClicked(e) {
        if (this.disabled)
            return;

        let star;
        if (e.currentTarget.dataset !== undefined)
            star = parseInt(e.currentTarget.dataset.starId);
        else
          star = parseInt(e.currentTarget.getAttribute('data-star-id'));
        this._updateValue(star + 1);
    }
}

// Register custom element definition using standard platform API
customElements.define(FlexibleRating.is, FlexibleRating);
