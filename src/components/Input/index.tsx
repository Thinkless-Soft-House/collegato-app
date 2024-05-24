import React from 'react';
import { MaskService } from 'react-native-masked-text'
import { View, StyleProp, TextStyle, KeyboardTypeOptions, ViewStyle } from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';
import { globalColors } from '../../global/styleGlobal';

import styles from './styles';

interface InputProps {
    onChange?: (value: any) => void;
    onPress?: () => void;
    value: string | undefined;
    label?: string;
    error?: boolean;
    outlineColor?: string;
    typeMask?: 'document' | 'cpf' | 'cnpj' | 'datetime';
    errorText?: string;
    secureTextEntry?: boolean;
    right?: React.ReactNode;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters' | undefined;
    style?: StyleProp<TextStyle>;
    containerStyle?: StyleProp<ViewStyle>;
    keyboardType?: KeyboardTypeOptions | undefined;
    placeholder?: string;
    editable?: boolean;
    multiline?: boolean;
    numberOfLines?: number;
    maxLenght?: number;
    textContentType?:
    | 'none'
    | 'URL'
    | 'addressCity'
    | 'addressCityAndState'
    | 'addressState'
    | 'countryName'
    | 'creditCardNumber'
    | 'emailAddress'
    | 'familyName'
    | 'fullStreetAddress'
    | 'givenName'
    | 'jobTitle'
    | 'location'
    | 'middleName'
    | 'name'
    | 'namePrefix'
    | 'nameSuffix'
    | 'nickname'
    | 'organizationName'
    | 'postalCode'
    | 'streetAddressLine1'
    | 'streetAddressLine2'
    | 'sublocality'
    | 'telephoneNumber'
    | 'username'
    | 'password'
    | 'newPassword'
    | 'oneTimeCode'
    | undefined;
}

const Input: React.FC<InputProps> = (
    { onChange, value, label, outlineColor, error, errorText, style, containerStyle, autoCapitalize, right,
        secureTextEntry, textContentType, keyboardType, typeMask, placeholder, editable, multiline, numberOfLines, 
        maxLenght, onPress }) => {

    function handleMask(text: any) {
        if (!typeMask)
            return text;

        let _typeMask = typeMask;;
        if (_typeMask == 'document') {
            _typeMask = "cpf";

            if (text.length > 14)
                _typeMask = "cnpj";
        }

        let options = {};

        if (_typeMask == 'datetime') {
            options = {
                format: 'DD/MM/YYYY'
            }
        }

        let textMasked = MaskService.toMask(_typeMask, text, options);
        return textMasked;
    }

    return (
        <View style={[styles.container, containerStyle]} 
        onTouchStart={() => {
            if(onPress)
                onPress();
        }}>
            <TextInput
                autoCapitalize={autoCapitalize}
                textContentType={textContentType}
                keyboardType={keyboardType}
                autoCorrect={false}
                editable={editable}
                multiline={multiline}
                numberOfLines={numberOfLines}
                maxLength={maxLenght}
                secureTextEntry={secureTextEntry}
                placeholder={placeholder}
                style={style}
                label={label}
                mode='outlined'
                outlineColor={outlineColor || globalColors.primaryColor}
                error={error}
                value={value}
                onPressOut={() => {
                    if(onPress)
                        onPress();
                }}
                onChangeText={(text: any) => {
                    let newText = handleMask(text);
                    onChange(newText);
                }}
                right={right}
            />
            {(error && errorText) && (
                <HelperText type="error" visible>
                    {errorText}
                </HelperText>
            )}
        </View>
    );
}

export default Input;
