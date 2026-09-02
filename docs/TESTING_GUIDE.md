# Reddit Monitor Testing Guide

## 🧪 How to Test the Reddit Narrative Intelligence Module

### Prerequisites
- SaakshAI running locally (`npm run dev`)
- Gemini API key configured in `.env.local`
- Internet connection for Reddit API access

---

## ✅ Test Scenarios

### **Test 1: Basic Subreddit Monitoring**

**Objective:** Verify fetching and analyzing posts from a subreddit

**Steps:**
1. Navigate to the **Reddit Monitor** tab
2. Enter: `technology` in the Subreddit field
3. Leave Keyword empty
4. Click **Start Monitoring**

**Expected Result:**
- Status changes: idle → fetching → analyzing → completed
- ~10-20 posts displayed in table
- All posts have scores (credibility, fake risk, threat level)
- Posts are sortable by different metrics

**Success Criteria:**
- ✅ Posts load without errors
- ✅ Each post has analysis data
- ✅ Table is interactive

---

### **Test 2: Keyword Search**

**Objective:** Search across Reddit for specific topics

**Steps:**
1. Navigate to **Reddit Monitor** tab
2. Leave Subreddit empty
3. Enter: `artificial intelligence` in Keyword field
4. Click **Start Monitoring**

**Expected Result:**
- Posts from various subreddits related to AI
- Mixed content types
- Analysis completed successfully

**Success Criteria:**
- ✅ Search returns relevant results
- ✅ Multiple subreddits represented
- ✅ All posts analyzed

---

### **Test 3: Combined Search (Subreddit + Keyword)**

**Objective:** Search within a specific subreddit

**Steps:**
1. Enter: `worldnews` in Subreddit
2. Enter: `climate` in Keyword
3. Click **Start Monitoring**

**Expected Result:**
- Only posts from r/worldnews
- Only climate-related content
- Focused, relevant results

**Success Criteria:**
- ✅ Correct subreddit filtering
- ✅ Keyword relevance
- ✅ Analysis accuracy

---

### **Test 4: Narrative Cluster Detection**

**Objective:** Trigger narrative alert banner

**Steps:**
1. Choose a controversial subreddit (e.g., `conspiracy`, `politics`)
2. Leave Keyword empty or use a hot topic
3. Click **Start Monitoring**

