import { Kit } from './kit';

export class CodeBlockJudge {
    markdown: string;
    private paragraphCodeIndexes: number[] | undefined;
    private inlineBigCodeIndexes: number[] | undefined;
    private middleCodeIndexes: number[] | undefined;
    private littleCodeIndexes: number[] | undefined;
    constructor(markdown: string) {
        this.markdown = markdown;
    }
    IsInAnyCodeBlock(index: number) {
        let paragraphCodeIndexes = this.getParagraphCode();
        let inLineBigCodeIndexes = this.getInlineBigCode()
        let midCodePos = this.getMiddleCode();
        let littleCodePos = this.getLittleCode();
        let IsInInParagraphCode = this.IsInSomeCode(paragraphCodeIndexes)
        let isInInlineBigCode = this.IsInSomeCode(inLineBigCodeIndexes)
        let IsInMidCode = this.IsInSomeCode(midCodePos);
        let IsInLittleCode = this.IsInSomeCode(littleCodePos);
        if (IsInInParagraphCode(index) || isInInlineBigCode(index) || IsInMidCode(index) || IsInLittleCode(index)) return true;
        return false
    }

    /** 获得所有段落代码块的位置索引 */
    getParagraphCode(): number[] {
        if (this.paragraphCodeIndexes) return this.paragraphCodeIndexes
        let codesIndexes: number[] = [];
        let rgx = /(?<=\n)( |\t)*(`{3,})[^`\n]*\n/g;
        this.markdown.replace(rgx, (word, ...args) => {
            codesIndexes.push(args.slice(-2)[0]);
            return word;
        })
        this.paragraphCodeIndexes = codesIndexes
        return codesIndexes;
    }
    getInlineBigCode(): number[] {
        if (this.inlineBigCodeIndexes) return this.inlineBigCodeIndexes
        let paragraphCodeIndexes = this.getParagraphCode()
        let inlineBigCodeIndexes: number[] = [];
        let rgx = /(?<!`)(```)([^\n`]|(?<!`)(`|``)(?!`))*(```)(?!`)/g
        this.markdown.replace(rgx, (word, ...args) => {
            let index = args.slice(-2)[0]
            if (this.IsInSomeCode(paragraphCodeIndexes as number[])(index)) return word
            inlineBigCodeIndexes.push(index, index + word.length - 3);
            return word
        })
        this.inlineBigCodeIndexes = inlineBigCodeIndexes
        return inlineBigCodeIndexes
    }
    /** 获得所有中代码块(即``代码块)的位置索引 */
    getMiddleCode(): number[] {
        if (this.middleCodeIndexes) return this.middleCodeIndexes
        let paragraphCodeIndexes = this.getParagraphCode()
        let inlineBigCodeIndexes = this.getInlineBigCode()
        const rgx = /(?<!`)(``)([^\n`]|(?<!`)`(?!`))*(``|\n|$)(?!`)/g
        let middleCodeIndexes: number[] = [];
        let isInParagraphCode = this.IsInSomeCode(paragraphCodeIndexes);
        let isInInlineBigCode = this.IsInSomeCode(inlineBigCodeIndexes);
        this.markdown.replace(rgx, (word, ...args) => {
            let index = args.slice(-2)[0]
            if (isInParagraphCode(index) || isInInlineBigCode(index)) return word;
            let start = index;
            let end: number
            switch (word.slice(-1)[0]) {
                /* ``代码块会被换行符切断 */
                case '`': end = index + word.length - 2
                    break;
                case '\n': end = index + word.length - 1
                default:
                    end = index + word.length
            }
            middleCodeIndexes.push(start, end);
            return word
        })
        this.middleCodeIndexes = middleCodeIndexes;
        return middleCodeIndexes;
    }
    /**  获得所有小代码块(即`代码块)的位置索引 */
    getLittleCode() {
        if (this.littleCodeIndexes) return this.littleCodeIndexes
        let paragraphCodeIndexes = this.getParagraphCode()
        let inlineBigCodeIndexes = this.getInlineBigCode()
        let midCodeIndexes = this.getMiddleCode()
        const rgx = /(?<!`)(`)([^\n`])+(`|\n|$)(?!`)/g
        let littleCodeIndexes: number[] = [];
        let isInParagraphCode = this.IsInSomeCode(paragraphCodeIndexes);
        let isInInlineBigCode = this.IsInSomeCode(inlineBigCodeIndexes);
        let IsInMidCode = this.IsInSomeCode(midCodeIndexes);
        this.markdown.replace(rgx, (word, ...args) => {
            let index = args.slice(-2)[0]
            if (isInParagraphCode(index) || isInInlineBigCode(index) || IsInMidCode(index)) return word
            let start = index;
            let end: number
            switch (word.slice(-1)[0]) {
                case '\n':
                case '`':
                    end = index + word.length - 1
                    break;
                default:
                    end = index + word.length
                    break;
            }
            littleCodeIndexes.push(start, end);
            return word;
        })
        this.littleCodeIndexes = littleCodeIndexes;
        return littleCodeIndexes;
    }
    protected IsInSomeCode(Codes: number[]) {
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