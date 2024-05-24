import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { View, StyleProp, TextStyle } from 'react-native';
import { HelperText } from 'react-native-paper';
import { globalColors } from '../../global/styleGlobal';
import DropDown from "react-native-paper-dropdown";

import styles from './styles';

interface DropDownControlProps {
    control: any;
    name: string;
    label: string;
    error?: boolean;
    outlineColor?: string;
    errorText?: string;
    placeholder?: string;
    onChangeValue?: (value: any) => void;
    style: StyleProp<TextStyle>;
    list: Array<{
        label: string;
        value: string | number;
        custom?: React.ReactNode;
    }>;
}

const DropDownControl: React.FC<DropDownControlProps> = (
    { control, name, label, outlineColor, error, errorText, style, list, placeholder,
        onChangeValue }) => {

    const [showDropDown, setShowDropDown] = useState<boolean>(false);

    return (
        <View style={styles.container}>
            <Controller
                name={name}
                control={control}
                render={({ field: { onChange, value } }) => (
                    <>
                        <DropDown
                            label="Tipo do Usuário"
                            mode="outlined"
                            visible={showDropDown}
                            showDropDown={() => setShowDropDown(true)}
                            onDismiss={() => setShowDropDown(false)}
                            inputProps={
                                {
                                    outlineColor: outlineColor || globalColors.primaryColor,
                                    label: label,
                                    error: error,
                                    autoCapitalize: 'none',
                                    placeholder: placeholder,
                                    style: style,
                                }
                            }
                            dropDownStyle={{marginTop: 40}}
                            value={value}
                            setValue={(value) => {
                                onChange(value);
                                if(onChangeValue) {
                                    onChangeValue(value);
                                }
                            }}
                            list={list}
                        />
                        {(error && errorText) && (
                            <HelperText type="error" visible>
                                {errorText}
                            </HelperText>
                        )}
                    </>
                )}
            />
        </View>
    );
}

export default DropDownControl;
