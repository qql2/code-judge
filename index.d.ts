declare module "kit" {
    interface BinSearchRst {
        low: number;
        mid: number;
        high: number;
    }
    export class Kit {
        constructor();
        static binarySearchInOrder<K>(rcds: K[], left?: number, right?: number): (key: K) => BinSearchRst;
        static binarySearch<K>(rcds: K[], key: K, left?: number, right?: number): BinSearchRst;
    }
}
declare module "code-block-judge" {
    export class CodeBlockJudge {
        markdown: string;
        private paragraphCodeIndexes;
        private inlineBigCodeIndexes;
        private middleCodeIndexes;
        private littleCodeIndexes;
        constructor(markdown: string);
        IsInAnyCodeBlock(index: number): boolean;
        /** 获得所有段落代码块的位置索引 */
        getParagraphCode(): number[];
        getInlineBigCode(): number[];
        /** 获得所有中代码块(即``代码块)的位置索引 */
        getMiddleCode(): number[];
        /**  获得所有小代码块(即`代码块)的位置索引 */
        getLittleCode(): number[];
        protected IsInSomeCode(Codes: number[]): (index: number) => boolean;
    }
}
