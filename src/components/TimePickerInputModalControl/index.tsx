import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { TimePickerModal, TimePicker } from 'react-native-paper-dates'
import { View, StyleProp, TextStyle } from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';
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
    style: StyleProp<TextStyle>;
}

const TimePickerInputModalControl: React.FC<TimePickerInputModalControlProps> = (
    { name, label, control, outlineColor, error, errorText, style }) => {

    const [modalVisible, setModalVisible] = useState<boolean>(false);

    function tratarHoraTimePicker(hora: number, minuto: number): string {
        return `${hora}:${minuto}`;
    }

    return (
        <View style={styles.container}>
            <Controller
                name={name}
                control={control}
                render={({ field: { onChange, value } }) => (
                    <>
                        <TimePickerModal
                            visible={modalVisible}
                            onDismiss={() => setModalVisible(false)}
                            onConfirm={({ hours, minutes }) => {
                                onChange(tratarHoraTimePicker(hours, minutes));
                                setModalVisible(false);
                            }}
                            label="Hora da Abertura" // optional, default 'Select time'
                            uppercase={false} // optional, default is true
                            cancelLabel="Cancelar" // optional, default: 'Cancel'
                            confirmLabel="Confirmar" // optional, default: 'Ok'
                            animationType="none" // optional, default is 'none'
                            locale="en" // optional, default is automically detected by your system
                            keyboardIcon="keyboard-outline" // optional, default is "keyboard-outline"
                        // clockIcon="clock-outline" // optional, default is "clock-outline"
                        />

                        <TextInput
                            label={label}
                            style={style}
                            outlineColor={outlineColor || globalColors.primaryColor}
                            onFocus={() => setModalVisible(true)}
                            showSoftInputOnFocus={false}
                            // right={
                            //     <TextInput.Icon
                            //         onPress={() => setModalVisible(true)}
                            //         name="clock-plus"
                            //         forceTextInputFocus={false}
                            //     />}
                            mode='outlined'
                            value={value}
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

export default TimePickerInputModalControl;
