import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import {useLanguage} from '../context/LanguageContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

const MessagesScreen = ({navigation, route}) => {
  const {t, language} = useLanguage();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    loadConversations();
    if (route?.params?.host) {
      // Open conversation with specific host
      const conversation = conversations.find(conv => conv.host === route.params.host);
      if (conversation) {
        setSelectedConversation(conversation);
        loadMessages(conversation.id);
      }
    }
  }, [route?.params?.host]);

  const loadConversations = async () => {
    // Mock data - replace with actual API call
    const mockConversations = [
      {
        id: '1',
        host: 'Mukamana Grace',
        hostImage: 'https://via.placeholder.com/50x50/2E7D32/FFFFFF?text=MG',
        activity: 'Traditional Rwandan Cooking Class',
        lastMessage: 'Looking forward to meeting you tomorrow!',
        lastMessageTime: '2 hours ago',
        unreadCount: 2,
        isOnline: true,
      },
      {
        id: '2',
        host: 'Nkurunziza Jean',
        hostImage: 'https://via.placeholder.com/50x50/FF6B35/FFFFFF?text=NJ',
        activity: 'Imigongo Art Workshop',
        lastMessage: 'The workshop will be at my studio in Huye',
        lastMessageTime: '1 day ago',
        unreadCount: 0,
        isOnline: false,
      },
      {
        id: '3',
        host: 'Uwimana Marie',
        hostImage: 'https://via.placeholder.com/50x50/4A90E2/FFFFFF?text=UM',
        activity: 'Village Life Experience',
        lastMessage: 'Thank you for the wonderful experience!',
        lastMessageTime: '3 days ago',
        unreadCount: 0,
        isOnline: true,
      },
    ];
    setConversations(mockConversations);
  };

  const loadMessages = async (conversationId) => {
    // Mock data - replace with actual API call
    const mockMessages = [
      {
        id: '1',
        sender: 'host',
        message: 'Hello! Welcome to my cooking class. I\'m excited to teach you traditional Rwandan dishes.',
        timestamp: '2024-01-14T10:00:00Z',
      },
      {
        id: '2',
        sender: 'user',
        message: 'Thank you! I\'m really looking forward to it. What should I bring?',
        timestamp: '2024-01-14T10:05:00Z',
      },
      {
        id: '3',
        sender: 'host',
        message: 'Just bring yourself and an appetite for learning! All ingredients and equipment will be provided.',
        timestamp: '2024-01-14T10:10:00Z',
      },
      {
        id: '4',
        sender: 'host',
        message: 'Looking forward to meeting you tomorrow!',
        timestamp: '2024-01-14T16:30:00Z',
      },
    ];
    setMessages(mockMessages);
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now().toString(),
      sender: 'user',
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate host response after 2 seconds
    setTimeout(() => {
      const hostResponse = {
        id: (Date.now() + 1).toString(),
        sender: 'host',
        message: 'Thank you for your message! I\'ll get back to you soon.',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, hostResponse]);
    }, 2000);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      return `${Math.floor(diffInHours / 24)} days ago`;
    }
  };

  const renderConversationItem = (conversation) => (
    <TouchableOpacity
      key={conversation.id}
      style={[
        styles.conversationItem,
        selectedConversation?.id === conversation.id && styles.selectedConversation,
      ]}
      onPress={() => {
        setSelectedConversation(conversation);
        loadMessages(conversation.id);
      }}>
      <View style={styles.conversationImageContainer}>
        <Image source={{uri: conversation.hostImage}} style={styles.conversationImage} />
        {conversation.isOnline && <View style={styles.onlineIndicator} />}
      </View>
      
      <View style={styles.conversationInfo}>
        <View style={styles.conversationHeader}>
          <Text style={styles.hostName}>{conversation.host}</Text>
          <Text style={styles.lastMessageTime}>{conversation.lastMessageTime}</Text>
        </View>
        <Text style={styles.activityName}>{conversation.activity}</Text>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {conversation.lastMessage}
        </Text>
      </View>

      {conversation.unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadCount}>{conversation.unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderMessage = (message) => (
    <View
      key={message.id}
      style={[
        styles.messageContainer,
        message.sender === 'user' ? styles.userMessage : styles.hostMessage,
      ]}>
      <Text style={[
        styles.messageText,
        message.sender === 'user' ? styles.userMessageText : styles.hostMessageText,
      ]}>
        {message.message}
      </Text>
      <Text style={[
        styles.messageTime,
        message.sender === 'user' ? styles.userMessageTime : styles.hostMessageTime,
      ]}>
        {formatTime(message.timestamp)}
      </Text>
    </View>
  );

  if (selectedConversation) {
    return (
      <View style={styles.container}>
        {/* Chat Header */}
        <View style={styles.chatHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedConversation(null)}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          
          <View style={styles.chatHeaderInfo}>
            <Image source={{uri: selectedConversation.hostImage}} style={styles.chatHeaderImage} />
            <View style={styles.chatHeaderText}>
              <Text style={styles.chatHeaderName}>{selectedConversation.host}</Text>
              <Text style={styles.chatHeaderStatus}>
                {selectedConversation.isOnline ? 'Online' : 'Offline'}
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.moreButton}>
            <Icon name="more-vert" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <ScrollView style={styles.messagesContainer} showsVerticalScrollIndicator={false}>
          {messages.map(renderMessage)}
        </ScrollView>

        {/* Message Input */}
        <View style={styles.messageInputContainer}>
          <View style={styles.messageInput}>
            <TextInput
              style={styles.textInput}
              placeholder={language === 'en' ? 'Type a message...' : 'Andika ubutumwa...'}
              value={newMessage}
              onChangeText={setNewMessage}
              multiline
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]}
              onPress={sendMessage}
              disabled={!newMessage.trim()}>
              <Icon name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.conversationsContainer} showsVerticalScrollIndicator={false}>
        {conversations.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="message" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>
              {language === 'en' ? 'No messages yet' : 'Nta butumwa buvuzwe'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {language === 'en' 
                ? 'Start a conversation with a host!'
                : 'Tangira kuvugana n\'umutwara!'
              }
            </Text>
          </View>
        ) : (
          <View style={styles.conversationsList}>
            {conversations.map(renderConversationItem)}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  conversationsContainer: {
    flex: 1,
    padding: 20,
  },
  conversationsList: {
    paddingBottom: 20,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  selectedConversation: {
    backgroundColor: '#E8F5E8',
    borderWidth: 2,
    borderColor: '#2E7D32',
  },
  conversationImageContainer: {
    position: 'relative',
    marginRight: 15,
  },
  conversationImage: {
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
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#fff',
  },
  conversationInfo: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  hostName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  lastMessageTime: {
    fontSize: 12,
    color: '#666',
  },
  activityName: {
    fontSize: 14,
    color: '#2E7D32',
    marginBottom: 5,
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
  },
  unreadBadge: {
    backgroundColor: '#2E7D32',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  unreadCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E7D32',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 50,
  },
  backButton: {
    marginRight: 15,
  },
  chatHeaderInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatHeaderImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  chatHeaderText: {
    flex: 1,
  },
  chatHeaderName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  chatHeaderStatus: {
    fontSize: 14,
    color: '#E8F5E8',
  },
  moreButton: {
    marginLeft: 15,
  },
  messagesContainer: {
    flex: 1,
    padding: 20,
  },
  messageContainer: {
    marginBottom: 15,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  hostMessage: {
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    padding: 12,
    borderRadius: 15,
  },
  userMessageText: {
    backgroundColor: '#2E7D32',
    color: '#fff',
  },
  hostMessageText: {
    backgroundColor: '#E0E0E0',
    color: '#333',
  },
  messageTime: {
    fontSize: 12,
    marginTop: 5,
  },
  userMessageTime: {
    textAlign: 'right',
    color: '#666',
  },
  hostMessageTime: {
    textAlign: 'left',
    color: '#666',
  },
  messageInputContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  messageInput: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
});

export default MessagesScreen;