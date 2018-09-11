export interface InitRange {
    minValue: number;
    maxValue: number;
    minSelected: number;
    maxSelected: number;
    step: number;
    firstBase: number;
    secondBase: number;
}

export interface InitHandler {
    isHandlerActive: boolean;
    isTouchEventStart: boolean;
    isMouseEventStart: boolean;
}
