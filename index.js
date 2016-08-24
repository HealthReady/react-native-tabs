'use strict';

import React, {
    Component
} from 'react';

import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Keyboard,
    Platform,
} from 'react-native';

type State = {
    keyboardUp: boolean,
};

class Tabs extends Component {
    state: State = {};

    constructor(props) {
        super(props);
        this.state = {}
    }

    static propTypes = {
        popoverTextStyle: Text.propTypes.style,
        popoverMessage: React.PropTypes.string.isRequired,
        badgeSize: React.PropTypes.number,
        popoverHeight: React.PropTypes.number,
        popoverBorderRadius: React.PropTypes.number,
        popoverBackgroundColor: React.PropTypes.string,
        popoverBorderColor: React.PropTypes.string,
        badgeBackgroundColor: React.PropTypes.string,
        arrowSize: React.PropTypes.object,
    }

    static defaultProps = {
        popoverMessage: '',
        badgeSize: 14,
        badgeBackgroundColor: 'red',
        popoverHeight: 50,
        popoverBorderRadius: 5,
        popoverBackgroundColor: 'rgba(242,103,37,1)',
        popoverBorderColor: 'rgba(242,103,37,0.65)',
        arrowSize: {
            width: 5,
            height: 5
        }
    }

    onSelect(el) {
        if (el.props.onSelect) {
            el.props.onSelect(el);
        } else if (this.props.onSelect) {
            this.props.onSelect(el);
        }
    }

    componentWillMount() {
        if (Platform.OS === 'android') {
            Keyboard.addListener('keyboardDidShow', this.keyboardWillShow);
            Keyboard.addListener('keyboardDidHide', this.keyboardWillHide);
        }
    }

    keyboardWillShow = (e) => {
        this.setState({keyboardUp: true});
    };

    keyboardWillHide = (e) => {
        this.setState({keyboardUp: false});
    };

    getArrowDynamicStyle() {
        var {tabX, tabY, tabWidth, tabHeight} = this.state;
        var arrowSize = this.props.arrowSize;
        var width = arrowSize.width + 2;
        var height = arrowSize.height * 2 + 2;

        return {
            left: tabWidth / 2 - (width),
            borderLeftWidth: width,
            borderRightWidth: width,
            borderTopWidth: height,
        }
    }

    render() {
        const self = this;
        let selected = this.props.selected
        if (!selected) {
            React.Children.forEach(this.props.children.filter(c=>c), el=> {
                if (!selected || el.props.initial) {
                    selected = el.props.name || el.key;
                }
            });
        }
        return (
            <View style={[styles.tabbarView, this.props.style]}>
                {React.Children.map(this.props.children.filter(c=>c), (el)=>
                    <View style={{flex: 1}} onLayout={(event) => {
                        var {x, y, width, height} = event.nativeEvent.layout;
                        this.setState({tabX: x, tabY: y, tabWidth: width, tabHeight: height})
                    }}>
                        <TouchableOpacity key={el.props.name + "touch"}
                                          style={[styles.iconView, this.props.iconStyle, (el.props.name || el.key) == selected ?
                                          this.props.selectedIconStyle || el.props.selectedIconStyle || {} : {}]}
                                          onPress={()=>!self.props.locked && self.onSelect(el)}
                                          onLongPress={()=>self.onSelect(el)}
                                          activeOpacity={el.props.pressOpacity}>
                            {selected == (el.props.name || el.key) ? React.cloneElement(el, {
                                selected: true,
                                style: [el.props.style, this.props.selectedStyle, el.props.selectedStyle]
                            }) : el}
                        </TouchableOpacity>
                        {this.props.notifications.popovers[el.props.sceneKey] && this.state.tabWidth && this.state.tabHeight ?
                            <View style={[styles.popoverContainer, {
                                width: this.state.tabWidth, bottom: this.state.tabHeight +
                                (this.props.arrowSize.height * 2) + 5
                            }]}>
                                <TouchableOpacity onPress={() => this.props.popoverOnPress(el.props.sceneKey)}
                                                  activeOpacity={1.0}
                                                  style={[styles.popoverWrapper, {backgroundColor: this.props.popoverBackgroundColor}]}>
                                    <Text style={[styles.popoverText, this.props.popoverTextStyle]}>
                                        {this.props.notifications.popovers[el.props.sceneKey].message}
                                    </Text>
                                </TouchableOpacity>
                                <View
                                    style={[styles.popoverArrow, {borderTopColor: this.props.popoverBackgroundColor}, this.getArrowDynamicStyle()]}/>
                            </View> : null}
                        {this.props.notifications.badges[el.props.sceneKey] && this.state.tabWidth && this.state.tabHeight ?
                            <View
                                style={[styles.badgeWrapper, {
                                    width: this.props.badgeSize,
                                    height: this.props.badgeSize,
                                    backgroundColor: this.props.badgeBackgroundColor,
                                    borderRadius: (this.props.badgeSize) / 2
                                }, {right: this.state.tabWidth / 4}]}>
                                <Text
                                    style={[styles.badgeText, {
                                        marginLeft: 1,
                                        marginTop: 1
                                    }]}>{this.props.notifications.badges[el.props.sceneKey].count || 0}</Text>
                            </View> : null}
                    </View>
                )}
            </View>
        );
    }
}
var styles = StyleSheet.create({
    tabbarView: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        height: 50,
        opacity: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconView: {
        flex: 1,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    popoverContainer: {
        flexDirection: 'column',
        position: 'absolute',
        paddingLeft: 1,
        paddingRight: 1,
    },
    popoverWrapper: {
        alignSelf: 'stretch',
        //borderColor: 'rgba(200,200,200,0.65)',
        //borderWidth: 1,
        padding: 3,
        borderRadius: 8,
        // shadowColor: '#000000',
        // shadowOpacity: 0.5,
        // shadowRadius: 2,
        // shadowOffset: {
        //     height: 2,
        //     width: 2
        // }
    },
    popoverText: {
        fontFamily: 'AvenirNext-Regular',
        fontSize: 12,
        color: '#FFF',
        textAlign: 'center',
        //textShadowOffset: {width: 1, height: 1}, textShadowRadius: 1, textShadowColor: '#222222'
    },
    popoverArrowWrapper: {
        flex: 1,
        // borderTopWidth: 1,
        // borderTopColor: Style.COLOR_TAB_BAR_POPOVER_BACKGROUND,
    },
    popoverArrow: {
        width: 0,
        height: 0,
        position: 'absolute',
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        // shadowColor: '#000000',
        // shadowOpacity: 0.5,
        // shadowRadius: 2,
        // shadowOffset: {
        //     height: 2,
        //     width: 2
        // }
    },
    badgeWrapper: {
        position: 'absolute',
        top: 3,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    badgeText: {
        fontFamily: 'AvenirNext-Regular',
        fontSize: 10,
        fontWeight: '600',
        color: '#FFF',
        backgroundColor: 'transparent',
        textAlign: 'center'
    },
});

module.exports = Tabs;
