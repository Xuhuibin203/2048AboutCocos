import { _decorator, Component, EventKeyboard, input, Input, KeyCode, Node, UITransform, Sprite, Prefab, instantiate, Label, find } from 'cc';
import { NumberXY } from './NumberXY';
const { ccclass, property } = _decorator;

@ccclass('gameRoot')
export class gameRoot extends Component {
    @property(Node) gameRoot: Node;
    @property(Node) location: Node;
    @property(Prefab) numberPrefab: Prefab;

    numberCount: number = 0; //场上数字的个数，会减少
    numberOrder: number = 1; //数字的编号，不会减少

    array2D: number[][] = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    start() {
        this.createNumber();
        this.createNumber();
        input.on(Input.EventType.KEY_DOWN, this.onTouchDown, this);

    }
    //上0右1下2左3
    onTouchDown(event: EventKeyboard) {
        if (event.keyCode === KeyCode.KEY_A) {
            this.playNumber(3);
        } else if (event.keyCode === KeyCode.KEY_D) {
            this.playNumber(1);
        } else if (event.keyCode === KeyCode.KEY_W) {
            this.playNumber(0);
        } else if (event.keyCode === KeyCode.KEY_S) {
            this.playNumber(2);
        }
    }

    //防止生成在重复的位置
    createOneRandom() {
        let f = true;
        while (f) {
            const randomNumber = Math.floor(Math.random() * 16);
            const randomY = randomNumber % 4;   //Y
            const randomX = Math.floor(randomNumber / 4);     //X
            if (this.array2D[randomX][randomY] === 0) return randomNumber;
        }
    }

    createNumber() {
        console.log("createNumber");
        const randomNumber = this.createOneRandom();
        const randomX = randomNumber % 4;   //X
        const randomY = Math.floor(randomNumber / 4);     //Y
        const numberNode = instantiate(this.numberPrefab);  //克隆预制体

        this.array2D[randomY][randomX] = 2;

        //根据随机出来的位置计算出在屏幕上的位置
        const posX = randomX * 140 - 210;
        const posY = 510 - randomY * 140;

        numberNode.setPosition(posX, posY);

        //记录当前数字的位置
        let XY = numberNode.addComponent(NumberXY);
        XY.myNumber = randomNumber;
        XY.myOrder = this.numberOrder++;

        //显示数字
        const labelComponent = numberNode.getComponent(Label);
        labelComponent.string = this.array2D[randomY][randomX].toString();

        this.node.addChild(numberNode);
        this.numberCount++;
    }

    checkSpace(): number {
        let ans = 0;
        for (let i = 0; i < 4; i++)
            for (let j = 0; j < 4; j++)
                if (this.array2D[i][j] === 0)
                    ans++;
        return ans;
    }

