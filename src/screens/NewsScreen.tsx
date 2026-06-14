import React, { useState, useCallback } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity,
  StyleSheet, RefreshControl, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NavLogo } from '../components/NavLogo';
import { colors } from '../theme';
import { useGetPostsQuery } from '@/redux/services/wpApi';
import { router } from 'expo-router';

// Type definitions for WordPress post data
type WPMedia = {
  source_url: string;
  media_details?: {
    sizes?: {
      medium?: { source_url: string };
      large?: { source_url: string };
      thumbnail?: { source_url: string };
    };
  };
};

type WPPost = {
  id: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  date: string;
  slug: string;
  link: string;
  featured_media: number;
  _embedded?: {
    'wp:featuredmedia'?: WPMedia[];
    author?: Array<{ name: string }>;
    'wp:term'?: Array<Array<{ name: string; taxonomy: string }>>;
  };
  categories?: number[];
  tags?: number[];
};

// Helper: Get best image URL from WordPress media
const getImageUrl = (post: WPPost): string => {
  const media = post._embedded?.['wp:featuredmedia']?.[0];
  if (!media) {
    // Fallback image
    return 'https://central.nasrda.gov.ng/wp-content/uploads/2025/04/NASRDA_Gate1.jpg';
  }
  
  // Try to get a medium/large size first
  const sizes = media.media_details?.sizes;
  if (sizes?.large?.source_url) return sizes.large.source_url;
  if (sizes?.medium?.source_url) return sizes.medium.source_url;
  if (sizes?.thumbnail?.source_url) return sizes.thumbnail.source_url;
  
  return media.source_url;
};

// Helper: Format date to "Month Year" format
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

// Helper: Strip HTML tags from excerpt/content
const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>/g, '').trim();
};

// Helper: Calculate read time (rough estimate: 200 words per minute)
const getReadTime = (content: string): number => {
  const text = stripHtml(content);
  const wordCount = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 200));
};

// Helper: Get primary category
const getPrimaryCategory = (post: WPPost): string => {
  const terms = post._embedded?.['wp:term']?.[0];
  if (terms && terms.length > 0) {
    return terms[0].name.toUpperCase();
  }
  return 'NASRDA NEWS';
};

export const NewsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  const { data: posts, isLoading, isError, refetch } = useGetPostsQuery();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  // Filter posts by tab (you can adjust this based on your category/tag logic)
  const filteredPosts = React.useMemo(() => {
    if (!posts || !Array.isArray(posts)) return [];
    
    if (activeTab === 'All') return posts;
    
    // Example: Filter by category name (adjust based on your actual category IDs)
    // For now, return all posts since we don't have category filtering logic
    return posts;
  }, [posts, activeTab]);

  const featuredPost = filteredPosts[0];
  const restPosts = filteredPosts.slice(1);

  // Loading state
  if (isLoading && !refreshing) {
    return (
      <View style={[st.root, { paddingTop: insets.top }, st.centerContainer]}>
        <NavLogo />
        <ActivityIndicator size="large" color={colors.green2} style={{ marginTop: 40 }} />
        <Text style={st.loadingText}>Loading news from NASRDA...</Text>
      </View>
    );
  }

  // Error state
  if (isError) {
    return (
      <View style={[st.root, { paddingTop: insets.top }, st.centerContainer]}>
        <NavLogo />
        <Ionicons name="cloud-offline-outline" size={64} color={colors.textThird} />
        <Text style={st.errorText}>Unable to load news</Text>
        <TouchableOpacity style={st.retryBtn} onPress={() => refetch()}>
          <Text style={st.retryBtnText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[st.root, { paddingTop: insets.top }]}>
      {/* Nav */}
      <View style={st.nav}>
        <NavLogo />
        <Text style={st.navTitle}>NASRDA News</Text>
        <TouchableOpacity style={st.refreshBtn} onPress={onRefresh}>
          <Ionicons name="refresh-outline" size={20} color={colors.textThird} />
        </TouchableOpacity>
      </View>

      {/* Live banner */}
      <View style={st.syncBar}>
        <View style={st.syncDot} />
        <Text style={st.syncTxt}>LIVE — CENTRAL.NASRDA.GOV.NG</Text>
      </View>


      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.green2} />
        }
      >
        {filteredPosts.length === 0 ? (
          <View style={st.emptyContainer}>
            <Text style={st.emptyText}>No news articles found</Text>
          </View>
        ) : (
          <>
            {/* Featured card - first post */}
            <View style={st.featWrap}>
              <TouchableOpacity 
                style={st.featCard} 
                activeOpacity={0.88}
                onPress={() => router.push(`/news/${featuredPost.id}`)}
              >
                <Image
                  source={{ uri: getImageUrl(featuredPost) }}
                  style={st.featBgImage}
                  resizeMode="cover"
                />
                <View style={st.featOverlay} />
                <View style={st.featContent}>
                  <View style={[st.tag, { backgroundColor: colors.green }]}>
                    <Text style={st.tagTxt}>{getPrimaryCategory(featuredPost)}</Text>
                  </View>
                  <Text style={st.featTitle} numberOfLines={3}>
                    {stripHtml(featuredPost.title.rendered)}
                  </Text>
                  <View style={st.featMeta}>
                    <Ionicons name="time-outline" size={11} color="rgba(232,240,248,0.7)" />
                    <Text style={st.featMetaTxt}>
                      {formatDate(featuredPost.date)} · {getReadTime(featuredPost.content.rendered)} min read
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View style={st.sectionHdr}>
              <Text style={st.sectionLabel}>RECENT STORIES</Text>
              <View style={st.sectionLine} />
            </View>

            {/* News list */}
            {restPosts.map((post: WPPost) => (
              <TouchableOpacity 
                key={post.id} 
                style={st.newsCard} 
                activeOpacity={0.8}
                onPress={() => router.push(`/news/${post.id}`)}
              >
                <View style={st.newsThumb}>
                  <Image
                    source={{ uri: getImageUrl(post) }}
                    style={st.newsThumbImg}
                    resizeMode="cover"
                  />
                  <View style={st.newsThumbOverlay} />
                </View>
                <View style={st.newsBody}>
                  <View style={[st.inlineTag, { backgroundColor: `${colors.sky}18` }]}>
                    <Text style={[st.inlineTagTxt, { color: colors.sky }]}>
                      {getPrimaryCategory(post)}
                    </Text>
                  </View>
                  <Text style={st.newsTitle} numberOfLines={2}>
                    {stripHtml(post.title.rendered)}
                  </Text>
                  <View style={st.newsMeta}>
                    <Ionicons name="time-outline" size={10} color={colors.textThird} />
                    <Text style={st.newsDate}>
                      {formatDate(post.date)} · {getReadTime(post.content.rendered)} min read
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={14} color={colors.textThird} />
              </TouchableOpacity>
            ))}
          </>
        )}
        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
};

