import { h, Component} from "preact";

export default class Button extends Component {

    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this)
        this.shortcut = null
    }

    componentDidMount() {
        if (this.shortcut !== null) {
            this.props.editor.setOption('extraKeys', {
                ...this.props.editor.getOption('extraKeys'),
                [this.shortcut]: () => {
                    this.action(this.props.editor)
                }
            })
        }
    }

    render (props, state) {
        return <button onClick={this.onClick}>{this.icon(props, state)}</button>
    }

    icon() {
        return null
    }

    onClick (e) {
        e.preventDefault()
        this.action(this.props.editor)
    }

    action (editor) {}
}