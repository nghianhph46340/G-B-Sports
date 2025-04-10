<template>
  <div>
    <!-- Nút chat ở góc phải bên dưới -->
    <div class="chat-button" @click="handleOpenChat">
      <a-badge :count="totalUnread">
        <message-outlined class="chat-icon" />
      </a-badge>
    </div>

    <!-- Modal Chat -->
    <a-modal :title="modalTitle" v-model:visible="isChatOpen" :footer="null" :width="400"
      :bodyStyle="{ padding: '10px', maxHeight: '400px', overflowY: 'auto' }"
      :style="{ position: 'fixed', bottom: '20px', right: '20px', top: 'auto', left: 'auto' }" @cancel="closeChat">
      <template #title>
        <div v-if="showMessages" style="display: flex; align-items: center;">
          <a-button @click="goBackToList" style="margin-right: 10px">
            <template #icon><arrow-left-outlined /></template>
          </a-button>
          <span>{{ modalTitle }}</span>
        </div>
        <span v-else>{{ modalTitle }}</span>
      </template>
      <div class="chat-container">
        <!-- Danh sách cuộc trò chuyện hoặc nhân viên -->
        <template v-if="!showMessages">
          <a-list :data-source="listData" :loading="!listData.length">
            <template #renderItem="{ item }">
              <a-list-item @click="selectConversation(senderType === 'STAFF' ? item.id : item.id)">
                <a-space>
                  <a-avatar>
                    {{ getAvatarText(item) }}
                  </a-avatar>
                  <div>
                    <a-typography-text strong>
                      {{ getName(item) }}
                    </a-typography-text>
                    <br />
                    <a-typography-text v-if="senderType === 'STAFF'" type="secondary" class="last-message">
                      {{ item?.lastMessage?.senderType === senderType ? "tôi: " : "" }}
                      {{ item?.lastMessage?.lastMesage || "Chưa có tin nhắn" }}
                    </a-typography-text>
                  </div>
                  <a-badge v-if="unreadCounts[item.id]" :count="unreadCounts[item.id]" />
                </a-space>
              </a-list-item>
            </template>
          </a-list>
        </template>

        <!-- Khung chat -->
        <template v-else>
          <div ref="messagesRef" class="messages-container">
            <a-list :data-source="messages">
              <template #renderItem="{ item: msg }">
                <a-list-item :class="{ 'message-sent': msg.senderType === senderType }">
                  <a-card :class="getMessageCardClass(msg)">
                    <p>{{ msg.content }}</p>
                    <span class="message-time">
                      {{ formatTime(msg.createdAt) }}
                    </span>
                  </a-card>
                </a-list-item>
              </template>
            </a-list>
          </div>

          <!-- Input tin nhắn -->
          <a-space class="input-container">
            <a-input v-model:value="newMessage" placeholder="Nhập tin nhắn của bạn" @pressEnter="sendMessage" />
            <a-button type="primary" @click="sendMessage">Gửi</a-button>
          </a-space>
        </template>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { MessageOutlined, ArrowLeftOutlined } from '@ant-design/icons-vue';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
// import { COLORS } from '../../../constants/constants';

const props = defineProps({
  customerId: String,
  staffId: String,
  senderType: String,
  anou: Boolean
});

// Refs
const isChatOpen = ref(false);
const showMessages = ref(false);
const messages = ref([]);
const newMessage = ref('');
const conversationId = ref(null);
const conversations = ref([]);
const staffList = ref([]);
const unreadCounts = ref({});
const totalUnread = ref(0);
const messagesRef = ref(null);
const stompClient = ref(null);

// Computed
const modalTitle = computed(() => {
  if (showMessages.value) {
    return 'Hỗ Trợ Khách Hàng';
  }
  return props.senderType === 'STAFF' ? 'Danh Sách Cuộc Trò Chuyện' : 'Danh Sách Nhân Viên Hỗ Trợ';
});

const listData = computed(() =>
  props.senderType === 'STAFF' ? conversations.value : staffList.value
);

// Methods
const handleOpenChat = async () => {
  isChatOpen.value = true;
  try {
    await fetchData();
  } catch (error) {
    console.error('Lỗi khi mở chat:', error);
  }
};

