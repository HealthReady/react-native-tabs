'use strict';

import React, {
    Component
} from 'react';

import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
} from 'react-native';

class Tabs extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    static propTypes = {}

    static defaultProps = {
        popOver: true,
        badge: true,
        popOverMessage: 'This is the message',
        badgeSize: 14,
        popOverHeight: 50,
        popOverBorderRadius: 5,
        popOverBackgroundColor: 'rgba(180,180,180,0.65)',
        popOverBorderColor: 'rgba(110,110,110,0.65)',
        arrowSize: {width: 5, height: 5}
    }

    onSelect(el) {
        if (el.props.onSelect) {
            el.props.onSelect(el);
        } else if (this.props.onSelect) {
            this.props.onSelect(el);
        }
    }

    getArrowDynamicStyle() {
        var {tabX, tabY, tabWidth, tabHeight} = this.state;
        var arrowSize = this.props.arrowSize;

        // Create the arrow from a rectangle with the appropriate borderXWidth set
        // A rotation is then applied dependending on the placement
        // Also make it slightly bigger
        // to fix a visual artifact when the popover is animated with a scale
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
        console.log('raect-native-tabs: index', this.props);
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
                    <View style={{flex: 1}} onLayout={(event) => {var {x, y, width, height} = event.nativeEvent.layout;
                        this.setState({tabX: x, tabY: y, tabWidth: width, tabHeight: height})}}>
                        <TouchableOpacity key={el.props.name+"touch"}
                                          style={[styles.iconView, this.props.iconStyle, (el.props.name || el.key) == selected ?
                                          this.props.selectedIconStyle || el.props.selectedIconStyle || {} : {} ]}
                                          onPress={()=>!self.props.locked && self.onSelect(el)}
                                          onLongPress={()=>self.onSelect(el)}
                                          activeOpacity={el.props.pressOpacity}>
                            {selected == (el.props.name || el.key) ? React.cloneElement(el, {
                                selected: true,
                                style: [el.props.style, this.props.selectedStyle, el.props.selectedStyle]
                            }) : el}
                        </TouchableOpacity>
                        {this.props.popOver && this.state.tabWidth && this.state.tabHeight ?
                            <View style={[styles.popOverContainer, {width: this.state.tabWidth, top: (this.props.popOverHeight * -1),
                                height: this.props.popOverHeight}]}>
                                <TouchableOpacity onPress={this.props.popOver.onPress}
                                                  style={styles.popOverWrapper}>
                                    <Text style={styles.popOverText}>{this.props.popOverMessage}</Text>
                                </TouchableOpacity>
                                <View style={styles.popOverArrowWrapper}>
                                    <View style={[styles.popOverArrow, this.getArrowDynamicStyle()]}/>
                                </View>
                            </View> : null}
                        {this.props.badge && this.state.tabWidth && this.state.tabHeight ?
                            <View
                                style={[styles.badgeWrapper, {width: this.props.badgeSize, height: this.props.badgeSize,
                                    borderRadius: this.props.badgeSize / 2}, {right: this.state.tabWidth / 4}]}>
                                <Text
                                    style={[styles.badgeText, {marginLeft: 1, marginTop: 1}]}>{this.props.badgeCount || 0}</Text>
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
    popOverContainer: {
        flexDirection: 'column',
        position: 'absolute',
        paddingLeft: 1,
        paddingRight: 1 ,
    },
    popOverWrapper: {
        alignSelf: 'stretch',
        borderColor: 'rgba(200,200,200,0.65)',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: 'rgba(230,230,230,0.65)',
    },
    popOverText: {
        fontFamily: 'AvenirNext-Regular',
        fontSize: 10,
        color: 'rgba(0,0,0,0.65)',
        textAlign: 'center'
    },
    popOverArrowWrapper: {
        flex: 1,
        // borderTopWidth: 1,
        // borderTopColor: Style.COLOR_TAB_BAR_POPOVER_BACKGROUND,
    },
    popOverArrow: {
        width: 0,
        height: 0,
        position: 'absolute',
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: 'rgba(230,230,230,0.65)',
    },
    badgeWrapper: {
        position: 'absolute',
        top: 3,
        backgroundColor: 'red',
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
