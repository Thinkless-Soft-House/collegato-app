import { TextInput } from 'react-native';
import React from 'react';
import { TextInputMask } from 'react-native-masked-text';
import styles from './styles';

interface IProps {
    autoCapitalize?: 'none' | 'words' | 'characters' | 'sentences';
    textAlign?: 'center' | 'left' | 'right';
    placeholder?: string;
    value: string;
    onChangeText: (...event: any[]) => void;
    mask?: boolean;
    type?: 'cel-phone' | 'cnpj' | 'cpf' | 'custom';
    options?: {
        maskType?: 'BRL';
        withDDD?: boolean;
        dddMask?: '(99) ';
        mask?: '99.999-999' | '99/99/9999' | '99:99:99' | '99:99' | '9999';
    };
    keyboardType?: 'numeric' | 'default';
    editable?: boolean;
    multiline?: boolean;
    secureTextEntry?: boolean;
    style?: object | object[];
    defaultValue?: string;
}

const Input: React.FC<IProps> = ({
    autoCapitalize,
    textAlign,
    placeholder,
    value,
    onChangeText,
    mask,
    type,
    options,
    keyboardType,
    editable,
    multiline,
    secureTextEntry,
    style,
    defaultValue,
}) => {
    if ((mask === undefined || !mask) && type !== 'cpf' && type !== 'cnpj') {
        return (
            <TextInput
                style={[
                    styles.input,
                    editable !== undefined && !editable && styles.lockInputBG,
                    style !== undefined && style,
                ]}
                placeholderTextColor="#407f8a"
                autoCapitalize={autoCapitalize}
                textAlign={textAlign}
                placeholder={placeholder}
                editable={editable}
                value={value}
                defaultValue={defaultValue}
                multiline={multiline !== undefined && multiline}
                onChangeText={onChangeText}
                secureTextEntry={
                    secureTextEntry !== undefined && secureTextEntry
                }
                keyboardType={
                    keyboardType !== undefined ? keyboardType : 'default'
                }
            />
        );
    }

    if (type === 'cpf') {
        return (
            <TextInputMask
                style={[
                    styles.input,
                    editable !== undefined && !editable && styles.lockInputBG,
                    style !== undefined && style,
                ]}
                placeholderTextColor="#407f8a"
                autoCapitalize={autoCapitalize}
                textAlign={textAlign}
                placeholder={placeholder}
                value={value}
                defaultValue={defaultValue !== undefined && defaultValue}
                multiline={multiline !== undefined && multiline}
                onChangeText={onChangeText}
                secureTextEntry={
                    secureTextEntry !== undefined && secureTextEntry
                }
                type="cpf"
                editable={editable}
                autoFocus={!!(value !== undefined && value.length > 5)}
                keyboardType={
                    keyboardType !== undefined ? keyboardType : 'default'
                }
            />
        );
    }

    if (type === 'cnpj' && value.length > 14) {
        return (
            <TextInputMask
                style={[
                    styles.input,
                    editable !== undefined && !editable && styles.lockInputBG,
                    style !== undefined && style,
                ]}
                placeholderTextColor="#407f8a"
                autoCapitalize={autoCapitalize}
                textAlign={textAlign}
                placeholder={placeholder}
                value={value}
                defaultValue={defaultValue !== undefined && defaultValue}
                multiline={multiline !== undefined && multiline}
                onChangeText={onChangeText}
                secureTextEntry={
                    secureTextEntry !== undefined && secureTextEntry
                }
                type="cnpj"
                autoFocus
                editable={editable}
                keyboardType={
                    keyboardType !== undefined ? keyboardType : 'default'
                }
            />
        );
    }

    if (mask) {
        return (
            <TextInputMask
                style={[
                    styles.input,
                    editable !== undefined && !editable && styles.lockInputBG,
                    style !== undefined && style,
                ]}
                placeholderTextColor="#407f8a"
                autoCapitalize={autoCapitalize}
                textAlign={textAlign}
                placeholder={placeholder}
                value={value}
                defaultValue={defaultValue !== undefined && defaultValue}
                multiline={multiline !== undefined && multiline}
                onChangeText={onChangeText}
                secureTextEntry={
                    secureTextEntry !== undefined && secureTextEntry
                }
                type={type}
                options={options}
                editable={editable}
                keyboardType={
                    keyboardType !== undefined ? keyboardType : 'default'
                }
            />
        );
    }

    return (
        <TextInput
            style={[
                styles.input,
                editable !== undefined && !editable && styles.lockInputBG,
                style !== undefined && style,
            ]}
            placeholderTextColor="#407f8a"
            autoCapitalize={autoCapitalize}
            textAlign={textAlign}
            placeholder={placeholder}
            value={value}
            defaultValue={defaultValue}
            multiline={multiline !== undefined && multiline}
            autoFocus={value !== undefined && value.length === 14 && true}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry !== undefined && secureTextEntry}
            keyboardType={keyboardType !== undefined ? keyboardType : 'default'}
            editable={editable}
        />
    );
};

export default Input;
