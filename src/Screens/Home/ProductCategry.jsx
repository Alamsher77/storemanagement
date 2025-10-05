import { View, StyleSheet, Button,Animated,Easing } from 'react-native'; 
 import ScrollContainer from '../../component/ScrollContainer'
 import WaterLableTank from '../../component/WaterLableTank'
export default function ProductCategry(props) {
  
  
  return (
    <ScrollContainer>
    <View style={styles.container}>
      <WaterLableTank />
    </View>
      <Button title="Press to hear some words"   />
    </ScrollContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',  
    alignItems:'center',
    
  },
});
