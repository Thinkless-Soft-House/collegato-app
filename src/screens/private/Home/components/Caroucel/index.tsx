import { Image, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Text } from 'react-native-paper';
import AppIntroSlider from 'react-native-app-intro-slider';
import styles from './styles';

interface IDataCarousel {
    key: string;
    backgroundColor: string;
    img: object;
    title: string;
}

const carouselOne = require('../../../../../../assets/slider4.jpeg');
const carouselTwo = require('../../../../../../assets/slider5.jpeg');
const carouselTree = require('../../../../../../assets/slider6.jpeg');
const carouselFor = require('../../../../../../assets/slider7.jpeg');

const dataCarousel: IDataCarousel[] = [
    {
        key: '1',
        backgroundColor: '#fff',
        img: carouselOne,
        title: "Agenda eletrônica" 
    },
    {
        key: '2',
        backgroundColor: '#fff',
        img: carouselTwo,
        title: "Atendimento Humanizado"
    },
    {
        key: '3',
        backgroundColor: '#fff',
        img: carouselTree,
        title: "Secretária Virtual"
    },
    {
        key: '4',
        backgroundColor: '#fff',
        img: carouselFor,
        title: "Ouvidoria Express"
    },
];

const LayoutCarousel: React.FC<IDataCarousel> = (Item) => (
    <View style={{justifyContent: 'center', alignItems: 'center', marginBottom: 30}}>
        <Image style={[styles.containImg]} source={Item.img} />
        <Text style={[styles.title, styles.montserrat]} variant="headlineSmall">{Item.title}</Text>
    </View>
);

const Carousel: React.FC = () => {
    const slider = useRef<AppIntroSlider<IDataCarousel>>(null);
    const [sliderControl, setSliderControl] = useState<boolean>(false);

    useEffect(() => {
        let numSlide = 0;
        if (!sliderControl) {
            setInterval(() => {
                numSlide === dataCarousel.length - 1
                    ? (numSlide = 0)
                    : (numSlide += 1);

                slider.current?.goToSlide(numSlide);
            }, 3500);

            setSliderControl(true);
        }
    }, []);

    return (
        <AppIntroSlider
            ref={slider}
            renderItem={({ item }) => LayoutCarousel(item)}
            data={dataCarousel}
            style={[styles.contain]}
            dotStyle={styles.dot}
            activeDotStyle={styles.activeDot}
            renderNextButton={() => <View />}
            renderDoneButton={() => <View />}
        />
    );
};

export default Carousel;
