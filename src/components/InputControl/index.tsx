import React, { PropsWithChildren } from 'react';
import { Controller } from 'react-hook-form';
import { MaskService } from 'react-native-masked-text'
import { View, StyleProp, TextStyle, KeyboardTypeOptions } from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';
import { globalColors } from '../../global/styleGlobal';

import styles from './styles';

interface InputControlProps {
    control: any;
    onChangeValue?: (valor: any) => void;
    name: string;
    label: string;
    error?: boolean;
    disabled?: boolean;
    typeMask?: 'document'| 'cpf' | 'cnpj' | 'zip-code' | 'cel-phone' | 'datetime';
    outlineColor?: string;
    errorText?: string;
    secureTextEntry?: boolean;
    right?: React.ReactNode;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters' | undefined;
    style?: StyleProp<TextStyle>;
    keyboardType?: KeyboardTypeOptions | undefined;
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

const InputControl: React.FC<InputControlProps> = (
    { control, name, label, outlineColor, error, errorText, style, autoCapitalize, right,
        secureTextEntry, typeMask, textContentType, keyboardType, disabled, onChangeValue }) => {

    function handleMask(text: any) {
        if(!typeMask)
            return text;

        let _typeMask = typeMask;;
        if(_typeMask == 'document') {
            _typeMask = "cpf";

            if(text.length > 14)
                _typeMask = "cnpj";
        }

        let options = {};

        if(_typeMask == 'datetime') {
            options = {
                format: 'DD/MM/YYYY'
            }
        }

        let textMasked = MaskService.toMask(_typeMask, text, options);
        return textMasked;
    }

    return (
        <View style={styles.container}>
            <Controller
                name={name}
                control={control}
                render={({ field: { onChange, value } }) => (
                    <>
                        <TextInput
                            autoCapitalize={autoCapitalize || 'none'}
                            autoCorrect={false}
                            textContentType={textContentType}
                            keyboardType={keyboardType}
                            secureTextEntry={secureTextEntry}
                            style={style}
                            label={label}
                            mode='outlined'
                            disabled={disabled}
                            outlineColor={outlineColor || globalColors.primaryColor}
                            error={error}
                            value={value}
                            onChangeText={(text: any) => {
                                let newText = handleMask(text);
                                onChange(newText);

                                if(onChangeValue) {
                                    onChangeValue(newText);
                                }
                            }}
                            right={right}
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

export default InputControl;
