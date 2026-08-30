import { User, Conversation, Message, SpotifyTrack } from '@/types';

// Helper to generate ISO string offset by minutes
const offsetTime = (minutesAgo: number): string => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - minutesAgo);
  return d.toISOString();
};

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    fullName: 'John Doe',
    userName: 'john',
    email: 'john@example.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    status: 'online',
    bio: 'Senior UX Designer. Building the future of messaging.'
  },
  {
    id: 'u2',
    fullName: 'Sarah Smith',
    userName: 'sarah',
    email: 'sarah@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    status: 'offline',
    bio: 'Product Manager. Coffee enthusiast & design thinker.'
  },
  {
    id: 'u3',
    fullName: 'Michael Chen',
    userName: 'mike',
    email: 'michael.chen@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    status: 'online',
    bio: 'Lead Engineer. Coding is my superpower.'
  },
  {
    id: 'u4',
    fullName: 'Emma Wilson',
    userName: 'emma',
    email: 'emma.wilson@example.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80',
    status: 'away',
    bio: 'QA Engineer. Making sure everything is pixel perfect.'
  },
  {
    id: 'u5',
    fullName: 'David Brown',
    userName: 'david',
    email: 'david.b@example.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    status: 'offline',
    bio: 'Product Marketing. Telling stories that matter.'
  },
  // Current user
  {
    id: 'currentUser',
    fullName: 'Alex Johnson',
    userName: 'alexj',
    email: 'alex.johnson@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
    status: 'online',
    bio: 'Frontend Engineer. React & Next.js specialist.'
  }
];

