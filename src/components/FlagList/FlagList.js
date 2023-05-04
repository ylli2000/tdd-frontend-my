import './FlagList.css';
import { Image } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import en from '../../assets/flags/en.png';
import cn from '../../assets/flags/cn.png';

const FlagList = () => {
    const { i18n } = useTranslation();
    const lang = (lang) => {
        i18n.changeLanguage(lang);
    };
    return (
        <Image.Group className="FlagList" size="mini">
            <Image onClick={() => lang('en')} alt="en" src={en} />
            <Image onClick={() => lang('cn')} alt="cn" src={cn} />
        </Image.Group>
    );
};

export default FlagList;
