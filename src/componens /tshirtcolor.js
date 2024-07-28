import React from 'react';
import white_front from '../assets/tshirt/white/front.png';
import white_back from '../assets/tshirt/white/back.png';
import sky_front from '../assets/tshirt/sky/front.png';
import sky_back from '../assets/tshirt/sky/back.png';
import yellow_front from '../assets/tshirt/yellow/front.png';
import yellow_back from '../assets/tshirt/yellow/back.png';
import pink_front from '../assets/tshirt/pink/front.png';
import pink_back from '../assets/tshirt/pink/back.png';
import green_front from '../assets/tshirt/green/front.png';
import green_back from '../assets/tshirt/green/back.png';

export const tshirts = [
    white_front, white_back,
    sky_front, sky_back,
    yellow_front, yellow_back,
    pink_front, pink_back,
    green_front, green_back
];

export default function TshirtView({ color, direction }) {
    switch (color) {
        case 'sky':
            if (direction === 'front') {
                return <img src={sky_front} alt="tshirt" />;
            }
            return <img src={sky_back} alt="tshirt" />;
        case 'yellow':
            if (direction === 'front') {
                return <img src={yellow_front} alt="tshirt" />;
            }
            return <img src={yellow_back} alt="tshirt" />;
        case 'pink':
            if (direction === 'front') {
                return <img src={pink_front} alt="tshirt" />;
            }
            return <img src={pink_back} alt="tshirt" />;
        case 'green':
            if (direction === 'front') {
                return <img src={green_front} alt="tshirt" />;
            }
            return <img src={green_back} alt="tshirt" />;
        case 'black':
            if (direction === 'front') {
                return <img src={black_front} alt="tshirt" />;
            }
            return <img src={black_back} alt="tshirt" />;
        default:
            if (direction === 'front') {
                return <img src={white_front} alt="tshirt" />;
            }
            return <img src={white_back} alt="tshirt" />;
    }
}
