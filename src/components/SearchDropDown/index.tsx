import React, { useEffect, useState } from 'react';
import { View, StyleProp, TextStyle, ScrollView } from 'react-native';
import { Dialog, HelperText, Portal, Searchbar, TextInput, List, RadioButton, Button, MD2Colors } from 'react-native-paper';
import { globalColors } from '../../global/styleGlobal';

import styles from './styles';

interface SearchDropDownProps {
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
    disabled?: boolean;
    style: StyleProp<TextStyle>;
}

export interface DropDownModal {
    label: string;
    value: string;
}

const SearchDropDown: React.FC<SearchDropDownProps> = (
    { onChange, value, label, outlineColor, style, error, errorText, items, disabled }) => {

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
        if (!disabled)
            setModalVisible(true);
    }

    function hideDialog() {
        setModalVisible(false);
    }

    function onCheckValue(item: DropDownModal) {
        onChange(item.value)
        hideDialog();
    }

    return (
        <View style={styles.container}>
            <TextInput
                label={label}
                style={style}
                disabled={disabled}
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
                        {items.filter(filterList).map((item, index) => (
                            <List.Item
                                key={index}
                                style={styles.item}
                                onPress={() => onCheckValue(item)}
                                title={item.label}
                                right={props => (
                                    <RadioButton.Android
                                        {...props}
                                        color={globalColors.primaryColor}
                                        value={item.value.toString()}
                                        status={value == item.value.toString() ? 'checked' : 'unchecked'}
                                        onPress={() => onCheckValue(item)}
                                    />
                                )}
                            />
                        ))}
                    </ScrollView>
                    <View style={styles.searchBarActionContainer}>
                        <Button
                            mode='text'
                            textColor={MD2Colors.red400}
                            onPress={hideDialog}>
                            Fechar
                        </Button>
                    </View>
                </Dialog>
            </Portal>
        </View>
    );
}

export default SearchDropDown;
