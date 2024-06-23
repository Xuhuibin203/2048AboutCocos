import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('NumberXY')
export class NumberXY extends Component {
    myNumber: number;
    myOrder: number;
}


