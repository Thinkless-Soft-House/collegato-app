import React, { PropsWithChildren } from 'react';
import { StyleProp, ViewStyle, TouchableHighlight } from 'react-native';
import { Card as CardPaper } from 'react-native-paper';

import styles from './styles';

interface CardProps extends PropsWithChildren{
    title?: string,
    subtitle?: string,
    left?: React.ReactNode;
    titleStyle?: StyleProp<ViewStyle>;
    subtitleStyle?: StyleProp<ViewStyle>;
    leftStyle?: StyleProp<ViewStyle>;
    right?: React.ReactNode;
    rightStyle?: StyleProp<ViewStyle>;
    contentStyle?: StyleProp<ViewStyle>;
    mainContentStyle?: StyleProp<ViewStyle>;
    cardStyle?: StyleProp<ViewStyle>;
    actions?: React.ReactNode;
    onPress?: () => void;
}

const Card: React.FC<CardProps> = (props) => {

    function getCardProps() {
        let cardProps = {};

        if(props.left && props.right) {
            cardProps = {
                right: () => props.right,
                left: () => props.left
            }
        }
        else if(props.left) {
            cardProps = {
                left: () => props.left,
            }
        }
        else if(props.right) {
            cardProps = {
                right: () => props.right,
            }
        }

        return cardProps;
    }


    return (
        <>
        <TouchableHighlight
            style={props.mainContentStyle}
            activeOpacity={0.6}
            underlayColor="#ffffff3d"
            onPress={props.onPress}
        >
            <CardPaper style={[props.cardStyle, styles.container, styles.shadow]}>
                <CardPaper.Title
                    titleStyle={props.titleStyle || {marginLeft: 15}}
                    title={props.title}
                    titleNumberOfLines={5}
                    subtitleStyle={props.subtitleStyle || {marginLeft: 15}}
                    subtitle={props.subtitle}
                    leftStyle={props.leftStyle}
                    rightStyle={props.rightStyle}
                    {...getCardProps()}
                />
                {props.children && (
                    <CardPaper.Content style={props.contentStyle}>
                        {props.children}
                    </CardPaper.Content>
                )}
                {props.actions && (
                    <CardPaper.Actions>
                        {props.actions}
                    </CardPaper.Actions>
                )}
            </CardPaper>
        </TouchableHighlight>
        </>
    );
}

export default Card;
