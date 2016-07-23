import {createSelector} from 'reselect';

export const webvr = state => state.webvr;
export const settings = state => state.settings;
export const app = state => state.app;

export const timestamp = state => state.app.timestamp;

export const standingMatrix = createSelector(webvr, webvr => webvr.standingMatrix);
