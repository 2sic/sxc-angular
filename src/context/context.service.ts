import { WindowWith$2sxc, SxcRoot } from '@2sic.com/2sxc-typings';
import { ElementRef, Injectable } from '@angular/core';
import { appTag } from '../names';
import { ContextInfo } from './context-info';
import { AppTagService } from './apptag.service'

declare const window: WindowWith$2sxc;

const runtimeDefaults: Partial<ContextInfo> = {
    addHttpHeaders: true
};

@Injectable({
    providedIn: 'root',
})
export class Context {

    $2sxc: SxcRoot;
    contextInfo: ContextInfo;
    appTagService: AppTagService;

    constructor(
        // @Optional() private runtimeSettings: ContextInfo
    ) {
        this.$2sxc = window.$2sxc;
        if (this.$2sxc === undefined) {
            throw new Error('window.$2sxc is null - you probably forgot to include the script before loading angular');
        }
    }

    /**
     * Configure 2sxc in the context of a HTMLNode.
     * @param htmlNode the HTMLNode
     */
    autoConfigure(htmlNode: ElementRef) {

        this.appTagService = new AppTagService(htmlNode);

        let settings = {
            ...runtimeDefaults, // defaults - lowest priority
            // ...this.runtimeSettings, // use specified runtime settings
            ...this.getContextFromAppTag() // app tags override settings
        } as ContextInfo;

    
        settings.sxc = this.$2sxc(htmlNode.nativeElement);
        if (!settings.sxc) {
            throw new Error('couldn\'t get sxc instance - reason unknown');
        }

        this.contextInfo = settings;
    }

    /**
     * Get context information like module-id from the app-root tag
     * new in Dnn-Sxc-Angular 8
     */
    private getContextFromAppTag() : Partial<ContextInfo> {

        let contextFromApp = {
            // 2019-09-29 2dm important now
            edition: this.appTagService.getTag(appTag.edition),
            apiEdition: this.appTagService.getTag(appTag.apiEdition)
        }

        // Return an object containing only the not-null properties
        return contextFromApp;
    }

}
