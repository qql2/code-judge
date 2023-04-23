declare interface BinSearchRst {
    low: number,
    mid: number,
    high: number
}
export class Kit{
    constructor() { }
    static binarySearchInOrder<K>(rcds: K[], left = 0, right = rcds.length - 1) {
        let low = left;
        return (key: K): BinSearchRst => {
            const rst = this.binarySearch(rcds, key, low, right);
            if (rst.mid != -1 && rst.mid != 0) low = rst.mid - 1;//查找到了
            else {//没有查找到
                if (rst.low != -1) low = rst.low
            }
            // Testlog('low:\n' + low);
            return rst;
        }
    }
    static binarySearch<K>(rcds: K[], key: K, left = 0, right = rcds.length - 1): BinSearchRst {
        let low = left - 1, high = right + 1, mid: number;
        for (; low + 1 != high;) {
            mid = (low + high) >> 1;
            if (rcds[mid] == key) {
                return { low: -1, mid: mid, high: -1 };
            }
            else if (rcds[mid] < key) {
                low = mid;
            }
            else {
                high = mid;
            }
        }
        /*运行至此,搜索不成功,则low与high分别指向最靠近目标的两个数*/
        /*当然查找目标处于边界时,low或high会越界*/
        return { low: low, mid: -1, high: high };
    }
}