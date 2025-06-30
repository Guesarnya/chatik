import { StyleSheet, Text, View, SafeAreaView,
   TouchableOpacity, KeyboardAvoidingView, Platform,
   Image, TextInput, Keyboard, Dimensions, FlatList,
   StatusBar, } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const flatListRef = useRef(null);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);


  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);



  const handleSend = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        text: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMyMessage: true
      };

      setMessages(prev => [newMessage, ...prev]);
      setMessage('');

      setTimeout(() => {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
      }, 100);

      setTimeout(() => {
        const botMessage = {
          id: (Date.now() + 1).toString(),
          text: "У меня было много ножей.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMyMessage: false,
          replies: ["Абсолютно много?", "Советы по питанию?"]
        };
        setMessages(prev => [botMessage, ...prev]);
      }, 3000);
    }
  };

  const handleReply = (replyText, botMessageId) => {
    const replyMessage = {
      id: Date.now().toString(),
      text: replyText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMyMessage: true
    };

    setMessages(prev =>
      [
        replyMessage,
        ...prev.map(m =>
          m.id === botMessageId ? { ...m, replies: null } : m
        )
      ]
    );
  };


  
  const MessageItem = ({ message, showAvatar }) => {
  const [bubbleWidth, setBubbleWidth] = useState(null);
  const [bubbleHeight, setBubbleHeight] = useState(null);

  return (
    <View style={{ flexDirection: 'row', marginBottom: 5, alignSelf: message.isMyMessage ? 'flex-end' : 'flex-start' }}>
      {!message.isMyMessage && (
        <View style={{ width: 40, alignItems: 'center' }}>
          {showAvatar ? (
            <Image
              source={require('../assets/suppor.png')}
              style={[
                styles.avatar,
                bubbleHeight != null && {
                  marginTop: (bubbleHeight - 40) / 2, 
                }
              ]}
            />
          ) : (
            <View style={styles.avatarPlaceholder} />
          )}
        </View>
      )}

      <View style={{ flex: 1 }}>
        <View
          style={[
            styles.messageBubble,
            message.isMyMessage ? styles.myMessage : styles.otherMessage
          ]}
          onLayout={(event) => {
            const { width, height } = event.nativeEvent.layout;
            setBubbleWidth(width);
            setBubbleHeight(height);
          }}
        >
          <Text style={message.isMyMessage ? styles.myMessageText : styles.otherMessageText}>
            {message.text}
          </Text>
          <Text style={styles.messageTime}>{message.time}</Text>
        </View>

        {message.replies?.map((reply, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => handleReply(reply, message.id)}
            style={[
              styles.replyButton,
              {
                width: bubbleWidth,
                alignSelf: message.isMyMessage ? 'flex-end' : 'flex-start',
              }
            ]}
          >
            <Text style={styles.replyText}>{reply}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}


  const [activeTab, setActiveTab] = useState('map');
  const tabs = [
    {
      id: 'map',
      label: 'label',
      icon: 'map-marker',
      iconSet: MaterialCommunityIcons,
      iconStyle: {
        size: 24,
        activeColor: "white",
        inactiveColor: "black",
        customStyle:{
          
        }
      }
    },
    {
      id: 'notes',
      label: 'label',
      icon: 'bookmark-outline',
      iconSet: MaterialCommunityIcons,
      iconStyle: {
        size: 24,
        activeColor: "white",
        inactiveColor: "black",
      },
      
    },
    {
      id: 'alerts',
      label: 'label',
      icon: 'bell-outline',
      iconSet: MaterialCommunityIcons,
      iconStyle: {
        size: 24,
        activeColor: "white",
        inactiveColor: "black", 
      }
    }
  ];


  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>FoodMood</Text>
        </View>

        {/* Сообщения */}
        <View style={styles.contentContainer}>
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => {
              const previousMessage = messages[index + 1];
              const showAvatar = !item.isMyMessage && (!previousMessage || previousMessage.isMyMessage);
              return <MessageItem message={item} showAvatar={showAvatar} />;
            }}
            style={styles.flatList}
            contentContainerStyle={styles.messagesList}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={true}
            inverted
          />
        </View>

        {/* Ввод сообщения */}
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.inputContainer}>
            <TextInput
              placeholder='Написать сообщение...'
              placeholderTextColor="#C8D0DC" 
              style={styles.input}
              value={message}
              onChangeText={setMessage}
              textAlignVertical='center'
              multiline
            />

            <TouchableOpacity
              style={styles.ButtonOfSend}
              onPress={handleSend}
              disabled={!message.trim()}
            >
              <Ionicons
                name='arrow-forward'
                size={24}
                color={message.trim() ? "#FFFFFF" : "#959195"}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>


        {/* Нижняя навигация */}
        {(Platform.OS === 'ios' || !isKeyboardVisible) && (
          <View style={styles.bottomNavBar}>
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const IconComponent = tab.iconSet;

              return (
                <TouchableOpacity
                  key={tab.id}
                  style={styles.navButton}
                  onPress={() => setActiveTab(tab.id)}
                >
                  <View style={[
                    tab.iconStyle.customStyle,
                    isActive && {
                      backgroundColor: '#0046F8',
                      borderRadius: 20,
                      width: 80,
                      height: 40,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }
                  ]}>
                    <IconComponent
                      name={tab.icon}
                      size={tab.iconStyle.size}
                      color={isActive ? tab.iconStyle.activeColor : tab.iconStyle.inactiveColor}
                    />
                  </View>

                  <Text style={[
                    styles.navText,
                    {
                      color: isActive ? 'black' : 'black'
                    }
                  ]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}


        <StatusBar style="auto" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  // Основной контейнер всего экрана
  container: {
    flex: 1,
    backgroundColor: '#F9FAFC',
  },

  // Контейнер для области с сообщениями
  contentContainer: {
    flex: 1,
    backgroundColor: '#F1F3F6',
  },

  // Стиль для FlatList с сообщениями
  flatList: {
    flex: 1,
  },

  header:{
    height: 60,
    paddingBottom: 8,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFC',
    justifyContent: 'center'
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "#333",
    
  },  

  // Контейнер ввода сообщения (input + кнопка отправки)
  inputContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F9FAFC',
  },

  // Поле ввода текста
  input: {
    flex: 1, 
    minHeight: 44, 
    maxHeight: 120, 
    paddingHorizontal: 12,
    paddingVertical: 14,
    backgroundColor: '#f1f2f6',
    borderRadius: 28,
    fontSize: 16,
    fontFamily: 'Body Large/Font', 
    marginRight: 8, 
  },

  // Кнопка отправки сообщения
  ButtonOfSend: {
    width: 50,
    height: 50,
    borderRadius: 40, 
    backgroundColor: '#1C1B1F',
    justifyContent: 'center',
    alignItems: 'center',
  },

  keyboardAvoidingView: {

  },
  
  // ------------------------------------------------Нижняя навигационная панель----------------------------------------------------------------------------
  
  
  bottomNavBar: {
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#F9FAFC',
  },

  // Кнопка в нижней панели
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    width: '33%',
  },

  // Иконка внутри кнопки нижней панели
  navIcon: {
    width: '30%',
    height: undefined,
    aspectRatio: 1, 
    resizeMode: 'contain',
  },

  // Текст под иконкой в нижней панели
  navText: {
    fontSize: 12,
    color: '#333',
  },



  // ---------------------------------------------------------Контейнер всех сообщений (отступы)----------------------------------------------------------------------

  messagesList: {
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 40,
  },

  avatar: {
    width: 36,
    height: 36,
    borderRadius: 36,
    marginRight: 6,
    
  },

  avatarPlaceholder: {
    width: 36,
    height: 36,
    marginRight: 6,
  },


  // Оболочка одного сообщения
  messageBubble: {
    maxWidth: '80%', 
    padding: 12,
    marginBottom: 4,
  },

  // Стиль для сообщений пользователя
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#0046F8',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 8, 
    borderBottomLeftRadius: 20,

  },

  // Стиль для сообщений собеседника
  otherMessage: {
    alignSelf: 'flex-start',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 8, 
    borderBottomRightRadius: 20,
    backgroundColor: '#F9FAFC', 
  
  },

  // Основной текст сообщения
  myMessageText: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'Roboto', 
  },
  otherMessageText:{
    fontSize: 16,
    color: "black",
    fontFamily: 'Body Large/Font', 
  },

  // Время отправки сообщения
  messageTime: {
    fontSize: 10,
    color: '#9fa0a5',
    textAlign: 'right',
    marginTop: 4,
    fontFamily: 'Body Large/Font', 
  },

  replyButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E6EDFF',
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 14,
    marginTop: 4,
    maxWidth: '80%', 

  },


  replyText: {
    fontSize: 16,
    color: '#000000',
    fontFamily: 'Body Large/Font', 
  }


});

