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
  MessageInput
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
    try {
      const fetchedConversations = await fetchConversations();
      setConversations(fetchedConversations);
    } catch (error) {
      console.error('❌ ChatManagerAdmin - Error loading conversations:', error);
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
      console.log('🔍 ChatManagerAdmin - Loading conversations on mount');
      loadConversations();
    }
  }, [isClient, loadConversations]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) {
      console.log('🔍 ChatManagerAdmin - Socket not available');
      return;
    }

    console.log('🔍 ChatManagerAdmin - Setting up socket listeners');

    // Lắng nghe tin nhắn mới
    const handleNewMessage = (data: ServerMessage) => {
      
      // Kiểm tra nếu tin nhắn đã tồn tại để tránh duplicate
      setMessages(prev => {
        const messageExists = prev.some(msg => 
          msg.text === data.text && 
          msg.senderId === data.senderId && 
          msg.senderName === data.senderName &&
          Math.abs(new Date(msg.timestamp || msg.time || Date.now()).getTime() - new Date(data.timestamp || Date.now()).getTime()) < 5000 // 5 giây
        );
        
        if (messageExists) {
          return prev;
        }
        
        // Xác định senderName đúng
        let displayName = data.senderName;
        if (data.senderId === 'admin') {
          displayName = 'Admin';
        } else if (data.senderId === selectedConversation?.id) {
          // Tin nhắn từ user hiện tại
          displayName = selectedConversation.name;
        } else {
          // Tin nhắn từ user khác
          displayName = data.senderName || 'User';
        }
        
        const newMessage: Message = {
          sender: data.senderId,
          text: data.text,
          time: data.timestamp || new Date().toISOString(),
          senderId: data.senderId,
          senderName: displayName,
          timestamp: data.timestamp,
          messageId: data.messageId
        };
        
        return [...prev, newMessage];
      });

      // Cập nhật conversation list và tự động chọn conversation nếu cần
      setConversations(prev => {
        const updatedConversations = prev.map(conv => {
          if (conv.id === data.senderId) {
            return {
              ...conv,
              lastMessage: data.text,
              lastMessageTime: data.timestamp || new Date().toISOString(),
              unread: conv.id === selectedConversation?.id ? 0 : conv.unread + 1
            };
          }
          return conv;
        });

        // Nếu tin nhắn từ user chưa được chọn và chưa có conversation nào được chọn
        if (data.senderId !== 'admin' && !selectedConversation) {
          const senderConversation = updatedConversations.find(conv => conv.id === data.senderId);
          if (senderConversation) {
            // Tự động chọn conversation này
            setTimeout(() => {
              setSelectedConversation(senderConversation);
              // Load tin nhắn cho conversation này
              loadMessages(senderConversation.id);
            }, 100);
          }
        } else if (data.senderId !== 'admin' && selectedConversation && data.senderId !== selectedConversation.id) {
          // Nếu tin nhắn từ user khác với conversation đang được chọn
          const senderConversation = updatedConversations.find(conv => conv.id === data.senderId);
          if (senderConversation) {
            // Tự động chọn conversation của user gửi tin nhắn
            setTimeout(() => {
              setSelectedConversation(senderConversation);
              // Load tin nhắn cho conversation này
              loadMessages(senderConversation.id);
            }, 100);
          }
        }

        return updatedConversations;
      });
    };

    // Lắng nghe cuộc trò chuyện mới
    const handleNewConversation = (data: NewConversationData) => {
      
      // Kiểm tra xem conversation đã tồn tại chưa
      setConversations(prev => {
        const exists = prev.some(conv => conv.id === data.conversationId);
        if (exists) {
          return prev;
        }
        
        const newConversation: Conversation = {
          id: data.conversationId,
          name: data.userName,
          lastMessage: 'Bắt đầu cuộc trò chuyện',
          lastMessageTime: new Date().toISOString(),
          unread: 1,
          isOnline: true
        };
        
        // Tự động chọn conversation mới nếu chưa có conversation nào được chọn
        if (!selectedConversation) {
          setTimeout(() => {
            setSelectedConversation(newConversation);
            // Load tin nhắn cho conversation mới
            loadMessages(newConversation.id);
          }, 100);
        }
        
        return [newConversation, ...prev];
      });
    };

    // Lắng nghe cập nhật trạng thái
    const handleStatusUpdate = (data: StatusUpdateData) => {
      // Cập nhật trạng thái user cụ thể thay vì reload toàn bộ
      setConversations(prev => 
        prev.map(conv => 
          conv.id === data.userId 
            ? { ...conv, isOnline: data.status === 'online' }
            : conv
        )
      );
    };

    // Lắng nghe cập nhật thông tin user
    const handleUserUpdate = (data: any) => {
      
      if (data.type === 'userUpdate') {
        setConversations(prev => {
          const existingIndex = prev.findIndex(conv => conv.id === data.userId);
          
          if (existingIndex >= 0) {
            // Cập nhật conversation hiện có
            const updatedConversations = [...prev];
            updatedConversations[existingIndex] = {
              ...updatedConversations[existingIndex],
              name: data.userName,
              isOnline: data.isOnline !== false, // Mặc định true nếu không có isOnline
              userInfo: {
                _id: data.userId,
                id: data.userId,
                name: data.userName,
                email: data.userEmail || '',
                phone: data.userPhone || ''
              }
            };
            return updatedConversations;
          } else {
            // Tạo conversation mới nếu chưa có
            const newConversation: Conversation = {
              id: data.userId,
              name: data.userName,
              lastMessage: data.isOnline === false ? 'User disconnected' : 'User connected',
              lastMessageTime: new Date().toISOString(),
              unread: 0,
              isOnline: data.isOnline !== false,
              userInfo: {
                _id: data.userId,
                id: data.userId,
                name: data.userName,
                email: data.userEmail || '',
                phone: data.userPhone || ''
              }
            };
            
            // Tự động chọn conversation mới nếu user online và chưa có conversation nào được chọn
            if (data.isOnline !== false && !selectedConversation) {
              setTimeout(() => {
                setSelectedConversation(newConversation);
                // Load tin nhắn cho conversation mới
                loadMessages(newConversation.id);
              }, 100);
            }
            
            return [newConversation, ...prev];
          }
        });
      }
    };

    socket.on('receiveMessage', handleNewMessage);
    socket.on('newConversation', handleNewConversation);
    socket.on('statusUpdate', handleStatusUpdate);
    socket.on('userUpdate', handleUserUpdate);

    return () => {
      socket.off('receiveMessage', handleNewMessage);
      socket.off('newConversation', handleNewConversation);
      socket.off('statusUpdate', handleStatusUpdate);
      socket.off('userUpdate', handleUserUpdate);
    };
  }, [socket]);

  // Load messages for selected conversation
  const loadMessages = useCallback(async (conversationId: string) => {
    try {
      console.log('🔍 ChatManagerAdmin - Loading messages for conversation:', conversationId);
      const fetchedMessages = await fetchMessages(conversationId);
      console.log('🔍 ChatManagerAdmin - Fetched messages:', fetchedMessages);
      setMessages(fetchedMessages);
      
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
    } catch (error) {
      console.error('❌ ChatManagerAdmin - Error loading messages:', error);
      setMessages([]);
    }
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

    // Cập nhật conversation last message trực tiếp
    setConversations(prev => 
      prev.map(conv => 
        conv.id === selectedConversation.id 
          ? { 
              ...conv, 
              lastMessage: messageText, 
              lastMessageTime: new Date().toISOString()
            }
          : conv
      )
    );
    
    // Send via socket only (không gọi API)
    socket.emit('sendMessage', {
      text: messageText,
      recipientId: selectedConversation.id,
      senderId: 'admin',
      senderName: 'Admin'
    });
  }, [selectedConversation, socket]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    clearError();
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
    }
    loadConversations();
  }, [selectedConversation, loadMessages, loadConversations, clearError]);

  // Clear localStorage cache để tránh lỗi
  useEffect(() => {
    // Clear old cache khi component mount
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('adminMessages_') || key === 'adminConversations') {
        localStorage.removeItem(key);
      }
    });
  }, []);

  // Load messages from localStorage on conversation selection
  useEffect(() => {
    if (selectedConversation) {
      // Clear localStorage cache để tránh lỗi
      localStorage.removeItem(`adminMessages_${selectedConversation.id}`);
      
      // Load messages từ API thay vì localStorage
      loadMessages(selectedConversation.id);
    }
  }, [selectedConversation, loadMessages]);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const themeColors = getThemeColors();

  return (
    <div 
      className="flex h-full min-h-[600px] bg-gradient-to-br from-slate-50/50 to-blue-50/50 rounded-2xl overflow-hidden"
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
    >
      {/* Conversation List */}
      <div className="w-1/3 min-w-[300px] border-r border-slate-200 bg-white/80 backdrop-blur-sm">
        <ConversationList
          conversations={conversations}
          selectedConversation={selectedConversation}
          onSelectConversation={handleSelectConversation}
          themeColors={themeColors}
          loading={loading}
        />
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col h-full">
        {/* Header */}
        <div className="flex-shrink-0 bg-white/90 backdrop-blur-sm border-b border-slate-200">
          <ChatHeader
            conversation={selectedConversation}
            themeColors={themeColors}
            isConnected={isConnected}
            onRefresh={handleRefresh}
          />
        </div>

        {/* Messages - Fixed height with scroll */}
        <div className="flex-1 min-h-0 overflow-hidden bg-gradient-to-br from-gray-50/50 to-blue-50/30">
          <MessageList
            messages={messages}
            themeColors={themeColors}
            loading={loading}
            error={error}
            onRetry={handleRefresh}
          />
        </div>

        {/* Input */}
        <div className="flex-shrink-0 bg-white/90 backdrop-blur-sm border-t border-slate-200">
          <MessageInput
            onSendMessage={handleSendMessage}
            themeColors={themeColors}
            disabled={!selectedConversation || !isConnected}
            loading={loading}
          />
        </div>
      </div>


    </div>
  );
};

export default ChatManagerAdmin; 