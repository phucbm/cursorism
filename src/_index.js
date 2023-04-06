import {uniqueId} from './utils'
import {assignEventListeners, assignHoverEvents, watchMousePosition} from './mouse-position'
import {createCursor} from "./helpers";

class Cursor{
    constructor(options){
        // config
        this.config = {
            dev: false, // show console log

            id: uniqueId('css-cursor-'),
            speed: .2, // cursor easing speed, the smaller, the slower

            container: document.body, // where to append cursor HTML
            className: '',
            innerHMTL: '',

            // add class to cursor when hovering on specific items
            hover: [
                {
                    selectors: '.item', // items to detect cursor hover
                    className: 'is-item-hover' // class added on hover
                }
            ],

            // magnetic options
            attraction: .2, // 1 is weak, 0 is strong
            distance: 100, // magnetic area around element count from center [px]

            // on cursor position update
            onUpdate: data => {
            },

            ...options,
        }

        if(!this.config.container){
            console.warn('Container is not defined!', this.config.container);
            return;
        }

        // classes
        this._class = {
            wrapper: 'css-cursor',
            inner: 'css-cursor-inner',
            isHover: 'is-hover',
            hoverEnabled: 'css-cursor-hover-enabled'
        };

        // data
        this.id = this.config.id;
        this.mouse = {x: 0, y: 0};
        this.cursor = undefined;

        createCursor(this);
        watchMousePosition(this);
        assignEventListeners(this);
    }


    /**
     * Method: update()
     * @param config
     */
    update(config){
        this.config = {...this.config, ...config}
    }

    destroy(){
        // remove from DOM
        this.cursor.remove();

        // remove instance
        window.CSSCursorController.remove(this.id);

        if(this.config.dev) console.log(`cursor #${this.id} removed`)
    }

    refresh(){
        // assign new hover selectors
        assignHoverEvents(this);
    }
}


/**
 * Private class Controller
 * This class will hold instances of the library's objects
 */
class Controller{
    constructor(){
        this.instances = [];
    }

    remove(id){
        this.instances = this.instances.filter(x => x.id !== id);
    }

    add(instance){
        this.instances.push(instance);
    }

    get(id){
        return this.instances.filter(instance => instance.id === id)[0];
    }
}


/**
 * Public library data
 * access via window.CSSCursorController
 */
window.CSSCursorController = new Controller();


/**
 * Public library object
 * access via window.CSSCursor
 */
window.CSSCursor = {
    // init new instances
    create: (options = {}) => window.CSSCursorController.add(new Cursor(options)),

    // Get instance object by ID
    get: id => window.CSSCursorController.get(id)
};