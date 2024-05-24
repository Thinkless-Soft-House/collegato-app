import React from 'react';
import { View, StyleProp, TextStyle } from 'react-native';
import { RadioButton, Title } from 'react-native-paper';
import { globalColors } from '../../global/styleGlobal';

import styles from './styles';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface CheckBoxProps {
    label?: string;
    placeholder?: string;
    value: boolean;
    onChange?: (value: any) => void;
    changeOnPressLabel?: boolean;
    style?: StyleProp<TextStyle>;
    containerStyle?: StyleProp<TextStyle>;
    labelStyle?: StyleProp<TextStyle>;
}

const CheckBox: React.FC<CheckBoxProps> = (
    { label, style, containerStyle, labelStyle, onChange, value, changeOnPressLabel }) => {

    return (
        <TouchableOpacity
            style={containerStyle}
            onPress={() => {
                if(changeOnPressLabel) {
                    onChange(!value);
                }
                }} >
            {label && (
                <Title style={labelStyle}>{label}</Title>
            )}
            <View style={[styles.buttonContainer, style]}>
                <RadioButton.Android
                    color={globalColors.primaryColor}
                    value={value ? 'checked' : 'unchecked'}
                    status={value ? 'checked' : 'unchecked'}
                    onPress={() => {
                        if(!changeOnPressLabel) {
                            onChange(!value)
                        }
                    }}
                />
            </View>
        </TouchableOpacity>
    );
}

export default CheckBox;
