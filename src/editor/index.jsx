import {Component} from "preact";
import CodeMirror from "./CodeMirror";
import Markdown from "./Markdown";
import linkState from "linkstate";
import './style.scss';
import {
    BoldButton,
    DotListButton,
    FullScreenButton,
    HeadingButton,
    ImageButton,
    ItalicButton,
    LinkButton,
    NumberedListButton,
    SpeechButton
} from "./Buttons";
import SectionsGenerator from "./SectionsGenerator";
import DOMTimer from "./Debounce";

export default class Editor extends Component {

    constructor(props) {
        super(props);
        this.setEditor = this.setEditor.bind(this)
        this.resetSections = this.resetSections.bind(this)
        this.resetScrolling = this.resetScrolling.bind(this)
        this.state = {
            content: props.value,
            editor: null,
            fullscreen: false
        }
        this._sections = null
        this.scrolling = null
    }

    render({name}, {content, editor, fullscreen}) {
        let cls = 'mdeditor'
        if (fullscreen === true) {
            cls += ' mdeditor--fullscreen'
        }
        return <div class={cls}>
            <div class="mdeditor__toolbar">
                {editor && [
                    <div className="mdeditor__toolbarleft">
                        <BoldButton editor={editor}/>
                        <ItalicButton editor={editor}/>
                        <SpeechButton editor={editor}/>
                        <HeadingButton editor={editor}/>
                        <NumberedListButton editor={editor}/>
                        <DotListButton editor={editor}/>
                        <LinkButton editor={editor}/>
                        <ImageButton editor={editor}/>
                    </div>,
                    <div className="mdeditor__toolbarright">
                        <FullScreenButton editor={editor} onFullScreen={linkState(this, 'fullscreen')}
                                          fullscreen={fullscreen}/>
                    </div>
                ]}
            </div>
            <div class="mdeditor__editor" onScroll={this.onScroll('editor')}>
                <CodeMirror value={content} onReady={this.setEditor}/>
            </div>
            <div class="mdeditor__preview" onScroll={this.onScroll('preview')}>
                <Markdown markdown={content}/>
            </div>
            <textarea name={name} style="display: none">{content}</textarea>
        </div>
    }

    componentDidMount() {
        window.addEventListener('resize', this.resetSections)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resetSections)
    }

    componentDidUpdate(previousProps, previousState, previousContext) {
        if (previousState.content !== this.state.content) {
            this._sections = null
        }
        if (previousState.fullscreen !== this.state.fullscreen) {
            this.state.editor.refresh()
        }
        this.resetSections()
    }

    setEditor(editor) {
        this.setState({editor})
        editor.on('change', e => {
            this.setState({content: e.getDoc().getValue()})
        })
    }

    get sections() {
        if (this._sections === null) {
            this._sections = {
                editor: SectionsGenerator.fromElement(this.base.querySelector(`.mdeditor__editor`)),
                preview: SectionsGenerator.fromElement(this.base.querySelector(`.mdeditor__preview`))
            }
        }
        return this._sections
    }

    resetSections () {
        this._sections = null
    }

    onScroll(source) {
        return (e) => {
            if (this.scrolling === null) {
                this.scrolling = source
            }
            if (this.scrolling !== source) {
                return false
            }
            let target = source === 'preview' ? 'editor' : 'preview'
            this.base.querySelector(`.mdeditor__${target}`).scrollTop = SectionsGenerator.getScrollPosition(
                e.target.scrollTop,
                this.sections[source],
                this.sections[target]
            )
            this.resetScrolling()
        }
    }

    resetScrolling = DOMTimer.debounce(() => {
        this.scrolling = null
    }, 500)
}