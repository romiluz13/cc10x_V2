# Dimension 4: User Experience & Human Factors

## Overview

Technical correctness isn't enough - systems must work for real humans with diverse needs, devices, and contexts. Analyze UX from multiple human perspectives.

## Analysis Questions

### User Expectations
- **Visibility:** What does the user SEE when this happens?
- **Feedback:** What confirmation does the user get?
- **Wait times:** How long before user assumes it's broken?
- **Navigation:** What happens if user navigates away mid-operation?
- **Errors:** Are error messages understandable to non-technical users?

### Accessibility (a11y)
- **Screen readers:** Does this work with NVDA, JAWS, VoiceOver?
- **Keyboard navigation:** Can keyboard-only users operate this?
- **Visual indicators:** Is color the ONLY indicator of state?
- **Focus management:** Is focus handled correctly?
- **ARIA labels:** Are interactive elements labeled?

### Internationalization (i18n)
- **Languages:** Does this work in different languages?
- **Timezones:** Are dates/times handled correctly across zones?
- **Number formats:** `1,000.00` (US) vs `1.000,00` (EU)?
- **Text direction:** Does RTL (Arabic, Hebrew) work?
- **Cultural conventions:** Are icons/colors culturally appropriate?

### Device & Environment
- **Devices:** Mobile? Tablet? Desktop? Watch?
- **Screen sizes:** Responsive? Touch-friendly?
- **Connection:** Works on slow 3G? Offline?
- **Browsers:** Chrome, Firefox, Safari, Edge?
- **OS versions:** Works on older versions?

## Critical UX Issues

### Issue 1: No Loading State

**Situation:** User clicks button, nothing happens for 3 seconds.

**Problems:**
- User doesn't know if click registered
- User clicks again (duplicate requests)
- User assumes app is broken
- Poor perceived performance

**Solution:**
```javascript
// BEFORE (no feedback):
<button onClick={handleSubmit}>Submit</button>

// AFTER (clear feedback):
<button
  onClick={handleSubmit}
  disabled={isLoading}
>
  {isLoading ? (
    <>
      <Spinner />
      <span>Submitting...</span>
    </>
  ) : (
    'Submit'
  )}
</button>

// Show progress for long operations:
{isLoading && (
  <ProgressBar
    value={progress}
    message="Processing 127 of 500 items..."
  />
)}
```

### Issue 2: Cryptic Error Messages

**Situation:** Error: `ERR_INVALID_TOKEN_0x4A3B`

**Problems:**
- User has no idea what this means
- User can't fix the problem
- User blames themselves
- Support burden increases

**Solution:**
```javascript
// BEFORE (technical):
throw new Error('ERR_INVALID_TOKEN_0x4A3B');

// AFTER (user-friendly):
throw new UserFacingError(
  'Your session has expired. Please log in again.',
  {
    action: 'Login',
    actionUrl: '/login',
    technicalDetails: 'ERR_INVALID_TOKEN_0x4A3B'  // For support/logs
  }
);

// Display:
<ErrorMessage>
  <h3>Your session has expired</h3>
  <p>For your security, you've been logged out. Please log in again.</p>
  <Button onClick={redirectToLogin}>Log In</Button>
  <details>
    <summary>Technical details</summary>
    <code>ERR_INVALID_TOKEN_0x4A3B</code>
  </details>
</ErrorMessage>
```

### Issue 3: Lost Data on Navigation

**Situation:** User fills long form, accidentally hits back button, all data lost.

**Problems:**
- Frustrating user experience
- Users abandon task
- Duplicate submissions if they restart

