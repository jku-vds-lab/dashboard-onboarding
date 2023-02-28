import { Report, Page } from "powerbi-client";
import ComponentGraph from "../../componentGraph/ComponentGraph";

export const footerHeight = 37;
export const filterClosedWidth = 32;
export const filterOpenedWidth = 248;

export const guidedTourButtonWidth = 150;
export const explorationModeButtonWidth = 250;
export const darkOutlineButtonClass = "btn btn-outline-dark";
export const onboardingButtonStyle =  "margin:10px;";

export const infoCardMargin = 10;
export const infoCardWidth = 500;
export const introCardMargin = 60;
export const introCardWidth = 500;
export const interactionCardWidth = 500;
export const interactionCardHeight = 300;
export const hintCardMargin = 5;
export const hintCardWidth = 200;
export const editCardMargin = 0;
export const editCardWidth = 500;

export let settings: Settings;
export let componentGraph: ComponentGraph;
export let report: Report;
export let currentVisuals: any[];
export let allVisuals: any[];
export let page: Page;
export let selectedTargets: Target[];

export let explorationMode = false;
export let isGuidedTour = false;
export let interactionMode = false;

export let currentVisualIndex: number;
export let showsDashboardInfo = false;

export let containerPaddingTop: number;
export let containerPaddingLeft: number;
export let onboardingOffset: number;

export let draggableElement: any | null;
export let posX: number | null = 0;
export let posY: number | null = 0;
export let placeholderElement: any;
export let draggingStarted: boolean | null = false;

export enum infoStatus {
    original = "original",
    changed = "changed",
    added = "added",
    deleted = "deleted",
}

export interface ReportOffset{ 
    top: number;
    left: number;
    right: number;
    bottom: number;
}

export interface SettingsVisual{
    id: string;
    title: string | undefined;
    disabled: boolean;
    generalInfosStatus: string[];
    interactionInfosStatus: string[];
    insightInfosStatus: string[];
    changedGeneralInfos: string[];
    changedInteractionInfos: string[];
    changedInsightInfos: string[];
}

export interface Target{
    equals: string;
    target: {
        column: string;
        table: string;
    }
}

export interface Settings{
    reportOffset: ReportOffset;
    visuals: SettingsVisual[];
    filterVisual: FilterVisual;
    interactionExample: InteractionExample;
}

export interface FilterVisual{
    title: string | undefined;
    generalInformation: string | undefined;
    filterInfosStatus: string[];
    changedFilterInfos: string[];
}

export interface InteractionExample{
    title: string | undefined;
    generalInfoStatus: string;
    changedGeneralInfo: string;
    nextVisualHint: string | undefined;
    visuals: InteractionVisual[];
}

export interface InteractionVisual{
    id: string;
    title: string;
    clickInfosStatus: string | null;
    changedClickInfo: string | null;
    interactionChangedInfosStatus: string | null;
    changedInteractionChangedInfo: string | null;
}

export function createSettingsObject(){
    const settings : Settings = {
        reportOffset: createReportOffset(),
        visuals: [] as SettingsVisual[],
        filterVisual: createFilterVisual(),
        interactionExample: createInteractionExample()
    }
    return settings;
}

export function createReportOffset(){
    const offset: ReportOffset = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    }
    return offset;
}

export function createVisual(){
    return {
        id: "",
        title: "",
        disabled: false,
        generalInfosStatus: [] as string[],
        interactionInfosStatus: [] as string[],
        insightInfosStatus: [] as string[],
        changedGeneralInfos: [] as string[],
        changedInteractionInfos: [] as string[],
        changedInsightInfos: [] as string[]
    };
}

export function createFilterVisual(){
    return {
        title: "",
        generalInformation: "",
        filterInfosStatus: [] as string[],
        changedFilterInfos: [] as string[]
    }
}

export function createInteractableVisualCard(){
    return {
        id: "",
        title: "",
        clickInfosStatus: null,
        changedClickInfo: null,
        interactionChangedInfosStatus: "",
        changedInteractionChangedInfo: ""
    }
}

export function createInteractableVisualSlicer(){
    return {
        id: "",
        title: "",
        clickInfosStatus: "",
        changedClickInfo: "",
        interactionChangedInfosStatus: null,
        changedInteractionChangedInfo: null
    }
}

