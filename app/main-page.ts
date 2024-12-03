import { EventData } from '@nativescript/core';
import { Page } from '@nativescript/core';

export function onNavigatingTo(args: EventData) {
    const page = <Page>args.object;
}