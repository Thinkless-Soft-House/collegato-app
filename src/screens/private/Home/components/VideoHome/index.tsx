import { View, Text, Dimensions, ScaledSize } from 'react-native';
import React from 'react';
import YoutubePlayer from 'react-native-youtube-iframe';

import styles from './styles';

const { height }: ScaledSize = Dimensions.get('screen');
const heigthVideoContain: number = (height * 100) / 80;

interface IDataVideo {
    url: string;
    title: string;
    id?: number;
}

const videoData: IDataVideo[] = [
    {
        url: 'https://www.youtube.com/watch?v=UOjJESCiyF0',
        title: 'Conheca a Collegato',
    },
];

const VideoHome: React.FC = () => (
    <View style={[styles.contain]}>
        {videoData.map((item, id) => (
            <View style={[styles.containContent]} key={id}>
                <Text style={[styles.montserrat, styles.title]}>
                    {item.title}
                </Text>
                <YoutubePlayer
                    height={heigthVideoContain}
                    videoId={item.url.split('v=')[1].substring(0, 11)}
                />
            </View>
        ))}
    </View>
);

export default VideoHome;
