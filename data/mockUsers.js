export const currentUser = {
  id: 'me',
  displayName: 'You',
  username: 'you.live',
  mood: 'chill',
  status: 'lofi and shipping features',
  visibility: 'Visible to nearby',
  uploadStatus: 'Metadata only',
  nowPlaying: {
    id: 't-me-1',
    title: 'Sunset Lover',
    artist: 'Petit Biscuit',
    album: 'Presence',
    artworkGradient: '#38bdf8, #6366f1, #1e293b',
    progress: 64,
    currentTime: '2:41',
    duration: '4:13',
    isPlaying: true,
    isUploaded: false,
  },
};

export const nearbyListeners = [
  { id: '1', displayName: 'Maya Rahimi', username: 'maya.wav', avatar: 'MW', avatarGradient: '#1ed760, #39d0ff', distance: '120m away', note: 'coding at cafe', mood: 'focused', live: true, lastActive: 'now', nowPlaying: { id: 't1', title: '505', artist: 'Arctic Monkeys', artworkGradient: '#f97316, #ec4899, #312e81', progress: 41, currentTime: '1:46', duration: '4:13', isUploaded: true } },
  { id: '2', displayName: 'Noah Nouri', username: 'noah.exe', avatar: 'NX', avatarGradient: '#39d0ff, #8b5cf6', distance: '240m away', note: 'late night walk', mood: 'dreamy', live: true, lastActive: '2m ago', nowPlaying: { id: 't2', title: 'Midnight City', artist: 'M83', artworkGradient: '#22d3ee, #2563eb, #0f172a', progress: 74, currentTime: '2:58', duration: '4:03', isUploaded: false } },
  { id: '3', displayName: 'Luna Faraji', username: 'luna.fm', avatar: 'LF', avatarGradient: '#ff3df2, #1ed760', distance: 'Nearby', note: 'thinking in neon', mood: 'soft', live: false, lastActive: '8m ago', nowPlaying: { id: 't3', title: 'Nights', artist: 'Frank Ocean', artworkGradient: '#a855f7, #f43f5e, #020617', progress: 19, currentTime: '1:02', duration: '5:07', isUploaded: false } },
  { id: '4', displayName: 'Kai Daryaei', username: 'kai.lofi', avatar: 'KL', avatarGradient: '#facc15, #fb7185', distance: '2.4km away', note: 'waiting for friends', mood: 'warm', live: true, lastActive: 'now', nowPlaying: { id: 't4', title: 'Glue Song', artist: 'beabadoobee', artworkGradient: '#14532d, #1ed760, #0f172a', progress: 61, currentTime: '2:04', duration: '3:19', isUploaded: true } },
];

export const sortedNearbyListeners = [...nearbyListeners];

export const trendingTracks = nearbyListeners.map((l, i) => ({
  id: `tr-${i}`,
  title: l.nowPlaying.title,
  artist: l.nowPlaying.artist,
  artworkGradient: l.nowPlaying.artworkGradient,
  isUploaded: l.nowPlaying.isUploaded,
  saves: 20 + i * 7,
}));

export const sharedTracks = [
  { id: 's1', title: 'After Dark', artist: 'Mr.Kitty', artworkGradient: '#0f172a, #7c3aed, #38bdf8', isUploaded: true, length: '4:18', sharedBy: '@iris.sync' },
  { id: 's2', title: 'Borderline', artist: 'Tame Impala', artworkGradient: '#18181b, #16a34a, #bef264', isUploaded: true, length: '3:57', sharedBy: '@devon.bass' },
];

export const playlists = [
  { id: 'p1', title: 'Night Drive', description: 'Synth + city lights', trackCount: 18, gradient: '#1e1b4b, #0ea5e9' },
  { id: 'p2', title: 'Cafe Coding', description: 'Focus without stress', trackCount: 26, gradient: '#14532d, #65a30d' },
  { id: 'p3', title: 'Soft Hours', description: 'Warm and emotional', trackCount: 14, gradient: '#7e22ce, #fb7185' },
];

export const liveStats = [
  { label: 'nearby listeners', value: '28' },
  { label: 'songs pulsing', value: '16' },
  { label: 'closest beat', value: '120m' },
];

export function getListenerById(id) {
  return nearbyListeners.find((x) => x.id === String(id)) || nearbyListeners[0];
}