**Expected Result:**
- If multiple posts have fake risk >60%:
  - **Narrative Alert Banner** appears
  - Shows cluster details (# of posts, avg risk)
  - Banner is visually prominent (red/orange)

**Success Criteria:**
- ✅ Cluster detection works
- ✅ Alert displays correctly
- ✅ Statistics are accurate

**Note:** Some subreddits may not trigger clusters if content is low-risk

---

### **Test 5: Post Detail View**

**Objective:** Verify modal detail view functionality

**Steps:**
1. Complete any monitoring task (Tests 1-3)
2. Click on any post in the results table

**Expected Result:**
- Modal opens with post details
- Displays:
  - 4 score cards (credibility, fake risk, virality, threat)
  - Emotional radar chart
  - Linguistic risks (if any)
  - Top comments (if available)
  - Link to Reddit post
- Close button (X) works

**Success Criteria:**
- ✅ Modal opens/closes smoothly
- ✅ All data displays correctly
- ✅ Charts render properly
- ✅ Reddit link is clickable

---

### **Test 6: Sorting Functionality**

**Objective:** Test table sorting

**Steps:**
1. Complete any monitoring task
2. Use the "Sort by" dropdown
3. Try each option:
   - Fake Risk
   - Credibility
   - Virality

**Expected Result:**
- Table reorders immediately
- Highest values appear at top (or lowest for credibility)
- No page reload

**Success Criteria:**
- ✅ All sort options work
- ✅ Order is correct
- ✅ No glitches

---

### **Test 7: Error Handling**

**Objective:** Test error states

**Steps:**
1. Try invalid subreddit: `thisdoesnotexist123456`
2. Try empty search (no subreddit, no keyword)
3. Test during network issues (disable wifi briefly)

**Expected Result:**
- Error message displays
- User-friendly error text
- Can retry without refresh

**Success Criteria:**
- ✅ Errors caught gracefully
- ✅ Clear error messages
- ✅ App doesn't crash

---

### **Test 8: Performance & Caching**

**Objective:** Verify caching works

**Steps:**
1. Monitor: `technology` subreddit
2. Note the time it takes
3. Immediately search again: `technology`
4. Compare speed

**Expected Result:**
- Second search is **much faster**
- Results are identical (cached)
- No unnecessary API calls

**Success Criteria:**
- ✅ Cache hit on repeat search
- ✅ Speed improvement noticeable
- ✅ Data consistency

---

### **Test 9: Progress Tracking**

**Objective:** Verify progress indicator during analysis

**Steps:**
1. Monitor a subreddit with many posts
2. Watch the "Analyzing" status

**Expected Result:**
- Button shows: "Analyzing (5/20)..." "Analyzing (10/20)..."
- Progress updates in real-time
- Button is disabled during processing

**Success Criteria:**
- ✅ Progress counter updates
- ✅ Accurate counts
- ✅ Button states correct

---

### **Test 10: Tab Switching**

**Objective:** Test navigation between tabs

**Steps:**
1. Start on **Intelligence** tab
2. Switch to **Reddit Monitor**
3. Switch back to **Intelligence**
4. Test manual analysis

**Expected Result:**
- Tabs switch smoothly
- State preserved appropriately
- No layout issues

**Success Criteria:**
- ✅ Tab navigation works
- ✅ Both tabs functional
- ✅ No visual glitches

---

## 🐛 Common Issues & Solutions

### Issue 1: "No posts found"
**Possible Causes:**
- Subreddit name misspelled
- Subreddit doesn't exist
- Subreddit is private/banned
- Keyword too specific

**Solution:**
- Verify subreddit exists
- Try different keyword
- Use more general terms

---

### Issue 2: "Reddit API error: 429"
**Cause:** Rate limited by Reddit

**Solution:**
- Wait 1-2 minutes
- Retry search
- Reduce batch size (future update)

---

### Issue 3: Analysis takes too long
**Causes:**
- Many posts to analyze
- Slow Gemini API response
- Network issues

**Solution:**
- Wait patiently (can take 1-2 minutes for 20 posts)
- Reduce search scope
- Check internet connection

---

### Issue 4: Modal not opening
**Cause:** React state issue or click handler

**Solution:**
- Refresh page
- Try different browser
- Report bug with console errors

---

### Issue 5: Emotional radar chart not rendering
**Cause:** Recharts library issue

**Solution:**
- Check browser console for errors
- Verify Recharts is installed
- Try different browser

---

## 📊 Expected Metrics

### **Typical Credibility Scores:**
- **High-quality sources**: 70-95%
- **Mixed content**: 40-70%
- **Suspicious content**: 10-40%

### **Typical Fake Risk Scores:**
- **Trustworthy**: 5-25%
- **Questionable**: 25-50%
- **High risk**: 50-75%
- **Very high risk**: 75-100%

### **Threat Levels:**
- **Low**: Minor issues, mostly safe
- **Medium**: Some concerns, needs context
- **High**: Significant red flags
- **Critical**: Severe misinformation likely

---

## 🎯 Recommended Test Subreddits

### **Low Risk (Baseline Testing):**
- `r/science` - Peer-reviewed content
- `r/askscience` - Fact-based discussions
- `r/dataisbeautiful` - Data-driven posts

### **Medium Risk (Variety Testing):**
- `r/technology` - Mixed tech news
- `r/worldnews` - Global current events
- `r/todayilearned` - Factual claims

### **High Risk (Stress Testing):**
- `r/conspiracy` - Unverified theories
- `r/unpopularopinion` - Controversial takes
- `r/politics` - Polarized discussions

**Note:** High-risk subreddits are more likely to trigger narrative alerts

---

## 📝 Test Report Template

After testing, document your findings:

```markdown
## Reddit Monitor Test Report

**Date:** [DATE]
**Tester:** [YOUR NAME]
**Browser:** [Chrome/Firefox/Safari/Edge]
**Platform:** [Mac/Windows/Linux]

### Test Results:

| Test | Status | Notes |
|------|--------|-------|
| Basic Subreddit Monitoring | ✅/❌ | |
| Keyword Search | ✅/❌ | |
| Combined Search | ✅/❌ | |
| Narrative Cluster Detection | ✅/❌ | |
| Post Detail View | ✅/❌ | |
| Sorting Functionality | ✅/❌ | |
| Error Handling | ✅/❌ | |
| Performance & Caching | ✅/❌ | |
| Progress Tracking | ✅/❌ | |
| Tab Switching | ✅/❌ | |

### Bugs Found:
1. [Description]
2. [Description]

### Suggestions:
1. [Improvement idea]
2. [Improvement idea]

### Overall Rating: [1-10]
```

---

## 🚀 Advanced Testing

### **Load Testing:**
Try monitoring large subreddits:
- `r/AskReddit` (100M+ members)
- `r/funny` (50M+ members)
- `r/gaming` (40M+ members)

### **Edge Cases:**
- Empty subreddits
- Subreddits with only images
- Deleted/removed posts
- Non-English content

### **UI Testing:**
- Mobile responsiveness (resize browser)
- Dark mode compatibility (already default)
- Different screen sizes
- Accessibility (keyboard navigation)

---

## ✅ Ready to Deploy?

Before considering the feature production-ready:

- [ ] All 10 tests pass
- [ ] No critical bugs
- [ ] Performance is acceptable (<30s for 20 posts)
- [ ] UI is polished
- [ ] Error handling is robust
- [ ] Documentation is complete
- [ ] Cache works reliably
- [ ] Narrative detection is accurate

---

**Happy Testing! 🧪**

If you find issues, document them and either fix or create issues in the repository.
