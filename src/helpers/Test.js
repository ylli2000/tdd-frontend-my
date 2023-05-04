import { screen as tlrScreen } from "@testing-library/react";

//ref: https://github.com/testing-library/dom-testing-library/issues/410
//I found this very useful when e.g. building a rich text editor that does not use 
//input or textarea fields to render text, but instead custom div and span elements 
//and relies on textContent.
//This is for example the case when you're implementing Twitter's create tweet editor 
//and want to support user mentioning:
const screen = {
    ...tlrScreen,
    getByTextContent: text => tlrScreen.getByText(match(text)),
    queryByTextContent: text => tlrScreen.queryByText(match(text)),
    findByTextContent: async text => tlrScreen.findByText(match(text))
};
const match = text => (_, node) => {
    const hasText = node => node.textContent === text
    const nodeHasText = hasText(node)
    const childrenDontHaveText = Array.from(node.children || []).every((child) => !hasText(child))
    return nodeHasText && childrenDontHaveText
};
export default screen;