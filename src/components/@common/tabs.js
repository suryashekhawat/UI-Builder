import Components from '../../gui/components';
import { dataComponentId, configurableComponent, dataTabsKey, draggableComponent, resizableComponent, droppableComponent } from "../common";
import { tabsid } from "./ids";
import { TabValueInput, ButtonInput } from "../../inputs/inputs";
import { getRandomString } from "../../util/common";
import { initDroppable } from "../../util/interactions";

const iframeWindow = document.getElementById('iframeId').contentWindow;

function getLastTabIdSuffix(tabsNav) {
    const href = tabsNav.children().last().children('a').attr('href');
    if (href) {
        return parseInt(href.split('-')[1]);
    } else {
        return 0;
    }
}

const tabs = {
    name: 'Tabs',
    image: "icons/tabs.svg",
    dragHtml: `<img ${dataComponentId}="${tabsid}" src="libs/builder/icons/tabs.svg" style="width: 100px; height: auto;">`,
    html: `<div ${dataComponentId}="${tabsid}" class="${configurableComponent} ${draggableComponent} ${resizableComponent}" style="width: 600px; height: 600px;">
           </div>`,
    getDropHtml() {
        return this.html;
    },
    isChildrenSortableAndDroppable: true,
    isDescendantsSortableAndDroppable: false,
    sortableAndDroppableSelector: 'div',
    getRenderElement(node) {
        const parents = $(node).parents(`[${dataComponentId}="${tabsid}"]`);
        return parents.length ? parents[0] : node;
    },
    afterDrop(node) {
        const $node = iframeWindow.$(node);
        const key = `_${getRandomString(2)}`;
        $node.attr(dataTabsKey, key);
        $node.html(`
        <ul>
            <li><a href="#tabs${key}-1">Nunc tincidunt</a></li>
            <li><a href="#tabs${key}-2">Proin dolor</a></li>
            <li><a href="#tabs${key}-3">Aenean lacinia</a></li>
        </ul>
        <div id="tabs${key}-1" class="${droppableComponent}">
        </div>
        <div id="tabs${key}-2" class="${droppableComponent}">
        </div>
        <div id="tabs${key}-3" class="${droppableComponent}">
        </div>
        `);
        $node.tabs();
        const height = $node.children('ul').height();
        $node.children('div').css({
            height: `calc(100% - ${height}px)`
        });
    },
    beforeInit(node) {
        const tabs = iframeWindow.$(node);
        const properties = [];
        $(node).children('ul').children('li').each((i, li) => {
            const $li = $(li);
            const $a = $li.find('a');
            properties.push({
                name: 'Tab ' + (i + 1),
                key: 'Tab' + (i + 1),
                inputtype: new TabValueInput(),
                data: {
                    title: $a.text()
                },
                onChange(node, value, input) {
                    if (input.nodeName == 'BUTTON') {
                        $li.remove();
                        tabs.tabs("refresh");
                        Components.render(tabsid);
                    } else {
                        $a.text(value);
                    }
                    return node;
                }
            })
        });
        //remove all tab properties
        this.properties = this.properties.filter(function (item) {
            return item.key.indexOf("Tab") === -1;
        });
        this.properties = [...properties, ...this.properties];
        return node;
    },
    properties: [
        {
            name: "Add Tab",
            key: "addChild",
            inputtype: new ButtonInput(),
            data: { text: "Add Tab" },
            onChange: function (node) {
                const tabs = iframeWindow.$(node);
                const key = tabs.attr(dataTabsKey);
                const tabsNav = tabs.find('.ui-tabs-nav');
                const newTabId = `tabs${key}-${getLastTabIdSuffix(tabsNav) + 1}`;
                const height = tabs.children('ul').height();

                const li = `<li><a href="#${newTabId}">New Tab</a></li>`;
                tabs.children('ul.ui-tabs-nav').append(li);
                tabs.append(`<div id="${newTabId}" class="${droppableComponent}" style="height: calc(100% - ${height}px);"></div>`);
                tabs.tabs('refresh');

                initDroppable(tabs.children().last().get(0));

                Components.render(tabsid);
                return node;
            }
        }
    ]
};

export default tabs;