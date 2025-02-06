import React, { useState } from 'react';
import { View, Text, Button, TextInput, FlatList } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Card } from '@/components/ui/card';

const Input = ({ placeholder, value, onChangeText, keyboardType }) => (
    <TextInput
        style={{ borderWidth: 1, padding: 10, marginVertical: 5, borderRadius: 5 }}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
    />
);

const FysioFitApp = () => {
    const [painLevel, setPainLevel] = useState('');
    const [painData, setPainData] = useState([]);
    const [messages, setMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    
    const handlePainSubmit = () => {
        if (painLevel !== '' && parseInt(painLevel) >= 1 && parseInt(painLevel) <= 10) {
            setPainData([...painData, { day: painData.length + 1, level: parseInt(painLevel) }]);
            setPainLevel('');
        }
    };

    const handleChatSubmit = () => {
        if (chatInput.trim() !== '') {
            setMessages([...messages, { text: chatInput, sender: 'User' }]);
            setChatInput('');
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>FysioFit App</Text>
            
            {/* Pijnregistratie */}
            <Card>
                <Text style={{ fontSize: 18 }}>Pijnregistratie</Text>
                <Input
                    placeholder="Geef je pijnniveau (1-10) aan"
                    value={painLevel}
                    onChangeText={setPainLevel}
                    keyboardType='numeric'
                />
                <Button title="Toevoegen" onPress={handlePainSubmit} />
            </Card>
            
            {/* Grafiek */}
            {painData.length > 0 && (
                <LineChart
                    data={{
                        labels: painData.map((item) => `Dag ${item.day}`),
                        datasets: [{ data: painData.map((item) => item.level) }],
                    }}
                    width={300}
                    height={200}
                    yAxisLabel=""
                    chartConfig={{
                        backgroundColor: '#f0f0f0',
                        backgroundGradientFrom: '#fff',
                        backgroundGradientTo: '#fff',
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
                    }}
                />
            )}
            
            {/* Chatfunctionaliteit */}
            <Card>
                <Text style={{ fontSize: 18 }}>Chat met AI of Fysio</Text>
                <FlatList
                    data={messages}
                    renderItem={({ item }) => (
                        <Text style={{ marginBottom: 5 }}>{item.sender}: {item.text}</Text>
                    )}
                />
                <Input
                    placeholder="Typ een bericht..."
                    value={chatInput}
                    onChangeText={setChatInput}
                />
                <Button title="Verstuur" onPress={handleChatSubmit} />
            </Card>
        </View>
    );
};

export default FysioFitApp;
