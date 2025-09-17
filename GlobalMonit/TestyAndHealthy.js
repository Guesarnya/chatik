import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');
import { BlurView } from 'expo-blur';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { SafeAreaView } from 'react-native-safe-area-context';
import recipes from '../AllBackEnd/RecipesForTesty';
import React, { useState } from 'react';
import RenderHTML from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';




export default function TestyAndHealthy({ visible, onClose }) {

    const [loading, setLoading] = useState(false);

    const [currentRecipe, setCurrentRecipe] = useState("Можно получить рецепт при нажатии на кнопку еще!!!");

    const handleCopy = async () => {
        await Clipboard.setStringAsync(currentRecipe);
    };

    const handleGetRecipe = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://www.xn--d1arx6a.xn--p1ai/recipe');
            const data = await response.json();
            console.log("DATA", data.message);
            setCurrentRecipe(data.message);

        } catch (error) {
            console.error(error);
            setCurrentRecipe("Произошла ошибка, попробуй еще раз!");
        } finally {
            setLoading(false)
        }
    };


    return (
        <Modal
            animationType="fade"
            transparent
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <BlurView intensity={10} tint='default' style={styles.blur} />

                <View style={styles.modalBox}>
                    <View style={styles.TopBlock}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.TestyAndHealthy}>Вкусно и полезно</Text>
                            <Text style={styles.Recept}>Сбалансированный рецепт, адаптированный под ваши цели</Text>
                        </View>

                        <View>
                            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                                <Ionicons name="close" size={24} color="black" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.CenterBlock}>
                        <ScrollView style={styles.scrollView}>
                            <RenderHTML
                                contentWidth={width}
                                source={{ html: `<div>${currentRecipe}</div>` }}
                                baseStyle={styles.scrollText}
                            />
                        </ScrollView>
                    </View>

                    <View style={styles.BottomBlock}>
                        <TouchableOpacity style={styles.copy} onPress={handleCopy}>
                            <Ionicons name='copy-outline' size={24} color={"black"} />
                            <Text style={styles.textCopy}>Скопировать</Text>
                        </TouchableOpacity>
                    </View>


                    <View style={styles.Variants}>
                        <TouchableOpacity style={[
                            styles.MoreVariants,
                            loading && styles.MoreVariantsDisabled
                        ]}
                            onPress={handleGetRecipe}
                            disabled={loading}>

                            <Ionicons name='sync-outline' size={24} color={"white"} />
                            <Text style={styles.TextVariants}>{loading ? "Генерируем..." : "Еще варианты"}</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },

    MoreVariantsDisabled: {
        backgroundColor: '#A0A0A0',
    },

    modalBox: {
        width: width * 0.95,
        height: height * 0.75,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        elevation: 5,
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 4
    },
    blur: {
        position: "absolute",
        width: width,
        height: height
    },
    TopBlock: {
        flexDirection: "row",

    },
    TestyAndHealthy: {
        fontSize: 20,
        fontWeight: "500"
    },
    closeButton: {
        width: 46,
        height: 46,
        backgroundColor: "#F1F3F6",
        borderRadius: 70,
        alignItems: "center",
        justifyContent: "center",

    },

    Recept: {
        paddingTop: 6,
        color: "#C8D0DC",
        fontSize: 16,
        fontWeight: "400"
    },

    CenterBlock: {
        paddingTop: 15
    },
    scrollView: {
        height: height * 0.4,
        backgroundColor: "#E6EDFF",
        borderRadius: 20,
    },
    scrollText: {
        fontSize: 16,
        padding: 12,
        fontWeight: "400",
    },

    BottomBlock: {
        marginTop: 4
    },

    copy: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#E6EDFF",
        marginTop: 8,
        borderRadius: 20,
        gap: 8,
        height: height * 0.065
    },

    textCopy: {
        fontSize: 16,
        fontWeight: "500"
    },


    Variants: {
        marginTop: 'auto'
    },

    MoreVariants: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0046F8",
        marginTop: 8,
        borderRadius: 20,
        gap: 8,
        height: height * 0.065,
        marginBottom: 10
    },

    TextVariants: {
        fontSize: 16,
        fontWeight: "500",
        color: "white"
    },

});
