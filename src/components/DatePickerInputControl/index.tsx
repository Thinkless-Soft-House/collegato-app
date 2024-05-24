import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { DatePickerInput } from 'react-native-paper-dates'
import { View, StyleProp, TextStyle } from 'react-native';
import { HelperText } from 'react-native-paper';

import { globalColors } from '../../global/styleGlobal';

import styles from './styles';

interface HourObject {
    hour: string;
    minute: string;
}

interface TimePickerInputModalControlProps {
    control: any;
    label: string;
    name: string;
    error?: boolean;
    outlineColor?: string;
    errorText?: string;
    style?: StyleProp<TextStyle>;
    containerStyle?: StyleProp<TextStyle>;
}

const DatePickerInputControl: React.FC<TimePickerInputModalControlProps> = (
    { name, label, control, outlineColor, error, errorText, style, containerStyle }) => {

    const [modalVisible, setModalVisible] = useState<boolean>(false);

    function tratarHoraTimePicker(hora: number, minuto: number): string {
        return `${hora}:${minuto}`;
    }

    return (
        <View style={[styles.container, containerStyle]}>
            <Controller
                name={name}
                control={control}
                render={({ field: { onChange, value } }) => (
                    <>
                        <DatePickerInput
                            locale="pt-br"
                            label={label}
                            style={style}
                            value={value}
                            outlineColor={outlineColor || globalColors.primaryColor}
                            onChange={(d) => onChange(d)}
                            inputMode="end"
                            mode='outlined'
                             />
                        {(error && errorText) && (
                            <HelperText type="error" visible>
                                {errorText}
                            </HelperText>
                        )}
                    </>
                )} />
        </View>
    );
}

export default DatePickerInputControl;
