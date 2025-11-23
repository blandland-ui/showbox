# BlackSiteDB Video Player Integration

## 🎬 **New Video Player Features**

Your movie site now includes a comprehensive video player that integrates with multiple streaming embed services!

### ✅ **What's New:**

1. **Multi-Server Support** - 6 different embed services with automatic fallback
2. **Smart Linking** - All movie/TV cards now link directly to the player
3. **TMDb Integration** - Fetches movie/TV data automatically
4. **Language Options** - Multiple subtitle language support
5. **Responsive Design** - Works on all device sizes

---

## 🔗 **Supported Embed Services**

| Service | Domain | Status | Notes |
|---------|--------|--------|-------|
| VidSrc Embed | vidsrc-embed.ru | ✅ Live | Primary service |
| VidSrc ME | vidsrcme.ru | ✅ Live | Alternative |
| VidSrc Alt | vidsrc-me.ru | ✅ Live | Alternative |
| VSrc | vsrc.su | ✅ Live | No autoplay param |
| VidSrc SU | vidsrc-embed.su | ✅ Live | International |
| VidSrc ME SU | vidsrcme.su | ✅ Live | International |

---

## 🎯 **How It Works**

### **1. User Experience:**
- Click any movie/TV card → Automatically opens player
- Select from multiple servers if one doesn't work
- Choose subtitle language
- Toggle autoplay on/off

### **2. URL Structure:**
```
player.html?tmdb=123456&type=movie
player.html?tmdb=789012&type=tv
player.html?imdb=tt1234567&type=movie
```

### **3. Embed URL Generation:**
The player automatically generates embed URLs like:
```
https://vidsrc-embed.ru/embed/movie?tmdb=385687&ds_lang=en&autoplay=1
https://vidsrc-embed.ru/embed/tv?tmdb=1399&ds_lang=es
```

---

## 🛠️ **Technical Implementation**

### **Updated Files:**
- `player.html` - Complete rewrite with modern embed system
- `assets/js/app.js` - Added player linking to homepage cards
- `pages/movies.html` - Added player linking
- `featured-movies-blacksitedb.html` - Updated click handlers
- `featured-tv-blacksitedb.html` - Updated click handlers

### **Key Features:**
- **VideoPlayer Class** - Modern ES6+ class structure
- **Multi-server Support** - Easy switching between services
- **Error Handling** - Graceful fallbacks if servers fail
- **TMDb Integration** - Fetches metadata automatically
- **Responsive iframes** - Mobile-friendly player

---

## 🎨 **Player Interface**

### **Movie/TV Information:**
- Title and year
- Plot summary
- Movie poster
- Type indicator (Movie/TV)

### **Server Selection:**
- 6 server buttons with live status
- Active server highlighting
- One-click server switching

### **Player Controls:**
- Language selection (9 languages)
- Autoplay toggle
- Fullscreen support
- Mobile-responsive

---

## 📱 **Mobile Optimization**

- **Responsive Design** - Works on phones/tablets
- **Touch-friendly** - Large tap targets
- **Optimized iframes** - Proper mobile dimensions
- **Flexible Layout** - Adapts to screen size

---

## 🔧 **Customization Options**

### **Add New Servers:**
Edit `player.html` and add to the `servers` array:
```javascript
{ name: 'New Server', domain: 'newserver.com', active: true }
```

### **Modify Languages:**
Update the language select options in `player.html`:
```html
<option value="zh">Chinese</option>
<option value="ar">Arabic</option>
```

### **Change Default Server:**
Modify the `currentServer` property:
```javascript
this.currentServer = 'your-preferred-server.com';
```

---

## 🎬 **Usage Examples**

### **Direct Links:**
- `player.html?tmdb=550&type=movie` (Fight Club)
- `player.html?tmdb=1399&type=tv` (Game of Thrones)
- `player.html?imdb=tt0111161&type=movie` (Shawshank Redemption)

### **With Options:**
- `player.html?tmdb=550&type=movie&lang=es` (Spanish subs)
- `player.html?tmdb=1399&type=tv&autoplay=0` (No autoplay)

---

## 🚨 **Troubleshooting**

### **If Player Doesn't Load:**
1. Try different servers using the server buttons
2. Check browser console for errors
3. Verify TMDb ID is correct
4. Some content may not be available on all servers

### **Common Issues:**
- **"Failed to load"** - Try another server
- **"No movie ID"** - Check URL parameters
- **Black screen** - Server may be down, switch servers

---

## 🔒 **Legal Notice**

This player integrates with third-party embed services. Users are responsible for ensuring they comply with their local laws and the terms of service of the streaming services they access.

---

## 🎉 **Benefits of New System**

✅ **For Users:**
- One-click movie/TV watching
- Multiple server options
- Mobile-friendly experience
- Fast loading times

✅ **For Developers:**
- Clean, maintainable code
- Easy to add new servers
- Error handling and fallbacks
- Modern JavaScript architecture

---

*BlackSiteDB Player v2.0 - Stream Smarter, Not Harder* 🎬