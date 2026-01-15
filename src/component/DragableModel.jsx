import { View, Text, Animated, PanResponder, Dimensions,ScrollView } from 'react-native'
import React, { useEffect, useRef, useState,useContext } from 'react'
import ModelContainer from './ModelContainer'
import ScrollContainer from './ScrollContainer' 
import {ProductContext} from '../Context/Contextcontent'
const { height: ScreenHeight } = Dimensions.get('window')
export default function DragableModel({
  openDragableModel, setOpenDragableModel, children, minHeight,style }) {
     const {themes} = useContext(ProductContext)
    const animatedHeight = useRef(new Animated.Value(minHeight)).current;
    const startHeight = useRef(minHeight)
    const containerOpacity = useRef(new Animated.Value(1)).current
    const [move,setmove] = useState(false)
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                animatedHeight.stopAnimation((value) => { 
                    startHeight.current = value
                })
            },
            onPanResponderMove: (_, gesture) => {
                
                let newHeight = startHeight.current - gesture.dy;
                if (newHeight >= 100 && newHeight <= ScreenHeight * 0.9) {
                    animatedHeight.setValue(newHeight)
                }

            },
            onPanResponderRelease: (_, gesture) => {
             
                let newHeight = startHeight.current - gesture.dy;
                if (newHeight < minHeight) {
                    Animated.timing(animatedHeight, {
                        toValue: 0,
                        duration: 200,
                        useNativeDriver: false
                    }).start(() => {
                        animatedHeight.setValue(minHeight)
                        startHeight.current = minHeight
                        setOpenDragableModel(false)
                    })
                }
            }
        })
    ).current;
   
    return (
        <ModelContainer animationType={"slide"} setOpenDragableModel={setOpenDragableModel} modelHidden={openDragableModel}>
            <View style={{ backgroundColor: 'rgba(0,0,0,0.5)', flex: 1, justifyContent: 'flex-end' }}>
                <Animated.View {...panResponder.panHandlers}  style={{ opacity: containerOpacity, height: animatedHeight, backgroundColor:themes.mode == 'dark' ? '#111' :'#fff', width: '100%', borderTopLeftRadius: 20, borderTopRightRadius: 20,}}>
                    <Animated.View  style={{ width: '100%', height: 20, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ width: 80, height: 6, backgroundColor: 'gray', borderRadius: 20 }} />
                    </Animated.View>
                    <ScrollView
                    showsVerticalScrollIndicator={false} 
                    contentContainerStyle={style}
                    >
                    {
                        children
                    }
                    </ScrollView>
                </Animated.View>
            </View>
        </ModelContainer>
    )
}