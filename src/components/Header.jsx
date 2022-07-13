
import * as React from 'react';
import * as PropTypes from 'prop-types';

import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Avatar } from '@progress/kendo-react-layout';
import { useLocalization } from '@progress/kendo-react-intl';

import { locales } from './../resources/locales';

import {connect} from 'react-redux'
import * as actions from '../store/actions'

import headerBg from '../assets/header-bg.png';
import userAvatar from '../assets/user-avatar.jpg';

const Header = (props) => {
    const { avatar, localeId, onLanguageChange } = props;
    const localizationService = useLocalization();

    const currentLanguage = locales.find(item => item.localeId === localeId);

    const imgRef = React.useRef(null);
    const hasImage = avatar && avatar.length > 0;

    React.useEffect(
        () => {
            if (hasImage) {
                var reader = new FileReader();

                reader.onload = function(e) {
                    imgRef.current.setAttribute('src', e.target.result)
                }

                reader.readAsDataURL(avatar[0].getRawFile());
            }
        },
        [avatar, hasImage]
    );

    console.log("props", props)

    return (
        <header className="header" style={{ backgroundImage: `url(${headerBg})` }}>
            <div className="nav-container">
                <div className="menu-button">
                    <span className={'k-icon k-i-menu'}/>
                </div>

                <div className="title">
                    <h1>{localizationService.toLanguageString('custom.warehouse')}</h1>
                </div>
                <div className="settings">
                    <span>{localizationService.toLanguageString('custom.language')}</span>
                    <DropDownList
                        textField={'locale'}
                        dataItemKey={'localeId'}
                        data={locales}
                        value={currentLanguage}
                        onChange={(event) => {
                            onLanguageChange(event.target.value.localeId)
                        }}
                    />
                </div>
                <Avatar type={'image'} shape={'circle'}>
                    {
                        hasImage ?
                            <img ref={imgRef} src={'#'} alt={'User Avatar'} /> :
                            <img src={userAvatar} alt="user-avatar"/>
                    }
                </Avatar>
            </div>
        </header>
    );
}

const mapStateToProps = (state) => {
    return {
        ...state.profile
    }
    }
    
    const mapDispatchToProps = (dispatch) => {
    return {
        onLanguageChange: (localeId) => dispatch(actions.onLanguageChange(localeId))
    }
    }

export default connect(mapStateToProps, mapDispatchToProps)(Header)
