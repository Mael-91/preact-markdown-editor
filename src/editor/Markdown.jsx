import { h, Component } from "preact";
import marked from 'marked'

export default class Markdown extends Component {
    render (props, {html}) {
        return <div dangerouslySetInnerHTML={{__html: this.renderMarkdown()}}/>
    }

    renderMarkdown () { // TODO Ajouter l'echappement des caractere HTML
        marked.options({
            gfm: true,
            tables: true,
            breaks: true,
            pedantic: false,
            smartLists: true,
            smartypants: false
        })
        return marked(this.props.markdown)
    }
}