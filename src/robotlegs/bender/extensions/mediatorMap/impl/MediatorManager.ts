// ------------------------------------------------------------------------------
//  Copyright (c) 2016 Goodgame Studios. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------
import {IMediatorMapping} from "../api/IMediatorMapping";
import {MediatorFactory} from "./MediatorFactory";
import DisplayObject = egret.DisplayObject;
import Event = egret.Event;

/**
 * @private
 */
export class MediatorManager {

    /*============================================================================*/
    /* Private Properties                                                         */
    /*============================================================================*/

    private _factory: MediatorFactory;

    /*============================================================================*/
    /* Constructor                                                                */
    /*============================================================================*/

    /**
     * @private
     */
    constructor(factory: MediatorFactory) {
        this._factory = factory;
    }


    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * @private
     */
    public addMediator(mediator: any, item: any, mapping: IMediatorMapping): void {
        let displayObject = item as DisplayObject;

        // Watch Display Object for removal
        if (displayObject && mapping.autoRemoveEnabled)
            displayObject.addEventListener(Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);

		// Synchronize with item life-cycle
        this.initializeMediator(mediator, item);
    }

    /**
     * @private
     */
    public removeMediator(mediator: any, item: any, mapping: IMediatorMapping): void {
        if (item instanceof DisplayObject)
            (<DisplayObject>item).removeEventListener(Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);

        this.destroyMediator(mediator);
    }

    /*============================================================================*/
    /* Private Functions                                                          */
    /*============================================================================*/

    private onRemovedFromStage(event: Event): void {
        this._factory.removeMediators(event.target);
    }


    private initializeMediator(mediator: any, mediatedItem: any): void {
        if ('preInitialize' in mediator)
            mediator.preInitialize();

        if ('view' in mediator)
            mediator.view = mediatedItem;

        if ('initialize' in mediator)
            mediator.initialize();

        if ('postInitialize' in mediator)
            mediator.postInitialize();
    }

    private destroyMediator(mediator: any): void {
        if ('preDestroy' in mediator)
            mediator.preDestroy();

        if ('destroy' in mediator)
            mediator.destroy();

        if ('view' in mediator)
            mediator.view = null;

        if ('postDestroy' in mediator)
            mediator.postDestroy();
    }
}
