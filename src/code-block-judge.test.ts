import { CodeBlockJudge } from './code-block-judge';

let markdown =
	"edfdf\n\
```json\n\
codecode`string`\n\
``null``\n\
```\n\
right->```bigInlineCode```\n\
``middleCode``<-left\n\
right->`little`<-left\n\
```char``muticode``ch`a`r```\n\
``bronkenCodeEnd\n\
yes, i'm not code"
let codeJudge = new CodeBlockJudge(markdown)
let para = codeJudge.getParagraphCode()
let big = codeJudge.getInlineBigCode()
let middle = codeJudge.getMiddleCode()
let little = codeJudge.getLittleCode()
console.log(para, '\n', big, '\n', middle, '\n', little)
let showText = markdown.replace(/\n/g, '|')
for (const index of [0, 5, 10, 20, 60, 88, 99, 100, 999]) {
	console.log(`${showText.slice(index - 5, index)}_${showText[index]}_${showText.slice(index + 1, index + 6)}`, ':\t', codeJudge.IsInAnyCodeBlock(index))
}