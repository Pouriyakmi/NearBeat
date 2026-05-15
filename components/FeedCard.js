import NearbyListenerItem from './NearbyListenerItem';

export default function FeedCard({ listener, index = 0 }) {
  return <NearbyListenerItem listener={listener} index={index} />;
}
