import React from 'react';
import { DatePickerModal } from 'react-native-paper-dates'
import { View, StyleProp, TextStyle } from 'react-native';
import { Button } from 'react-native-paper';

import styles from './styles';


interface TimePickerInputModalControlProps {
    label: string;
    error?: boolean;
    outlineColor?: string;
    onChange(date: Date): void;
    errorText?: string;
    style?: StyleProp<TextStyle>;
    containerStyle?: StyleProp<TextStyle>;
}

export const DatePickerModalInput: React.FC<TimePickerInputModalControlProps> = (
    { label, outlineColor, error, errorText, style, containerStyle, onChange }) => {

    const [date, setDate] = React.useState<Date>(null);
    const [open, setOpen] = React.useState(false);

    const handleModal = () => setOpen(!open);

    function onConfirmSingle(item: any) {
        handleModal();
        setDate(item.date);
        onChange(item.date);
    }

    return (
        <View style={[styles.container, containerStyle]}>
            <Button onPress={() => setOpen(true)} uppercase={false} mode="outlined">
                {label}
            </Button>
            <DatePickerModal
                locale="en"
                label={label}
                mode="single"
                visible={open}
                onDismiss={handleModal}
                date={date}
                onConfirm={onConfirmSingle}
                saveLabel="Confirmar" // optional
                // validRange={{
            //   startDate: new Date(2021, 1, 2),  // optional
            //   endDate: new Date(), // optional
            //   disabledDates: [new Date()] // optional
            // }}
            // onChange={} // same props as onConfirm but triggered without confirmed by user
            // saveLabelDisabled={true} // optional, default is false
            // uppercase={false} // optional, default is true
            // label="Select date" // optional
            // animationType="slide" // optional, default is 'slide' on ios/android and 'none' on web
            // startYear={2000} // optional, default is 1800
            // endYear={2100} // optional, default is 2200
            // closeIcon="close" // optional, default is "close"
            // editIcon="pencil" // optional, default is "pencil"
            // calendarIcon="calendar" // optional, default is "calendar"
            />
        </View>
    );
}