export default NewsScreen;

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.navy },

  /* Nav */
  nav: {
    height: 56,
    backgroundColor: 'rgba(10,22,40,0.98)',
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, gap: 12,
    borderBottomWidth: 1, borderBottomColor: 'rgba(0,166,81,0.18)',
  },
  navTitle: {
    flex: 1, fontSize: 16, fontWeight: '800', color: '#fff', letterSpacing: -0.3,
  },
  refreshBtn: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },

  /* Loading/Empty states */
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: {
    color: colors.textThird,
    fontSize: 14,
    marginTop: 16,
  },
  errorText: {
    color: colors.textThird,
    fontSize: 16,
    marginTop: 16,
  },
  retryBtn: {
    backgroundColor: colors.green2,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  retryBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textThird,
    fontSize: 14,
  },

  /* Live banner */
  syncBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 8, paddingHorizontal: 20,
    backgroundColor: 'rgba(0,166,81,0.06)',
    borderBottomWidth: 1, borderBottomColor: 'rgba(0,166,81,0.12)',
  },
  syncDot: {
    width: 6, height: 6, borderRadius: 3, backgroundColor: colors.green2,
  },
  syncTxt: {
    fontSize: 9, fontWeight: '700', color: colors.green2, letterSpacing: 1.2,
  },

  /* Filter chips */
  chipRow: { flexGrow: 0, borderBottomWidth: 1, borderBottomColor: 'rgba(79,195,247,0.07)' },
  chipContent: { paddingHorizontal: 20, paddingVertical: 12, gap: 8 },
  chip: {
    paddingVertical: 6, paddingHorizontal: 16, borderRadius: 20,
    borderWidth: 1, borderColor: 'rgba(79,195,247,0.12)',
    backgroundColor: 'transparent',
  },
  chipActive: {
    backgroundColor: 'rgba(0,166,81,0.14)',
    borderColor: 'rgba(0,166,81,0.32)',
  },
  chipTxt:       { fontSize: 12, fontWeight: '600', height:25, color: colors.textThird },
  chipTxtActive: { color: colors.green2 },

  /* Featured card */
  featWrap: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 },
  featCard: {
    borderRadius: 18, overflow: 'hidden', height: 240,
    borderWidth: 1, borderColor: colors.borderGreen,
  },
  featBgImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  featOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8,18,38,0.58)',
  },
  featContent: {
    position: 'absolute', bottom: 0, left: 0, right: 0, padding: 18,
  },
  tag: {
    borderRadius: 5, paddingHorizontal: 9, paddingVertical: 4,
    alignSelf: 'flex-start', marginBottom: 8,
  },
  tagTxt: { fontSize: 9, fontWeight: '800', color: '#fff', letterSpacing: 1.2 },
  featTitle: {
    fontSize: 15, fontWeight: '800', color: '#fff', lineHeight: 22,
  },
  featMeta: {
    flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 6,
  },
  featMetaTxt: { fontSize: 11, color: 'rgba(232,240,248,0.7)' },

  /* Section header */
  sectionHdr: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 12, gap: 10,
  },
  sectionLabel: {
    fontSize: 10, fontWeight: '700', color: colors.textThird, letterSpacing: 1.5,
  },
  sectionLine: {
    flex: 1, height: 1, backgroundColor: 'rgba(79,195,247,0.1)',
  },

  /* News cards */
  newsCard: {
    flexDirection: 'row', alignItems: 'center',
    gap: 14, paddingVertical: 14, paddingHorizontal: 20,
    borderBottomWidth: 1, borderBottomColor: 'rgba(79,195,247,0.06)',
  },
  newsThumb: {
    width: 80, height: 64, borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(79,195,247,0.12)',
    backgroundColor: colors.navy2,
  },
  newsThumbImg: {
    width: '100%', height: '100%',
  },
  newsThumbOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10,22,40,0.12)',
  },
  newsBody: { flex: 1 },
  inlineTag: {
    alignSelf: 'flex-start',
    borderRadius: 4, paddingHorizontal: 7, paddingVertical: 3,
    marginBottom: 5,
  },
  inlineTagTxt: { fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  newsTitle: {
    fontSize: 14, fontWeight: '600', color: colors.textPrimary, lineHeight: 19,
  },
  newsMeta: {
    flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4,
  },
  newsDate: { fontSize: 10, color: colors.textThird },
});