const fetchData = async () => {
  try {
    if (props.senderType === 'STAFF') {
      // Fake data cho staff
      conversations.value = [
        {
          id: 1,
          customer: {
            id: 1,
            fullName: 'Nguyễn Văn A',
            email: 'nguyenvana@example.com'
          },
          lastMessage: {
            id: 1,
            content: 'Xin chào, tôi cần hỗ trợ',
            senderType: 'CUSTOMER',
            status: 'SENT',
            createdAt: new Date().toISOString()
          }
        },
        {
          id: 2,
          customer: {
            id: 2,
            fullName: 'Trần Thị B',
            email: 'tranthib@example.com'
          },
          lastMessage: {
            id: 2,
            content: 'Sản phẩm có còn hàng không?',
            senderType: 'CUSTOMER',
            status: 'SENT',
            createdAt: new Date().toISOString()
          }
        }
      ];

      const counts = {};
      let total = 0;
      for (const conv of conversations.value) {
        counts[conv.id] = 1; // Mỗi cuộc trò chuyện có 1 tin nhắn chưa đọc
        total += 1;
      }
      unreadCounts.value = counts;
      totalUnread.value = total;
    } else {
      // Fake data cho customer
      staffList.value = [
        {
          id: 1,
          fullName: 'Nhân viên A',
          email: 'nhanviena@example.com',
          phone: '0123456789'
        },
        {
          id: 2,
          fullName: 'Nhân viên B',
          email: 'nhanvienb@example.com',
          phone: '0987654321'
        }
      ];

      const counts = {};
      let total = 0;
      for (const staff of staffList.value) {
        counts[staff.id] = 0; // Không có tin nhắn chưa đọc
        total += 0;
      }
      unreadCounts.value = counts;
      totalUnread.value = total;
    }
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu:', error);
  }
};

const apiRead = async (convId) => {
  try {
    await axios.put(`http://localhost:8080/api/messages/${convId}/read`);
  } catch (error) {
    console.error('Lỗi khi đánh dấu tin nhắn đã đọc:', error);
  }
};

const connectWS = () => {
  try {
    const socket = new SockJS('http://localhost:8080/ws');
    stompClient.value = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: (frame) => {
        console.log('✅ WebSocket Connected:', frame);
        stompClient.value.subscribe(`/topic/messages/${conversationId.value}`, (message) => {
          const newMsg = JSON.parse(message.body);
          messages.value.push(newMsg);

          if (newMsg.senderType !== props.senderType) {
            apiRead(newMsg.conversation.id);
          }

          const currentUserId = props.senderType === 'CUSTOMER' ? props.customerId : props.staffId;
          if (newMsg.senderId !== currentUserId &&
            newMsg.status === 'SENT' &&
            (!isChatOpen.value || (showMessages.value && conversationId.value !== newMsg.conversationId))) {
            unreadCounts.value[conversationId.value] = (unreadCounts.value[conversationId.value] || 0) + 1;
            totalUnread.value++;
          }
        });
      },
      onStompError: (frame) => {
        console.error('❌ STOMP Error:', frame.headers['message']);
      },
      onWebSocketClose: (event) => {
        console.warn('⚠️ WebSocket Closed:', event);
      },
      debug: (str) => {
        console.log('🛠 WebSocket Debug:', str);
      }
    });

    stompClient.value.activate();
  } catch (error) {
    console.error('Lỗi khi kết nối WebSocket:', error);
  }
};

const sendMessage = () => {
  if (newMessage.value.trim()) {
    const message = {
      id: messages.value.length + 1,
      content: newMessage.value,
      senderType: props.senderType,
      senderId: props.senderType === 'CUSTOMER' ? props.customerId : props.staffId,
      status: 'SENT',
      createdAt: new Date().toISOString(),
      conversation: { id: conversationId.value }
    };

    messages.value.push(message);
    newMessage.value = '';

    // Cuộn xuống tin nhắn mới nhất
    nextTick(() => {
      if (messagesRef.value) {
        messagesRef.value.scrollTop = messagesRef.value.scrollHeight;
      }
    });
  }
};

