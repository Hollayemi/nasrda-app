// app/news/[id].tsx
import { useGetSinglePostQuery } from '@/redux/services/wpApi';
import { colors } from '@/src/theme';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
    ActivityIndicator,
    Image,
    Linking,
    ScrollView, StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>/g, ' ').trim();
};

const formatFullDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    weekday: 'long',
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

export default function NewsDetailScreen() {
  const { id = "" } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { data: post, isLoading, isError } = useGetSinglePostQuery(id, {skip: !id});

  if (isLoading) {
    return (
      <View style={[styles.centerContainer, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={colors.green2} />
        <Text style={styles.loadingText}>Loading article...</Text>
      </View>
    );
  }

  if (isError || !post) {
    return (
      <View style={[styles.centerContainer, { paddingTop: insets.top }]}>
        <Ionicons name="alert-circle-outline" size={64} color={colors.textThird} />
        <Text style={styles.errorText}>Article not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const imageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
    'https://central.nasrda.gov.ng/wp-content/uploads/2025/04/NASRDA_Gate1.jpg';

  return (
    <ScrollView 
      style={[styles.container, { paddingTop: 0}]}
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
      </TouchableOpacity>

      {/* Featured Image */}
      <Image source={{ uri: imageUrl }} style={styles.featuredImage} resizeMode="cover" />

      {/* Content */}
      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title}>{stripHtml(post.title.rendered)}</Text>

        {/* Meta info */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={14} color={colors.textThird} />
            <Text style={styles.metaText}>{formatFullDate(post.date)}</Text>
          </View>
          {post._embedded?.['wp:author']?.[0] && (
            <View style={styles.metaItem}>
              <Ionicons name="person-outline" size={14} color={colors.textThird} />
              <Text style={styles.metaText}>{post._embedded['wp:author']?.[0].name}</Text>
            </View>
          )}
        </View>

        {/* Category tags */}
        {post._embedded?.['wp:term']?.[0] && (
          <View style={styles.categories}>
            {post._embedded['wp:term'][0].map((cat:any, idx:any) => (
              <View key={idx} style={styles.categoryTag}>
                <Text style={styles.categoryText}>{cat.name}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Main content - render HTML safely (consider using react-native-render-html) */}
        <View style={styles.body}>
          <Text style={styles.bodyText}>
            {stripHtml(post.content.rendered)}
          </Text>
        </View>

        {/* View on web link */}
        {post.link && (
          <TouchableOpacity 
            style={styles.webLink}
            onPress={() => Linking.openURL(post.link)}
          >
            <Text style={styles.webLinkText}>View on NASRDA Website</Text>
            <Ionicons name="open-outline" size={16} color={colors.green2} />
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.navy,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.navy,
  },
  loadingText: {
    marginTop: 16,
    color: colors.textThird,
  },
  errorText: {
    marginTop: 16,
    color: colors.textThird,
    fontSize: 16,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 30,
    padding: 8,
  },
  backBtn: {
    marginTop: 46,
    backgroundColor: colors.green2,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
  featuredImage: {
    width: '100%',
    height: 340,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    lineHeight: 32,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(79,195,247,0.1)',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: colors.textThird,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  categoryTag: {
    backgroundColor: 'rgba(0,166,81,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
  },
  categoryText: {
    fontSize: 11,
    color: colors.green2,
    fontWeight: '600',
  },
  body: {
    marginBottom: 24,
  },
  bodyText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textPrimary,
  },
  webLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(79,195,247,0.1)',
    marginTop: 8,
  },
  webLinkText: {
    fontSize: 14,
    color: colors.green2,
    fontWeight: '500',
  },
});