export const MOCK_MESSAGES: Record<string, Message[]> = {
  'c1': [
    {
      id: 'm1_1',
      conversationId: 'c1',
      senderId: 'u1',
      senderName: 'John Doe',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      content: 'Hey Alex! Are you free for a quick chat today?',
      type: 'text',
      timestamp: offsetTime(120),
      reactions: [{ emoji: '👍', userIds: ['currentUser'] }]
    },
    {
      id: 'm1_2',
      conversationId: 'c1',
      senderId: 'currentUser',
      senderName: 'Alex Johnson',
      senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
      content: "Hey John! Yeah, I'm free. What's on your mind?",
      type: 'text',
      timestamp: offsetTime(118)
    },
    {
      id: 'm1_3',
      conversationId: 'c1',
      senderId: 'u1',
      senderName: 'John Doe',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      content: 'I wanted to share the design concept for the new messaging screen.',
      type: 'text',
      timestamp: offsetTime(115)
    },
    {
      id: 'm1_4',
      conversationId: 'c1',
      senderId: 'u1',
      senderName: 'John Doe',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      content: 'Here is the draft. Take a look and let me know your thoughts.',
      type: 'text',
      timestamp: offsetTime(114)
    },
    {
      id: 'm1_5',
      conversationId: 'c1',
      senderId: 'u1',
      senderName: 'John Doe',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      content: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      type: 'image',
      timestamp: offsetTime(114),
      fileMetadata: {
        name: 'design-draft.jpg',
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
        size: 1542000,
        type: 'image/jpeg'
      }
    },
    {
      id: 'm1_6',
      conversationId: 'c1',
      senderId: 'currentUser',
      senderName: 'Alex Johnson',
      senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
      content: 'Wow, this looks extremely clean! I love the modern visual hierarchy.',
      type: 'text',
      timestamp: offsetTime(110),
      replyToId: 'm1_5',
      replyToMessage: {
        senderName: 'John Doe',
        content: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
        type: 'image'
      },
      reactions: [{ emoji: '❤️', userIds: ['u1'] }]
    },
    {
      id: 'm1_7',
      conversationId: 'c1',
      senderId: 'u1',
      senderName: 'John Doe',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      content: 'I also listened to this song while designing it. Thought you might like it!',
      type: 'text',
      timestamp: offsetTime(105)
    },
    {
      id: 'm1_9',
      conversationId: 'c1',
      senderId: 'currentUser',
      senderName: 'Alex Johnson',
      senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
      content: '🔥',
      type: 'emoji',
      timestamp: offsetTime(100)
    },
    {
      id: 'm1_10',
      conversationId: 'c1',
      senderId: 'u1',
      senderName: 'John Doe',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      content: 'Hey, are you free for a call now to align on this?',
      type: 'text',
      timestamp: offsetTime(2)
    }
  ],
  'c2': [
    {
      id: 'm2_1',
      conversationId: 'c2',
      senderId: 'u2',
      senderName: 'Sarah Smith',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      content: 'Did you review the product roadmap for Q4 yet?',
      type: 'text',
      timestamp: offsetTime(1440)
    },
    {
      id: 'm2_2',
      conversationId: 'c2',
      senderId: 'currentUser',
      senderName: 'Alex Johnson',
      senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
      content: 'Yes, I added some comments on the technical milestones.',
      type: 'text',
      timestamp: offsetTime(1430)
    },
    {
      id: 'm2_3',
      conversationId: 'c2',
      senderId: 'u2',
      senderName: 'Sarah Smith',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      content: 'Perfect, thank you! I will look through them.',
      type: 'text',
      timestamp: offsetTime(1420)
    },
    {
      id: 'm2_4',
      conversationId: 'c2',
      senderId: 'u2',
      senderName: 'Sarah Smith',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      content: 'Roadmap draft file is attached.',
      type: 'text',
      timestamp: offsetTime(1415)
    },
    {
      id: 'm2_5',
      conversationId: 'c2',
      senderId: 'u2',
      senderName: 'Sarah Smith',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      content: 'roadmap_v2.pdf',
      type: 'file',
      timestamp: offsetTime(1415),
      fileMetadata: {
        name: 'roadmap_v2.pdf',
        url: '#',
        size: 2400000,
        type: 'application/pdf'
      }
    },
    {
      id: 'm2_6',
      conversationId: 'c2',
      senderId: 'u2',
      senderName: 'Sarah Smith',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      content: 'See you tomorrow at the sprint planning.',
      type: 'text',
      timestamp: offsetTime(5)
    }
  ],
  'c3': [
    {
      id: 'm3_1',
      conversationId: 'c3',
      senderId: 'u1',
      senderName: 'John Doe',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      content: 'Hey design team, has anyone started on the new styleguide?',
      type: 'text',
      timestamp: offsetTime(600)
    },
    {
      id: 'm3_2',
      conversationId: 'c3',
      senderId: 'u2',
      senderName: 'Sarah Smith',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      content: 'I created a Figma template. Let me share it here.',
      type: 'text',
      timestamp: offsetTime(590)
    },
    {
      id: 'm3_3',
      conversationId: 'c3',
      senderId: 'u2',
      senderName: 'Sarah Smith',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      content: 'figma_design_guide.fig',
      type: 'file',
      timestamp: offsetTime(589),
      fileMetadata: {
        name: 'figma_design_guide.fig',
        url: '#',
        size: 8900000,
        type: 'application/octet-stream'
      }
    },
    {
      id: 'm3_4',
      conversationId: 'c3',
      senderId: 'currentUser',
      senderName: 'Alex Johnson',
      senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
      content: 'Checking it out now. The grid configuration is solid.',
      type: 'text',
      timestamp: offsetTime(500),
      reactions: [{ emoji: '🙌', userIds: ['u2', 'u1'] }]
    },
    {
      id: 'm3_5',
      conversationId: 'c3',
      senderId: 'u2',
      senderName: 'Sarah Smith',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      content: 'New design system assets are ready!',
      type: 'text',
      timestamp: offsetTime(10)
    }
  ],
  'c4': [
    {
      id: 'm4_1',
      conversationId: 'c4',
      senderId: 'u3',
      senderName: 'Michael Chen',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      content: 'We are deploying the API v2 to staging.',
      type: 'text',
      timestamp: offsetTime(1200)
    },
    {
      id: 'm4_2',
      conversationId: 'c4',
      senderId: 'u3',
      senderName: 'Michael Chen',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      content: 'Tests passed successfully.',
      type: 'text',
      timestamp: offsetTime(1190)
    },
    {
      id: 'm4_3',
      conversationId: 'c4',
      senderId: 'currentUser',
      senderName: 'Alex Johnson',
      senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
      content: 'Awesome. I will check the frontend integration.',
      type: 'text',
      timestamp: offsetTime(1100)
    },
    {
      id: 'm4_4',
      conversationId: 'c4',
      senderId: 'u3',
      senderName: 'Michael Chen',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      content: 'API deployment completed',
      type: 'text',
      timestamp: offsetTime(300),
      reactions: [{ emoji: '🎉', userIds: ['currentUser', 'u4'] }]
    }
  ],
  'c5': [
    {
      id: 'm5_1',
      conversationId: 'c5',
      senderId: 'currentUser',
      senderName: 'Alex Johnson',
      senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
      content: 'We need to finalise the launch dates.',
      type: 'text',
      timestamp: offsetTime(3000)
    },
    {
      id: 'm5_2',
      conversationId: 'c5',
      senderId: 'u2',
      senderName: 'Sarah Smith',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      content: 'I will prepare the presentation slides and schedule a meeting.',
      type: 'text',
      timestamp: offsetTime(2900)
    }
  ]
};

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    name: 'John Doe',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    type: 'direct',
    members: ['currentUser', 'u1'],
    unreadCount: 0,
    isPinned: true,
    isMuted: false,
    isArchived: false,
    lastMessage: MOCK_MESSAGES['c1'][MOCK_MESSAGES['c1'].length - 1],
    isTyping: []
  },
  {
    id: 'c2',
    name: 'Sarah Smith',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    type: 'direct',
    members: ['currentUser', 'u2'],
    unreadCount: 2,
    isPinned: false,
    isMuted: false,
    isArchived: false,
    lastMessage: MOCK_MESSAGES['c2'][MOCK_MESSAGES['c2'].length - 1],
    isTyping: []
  },
  {
    id: 'c3',
    name: 'Design Team',
    avatar: undefined, // Will generate letter initials dynamic avatar
    type: 'group',
    members: ['currentUser', 'u1', 'u2', 'u4'],
    adminId: 'u2',
    unreadCount: 0,
    isPinned: true,
    isMuted: false,
    isArchived: false,
    lastMessage: MOCK_MESSAGES['c3'][MOCK_MESSAGES['c3'].length - 1],
    isTyping: []
  },
  {
    id: 'c4',
    name: 'Backend Team',
    avatar: undefined,
    type: 'group',
    members: ['currentUser', 'u3', 'u4'],
    adminId: 'u3',
    unreadCount: 0,
    isPinned: false,
    isMuted: true,
    isArchived: false,
    lastMessage: MOCK_MESSAGES['c4'][MOCK_MESSAGES['c4'].length - 1],
    isTyping: []
  },
  {
    id: 'c5',
    name: 'Product Team',
    avatar: undefined,
    type: 'group',
    members: ['currentUser', 'u2', 'u3', 'u5'],
    adminId: 'u2',
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
    isArchived: false,
    lastMessage: MOCK_MESSAGES['c5'][MOCK_MESSAGES['c5'].length - 1],
    isTyping: []
  }
];

