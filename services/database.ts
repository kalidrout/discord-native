interface User {
  id: string;
  username: string;
  discriminator: string;
  avatar?: string;
  status?: 'online' | 'offline' | 'idle' | 'dnd';
  friends?: string[];
}

interface FriendRequest {
  id: string;
  from: string;
  to: string;
  status: 'pending' | 'accepted' | 'rejected';
  timestamp: number;
}

// Mock data for demonstration
const mockUsers: User[] = [
  { id: '2', username: 'NullByte', discriminator: '0001', status: 'online' },
  { id: '3', username: 'EinzzCookie', discriminator: '0002', status: 'online' },
  { id: '4', username: 'blade_X', discriminator: '0003', status: 'offline' },
  { id: '5', username: 'GordonFreeman', discriminator: '0004', status: 'idle' },
  { id: '6', username: 'Hummlan', discriminator: '0005', status: 'dnd' },
];

interface Server {
  id: string;
  name: string;
  imageUrl?: string;
  ownerId: string;
  members: string[];
  channels: Channel[];
}

interface Channel {
  id: string;
  name: string;
  type: 'text' | 'voice' | 'announcement';
  serverId: string;
}

interface Message {
  id: string;
  content: string;
  authorId: string;
  channelId: string;
  timestamp: Date;
}

class DatabaseService {
  private static instance: DatabaseService;
  private friendRequests: FriendRequest[] = [];
  private servers: Server[] = [];
  private users: User[] = mockUsers;
  private friends: Map<string, string[]> = new Map();
  private messages: Map<string, Message[]> = new Map();
  
  private constructor() {}
  
  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  async searchUsers(query: string): Promise<User[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return mockUsers.filter(user => 
      user.username.toLowerCase().includes(query.toLowerCase()) ||
      `${user.username}#${user.discriminator}`.toLowerCase().includes(query.toLowerCase())
    );
  }

  async sendFriendRequest(fromUserId: string, toUserId: string): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const existingRequest = this.friendRequests.find(
      req => (req.from === fromUserId && req.to === toUserId) ||
             (req.from === toUserId && req.to === fromUserId)
    );
    
    if (existingRequest) {
      throw new Error('Friend request already exists');
    }

    const newRequest: FriendRequest = {
      id: Math.random().toString(36).substr(2, 9),
      from: fromUserId,
      to: toUserId,
      status: 'pending',
      timestamp: Date.now()
    };

    this.friendRequests.push(newRequest);
  }

  async getSuggestedFriends(userId: string): Promise<User[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Filter out users that already have friend requests
    return mockUsers.filter(user => {
      if (user.id === userId) return false;
      
      const hasRequest = this.friendRequests.some(
        req => (req.from === userId && req.to === user.id) ||
               (req.from === user.id && req.to === userId)
      );
      
      return !hasRequest;
    });
  }

  async createServer(name: string, ownerId: string): Promise<Server> {
    const newServer: Server = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      ownerId,
      members: [ownerId],
      channels: []
    };
    
    this.servers.push(newServer);
    return newServer;
  }

  async getServers(userId: string): Promise<Server[]> {
    return this.servers.filter(server => server.members.includes(userId));
  }

  async createChannel(serverId: string, name: string, type: Channel['type']): Promise<Channel> {
    const server = this.servers.find(s => s.id === serverId);
    if (!server) throw new Error('Server not found');

    const newChannel: Channel = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      type,
      serverId
    };

    server.channels.push(newChannel);
    return newChannel;
  }

  async deleteChannel(serverId: string, channelId: string): Promise<void> {
    const server = this.servers.find(s => s.id === serverId);
    if (!server) throw new Error('Server not found');

    const channelIndex = server.channels.findIndex(c => c.id === channelId);
    if (channelIndex === -1) throw new Error('Channel not found');

    server.channels.splice(channelIndex, 1);
  }

  async addFriend(userId: string, friendId: string): Promise<void> {
    // Get or initialize friends arrays
    const userFriends = this.friends.get(userId) || [];
    const friendFriends = this.friends.get(friendId) || [];

    // Add to both users' friend lists
    this.friends.set(userId, [...userFriends, friendId]);
    this.friends.set(friendId, [...friendFriends, userId]);
  }

  async getFriends(userId: string): Promise<User[]> {
    const friendIds = this.friends.get(userId) || [];
    return this.users.filter(user => friendIds.includes(user.id));
  }

  async getOnlineFriends(userId: string): Promise<User[]> {
    const friends = await this.getFriends(userId);
    return friends.filter(friend => friend.status === 'online');
  }

  async getChannels(serverId: string): Promise<Channel[]> {
    const server = this.servers.find(s => s.id === serverId);
    if (!server) return [];
    return server.channels;
  }

  async getServer(serverId: string): Promise<Server | null> {
    return this.servers.find(s => s.id === serverId) || null;
  }

  async getChannelMessages(channelId: string): Promise<Message[]> {
    return this.messages.get(channelId) || [];
  }

  async addMessage(channelId: string, content: string, authorId: string): Promise<Message> {
    const message: Message = {
      id: Math.random().toString(36).substr(2, 9),
      content,
      authorId,
      channelId,
      timestamp: new Date()
    };

    const channelMessages = this.messages.get(channelId) || [];
    this.messages.set(channelId, [...channelMessages, message]);
    return message;
  }

  async deleteServer(serverId: string): Promise<void> {
    const serverIndex = this.servers.findIndex(s => s.id === serverId);
    if (serverIndex === -1) throw new Error('Server not found');
    
    // Remove all messages from server channels
    const server = this.servers[serverIndex];
    server.channels.forEach(channel => {
      this.messages.delete(channel.id);
    });
    
    // Remove the server
    this.servers.splice(serverIndex, 1);
  }

  async updateServer(serverId: string, updates: Partial<Server>): Promise<Server> {
    const server = this.servers.find(s => s.id === serverId);
    if (!server) throw new Error('Server not found');

    Object.assign(server, updates);
    return server;
  }

  async generateInviteCode(serverId: string): Promise<string> {
    // Generate a random invite code
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    return code;
  }

  async joinServer(inviteCode: string, userId: string): Promise<Server> {
    // In a real app, you'd validate the invite code
    // For demo, just join the first server that isn't joined
    const server = this.servers.find(s => !s.members.includes(userId));
    if (!server) throw new Error('No server found');

    server.members.push(userId);
    return server;
  }
}

export const database = DatabaseService.getInstance(); 