    playNumber(dir: number) {
        if (dir === 0) {
            //合并
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 4; j++) {
                    if (this.array2D[i][j] === 0) continue;
                    let ans = this.checkMerge(dir, i, j, i + 1, j, -1);
                    // console.log("ans:", ans, "i:", i, "j:", j);
                    if (ans === -1) continue;
                    this.changeAnim(i * 4 + j, ans);
                    this.numberCount--;
                }
            }
            // console.log("mergeafter", this.array2D);
            //移动
            for (let i = 1; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    if (this.array2D[i][j] === 0) continue;
                    let ans = this.checkMove(dir, i, j, i - 1, j, -1);
                    if (ans === -1) continue;
                    console.log("move:", i * 4 + j, "to", ans);
                    this.moveNumber(i * 4 + j, ans);
                }
            }
            // console.log("moveafter", this.array2D);
        }
        if (dir === 1) {
            //合并
            for (let i = 0; i < 4; i++) {
                for (let j = 3; j > 0; j--) {
                    if (this.array2D[i][j] === 0) continue;
                    let ans = this.checkMerge(dir, i, j, i, j - 1, -1);
                    if (ans === -1) continue;
                    this.changeAnim(i * 4 + j, ans);
                    this.numberCount--;
                }
            }
            //移动
            for (let i = 0; i < 4; i++) {
                for (let j = 2; j >= 0; j--) {
                    if (this.array2D[i][j] === 0) continue;
                    let ans = this.checkMove(dir, i, j, i, j + 1, -1);
                    if (ans === -1) continue;
                    console.log("move:", i * 4 + j, "to", ans);
                    this.moveNumber(i * 4 + j, ans);
                }
            }
            // console.log("moveafter", this.array2D);
        }
        if (dir === 2) {
            //合并
            for (let i = 3; i > 0; i--) {
                for (let j = 0; j < 4; j++) {
                    if (this.array2D[i][j] === 0) continue;
                    let ans = this.checkMerge(dir, i, j, i - 1, j, -1);
                    if (ans === -1) continue;
                    this.changeAnim(i * 4 + j, ans);
                    this.numberCount--;
                }
            }
            //移动
            for (let i = 2; i >= 0; i--) {
                for (let j = 0; j < 4; j++) {
                    if (this.array2D[i][j] === 0) continue;
                    let ans = this.checkMove(dir, i, j, i + 1, j, -1);
                    if (ans === -1) continue;
                    this.moveNumber(i * 4 + j, ans);
                }
            }
            console.log("moveafter", this.array2D);
        }
        if (dir === 3) {
            //合并
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 3; j ++) {
                    if (this.array2D[i][j] === 0) continue;
                    let ans = this.checkMerge(dir, i, j, i, j + 1, -1);
                    if (ans === -1) continue;
                    this.changeAnim(i * 4 + j, ans);
                    this.numberCount--;
                }
            }
            //移动
            for (let i = 0; i < 4; i++) {
                for (let j = 1; j < 4; j++) {
                    if (this.array2D[i][j] === 0) continue;
                    let ans = this.checkMove(dir, i, j, i, j - 1, -1);
                    if (ans === -1) continue;
                    console.log("move:", i * 4 + j, "to", ans);
                    this.moveNumber(i * 4 + j, ans);
                }
            }
        }
        this.createNumber();
    }

    moveNumber(start: number, end: number) {
        this.node.children.forEach(element => {
            const numberXY = element.getComponent(NumberXY);
            if (numberXY.myNumber === start) {
                element.setPosition((end % 4) * 140 - 210, 510 - Math.floor(end / 4) * 140);
                numberXY.myNumber = end;
            }
        })
    }

    checkMove(dir: number, x: number, y: number, dx: number, dy: number, ans: number): number {
        if (this.array2D[dx][dy] !== 0) return ans;
        if (dir === 0) {
            this.array2D[dx][dy] = this.array2D[x][y];
            this.array2D[x][y] = 0;
            ans = dx * 4 + dy;
            if (dx === 0) return ans;
            ans = this.checkMove(dir, dx, dy, dx - 1, dy, ans);
        }
        if (dir === 1) {
            this.array2D[dx][dy] = this.array2D[x][y];
            this.array2D[x][y] = 0;
            ans = dx * 4 + dy;
            if (dy === 0) return ans;
            ans = this.checkMove(dir, dx, dy, dx, dy + 1, ans);
        }
        if (dir === 2) {
            this.array2D[dx][dy] = this.array2D[x][y];
            this.array2D[x][y] = 0;
            ans = dx * 4 + dy;
            if (dx === 3) return ans;
            ans = this.checkMove(dir, dx, dy, dx + 1, dy, ans);
        }
        if(dir === 3) {
            this.array2D[dx][dy] = this.array2D[x][y];
            this.array2D[x][y] = 0;
            ans = dx * 4 + dy;
            if (dy === 0) return ans;
            ans = this.checkMove(dir, dx, dy, dx, dy - 1, ans);
        }
        return ans;
    }

    //将 数字 合并到 指定位置 并 清空原位置
    changeAnim(doubleNumber: number, clearNumber: number) {
        let doubleNode = null;
        this.node.children.forEach(element => {
            const numberXY = element.getComponent(NumberXY);
            if (numberXY.myNumber === doubleNumber) {
                doubleNode = element.getComponent(Label);
                doubleNode.string = (Number(doubleNode.string) * 2).toString();
            }
        })
        this.node.children.forEach(element => {
            const numberXY = element.getComponent(NumberXY);
            if (numberXY.myNumber === clearNumber) {
                element.removeFromParent();
            }
        })
    }

    //检查当前方向 是否 有合法合并
    checkMerge(dir: number, x: number, y: number, dx: number, dy: number, ans: number): number {
        if (dir === 0) {
            if (this.array2D[x][y] === this.array2D[dx][dy]) {
                this.array2D[x][y] *= 2;
                this.array2D[dx][dy] = 0;
                ans = dx * 4 + dy;
                return ans;
            }
            if (this.array2D[dx][dy] === 0 && dx !== 3) ans = this.checkMerge(dir, x, y, dx + 1, dy, ans);
        }
        if (dir === 1) {
            if (this.array2D[x][y] === this.array2D[dx][dy]) {
                this.array2D[x][y] *= 2;
                this.array2D[dx][dy] = 0;
                ans = dx * 4 + dy;
                return ans;
            }
            if (this.array2D[dx][dy] === 0 && dy !== 0) ans = this.checkMerge(dir, x, y, dx, dy - 1, ans);
        }
        if (dir === 2) {
            if (this.array2D[x][y] === this.array2D[dx][dy]) {
                this.array2D[x][y] *= 2;
                this.array2D[dx][dy] = 0;
                ans = dx * 4 + dy;
                return ans;
            }
            if (this.array2D[dx][dy] === 0 && dx !== 0) ans = this.checkMerge(dir, x, y, dx - 1, dy, ans);
        }
        if(dir === 3){
            if (this.array2D[x][y] === this.array2D[dx][dy]) {
                this.array2D[x][y] *= 2;
                this.array2D[dx][dy] = 0;
                ans = dx * 4 + dy;
                return ans;
            }
            if (this.array2D[dx][dy] === 0 && dy !== 3) ans = this.checkMerge(dir, x, y, dx, dy + 1, ans);
        }
        return ans;
    }
}