import { Tabs } from 'expo-router';
import { LayoutDashboard, Ticket, FilePlus, User } from 'lucide-react-native';

export default function CustomerLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          color: '#1f2937',
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size} />,
          headerTitle: 'PowerLink Dashboard',
        }}
      />
      <Tabs.Screen
        name="ticket"
        options={{
          title: 'Tickets',
          tabBarIcon: ({ color, size }) => <Ticket color={color} size={size} />,
          headerTitle: 'My Support Tickets',
        }}
      />
      <Tabs.Screen
        name="request-service"
        options={{
          title: 'Request',
          tabBarIcon: ({ color, size }) => <FilePlus color={color} size={size} />,
          headerTitle: 'Request New Service',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
          headerTitle: 'My Account',
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          href: null, // Hidden from tabs but accessible via navigation
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
