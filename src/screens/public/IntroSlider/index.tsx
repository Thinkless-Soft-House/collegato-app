import {
    View,
    SafeAreaView,
    Image,
    Text,
    TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import AppIntroSlider from 'react-native-app-intro-slider';

import styles from './styles';

interface ISliderData {
    key: string;
    title: string;
    text: string;
    img: object;
    backgroundColor: string;
}

const sliderOne = require('../../../../assets/slider1.jpeg');
const sliderTwo = require('../../../../assets/slider2.jpeg');
const sliderTree = require('../../../../assets/slider3.webp');

const slides: ISliderData[] = [
    {
        key: '1',
        title: 'Aqui você encontra :)',
        text: 'Sua agenda totalmente online. Seu cliente pode acessar sua agenda em qualquer plataforma. Bloqueio de horas ou dias integrados ao Google.',
        img: sliderOne,
        backgroundColor: '#ffffff',
    },
    {
        key: '2',
        title: 'Praticidade e segurança onde você estiver',
        text: 'Tenha um atendimento seguro e humanizado para as suas ligações telefônicas e receba os recados mais importantes na palma da sua mão.',
        img: sliderTwo,
        backgroundColor: '#ffffff',
    },
    {
        key: '3',
        title: 'Descubra',
        text: 'Encontre as empresas e profissionais prestadores de serviço que fornecem o agendamento remoto.',
        img: sliderTree,
        backgroundColor: '#ffffff',
    },
];

const Slider: React.FC<ISliderData> = (item) => (
    <SafeAreaView style={[styles.containFlex]}>
        <View style={[styles.containPhoto]}>
            <Image
                source={item.img}
                style={[styles.containFlex, styles.imgSlider]}
                resizeMode="contain"
            />
        </View>

        <View style={[styles.containText]}>
            <Text
                style={[styles.textCenter, styles.textTitle, styles.montserrat]}
            >
                {item.title}
            </Text>

            <Text
                style={[styles.textCenter, styles.textInfo, styles.montserrat]}
            >
                {item.text}
            </Text>
        </View>
    </SafeAreaView>
);

interface IPropsSlider {
    goBack(param: boolean): void;
    verify: boolean;
}

const IntroSlider: React.FC<IPropsSlider> = ({ goBack }) => {
    const [showSkip, setShowSkip] = useState(true);

    return (
        <View style={[styles.containFlex]}>
            <AppIntroSlider
                renderItem={({ item }) => Slider(item)}
                data={slides}
                dotStyle={{ backgroundColor: '#57c6e28d' }}
                activeDotStyle={{ backgroundColor: '#57c7e2', width: 30 }}
                onSlideChange={(a, b) => {
                    a === slides.length - 1
                        ? setShowSkip(false)
                        : setShowSkip(true);
                }}
                renderNextButton={() => (
                    <Text testID="btnNext" style={[styles.textNextSlider]}>
                        Próximo {'>'}
                    </Text>
                )}
                renderDoneButton={() => (
                    <Text style={[styles.textNextSlider]}>Vamos lá {'>'}</Text>
                )}
                onDone={() => goBack(false)}
            />

            {showSkip && (
                <View style={[styles.containSkip]}>
                    <TouchableOpacity
                        testID="btnSkip"
                        onPress={() => goBack(false)}
                    >
                        <Text style={[styles.colorText]}>Pular</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

export default IntroSlider;
