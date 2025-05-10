# Offline Mode for Receptionist

This feature allows receptionists to continue working even when the internet connection is unavailable. Data entered during offline mode will be stored locally and automatically synchronized with the server when the connection is restored.

## How It Works

1. **Automatic Detection**: The system automatically detects if you're online or offline.
2. **Offline Storage**: When offline, all data operations are stored in a local database on your device.
3. **Background Sync**: When internet connection is restored, the system automatically tries to sync your offline changes.
4. **Conflict Resolution**: If there are conflicts between offline and online data, the system will handle them automatically.

## Using Offline Mode

### Sync Status Indicator

A sync status indicator appears in the dashboard showing:
- Online/Offline status
- Number of pending changes
- Last sync time
- Sync button for manual synchronization

### Working Offline

1. If your internet connection is lost, the system will automatically switch to offline mode.
2. Continue using the application as normal - register patients, create memos, record expenses, etc.
3. Data will be stored locally on your device.
4. The sync indicator will show "Offline Mode".

### Syncing When Back Online

1. When your internet connection is restored, the system will automatically switch to online mode.
2. The system will attempt to synchronize pending changes automatically.
3. You can also click the "Sync Now" button to manually trigger synchronization.
4. The sync indicator will show the number of pending changes until all data is synchronized.

## Limitations of Offline Mode

1. You cannot access new data created by other users while offline.
2. Some advanced features might be limited or unavailable during offline mode.
3. Large file uploads may be queued until reconnection.
4. If the same record is modified by multiple users during offline periods, the system will apply conflict resolution rules during synchronization.

## Best Practices

1. Manually sync before going offline (if you know you'll be disconnected).
2. Check the sync status indicator to verify all changes are synchronized.
3. For critical operations, verify you're online before proceeding.
4. Regularly check for pending changes to ensure all data has been properly synchronized.

## Troubleshooting

If you experience issues with offline mode:

1. **Sync Fails**: Try manually clicking the "Sync Now" button again.
2. **Data Not Appearing**: Check the sync status indicator for pending changes.
3. **Application Errors**: Refresh the page and try again.
4. **Persistent Issues**: Contact IT support with details about what you were doing when the issue occurred. 