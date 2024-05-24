import React from 'react';
import { Controller } from 'react-hook-form';
import { View, StyleProp, TextStyle } from 'react-native';
import { RadioButton, Title } from 'react-native-paper';
import { globalColors } from '../../global/styleGlobal';

import styles from './styles';

interface CheckBoxControlProps {
    control: any;
    name: string;
    label?: string;
    placeholder?: string;
    onChangeValue?: (value: any) => void;
    style?: StyleProp<TextStyle>;
    containerStyle?: StyleProp<TextStyle>;
}

const CheckBoxControl: React.FC<CheckBoxControlProps> = (
    { control, name, label, style, containerStyle, onChangeValue }) => {

    return (
        <View style={containerStyle}>
            <Controller
                name={name}
                control={control}
                render={({ field: { onChange, value } }) => (
                    <>
                        {label && (
                            <Title>{label}</Title>
                        )}
                        <View style={{ width: 50, justifyContent: 'center', alignItems: 'center' }}>
                            <RadioButton.Android
                                color={globalColors.primaryColor}
                                value={value}
                                status={value ? 'checked' : 'unchecked'}
                                onPress={() => onChange(!value)}
                            />
                        </View>
                    </>
                )}
            />
        </View>
    );
}

export default CheckBoxControl;
