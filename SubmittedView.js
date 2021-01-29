import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useParams } from 'react-router';

import {RoomInfo, renderDates, dateFormat} from './RoomInfo';

export default function SubmittedView (props) {

    const styles = props.styles;
    const roomData = props.room;
    const matches = props.matches;
    
    let {dates} = useParams();
    dates = dates.split(',');

    let matchRender = null;

    const matchText = matches === null || matches.length === 0 ? 'No matches.' : 'Matches:'
    if(matches != null) matchRender = <ScrollView>{renderDates(matches, styles, dateFormat)}</ScrollView>


    return <View style={styles.container}>
        <RoomInfo styles={styles} roomData={roomData} />
        <Text style={styles.header}>Submitted</Text>
        <ScrollView>{renderDates(dates, styles, dateFormat)}</ScrollView>
        <Text style={styles.header}>{matchText}</Text>
        {matchRender}
    </View>
    
}