export function createInteractableVisual(){
    return {
        id: "",
        title: "",
        clickInfosStatus: "",
        changedClickInfo: "",
        interactionChangedInfosStatus: "",
        changedInteractionChangedInfo: ""
    }
}

export function createInteractionExample(){
   return {
        title: "",
        generalInfoStatus: "",
        changedGeneralInfo: "",
        nextVisualHint: "",
        visuals: [] as InteractionVisual[]
   }
}

export function setSettings(newSettings: Settings){
    settings = newSettings;
}

export function setComponentGraph(newComponentGraph: ComponentGraph){
    componentGraph = newComponentGraph;
}

export function setReport(newReport: Report){
    report = newReport;
}
export function setVisuals(newCurrentVisuals: any[]){
    currentVisuals = newCurrentVisuals;
}
export function setAllVisuals(newAllVisuals: any[]){
    allVisuals = newAllVisuals;
}
export function setPage(newPage: Page){
    page = newPage;
}
export function setSelectedTargets(newSelectedTargets: Target[]){
    selectedTargets = newSelectedTargets;
}

export function setExplorationMode(newExplorationMode: boolean){
    explorationMode = newExplorationMode;
}
export function setIsGuidedTour(newIsGuidedTour: boolean){
    isGuidedTour = newIsGuidedTour;
}
export function setInteractionMode(newInteractionMode: boolean){
    interactionMode = newInteractionMode;
}

export function setCurrentVisualIndex(newCurrentVisualIndex: number){
    currentVisualIndex = newCurrentVisualIndex;
}

export function setShowsDashboardInfo(newShowsDashboardInfo: boolean){
    showsDashboardInfo = newShowsDashboardInfo;
}

export function setContainerPaddingTop(newContainerPaddingTop: number){
    containerPaddingTop = newContainerPaddingTop;
}
export function setContainerPaddingLeft(newContainerPaddingLeft: number){
    containerPaddingLeft = newContainerPaddingLeft;
}
export function setOnboardingOffset(newOnboardingOffset: number){
    onboardingOffset = newOnboardingOffset;
}

export function setDraggableElement(newDraggableElement: any | null){
    draggableElement = newDraggableElement;
}
export function setPosX(newPosX: number | null){
    posX = newPosX;
}
export function setPosY(newPosY: number | null){
    posY = newPosY;
}
export function setPlaceholderElement(newPlaceholderElement: HTMLDivElement){
    placeholderElement = newPlaceholderElement;
}
export function setDraggingStarted(newDraggingStarted: boolean){
    draggingStarted = newDraggingStarted;
}

export function createDivAttributes(){
    return { 
        id: "",
        style: "",
        classes: "",
        content: "",
        role: "",
        label: "",
        clickable: false,
        selectedTargets: {},
        eventType: "",
        eventFunction: {},
        parentId: ""
    };
}

export function createButtonAttributes(){
    return { 
        id: "",
        content: "",
        style: "",
        classes:  "",
        function: {},
        parentId: ""
    };
}

export function createSpanAttributes(){
    return { 
        id: "",
        content: "",
        hidden: "false",
        parentId: ""
    };
}

export function createH1Attributes(){
    return { 
        id: "",
        content: "",
        style: "",
        parentId: ""
    }
}

export function createH2Attributes(){
    return { 
        id: "",
        content: "",
        style: "",
        parentId: ""
    }
}

export function createULAttributes(){
    return { 
        id: "",
        classes: "",
        role: "",
        parentId: ""
    }
}

export function createLIAttributes(){
    return { 
        id: "",
        classes: "",
        parentId: ""
    }
}

export function createAnchorAttributes(){
    return { 
        id: "",
        classes: "",
        href: "",
        content: "",
        selected: "",
        controles: "",
        toggle: "",
        role: "",
        parentId: ""
    }
}

export function createTabAnchorAttributes(){
    return { 
        id: "",
        href: "",
        content: "",
        parentId: ""
    }
}

export function createLabelAttributes(){
    return { 
        id: "",
        for: "",
        style: "",
        content: "",
        parentId: ""
    }
}

export function createSmallAttributes(){
    return { 
        id: "",
        style: "",
        content: "",
        parentId: ""
    }
}

export function createInputAttributes(){
    return { 
        id: "",
        type: "",
        style: "",
        value: "",
        parentId: ""
    }
}

export function createTextareaAttributes(){
    return { 
        id: "",
        class: "",
        style: "",
        value: "",
        parentId: ""
    }
}