export const MOCK_SPOTIFY_SONGS: SpotifyTrack[] = [
  {
    id: '4PTG3Z6ehGkBFm5zWwSpR4',
    name: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    albumArt: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&auto=format&fit=crop&q=80',
    url: 'https://open.spotify.com/track/4PTG3Z6ehGkBFm5zWwSpR4',
    durationMs: 200000
  },
  {
    id: '7ouMYWpwJ422j7q7v62v5e',
    name: 'Starboy',
    artist: 'The Weeknd, Daft Punk',
    album: 'Starboy',
    albumArt: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=300&auto=format&fit=crop&q=80',
    url: 'https://open.spotify.com/track/7ouMYWpwJ422j7q7v62v5e',
    durationMs: 230000
  },
  {
    id: '0VjIjW4GlUZC72ZCmscT7P',
    name: 'Sweater Weather',
    artist: 'The Neighbourhood',
    album: 'I Love You.',
    albumArt: 'https://images.unsplash.com/photo-1446057032654-9d8885db76c6?w=300&auto=format&fit=crop&q=80',
    url: 'https://open.spotify.com/track/0VjIjW4GlUZC72ZCmscT7P',
    durationMs: 240000
  },
  {
    id: '15ttbS95GleZt1A8S18b2f',
    name: 'Stay',
    artist: 'The Kid LAROI, Justin Bieber',
    album: 'F*CK LOVE 3: OVER YOU',
    albumArt: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80',
    url: 'https://open.spotify.com/track/15ttbS95GleZt1A8S18b2f',
    durationMs: 140000
  }
];
