
import { useEffect } from 'react';

const ReminderManager = ({ events, onComplete, notify }) => {
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
            const currentDate = now.toISOString().split('T')[0];

            events.forEach(event => {
                if (event.completed) return;

                // Reminder for start time
                if (event.date === currentDate && event.startTime === currentTime) {
                    if (!window[`alerted_start_${event.id}`]) {
                        notify(`REMINDER: ${event.title} is starting now!`);
                        window[`alerted_start_${event.id}`] = true;
                    }
                }

                // Check for completion (end time passed)
                // Note: Simplified logic assumes events are on the same day for comparison
                if (event.date === currentDate && currentTime >= event.endTime) {
                    if (!event.completed) {
                        onComplete(event.id);
                        notify(`Event "${event.title}" has ended and marked as completed.`, 'completed');
                    }
                } else if (currentDate > event.date) {
                    // Also mark past dates as completed
                    if (!event.completed) {
                        onComplete(event.id);
                    }
                }
            });
        }, 30000); // Check every 30 seconds

        return () => clearInterval(interval);
    }, [events, onComplete, notify]);

    return null; // Side-effect only component
};

export default ReminderManager;
