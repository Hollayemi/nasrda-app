import {
    View, Text, Image, ScrollView, TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NavLogo } from '../components/NavLogo';
import { colors } from '../theme';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

export function NasrdaaiScreen() {
    const insets = useSafeAreaInsets();
    return (
        <View style={[st.root, { paddingTop: insets.top }]}>
            <View style={st.nav}>
                <NavLogo />
                <Text style={st.navTitle}>Centres & Labs</Text>
                <FontAwesome5 name="flask" size={17} color={colors.textThird} />
            </View>

            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 18, color: colors.textPrimary }}>Welcome to the NASRDA AI Assistant</Text>
                <Text style={{ fontSize: 14, color: colors.textSecond, marginTop: 8 }}>
                    Ask questions about NASRDA missions, data, and more.
                </Text>
            </View>
        </View>
    );
}


const st = StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.navy },
    scroll: { paddingHorizontal: 20, paddingTop: 16 },
    nav: {
        height: 56, backgroundColor: 'rgba(10,22,40,0.98)',
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 20, gap: 12,
        borderBottomWidth: 1, borderBottomColor: 'rgba(0,166,81,0.18)',
    },
    navTitle: { flex: 1, fontSize: 16, fontWeight: '800', color: '#fff', letterSpacing: -0.3 },
});