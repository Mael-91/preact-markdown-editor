import { h, Component } from "preact";
import CodeMirror from "./CodeMirror";
import Markdown from "./Markdown";
import linkState from "linkstate";
import './style.scss';
import {
    BoldButton,
    ItalicButton,
    SpeechButton,
    FullScreenButton,
    HeadingButton,
    NumberedListButton,
    DotListButton,
    LinkButton,
    ImageButton
} from "./Buttons";

export default class Editor extends Component {

    constructor(props) {
        super(props);
        this.setEditor = this.setEditor.bind(this)
        this.state = {
            content: props.value,
            editor: null,
            fullscreen: false
        }
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
                        <FullScreenButton editor={editor} onFullScreen={linkState(this, 'fullscreen')} fullscreen={fullscreen}/>
                    </div>
                ]}
            </div>
            <div class="mdeditor__editor">
               <CodeMirror value={content} onReady={this.setEditor}/>
            </div>
            <div class="mdeditor__preview">
                <Markdown markdown={content}/>
            </div>
            <textarea name={name} style="display: none">{content}</textarea>
        </div>
    }

    componentDidUpdate(previousProps, previousState, previousContext) {
        if (previousState !== this.state.fullscreen) {
            this.state.editor.refresh()
        }
    }

    setEditor (editor) {
        this.setState({editor})
        editor.on('change', e => {
            this.setState({content: e.getDoc().getValue()})
        })
    }
}