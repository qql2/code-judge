import { Kit } from './kit';

export class CodeJudge {
    constructor() {
    }
    static IsInAnyCodeBlock(markdown:string,index: number) {
        let mutiCodePos = this.getMutiCode(markdown);
        let midCodePos = this.getMidleCode(markdown,mutiCodePos);
        let littleCodePos = this.getLitleCode(markdown,mutiCodePos, midCodePos);
        let IsInMutiCode = this.IsInSomeCode(mutiCodePos)
        let IsInMidCode = this.IsInSomeCode(midCodePos);
        let IsInLittleCode = this.IsInSomeCode(littleCodePos);
        if (IsInMutiCode(index) || IsInMidCode(index) || IsInLittleCode(index)) return true;
        return false
    }
    /** 获得所有大代码块(即```代码块)的位置索引 */
    static getMutiCode(markdown:string): number[] {
        let codesOfs: number[] = [];
        let rgx = /(?<=\n)( |\t)*(```)/g;
        markdown.replace(rgx, (word, ...args) => {
            codesOfs.push(args.slice(-2)[0]);
            return word;
        })
        return codesOfs;
    }
    /** 获得所有中代码块(即``代码块)的位置索引 */
    static getMidleCode(markdown:string,mutiCodeOfs?: number[]) {
        if (!mutiCodeOfs) { mutiCodeOfs = this.getMutiCode(markdown) }
        const rgx = /(``).+?(``)/g
        let midlecodePos: number[] = [];
        let IsInMutiCode = this.IsInSomeCode(mutiCodeOfs);
        //@ts-ignore
        markdown.replace(rgx, (word, ...args) => {
            let index = args.slice(-2)[0]
            if (IsInMutiCode(index)) return word;
            let start = index;
            let end = index + word.length;
            midlecodePos.push(start, end);
        })
        //@ts-ignore
        IsInMutiCode = null;
        return midlecodePos;
    }
    /**  获得所有小代码块(即`代码块)的位置索引 */
    static getLitleCode(markdown:string,mutiCodeOfs?: number[], midCodePos?: number[]) {
        if (!mutiCodeOfs) { mutiCodeOfs = this.getMutiCode(markdown) }
        if (!midCodePos) { midCodePos = this.getMidleCode(markdown,mutiCodeOfs) }

        const rgx = /((?<!`)`)(.(?<!`))+(`(?!`))/g
        let litleCodePos: number[] = [];
        let IsInMutiCode = this.IsInSomeCode(mutiCodeOfs);
        let IsInMidCode = this.IsInSomeCode(midCodePos);
        markdown.replace(rgx, (word, ...args) => {
            let index = args.slice(-2)[0]
            if (IsInMutiCode(index)) return word;
            if (IsInMidCode(index)) return word;
            let start = index;
            let end = index + word.length;
            litleCodePos.push(start, end);
            return word;
        })
        //@ts-ignore
        IsInMutiCode=null;
        return litleCodePos;
    }
    protected static IsInSomeCode(Codes: number[]) {
        let search = Kit.binarySearchInOrder(Codes)
        return (index: number) => {
            let rst = search(index);
            /*查找成功*/
            if (rst.mid != -1) return false;
            /* 左边越界 */
            if (rst.low == -1) return false;
            /* 左边有奇数个代码块记号 */
            if (rst.low % 2 == 0) return true;
            return false;
        }
    }
}