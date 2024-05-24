import React, { PropsWithChildren } from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import {
    Modal,
} from 'react-native-paper';
import styles from './styles';

interface ModalComponentProps extends PropsWithChildren {
    actionsContent?: React.ReactNode | any,
    headerContent: React.ReactNode | any,
    customHeader?: boolean,
    styleContainer?: StyleProp<ViewStyle>,
    styleHeader?: StyleProp<ViewStyle>,
    styleContent?: StyleProp<ViewStyle>,
    styleActions?: StyleProp<ViewStyle>
    styleModal?: StyleProp<ViewStyle>
    modalOpen: boolean;
    onDismiss: () => void;
}

export const ModalComponent: React.FC<ModalComponentProps> = (props) => {
    return (
        <Modal
            visible={props.modalOpen}
            onDismiss={props.onDismiss}
            contentContainerStyle={props.styleModal || styles.modalStyle}>
            <View style={props.styleContainer || styles.modalContainer}>
                {props.customHeader ? (
                    <>
                        {props.headerContent}
                    </>
                ) : (
                    <View style={props.styleHeader || styles.modalHeader}>
                        {props.headerContent}
                    </View>
                )}
                <View style={props.styleContent || styles.modalBody}>
                    {props.children && props.children}
                </View>

                {props.actionsContent && (
                    <View style={props.styleActions || styles.modalActions}>
                        {props.actionsContent}
                    </View>
                )}
            </View>
        </Modal>
    );
}
