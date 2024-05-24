import React, { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import { View, StyleProp, TextStyle, ScrollView } from 'react-native';
import { Dialog, HelperText, Portal, Searchbar, TextInput, List, RadioButton } from 'react-native-paper';
import { globalColors } from '../../global/styleGlobal';

import styles from './styles';

interface SearchDropDownControlProps {
    control: any;
    name: string;
    onChange: (value: any) => void;
    items: DropDownModal[] | Array<{
        label: string;
        value: string;
    }>;
    value: any;
    label: string;
    outlineColor?: string;
    error?: boolean;
    errorText?: string;
    style: StyleProp<TextStyle>;
}

export interface DropDownModal {
    label: string;
    value: string;
}

const SearchDropDownControl: React.FC<SearchDropDownControlProps> = (
    { onChange, value, label, outlineColor, style, error, errorText, items, name, control }) => {

    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [searchBarValue, setSearchBarValue] = useState<string>("");
    const [inputValue, setInputValue] = useState<string>("");

    useEffect(() => {
        const item = items.find(e => e.value == value);
        setInputValue(item ? item.label : "");
    }, [value]);

    function filterList(item: DropDownModal): boolean {
        if (searchBarValue) {
            return item.label.includes(searchBarValue);
        }
        else
            return true;
    }

    function showDialog() {
        setModalVisible(true);
    }

    function hideDialog() {
        setModalVisible(false);
    }

    function onCheckValue(item: DropDownModal) {
        onChange(item.value);
        hideDialog();
    }

    return (
        <View style={styles.container}>
            <Controller
                name={name}
                control={control}
                render={({ field: { onChange, value } }) => (
                    <>
                        <TextInput
                            label={label}
                            style={style}
                            outlineColor={outlineColor || globalColors.primaryColor}
                            onPressIn={showDialog}
                            showSoftInputOnFocus={false}
                            mode='outlined'
                            value={inputValue}
                        />
                        {(error && errorText) && (
                            <HelperText type="error" visible>
                                {errorText}
                            </HelperText>
                        )}
                    </>
                )}
            />
            <Portal>
                <Dialog style={styles.modalContainer} visible={modalVisible} onDismiss={hideDialog}>
                    <View style={styles.searchBarContainer}>
                        <Searchbar
                            style={styles.searchBar}
                            placeholder="Buscar"
                            autoCapitalize='none'
                            onChangeText={setSearchBarValue}
                            value={searchBarValue}
                        />
                    </View>
                    <ScrollView style={styles.scrollArea} contentContainerStyle={{ paddingHorizontal: 24 }}>
                        {items.filter(filterList).map(item => (
                            <List.Item
                                style={styles.item}
                                onPress={() => onCheckValue(item)}
                                title={item.label}
                                right={props => <RadioButton.Android
                                    {...props}
                                    color={globalColors.primaryColor}
                                    value={item.value.toString()}
                                    status={value == item.value.toString() ? 'checked' : 'unchecked'}
                                    onPress={() => onCheckValue(item)}
                                />}
                            />
                        ))}
                    </ScrollView>
                </Dialog>
            </Portal>
        </View>
    );
}

export default SearchDropDownControl;
