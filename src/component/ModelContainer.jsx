import { View, Text, Modal, BackHandler } from 'react-native'
import React, { useEffect } from 'react'

export default function ModelContainer({ modelHidden, children, animationType, setOpenDragableModel }) {
    return (
        <Modal animationType={animationType}
            transparent={true}
            onRequestClose={()=>setOpenDragableModel(false)}
            visible={modelHidden}>{children}</Modal>

    )
}