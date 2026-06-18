import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, KeyboardAvoidingView, Platform, Image,
  Button,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, Feather, FontAwesome5 } from '@expo/vector-icons';
import { NavLogo, NASRDA_LOGO_URI } from '../components/NavLogo';
import { colors } from '../theme';

/* ── Login ───────────────────────────────────────────────────── */
const LoginScreen: React.FC<{ onLogin: () => void }> = ({ onLogin }) => (
  <ScrollView contentContainerStyle={st.loginWrap} keyboardShouldPersistTaps="handled">
    <View style={st.sealDisc}>
      <Image source={{ uri: NASRDA_LOGO_URI }} style={st.sealImg} resizeMode="contain" />
    </View>
    <Text style={st.loginTitle}>Restricted Access</Text>
    <Text style={st.loginSub}>
      This section is for NASRDA staff only.{'\n'}Sign in with your official credentials.
    </Text>

    {/* Fields (decorative) */}
    <View style={st.field}>
      <Ionicons name="mail-outline" size={18} color={colors.textThird} />
      <Text style={st.fieldPlaceholder}>staff@nasrda.gov.ng</Text>
    </View>
    <View style={st.field}>
      <Ionicons name="lock-closed-outline" size={18} color={colors.textThird} />
      <Text style={st.fieldPlaceholder}>Password</Text>
    </View>
    <View style={st.field}>
      <Ionicons name="finger-print-outline" size={18} color={colors.textThird} />
      <Text style={st.fieldPlaceholder}>Biometric / 2FA Code</Text>
    </View>

    <TouchableOpacity style={st.signBtn} onPress={onLogin} activeOpacity={0.85}>
      <Ionicons name="shield-checkmark-outline" size={17} color="#fff" />
      <Text style={st.signBtnTxt}>SIGN IN SECURELY</Text>
    </TouchableOpacity>

    <View style={st.secNote}>
      <Ionicons name="lock-closed" size={11} color={colors.textThird} />
      <Text style={st.secNoteTxt}>256-bit encrypted · NASRDA IT Division</Text>
    </View>
  </ScrollView>
);

/* ── Chat ────────────────────────────────────────────────────── */
type Message = {
  id: string; sender: string; dept: string;
  text: string; time: string; me: boolean;
};

const INITIAL_MSGS: Message[] = [
  { id: '1', sender: 'Dr. K. Dagyeng', dept: 'Media & Comms', text: 'Good morning team. DSA press release ready for review — check the shared drive.', time: '08:14', me: false },
  { id: '2', sender: 'Eng. O. Ajayi', dept: 'Remote Sensing', text: 'NigeriaSAT-2 pass over Lagos at 10:23. Tasking submitted to SERA Mission Control.', time: '08:31', me: false },
  { id: '3', sender: 'Me', dept: '', text: 'Received. Will confirm the window shortly.', time: '08:35', me: true },
  { id: '4', sender: 'Admin. F. Bello', dept: 'HR', text: 'Reminder: Youth Empowerment briefing at 14:00, main boardroom, Lugbe HQ.', time: '09:02', me: false },
  { id: '5', sender: 'Me', dept: '', text: "Noted, I'll be there.", time: '09:05', me: true },
];