const selectConversation = async (id) => {
  try {
    if (props.senderType === 'STAFF') {
      conversationId.value = id;
    } else {
      const response = await axios.post('http://localhost:8080/api/conversations', {
        customerId: props.customerId,
        staffId: id
      });
      conversationId.value = response.data.id;
    }
    showMessages.value = true;
    messages.value = [];

    unreadCounts.value[id] = 0;
    totalUnread.value = Math.max(0, totalUnread.value - (unreadCounts.value[id] || 0));
  } catch (error) {
    console.error('Lỗi khi chọn/tạo cuộc trò chuyện:', error);
  }
};

const goBackToList = () => {
  showMessages.value = false;
  conversationId.value = null;
  messages.value = [];
};

const closeChat = () => {
  isChatOpen.value = false;
  showMessages.value = false;
  conversationId.value = null;
  messages.value = [];
};

// Helpers
const getAvatarText = (item) => {
  return props.senderType === 'STAFF'
    ? item.customer?.fullName?.charAt(0)
    : item.fullName?.charAt(0) || 'U';
};

const getName = (item) => {
  return props.senderType === 'STAFF'
    ? item.customer?.fullName
    : item.fullName || 'Nhân viên';
};

const getMessageCardClass = (msg) => {
  return {
    'message-card': true,
    'message-sent': msg.senderType === props.senderType
  };
};

const formatTime = (time) => {
  return new Date(time).toLocaleTimeString();
};

// Thêm hàm fake cho tin nhắn
const fetchMessages = async (convId) => {
  // Fake data cho tin nhắn
  messages.value = [
    {
      id: 1,
      content: 'Xin chào, tôi có thể giúp gì cho bạn?',
      senderType: 'STAFF',
      senderId: 1,
      status: 'SENT',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      conversation: { id: convId }
    },
    {
      id: 2,
      content: 'Tôi cần hỗ trợ về sản phẩm',
      senderType: 'CUSTOMER',
      senderId: 1,
      status: 'SENT',
      createdAt: new Date(Date.now() - 1800000).toISOString(),
      conversation: { id: convId }
    },
    {
      id: 3,
      content: 'Bạn cần hỗ trợ về sản phẩm nào?',
      senderType: 'STAFF',
      senderId: 1,
      status: 'SENT',
      createdAt: new Date().toISOString(),
      conversation: { id: convId }
    }
  ];
};

// Sửa lại watch để sử dụng fetchMessages
watch([() => conversationId.value, () => isChatOpen.value, () => showMessages.value],
  async ([newConvId]) => {
    if (!newConvId) return;

    if (showMessages.value && newConvId != null) {
      await apiRead(newConvId);
    }

    try {
      await fetchMessages(newConvId);
    } catch (error) {
      console.error('Lỗi khi lấy tin nhắn:', error);
    }

    connectWS();
  }
);

watch(() => messages.value, async () => {
  await nextTick();
  if (messagesRef.value) {
    messagesRef.value.scrollTop = messagesRef.value.scrollHeight;
  }
}, { deep: true });

onMounted(() => {
  if (conversationId.value == null && showMessages.value) return;
  fetchData();
});

onUnmounted(() => {
  if (stompClient.value) {
    stompClient.value.deactivate();
  }
});
</script>

<style scoped>
.chat-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  background-color: black;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.chat-icon {
  color: white;
  font-size: 24px;
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.messages-container {
  flex: 1;
  max-height: 300px;
  overflow-y: auto;
  padding: 10px;
}

.message-card {
  max-width: 70%;
  border-radius: 10px;
  margin: 5px 0;
  padding: 10px;
}

.message-sent {
  /* background-color: v-bind('COLORS.backgroundcolor2'); */
  margin-left: auto;
}

.message-received {
  background-color: #f5f5f5;
  margin-right: auto;
}

.message-time {
  font-size: 12px;
  color: #888;
  display: block;
  margin-top: 5px;
}

.input-container {
  margin-top: 10px;
  width: 100%;
  gap: 10px;
  display: flex;
  align-items: center;
}

.last-message {
  font-size: 12px;
}

:deep(.ant-list-item) {
  padding: 8px 0;
}

:deep(.ant-card) {
  background: transparent;
  border: none;
}

:deep(.ant-card-body) {
  padding: 0;
}
</style>
