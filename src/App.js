import React, { useState, useEffect } from 'react';
import './App.css';
import EventForm from './components/events/EventForm';
import EventList from './components/events/EventList';
import CalenderView from './components/calender/CalenderView';
import ReminderManager from './components/reminder/ReminderManager';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';



function App() {
  const [user, setUser] = useState(null);
  const [authView, setAuthView] = useState('login'); // 'login' or 'signup'
  const [events, setEvents] = useState([]);
  const [view, setView] = useState('calendar'); // 'calendar', 'list', or 'form'
  const [editingEvent, setEditingEvent] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // Load user from session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('calendar_current_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Load events for the current user
  useEffect(() => {
    if (user) {
      const savedEvents = localStorage.getItem(`calendar_events_${user.id}`);
      if (savedEvents) {
        setEvents(JSON.parse(savedEvents));
      } else {
        setEvents([]);
      }
    }
  }, [user]);

  // Save events for the current user
  useEffect(() => {
    if (user) {
      localStorage.setItem(`calendar_events_${user.id}`, JSON.stringify(events));
    }
  }, [events, user]);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('calendar_current_user', JSON.stringify(userData));
    showNotification(`Welcome back, ${userData.fullName || userData.username}!`);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('calendar_current_user');
    setEvents([]);
    setView('calendar');
  };

  const showNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const addEvent = (event) => {
    setEvents([...events, { ...event, id: Date.now().toString(), completed: false }]);
    showNotification('Event is added successfully!');
    setView('list');
  };

  const updateEvent = (updatedEvent) => {
    setEvents(events.map(ev => ev.id === updatedEvent.id ? updatedEvent : ev));
    setEditingEvent(null);
    showNotification('Event updated successfully!');
  };

  const completeEvent = (id) => {
    setEvents(prevEvents => prevEvents.map(ev =>
      ev.id === id ? { ...ev, completed: true } : ev
    ));
  };

  const deleteEvent = (id) => {
    setEvents(events.filter(ev => ev.id !== id));
    showNotification('Event deleted.', 'completed');
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setView('form');
  };

  if (!user) {
    return (
      <div className="App">
        {authView === 'login' ? (
          <Login onLogin={handleLogin} onSwitchToSignup={() => setAuthView('signup')} />
        ) : (
          <Signup onSignup={handleLogin} onSwitchToLogin={() => setAuthView('login')} />
        )}
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-left">
          <h1>Calendar Pro</h1>
          <span className="user-badge">Hello, {user.fullName || user.username}</span>
        </div>
        <nav>
          <button onClick={() => setView('calendar')}>Calendar</button>
          <button onClick={() => setView('list')}>Events</button>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </nav>
      </header>

      <main className="container main-content-full">
        {view === 'form' && (
          <EventForm
            onSubmit={editingEvent ? updateEvent : addEvent}
            initialData={editingEvent}
            onCancel={() => setView('calendar')}
          />
        )}
        {view === 'calendar' && (
          <CalenderView events={events} onEdit={handleEdit} onDelete={deleteEvent} />
        )}
        {view === 'list' && (
          <EventList
            events={events}
            onEdit={handleEdit}
            onDelete={deleteEvent}
            onComplete={completeEvent}
            onAdd={() => { setEditingEvent(null); setView('form'); }}
          />
        )}
      </main>

      <div className="notification-container">
        {notifications.map(n => (
          <div key={n.id} className={`notification ${n.type}`}>
            {n.message}
          </div>
        ))}
      </div>

      <ReminderManager
        events={events}
        onComplete={completeEvent}
        notify={showNotification}
      />
    </div>
  );
}

export default App;
