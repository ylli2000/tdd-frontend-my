import { Container, Menu } from 'semantic-ui-react';
import { range } from '../../helpers/Util';
import './PageList.css';

//Props: { totalPages, currentPosition, displayWidth }
// totalPages: valid to input 0, but minimum display is 1
// currentPosition: starts at 0
// displayWidth: how many 'page' buttons in an array, min and default 3
//Usage:
// <PageList totalPages={8} currentPosition={3} displayWidth={3} onChange={(evt) => console.log(evt.pos)} />
// onChange returns {pos} use it to update your page, 0 means 1st page.
const PageList = (props) => {
    validateInputs(props);
    const { total, curr, seq, start, end } = calcPages(props);
    const { onChange } = props;
    return (
        <Container className="PageList" textAlign="center">
            <Menu borderless>
                {firstBtn(start, seq, onChange)}
                {prevBtn(start, seq, onChange)}
                {range(start, end).map((pos) => (
                    <Menu.Item
                        key={pos}
                        name={`${pos + 1}`}
                        active={pos === curr}
                        onClick={(evt) => onChange({ ...evt, pos })}
                    />
                ))}
                {nextBtn(end, total, onChange)}
                {lastBtn(end, total, onChange)}
            </Menu>
        </Container>
    );
};
//private functions ------------------------------------------------------------
const validateInputs = ({ totalPages, currentPosition, displayWidth, onChange }) => {
    if (
        isNaN(totalPages) ||
        isNaN(currentPosition) ||
        totalPages < 0 ||
        currentPosition < 0 ||
        totalPages <= currentPosition ||
        (!isNaN(displayWidth) && displayWidth < 1)
    ) {
        throw new Error('Invalid PageList input(s)');
    }
    if (!onChange) {
        throw new Error('onChange not implemented');
    }
};
const calcPages = ({ totalPages, currentPosition, displayWidth }) => {
    let total = totalPages >= 1 ? totalPages : 1;
    let curr = total > currentPosition ? currentPosition : total - 1;
    let seq = displayWidth >= 3 ? displayWidth : 3;
    seq = total > seq ? seq : total;
    let start = Math.floor(currentPosition / seq) * seq; //e.g. 0
    start = total > seq + 1 ? start : 0;
    let end = start + seq - 1;
    end = total - 1 > end ? end : total - 1; //e.g. 2
    return { total, curr, seq, start, end };
};
const firstBtn = (start, seq, onChange) => {
    const pos = 0;
    return start >= seq && (
        <Menu.Item key={pos} onClick={(evt) => onChange({ ...evt, pos })}>
            1
        </Menu.Item>
    );
}
const prevBtn = (start, seq, onChange) => {
    const pos = start - 1;
    return start >= seq && (
        <Menu.Item key={pos} name={`${start}`} onClick={(evt) => onChange({ ...evt, pos })}>
            . . .
        </Menu.Item>
    );
}
const nextBtn = (end, total, onChange) => {
    const pos = end + 1;
    return end + 2 < total && (
        <Menu.Item key={pos} name={`${end}`} onClick={(evt) => onChange({ ...evt, pos })}>
            . . .
        </Menu.Item>
    );
}
const lastBtn = (end, total, onChange) => {
    const pos = total - 1;
    return end + 1 !== total && (
        <Menu.Item key={pos} name={`${total}`} onClick={(evt) => onChange({ ...evt, pos })} />
    );
}
export default PageList;
