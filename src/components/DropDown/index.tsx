import React, { useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import { View, StyleProp, TextStyle } from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';
import { globalColors } from '../../global/styleGlobal';
import DropDownExterno from "react-native-paper-dropdown";

import styles from './styles';

interface DropDownProps {
    onChange: (value: any) => void;
    value: any;
    label: string;
    error?: boolean;
    outlineColor?: string;
    errorText?: string;
    placeholder?: string;
    secureTextEntry?: boolean;
    right?: React.ReactNode;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters' | undefined;
    style: StyleProp<TextStyle>;
    list: Array<{
        label: string;
        value: string | number;
        custom?: React.ReactNode;
    }>;
}

const DropDown: React.FC<DropDownProps> = (
    { onChange, value, label, outlineColor, error, errorText, style, list, placeholder }) => {

    const [showDropDown, setShowDropDown] = useState<boolean>(false);

    return (
        <View style={styles.container}>
            <DropDownExterno
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
                        style: style
                    }
                }
                dropDownStyle={{ marginTop: 40 }}
                value={value}
                setValue={onChange}
                list={list}
            />
            {(error && errorText) && (
                <HelperText type="error" visible>
                    {errorText}
                </HelperText>
            )}
        </View>
    );
}

export default DropDown;
