import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Card, Title, Paragraph, Button, Avatar} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {theme, colors, typography, spacing, shadows} from '../styles/theme';

const MessagesScreen = ({navigation, route}) => {
  const {t} = useTranslation();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    loadConversations();
    
    // If navigating from activity detail or booking, open chat with host
    if (route.params?.host) {
      openChatWithHost(route.params.host);
    }
  }, [route.params]);

  const loadConversations = () => {
    // Mock data - in real app, this would come from API
    setConversations([
      {
        id: 1,
        host: {
          id: 1,
          name: 'Marie Uwimana',
          image: 'https://via.placeholder.com/50x50',
          verified: true,
        },
        activity: {
          title: 'Traditional Cooking Class',
          image: 'https://via.placeholder.com/50x50',
        },
        lastMessage: {
          text: 'Thank you for booking! I\'m excited to share our traditional recipes with you.',
          timestamp: '2024-01-25T10:30:00Z',
          sender: 'host',
        },
        unreadCount: 2,
        isOnline: true,
      },
      {
        id: 2,
        host: {
          id: 2,
          name: 'Jean Baptiste',
          image: 'https://via.placeholder.com/50x50',
          verified: true,
        },
        activity: {
          title: 'Imigongo Art Workshop',
          image: 'https://via.placeholder.com/50x50',
        },
        lastMessage: {
          text: 'The workshop will be held in my studio. I\'ll send you the exact location.',
          timestamp: '2024-01-24T15:45:00Z',
          sender: 'host',
        },
        unreadCount: 0,
        isOnline: false,
      },
      {
        id: 3,
        host: {
          id: 3,
          name: 'Grace Mukamana',
          image: 'https://via.placeholder.com/50x50',
          verified: false,
        },
        activity: {
          title: 'Village Tour & Storytelling',
          image: 'https://via.placeholder.com/50x50',
        },
        lastMessage: {
          text: 'Perfect! I\'ll meet you at the village entrance at 9 AM.',
          timestamp: '2024-01-23T09:15:00Z',
          sender: 'user',
        },
        unreadCount: 0,
        isOnline: true,
      },
    ]);
  };

  const openChatWithHost = (host) => {
    // Find existing conversation or create new one
    let conversation = conversations.find(conv => conv.host.id === host.id);
    
    if (!conversation) {
      conversation = {
        id: Date.now(),
        host: host,
        activity: {
          title: 'New Activity',
          image: 'https://via.placeholder.com/50x50',
        },
        lastMessage: null,
        unreadCount: 0,
        isOnline: true,
      };
    }
    
    setSelectedConversation(conversation);
    loadMessages(conversation.id);
    setShowChat(true);
  };

  const loadMessages = (conversationId) => {
    // Mock messages data - in real app, this would come from API
    const mockMessages = [
      {
        id: 1,
        text: 'Hello! I\'m interested in your cooking class. Can you tell me more about it?',
        sender: 'user',
        timestamp: '2024-01-25T09:00:00Z',
        read: true,
      },
      {
        id: 2,
        text: 'Of course! I\'d be happy to tell you about our traditional cooking class. We\'ll learn to make several Rwandan dishes including ugali, beans, and traditional vegetables.',
        sender: 'host',
        timestamp: '2024-01-25T09:05:00Z',
        read: true,
      },
      {
        id: 3,
        text: 'That sounds amazing! What ingredients will we be using?',
        sender: 'user',
        timestamp: '2024-01-25T09:10:00Z',
        read: true,
      },
      {
        id: 4,
        text: 'We\'ll use fresh local ingredients like cassava, sweet potatoes, beans, and traditional spices. Everything will be provided, and you\'ll get to take home the recipes!',
        sender: 'host',
        timestamp: '2024-01-25T09:15:00Z',
        read: true,
      },
      {
        id: 5,
        text: 'Perfect! I\'d like to book for 2 people this Saturday.',
        sender: 'user',
        timestamp: '2024-01-25T09:20:00Z',
        read: true,
      },
      {
        id: 6,
        text: 'Thank you for booking! I\'m excited to share our traditional recipes with you.',
        sender: 'host',
        timestamp: '2024-01-25T10:30:00Z',
        read: false,
      },
    ];
    
    setMessages(mockMessages);
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      text: newMessage.trim(),
      sender: 'user',
      timestamp: new Date().toISOString(),
      read: false,
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate host response after 2 seconds
    setTimeout(() => {
      const hostResponse = {
        id: Date.now() + 1,
        text: 'Thank you for your message! I\'ll get back to you soon.',
        sender: 'host',
        timestamp: new Date().toISOString(),
        read: false,
      };
      setMessages(prev => [...prev, hostResponse]);
    }, 2000);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const renderConversation = ({item}) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => {
        setSelectedConversation(item);
        loadMessages(item.id);
        setShowChat(true);
      }}>
      <View style={styles.conversationAvatar}>
        <Image source={{uri: item.host.image}} style={styles.avatarImage} />
        {item.isOnline && <View style={styles.onlineIndicator} />}
      </View>
      
      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <View style={styles.hostInfo}>
            <Text style={styles.hostName}>{item.host.name}</Text>
            {item.host.verified && (
              <Icon name="verified" size={14} color={colors.primary} />
            )}
          </View>
          <Text style={styles.timestamp}>
            {item.lastMessage ? formatTimestamp(item.lastMessage.timestamp) : ''}
          </Text>
        </View>
        
        <Text style={styles.activityTitle}>{item.activity.title}</Text>
        
        <View style={styles.lastMessageContainer}>
          <Text
            style={[
              styles.lastMessage,
              item.unreadCount > 0 && styles.unreadMessage,
            ]}
            numberOfLines={1}>
            {item.lastMessage ? item.lastMessage.text : 'No messages yet'}
          </Text>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderMessage = ({item}) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === 'user' ? styles.userMessage : styles.hostMessage,
      ]}>
      <View
        style={[
          styles.messageBubble,
          item.sender === 'user' ? styles.userBubble : styles.hostBubble,
        ]}>
        <Text
          style={[
            styles.messageText,
            item.sender === 'user' ? styles.userMessageText : styles.hostMessageText,
          ]}>
          {item.text}
        </Text>
        <Text
          style={[
            styles.messageTime,
            item.sender === 'user' ? styles.userMessageTime : styles.hostMessageTime,
          ]}>
          {formatTimestamp(item.timestamp)}
        </Text>
      </View>
    </View>
  );

  if (showChat && selectedConversation) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {/* Chat Header */}
        <View style={styles.chatHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setShowChat(false)}>
            <Icon name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          
          <View style={styles.chatHeaderInfo}>
            <Image source={{uri: selectedConversation.host.image}} style={styles.chatAvatar} />
            <View style={styles.chatHeaderText}>
              <View style={styles.chatHostInfo}>
                <Text style={styles.chatHostName}>{selectedConversation.host.name}</Text>
                {selectedConversation.host.verified && (
                  <Icon name="verified" size={16} color={colors.white} />
                )}
              </View>
              <Text style={styles.chatActivityTitle}>
                {selectedConversation.activity.title}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.moreButton}>
            <Icon name="more-vert" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>

        {/* Messages List */}
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id.toString()}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        />

        {/* Message Input */}
        <View style={styles.messageInputContainer}>
          <View style={styles.messageInput}>
            <TextInput
              style={styles.textInput}
              placeholder={t('messages.typeMessage')}
              value={newMessage}
              onChangeText={setNewMessage}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={sendMessage}
              disabled={!newMessage.trim()}>
              <Icon
                name="send"
                size={20}
                color={newMessage.trim() ? colors.primary : colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('messages.title')}</Text>
        <TouchableOpacity style={styles.newMessageButton}>
          <Icon name="add" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Conversations List */}
      {conversations.length > 0 ? (
        <FlatList
          data={conversations}
          renderItem={renderConversation}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.conversationsList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Icon name="message" size={64} color={colors.textSecondary} />
          <Text style={styles.emptyTitle}>{t('messages.noMessages')}</Text>
          <Text style={styles.emptySubtitle}>{t('messages.startConversation')}</Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Explore')}
            style={styles.exploreButton}>
            Explore Activities
          </Button>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    ...typography.h4,
    color: colors.text,
  },
  newMessageButton: {
    padding: spacing.sm,
  },
  conversationsList: {
    padding: spacing.lg,
  },
  conversationItem: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  conversationAvatar: {
    position: 'relative',
    marginRight: spacing.md,
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.white,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  hostInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hostName: {
    ...typography.h6,
    color: colors.text,
    marginRight: spacing.xs,
  },
  timestamp: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  activityTitle: {
    ...typography.body2,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  lastMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    ...typography.body2,
    color: colors.textSecondary,
    flex: 1,
  },
  unreadMessage: {
    color: colors.text,
    fontWeight: '500',
  },
  unreadBadge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  unreadCount: {
    ...typography.caption,
    color: colors.white,
    fontSize: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyTitle: {
    ...typography.h5,
    color: colors.text,
    textAlign: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    ...typography.body2,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  exploreButton: {
    borderRadius: 12,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.primary,
  },
  backButton: {
    marginRight: spacing.md,
  },
  chatHeaderInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: spacing.md,
  },
  chatHeaderText: {
    flex: 1,
  },
  chatHostInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatHostName: {
    ...typography.h6,
    color: colors.white,
    marginRight: spacing.xs,
  },
  chatActivityTitle: {
    ...typography.body2,
    color: colors.white,
    opacity: 0.9,
  },
  moreButton: {
    padding: spacing.sm,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: spacing.lg,
  },
  messageContainer: {
    marginBottom: spacing.md,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  hostMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: spacing.md,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  hostBubble: {
    backgroundColor: colors.white,
    borderBottomLeftRadius: 4,
    ...shadows.sm,
  },
  messageText: {
    ...typography.body1,
    lineHeight: 20,
  },
  userMessageText: {
    color: colors.white,
  },
  hostMessageText: {
    color: colors.text,
  },
  messageTime: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
  userMessageTime: {
    color: colors.white,
    opacity: 0.8,
  },
  hostMessageTime: {
    color: colors.textSecondary,
  },
  messageInputContainer: {
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  messageInput: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.lightGray,
    borderRadius: 24,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  textInput: {
    flex: 1,
    maxHeight: 100,
    ...typography.body1,
    paddingVertical: spacing.sm,
  },
  sendButton: {
    padding: spacing.sm,
    marginLeft: spacing.sm,
  },
});

export default MessagesScreen;