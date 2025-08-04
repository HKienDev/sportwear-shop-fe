'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Conversation,
  Message,
  ServerMessage,
  useSocketConnection,
  useChatAPI,
  useTheme,
  ConversationList,
  ChatHeader,
  MessageList,
  MessageInput,
  ThemeSelector
} from './index';

// Define proper types for socket events
interface NewConversationData {
  conversationId: string;
  userId: string;
  userName: string;
}

interface StatusUpdateData {
  userId: string;
  status: 'online' | 'offline' | 'away';
}

const ChatManagerAdmin: React.FC = () => {
  // State management
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Custom hooks
  const { socket, isConnected } = useSocketConnection();
  const { 
    fetchConversations, 
    fetchMessages, 
    sendMessage, 
    markAsRead, 
    loading, 
    error, 
    clearError 
  } = useChatAPI();
  const { currentTheme, changeTheme, getThemeColors } = useTheme();

  // Client-side rendering check
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load conversations
  const loadConversations = useCallback(async () => {
    const fetchedConversations = await fetchConversations();
    setConversations(fetchedConversations);
    
    // Load conversations from localStorage as fallback
    const savedConversations = localStorage.getItem('adminConversations');
    if (savedConversations && fetchedConversations.length === 0) {
      try {
        const parsed = JSON.parse(savedConversations);
        setConversations(parsed);
      } catch (error) {
        console.error('❌ ChatManagerAdmin - Error parsing localStorage conversations:', error);
      }
    }
  }, [fetchConversations]);

  // Update conversation last message
  const updateConversationLastMessage = useCallback((conversationId: string, message: string) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId 
          ? { 
              ...conv, 
              lastMessage: message, 
              lastMessageTime: new Date().toISOString(),
              unread: conv.id === selectedConversation?.id ? 0 : conv.unread
            }
          : conv
      )
    );
  }, [selectedConversation]);

  // Load conversations on mount
  useEffect(() => {
    if (isClient) {
      loadConversations();
    }
  }, [isClient, loadConversations]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    // Lắng nghe tin nhắn mới
    const handleNewMessage = (data: ServerMessage) => {
      const newMessage: Message = {
        sender: data.senderId,
        text: data.text,
        time: data.timestamp || new Date().toISOString(),
        senderId: data.senderId,
        senderName: data.senderName,
        timestamp: data.timestamp,
        messageId: data.messageId
      };

      setMessages(prev => [...prev, newMessage]);

      // Cập nhật conversation list nếu tin nhắn từ conversation đang được chọn
      if (selectedConversation && data.senderId === selectedConversation.id) {
        updateConversationLastMessage(selectedConversation.id, data.text);
      } else {
        // Nếu tin nhắn từ conversation khác, refresh conversations để cập nhật unread count
        loadConversations();
      }
    };

    // Lắng nghe cuộc trò chuyện mới
    const handleNewConversation = (data: NewConversationData) => {
      loadConversations();
    };

    // Lắng nghe cập nhật trạng thái
    const handleStatusUpdate = (data: StatusUpdateData) => {
      loadConversations();
    };

    socket.on('receiveMessage', handleNewMessage);
    socket.on('newConversation', handleNewConversation);
    socket.on('statusUpdate', handleStatusUpdate);

    return () => {
      socket.off('receiveMessage', handleNewMessage);
      socket.off('newConversation', handleNewConversation);
      socket.off('statusUpdate', handleStatusUpdate);
    };
  }, [socket, selectedConversation, loadConversations, updateConversationLastMessage]);

  // Load messages for selected conversation
  const loadMessages = useCallback(async (conversationId: string) => {
    const fetchedMessages = await fetchMessages(conversationId);
    setMessages(fetchedMessages);
    
    // Save to localStorage
    localStorage.setItem(`adminMessages_${conversationId}`, JSON.stringify(fetchedMessages));
    
    // Mark as read
    await markAsRead(conversationId);
    
    // Update conversation unread count
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, unread: 0 }
          : conv
      )
    );
  }, [fetchMessages, markAsRead]);

  // Handle conversation selection
  const handleSelectConversation = useCallback((conversation: Conversation) => {
    setSelectedConversation(conversation);
    loadMessages(conversation.id);
  }, [loadMessages]);

  // Handle sending message
  const handleSendMessage = useCallback(async (messageText: string) => {
    if (!selectedConversation || !socket) return;
    
    const newMessage: Message = {
      sender: 'admin',
      text: messageText,
      time: new Date().toISOString(),
      senderId: 'admin',
      senderName: 'Admin',
      timestamp: new Date().toISOString(),
      messageId: `temp_${Date.now()}`
    };

    // Add message to UI immediately
    setMessages(prev => [...prev, newMessage]);

    // Send via API
    const success = await sendMessage(selectedConversation.id, messageText);
    
    if (success) {
      // Update conversation last message
      updateConversationLastMessage(selectedConversation.id, messageText);
      
      // Send via socket with recipientId
      socket.emit('sendMessage', {
        text: messageText,
        recipientId: selectedConversation.id,
        senderId: 'admin',
        senderName: 'Admin'
      });
    } else {
      // Remove message if failed
      setMessages(prev => prev.filter(msg => msg.messageId !== newMessage.messageId));
    }
  }, [selectedConversation, socket, sendMessage, updateConversationLastMessage]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    clearError();
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
    }
    loadConversations();
  }, [selectedConversation, loadMessages, loadConversations, clearError]);

  // Save conversations to localStorage
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('adminConversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  // Save messages to localStorage
  useEffect(() => {
    if (selectedConversation && messages.length > 0) {
      localStorage.setItem(`adminMessages_${selectedConversation.id}`, JSON.stringify(messages));
    }
  }, [messages, selectedConversation]);

  // Load messages from localStorage on conversation selection
  useEffect(() => {
    if (selectedConversation) {
      const savedMessages = localStorage.getItem(`adminMessages_${selectedConversation.id}`);
      if (savedMessages) {
        try {
          const parsed = JSON.parse(savedMessages);
          setMessages(parsed);
        } catch (error) {
          console.error('❌ ChatManagerAdmin - Error parsing localStorage messages:', error);
        }
      }
    }
  }, [selectedConversation]);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const themeColors = getThemeColors();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Conversation List */}
      <ConversationList
        conversations={conversations}
        selectedConversation={selectedConversation}
        onSelectConversation={handleSelectConversation}
        themeColors={themeColors}
        loading={loading}
      />

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <ChatHeader
          conversation={selectedConversation}
          themeColors={themeColors}
          isConnected={isConnected}
          onRefresh={handleRefresh}
        />

        {/* Messages */}
        <MessageList
          messages={messages}
          themeColors={themeColors}
          loading={loading}
          error={error}
          onRetry={handleRefresh}
        />

        {/* Input */}
        <MessageInput
          onSendMessage={handleSendMessage}
          themeColors={themeColors}
          disabled={!selectedConversation || !isConnected}
          loading={loading}
        />
      </div>

      {/* Theme Selector */}
      <div className="absolute top-4 right-4">
        <ThemeSelector
          currentTheme={currentTheme}
          onThemeChange={changeTheme}
          isOpen={showThemeSelector}
          onToggle={() => setShowThemeSelector(!showThemeSelector)}
        />
      </div>
    </div>
  );
};

export default ChatManagerAdmin; 