**Solution:**
```javascript
// Save draft automatically:
useEffect(() => {
  const autosave = setInterval(() => {
    if (formData.isDirty) {
      localStorage.setItem('form_draft', JSON.stringify(formData));
    }
  }, 5000);

  return () => clearInterval(autosave);
}, [formData]);

// Restore draft on mount:
useEffect(() => {
  const draft = localStorage.getItem('form_draft');
  if (draft) {
    const restore = confirm('Restore unsaved changes?');
    if (restore) {
      setFormData(JSON.parse(draft));
    }
  }
}, []);

// Warn before navigation:
useEffect(() => {
  const handleBeforeUnload = (e) => {
    if (formData.isDirty) {
      e.preventDefault();
      e.returnValue = 'You have unsaved changes. Leave anyway?';
      return e.returnValue;
    }
  };

  window.addEventListener('beforeunload', handleBeforeUnload);
  return () => window.removeEventListener('beforeunload', handleBeforeUnload);
}, [formData.isDirty]);
```

### Issue 4: Inaccessible Interactive Elements

**Situation:** Button implemented as `<div onClick={...}>` instead of `<button>`.

**Problems:**
- Keyboard users can't activate (no Tab focus)
- Screen readers don't announce as button
- No Enter/Space key activation
- Missing ARIA role/label

**Solution:**
```jsx
// BEFORE (inaccessible):
<div onClick={handleClick} className="button-styled">
  Submit
</div>

// AFTER (accessible):
<button
  onClick={handleClick}
  aria-label="Submit registration form"
  disabled={isLoading}
>
  Submit
</button>

// For custom components:
<CustomButton
  role="button"
  tabIndex={0}
  aria-label="Submit registration form"
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }}
>
  Submit
</CustomButton>
```

## Accessibility Checklist (WCAG 2.1 AA)

### Perceivable
- [ ] **Text alternatives:** All images have alt text
- [ ] **Captions:** Videos have captions/transcripts
- [ ] **Color contrast:** At least 4.5:1 for text, 3:1 for large text
- [ ] **Color not sole indicator:** Don't rely only on color (add icons/text)
- [ ] **Resizable text:** Text can be resized 200% without breaking layout
- [ ] **Images of text:** Avoid when possible, use actual text

### Operable
- [ ] **Keyboard accessible:** All functionality via keyboard
- [ ] **No keyboard trap:** Can Tab out of all elements
- [ ] **Skip links:** "Skip to main content" link at top
- [ ] **Timing adjustable:** Can extend time limits
- [ ] **Pause/stop:** Can pause auto-playing content
- [ ] **Focus visible:** Clear focus indicators on all interactive elements
- [ ] **Multiple ways:** Multiple ways to find pages (nav, search, sitemap)

### Understandable
- [ ] **Language declared:** `<html lang="en">`
- [ ] **Predictable navigation:** Consistent navigation across pages
- [ ] **Labels:** All form inputs have associated labels
- [ ] **Error identification:** Errors clearly identified and described
- [ ] **Error suggestions:** Provide suggestions for fixing errors

### Robust
- [ ] **Valid HTML:** Passes HTML validator
- [ ] **ARIA:** Proper ARIA roles, states, properties
- [ ] **Name, Role, Value:** All components expose these to assistive tech

## Internationalization Checklist

### Text & Language
- [ ] **All text translatable:** No hardcoded strings
- [ ] **Locale-aware:** Date, time, number formatting uses locale
- [ ] **RTL support:** Layout works right-to-left
- [ ] **Character encoding:** UTF-8 throughout
- [ ] **String concatenation:** Avoid (different word orders in different languages)
- [ ] **Pluralization:** Handle different plural rules (English has 2, Polish has 5)

### Dates & Times
- [ ] **Timezone storage:** Store in UTC, display in user's timezone
- [ ] **Timezone display:** Show which timezone is displayed
- [ ] **Date formatting:** Use locale-specific format (MM/DD vs DD/MM)
- [ ] **DST handling:** Account for daylight saving transitions