const ChatScreen: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [msgs, setMsgs] = useState<Message[]>(INITIAL_MSGS);
  const [draft, setDraft] = useState('');
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);

  const send = () => {
    if (!draft.trim()) return;
    const now = new Date();
    setMsgs(m => [...m, {
      id: Date.now().toString(), sender: 'Me', dept: '',
      text: draft.trim(),
      time: `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`,
      me: true,
    }]);
    setDraft('');
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Chat header */}
      <View style={st.chatHeader}>
        <View style={st.chatHeaderLeft}>
          <MaterialCommunityIcons name="forum-outline" size={18} color={colors.green2} />
          <View>
            <Text style={st.chatRoom}>NASRDA HQ — General</Text>
            <View style={st.onlineRow}>
              <View style={st.onlineDot} />
              <Text style={st.onlineTxt}>14 staff online</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={onLogout} style={st.logoutBtn}>
          <Ionicons name="log-out-outline" size={20} color={colors.textThird} />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        style={st.msgs}
        contentContainerStyle={st.msgsContent}
        showsVerticalScrollIndicator={false}
      >
        {msgs.map(m => (
          <View key={m.id} style={[st.msgWrap, m.me && st.msgWrapMe]}>
            {!m.me && (
              <Text style={st.msgSender}>{m.sender} · {m.dept}</Text>
            )}
            <View style={[st.bubble, m.me ? st.bubbleMe : st.bubbleThem]}>
              <Text style={[st.bubbleTxt, m.me && st.bubbleTxtMe]}>{m.text}</Text>
            </View>
            <Text style={st.msgTime}>{m.time}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Input */}
      <View style={[st.inputBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <TouchableOpacity style={st.attachBtn}>
          <Ionicons name="attach-outline" size={20} color={colors.textThird} />
        </TouchableOpacity>
        <TextInput
          style={st.input}
          value={draft}
          onChangeText={setDraft}
          placeholder="Message staff team..."
          placeholderTextColor={colors.textThird}
          onSubmitEditing={send}
          returnKeyType="send"
        />
        <TouchableOpacity style={st.sendBtn} onPress={send} activeOpacity={0.85}>
          <Ionicons name="send" size={15} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

/* ── Dashboard Cards ─────────────────────────────────────────── */
const DashboardCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onPress: () => void;
  badge?: string;
  gradient?: boolean;
}> = ({ icon, title, subtitle, onPress, badge, gradient }) => (
  <TouchableOpacity 
    style={[st.dashboardCard, gradient && st.dashboardCardGradient]} 
    onPress={onPress}
    activeOpacity={0.85}
  >
    <View style={st.cardHeader}>
      <View style={st.cardIconContainer}>
        {icon}
      </View>
      {badge && (
        <View style={st.cardBadge}>
          <Text style={st.cardBadgeText}>{badge}</Text>
        </View>
      )}
    </View>
    <Text style={st.cardTitle}>{title}</Text>
    <Text style={st.cardSubtitle}>{subtitle}</Text>
    <View style={st.cardFooter}>
      <Text style={st.cardActionText}>Access →</Text>
    </View>
  </TouchableOpacity>
);

const DashboardScreen: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView 
      style={st.dashboardContainer}
      contentContainerStyle={[st.dashboardContent, { paddingBottom: insets.bottom + 20 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Welcome Section */}
      <View style={st.welcomeSection}>
        <View>
          <Text style={st.welcomeGreeting}>Good Morning,</Text>
          <Text style={st.welcomeName}>Dr. Jude Adeleke</Text>
          <Text style={st.welcomeDept}>AssistanT Director, ICT.</Text>
        </View>
        <TouchableOpacity onPress={onLogout} style={st.headerLogoutBtn}>
          <Ionicons name="log-out-outline" size={20} color={colors.textSecond} />
        </TouchableOpacity>
      </View>

      {/* Quick Stats */}
      <View style={st.quickStats}>
        <View style={st.statItem}>
          <Text style={st.statNumber}>14</Text>
          <Text style={st.statLabel}>Staff Online</Text>
        </View>
        <View style={st.statDivider} />
        <View style={st.statItem}>
          <Text style={st.statNumber}>3</Text>
          <Text style={st.statLabel}>Pending Tasks</Text>
        </View>
        <View style={st.statDivider} />
        <View style={st.statItem}>
          <Text style={st.statNumber}>2</Text>
          <Text style={st.statLabel}>New Messages</Text>
        </View>
      </View>

      {/* Dashboard Cards Grid */}
      <View style={st.cardsGrid}>
        {/* Staff Email Card */}
        <DashboardCard
          icon={<Ionicons name="mail-outline" size={28} color="#fff" />}
          title="Staff Email"
          subtitle="Access your official NASRDA email communications"
          onPress={() => alert('Opening Staff Email...')}
          badge="12 unread"
        />

        {/* Account Settings Card */}
        <DashboardCard
          icon={<Ionicons name="settings-outline" size={28} color="#fff" />}
          title="Account Settings"
          subtitle="Manage your profile, security, and preferences"
          onPress={() => alert('Opening Account Settings...')}
          gradient={true}
        />

        {/* Staff Chat Card */}
        <DashboardCard
          icon={<Ionicons name="chatbubbles-outline" size={28} color="#fff" />}
          title="Staff Chat"
          subtitle="Connect with colleagues across all divisions"
          onPress={() => alert('Opening Staff Chat...')}
          badge="2 new"
        />

        {/* Additional Feature Cards */}
        <DashboardCard
          icon={<Feather name="calendar" size={28} color="#fff" />}
          title="Staff Calendar"
          subtitle="View meetings, events, and mission schedules"
          onPress={() => alert('Opening Staff Calendar...')}
        />

        <DashboardCard
          icon={<FontAwesome5 name="folder-open" size={24} color="#fff" />}
          title="Document Hub"
          subtitle="Access NASRDA policies, reports, and resources"
          onPress={() => alert('Opening Document Hub...')}
        />

        <DashboardCard
          icon={<Feather name="users" size={28} color="#fff" />}
          title="Staff Directory"
          subtitle="Find colleagues across NASRDA departments"
          onPress={() => alert('Opening Staff Directory...')}
        />
      </View>

      {/* Recent Activity */}
      <View style={st.recentActivity}>
        <Text style={st.recentTitle}>Recent Activity</Text>
        <View style={st.activityItem}>
          <View style={st.activityDot} />
          <View style={st.activityContent}>
            <Text style={st.activityText}>Dr. Jude. Adeleke shared a document in Media & Comms</Text>
            <Text style={st.activityTime}>2 hours ago</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

/* ── StaffScreen wrapper ─────────────────────────────────────── */
export const StaffScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [authed, setAuthed] = useState(false);

  return (
    <View style={[st.root, { paddingTop: insets.top }]}>
      <View style={st.nav}>
        <NavLogo />
        <Text style={st.navTitle}>{authed ? 'Dashboard' : 'Staff Portal'}</Text>
        {authed && (
          <View style={st.securedBadge}>
            <Ionicons name="shield-checkmark" size={12} color={colors.green2} />
            <Text style={st.securedTxt}>SECURED</Text>
          </View>
        )}
      </View>

      {authed
        ? <DashboardScreen onLogout={() => setAuthed(false)} />
        : <LoginScreen onLogin={() => setAuthed(true)} />
      }
    </View>
  );
};

export default StaffScreen;

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.navy },
  nav: {
    height: 56, backgroundColor: 'rgba(10,22,40,0.98)',
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, gap: 12,
    borderBottomWidth: 1, borderBottomColor: 'rgba(0,166,81,0.18)',
  },
  navTitle: { flex: 1, fontSize: 16, fontWeight: '800', color: '#fff', letterSpacing: -0.3 },
  securedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(0,192,96,0.1)',
    borderWidth: 1, borderColor: 'rgba(0,192,96,0.25)',
    borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4,
  },
  securedTxt: { fontSize: 10, fontWeight: '800', color: colors.green2, letterSpacing: 0.8 },

  /* Login */
  loginWrap: {
    flexGrow: 1, alignItems: 'center', justifyContent: 'center',
    padding: 28,
  },
  sealDisc: {
    width: 110, height: 110, borderRadius: 55,
    backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 20, overflow: 'hidden',
    shadowColor: colors.green, shadowOpacity: 0.3,
    shadowRadius: 18, shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  sealImg: { width: 100, height: 100 },
  loginTitle: {
    fontSize: 20, fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: 8,
  },
  loginSub: {
    fontSize: 13, color: colors.textSecond, textAlign: 'center',
    lineHeight: 20, marginBottom: 28,
  },
  field: {
    width: '100%', flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: 'rgba(13,32,69,0.8)',
    borderWidth: 1, borderColor: 'rgba(79,195,247,0.12)',
    borderRadius: 14, paddingVertical: 15, paddingHorizontal: 18,
    marginBottom: 12,
  },
  fieldPlaceholder: { fontSize: 14, color: colors.textSecond },
  signBtn: {
    width: '100%', flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 10,
    backgroundColor: colors.green, borderRadius: 14,
    paddingVertical: 16, marginTop: 8,
    shadowColor: colors.green, shadowOpacity: 0.4,
    shadowRadius: 12, shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  signBtnTxt: { fontSize: 14, fontWeight: '800', color: '#fff', letterSpacing: 1 },
  secNote: {
    flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 16,
  },
  secNoteTxt: { fontSize: 11, color: colors.textThird },

  /* Dashboard Container */
  dashboardContainer: {
    flex: 1,
    backgroundColor: 'rgba(10,22,40,0.95)',
  },
  dashboardContent: {
    paddingHorizontal: 15,
    paddingTop: 20,
  },

  /* Welcome Section */
  welcomeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  welcomeGreeting: {
    fontSize: 14,
    color: colors.textSecond,
    marginBottom: 2,
  },
  welcomeName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  welcomeDept: {
    fontSize: 13,
    color: colors.green2,
    fontWeight: '600',
  },
  headerLogoutBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  /* Quick Stats */
  quickStats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 10,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecond,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },

  /* Cards Grid */
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 28,
  },

  /* Dashboard Card */
  dashboardCard: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    minHeight: 140,
    justifyContent: 'space-between',
  },
  dashboardCardGradient: {
    backgroundColor: 'rgba(0,166,81,0.15)',
    borderColor: 'rgba(0,166,81,0.3)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(0,166,81,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBadge: {
    backgroundColor: '#e74c3c',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  cardBadgeText: {
    fontSize: 9,
    color: '#fff',
    fontWeight: '700',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 11,
    color: colors.textSecond,
    lineHeight: 16,
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cardActionText: {
    fontSize: 12,
    color: colors.green2,
    fontWeight: '600',
  },

  /* Recent Activity */
  recentActivity: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: 20,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3498db',
    marginRight: 12,
    marginTop: 4,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 18,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 11,
    color: colors.textThird,
  },

  /* Chat */
  chatHeader: {
    paddingVertical: 12, paddingHorizontal: 20,
    borderBottomWidth: 1, borderBottomColor: 'rgba(79,195,247,0.09)',
    backgroundColor: 'rgba(10,22,40,0.9)',
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  chatHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  chatRoom: { fontSize: 14, fontWeight: '700', color: '#fff', marginBottom: 2 },
  onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.green2 },
  onlineTxt: { fontSize: 11, color: colors.green2, fontWeight: '600' },
  logoutBtn: {
    position: 'absolute', top: 52, right: 20,
    width: 36, height: 36, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  msgs: { flex: 1 },
  msgsContent: { padding: 16, gap: 4 },
  msgWrap: { maxWidth: '82%', alignSelf: 'flex-start', marginBottom: 12 },
  msgWrapMe: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  msgSender: { fontSize: 10, color: colors.textThird, marginBottom: 4, paddingLeft: 2 },
  bubble: { borderRadius: 18, paddingVertical: 10, paddingHorizontal: 14 },
  bubbleMe: { backgroundColor: colors.green, borderBottomRightRadius: 4 },
  bubbleThem: {
    backgroundColor: colors.card2,
    borderWidth: 1, borderColor: colors.border,
    borderBottomLeftRadius: 4,
  },
  bubbleTxt: { fontSize: 13, lineHeight: 19, color: colors.textPrimary },
  bubbleTxtMe: { color: '#fff' },
  msgTime: { fontSize: 9, color: colors.textThird, marginTop: 4, paddingHorizontal: 2 },

  inputBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingTop: 10, paddingHorizontal: 16,
    borderTopWidth: 1, borderTopColor: 'rgba(79,195,247,0.09)',
    backgroundColor: 'rgba(10,22,40,0.96)',
  },
  attachBtn: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  input: {
    flex: 1, backgroundColor: colors.card,
    borderWidth: 1, borderColor: 'rgba(79,195,247,0.12)',
    borderRadius: 22, paddingHorizontal: 18, paddingVertical: 10,
    fontSize: 13, color: colors.textPrimary,
  },
  sendBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: colors.green,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.green, shadowOpacity: 0.4,
    shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
});