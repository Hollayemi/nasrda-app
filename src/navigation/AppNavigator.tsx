import React, { useRef, useCallback, useEffect } from 'react';
import { View, TouchableOpacity, Text, Animated, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeScreen }     from '../screens/HomeScreen';
import { NewsScreen }     from '../screens/NewsScreen';
import { MissionsScreen } from '../screens/MissionsScreen';
import { CentresScreen }  from '../screens/CentresScreen';
import { StaffScreen }    from '../screens/StaffScreen';
import { colors }         from '../theme';

const Tab = createBottomTabNavigator();

const TABS = [
  { name:'Home',     label:'Home',     icon:'🏠' },
  { name:'News',     label:'News',     icon:'📰' },
  { name:'Missions', label:'Missions', icon:'🛰️' },
  { name:'Centres',  label:'Centres',  icon:'⚗️' },
  { name:'Staff',    label:'Staff',    icon:'🔒' },
];

const CustomTabBar: React.FC<{ state:any; navigation:any }> = ({ state, navigation }) => {
  const insets  = useSafeAreaInsets();
  const slideY  = useRef(new Animated.Value(0)).current;
  const visible = useRef(true);
  const timer   = useRef<ReturnType<typeof setTimeout>>();

  const show = useCallback(() => {
    Animated.timing(slideY, { toValue: 0, duration: 280, useNativeDriver: true }).start();
    visible.current = true;
    clearTimeout(timer.current);
    timer.current = setTimeout(hide, 4000);
  }, []);

  const hide = useCallback(() => {
    Animated.timing(slideY, { toValue: 80 + (insets.bottom || 0), duration: 320, useNativeDriver: true }).start();
    visible.current = false;
  }, [insets.bottom]);

  useEffect(() => {
    // Start hide timer on mount
    timer.current = setTimeout(hide, 4000);
    return () => clearTimeout(timer.current);
  }, []);

  // Expose show() so screens can call it on touch
  // In each screen, import { tabBarController } and call tabBarController.show()
  tabBarController.show = show;

  return (
    <Animated.View style={[
      st.tabBar,
      { paddingBottom: insets.bottom || 8, transform: [{ translateY: slideY }] },
    ]}>
      {state.routes.map((route: any, i: number) => {
        const focused = state.index === i;
        const tab     = TABS[i];
        return (
          <TouchableOpacity key={route.key} style={st.tabItem}
            onPress={() => { navigation.navigate(route.name); show(); }}
            activeOpacity={0.7}>
            <Text style={[st.tabIcon, focused && { opacity: 1 }]}>{tab.icon}</Text>
            <Text style={[st.tabLabel, focused && st.tabLabelActive]}>{tab.label}</Text>
            {focused && <View style={st.dot} />}
          </TouchableOpacity>
        );
      })}
    </Animated.View>
  );
};

// Global controller — screens call tabBarController.show() on user touch
export const tabBarController = { show: () => {} };

export const AppNavigator: React.FC = () => (
  <Tab.Navigator
    tabBar={(props) => <CustomTabBar {...props} />}
    screenOptions={{ headerShown: false }}
  >
    <Tab.Screen name="Home"     component={HomeScreen}     />
    <Tab.Screen name="News"     component={NewsScreen}     />
    <Tab.Screen name="Missions" component={MissionsScreen} />
    <Tab.Screen name="Centres"  component={CentresScreen}  />
    <Tab.Screen name="Staff"    component={StaffScreen}    />
  </Tab.Navigator>
);

const st = StyleSheet.create({
  tabBar: {
    position:'absolute', bottom:0, left:0, right:0,
    flexDirection:'row',
    backgroundColor:'rgba(10,22,40,0.97)',
    borderTopWidth:1, borderTopColor:'rgba(0,166,81,0.25)',
    ...Platform.select({
      ios:     { shadowColor:'#000', shadowOpacity:0.3, shadowRadius:10, shadowOffset:{width:0,height:-3} },
      android: { elevation: 12 },
    }),
  },
  tabItem: { flex:1, alignItems:'center', justifyContent:'center', paddingTop:10, paddingBottom:4, gap:2 },
  tabIcon: { fontSize:20, opacity:0.45 },
  tabLabel: { fontSize:9, fontWeight:'600', color:colors.textThird, letterSpacing:0.3 },
  tabLabelActive: { color:colors.green2 },
  dot: { width:4, height:4, borderRadius:2, backgroundColor:colors.green2, marginTop:2 },
});
