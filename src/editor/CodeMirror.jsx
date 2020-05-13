import { h, Component} from "preact";
import CodeMirror from "codemirror";
import 'codemirror/mode/markdown/markdown'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/neo.css'

export default class CodeMirrorComponent extends Component {

    render () {
        return <div/>
    }

    shouldComponentUpdate () {
        return false
    }

    componentDidMount () {
        let editor = CodeMirror(this.base, {
            value: this.props.value,
            mode: 'markdown',
            theme: "neo",
            lineWrapping: true,
            viewportMargin: Infinity,
            cursorBlinkRate: 0
        })
        this.props.onReady(editor)
    }
}