**Example:**
```javascript
// BEFORE (US-centric):
const dateStr = `${month}/${day}/${year}`;  // MM/DD/YYYY

// AFTER (locale-aware):
const dateStr = new Intl.DateTimeFormat(userLocale, {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
}).format(date);

// Store in UTC:
await db.events.create({
  timestamp: date.toISOString(),  // "2025-10-27T14:30:00Z"
  timezone: userTimezone           // "America/New_York"
});

// Display in user's timezone:
const userDate = new Date(event.timestamp);
const display = userDate.toLocaleString(userLocale, {
  timeZone: userTimezone,
  dateStyle: 'full',
  timeStyle: 'short'
});
// "Monday, October 27, 2025 at 10:30 AM"
```

### Numbers & Currency
```javascript
// BEFORE (hardcoded):
const price = `$${amount.toFixed(2)}`;  // "$1,234.56"

// AFTER (locale-aware):
const price = new Intl.NumberFormat(userLocale, {
  style: 'currency',
  currency: userCurrency
}).format(amount);

// Examples:
// en-US: $1,234.56
// de-DE: 1.234,56 €
// ja-JP: ¥1,235 (no decimals)
```

## Device-Specific Considerations

### Mobile
- [ ] **Touch targets:** Min 44x44px
- [ ] **Scrollable:** No horizontal scroll
- [ ] **Readable:** Text min 16px
- [ ] **Network-aware:** Handle slow/offline
- [ ] **Battery-aware:** Minimize background activity
- [ ] **Orientation:** Works in portrait and landscape

### Desktop
- [ ] **Keyboard shortcuts:** Power-user features
- [ ] **Multi-window:** Handles multiple tabs/windows
- [ ] **Large screens:** Utilizes space well
- [ ] **Copy/paste:** Standard keyboard shortcuts work

### Tablet
- [ ] **Hybrid input:** Both touch and keyboard
- [ ] **Multitasking:** Split-screen support
- [ ] **External keyboard:** Works with attached keyboard

## Performance from UX Perspective

### Perceived Performance
- [ ] **Instant feedback:** Show loading state immediately
- [ ] **Skeleton screens:** Show layout while loading
- [ ] **Progressive loading:** Show content as it arrives
- [ ] **Optimistic updates:** Update UI before server confirms
- [ ] **Background sync:** Queue operations for later

**Example:**
```javascript
// Optimistic update:
function likePost(postId) {
  // Update UI immediately:
  setLikeCount(prev => prev + 1);
  setIsLiked(true);

  // Sync with server:
  api.likePost(postId).catch(error => {
    // Rollback on error:
    setLikeCount(prev => prev - 1);
    setIsLiked(false);
    showError('Failed to like post');
  });
}
```

### Offline Experience
```javascript
// Service worker for offline support:
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}

// Cache-first strategy:
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// Background sync for actions:
navigator.serviceWorker.ready.then(reg => {
  reg.sync.register('send-messages');
});

// UI indication:
const [isOnline, setIsOnline] = useState(navigator.onLine);

useEffect(() => {
  const handleOnline = () => setIsOnline(true);
  const handleOffline = () => setIsOnline(false);

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}, []);

{!isOnline && (
  <Banner type="warning">
    You're offline. Changes will sync when you reconnect.
  </Banner>
)}
```

## User Testing Scenarios

Test with real users representing:

### Personas
- [ ] **Novice user:** First time, needs guidance
- [ ] **Power user:** Wants keyboard shortcuts, efficiency
- [ ] **Mobile user:** On phone, possibly distracted
- [ ] **Accessibility user:** Uses screen reader, keyboard only
- [ ] **International user:** Different language, timezone, number formats
- [ ] **Low-bandwidth user:** Slow connection, limited data
- [ ] **Older adult:** May have difficulty with small text, low contrast

### Stress Scenarios
- [ ] **Interrupted:** User switches apps mid-task
- [ ] **Slow device:** Low-end phone or old computer
- [ ] **Slow connection:** 3G or slower
- [ ] **Noisy environment:** Can't hear audio
- [ ] **Bright sunlight:** Can't see low-contrast text
- [ ] **Multitasking:** User doing other things simultaneously

---

**Key Principle:** Design for humans, not ideal users. Test with real people in real conditions.
