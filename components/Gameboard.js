import React, { useState, useEffect } from "react";
import { Text, View, Pressable } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import styles from "../style/style";

const board = [];
const values = [];
const NBR_OF_DICES = 5;
const NBR_OF_THROWS = 4;
const NBR_OF_ROUNDS = 6;
const POINTS_FOR_BONUS = 63;

export default function Gameboard() {

    const [NbrOfThrowsLeft, setNbrOfThrowsLeft] = useState(NBR_OF_THROWS);
    const [Status, setStatus] = useState("Throw dices");
    const [ButtonText, setButtonText] = useState("Throw dices");
    const [SelectedDices, setSelectedDices] = useState(new Array(NBR_OF_DICES).fill(false));
    const [SelectedNumbers, setSelectedNumbers] = useState(new Array(6).fill(false));
    const [SelectedNumber, setSelectedNumber] = useState(0);
    const [NbrOfPoints, setNbrOfPoints] = useState(0);
    const [NbrOfRoundsLeft, setNbrOfRoundsLeft] = useState(NBR_OF_ROUNDS);
    const [PointsAwayFromBonus, setPointsAwayFromBonus] = useState(POINTS_FOR_BONUS);
    const [BonusState, setBonusState] = useState(false);
    const [BonusInfo, setBonusInfo] = useState('You are ' + PointsAwayFromBonus + ' points away from bonus');
    

    const row1 = [];
    for (let i=0;i<NBR_OF_DICES;i++){
        row1.push(
            <Pressable
                key={"row1"+i}
                onPress={()=>selectDice(i)}>
                <MaterialCommunityIcons
                    name={board[i]}
                    key={"row1"+i}
                    size={50}
                    color={getDiceColor(i)}>
                </MaterialCommunityIcons>
            </Pressable>
        )
    }
    const row2 = [];
    for (let i=1;i<7;i++){
        row2.push(
            <View key={"row2"+i} style={styles.numbers}>
                <Text>{SelectedNumbers[i]}</Text>
                <Pressable
                    key={"row2"+i}
                    onPress={()=>selectNumber(i)}>
                    <MaterialCommunityIcons
                        name={"dice-"+i}
                        key={"row2"+i}
                        size={40}
                        color={getNumberColor(i)}>
                    </MaterialCommunityIcons>
                </Pressable>
            </View>
        )
    }

    useEffect(() => {
        if (NbrOfThrowsLeft===0) {
            if (BonusState===false) {
                if (PointsAwayFromBonus<1){
                    setBonusInfo("You got the bonus!");
                    setNbrOfPoints(NbrOfPoints+35);
                    setBonusState(true);
                } else {
                    setBonusInfo('You are ' + PointsAwayFromBonus + ' points away from bonus');
                }
            }
            if (NbrOfRoundsLeft===0) {
                setStatus("Game over. All points selected");
                setButtonText("New game");
                return;
            }
            setButtonText("Throw dices");
            setStatus("Throw dices");
            setNbrOfThrowsLeft(NBR_OF_THROWS);
            setSelectedDices(new Array(NBR_OF_DICES).fill(false));
            return;
        }
        if (NbrOfThrowsLeft===1) {
            setButtonText("Select points");
            setStatus("Select your points");
            setNbrOfRoundsLeft(NbrOfRoundsLeft-1);
            return;
        }
    }, [NbrOfThrowsLeft]);
    

    function getDiceColor(i) {
        return SelectedDices[i] ? "black" : "steelblue";
    }

    function getNumberColor(i) {
        return SelectedNumber === i||SelectedNumbers[i] ? "black" : "steelblue";
    }

    const selectDice =(i)=> {
        if (NbrOfThrowsLeft===NBR_OF_THROWS) {
            setStatus("Throw dices ones before selecting dices");
            return;
        }
        let dices = [...SelectedDices];
        dices[i] = SelectedDices[i] ? false : true;
        setSelectedDices(dices);
    }

    const selectNumber =(i)=> {
        if (NbrOfThrowsLeft===1){
            setSelectedNumber(i);
            return;
        }
        if (NbrOfRoundsLeft===0) {
            setStatus("Game is over. It's too late to select points");
            return;
        }
        setStatus("Use your throws before selecting points");
    }

    const throwDices =()=> {
        if(NbrOfThrowsLeft===1) {
            if(SelectedNumber!=0&&!SelectedNumbers[SelectedNumber]){
                let numbers = [...SelectedNumbers];
                numbers[SelectedNumber] = countPoints();
                let number = numbers[SelectedNumber];
                setSelectedNumbers(numbers);
                setNbrOfPoints(NbrOfPoints+number);
                setPointsAwayFromBonus(PointsAwayFromBonus-number);
                setNbrOfThrowsLeft(NbrOfThrowsLeft-1);
                return;
            }
            return;
        }
        if(ButtonText=="New game"){
            setButtonText("Throw dices");
            setStatus("Throw dices");
            setSelectedDices(new Array(NBR_OF_DICES).fill(false));
            setSelectedNumbers(new Array(6).fill(false));
            setSelectedNumber(0);
            setNbrOfPoints(0);
            setNbrOfRoundsLeft(NBR_OF_ROUNDS);
            setPointsAwayFromBonus(POINTS_FOR_BONUS);
            setBonusInfo('You are ' + POINTS_FOR_BONUS + ' points away from bonus');
            setBonusState(false);
            setNbrOfThrowsLeft(NBR_OF_THROWS);
            return;
        }
        for(let i=0;i<NBR_OF_DICES;i++){
            if (!SelectedDices[i]) {
                let randomNumber = Math.floor(Math.random()*6+1);
                board[i] = 'dice-' + randomNumber;
                values[i] = randomNumber;
            }
        }
        setStatus("Select and throw dices");
        setNbrOfThrowsLeft(NbrOfThrowsLeft-1);
    }

    const countPoints =()=> {
        let points = 0;
        for (let i=0;i<NBR_OF_DICES;i++){
            if (values[i]===SelectedNumber) points += SelectedNumber;
        }
        return points;
    }

    return (
        <View style={styles.gameboard}>
            <View style={styles.flex}>{row1}</View>
            <Text style={styles.gameinfo}>Throws left: {NbrOfThrowsLeft-1}</Text>
            <Text style={styles.gameinfo}>{Status}</Text>
            <Pressable style={styles.button}
                onPress={()=>throwDices()}>
                <Text style={styles.buttonText}>{ButtonText}</Text>
            </Pressable>
            <Text style={styles.pointcount}>Total: {NbrOfPoints}</Text>
            <Text style={styles.bonusinfo}>{BonusInfo}</Text>
            <View  style={styles.flex}>{row2}</View>
        </View>
    )
}