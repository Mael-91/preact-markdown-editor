let selectors = []
for (let i = 1; i < 6; i++) {
    selectors.push(`.cm-header-${i}`, `h${i}`)
}

export default class SectionsGenerator {

    static fromElement (element) {
        let matches = element.querySelectorAll(selectors.join(', '))
        let previous = 0
        let sections = []
        matches.forEach(title => {
            let offsetTop = this.offsetTop(title, element)
            sections.push([previous, offsetTop])
            previous = offsetTop
        })
        sections.push([previous, element.scrollHeight])
        return sections
    }

    static offsetTop (element, target, acc = 0) {
        if (element === target) {
            return acc
        }
        return this.offsetTop(element.offsetParent, target, acc + element.offsetTop)
    }

    static getIndex (y, sections) {
        return sections.findIndex((section) => {
            return y >= section[0] && y <= section[1]
        })
    }

    static getScrollPosition (y, sourceSections, targetSections) {
        let index = this.getIndex(y, sourceSections)
        let section = sourceSections[index]
        let percentage = (y - section[0]) / (section[1] - section[0])
        let targetSection = targetSections[index]
        return targetSection[0] + percentage * (targetSection[1] - targetSection[0])
    }
}